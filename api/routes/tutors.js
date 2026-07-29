const { storage, getNextId } = require('../storage/memory-store');
const { verifyToken, verifyRole } = require('../middleware/auth');

function setup(app) {
  app.get('/api/tutors/estudiantes', verifyToken, verifyRole(1, 2), (req, res) => {
    const asignaciones = storage.asignaciones_tutores.filter(a => a.tutor_id === req.user.id || req.user.rol_id === 1);
    const estudiantes = asignaciones.map(a => {
      const usuario = storage.usuarios.find(u => u.id === a.estudiante_id);
      if (!usuario) return null;
      return {
        id: usuario.id, nombre_completo: usuario.nombre_completo,
        correo: usuario.correo, cargo: usuario.cargo,
        empresa_filial: usuario.empresa_filial,
        fecha_asignacion: a.fecha_asignacion, activa: a.activa
      };
    }).filter(Boolean);
    res.json(estudiantes);
  });

  app.post('/api/tutors/asignar', verifyToken, verifyRole(1, 2), (req, res) => {
    const { estudiante_id } = req.body;
    if (!estudiante_id) return res.status(400).json({ error: 'estudiante_id es requerido' });
    const exists = storage.asignaciones_tutores.find(a => a.tutor_id === req.user.id && a.estudiante_id === estudiante_id);
    if (exists) return res.status(400).json({ error: 'Estudiante ya asignado' });
    storage.asignaciones_tutores.push({
      id: getNextId(storage.asignaciones_tutores),
      tutor_id: req.user.id, estudiante_id,
      fecha_asignacion: new Date().toISOString(), activa: true
    });
    res.json({ message: 'Estudiante asignado exitosamente' });
  });

  app.post('/api/tutors/retroalimentacion', verifyToken, verifyRole(1, 2), (req, res) => {
    const { estudiante_id, mensaje, tipo } = req.body;
    if (!estudiante_id || !mensaje) return res.status(400).json({ error: 'estudiante_id y mensaje son requeridos' });
    storage.retroalimentacion.push({
      id: getNextId(storage.retroalimentacion),
      tutor_id: req.user.id, estudiante_id, mensaje, tipo: tipo || 'general',
      created_at: new Date().toISOString()
    });
    res.json({ message: 'Retroalimentación registrada exitosamente' });
  });

  app.get('/api/tutors/retroalimentacion/:estudianteId', verifyToken, verifyRole(1, 2), (req, res) => {
    const eid = parseInt(req.params.estudianteId);
    const items = storage.retroalimentacion
      .filter(r => r.estudiante_id === eid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(items);
  });
}

module.exports = { setup };