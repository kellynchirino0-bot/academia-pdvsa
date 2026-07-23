const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memoryStorage } = require('../database/connection');
const { verifyToken } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        const usuario = memoryStorage.usuarios.find(u => u.correo === correo);
        
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return res.status(401).json({ error: 'Usuario desactivado' });
        }

        const validPassword = await bcrypt.compare(password, usuario.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const rol = memoryStorage.roles.find(r => r.id === usuario.rol_id);
        const token = jwt.sign(
            { 
                id: usuario.id, 
                cedula: usuario.cedula, 
                correo: usuario.correo,
                rol_id: usuario.rol_id,
                nombre_rol: rol?.nombre_rol 
            },
            process.env.JWT_SECRET || 'nasser_group_pdvsa_academia_virtual_2024_secret_key',
            { expiresIn: '24h' }
        );

        // Actualizar último acceso
        usuario.ultimo_acceso = new Date().toISOString();

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: usuario.id,
                cedula: usuario.cedula,
                nombre_completo: usuario.nombre_completo,
                cargo: usuario.cargo,
                correo: usuario.correo,
                rol: rol?.nombre_rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const { cedula, nombre_completo, cargo, correo, password } = req.body;

        if (!cedula || !nombre_completo || !correo || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const existeUsuario = memoryStorage.usuarios.find(
            u => u.cedula === cedula || u.correo === correo
        );

        if (existeUsuario) {
            return res.status(400).json({ error: 'El usuario o correo ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const nuevoUsuario = {
            id: memoryStorage.usuarios.length + 1,
            cedula,
            nombre_completo,
            cargo: cargo || 'Participante PDVSA',
            correo,
            password_hash: hashedPassword,
            rol_id: 3, // Participante por defecto
            activo: true,
            creado_en: new Date().toISOString()
        };

        memoryStorage.usuarios.push(nuevoUsuario);

        const token = jwt.sign(
            { 
                id: nuevoUsuario.id, 
                cedula: nuevoUsuario.cedula, 
                correo: nuevoUsuario.correo,
                rol_id: 3,
                nombre_rol: 'participante'
            },
            process.env.JWT_SECRET || 'nasser_group_pdvsa_academia_virtual_2024_secret_key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: nuevoUsuario.id,
                cedula: nuevoUsuario.cedula,
                nombre_completo: nuevoUsuario.nombre_completo,
                correo: nuevoUsuario.correo,
                rol: 'participante'
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Verificar token
router.get('/verify', verifyToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Cambiar contraseña
router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const usuario = memoryStorage.usuarios.find(u => u.id === req.user.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(currentPassword, usuario.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        usuario.password_hash = await bcrypt.hash(newPassword, 10);
        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
