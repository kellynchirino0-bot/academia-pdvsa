const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Obtener todos los usuarios (Admin e Instructor)
router.get('/', verifyToken, verifyRole(1, 2), (req, res) => {
    const usuarios = memoryStorage.usuarios.map(u => {
        const rol = memoryStorage.roles.find(r => r.id === u.rol_id);
        return {
            id: u.id,
            cedula: u.cedula,
            nombre_completo: u.nombre_completo,
            cargo: u.cargo,
            correo: u.correo,
            rol: rol?.nombre_rol,
            activo: u.activo,
            ultimo_acceso: u.ultimo_acceso,
            creado_en: u.creado_en
        };
    });
    res.json(usuarios);
});

// Obtener usuario por ID
router.get('/:id', verifyToken, (req, res) => {
    const usuario = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rol = memoryStorage.roles.find(r => r.id === usuario.rol_id);
    res.json({
        id: usuario.id,
        cedula: usuario.cedula,
        nombre_completo: usuario.nombre_completo,
        cargo: usuario.cargo,
        correo: usuario.correo,
        rol: rol?.nombre_rol,
        activo: usuario.activo,
        creado_en: usuario.creado_en
    });
});

// Actualizar usuario
router.put('/:id', verifyToken, verifyRole(1), async (req, res) => {
    const usuario = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre_completo, cargo, correo, rol_id, activo } = req.body;
    
    if (nombre_completo) usuario.nombre_completo = nombre_completo;
    if (cargo) usuario.cargo = cargo;
    if (correo) usuario.correo = correo;
    if (rol_id) usuario.rol_id = rol_id;
    if (activo !== undefined) usuario.activo = activo;

    const rol = memoryStorage.roles.find(r => r.id === usuario.rol_id);
    res.json({
        message: 'Usuario actualizado exitosamente',
        user: {
            id: usuario.id,
            cedula: usuario.cedula,
            nombre_completo: usuario.nombre_completo,
            cargo: usuario.cargo,
            correo: usuario.correo,
            rol: rol?.nombre_rol,
            activo: usuario.activo
        }
    });
});

// Crear usuario (Admin)
router.post('/', verifyToken, verifyRole(1), async (req, res) => {
    try {
        const { cedula, nombre_completo, cargo, correo, password, rol_id } = req.body;

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
            rol_id: rol_id || 3,
            activo: true,
            creado_en: new Date().toISOString()
        };

        memoryStorage.usuarios.push(nuevoUsuario);

        const rol = memoryStorage.roles.find(r => r.id === nuevoUsuario.rol_id);
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: nuevoUsuario.id,
                cedula: nuevoUsuario.cedula,
                nombre_completo: nuevoUsuario.nombre_completo,
                correo: nuevoUsuario.correo,
                rol: rol?.nombre_rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar usuario
router.delete('/:id', verifyToken, verifyRole(1), (req, res) => {
    const usuarioIndex = memoryStorage.usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (usuarioIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    memoryStorage.usuarios.splice(usuarioIndex, 1);
    res.json({ message: 'Usuario eliminado exitosamente' });
});

module.exports = router;
