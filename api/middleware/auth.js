const jwt = require('jsonwebtoken');
const env = require('../config/env');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token de acceso requerido' });
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function verifyRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol_id)) {
      return res.status(403).json({ error: 'No tiene permisos para esta acción' });
    }
    next();
  };
}

module.exports = { verifyToken, verifyRole };