const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let useInMemoryStorage = true;

try {
    pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'academia_nasser',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    pool.on('connect', () => {
        useInMemoryStorage = false;
        console.log('Conectado a PostgreSQL');
    });

    pool.on('error', (err) => {
        console.log('PostgreSQL no disponible, usando almacenamiento en memoria');
        useInMemoryStorage = true;
    });
} catch (error) {
    console.log('PostgreSQL no disponible, usando almacenamiento en memoria');
    useInMemoryStorage = true;
}

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

const initializeData = async () => {
    const bcrypt = require('bcryptjs');

    // Admin
    if (!memoryStorage.usuarios.find(u => u.cedula === 'V-00000000')) {
        memoryStorage.usuarios.push({
            id: 1, cedula: 'V-00000000', nombre_completo: 'Administrador PDVSA',
            cargo: 'Coordinador Académico', correo: 'admin@nassergroup.com',
            password_hash: await bcrypt.hash('admin123', 10), rol_id: 1, activo: true,
            telefono: '+58-412-1234567', empresa_filial: 'PDVSA Corp', creado_en: new Date().toISOString()
        });
    }

    // Tutor
    if (!memoryStorage.usuarios.find(u => u.cedula === 'V-12345678')) {
        memoryStorage.usuarios.push({
            id: 2, cedula: 'V-12345678', nombre_completo: 'Carlos Mendoza',
            cargo: 'Instructor Senior de IA', correo: 'tutor@nassergroup.com',
            password_hash: await bcrypt.hash('tutor123', 10), rol_id: 2, activo: true,
            telefono: '+58-414-8765432', empresa_filial: 'PDVSA Exploración', creado_en: new Date().toISOString()
        });
    }

    // Participantes de prueba
    const participantes = [
        { id: 3, cedula: 'V-20123456', nombre_completo: 'María García', cargo: 'Líder de Proyecto', correo: 'maria.garcia@pdvsa.com', empresa_filial: 'PDVSA Producción' },
        { id: 4, cedula: 'V-18987654', nombre_completo: 'José Rodríguez', cargo: 'Ingeniero de Petróleo', correo: 'jose.rodriguez@pdvsa.com', empresa_filial: 'PDVSA Refinación' },
        { id: 5, cedula: 'V-21456789', nombre_completo: 'Ana Martínez', cargo: 'Analista de Datos', correo: 'ana.martinez@pdvsa.com', empresa_filial: 'PDVSA Tecnología' },
        { id: 6, cedula: 'V-19876543', nombre_completo: 'Pedro López', cargo: 'Jefe de Mantenimiento', correo: 'pedro.lopez@pdvsa.com', empresa_filial: 'PDVSA Gas' },
        { id: 7, cedula: 'V-22345678', nombre_completo: 'Estudiante PDVSA', cargo: 'Participante', correo: 'estudiante@pdvsa.com', empresa_filial: 'PDVSA Corp' }
    ];

    for (const p of participantes) {
        if (!memoryStorage.usuarios.find(u => u.cedula === p.cedula)) {
            // Estudiante usa password user123, los demas usan participante123
            const userPassword = p.correo === 'estudiante@pdvsa.com' ? 'user123' : 'participante123';
            memoryStorage.usuarios.push({
                ...p, password_hash: await bcrypt.hash(userPassword, 10), rol_id: 3, activo: true,
                telefono: '+58-412-' + Math.floor(1000000 + Math.random() * 9000000),
                creado_en: new Date().toISOString()
            });
        }
    }

    // Leads de prueba
    const leadsData = [
        { nombre_completo: 'Roberto Sánchez', email: 'roberto.sanchez@pdvsa.com', telefono: '+58-412-1111111', empresa_filial: 'PDVSA Maracaibo', cargo: 'Gerente de Operaciones', estado: 'nuevo', origen_registro: 'feria_industrial' },
        { nombre_completo: 'Carmen López', email: 'carmen.lopez@pdvsa.com', telefono: '+58-414-2222222', empresa_filial: 'PDVSA Puerto La Cruz', cargo: 'Ingeniera de Producción', estado: 'contactado', origen_registro: 'referido' },
        { nombre_completo: 'Luis Hernández', email: 'luis.hernandez@pdvsa.com', telefono: '+58-416-3333333', empresa_filial: 'PDVSA El Tigre', cargo: 'Supervisor de Planta', estado: 'inscrito', origen_registro: 'sitio_web' },
        { nombre_completo: 'Marta Fernández', email: 'marta.fernandez@pdvsa.com', telefono: '+58-418-4444444', empresa_filial: 'PDVSA Amuay', cargo: 'Coordinadora de Seguridad', estado: 'nuevo', origen_registro: 'linkedin' },
        { nombre_completo: 'Diego Vargas', email: 'diego.vargas@pdvsa.com', telefono: '+58-412-5555555', empresa_filial: 'PDVSA Bachaquero', cargo: 'Técnico Senior', estado: 'rechazado', origen_registro: 'correo_directo' },
        { nombre_completo: 'Laura Castillo', email: 'laura.castillo@pdvsa.com', telefono: '+58-414-6666666', empresa_filial: 'PDVSA San Tomé', cargo: 'Analista de Calidad', estado: 'contactado', origen_registro: 'webinar' }
    ];

    leadsData.forEach((lead, idx) => {
        if (!memoryStorage.leads.find(l => l.email === lead.email)) {
            memoryStorage.leads.push({
                id: idx + 1, ...lead, notas_admin: '', usuario_creado_id: null,
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
    });

    // Módulos del curso
    const modulosData = [
        { id: 1, numero_modulo: 1, titulo: 'Fundamentos de Inteligencia Artificial', descripcion: 'De la Regresión al Deep Learning. Redes Neuronales aplicadas a Geofísica y Mantenimiento Predictivo.', icono: '🤖', duracion_horas: 10 },
        { id: 2, numero_modulo: 2, titulo: 'Prompt Engineering para Sector Oil & Gas', descripcion: 'Estructura RICE, Zero-Shot, Few-Shot y Chain-of-Thought para reportes de perforación y auditorías.', icono: '💬', duracion_horas: 8 },
        { id: 3, numero_modulo: 3, titulo: 'Gemelos Digitales en Industria Petrolera', descripcion: 'Réplicas virtuales, integración IoT con SCADA en refinerías y simulación de fluidos en tiempo real.', icono: '🏭', duracion_horas: 12 },
        { id: 4, numero_modulo: 4, titulo: 'IA Generativa Aplicada a Petróleos', descripcion: 'LLMs, DALL-E/Stable Diffusion para inspección visual de corrosión y código Python para automatización petrotécnica.', icono: '🎨', duracion_horas: 10 }
    ];

    modulosData.forEach(mod => {
        if (!memoryStorage.modulos.find(m => m.id === mod.id)) {
            memoryStorage.modulos.push({ ...mod, created_at: new Date().toISOString() });
        }
    });

    // Lecciones por módulo
    const leccionesData = [
        // Módulo 1
        { modulo_id: 1, titulo: 'Introducción a la IA y su historia', orden: 1, contenido_markdown: '# Introducción a la IA\n\nLa Inteligencia Artificial ha evolucionado desde los sistemas basados en reglas hasta los modelos de deep learning modernos.\n\n## Conceptos Clave\n- **IA**: Capacidad de las máquinas para realizar tareas inteligentes\n- **Machine Learning**: Aprendizaje automático a partir de datos\n- **Deep Learning**: Redes neuronales profundas\n\n## Aplicación en PDVSA\nLa IA permite optimizar procesos de refinación, predecir fallas en equipos y mejorar la seguridad operacional.' },
        { modulo_id: 1, titulo: 'Redes Neuronales y Deep Learning', orden: 2, contenido_markdown: '# Redes Neuronales\n\n## Arquitectura Básica\nUna red neuronal artificial imita la estructura del cerebro humano.\n\n### Componentes:\n1. **Neuronas de entrada**: Reciben datos crudos\n2. **Capas ocultas**: Procesan la información\n3. **Neuronas de salida**: Producen predicciones\n\n## Aplicación en Geofísica\nLas redes neuronales convolucionales (CNN) analizan datos sísmicos para identificar yacimientos.' },
        { modulo_id: 1, titulo: 'Mantenimiento Predictivo con IA', orden: 3, contenido_markdown: '# Mantenimiento Predictivo\n\n## Bombas Electrosumergibles (BES)\n\n### Datos de Sensores:\n- Temperatura del motor\n- Vibración\n- Corriente eléctrica\n- Presión de descarga\n\n### Modelo Predictivo\nUtilizamos series temporales para predecir fallas antes de que ocurran, reduciendo tiempo de parada no programado.' },
        // Módulo 2
        { modulo_id: 2, titulo: 'Estructura RICE para Prompts', orden: 1, contenido_markdown: '# Estructura RICE\n\n## R - Rol\nDefine quién es el asistente: "Actúa como ingeniero petrolero senior con 20 años de experiencia"\n\n## I - Instrucción\nQué debe hacer: "Genera un informe técnico sobre el estado del pozo"\n\n## C - Contexto\nInformación relevante: "El pozo ABC-123 tiene 15 años de producción"\n\n## E - Ejemplo\nFormato esperado: "Estructura类似 este ejemplo..."' },
        { modulo_id: 2, titulo: 'Técnicas: Zero-Shot, Few-Shot, Chain-of-Thought', orden: 2, contenido_markdown: '# Técnicas de Prompting\n\n## Zero-Shot\nSin ejemplos previos. El modelo responde directamente.\n\n## Few-Shot\nProporciona 2-3 ejemplos antes de la solicitud.\n\n## Chain-of-Thought\nPide al modelo que razone paso a paso antes de responder.\n\n### Aplicación PDVSA\nPara auditorías operacionales, usar Chain-of-Thought asegura análisis completos y estructurados.' },
        { modulo_id: 2, titulo: 'Laboratorio: Prompts para Auditorías PDVSA', orden: 3, contenido_markdown: '# Laboratorio de Prompts\n\n## Plantilla para Auditoría Operacional\n\n```\nROL: Eres un auditor senior certificado en normas ISO para la industria petrolera.\n\nINSTRUCCIÓN: Realiza una auditoría operacional del área de [ÁREA].\n\nCONTEXTO:\n- Ubicación: [REFINERÍA/PLANTA]\n- Última auditoría: [FECHA]\n- Hallazgos previos: [LISTA]\n\nFORMATO:\n1. Resumen ejecutivo\n2. Hallazgos por categoría\n3. Recomendaciones\n4. Plan de acción\n```\n\n## Ejercicio Práctico\nDiseña un prompt para auditar el sistema de control de emisiones.' },
        // Módulo 3
        { modulo_id: 3, titulo: 'Conceptos de Gemelos Digitales', orden: 1, contenido_markdown: '# Gemelos Digitales\n\n## Definición\nUn Gemelo Digital es una réplica virtual exacta de un activo físico, proceso o sistema.\n\n## Componentes\n1. **Modelo físico**: Representación matemática del activo\n2. **Datos en tiempo real**: Sensores IoT\n3. **Simulación**: Predicción de comportamiento futuro\n4. **Visualización**: Dashboard interactivo\n\n## Aplicación en Refinerías\nLos gemelos digitales permiten simular procesos de refinación sin riesgo operacional.' },
        { modulo_id: 3, titulo: 'Integración IoT con SCADA', orden: 2, contenido_markdown: '# Integración IoT - SCADA\n\n## Arquitectura\n\n### Nivel de Campo\n- Sensores de presión, temperatura, caudal\n- Transmisores analógicos/digitales\n\n### Nivel de Control\n- PLCs (Controladores Lógicos Programables)\n- RTUs (Unidades Terminales Remotas)\n\n### Nivel de Supervisión\n- SCADA (Supervisory Control and Data Acquisition)\n- Historiadores de datos\n\n### Nivel de Gemelo Digital\n- Plataforma de integración\n- Motor de simulación\n- Dashboard web' },
        { modulo_id: 3, titulo: 'Simulación de Fluidos en Tiempo Real', orden: 3, contenido_markdown: '# Simulación de Fluidos\n\n## Modelos de Simulación\n\n### Hidrodinámica\n- Ecuaciones de Navier-Stokes\n- Modelos de turbulencia\n\n### Termodinámica\n- Balance de energía\n- Transferencia de calor\n\n## Aplicación en Plantas de Fraccionamiento\nLa simulación permite optimizar la separación de componentes del petróleo crudo.' },
        // Módulo 4
        { modulo_id: 4, titulo: 'LLMs para Documentación Técnica', orden: 1, contenido_markdown: '# Large Language Models\n\n## Modelos de Lenguaje\n\n### GPT (Generative Pre-trained Transformer)\n- Entrenado en corpus masivos de texto\n- Capaz de generar, resumir y analizar texto\n\n### Aplicación en PDVSA\n- Generación automática de informes técnicos\n- Resumen de documentos extensos\n- Traducción de manuales técnicos\n\n## Mejores Prácticas\n1. Ser específico en las instrucciones\n2. Proporcionar contexto relevante\n3. Validar respuestas con expertos' },
        { modulo_id: 4, titulo: 'Visión Artificial para Inspección de Corrosión', orden: 2, contenido_markdown: '# Visión Artificial\n\n## DALL-E y Stable Diffusion\n\n### Análisis Visual de Corrosión\n1. Capturar imágenes de tuberías/ductos\n2. Procesar con modelos de visión artificial\n3. Identificar patrones de corrosión\n4. Generar mapas de calor de severidad\n\n### Modelos de Detección\n- CNN para clasificación de defectos\n- Segmentación semántica para medición\n- Transfer Learning con datasets industriales' },
        { modulo_id: 4, titulo: 'Python para Automatización Petrotécnica', orden: 3, contenido_markdown: '# Python en Petróleo\n\n## Procesamiento de Archivos LAS\n\n```python\nimport lasio\nimport pandas as pd\n\n# Leer archivo LAS\ncurvas = lasio.read("pozo_ABC.las")\ndf = curves.df\n\n# Análisis de curvas\ntemperatura = df[\"TEMP\"]\nresistividad = df[\"RT\"]\n\n# Visualización\nimport matplotlib.pyplot as plt\nplt.figure(figsize=(12, 6))\nplt.plot(temperatura, resistividad)\nplt.xlabel("Temperatura (°F)")\nplt.ylabel("Resistividad (ohm·m)")\nplt.title("Perfil del Pozo ABC")\nplt.show()\n```\n\n## Ejercicio\nCrea un script que compare registros de dos pozos adyacentes.' }
    ];

    leccionesData.forEach((leccion, idx) => {
        const existingLeccion = memoryStorage.lecciones.find(l => l.modulo_id === leccion.modulo_id && l.orden === leccion.orden);
        if (!existingLeccion) {
            memoryStorage.lecciones.push({
                id: idx + 1, ...leccion,
                video_url: `https://videos.nassergroup.com/modulo${leccion.modulo_id}/leccion${leccion.orden}.mp4`,
                recursos_descargables: JSON.stringify([{ nombre: 'Guia del modulo.pdf', url: '#' }]),
                created_at: new Date().toISOString()
            });
        }
    });

    // Asignar tutor a participantes
    const participanteIds = [3, 4, 5, 6];
    participanteIds.forEach(pid => {
        const exists = memoryStorage.asignaciones_tutores.find(a => a.tutor_id === 2 && a.estudiante_id === pid);
        if (!exists) {
            memoryStorage.asignaciones_tutores.push({
                id: memoryStorage.asignaciones_tutores.length + 1,
                tutor_id: 2, estudiante_id: pid,
                fecha_asignacion: new Date().toISOString(), activa: true
            });
        }
    });

    // Evaluaciones de ejemplo
    if (memoryStorage.evaluaciones.length === 0) {
        memoryStorage.evaluaciones = [
            {
                id: 1, titulo: 'Evaluación Módulo 1: Fundamentos de IA',
                descripcion: 'Cuestionario sobre conceptos básicos de Inteligencia Artificial',
                modulo: 'Fundamentos IA', ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es la Inteligencia Artificial?', opciones: ['Una rama de la informática que crea sistemas inteligentes', 'Un tipo de robot industrial', 'Un software de oficina', 'Un lenguaje de programación'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cuál es el objetivo principal de la IA en PDVSA?', opciones: ['Reemplazar trabajadores', 'Optimizar procesos y mejorar la toma de decisiones', 'Crear entretenimiento', 'Diseñar páginas web'], respuesta_correcta: 1 },
                    { id: 3, pregunta: '¿Qué es un Gemelo Digital?', opciones: ['Una copia virtual de un activo o proceso físico', 'Un videojuego de simulación', 'Un tipo de base de datos', 'Un sistema operativo'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es un LLM (Large Language Model)?', opciones: ['Un modelo de lenguaje entrenado con grandes volúmenes de datos', 'Un tipo de hardware especializado', 'Un protocolo de red', 'Un sistema de refrigeración'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Qué significa GPT?', opciones: ['Generative Pre-trained Transformer', 'Global Petroleum Technology', 'General Processing Terminal', 'Graphics Performance Tool'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            },
            {
                id: 2, titulo: 'Evaluación Módulo 2: Prompt Engineering',
                descripcion: 'Evaluación práctica de diseño de prompts efectivos',
                modulo: 'Prompt Engineering', ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es un prompt en IA generativa?', opciones: ['Una instrucción o petición al modelo', 'Un tipo de base de datos', 'Un dispositivo de entrada', 'Un lenguaje de programación'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cuál es la estructura RICE?', opciones: ['Rol, Instrucción, Contexto, Ejemplo', 'Red, Internet, Conexión, Ethernet', 'Rápido, Intuitivo, Creativo, Efectivo', 'Registro, Investigación, Control, Evaluación'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Para qué se aplica Prompt Engineering en PDVSA?', opciones: ['Generar informes técnicos y auditorías', 'Jugar videojuegos', 'Diseñar logos', 'Navegar en internet'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es Chain-of-Thought?', opciones: ['Pensamiento encadenado paso a paso', 'Una red neuronal', 'Un tipo de prompt para imágenes', 'Un protocolo de comunicación'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Cómo se optimiza un prompt?', opciones: ['Iterando, refinando y proporcionando contexto claro', 'No se puede optimizar', 'Usando solo mayúsculas', 'Agregando caracteres especiales'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            },
            {
                id: 3, titulo: 'Evaluación Módulo 3: Gemelos Digitales',
                descripcion: 'Evaluación sobre gemelos digitales en la industria petrolera',
                modulo: 'Gemelos Digitales', ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es un Gemelo Digital?', opciones: ['Réplica virtual de un activo físico', 'Un tipo de sensor IoT', 'Un software de contabilidad', 'Un protocolo SCADA'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Qué significa SCADA?', opciones: ['Supervisory Control and Data Acquisition', 'Sistema Centralizado de Análisis de Datos Automatizados', 'Sensor de Control y Adquisición de Datos Avanzados', 'Software de Control de Acceso y Datos'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Cuál es el beneficio principal?', opciones: ['Simular sin riesgo operacional', 'Eliminar todos los sensores', 'Reducir la seguridad', 'Aumentar costos'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué tipo de datos usan los gemelos?', opciones: ['Datos en tiempo real de sensores', 'Solo datos históricos', 'Solo imágenes', 'Solo texto'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Dónde se aplican los gemelos en PDVSA?', opciones: ['Refinerías y plantas de fraccionamiento', 'Solo oficinas administrativas', 'Solo en tiendas', 'En áreas de descanso'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            },
            {
                id: 4, titulo: 'Evaluación Módulo 4: IA Generativa',
                descripcion: 'Evaluación sobre IA generativa aplicada al sector petrolero',
                modulo: 'IA Generativa', ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es un LLM?', opciones: ['Large Language Model - Modelo de Lenguaje Grande', 'Low Level Machine - Máquina de Bajo Nivel', 'Linear Learning Model', 'Linked List Management'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cómo se usa la visión artificial en corrosión?', opciones: ['Analizar imágenes para detectar patrones de deterioro', 'Crear arte digital', 'Diseñar edificios', 'Navegar por internet'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Qué librería Python se usa para archivos LAS?', opciones: ['lasio', 'pandas', 'numpy', 'matplotlib'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es Stable Diffusion?', opciones: ['Modelo de generación de imágenes por difusión', 'Un tipo de red neuronal para texto', 'Un protocolo de red', 'Un sistema operativo'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Cuál es la ventaja de Python en petróleo?', opciones: ['Librerías científicas y automatización', 'Es el más rápido', 'No necesita instalación', 'Es gratuito y open source'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            }
        ];
    }

    console.log('Datos inicializados correctamente');
    console.log('Credenciales Admin: admin@nassergroup.com / admin123');
    console.log('Credenciales Tutor: tutor@nassergroup.com / tutor123');
};

initializeData().catch(console.error);

module.exports = { pool, useInMemoryStorage, memoryStorage };
