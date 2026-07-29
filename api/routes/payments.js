const { storage, getNextId, persistAfterMutation } = require('../storage/memory-store');
const { createNotification } = require('../utils/notifications');
const { verifyToken, verifyRole } = require('../middleware/auth');

function setup(app) {
  app.post('/api/payments/reportar', verifyToken, (req, res) => {
    try {
      const { metodo, referencia, monto, plan_solicitado, comprobante_url } = req.body;
      if (!metodo || !referencia) return res.status(400).json({ error: 'Método y referencia requeridos' });
      const usuario = storage.usuarios.find(u => u.id === req.user.id);
      const usuarioNombre = usuario?.nombre_completo || 'Usuario';
      const pago = {
        id: getNextId(storage.pagos), usuario_id: req.user.id, usuario_nombre: usuarioNombre,
        metodo, referencia, monto: monto || (plan_solicitado === 'b2b_enterprise' ? 2500 : 450),
        moneda: metodo === 'binance' ? 'USDT' : 'USD',
        plan_solicitado: plan_solicitado || 'vip_diplomado',
        comprobante_url: comprobante_url || '', estado: 'pendiente_verificacion',
        creado_en: new Date().toISOString()
      };
      storage.pagos.push(pago);
      persistAfterMutation();
      const admins = storage.usuarios.filter(u => u.rol_id === 1);
      const planNombre = plan_solicitado?.replace(/_/g, ' ') || 'VIP';
      admins.forEach(a => createNotification(a.id, 'pago', 'Nuevo Pago Pendiente',
        `${usuarioNombre} reportó pago para plan ${planNombre} (${metodo}). Referencia: ${referencia}.`));
      res.status(201).json({ exito: true, pago, mensaje: 'Pago reportado. Pendiente de verificación.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/payments', verifyToken, verifyRole(1), (req, res) => {
    res.json(storage.pagos.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)));
  });

  app.post('/api/admin/payments/aprobar', verifyToken, verifyRole(1), (req, res) => {
    try {
      const { pago_id, plan_asignado } = req.body;
      const pago = storage.pagos.find(p => p.id === pago_id);
      if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
      pago.estado = 'aprobado';
      pago.aprobado_por = req.user.id;
      pago.aprobado_en = new Date().toISOString();
      const usuario = storage.usuarios.find(u => u.id === pago.usuario_id);
      if (usuario) usuario.plan_suscripcion = plan_asignado || pago.plan_solicitado || 'vip_diplomado';
      persistAfterMutation();
      createNotification(pago.usuario_id, 'exito', 'Acceso VIP Activado',
        `Tu plan ${plan_asignado || pago.plan_solicitado || 'VIP'} ha sido activado.`);
      createNotification(req.user.id, 'sistema', 'Pago Aprobado',
        `Aprobaste pago de ${usuario?.nombre_completo} para plan ${plan_asignado || pago.plan_solicitado || 'VIP'}.`);
      res.json({ exito: true, pago, usuario_actualizado: usuario?.nombre_completo, nuevo_plan: usuario?.plan_suscripcion });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/payments/rechazar', verifyToken, verifyRole(1), (req, res) => {
    try {
      const { pago_id } = req.body;
      const pago = storage.pagos.find(p => p.id === pago_id);
      if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
      pago.estado = 'rechazado';
      pago.rechazado_por = req.user.id;
      pago.rechazado_en = new Date().toISOString();
      persistAfterMutation();
      createNotification(pago.usuario_id, 'error', 'Pago Rechazado',
        `Tu pago (ref: ${pago.referencia}) ha sido rechazado. Contacta a administración.`);
      res.json({ exito: true, pago });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

module.exports = { setup };