/**
 * Vercel Serverless Function — Academia Virtual Nasser Group PDVSA
 * Wraps the Express app as a serverless function
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'nasser_group_pdvsa_academia_virtual_2024_secret_key';

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===================== IN-MEMORY STORAGE =====================
const memoryStorage = {
  usuarios: [],
  roles: [
    { id: 1, nombre_rol: 'administrador', descripcion: 'Acceso total al sistema' },
    { id: 2, nombre_rol: 'tutor', descripcion: 'Gestión de cursos y seguimiento de estudiantes' },
    { id: 3, nombre_rol: 'participante', descripcion: 'Acceso a módulos y simuladores' }
  ],
  evaluaciones: [],
  notas: [],
  certificados: [],
  simulaciones: [],
  leads: [],
  modulos: [],
  lecciones: [],
  progresos: [],
  asignaciones_tutores: [],
  retroalimentacion: []
};

// ===================== SEED DATA (Synchronous for serverless) =====================
let dataReady = false;
const initializeSync = () => {
  if (memoryStorage.usuarios.length > 0) return;

  // Users (passwords hashed on first login attempt)
  const users = [
    { id: 1, cedula: 'V-00000000', nombre_completo: 'Administrador PDVSA', cargo: 'Coordinador Académico', correo: 'admin@nassergroup.com', password: 'admin123', rol_id: 1 },
    { id: 2, cedula: 'V-12345678', nombre_completo: 'Carlos Mendoza', cargo: 'Instructor Senior de IA', correo: 'tutor@nassergroup.com', password: 'tutor123', rol_id: 2 },
    { id: 3, cedula: 'V-20123456', nombre_completo: 'María García', cargo: 'Líder de Proyecto', correo: 'maria.garcia@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 4, cedula: 'V-18987654', nombre_completo: 'José Rodríguez', cargo: 'Ingeniero de Petróleo', correo: 'jose.rodriguez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 5, cedula: 'V-21456789', nombre_completo: 'Ana Martínez', cargo: 'Analista de Datos', correo: 'ana.martinez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 6, cedula: 'V-19876543', nombre_completo: 'Pedro López', cargo: 'Jefe de Mantenimiento', correo: 'pedro.lopez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 7, cedula: 'V-22345678', nombre_completo: 'Estudiante PDVSA', cargo: 'Participante', correo: 'estudiante@pdvsa.com', password: 'user123', rol_id: 3 }
  ];

  // Store plain passwords for lazy hashing
  users.forEach(u => {
    memoryStorage.usuarios.push({
      ...u, password_hash: null, _plainPassword: u.password,
      activo: true, telefono: '+58-412-' + Math.floor(1000000 + Math.random() * 9000000),
      empresa_filial: 'PDVSA Corp', creado_en: new Date().toISOString()
    });
  });

  // Leads
  const leadsData = [
    { nombre_completo: 'Roberto Sánchez', email: 'roberto.sanchez@pdvsa.com', telefono: '+58-412-1111111', empresa_filial: 'PDVSA Maracaibo', cargo: 'Gerente de Operaciones', estado: 'nuevo', origen_registro: 'feria_industrial' },
    { nombre_completo: 'Carmen López', email: 'carmen.lopez@pdvsa.com', telefono: '+58-414-2222222', empresa_filial: 'PDVSA Puerto La Cruz', cargo: 'Ingeniera de Producción', estado: 'contactado', origen_registro: 'referido' },
    { nombre_completo: 'Luis Hernández', email: 'luis.hernandez@pdvsa.com', telefono: '+58-416-3333333', empresa_filial: 'PDVSA El Tigre', cargo: 'Supervisor de Planta', estado: 'inscrito', origen_registro: 'sitio_web' },
    { nombre_completo: 'Marta Fernández', email: 'marta.fernandez@pdvsa.com', telefono: '+58-418-4444444', empresa_filial: 'PDVSA Amuay', cargo: 'Coordinadora de Seguridad', estado: 'nuevo', origen_registro: 'linkedin' },
    { nombre_completo: 'Diego Vargas', email: 'diego.vargas@pdvsa.com', telefono: '+58-412-5555555', empresa_filial: 'PDVSA Bachaquero', cargo: 'Técnico Senior', estado: 'rechazado', origen_registro: 'correo_directo' },
    { nombre_completo: 'Laura Castillo', email: 'laura.castillo@pdvsa.com', telefono: '+58-414-6666666', empresa_filial: 'PDVSA San Tomé', cargo: 'Analista de Calidad', estado: 'contactado', origen_registro: 'webinar' }
  ];
  leadsData.forEach((lead, idx) => {
    memoryStorage.leads.push({ id: idx + 1, ...lead, notas_admin: '', usuario_creado_id: null, created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() });
  });

  // Academic content - try loading from seed-content.js, fallback to inline
  let academicModules, academicLessons, academicEvaluations;
  try {
    const seedData = require('./seed-content');
    academicModules = seedData.academicModules;
    academicLessons = seedData.academicLessons;
    academicEvaluations = seedData.academicEvaluations;
  } catch (e) {
    // Fallback data
    academicModules = [
      { id: 1, numero_modulo: 1, titulo: 'Fundamentos de Inteligencia Artificial', descripcion: 'Conceptos básicos de IA, ML y Deep Learning aplicados a Oil & Gas.', icono: '🤖', duracion_horas: 8 },
      { id: 2, numero_modulo: 2, titulo: 'Prompt Engineering para Sector Oil & Gas', descripcion: 'Diseño de prompts efectivos para modelos de lenguaje.', icono: '💬', duracion_horas: 8 },
      { id: 3, numero_modulo: 3, titulo: 'Gemelos Digitales en Industria Petrolera', descripcion: 'Réplicas virtuales de activos y procesos industriales.', icono: '🏭', duracion_horas: 8 },
      { id: 4, numero_modulo: 4, titulo: 'IA Generativa y Herramientas Multimodales', descripcion: 'GPT, DALL-E, Stable Diffusion y modelos de código.', icono: '🎨', duracion_horas: 8 }
    ];
    academicLessons = [
      { modulo_id: 1, titulo: '¿Qué es la Inteligencia Artificial?', orden: 1, contenido_markdown: '# Fundamentos de IA\n\nLa Inteligencia Artificial ha evolucionado desde sistemas basados en reglas hasta modelos de deep learning modernos.\n\n## Conceptos Clave\n- **IA**: Capacidad de las máquinas para realizar tareas inteligentes\n- **Machine Learning**: Aprendizaje automático a partir de datos\n- **Deep Learning**: Redes neuronales profundas\n\n## Aplicación en PDVSA\nLa IA permite optimizar procesos de refinación, predecir fallas en equipos y mejorar la seguridad operacional.', duracion_minutos: 120 },
      { modulo_id: 1, titulo: 'Aplicaciones de IA en Exploración y Producción', orden: 2, contenido_markdown: '# IA en Exploración y Producción\n\n## Análisis Sísmico\nRedes neuronales convolucionales (CNN) analizan datos sísmicos para identificar yacimientos.\n\n## Mantenimiento Predictivo\nModelos de ML predicen fallas antes de que ocurran, reduciendo downtime.', duracion_minutos: 120 },
      { modulo_id: 1, titulo: 'IA en Refinación y Procesos', orden: 3, contenido_markdown: '# IA en Refinación\n\n## Optimización de Hornos\nLa IA ajusta automáticamente la combustión para máxima eficiencia.\n\n## Control de Calidad\nSensores NIR + ML predicen calidad del producto en tiempo real.', duracion_minutos: 120 },
      { modulo_id: 1, titulo: 'ROI de Proyectos de IA', orden: 4, contenido_markdown: '# Evaluación de ROI\n\n## Marco de Evaluación\n- Impacto de Negocio (35%)\n- Viabilidad Técnica (25%)\n- Disponibilidad de Talent (20%)\n- Alineación Estratégica (20%)', duracion_minutos: 120 },
      { modulo_id: 2, titulo: 'Fundamentos del Prompt Engineering', orden: 1, contenido_markdown: '# Prompt Engineering\n\n## Los 5 Componentes\n1. **Rol**: Quién es la IA\n2. **Contexto**: Información de fondo\n3. **Tarea**: Qué necesitas\n4. **Formato**: Cómo quieres la respuesta\n5. **Restricciones**: Limitaciones', duracion_minutos: 120 },
      { modulo_id: 2, titulo: 'Técnicas Avanzadas', orden: 2, contenido_markdown: '# Técnicas Avanzadas\n\n## Prompt Chaining\nDivide problemas complejos en pasos.\n\n## Chain of Thought\nPide razonamiento paso a paso.', duracion_minutos: 120 },
      { modulo_id: 2, titulo: 'Plantillas para PDVSA', orden: 3, contenido_markdown: '# Plantillas de Prompts\n\n## Reporte Técnico\n```\nACTÚA como: Ingeniero Senior\nCONTEXTO: [Contexto]\nTAREA: [Tarea]\nFORMATO: [Formato]\n```', duracion_minutos: 120 },
      { modulo_id: 2, titulo: 'Mejora Continua de Prompts', orden: 4, contenido_markdown: '# Mejora Continua\n\n## Métricas de Calidad\n1. Relevancia\n2. Precisión\n3. Completitud\n4. Claridad\n5. Acciónabilidad', duracion_minutos: 120 },
      { modulo_id: 3, titulo: 'Fundamentos de Gemelos Digitales', orden: 1, contenido_markdown: '# Gemelos Digitales\n\n## 3 Componentes\n1. **Físico**: El activo real\n2. **Digital**: La réplica virtual\n3. **Conectividad**: Sensores IoT', duracion_minutos: 120 },
      { modulo_id: 3, titulo: 'Gemelos en Refinerías', orden: 2, contenido_markdown: '# Gemelos en Refinería\n\n## Aplicaciones\n- Optimización de hornos\n- Simulación de columnas\n- Monitoreo de integridad', duracion_minutos: 120 },
      { modulo_id: 3, titulo: 'Monitoreo en Tiempo Real', orden: 3, contenido_markdown: '# Monitoreo en Tiempo Real\n\n## Sistema de Alertas\n- Verde: Normal\n- Amarillo: Pre-alerta\n- Naranja: Alerta\n- Rojo: Crítico', duracion_minutos: 120 },
      { modulo_id: 3, titulo: 'Implementación Estratégica', orden: 4, contenido_markdown: '# Implementación\n\n## Roadmap\n1. Piloto (6 meses)\n2. Expansión (12-18 meses)\n3. Escalamiento (24-36 meses)', duracion_minutos: 120 },
      { modulo_id: 4, titulo: 'Fundamentos de IA Generativa', orden: 1, contenido_markdown: '# IA Generativa\n\n## Modelos Principales\n- GPT-4: Análisis técnico\n- Claude: Documentación\n- Gemini: Multimodal', duracion_minutos: 120 },
      { modulo_id: 4, titulo: 'Generación de Imágenes', orden: 2, contenido_markdown: '# Generación de Imágenes\n\n## Herramientas\n- DALL-E 3\n- Stable Diffusion\n- Midjourney', duracion_minutos: 120 },
      { modulo_id: 4, titulo: 'IA para Código', orden: 3, contenido_markdown: '# IA para Código\n\n## Aplicaciones\n- Scripts de análisis\n- Automatización de reportes\n- Procesamiento de datos', duracion_minutos: 120 },
      { modulo_id: 4, titulo: 'Estrategia de Adopción', orden: 4, contenido_markdown: '# Estrategia de Adopción\n\n## 3 Niveles\n1. Personal (inmediato)\n2. Departamental (3-6 meses)\n3. Institucional (6-12 meses)', duracion_minutos: 120 }
    ];
    academicEvaluations = [
      { modulo_id: 1, titulo: 'Evaluación Módulo 1: Fundamentos de IA', descripcion: 'Evaluación sobre conceptos básicos de IA', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Qué es la Inteligencia Artificial?', opciones: ['Una rama de la informática que crea sistemas inteligentes', 'Un tipo de robot industrial', 'Un software de oficina', 'Un lenguaje de programación'], respuesta_correcta: 0, retroalimentacion: 'La IA es una rama de la informática que crea sistemas capaces de realizar tareas que típicamente requieren inteligencia humana.' },
        { id: 2, pregunta: '¿Cuál es el objetivo de la IA en PDVSA?', opciones: ['Reemplazar trabajadores', 'Optimizar procesos y mejorar decisiones', 'Crear entretenimiento', 'Diseñar páginas web'], respuesta_correcta: 1, retroalimentacion: 'La IA en PDVSA optimiza procesos y mejora la toma de decisiones, no reemplaza personas.' },
        { id: 3, pregunta: '¿Qué es un Gemelo Digital?', opciones: ['Réplica virtual de un activo físico', 'Un videojuego', 'Un tipo de base de datos', 'Un sistema operativo'], respuesta_correcta: 0, retroalimentacion: 'Un gemelo digital es una réplica virtual de un activo físico que se actualiza con datos en tiempo real.' }
      ]},
      { modulo_id: 2, titulo: 'Evaluación Módulo 2: Prompt Engineering', descripcion: 'Evaluación sobre diseño de prompts', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Qué es un prompt?', opciones: ['Una instrucción al modelo', 'Un tipo de base de datos', 'Un dispositivo de entrada', 'Un lenguaje de programación'], respuesta_correcta: 0, retroalimentacion: 'Un prompt es la instrucción o solicitud que le damos a un modelo de lenguaje.' },
        { id: 2, pregunta: '¿Qué es Chain-of-Thought?', opciones: ['Razonamiento paso a paso', 'Una red neuronal', 'Un tipo de prompt para imágenes', 'Un protocolo de red'], respuesta_correcta: 0, retroalimentacion: 'Chain-of-Thought solicita a la IA que razon paso a paso antes de dar una conclusión.' },
        { id: 3, pregunta: '¿Cómo se optimiza un prompt?', opciones: ['Iterando y refinando con contexto claro', 'No se puede optimizar', 'Usando solo mayúsculas', 'Agregando caracteres especiales'], respuesta_correcta: 0, retroalimentacion: 'Un prompt se optimiza iterando, refinando y proporcionando contexto claro y específico.' }
      ]},
      { modulo_id: 3, titulo: 'Evaluación Módulo 3: Gemelos Digitales', descripcion: 'Evaluación sobre gemelos digitales', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Cuáles son los 3 componentes de un gemelo digital?', opciones: ['Físico, Digital y Conectividad', 'Hardware, Software e Internet', 'Datos, Algoritmos y Resultados', 'SCADA, PLC e IoT'], respuesta_correcta: 0, retroalimentacion: 'Los 3 componentes son: el activo físico, la réplica virtual y la conectividad con sensores.' },
        { id: 2, pregunta: '¿En qué nivel está la mayoría de Oil & Gas?', opciones: ['Nivel 1-2 (Monitoreo y Diagnóstico)', 'Nivel 5 (Optimización Autónoma)', 'Nivel 4 (Simulación)', 'No hay niveles'], respuesta_correcta: 0, retroalimentacion: 'La mayoría está en Nivel 1-2, con el objetivo de avanzar a Nivel 3-4.' },
        { id: 3, pregunta: '¿Cuál es la ventaja principal?', opciones: ['Se actualiza en tiempo real', 'Es más barato', 'No requiere sensores', 'Reemplaza al ingeniero'], respuesta_correcta: 0, retroalimentacion: 'La ventaja principal es que se actualiza continuamente con datos del activo real.' }
      ]},
      { modulo_id: 4, titulo: 'Evaluación Módulo 4: IA Generativa', descripcion: 'Evaluación sobre IA generativa', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Cuál es la principal limitación?', opciones: ['Pueden generar alucinaciones', 'No hablan español', 'Son muy lentos', 'No procesan texto'], respuesta_correcta: 0, retroalimentacion: 'Las alucinaciones son la limitación más crítica - información que parece real pero es falsa.' },
        { id: 2, pregunta: '¿Para qué sirve DALL-E?', opciones: ['Generación de imágenes conceptuales', 'Análisis de datos', 'Monitoreo de activos', 'Creación de planos'], respuesta_correcta: 0, retroalimentacion: 'DALL-E es para visualización conceptual, no para ingeniería de diseño.' },
        { id: 3, pregunta: '¿Cuál es la recomendación de seguridad?', opciones: ['No ingresar datos sensibles en herramientas externas', 'Usar la herramienta más barata', 'Compartir en redes sociales', 'Reemplazar ingenieros'], respuesta_correcta: 0, retroalimentacion: 'NUNCA ingresar datos sensibles de producción o estratégicos en herramientas de IA externas.' }
      ]}
    ];
    console.log('Using fallback academic content data');
  }

  // Modules
  academicModules.forEach(mod => {
    memoryStorage.modulos.push({ ...mod, created_at: new Date().toISOString() });
  });

  // Lessons
  academicLessons.forEach((leccion, idx) => {
    memoryStorage.lecciones.push({
      id: idx + 1, ...leccion,
      video_url: `https://videos.nassergroup.com/modulo${leccion.modulo_id}/leccion${leccion.orden}.mp4`,
      recursos_descargables: JSON.stringify([{ nombre: 'Guia del modulo.pdf', url: '#' }]),
      created_at: new Date().toISOString()
    });
  });

  // Tutor assignments
  [3, 4, 5, 6, 7].forEach(pid => {
    memoryStorage.asignaciones_tutores.push({
      id: memoryStorage.asignaciones_tutores.length + 1,
      tutor_id: 2, estudiante_id: pid,
      fecha_asignacion: new Date().toISOString(), activa: true
    });
  });

  // Evaluations
  academicEvaluations.forEach((evaluacion, idx) => {
    memoryStorage.evaluaciones.push({
      id: idx + 1, ...evaluacion,
      modulo: academicModules.find(m => m.id === evaluacion.modulo_id)?.titulo || '',
      fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
    });
  });

  dataReady = true;
  console.log('✅ Data initialized: ' + memoryStorage.usuarios.length + ' users, ' + memoryStorage.modulos.length + ' modules, ' + memoryStorage.lecciones.length + ' lessons');
};
initializeSync();

// ===================== MIDDLEWARE =====================
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token de acceso requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol_id)) {
      return res.status(403).json({ error: 'No tiene permisos para esta acción' });
    }
    next();
  };
};

// ===================== AUTH ROUTES =====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ error: 'Correo y contraseña son requeridos' });

    const usuario = memoryStorage.usuarios.find(u => u.correo === correo);
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!usuario.activo) return res.status(401).json({ error: 'Usuario desactivado' });

    // Handle lazy password hashing
    let validPassword = false;
    if (usuario.password_hash) {
      validPassword = await bcrypt.compare(password, usuario.password_hash);
    } else if (usuario._plainPassword) {
      validPassword = (password === usuario._plainPassword);
      if (validPassword) {
        // Hash and store for future comparisons
        usuario.password_hash = await bcrypt.hash(password, 10);
        delete usuario._plainPassword;
      }
    }
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    const rol = memoryStorage.roles.find(r => r.id === usuario.rol_id);
    const token = jwt.sign(
      { id: usuario.id, cedula: usuario.cedula, correo: usuario.correo, rol_id: usuario.rol_id, nombre_rol: rol?.nombre_rol },
      JWT_SECRET, { expiresIn: '24h' }
    );

    usuario.ultimo_acceso = new Date().toISOString();

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: usuario.id, cedula: usuario.cedula, nombre_completo: usuario.nombre_completo, cargo: usuario.cargo, correo: usuario.correo, rol: rol?.nombre_rol }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { cedula, nombre_completo, cargo, correo, password } = req.body;
    if (!cedula || !nombre_completo || !correo || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });

    if (memoryStorage.usuarios.find(u => u.cedula === cedula || u.correo === correo)) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      id: memoryStorage.usuarios.length + 1, cedula, nombre_completo,
      cargo: cargo || 'Participante PDVSA', correo,
      password_hash: hashedPassword, rol_id: 3, activo: true,
      telefono: '', empresa_filial: 'PDVSA Corp',
      creado_en: new Date().toISOString()
    };
    memoryStorage.usuarios.push(nuevoUsuario);

    const token = jwt.sign(
      { id: nuevoUsuario.id, cedula, correo, rol_id: 3, nombre_rol: 'participante' },
      JWT_SECRET, { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente', token,
      user: { id: nuevoUsuario.id, cedula, nombre_completo, correo, rol: 'participante' }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuario = memoryStorage.usuarios.find(u => u.id === req.user.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(currentPassword, usuario.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    usuario.password_hash = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===================== USERS ROUTES =====================
app.get('/api/users', verifyToken, (req, res) => {
  const usuarios = memoryStorage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: memoryStorage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial,
    ultimo_acceso: u.ultimo_acceso, creado_en: u.creado_en
  }));
  res.json(usuarios);
});

app.get('/api/users/:id', verifyToken, (req, res) => {
  const u = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: memoryStorage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial
  });
});

// ===================== COURSES ROUTES =====================
app.get('/api/courses/modulos', verifyToken, (req, res) => {
  const usuarioId = req.user.id;
  const modulos = memoryStorage.modulos.map(modulo => {
    const lecciones = memoryStorage.lecciones.filter(l => l.modulo_id === modulo.id);
    const leccionesCompletadas = memoryStorage.progresos.filter(
      p => p.usuario_id === usuarioId && lecciones.some(l => l.id === p.leccion_id) && p.completado
    ).length;
    const totalLecciones = lecciones.length;
    const porcentajeAvance = totalLecciones > 0 ? ((leccionesCompletadas / totalLecciones) * 100).toFixed(1) : 0;
    return { ...modulo, total_lecciones: totalLecciones, lecciones_completadas: leccionesCompletadas, porcentaje_avance: parseFloat(porcentajeAvance) };
  });
  res.json(modulos);
});

app.get('/api/courses/modulos/:id', verifyToken, (req, res) => {
  const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
  if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

  const lecciones = memoryStorage.lecciones.filter(l => l.modulo_id === modulo.id).sort((a, b) => a.orden - b.orden);
  const leccionesConProgreso = lecciones.map(l => {
    const progreso = memoryStorage.progresos.find(p => p.usuario_id === req.user.id && p.leccion_id === l.id);
    return { ...l, completado: progreso?.completado || false, fecha_completado: progreso?.fecha_completado || null };
  });

  res.json({ ...modulo, lecciones: leccionesConProgreso });
});

app.get('/api/courses/modulos/:id/lecciones', verifyToken, (req, res) => {
  const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
  if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

  const lecciones = memoryStorage.lecciones.filter(l => l.modulo_id === modulo.id).sort((a, b) => a.orden - b.orden);
  const leccionesConProgreso = lecciones.map(l => {
    const progreso = memoryStorage.progresos.find(p => p.usuario_id === req.user.id && p.leccion_id === l.id);
    return { ...l, completado: progreso?.completado || false, fecha_completado: progreso?.fecha_completado || null };
  });
  res.json(leccionesConProgreso);
});

app.post('/api/courses/lecciones/completar', verifyToken, (req, res) => {
  try {
    const { leccion_id } = req.body;
    if (!leccion_id) return res.status(400).json({ error: 'leccion_id es requerido' });

    const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(leccion_id));
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });

    const progreso = memoryStorage.progresos.find(p => p.usuario_id === req.user.id && p.leccion_id === parseInt(leccion_id));
    if (progreso) {
      progreso.completado = true;
      progreso.fecha_completado = new Date().toISOString();
    } else {
      memoryStorage.progresos.push({
        id: memoryStorage.progresos.length + 1, usuario_id: req.user.id,
        leccion_id: parseInt(leccion_id), completado: true,
        fecha_completado: new Date().toISOString()
      });
    }
    res.json({ message: 'Lección marcada como completada' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/courses/stats', verifyToken, verifyRole(1, 2), (req, res) => {
  const totalEstudiantes = memoryStorage.usuarios.filter(u => u.rol_id === 3).length;
  const totalModulos = memoryStorage.modulos.length;
  const totalLecciones = memoryStorage.lecciones.length;
  const totalEvaluaciones = memoryStorage.evaluaciones.length;
  const totalCertificados = memoryStorage.certificados.length;
  const progresos = memoryStorage.progresos.filter(p => p.completado);
  const totalCompletados = progresos.length;
  const notas = memoryStorage.notas;
  const promedioNotas = notas.length > 0 ? (notas.reduce((a, n) => a + parseFloat(n.calificacion), 0) / notas.length).toFixed(2) : 0;
  const aprobados = notas.filter(n => n.estatus_aprobacion).length;
  const tasaAprobacion = notas.length > 0 ? ((aprobados / notas.length) * 100).toFixed(1) : 0;

  res.json({ totalEstudiantes, totalModulos, totalLecciones, totalEvaluaciones, totalCertificados, totalCompletados, promedioNotas: parseFloat(promedioNotas), tasaAprobacion: parseFloat(tasaAprobacion) });
});

// CRUD Modulos
app.post('/api/courses/modulos', verifyToken, verifyRole(1, 2), (req, res) => {
  const { numero_modulo, titulo, descripcion, icono, duracion_horas } = req.body;
  const nuevoModulo = {
    id: memoryStorage.modulos.length + 1, numero_modulo, titulo,
    descripcion: descripcion || '', icono: icono || '📚',
    duracion_horas: duracion_horas || 10, created_at: new Date().toISOString()
  };
  memoryStorage.modulos.push(nuevoModulo);
  res.status(201).json({ message: 'Módulo creado exitosamente', modulo: nuevoModulo });
});

app.put('/api/courses/modulos/:id', verifyToken, verifyRole(1, 2), (req, res) => {
  const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
  if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });
  const { titulo, descripcion, icono, duracion_horas } = req.body;
  if (titulo) modulo.titulo = titulo;
  if (descripcion !== undefined) modulo.descripcion = descripcion;
  if (icono) modulo.icono = icono;
  if (duracion_horas) modulo.duracion_horas = duracion_horas;
  res.json({ message: 'Módulo actualizado exitosamente', modulo });
});

// CRUD Lecciones
app.post('/api/courses/lecciones', verifyToken, verifyRole(1, 2), (req, res) => {
  const { modulo_id, titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;
  if (!modulo_id || !titulo) return res.status(400).json({ error: 'modulo_id y titulo son requeridos' });
  const nuevaLeccion = {
    id: memoryStorage.lecciones.length + 1, modulo_id: parseInt(modulo_id), titulo,
    contenido_markdown: contenido_markdown || '', video_url: video_url || '',
    orden: orden || memoryStorage.lecciones.filter(l => l.modulo_id === parseInt(modulo_id)).length + 1,
    recursos_descargables: recursos_descargables || '[]', created_at: new Date().toISOString()
  };
  memoryStorage.lecciones.push(nuevaLeccion);
  res.status(201).json({ message: 'Lección creada exitosamente', leccion: nuevaLeccion });
});

app.put('/api/courses/lecciones/:id', verifyToken, verifyRole(1, 2), (req, res) => {
  const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(req.params.id));
  if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
  const { titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;
  if (titulo) leccion.titulo = titulo;
  if (contenido_markdown !== undefined) leccion.contenido_markdown = contenido_markdown;
  if (video_url !== undefined) leccion.video_url = video_url;
  if (orden) leccion.orden = orden;
  if (recursos_descargables) leccion.recursos_descargables = recursos_descargables;
  res.json({ message: 'Lección actualizada exitosamente', leccion });
});

// ===================== EVALUATIONS ROUTES =====================
app.get('/api/evaluations', verifyToken, (req, res) => {
  res.json(memoryStorage.evaluaciones);
});

app.get('/api/evaluations/:id', verifyToken, (req, res) => {
  const ev = memoryStorage.evaluaciones.find(e => e.id === parseInt(req.params.id));
  if (!ev) return res.status(404).json({ error: 'Evaluación no encontrada' });
  res.json(ev);
});

app.post('/api/evaluations/:id/submit', verifyToken, (req, res) => {
  try {
    const ev = memoryStorage.evaluaciones.find(e => e.id === parseInt(req.params.id));
    if (!ev) return res.status(404).json({ error: 'Evaluación no encontrada' });

    const { respuestas } = req.body; // Array of selected option indices
    let correctas = 0;
    const resultados = ev.preguntas.map((preg, idx) => {
      const esCorrecta = respuestas[idx] === preg.respuesta_correcta;
      if (esCorrecta) correctas++;
      return { pregunta_id: preg.id, respuesta_usuario: respuestas[idx], es_correcta: esCorrecta, retroalimentacion: preg.retroalimentacion };
    });

    const calificacion = ((correctas / ev.preguntas.length) * 100).toFixed(1);
    const estatus_aprobacion = parseFloat(calificacion) >= 70;

    // Save grade
    memoryStorage.notas.push({
      id: memoryStorage.notas.length + 1,
      estudiante_id: req.user.id, evaluacion_id: ev.id,
      calificacion, estatus_aprobacion,
      fecha_evaluacion: new Date().toISOString()
    });

    res.json({ calificacion: parseFloat(calificacion), aprobado: estatus_aprobacion, correctas, total: ev.preguntas.length, resultados });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===================== NOTES ROUTES =====================
app.get('/api/notas', verifyToken, (req, res) => {
  const user = req.user;
  if (user.rol_id === 3) {
    res.json(memoryStorage.notas.filter(n => n.estudiante_id === user.id));
  } else {
    res.json(memoryStorage.notas);
  }
});

// ===================== CERTIFICATES ROUTES =====================
app.get('/api/certificates', verifyToken, (req, res) => {
  if (req.user.rol_id === 3) {
    res.json(memoryStorage.certificados.filter(c => c.estudiante_id === req.user.id));
  } else {
    res.json(memoryStorage.certificados);
  }
});

app.post('/api/certificates/generate', verifyToken, (req, res) => {
  try {
    const user = memoryStorage.usuarios.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const nuevoCertificado = {
      id: memoryStorage.certificados.length + 1,
      estudiante_id: req.user.id,
      nombre_estudiante: user.nombre_completo,
      curso: 'IA para Líderes de Negocio - PDVSA',
      fecha_emision: new Date().toISOString(),
      codigo_verificacion: 'CERT-' + Date.now().toString(36).toUpperCase(),
      activo: true
    };
    memoryStorage.certificados.push(nuevoCertificado);
    res.json({ message: 'Certificado generado exitosamente', certificado: nuevoCertificado });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===================== LEADS ROUTES =====================
app.get('/api/leads', verifyToken, verifyRole(1, 2), (req, res) => {
  res.json(memoryStorage.leads);
});

app.post('/api/leads', verifyToken, verifyRole(1, 2), (req, res) => {
  const { nombre_completo, email, telefono, empresa_filial, cargo, origen_registro } = req.body;
  if (!nombre_completo || !email) return res.status(400).json({ error: 'nombre_completo y email son requeridos' });

  const nuevoLead = {
    id: memoryStorage.leads.length + 1, nombre_completo, email, telefono: telefono || '',
    empresa_filial: empresa_filial || '', cargo: cargo || '',
    estado: 'nuevo', origen_registro: origen_registro || 'manual',
    notas_admin: '', usuario_creado_id: null,
    created_at: new Date().toISOString()
  };
  memoryStorage.leads.push(nuevoLead);
  res.status(201).json({ message: 'Lead creado exitosamente', lead: nuevoLead });
});

app.put('/api/leads/:id', verifyToken, verifyRole(1, 2), (req, res) => {
  const lead = memoryStorage.leads.find(l => l.id === parseInt(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
  const { estado, notas_admin } = req.body;
  if (estado) lead.estado = estado;
  if (notas_admin !== undefined) lead.notas_admin = notas_admin;
  res.json({ message: 'Lead actualizado exitosamente', lead });
});

app.post('/api/leads/:id/convert', verifyToken, verifyRole(1, 2), async (req, res) => {
  try {
    const lead = memoryStorage.leads.find(l => l.id === parseInt(req.params.id));
    if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });

    const password = 'participante' + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      id: memoryStorage.usuarios.length + 1,
      cedula: 'V-' + Math.floor(10000000 + Math.random() * 90000000),
      nombre_completo: lead.nombre_completo, cargo: lead.cargo,
      correo: lead.email, password_hash: hashedPassword,
      rol_id: 3, activo: true, telefono: lead.telefono,
      empresa_filial: lead.empresa_filial,
      creado_en: new Date().toISOString()
    };
    memoryStorage.usuarios.push(nuevoUsuario);
    lead.estado = 'inscrito';
    lead.usuario_creado_id = nuevoUsuario.id;

    res.json({ message: 'Lead convertido exitosamente', usuario: { ...nuevoUsuario, password_temporal: password } });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ===================== SIMULATORS ROUTES =====================
app.post('/api/simulators/text-prompt', verifyToken, (req, res) => {
  const { prompt, contexto } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  // Simulated AI response (in production, call OpenAI API)
  const respuesta = {
    prompt_original: prompt,
    respuesta_generada: `Análisis basado en el prompt: "${prompt}"\n\nContexto proporcionado: ${contexto || 'Oil & Gas / PDVSA'}\n\nEste es un análisis simulado. En producción, este endpoint conectaría con GPT-4 para generar una respuesta técnica detallada aplicable a las operaciones de PDVSA.`,
    modelo_utilizado: 'GPT-4 (simulado)',
    tokens_utilizados: Math.floor(prompt.length * 1.3),
    timestamp: new Date().toISOString()
  };

  memoryStorage.simulaciones.push({
    id: memoryStorage.simulaciones.length + 1,
    usuario_id: req.user.id, tipo: 'texto', ...respuesta,
    created_at: new Date().toISOString()
  });

  res.json(respuesta);
});

app.post('/api/simulators/image-generate', verifyToken, (req, res) => {
  const { prompt, estilo } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  res.json({
    prompt_original: prompt,
    estilo: estilo || 'fotografía profesional',
    imagen_generada: 'https://via.placeholder.com/512x512/003366/FFFFFF?text=Simulador+IA+PDVSA',
    modelo_utilizado: 'DALL-E 3 (simulado)',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/simulators/code-generate', verifyToken, (req, res) => {
  const { prompt, lenguaje } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  res.json({
    prompt_original: prompt,
    lenguaje: lenguaje || 'python',
    codigo_generado: `# Script generado por IA - PDVSA\n# Prompt: ${prompt}\n\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Función principal\ndef analizar_datos():\n    print("Análisis completado")\n\nif __name__ == "__main__":\n    analizar_datos()`,
    modelo_utilizado: 'GPT-4 Code (simulado)',
    timestamp: new Date().toISOString()
  });
});

// ===================== TUTORS ROUTES =====================
app.get('/api/tutors/estudiantes', verifyToken, verifyRole(1, 2), (req, res) => {
  const asignaciones = memoryStorage.asignaciones_tutores.filter(a => a.tutor_id === req.user.id || req.user.rol_id === 1);
  const estudiantes = asignaciones.map(a => {
    const usuario = memoryStorage.usuarios.find(u => u.id === a.estudiante_id);
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

  const exists = memoryStorage.asignaciones_tutores.find(a => a.tutor_id === req.user.id && a.estudiante_id === estudiante_id);
  if (exists) return res.status(400).json({ error: 'Estudiante ya asignado' });

  memoryStorage.asignaciones_tutores.push({
    id: memoryStorage.asignaciones_tutores.length + 1,
    tutor_id: req.user.id, estudiante_id,
    fecha_asignacion: new Date().toISOString(), activa: true
  });
  res.json({ message: 'Estudiante asignado exitosamente' });
});

app.post('/api/tutors/retroalimentacion', verifyToken, verifyRole(1, 2), (req, res) => {
  const { estudiante_id, mensaje, tipo } = req.body;
  if (!estudiante_id || !mensaje) return res.status(400).json({ error: 'estudiante_id y mensaje son requeridos' });

  memoryStorage.retroalimentacion.push({
    id: memoryStorage.retroalimentacion.length + 1,
    tutor_id: req.user.id, estudiante_id,
    mensaje, tipo: tipo || 'general',
    created_at: new Date().toISOString()
  });
  res.json({ message: 'Retroalimentación registrada exitosamente' });
});

// ===================== HEALTH CHECK =====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Academia Virtual Nasser Group API - PDVSA',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: 'vercel-serverless'
  });
});

// ===================== SERVE REACT APP (fallback) =====================
// For Vercel, static files are served from build/
// This catch-all is for local development only
if (process.env.NODE_ENV !== 'production') {
  app.get('*', (req, res) => {
    res.json({ message: 'API is running. Frontend should be served separately.' });
  });
}

module.exports = app;
