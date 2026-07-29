const { storage, getNextId } = require('../storage/memory-store');

function initializeSeed() {
  if (storage.modulos.length > 0 && storage.lecciones.length > 0) return;

  const users = [
    { id: 1, cedula: 'V-00000000', nombre_completo: 'Administrador PDVSA', cargo: 'Coordinador Académico', correo: 'admin@nassergroup.com', password: 'admin123', rol_id: 1 },
    { id: 2, cedula: 'V-12345678', nombre_completo: 'Carlos Mendoza', cargo: 'Instructor Senior de IA', correo: 'tutor@nassergroup.com', password: 'tutor123', rol_id: 2 },
    { id: 3, cedula: 'V-20123456', nombre_completo: 'María García', cargo: 'Líder de Proyecto', correo: 'maria.garcia@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 4, cedula: 'V-18987654', nombre_completo: 'José Rodríguez', cargo: 'Ingeniero de Petróleo', correo: 'jose.rodriguez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 5, cedula: 'V-21456789', nombre_completo: 'Ana Martínez', cargo: 'Analista de Datos', correo: 'ana.martinez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 6, cedula: 'V-19876543', nombre_completo: 'Pedro López', cargo: 'Jefe de Mantenimiento', correo: 'pedro.lopez@pdvsa.com', password: 'participante123', rol_id: 3 },
    { id: 7, cedula: 'V-22345678', nombre_completo: 'Estudiante PDVSA', cargo: 'Participante', correo: 'estudiante@pdvsa.com', password: 'user123', rol_id: 3 },
    { id: 8, cedula: 'V-00000001', nombre_completo: 'Administrador PDVSA VIP', cargo: 'Coordinador Académico VIP', correo: 'admin@pdvsa.com', password: 'admin123', rol_id: 1 },
    { id: 9, cedula: 'V-33333333', nombre_completo: 'Usuario Estándar PDVSA', cargo: 'Participante', correo: 'usuario@pdvsa.com', password: 'user123', rol_id: 3 },
    { id: 10, cedula: 'V-44444444', nombre_completo: 'Tutor PDVSA', cargo: 'Instructor Senior', correo: 'tutor@pdvsa.com', password: 'tutor123', rol_id: 2 }
  ];

  const existingEmails = new Set(storage.usuarios.map(u => u.correo?.toLowerCase().trim()));
  const existingIds = new Set(storage.usuarios.map(u => u.id));

  users.forEach(u => {
    if (existingIds.has(u.id) || existingEmails.has(u.correo.toLowerCase().trim())) return;
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const isStudent = u.rol_id === 3;
    storage.usuarios.push({
      ...u, password_hash: null, _plainPassword: u.password,
      activo: true, telefono: '+58-412-' + Math.floor(1000000 + Math.random() * 9000000),
      empresa_filial: 'PDVSA Corp', creado_en: now.toISOString(),
      estado: 'ACTIVE',
      trial_start: isStudent ? now.toISOString() : null,
      trial_end: isStudent ? trialEnd.toISOString() : null,
      membresia_extendida: false,
      progreso: {},
      modulos_completados: [],
      ultimo_acceso: null,
      plan_suscripcion: u.rol_id === 1 ? 'b2b_enterprise' : u.rol_id === 2 ? 'vip_diplomado' : 'gratuito'
    });
  });

  const leadsData = [
    { nombre_completo: 'Roberto Sánchez', email: 'roberto.sanchez@pdvsa.com', telefono: '+58-412-1111111', empresa_filial: 'PDVSA Maracaibo', cargo: 'Gerente de Operaciones', estado: 'nuevo', origen_registro: 'feria_industrial' },
    { nombre_completo: 'Carmen López', email: 'carmen.lopez@pdvsa.com', telefono: '+58-414-2222222', empresa_filial: 'PDVSA Puerto La Cruz', cargo: 'Ingeniera de Producción', estado: 'contactado', origen_registro: 'referido' },
    { nombre_completo: 'Luis Hernández', email: 'luis.hernandez@pdvsa.com', telefono: '+58-416-3333333', empresa_filial: 'PDVSA El Tigre', cargo: 'Supervisor de Planta', estado: 'inscrito', origen_registro: 'sitio_web' },
    { nombre_completo: 'Marta Fernández', email: 'marta.fernandez@pdvsa.com', telefono: '+58-418-4444444', empresa_filial: 'PDVSA Amuay', cargo: 'Coordinadora de Seguridad', estado: 'nuevo', origen_registro: 'linkedin' },
    { nombre_completo: 'Diego Vargas', email: 'diego.vargas@pdvsa.com', telefono: '+58-412-5555555', empresa_filial: 'PDVSA Bachaquero', cargo: 'Técnico Senior', estado: 'rechazado', origen_registro: 'correo_directo' },
    { nombre_completo: 'Laura Castillo', email: 'laura.castillo@pdvsa.com', telefono: '+58-414-6666666', empresa_filial: 'PDVSA San Tomé', cargo: 'Analista de Calidad', estado: 'contactado', origen_registro: 'webinar' }
  ];
  leadsData.forEach((lead, idx) => {
    storage.leads.push({ id: idx + 1, ...lead, notas_admin: '', usuario_creado_id: null, created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() });
  });

  let academicModules, academicLessons, academicEvaluations;
  try {
    const seedData = require('../seed-content');
    academicModules = seedData.academicModules;
    academicLessons = seedData.academicLessons;
    academicEvaluations = seedData.academicEvaluations;
  } catch (e) {
    academicModules = [
      { id: 1, numero_modulo: 1, titulo: 'Fundamentos de Inteligencia Artificial', descripcion: 'Conceptos básicos de IA, ML y Deep Learning aplicados a Oil & Gas.', icono: '🤖', duracion_horas: 8 },
      { id: 2, numero_modulo: 2, titulo: 'Prompt Engineering para Sector Oil & Gas', descripcion: 'Diseño de prompts efectivos para modelos de lenguaje.', icono: '💬', duracion_horas: 8 },
      { id: 3, numero_modulo: 3, titulo: 'Gemelos Digitales en Industria Petrolera', descripcion: 'Réplicas virtuales de activos y procesos industriales.', icono: '🏭', duracion_horas: 8 },
      { id: 4, numero_modulo: 4, titulo: 'IA Generativa y Herramientas Multimodales', descripcion: 'GPT, DALL-E, Stable Diffusion y modelos de código.', icono: '🎨', duracion_horas: 8 }
    ];
    academicLessons = [
      { modulo_id: 1, titulo: '¿Qué es la Inteligencia Artificial?', orden: 1, contenido_markdown: '# Fundamentos de IA\n\nLa Inteligencia Artificial ha evolucionado desde sistemas basados en reglas hasta modelos de deep learning moderno.\n\n## Conceptos Clave\n- **IA**: Capacidad de las máquinas para realizar tareas inteligentes\n- **Machine Learning**: Aprendizaje automático a partir de datos\n- **Deep Learning**: Redes neuronales profundas\n\n## Aplicación en PDVSA\nLa IA permite optimizar procesos de refinación, predecir fallas en equipos y mejorar la seguridad operacional.', duracion_minutos: 120 },
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
        { id: 2, pregunta: '¿Cuál es el objetivo de la IA en PDVSA?', opciones: ['Reemplazar trabajadores', 'Optimizar procesos y mejorar decisiones', 'Crear entretenimiento', 'Diseñar páginas web'], respuesta_correcta: 1, retroalimentacion: 'La IA en PDVSA optimiza procesos y mejora la toma de decisiones.' },
        { id: 3, pregunta: '¿Qué es un Gemelo Digital?', opciones: ['Réplica virtual de un activo físico', 'Un videojuego', 'Un tipo de base de datos', 'Un sistema operativo'], respuesta_correcta: 0, retroalimentacion: 'Un gemelo digital es una réplica virtual de un activo físico.' }
      ]},
      { modulo_id: 2, titulo: 'Evaluación Módulo 2: Prompt Engineering', descripcion: 'Evaluación sobre diseño de prompts', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Qué es un prompt?', opciones: ['Una instrucción al modelo', 'Un tipo de base de datos', 'Un dispositivo de entrada', 'Un lenguaje de programación'], respuesta_correcta: 0, retroalimentacion: 'Un prompt es la instrucción o solicitud que le damos a un modelo de lenguaje.' },
        { id: 2, pregunta: '¿Qué es Chain-of-Thought?', opciones: ['Razonamiento paso a paso', 'Una red neuronal', 'Un tipo de prompt para imágenes', 'Un protocolo de red'], respuesta_correcta: 0, retroalimentacion: 'Chain-of-Thought solicita a la IA que razone paso a paso.' },
        { id: 3, pregunta: '¿Cómo se optimiza un prompt?', opciones: ['Iterando y refinando con contexto claro', 'No se puede optimizar', 'Usando solo mayúsculas', 'Agregando caracteres especiales'], respuesta_correcta: 0, retroalimentacion: 'Un prompt se optimiza iterando, refinando y proporcionando contexto claro.' }
      ]},
      { modulo_id: 3, titulo: 'Evaluación Módulo 3: Gemelos Digitales', descripcion: 'Evaluación sobre gemelos digitales', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Cuáles son los 3 componentes de un gemelo digital?', opciones: ['Físico, Digital y Conectividad', 'Hardware, Software e Internet', 'Datos, Algoritmos y Resultados', 'SCADA, PLC e IoT'], respuesta_correcta: 0, retroalimentacion: 'Los 3 componentes son: activo físico, réplica virtual y conectividad.' },
        { id: 2, pregunta: '¿En qué nivel está la mayoría de Oil & Gas?', opciones: ['Nivel 1-2 (Monitoreo y Diagnóstico)', 'Nivel 5 (Optimización Autónoma)', 'Nivel 4 (Simulación)', 'No hay niveles'], respuesta_correcta: 0, retroalimentacion: 'La mayoría está en Nivel 1-2.' },
        { id: 3, pregunta: '¿Cuál es la ventaja principal?', opciones: ['Se actualiza en tiempo real', 'Es más barato', 'No requiere sensores', 'Reemplaza al ingeniero'], respuesta_correcta: 0, retroalimentacion: 'Se actualiza continuamente con datos del activo real.' }
      ]},
      { modulo_id: 4, titulo: 'Evaluación Módulo 4: IA Generativa', descripcion: 'Evaluación sobre IA generativa', ponderacion: 100, tiempo_limite_minutos: 30, preguntas: [
        { id: 1, pregunta: '¿Cuál es la principal limitación?', opciones: ['Pueden generar alucinaciones', 'No hablan español', 'Son muy lentos', 'No procesan texto'], respuesta_correcta: 0, retroalimentacion: 'Las alucinaciones son la limitación más crítica.' },
        { id: 2, pregunta: '¿Para qué sirve DALL-E?', opciones: ['Generación de imágenes conceptuales', 'Análisis de datos', 'Monitoreo de activos', 'Creación de planos'], respuesta_correcta: 0, retroalimentacion: 'DALL-E es para visualización conceptual.' },
        { id: 3, pregunta: '¿Cuál es la recomendación de seguridad?', opciones: ['No ingresar datos sensibles en herramientas externas', 'Usar la herramienta más barata', 'Compartir en redes sociales', 'Reemplazar ingenieros'], respuesta_correcta: 0, retroalimentacion: 'NUNCA ingresar datos sensibles de producción en herramientas externas.' }
      ]}
    ];
  }

  academicModules.forEach(mod => {
    storage.modulos.push({ ...mod, created_at: new Date().toISOString() });
  });

  academicLessons.forEach((leccion, idx) => {
    storage.lecciones.push({
      id: idx + 1, ...leccion,
      video_url: `https://videos.nassergroup.com/modulo${leccion.modulo_id}/leccion${leccion.orden}.mp4`,
      recursos_descargables: JSON.stringify([{ nombre: 'Guia del modulo.pdf', url: '#' }]),
      created_at: new Date().toISOString()
    });
  });

  [3, 4, 5, 6, 7].forEach(pid => {
    storage.asignaciones_tutores.push({
      id: getNextId(storage.asignaciones_tutores),
      tutor_id: 2, estudiante_id: pid,
      fecha_asignacion: new Date().toISOString(), activa: true
    });
  });

  academicEvaluations.forEach((evaluacion, idx) => {
    storage.evaluaciones.push({
      id: idx + 1, ...evaluacion,
      modulo: academicModules.find(m => m.id === evaluacion.modulo_id)?.titulo || '',
      fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
    });
  });

  const seedCertificates = [
    { id: 1, estudiante_id: 7, nombre_estudiante: 'Estudiante PDVSA', curso: 'Curso de Inteligencia Artificial para PDVSA', fecha_solicitud: '2026-07-22T00:00:00.000Z', fecha_emision: '2026-07-22T00:00:00.000Z', fecha_aprobacion: '2026-07-22T00:00:00.000Z', codigo_verificacion: 'CERT_mrww1carfbuka7', calificacion_final: '100.0', estado: 'aprobado', aprobado_por: 1, notas_admin: '', activo: true },
    { id: 2, estudiante_id: 7, nombre_estudiante: 'Estudiante PDVSA', curso: 'Curso de Inteligencia Artificial para PDVSA', fecha_solicitud: '2026-07-22T00:00:00.000Z', fecha_emision: '2026-07-22T00:00:00.000Z', fecha_aprobacion: '2026-07-22T00:00:00.000Z', codigo_verificacion: 'CERT_mrwvoxe4i7uwkb', calificacion_final: '100.0', estado: 'aprobado', aprobado_por: 1, notas_admin: '', activo: true },
    { id: 3, estudiante_id: 3, nombre_estudiante: 'María García', curso: 'Curso de Inteligencia Artificial para PDVSA', fecha_solicitud: '2026-07-20T00:00:00.000Z', fecha_emision: '2026-07-21T00:00:00.000Z', fecha_aprobacion: '2026-07-21T00:00:00.000Z', codigo_verificacion: 'CERT_mariagarcia2026', calificacion_final: '95.0', estado: 'aprobado', aprobado_por: 1, notas_admin: '', activo: true },
    { id: 4, estudiante_id: 4, nombre_estudiante: 'José Rodríguez', curso: 'Curso de Inteligencia Artificial para PDVSA', fecha_solicitud: '2026-07-21T00:00:00.000Z', fecha_emision: null, fecha_aprobacion: null, codigo_verificacion: 'CERT_joserodriguez_pend', calificacion_final: '88.0', estado: 'pendiente', aprobado_por: null, notas_admin: '', activo: true }
  ];
  seedCertificates.forEach(cert => { storage.certificados.push(cert); });

  storage.badges = [
    { id: 'primer_modulo', nombre: 'Primer Paso', descripcion: 'Completar primer modulo', icono: '🥇', color: '#d4a843', condicion: 'primer_modulo' },
    { id: 'puntaje_perfecto', nombre: 'Puntaje Perfecto', descripcion: '100% en alguna evaluacion', icono: '⚡', color: '#3b82f6', condicion: 'puntaje_perfecto' },
    { id: 'especialista_ia', nombre: 'Especialista IA', descripcion: 'Completar los 4 modulos', icono: '🎓', color: '#10b981', condicion: 'especialista_ia' },
    { id: 'rapido', nombre: 'Velocista', descripcion: 'Completar modulo en menos de 1 dia', icono: '🚀', color: '#ef4444', condicion: 'rapido' },
    { id: 'constante', nombre: 'Constante', descripcion: '5 o mas lecciones completadas', icono: '🔥', color: '#f59e0b', condicion: 'constante' },
    { id: 'certificado', nombre: 'Certificado', descripcion: 'Obtener certificado oficial', icono: '🏅', color: '#8b5cf6', condicion: 'certificado' }
  ];

  console.log(`✅ Data initialized: ${storage.usuarios.length} users, ${storage.modulos.length} modules, ${storage.lecciones.length} lessons`);
}

module.exports = { initializeSeed };