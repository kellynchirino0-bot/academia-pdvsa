function checkTrialStatus(req, res, next) {
  if (req.user.rol_id !== 3) return next();
  const { storage } = req;
  const usuario = storage.usuarios.find(u => u.id === req.user.id);
  if (!usuario) return next();
  if (usuario.membresia_extendida) return next();
  if (usuario.estado === 'BLOCKED') {
    return res.status(403).json({ error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.', trial_expired: true });
  }
  if (usuario.trial_end) {
    const now = new Date();
    const trialEnd = new Date(usuario.trial_end);
    if (now > trialEnd && usuario.estado !== 'TRIAL_EXPIRED') {
      usuario.estado = 'TRIAL_EXPIRED';
    }
    if (usuario.estado === 'TRIAL_EXPIRED') {
      return res.status(403).json({
        error: 'Tu período de prueba de 30 días ha finalizado. Contacta al administrador para extender tu acceso.',
        trial_expired: true,
        trial_end: usuario.trial_end,
        membresia_extendida: usuario.membresia_extendida
      });
    }
  }
  next();
}

module.exports = { checkTrialStatus };