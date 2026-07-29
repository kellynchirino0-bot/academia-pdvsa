const { storage, getNextId, persistAfterMutation } = require('../storage/memory-store');
const { verifyToken, verifyRole } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

function setup(app) {
  app.get('/api/leads/stats', verifyToken, verifyRole(1, 2), (req, res) => {
    const leads = storage.leads;
    const hoy = new Date().toISOString().split('T')[0];
    const nuevos = leads.filter(l => l.estado === 'nuevo').length;
    const contactados = leads.filter(l => l.estado === 'contactado').length;
    const inscritos = leads.filter(l => l.estado === 'inscrito').length;
    const rechazados = leads.filter(l => l.estado === 'rechazado').length;
    const total = leads.length;
    const tasaConversion = total > 0 ? ((inscritos / total) * 100).toFixed(1) : 0;
    const nuevosHoy = leads.filter(l => l.created_at && l.created_at.startsWith(hoy)).length;
    res.json({ total, nuevos, contactados, inscritos, rechazados, tasaConversion: parseFloat(tasaConversion), nuevosHoy });
  });

  app.get('/api/leads/export', verifyToken, verifyRole(1), (req, res) => {
    const format = req.query.format || 'json';
    const leads = storage.leads;
    if (format === 'csv') {
      const headers = 'ID,Nombre,Email,Teléfono,Empresa,Cargo,Estado,Origen,Fecha Registro\n';
      const rows = leads.map(l => `${l.id},"${l.nombre_completo}","${l.email}","${l.telefono || ''}","${l.empresa_filial || ''}","${l.cargo || ''}","${l.estado}","${l.origen_registro || ''}","${l.created_at || ''}"`).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
      return res.send(headers + rows);
    }
    res.json(leads);
  });

  app.get('/api/leads', verifyToken, verifyRole(1, 2), (req, res) => {
    res.json(storage.leads);
  });

  app.post('/api/leads', (req, res) => {
    const { nombre_completo, email, telefono, empresa_filial, cargo, origen_registro } = req.body;
    if (!nombre_completo || !email) return res.status(400).json({ error: 'nombre_completo y email son requeridos' });
    const nuevoLead = {
      id: getNextId(storage.leads), nombre_completo, email, telefono: telefono || '',
      empresa_filial: empresa_filial || '', cargo: cargo || '',
      estado: 'nuevo', origen_registro: origen_registro || 'registro',
      notas_admin: '', usuario_creado_id: null, created_at: new Date().toISOString()
    };
    storage.leads.push(nuevoLead);
    persistAfterMutation();
    res.status(201).json({ message: 'Lead creado exitosamente', lead: nuevoLead });
  });

  app.put('/api/leads/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    const lead = storage.leads.find(l => l.id === parseInt(req.params.id));
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
    const { estado, notas_admin } = req.body;
    if (estado) lead.estado = estado;
    if (notas_admin !== undefined) lead.notas_admin = notas_admin;
    res.json({ message: 'Lead actualizado exitosamente', lead });
  });

  app.delete('/api/leads/:id', verifyToken, verifyRole(1), (req, res) => {
    const idx = storage.leads.findIndex(l => l.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Lead no encontrado' });
    storage.leads.splice(idx, 1);
    persistAfterMutation();
    res.json({ message: 'Lead eliminado exitosamente' });
  });

  app.post('/api/leads/:id/convertir', verifyToken, verifyRole(1, 2), async (req, res) => {
    try {
      const lead = storage.leads.find(l => l.id === parseInt(req.params.id));
      if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
      const password = 'participante' + Math.floor(1000 + Math.random() * 9000);
      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevoUsuario = {
        id: getNextId(storage.usuarios), cedula: 'V-' + Math.floor(10000000 + Math.random() * 90000000),
        nombre_completo: lead.nombre_completo, cargo: lead.cargo, correo: lead.email,
        password_hash: hashedPassword, rol_id: 3, activo: true, telefono: lead.telefono,
        empresa_filial: lead.empresa_filial, creado_en: new Date().toISOString()
      };
      storage.usuarios.push(nuevoUsuario);
      lead.estado = 'inscrito';
      lead.usuario_creado_id = nuevoUsuario.id;
      res.json({ message: 'Lead convertido exitosamente', usuario: { ...nuevoUsuario, password_temporal: password } });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

module.exports = { setup };