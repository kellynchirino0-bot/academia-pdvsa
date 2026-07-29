const { Router } = require('express');
const { storage, getNextId, logAuditoria } = require('../storage/memory-store');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

const router = Router();

router.get('/users', verifyToken, verifyRole(1), (req, res) => {
  const usuarios = storage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: storage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial,
    ultimo_acceso: u.ultimo_acceso, creado_en: u.creado_en,
    estado: u.estado || 'ACTIVE',
    trial_start: u.trial_start, trial_end: u.trial_end,
    membresia_extendida: u.membresia_extendida || false,
    modulos_completados: u.modulos_completados || []
  }));
  res.json(usuarios);
});

router.get('/users/:id', verifyToken, (req, res) => {
  const requestedId = parseInt(req.params.id);
  if (req.user.rol_id !== 1 && req.user.id !== requestedId) {
    return res.status(403).json({ error: 'No autorizado para ver este perfil' });
  }
  const u = storage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: storage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial,
    estado: u.estado || 'ACTIVE',
    trial_start: u.trial_start, trial_end: u.trial_end,
    membresia_extendida: u.membresia_extendida || false,
    modulos_completados: u.modulos_completados || []
  });
});

router.get('/admin/users', verifyToken, verifyRole(1), (req, res) => {
  const { rol, estado, busqueda } = req.query;
  let usuarios = storage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: storage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial,
    estado: u.estado || 'ACTIVE',
    trial_start: u.trial_start, trial_end: u.trial_end,
    membresia_extendida: u.membresia_extendida || false,
    ultimo_acceso: u.ultimo_acceso, creado_en: u.creado_en
  }));
  if (rol) usuarios = usuarios.filter(u => u.rol_id === parseInt(rol));
  if (estado) usuarios = usuarios.filter(u => u.estado === estado);
  if (busqueda) {
    const term = busqueda.toLowerCase();
    usuarios = usuarios.filter(u =>
      u.nombre_completo?.toLowerCase().includes(term) ||
      u.correo?.toLowerCase().includes(term)
    );
  }
  res.json(usuarios);
});

router.put('/admin/users/:id/role', verifyToken, verifyRole(1), (req, res) => {
  const usuario = storage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { rol_id } = req.body;
  if (![1, 2, 3].includes(rol_id)) return res.status(400).json({ error: 'Rol inválido' });
  usuario.rol_id = rol_id;
  logAuditoria(req.user.id, 'cambio_rol', `Usuario ${usuario.id} rol cambiado a ${rol_id}`);
  res.json({ message: 'Rol actualizado exitosamente', usuario: { id: usuario.id, nombre_rol: storage.roles.find(r => r.id === rol_id)?.nombre_rol } });
});

router.put('/admin/users/:id/trial', verifyToken, verifyRole(1), (req, res) => {
  const usuario = storage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { extension_dias, membresia_extendida, estado } = req.body;
  if (extension_dias) {
    const currentEnd = usuario.trial_end ? new Date(usuario.trial_end) : new Date();
    currentEnd.setDate(currentEnd.getDate() + extension_dias);
    usuario.trial_end = currentEnd.toISOString();
    usuario.estado = 'ACTIVE';
  }
  if (membresia_extendida !== undefined) usuario.membresia_extendida = membresia_extendida;
  if (estado) usuario.estado = estado;
  logAuditoria(req.user.id, 'actualizar_trial', `Usuario ${usuario.id} trial actualizado`);
  res.json({ message: 'Trial actualizado exitosamente', usuario: { id: usuario.id, trial_end: usuario.trial_end, estado: usuario.estado, membresia_extendida: usuario.membresia_extendida } });
});

router.put('/admin/users/:id/status', verifyToken, verifyRole(1), (req, res) => {
  const usuario = storage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { activo } = req.body;
  usuario.activo = activo;
  if (!activo) usuario.estado = 'BLOCKED';
  else if (usuario.estado === 'BLOCKED') usuario.estado = 'ACTIVE';
  logAuditoria(req.user.id, 'cambiar_estado', `Usuario ${usuario.id} estado cambiado a ${activo ? 'activo' : 'bloqueado'}`);
  res.json({ message: 'Estado actualizado exitosamente' });
});

router.get('/admin/users/export', verifyToken, verifyRole(1), (req, res) => {
  const format = req.query.format || 'json';
  const usuarios = storage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre: u.nombre_completo, email: u.correo,
    rol: storage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    estado: u.estado, trial_fin: u.trial_end, membresia: u.membresia_extendida
  }));
  if (format === 'csv') {
    const headers = 'ID,Cedula,Nombre,Email,Rol,Estado,Trial Fin,Membresia\n';
    const rows = usuarios.map(u => `${u.id},"${u.cedula}","${u.nombre}","${u.email}","${u.rol}","${u.estado}","${u.trial_fin||''}","${u.membresia}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios_export.csv');
    return res.send(headers + rows);
  }
  res.json(usuarios);
});

module.exports = router;