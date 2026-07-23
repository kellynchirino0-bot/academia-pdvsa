const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Obtener todos los leads (Solo Admin)
router.get('/', verifyToken, verifyRole(1), (req, res) => {
    const { estado, busqueda } = req.query;
    let leads = [...memoryStorage.leads];

    if (estado) {
        leads = leads.filter(l => l.estado === estado);
    }

    if (busqueda) {
        const term = busqueda.toLowerCase();
        leads = leads.filter(l =>
            l.nombre_completo.toLowerCase().includes(term) ||
            l.email.toLowerCase().includes(term) ||
            l.empresa_filial?.toLowerCase().includes(term)
        );
    }

    leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(leads);
});

// Obtener estadísticas de leads (Solo Admin)
router.get('/stats', verifyToken, verifyRole(1), (req, res) => {
    const leads = memoryStorage.leads;
    const total = leads.length;
    const nuevos = leads.filter(l => l.estado === 'nuevo').length;
    const contactados = leads.filter(l => l.estado === 'contactado').length;
    const inscritos = leads.filter(l => l.estado === 'inscrito').length;
    const rechazados = leads.filter(l => l.estado === 'rechazado').length;
    const tasaConversion = total > 0 ? ((inscritos / total) * 100).toFixed(1) : 0;

    const porEmpresa = {};
    leads.forEach(l => {
        const emp = l.empresa_filial || 'Sin especificar';
        porEmpresa[emp] = (porEmpresa[emp] || 0) + 1;
    });

    const porOrigen = {};
    leads.forEach(l => {
        const orig = l.origen_registro || 'desconocido';
        porOrigen[orig] = (porOrigen[orig] || 0) + 1;
    });

    res.json({
        total, nuevos, contactados, inscritos, rechazados,
        tasaConversion: parseFloat(tasaConversion),
        porEmpresa, porOrigen
    });
});

// Crear lead (Público - formulario de contacto)
router.post('/', (req, res) => {
    try {
        const { nombre_completo, email, telefono, empresa_filial, cargo, origen_registro } = req.body;

        if (!nombre_completo || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const existeLead = memoryStorage.leads.find(l => l.email === email);
        if (existeLead) {
            return res.status(400).json({ error: 'Este email ya está registrado como lead' });
        }

        const nuevoLead = {
            id: memoryStorage.leads.length + 1,
            nombre_completo,
            email,
            telefono: telefono || '',
            empresa_filial: empresa_filial || '',
            cargo: cargo || '',
            estado: 'nuevo',
            origen_registro: origen_registro || 'sitio_web',
            notas_admin: '',
            usuario_creado_id: null,
            created_at: new Date().toISOString()
        };

        memoryStorage.leads.push(nuevoLead);
        res.status(201).json({ message: 'Lead registrado exitosamente', lead: nuevoLead });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar lead (Solo Admin)
router.put('/:id', verifyToken, verifyRole(1), (req, res) => {
    try {
        const lead = memoryStorage.leads.find(l => l.id === parseInt(req.params.id));
        if (!lead) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        const { estado, notas_admin, nombre_completo, email, telefono, empresa_filial, cargo } = req.body;

        if (estado) lead.estado = estado;
        if (notas_admin !== undefined) lead.notas_admin = notas_admin;
        if (nombre_completo) lead.nombre_completo = nombre_completo;
        if (email) lead.email = email;
        if (telefono) lead.telefono = telefono;
        if (empresa_filial) lead.empresa_filial = empresa_filial;
        if (cargo) lead.cargo = cargo;

        res.json({ message: 'Lead actualizado exitosamente', lead });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Convertir lead a estudiante (Solo Admin)
router.post('/:id/convertir', verifyToken, verifyRole(1), async (req, res) => {
    try {
        const lead = memoryStorage.leads.find(l => l.id === parseInt(req.params.id));
        if (!lead) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        if (lead.estado === 'inscrito' && lead.usuario_creado_id) {
            return res.status(400).json({ error: 'Este lead ya fue convertido en estudiante' });
        }

        const existeUsuario = memoryStorage.usuarios.find(u => u.correo === lead.email);
        if (existeUsuario) {
            return res.status(400).json({ error: 'Ya existe un usuario con este email' });
        }

        const cedula = `V-${Date.now().toString().slice(-8)}`;
        const passwordTemporal = 'PDVSA2024!';
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

        const nuevoUsuario = {
            id: memoryStorage.usuarios.length + 1,
            cedula,
            nombre_completo: lead.nombre_completo,
            cargo: lead.cargo,
            correo: lead.email,
            password_hash: hashedPassword,
            rol_id: 3,
            activo: true,
            telefono: lead.telefono,
            empresa_filial: lead.empresa_filial,
            ultimo_acceso: null,
            creado_en: new Date().toISOString()
        };

        memoryStorage.usuarios.push(nuevoUsuario);

        lead.estado = 'inscrito';
        lead.usuario_creado_id = nuevoUsuario.id;

        res.json({
            message: 'Lead convertido exitosamente en estudiante',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre_completo,
                correo: nuevoUsuario.correo,
                cedula: nuevoUsuario.cedula,
                password_temporal: passwordTemporal
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar lead (Solo Admin)
router.delete('/:id', verifyToken, verifyRole(1), (req, res) => {
    try {
        const leadIndex = memoryStorage.leads.findIndex(l => l.id === parseInt(req.params.id));
        if (leadIndex === -1) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        memoryStorage.leads.splice(leadIndex, 1);
        res.json({ message: 'Lead eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
