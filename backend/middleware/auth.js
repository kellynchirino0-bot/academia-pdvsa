const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ error: 'Token de acceso requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nasser_group_pdvsa_academia_virtual_2024_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        
        if (!roles.includes(req.user.rol_id)) {
            return res.status(403).json({ error: 'No tiene permisos para esta acción' });
        }
        
        next();
    };
};

module.exports = { verifyToken, verifyRole };
