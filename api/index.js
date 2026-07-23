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
  retroalimentacion: [],
  contenido_multimedia: [],
  tareas: [],
  entregas: [],
  auditoria: []
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
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const isStudent = u.rol_id === 3;
    memoryStorage.usuarios.push({
      ...u, password_hash: null, _plainPassword: u.password,
      activo: true, telefono: '+58-412-' + Math.floor(1000000 + Math.random() * 9000000),
      empresa_filial: 'PDVSA Corp', creado_en: now.toISOString(),
      estado: 'ACTIVE',
      trial_start: isStudent ? now.toISOString() : null,
      trial_end: isStudent ? trialEnd.toISOString() : null,
      membresia_extendida: false,
      progreso: {},
      modulos_completados: [],
      ultimo_acceso: null
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

  // Pre-seeded certificates (always available for verification)
  const seedCertificates = [
    {
      id: 1, estudiante_id: 7,
      nombre_estudiante: 'Estudiante PDVSA',
      curso: 'Curso de Inteligencia Artificial para PDVSA',
      fecha_solicitud: '2026-07-22T00:00:00.000Z',
      fecha_emision: '2026-07-22T00:00:00.000Z',
      fecha_aprobacion: '2026-07-22T00:00:00.000Z',
      codigo_verificacion: 'CERT_mrww1carfbuka7',
      calificacion_final: '100.0',
      estado: 'aprobado',
      aprobado_por: 1,
      notas_admin: '',
      activo: true
    },
    {
      id: 2, estudiante_id: 7,
      nombre_estudiante: 'Estudiante PDVSA',
      curso: 'Curso de Inteligencia Artificial para PDVSA',
      fecha_solicitud: '2026-07-22T00:00:00.000Z',
      fecha_emision: '2026-07-22T00:00:00.000Z',
      fecha_aprobacion: '2026-07-22T00:00:00.000Z',
      codigo_verificacion: 'CERT_mrwvoxe4i7uwkb',
      calificacion_final: '100.0',
      estado: 'aprobado',
      aprobado_por: 1,
      notas_admin: '',
      activo: true
    },
    {
      id: 3, estudiante_id: 3,
      nombre_estudiante: 'María García',
      curso: 'Curso de Inteligencia Artificial para PDVSA',
      fecha_solicitud: '2026-07-20T00:00:00.000Z',
      fecha_emision: '2026-07-21T00:00:00.000Z',
      fecha_aprobacion: '2026-07-21T00:00:00.000Z',
      codigo_verificacion: 'CERT_mariagarcia2026',
      calificacion_final: '95.0',
      estado: 'aprobado',
      aprobado_por: 1,
      notas_admin: '',
      activo: true
    },
    {
      id: 4, estudiante_id: 4,
      nombre_estudiante: 'José Rodríguez',
      curso: 'Curso de Inteligencia Artificial para PDVSA',
      fecha_solicitud: '2026-07-21T00:00:00.000Z',
      fecha_emision: null,
      fecha_aprobacion: null,
      codigo_verificacion: 'CERT_joserodriguez_pend',
      calificacion_final: '88.0',
      estado: 'pendiente',
      aprobado_por: null,
      notas_admin: '',
      activo: true
    }
  ];
  seedCertificates.forEach(cert => {
    memoryStorage.certificados.push(cert);
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

const checkTrialStatus = (req, res, next) => {
  if (req.user.rol_id !== 3) return next();
  const usuario = memoryStorage.usuarios.find(u => u.id === req.user.id);
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
};

const logAuditoria = (usuario_id, accion, detalles) => {
  memoryStorage.auditoria.push({
    id: memoryStorage.auditoria.length + 1,
    usuario_id, accion, detalles,
    ip: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
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
    logAuditoria(usuario.id, 'login', `Inicio de sesión exitoso`);

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
      user: { id: usuario.id, cedula: usuario.cedula, nombre_completo: usuario.nombre_completo, cargo: usuario.cargo, correo: usuario.correo, rol: rol?.nombre_rol },
      trial: trialInfo
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
    ultimo_acceso: u.ultimo_acceso, creado_en: u.creado_en,
    estado: u.estado || 'ACTIVE',
    trial_start: u.trial_start, trial_end: u.trial_end,
    membresia_extendida: u.membresia_extendida || false,
    modulos_completados: u.modulos_completados || []
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
    activo: u.activo, telefono: u.telefono, empresa_filial: u.empresa_filial,
    estado: u.estado || 'ACTIVE',
    trial_start: u.trial_start, trial_end: u.trial_end,
    membresia_extendida: u.membresia_extendida || false,
    modulos_completados: u.modulos_completados || []
  });
});

// ===================== ADMIN USER MANAGEMENT =====================
app.get('/api/admin/users', verifyToken, verifyRole(1), (req, res) => {
  const { rol, estado, busqueda } = req.query;
  let usuarios = memoryStorage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre_completo: u.nombre_completo,
    cargo: u.cargo, correo: u.correo, rol_id: u.rol_id,
    nombre_rol: memoryStorage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
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

app.put('/api/admin/users/:id/role', verifyToken, verifyRole(1), (req, res) => {
  const usuario = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { rol_id } = req.body;
  if (![1, 2, 3].includes(rol_id)) return res.status(400).json({ error: 'Rol inválido' });
  usuario.rol_id = rol_id;
  logAuditoria(req.user.id, 'cambio_rol', `Usuario ${usuario.id} rol cambiado a ${rol_id}`);
  res.json({ message: 'Rol actualizado exitosamente', usuario: { id: usuario.id, nombre_rol: memoryStorage.roles.find(r => r.id === rol_id)?.nombre_rol } });
});

app.put('/api/admin/users/:id/trial', verifyToken, verifyRole(1), (req, res) => {
  const usuario = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
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

app.put('/api/admin/users/:id/status', verifyToken, verifyRole(1), (req, res) => {
  const usuario = memoryStorage.usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { activo } = req.body;
  usuario.activo = activo;
  if (!activo) usuario.estado = 'BLOCKED';
  else if (usuario.estado === 'BLOCKED') usuario.estado = 'ACTIVE';
  logAuditoria(req.user.id, 'cambiar_estado', `Usuario ${usuario.id} estado cambiado a ${activo ? 'activo' : 'bloqueado'}`);
  res.json({ message: 'Estado actualizado exitosamente' });
});

app.get('/api/admin/users/export', verifyToken, verifyRole(1), (req, res) => {
  const format = req.query.format || 'json';
  const usuarios = memoryStorage.usuarios.map(u => ({
    id: u.id, cedula: u.cedula, nombre: u.nombre_completo, email: u.correo,
    rol: memoryStorage.roles.find(r => r.id === u.rol_id)?.nombre_rol,
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

    const existing = memoryStorage.progresos.find(p => p.user_id === req.user.id && p.leccion_id === parseInt(leccion_id));
    if (existing) {
      existing.completado = true;
      existing.fecha_completado = new Date().toISOString();
    } else {
      memoryStorage.progresos.push({
        id: memoryStorage.progresos.length + 1,
        user_id: req.user.id,
        leccion_id: parseInt(leccion_id),
        modulo_id: leccion.modulo_id,
        completado: true,
        calificacion: 100,
        fecha_completado: new Date().toISOString()
      });
    }

    // Award badges
    const newBadges = checkAndAwardBadges(req.user.id);

    // Notify student
    createNotification(req.user.id, 'contenido', 'Leccion completada', `Has completado la leccion: ${leccion.titulo}`);

    res.json({ message: 'Leccion marcada como completada', new_badges: newBadges || [] });
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

// ===================== LMS CONTENT MANAGEMENT =====================
app.post('/api/courses/lecciones/:id/content', verifyToken, verifyRole(1, 2), (req, res) => {
  const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(req.params.id));
  if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
  const { tipo, titulo, url, descripcion, orden } = req.body;
  if (!tipo || !url) return res.status(400).json({ error: 'tipo y url son requeridos' });
  const contenido = {
    id: memoryStorage.contenido_multimedia.length + 1,
    leccion_id: leccion.id, tipo, titulo: titulo || '',
    url, descripcion: descripcion || '',
    orden: orden || 0, created_at: new Date().toISOString(),
    creado_por: req.user.id
  };
  memoryStorage.contenido_multimedia.push(contenido);
  res.status(201).json({ message: 'Contenido agregado exitosamente', contenido });
});

app.get('/api/courses/lecciones/:id/content', verifyToken, (req, res) => {
  const contenido = memoryStorage.contenido_multimedia
    .filter(c => c.leccion_id === parseInt(req.params.id))
    .sort((a, b) => a.orden - b.orden);
  res.json(contenido);
});

app.delete('/api/courses/content/:id', verifyToken, verifyRole(1, 2), (req, res) => {
  const idx = memoryStorage.contenido_multimedia.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Contenido no encontrado' });
  memoryStorage.contenido_multimedia.splice(idx, 1);
  res.json({ message: 'Contenido eliminado exitosamente' });
});

// ===================== ASSIGNMENTS (TAREAS) =====================
app.post('/api/courses/lecciones/:id/tareas', verifyToken, verifyRole(1, 2), (req, res) => {
  const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(req.params.id));
  if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
  const { titulo, descripcion, puntos_maximos, fecha_limite } = req.body;
  if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });
  const tarea = {
    id: memoryStorage.tareas.length + 1,
    leccion_id: leccion.id, titulo, descripcion: descripcion || '',
    puntos_maximos: puntos_maximos || 100,
    fecha_limite: fecha_limite || null,
    created_at: new Date().toISOString(), creado_por: req.user.id
  };
  memoryStorage.tareas.push(tarea);
  res.status(201).json({ message: 'Tarea creada exitosamente', tarea });
});

app.get('/api/courses/lecciones/:id/tareas', verifyToken, (req, res) => {
  const tareas = memoryStorage.tareas.filter(t => t.leccion_id === parseInt(req.params.id));
  res.json(tareas);
});

app.post('/api/tareas/:id/entregar', verifyToken, (req, res) => {
  const tarea = memoryStorage.tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  const { archivo_url, notas } = req.body;
  const entrega = {
    id: memoryStorage.entregas.length + 1,
    tarea_id: tarea.id, estudiante_id: req.user.id,
    archivo_url: archivo_url || '', notas: notas || '',
    estado: 'entregado', calificacion: null, retroalimentacion: '',
    fecha_entrega: new Date().toISOString()
  };
  memoryStorage.entregas.push(entrega);
  res.status(201).json({ message: 'Tarea entregada exitosamente', entrega });
});

app.get('/api/tareas/:id/entregas', verifyToken, verifyRole(1, 2), (req, res) => {
  const entregas = memoryStorage.entregas
    .filter(e => e.tarea_id === parseInt(req.params.id))
    .map(e => {
      const est = memoryStorage.usuarios.find(u => u.id === e.estudiante_id);
      return { ...e, nombre_estudiante: est?.nombre_completo || '', correo_estudiante: est?.correo || '' };
    });
  res.json(entregas);
});

app.put('/api/entregas/:id/calificar', verifyToken, verifyRole(1, 2), (req, res) => {
  const entrega = memoryStorage.entregas.find(e => e.id === parseInt(req.params.id));
  if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });
  const { calificacion, retroalimentacion } = req.body;
  entrega.calificacion = calificacion;
  entrega.retroalimentacion = retroalimentacion || '';
  entrega.estado = 'calificado';
  entrega.fecha_calificacion = new Date().toISOString();
  res.json({ message: 'Entrega calificada exitosamente', entrega });
});

// ===================== EXECUTIVE DASHBOARD =====================
app.get('/api/admin/dashboard', verifyToken, verifyRole(1), (req, res) => {
  const totalEstudiantes = memoryStorage.usuarios.filter(u => u.rol_id === 3).length;
  const estudiantesActivos = memoryStorage.usuarios.filter(u => u.rol_id === 3 && u.activo && u.estado === 'ACTIVE').length;
  const trialsActivos = memoryStorage.usuarios.filter(u => u.rol_id === 3 && u.estado === 'ACTIVE' && u.trial_end && new Date(u.trial_end) > new Date()).length;
  const trialsExpirados = memoryStorage.usuarios.filter(u => u.rol_id === 3 && u.estado === 'TRIAL_EXPIRED').length;
  const totalLeads = memoryStorage.leads.length;
  const leadsNuevos = memoryStorage.leads.filter(l => l.estado === 'nuevo').length;
  const totalModulos = memoryStorage.modulos.length;
  const totalLecciones = memoryStorage.lecciones.length;
  const totalCertificados = memoryStorage.certificados.length;
  const certificadosPendientes = memoryStorage.certificados.filter(c => c.estado === 'pendiente').length;
  const certificadosAprobados = memoryStorage.certificados.filter(c => c.estado === 'aprobado').length;
  const totalEvaluaciones = memoryStorage.evaluaciones.length;
  const notas = memoryStorage.notas;
  const promedioNotas = notas.length > 0 ? (notas.reduce((a, n) => a + parseFloat(n.calificacion), 0) / notas.length).toFixed(1) : 0;
  const aprobados = notas.filter(n => n.estatus_aprobacion).length;
  const tasaAprobacion = notas.length > 0 ? ((aprobados / notas.length) * 100).toFixed(1) : 0;
  const progresos = memoryStorage.progresos.filter(p => p.completado).length;
  const totalTareas = memoryStorage.tareas.length;
  const entregasPendientes = memoryStorage.entregas.filter(e => e.estado === 'entregado').length;
  const recientesLogins = memoryStorage.usuarios
    .filter(u => u.ultimo_acceso)
    .sort((a, b) => new Date(b.ultimo_acceso) - new Date(a.ultimo_acceso))
    .slice(0, 10)
    .map(u => ({ id: u.id, nombre: u.nombre_completo, correo: u.correo, ultimo_acceso: u.ultimo_acceso }));
  const recientesLecciones = memoryStorage.progresos
    .filter(p => p.completado)
    .sort((a, b) => new Date(b.fecha_completado) - new Date(a.fecha_completado))
    .slice(0, 10)
    .map(p => {
      const u = memoryStorage.usuarios.find(usr => usr.id === p.user_id);
      const l = memoryStorage.lecciones.find(lec => lec.id === p.leccion_id);
      return { estudiante: u?.nombre_completo || '', leccion: l?.titulo || '', fecha: p.fecha_completado };
    });
  res.json({
    kpis: {
      totalEstudiantes, estudiantesActivos, trialsActivos, trialsExpirados,
      totalLeads, leadsNuevos, totalModulos, totalLecciones,
      totalCertificados, certificadosPendientes, certificadosAprobados,
      totalEvaluaciones, promedioNotas: parseFloat(promedioNotas), tasaAprobacion: parseFloat(tasaAprobacion),
      progresosCompletados: progresos, totalTareas, entregasPendientes
    },
    auditoria: { loginsRecientes: recientesLogins, leccionesRecientes: recientesLecciones }
  });
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

    // Check badges after evaluation
    checkAndAwardBadges(req.user.id);

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

app.get('/api/evaluations/user/:userId/grades', verifyToken, (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.user.rol_id === 3 && req.user.id !== userId) {
    return res.status(403).json({ error: 'No tiene permisos' });
  }
  const grades = memoryStorage.notas.filter(n => n.estudiante_id === userId);
  res.json(grades);
});

// ===================== CERTIFICATES ROUTES =====================
app.get('/api/certificates', verifyToken, (req, res) => {
  if (req.user.rol_id === 3) {
    res.json(memoryStorage.certificados.filter(c => c.estudiante_id === req.user.id));
  } else {
    res.json(memoryStorage.certificados);
  }
});

app.get('/api/certificates/user/:userId', verifyToken, (req, res) => {
  const userId = parseInt(req.params.userId);
  if (req.user.rol_id === 3 && req.user.id !== userId) {
    return res.status(403).json({ error: 'No tiene permisos' });
  }
  res.json(memoryStorage.certificados.filter(c => c.estudiante_id === userId));
});

app.get('/api/certificates/verify/:code', (req, res) => {
  const cert = memoryStorage.certificados.find(c => c.codigo_verificacion === req.params.code);
  if (!cert) return res.status(404).json({ valido: false, error: 'Certificado no encontrado' });
  if (cert.estado !== 'aprobado') return res.status(404).json({ valido: false, error: 'Certificado no aprobado' });
  const user = memoryStorage.usuarios.find(u => u.id === cert.estudiante_id);
  res.json({
    valido: true,
    certificado: {
      id: cert.id,
      nombre_estudiante: cert.nombre_estudiante,
      curso: cert.curso,
      fecha_emision: cert.fecha_emision,
      codigo_verificacion: cert.codigo_verificacion,
      calificacion_final: cert.calificacion_final,
      correo: user?.correo || ''
    }
  });
});

app.post('/api/certificates/generate', verifyToken, (req, res) => {
  try {
    const user = memoryStorage.usuarios.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const evalCount = memoryStorage.evaluaciones.length;
    const userGrades = memoryStorage.notas.filter(n => n.estudiante_id === req.user.id);
    const approvedGrades = userGrades.filter(n => n.estatus_aprobacion);

    if (approvedGrades.length < evalCount) {
      return res.status(400).json({ error: `Debe aprobar todas las evaluaciones (${approvedGrades.length}/${evalCount} aprobadas)` });
    }

    const existingPending = memoryStorage.certificados.find(
      c => c.estudiante_id === req.user.id && c.estado === 'pendiente'
    );
    if (existingPending) {
      return res.status(400).json({ error: 'Ya tiene un certificado pendiente de aprobación' });
    }

    const existingApproved = memoryStorage.certificados.find(
      c => c.estudiante_id === req.user.id && c.estado === 'aprobado'
    );
    if (existingApproved) {
      return res.status(400).json({ error: 'Ya tiene un certificado aprobado' });
    }

    const avgGrade = approvedGrades.reduce((sum, g) => sum + parseFloat(g.calificacion), 0) / approvedGrades.length;
    const hash = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

    const nuevoCertificado = {
      id: memoryStorage.certificados.length + 1,
      estudiante_id: req.user.id,
      nombre_estudiante: user.nombre_completo,
      curso: 'Curso de Inteligencia Artificial para PDVSA',
      fecha_solicitud: new Date().toISOString(),
      fecha_emision: null,
      fecha_aprobacion: null,
      codigo_verificacion: 'CERT_' + hash,
      calificacion_final: avgGrade.toFixed(1),
      estado: 'pendiente',
      aprobado_por: null,
      notas_admin: '',
      activo: true
    };
    memoryStorage.certificados.push(nuevoCertificado);
    res.json({ message: 'Solicitud de certificado enviada. Pendiente de aprobación por administración.', certificado: nuevoCertificado });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/admin/certificates/pending', verifyToken, verifyRole(1), (req, res) => {
  const pending = memoryStorage.certificados.filter(c => c.estado === 'pendiente');
  const enriched = pending.map(cert => {
    const user = memoryStorage.usuarios.find(u => u.id === cert.estudiante_id);
    const grades = memoryStorage.notas.filter(n => n.estudiante_id === cert.estudiante_id && n.estatus_aprobacion);
    return {
      ...cert,
      correo: user?.correo || '',
      cedula: user?.cedula || '',
      total_aprobadas: grades.length,
      total_evaluaciones: memoryStorage.evaluaciones.length
    };
  });
  res.json(enriched);
});

app.get('/api/admin/certificates/all', verifyToken, verifyRole(1), (req, res) => {
  const enriched = memoryStorage.certificados.map(cert => {
    const user = memoryStorage.usuarios.find(u => u.id === cert.estudiante_id);
    return {
      ...cert,
      correo: user?.correo || '',
      cedula: user?.cedula || ''
    };
  });
  res.json(enriched);
});

app.post('/api/admin/certificates/:id/approve', verifyToken, verifyRole(1), (req, res) => {
  const cert = memoryStorage.certificados.find(c => c.id === parseInt(req.params.id));
  if (!cert) return res.status(404).json({ error: 'Certificado no encontrado' });
  if (cert.estado !== 'pendiente') return res.status(400).json({ error: 'El certificado no esta pendiente' });

  cert.estado = 'aprobado';
  cert.fecha_aprobacion = new Date().toISOString();
  cert.fecha_emision = new Date().toISOString();
  cert.aprobado_por = req.user.id;

  const hash = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  cert.codigo_verificacion = 'CERT_' + hash;

  // Check badges for certificate
  checkAndAwardBadges(cert.estudiante_id);

  // Notify student
  createNotification(cert.estudiante_id, 'alerta', 'Certificado Aprobado', 'Tu certificado ha sido aprobado. Codigo: ' + cert.codigo_verificacion);

  res.json({ message: 'Certificado aprobado exitosamente', certificado: cert });
});

app.post('/api/admin/certificates/:id/reject', verifyToken, verifyRole(1), (req, res) => {
  const cert = memoryStorage.certificados.find(c => c.id === parseInt(req.params.id));
  if (!cert) return res.status(404).json({ error: 'Certificado no encontrado' });
  if (cert.estado !== 'pendiente') return res.status(400).json({ error: 'El certificado no está pendiente' });

  cert.estado = 'rechazado';
  cert.fecha_aprobacion = new Date().toISOString();
  cert.aprobado_por = req.user.id;
  cert.notas_admin = req.body.notas || '';

  res.json({ message: 'Certificado rechazado', certificado: cert });
});

// ===================== LEADS ROUTES =====================
app.get('/api/leads/stats', verifyToken, verifyRole(1, 2), (req, res) => {
  const leads = memoryStorage.leads;
  const hoy = new Date().toISOString().split('T')[0];
  const nuevos = leads.filter(l => l.estado === 'nuevo').length;
  const contactados = leads.filter(l => l.estado === 'contactado').length;
  const inscritos = leads.filter(l => l.estado === 'inscrito').length;
  const rechazados = leads.filter(l => l.estado === 'rechazado').length;
  const total = leads.length;
  const tasaConversion = total > 0 ? ((inscritos / total) * 100).toFixed(1) : 0;
  const nuevosHoy = leads.filter(l => l.created_at && l.created_at.startsWith(hoy)).length;

  res.json({
    total, nuevos, contactados, inscritos, rechazados,
    tasaConversion: parseFloat(tasaConversion),
    nuevosHoy
  });
});

app.get('/api/leads/export', verifyToken, verifyRole(1), (req, res) => {
  const format = req.query.format || 'json';
  const leads = memoryStorage.leads;

  if (format === 'csv') {
    const headers = 'ID,Nombre,Email,Teléfono,Empresa,Cargo,Estado,Origen,Fecha Registro\n';
    const rows = leads.map(l =>
      `${l.id},"${l.nombre_completo}","${l.email}","${l.telefono || ''}","${l.empresa_filial || ''}","${l.cargo || ''}","${l.estado}","${l.origen_registro || ''}","${l.created_at || ''}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    return res.send(headers + rows);
  }

  res.json(leads);
});

app.get('/api/leads', verifyToken, verifyRole(1, 2), (req, res) => {
  res.json(memoryStorage.leads);
});

app.post('/api/leads', (req, res) => {
  const { nombre_completo, email, telefono, empresa_filial, cargo, origen_registro } = req.body;
  if (!nombre_completo || !email) return res.status(400).json({ error: 'nombre_completo y email son requeridos' });

  const nuevoLead = {
    id: memoryStorage.leads.length + 1, nombre_completo, email, telefono: telefono || '',
    empresa_filial: empresa_filial || '', cargo: cargo || '',
    estado: 'nuevo', origen_registro: origen_registro || 'registro',
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

app.delete('/api/leads/:id', verifyToken, verifyRole(1), (req, res) => {
  const idx = memoryStorage.leads.findIndex(l => l.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Lead no encontrado' });
  memoryStorage.leads.splice(idx, 1);
  res.json({ message: 'Lead eliminado exitosamente' });
});

app.post('/api/leads/:id/convertir', verifyToken, verifyRole(1, 2), async (req, res) => {
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
  const { prompt, contexto, tipo_documento, parametros } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  const respuesta = {
    titulo: 'Análisis Ejecutivo — Asistente IA PDVSA',
    prompt_original: prompt,
    respuesta: `INFORME EJECUTIVO — CONSOLA DE INTELIGENCIA PDVSA\n${'═'.repeat(55)}\n\nFecha: ${new Date().toLocaleDateString('es-VE')}\nClasificación: USO INTERNO — DIRECCIÓN DE OPERACIONES\nAnalista IA: Asistente Ejecutivo Nasser Group\n\n${'─'.repeat(55)}\nRESUMEN EJECUTIVO\n${'─'.repeat(55)}\n\nSolicitud analizada: "${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"\n\n${contexto ? `Contexto operativo: ${contexto}` : 'Contexto: Operaciones generales PDVSA'}\nTipo de documento: ${tipo_documento || 'análisis ejecutivo'}\n\n${'─'.repeat(55)}\nPUNTOS CLAVE DEL ANÁLISIS\n${'─'.repeat(55)}\n\n1. SITUACIÓN ACTUAL\n   • Se identificaron factores de impacto en las operaciones actuales\n   • El análisis considera variables financieras, operativas y de riesgo\n   • Se recomienda revisión inmediata de los indicadores clave\n\n2. HALLAZGOS PRINCIPALES\n   • Eficiencia operativa actual: 78% (meta: 90%)\n   • Impacto estimado en costos: Reducción potencial del 15-20%\n   • Riesgos identificados: 3 factores críticos requieren atención\n\n3. ANÁLISIS DE ESCENARIOS\n   • ESCENARIO CONSERVADOR: Inversión mínima, mejora del 8% en 6 meses\n   • ESCENARIO MODERADO: Inversión media, mejora del 15% en 4 meses\n   • ESCENARIO AGRESIVO: Inversión alta, mejora del 25% en 3 meses\n\n${'─'.repeat(55)}\nRECOMENDACIÓN DEL ASESOR IA\n${'─'.repeat(55)}\n\nSe recomienda adoptar el ESCENARIO MODERADO con las siguientes acciones:\n\n  a) Implementar sistema de monitoreo continuo en áreas críticas\n  b) Establecer KPIs semanales de seguimiento con dashboard ejecutivo\n  c) Designar equipo de proyecto con representantes de cada área\n  d) Presentar avances quincenales a Dirección General\n\nPRIORIDAD: ALTA — Implementar dentro de los próximos 30 días\n\n${'─'.repeat(56)}\nNota: Este análisis fue generado por IA. Se recomienda validar con datos\noperativos reales antes de tomar decisiones ejecutivas.\n${'═'.repeat(56)}`,
    modelo_utilizado: 'GPT-4 Ejecutivo (simulado)',
    tokens_utilizados: Math.floor(prompt.length * 1.3),
    timestamp: new Date().toISOString()
  };

  memoryStorage.simulaciones.push({
    id: memoryStorage.simulaciones.length + 1,
    usuario_id: req.user?.id || 0, tipo: 'texto', ...respuesta,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, respuesta });
});

app.post('/api/simulators/image-prompt', verifyToken, (req, res) => {
  const { prompt, tipo_modelo, parametros } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  const respuesta = {
    titulo: 'Análisis de Inspección Visual Generado',
    descripcion: `Análisis de imagen generado con modelo ${tipo_modelo || 'VAE'}. Procesamiento completado exitosamente.`,
    resultados: {
      zone_detection: '12 zonas identificadas',
      anomaly_score: '94.2%',
      structural_integrity: 'Buena',
      recommendations: 'Monitoreo semanal recomendado'
    },
    metadata: {
      modelo: tipo_modelo || 'VAE / GAN Industrial',
      precision: '98.4%',
      tiempo_inferencia: '1.2s',
      resolucion: '512x512',
      timestamp: new Date().toISOString()
    }
  };

  memoryStorage.simulaciones.push({
    id: memoryStorage.simulaciones.length + 1,
    usuario_id: req.user?.id || 0, tipo: 'imagen', prompt, ...respuesta,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, respuesta });
});

app.post('/api/simulators/video-audio-prompt', verifyToken, (req, res) => {
  const { prompt, tipo_operacion, parametros } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

  let respuesta;
  if (tipo_operacion === 'texto_a_voz') {
    respuesta = {
      titulo: 'Síntesis de Voz Generada',
      descripcion: `Síntesis de voz completada para: "${prompt.substring(0, 50)}..."`,
      tipo: 'audio',
      duracion: '2:45',
      formato: 'WAV 44.1kHz',
      modelo: 'Tacotron 2 (simulado)',
      metadata: { frecuencia_muestreo: '44.1kHz', bits: '16', canales: 1 }
    };
  } else if (tipo_operacion === 'video_fotogramas') {
    respuesta = {
      titulo: 'Video Generado por IA',
      descripcion: `Video generado con fotogramas para: "${prompt.substring(0, 50)}..."`,
      tipo: 'video',
      fotogramas: 45,
      duracion: '1:30',
      resolucion: '1920x1080',
      modelo: 'StyleGAN3 (simulado)',
      metadata: { fps: 30, codec: 'H.264', bitrate: '8 Mbps' }
    };
  } else {
    respuesta = {
      titulo: 'Clonación de Voz Completada',
      descripcion: `Modelo de voz entrenado para: "${prompt.substring(0, 50)}..."`,
      tipo: 'audio_clonado',
      duracion: '3:12',
      modelo: 'YourTTS (simulado)',
      metadata: { similaridad: '94.7%', idioma: 'es-VE', velocidad: '1.0x' }
    };
  }

  memoryStorage.simulaciones.push({
    id: memoryStorage.simulaciones.length + 1,
    usuario_id: req.user?.id || 0, tipo: tipo_operacion, prompt, ...respuesta,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, respuesta });
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

// ===================== NOTIFICATIONS =====================
if (!memoryStorage.notifications) memoryStorage.notifications = [];
let nextNotifId = 1;

function createNotification(userId, tipo, titulo, mensaje) {
  memoryStorage.notifications.push({
    id: nextNotifId++,
    user_id: userId,
    tipo,
    titulo,
    mensaje,
    leida: false,
    created_at: new Date().toISOString()
  });
}

app.get('/api/notifications', verifyToken, (req, res) => {
  const userNotifs = memoryStorage.notifications
    .filter(n => n.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const no_leidas = userNotifs.filter(n => !n.leida).length;
  res.json({ notificaciones: userNotifs, no_leidas });
});

app.put('/api/notifications/:id/read', verifyToken, (req, res) => {
  const notif = memoryStorage.notifications.find(n => n.id === parseInt(req.params.id) && n.user_id === req.user.id);
  if (!notif) return res.status(404).json({ error: 'Notificacion no encontrada' });
  notif.leida = true;
  res.json({ message: 'Marcada como leida' });
});

app.put('/api/notifications/read-all', verifyToken, (req, res) => {
  memoryStorage.notifications.forEach(n => {
    if (n.user_id === req.user.id) n.leida = true;
  });
  res.json({ message: 'Todas marcadas como leidas' });
});

// ===================== BADGES / GAMIFICATION =====================
if (!memoryStorage.badges) {
  memoryStorage.badges = [
    { id: 'primer_modulo', nombre: 'Primer Paso', descripcion: 'Completar primer modulo', icono: '\ud83e\udd47', color: '#d4a843', condicion: 'primer_modulo' },
    { id: 'puntaje_perfecto', nombre: 'Puntaje Perfecto', descripcion: '100% en alguna evaluacion', icono: '\u26a1', color: '#3b82f6', condicion: 'puntaje_perfecto' },
    { id: 'especialista_ia', nombre: 'Especialista IA', descripcion: 'Completar los 4 modulos', icono: '\ud83c\udf93', color: '#10b981', condicion: 'especialista_ia' },
    { id: 'rapido', nombre: 'Velocista', descripcion: 'Completar modulo en menos de 1 dia', icono: '\ud83d\ude80', color: '#ef4444', condicion: 'rapido' },
    { id: 'constante', nombre: 'Constante', descripcion: '5 o mas lecciones completadas', icono: '\ud83d\udd25', color: '#f59e0b', condicion: 'constante' },
    { id: 'certificado', nombre: 'Certificado', descripcion: 'Obtener certificado oficial', icono: '\ud83c\udfc5', color: '#8b5cf6', condicion: 'certificado' }
  ];
}
if (!memoryStorage.user_badges) memoryStorage.user_badges = [];

function checkAndAwardBadges(userId) {
  const user = memoryStorage.usuarios.find(u => u.id === userId);
  if (!user) return;
  const userProgress = memoryStorage.progresos.filter(p => p.user_id === userId);
  const totalLecciones = memoryStorage.lecciones.length;
  const completadas = userProgress.length;
  const promedio = completadas > 0 ? Math.round(userProgress.reduce((s, p) => s + (p.calificacion || 0), 0) / completadas) : 0;
  const awarded = memoryStorage.user_badges.filter(b => b.user_id === userId).map(b => b.badge_id);
  const awards = [];
  if (!awarded.includes('primer_modulo') && completadas >= 1) { awards.push('primer_modulo'); }
  if (!awarded.includes('puntaje_perfecto') && userProgress.some(p => (p.calificacion || 0) === 100)) { awards.push('puntaje_perfecto'); }
  if (!awarded.includes('especialista_ia') && completadas >= totalLecciones && totalLecciones > 0) { awards.push('especialista_ia'); }
  if (!awarded.includes('constante') && completadas >= 5) { awards.push('constante'); }
  const userCerts = memoryStorage.certificados.filter(c => c.user_id === userId && c.estado === 'aprobado');
  if (!awarded.includes('certificado') && userCerts.length > 0) { awards.push('certificado'); }
  awards.forEach(badgeId => {
    memoryStorage.user_badges.push({ user_id: userId, badge_id: badgeId, fecha_otorgada: new Date().toISOString() });
  });
  return awards;
}

app.get('/api/badges/user/:userId/all', verifyToken, (req, res) => {
  const uid = parseInt(req.params.userId);
  const userBadgeIds = memoryStorage.user_badges.filter(b => b.user_id === uid).map(b => b.badge_id);
  const result = memoryStorage.badges.map(b => ({
    ...b,
    otorgada: userBadgeIds.includes(b.id),
    fecha_otorgada: (memoryStorage.user_badges.find(ub => ub.user_id === uid && ub.badge_id === b.id) || {}).fecha_otorgada || null
  }));
  res.json(result);
});

// ===================== REPORTS =====================
app.get('/api/reports/student/:userId', verifyToken, (req, res) => {
  const uid = parseInt(req.params.userId);
  const user = memoryStorage.usuarios.find(u => u.id === uid);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const userProgress = memoryStorage.progresos.filter(p => p.user_id === uid);
  const totalLecciones = memoryStorage.lecciones.length;
  const completadas = userProgress.length;
  const promedio = completadas > 0 ? Math.round(userProgress.reduce((s, p) => s + (p.calificacion || 0), 0) / completadas) : 0;
  const modulosCompletados = new Set(userProgress.map(p => p.modulo_id)).size;
  const userEvals = memoryStorage.evaluaciones.filter(e => e.user_id === uid);
  const evalsAprobadas = userEvals.filter(e => (e.nota || 0) >= 70).length;
  const userBadgeIds = memoryStorage.user_badges.filter(b => b.user_id === uid).map(b => b.badge_id);
  const allBadges = memoryStorage.badges.map(b => ({
    ...b,
    otorgada: userBadgeIds.includes(b.id),
    fecha_otorgada: (memoryStorage.user_badges.find(ub => ub.user_id === uid && ub.badge_id === b.id) || {}).fecha_otorgada || null
  }));
  const calificaciones = memoryStorage.modulos.map(mod => {
    const modLecciones = memoryStorage.lecciones.filter(l => l.modulo_id === mod.id);
    const modProgress = userProgress.filter(p => p.modulo_id === mod.id);
    return {
      modulo: mod.titulo,
      lecciones_completadas: modProgress.length,
      total_lecciones: modLecciones.length,
      promedio: modProgress.length > 0 ? Math.round(modProgress.reduce((s, p) => s + (p.calificacion || 0), 0) / modProgress.length) : 0
    };
  });
  const now = new Date();
  const trialEnd = user.trial_end ? new Date(user.trial_end) : null;
  const diasRestantes = trialEnd ? Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))) : null;

  res.json({
    estudiante: {
      id: user.id,
      nombre_completo: user.nombre_completo,
      cedula: user.cedula,
      correo: user.correo,
      empresa_filial: user.empresa_filial,
      cargo: user.cargo,
      estado: user.estado
    },
    calificaciones,
    resumen: {
      porcentaje_avance: totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0,
      lecciones_completadas: completadas,
      total_lecciones: totalLecciones,
      promedio_general: promedio,
      evaluaciones_aprobadas: evalsAprobadas,
      total_evaluaciones: userEvals.length,
      modulos_completados: modulosCompletados,
      trial: {
        estado: user.estado,
        dias_restantes: diasRestantes,
        membresia_extendida: user.membresia_extendida
      }
    },
    badges: allBadges
  });
});

app.get('/api/reports/admin/consolidado', verifyToken, verifyRole(1), (req, res) => {
  const estudiantes = memoryStorage.usuarios.filter(u => u.rol_id === 3);
  const totalEstudiantes = estudiantes.length;
  const activos = estudiantes.filter(u => u.activo).length;
  const totalLecciones = memoryStorage.lecciones.length;
  const matriz = estudiantes.map(est => {
    const userProgress = memoryStorage.progresos.filter(p => p.user_id === est.id);
    const completadas = userProgress.length;
    const promedio = completadas > 0 ? Math.round(userProgress.reduce((s, p) => s + (p.calificacion || 0), 0) / completadas) : 0;
    const userCert = memoryStorage.certificados.find(c => c.user_id === est.id && c.estado === 'aprobado');
    return {
      id: est.id,
      nombre: est.nombre_completo,
      correo: est.correo,
      cedula: est.cedula,
      empresa: est.empresa_filial,
      lecciones_completadas: completadas,
      total_lecciones: totalLecciones,
      porcentaje_avance: totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0,
      promedio,
      certificado: userCert ? userCert.codigo_verificacion : null,
      estado: est.estado,
      trial_fin: est.trial_end
    };
  });
  const conCertificado = matriz.filter(m => m.certificado).length;
  const avgGeneral = matriz.length > 0 ? Math.round(matriz.reduce((s, m) => s + m.promedio, 0) / matriz.length) : 0;

  res.json({
    resumen: {
      total_estudiantes: totalEstudiantes,
      activos,
      con_certificado: conCertificado,
      tasa_certificacion: totalEstudiantes > 0 ? Math.round((conCertificado / totalEstudiantes) * 100) : 0,
      promedio_general: avgGeneral
    },
    matriz_talento: matriz
  });
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

module.exports = app;
