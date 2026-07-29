const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { storage, getNextId, persistAfterMutation, logAuditoria } = require('../storage/memory-store');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.post('/auth/login', async (req, res) => {
  try {
    const rawCorreo = (req.body.correo || '').toLowerCase().trim();
    const { password } = req.body;
    if (!rawCorreo || !password) return res.status(400).json({ error: 'Correo y contraseña son requeridos' });

    let usuario = storage.usuarios.find(u => u.correo.toLowerCase().trim() === rawCorreo);

    const FALLBACK_CREDENTIALS = {
      'admin@pdvsa.com': { password: 'admin123', rol_id: 1, nombre: 'Administrador VIP PDVSA' },
      'tutor@pdvsa.com': { password: 'tutor123', rol_id: 2, nombre: 'Tutor PDVSA' },
      'usuario@pdvsa.com': { password: 'user123', rol_id: 3, nombre: 'Usuario Estándar PDVSA' },
      'estudiante@pdvsa.com': { password: 'user123', rol_id: 3, nombre: 'Estudiante PDVSA' }
    };

    if (!usuario && FALLBACK_CREDENTIALS[rawCorreo]) {
      const fb = FALLBACK_CREDENTIALS[rawCorreo];
      if (password !== fb.password) return res.status(401).json({ error: 'Credenciales inválidas' });
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      usuario = {
        id: fb.rol_id === 1 ? 1 : getNextId(storage.usuarios),
        cedula: fb.rol_id === 1 ? 'V-00000001' : 'V-33333333',
        nombre_completo: fb.nombre,
        cargo: fb.rol_id === 1 ? 'Coordinador Académico VIP' : 'Participante',
        correo: rawCorreo,
        _plainPassword: password,
        password_hash: null,
        rol_id: fb.rol_id,
        activo: true,
        plan_suscripcion: fb.rol_id === 1 ? 'b2b_enterprise' : 'gratuito',
        estado: 'ACTIVE',
        trial_start: fb.rol_id === 3 ? now.toISOString() : null,
        trial_end: fb.rol_id === 3 ? trialEnd.toISOString() : null,
        membresia_extendida: false,
        progreso: {},
        modulos_completados: [],
        ultimo_acceso: null
      };
      storage.usuarios.push(usuario);
    }

    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!usuario.activo) return res.status(401).json({ error: 'Usuario desactivado' });

    let validPassword = false;
    if (usuario.password_hash) {
      validPassword = await bcrypt.compare(password, usuario.password_hash);
    } else if (usuario._plainPassword) {
      validPassword = (password === usuario._plainPassword);
      if (validPassword) {
        usuario.password_hash = await bcrypt.hash(password, 10);
        delete usuario._plainPassword;
      }
    }
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    const rol = storage.roles.find(r => r.id === usuario.rol_id);
    const token = jwt.sign(
      { id: usuario.id, cedula: usuario.correo, correo: usuario.correo, rol_id: usuario.rol_id, nombre_rol: rol?.nombre_rol, plan_suscripcion: usuario.plan_suscripcion },
      env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }
    );

    usuario.ultimo_acceso = new Date().toISOString();
    logAuditoria(usuario.id, 'login', 'Inicio de sesión exitoso');

    const trialInfo = usuario.rol_id === 3 ? {
      estado: usuario.estado || 'ACTIVE',
      trial_start: usuario.trial_start,
      trial_end: usuario.trial_end,
      membresia_extendida: usuario.membresia_extendida || false,
      dias_restantes: usuario.trial_end ? Math.max(0, Math.ceil((new Date(usuario.trial_end) - new Date()) / (1000 * 60 * 60 * 24))) : null
    } : null;

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: usuario.id, cedula: usuario.cedula, nombre_completo: usuario.nombre_completo, cargo: usuario.cargo, correo: usuario.correo, rol: rol?.nombre_rol, plan_suscripcion: usuario.plan_suscripcion },
      trial: trialInfo
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { cedula, nombre_completo, cargo, correo, password } = req.body;
    if (!cedula || !nombre_completo || !correo || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });

    if (storage.usuarios.find(u => u.cedula === cedula || u.correo === correo)) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      id: getNextId(storage.usuarios), cedula, nombre_completo,
      cargo: cargo || 'Participante PDVSA', correo,
      password_hash: hashedPassword, rol_id: 3, activo: true,
      telefono: '', empresa_filial: 'PDVSA Corp',
      creado_en: new Date().toISOString(),
      plan_suscripcion: 'gratuito',
      estado: 'ACTIVE',
      progreso: {},
      modulos_completados: [],
      ultimo_acceso: null
    };
    storage.usuarios.push(nuevoUsuario);
    persistAfterMutation();

    storage.leads.push({
      id: getNextId(storage.leads),
      nombre_completo, email: correo, telefono: '',
      empresa_filial: 'PDVSA Corp', cargo: cargo || 'Participante PDVSA',
      estado: 'nuevo', origen_registro: 'registro_web',
      notas_admin: '', usuario_creado_id: nuevoUsuario.id,
      created_at: new Date().toISOString()
    });
    persistAfterMutation();

    const token = jwt.sign(
      { id: nuevoUsuario.id, cedula, correo, rol_id: 3, nombre_rol: 'participante', plan_suscripcion: 'gratuito' },
      env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente', token,
      user: { id: nuevoUsuario.id, cedula, nombre_completo, correo, rol: 'participante', plan_suscripcion: 'gratuito' }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/auth/verify', verifyToken, (req, res) => {
  const usuario = storage.usuarios.find(u => u.id === req.user.id);
  const userData = { ...req.user, plan_suscripcion: usuario?.plan_suscripcion || 'gratuito' };
  res.json({ valid: true, user: userData });
});

router.post('/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuario = storage.usuarios.find(u => u.id === req.user.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(currentPassword, usuario.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    usuario.password_hash = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;