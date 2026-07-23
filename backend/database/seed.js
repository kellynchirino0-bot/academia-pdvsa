const { memoryStorage } = require('./connection');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    console.log('Iniciando seed de la base de datos...');

    // Usuarios de prueba
    const usuarios = [
        { cedula: 'V-00000000', nombre_completo: 'Administrador PDVSA', cargo: 'Coordinador Académico', correo: 'admin@nassergroup.com', password: 'admin123', rol_id: 1, telefono: '+58-412-1234567', empresa_filial: 'PDVSA Corp' },
        { cedula: 'V-12345678', nombre_completo: 'Carlos Mendoza', cargo: 'Instructor Senior de IA', correo: 'tutor@nassergroup.com', password: 'tutor123', rol_id: 2, telefono: '+58-414-8765432', empresa_filial: 'PDVSA Exploración' },
        { cedula: 'V-20123456', nombre_completo: 'María García', cargo: 'Líder de Proyecto', correo: 'maria.garcia@pdvsa.com', password: 'participante123', rol_id: 3, telefono: '+58-412-2223333', empresa_filial: 'PDVSA Producción' },
        { cedula: 'V-18987654', nombre_completo: 'José Rodríguez', cargo: 'Ingeniero de Petróleo', correo: 'jose.rodriguez@pdvsa.com', password: 'participante123', rol_id: 3, telefono: '+58-414-3334444', empresa_filial: 'PDVSA Refinación' },
        { cedula: 'V-21456789', nombre_completo: 'Ana Martínez', cargo: 'Analista de Datos', correo: 'ana.martinez@pdvsa.com', password: 'participante123', rol_id: 3, telefono: '+58-416-4445555', empresa_filial: 'PDVSA Tecnología' },
        { cedula: 'V-19876543', nombre_completo: 'Pedro López', cargo: 'Jefe de Mantenimiento', correo: 'pedro.lopez@pdvsa.com', password: 'participante123', rol_id: 3, telefono: '+58-418-5556666', empresa_filial: 'PDVSA Gas' }
    ];

    for (const u of usuarios) {
        const existe = memoryStorage.usuarios.find(ex => ex.cedula === u.cedula);
        if (!existe) {
            memoryStorage.usuarios.push({
                id: memoryStorage.usuarios.length + 1,
                ...u,
                password_hash: await bcrypt.hash(u.password, 10),
                activo: true,
                ultimo_acceso: null,
                creado_en: new Date().toISOString()
            });
        }
    }

    // Leads de prueba
    const leads = [
        { nombre_completo: 'Roberto Sánchez', email: 'roberto.sanchez@pdvsa.com', telefono: '+58-412-1111111', empresa_filial: 'PDVSA Maracaibo', cargo: 'Gerente de Operaciones', estado: 'nuevo', origen_registro: 'feria_industrial' },
        { nombre_completo: 'Carmen López', email: 'carmen.lopez@pdvsa.com', telefono: '+58-414-2222222', empresa_filial: 'PDVSA Puerto La Cruz', cargo: 'Ingeniera de Producción', estado: 'contactado', origen_registro: 'referido' },
        { nombre_completo: 'Luis Hernández', email: 'luis.hernandez@pdvsa.com', telefono: '+58-416-3333333', empresa_filial: 'PDVSA El Tigre', cargo: 'Supervisor de Planta', estado: 'inscrito', origen_registro: 'sitio_web' },
        { nombre_completo: 'Marta Fernández', email: 'marta.fernandez@pdvsa.com', telefono: '+58-418-4444444', empresa_filial: 'PDVSA Amuay', cargo: 'Coordinadora de Seguridad', estado: 'nuevo', origen_registro: 'linkedin' },
        { nombre_completo: 'Diego Vargas', email: 'diego.vargas@pdvsa.com', telefono: '+58-412-5555555', empresa_filial: 'PDVSA Bachaquero', cargo: 'Técnico Senior', estado: 'rechazado', origen_registro: 'correo_directo' },
        { nombre_completo: 'Laura Castillo', email: 'laura.castillo@pdvsa.com', telefono: '+58-414-6666666', empresa_filial: 'PDVSA San Tomé', cargo: 'Analista de Calidad', estado: 'contactado', origen_registro: 'webinar' }
    ];

    leads.forEach((lead, idx) => {
        const existe = memoryStorage.leads.find(l => l.email === lead.email);
        if (!existe) {
            memoryStorage.leads.push({
                id: memoryStorage.leads.length + 1,
                ...lead,
                notas_admin: '',
                usuario_creado_id: null,
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
    });

    // Módulos
    const modulos = [
        { numero_modulo: 1, titulo: 'Fundamentos de Inteligencia Artificial', descripcion: 'De la Regresión al Deep Learning. Redes Neuronales aplicadas a Geofísica y Mantenimiento Predictivo en BES.', icono: '🤖', duracion_horas: 10 },
        { numero_modulo: 2, titulo: 'Prompt Engineering para Sector Oil & Gas', descripcion: 'Estructura RICE, Zero-Shot, Few-Shot y Chain-of-Thought para reportes de perforación y auditorías.', icono: '💬', duracion_horas: 8 },
        { numero_modulo: 3, titulo: 'Gemelos Digitales en Industria Petrolera', descripcion: 'Réplicas virtuales, integración IoT con SCADA en refinerías y simulación de fluidos en tiempo real.', icono: '🏭', duracion_horas: 12 },
        { numero_modulo: 4, titulo: 'IA Generativa Aplicada a Petróleos', descripcion: 'LLMs, DALL-E/Stable Diffusion para inspección visual de corrosión y código Python para automatización.', icono: '🎨', duracion_horas: 10 }
    ];

    modulos.forEach(mod => {
        const existe = memoryStorage.modulos.find(m => m.numero_modulo === mod.numero_modulo);
        if (!existe) {
            memoryStorage.modulos.push({
                id: memoryStorage.modulos.length + 1,
                ...mod,
                created_at: new Date().toISOString()
            });
        }
    });

    // Lecciones
    const lecciones = [
        { modulo_id: 1, titulo: 'Introducción a la IA y su historia', orden: 1, contenido_markdown: '# Introducción a la IA\n\nLa Inteligencia Artificial ha evolucionado desde los sistemas basados en reglas hasta los modelos de deep learning modernos.\n\n## Conceptos Clave\n- **IA**: Capacidad de las máquinas para realizar tareas inteligentes\n- **Machine Learning**: Aprendizaje automático a partir de datos\n- **Deep Learning**: Redes neuronales profundas\n\n## Aplicación en PDVSA\nLa IA permite optimizar procesos de refinación, predecir fallas en equipos y mejorar la seguridad operacional.' },
        { modulo_id: 1, titulo: 'Redes Neuronales y Deep Learning', orden: 2, contenido_markdown: '# Redes Neuronales\n\n## Arquitectura Básica\n\n### Componentes:\n1. **Neuronas de entrada**: Reciben datos crudos\n2. **Capas ocultas**: Procesan la información\n3. **Neuronas de salida**: Producen predicciones\n\n## Aplicación en Geofísica\nLas CNN analizan datos sísmicos para identificar yacimientos.' },
        { modulo_id: 1, titulo: 'Mantenimiento Predictivo con IA', orden: 3, contenido_markdown: '# Mantenimiento Predictivo\n\n## Bombas Electrosumergibles (BES)\n\n### Datos de Sensores:\n- Temperatura del motor\n- Vibración\n- Corriente eléctrica\n- Presión de descarga\n\n### Modelo Predictivo\nSeries temporales para predecir fallas antes de que ocurran.' },
        { modulo_id: 2, titulo: 'Estructura RICE para Prompts', orden: 1, contenido_markdown: '# Estructura RICE\n\n## R - Rol\nDefine quién es el asistente\n\n## I - Instrucción\nQué debe hacer el modelo\n\n## C - Contexto\nInformación relevante\n\n## E - Ejemplo\nFormato esperado de respuesta' },
        { modulo_id: 2, titulo: 'Técnicas: Zero-Shot, Few-Shot, CoT', orden: 2, contenido_markdown: '# Técnicas de Prompting\n\n## Zero-Shot\nSin ejemplos previos\n\n## Few-Shot\n2-3 ejemplos antes de la solicitud\n\n## Chain-of-Thought\nRazonamiento paso a paso' },
        { modulo_id: 2, titulo: 'Laboratorio: Prompts para Auditorías', orden: 3, contenido_markdown: '# Laboratorio de Prompts\n\n## Plantilla para Auditoría PDVSA\n```\nROL: Auditor senior certificado ISO\nINSTRUCCIÓN: Auditar área de [ÁREA]\nCONTEXTO: Refinería, última auditoría [FECHA]\nFORMATO: Resumen, hallazgos, recomendaciones\n```' },
        { modulo_id: 3, titulo: 'Conceptos de Gemelos Digitales', orden: 1, contenido_markdown: '# Gemelos Digitales\n\n## Definición\nRéplica virtual exacta de un activo físico.\n\n## Componentes\n1. Modelo físico matemático\n2. Datos en tiempo real (IoT)\n3. Simulación predictiva\n4. Visualización interactiva' },
        { modulo_id: 3, titulo: 'Integración IoT con SCADA', orden: 2, contenido_markdown: '# Integración IoT - SCADA\n\n## Arquitectura\n- Nivel de Campo: Sensores\n- Nivel de Control: PLCs y RTUs\n- Nivel de Supervisión: SCADA\n- Nivel de Gemelo Digital: Simulación' },
        { modulo_id: 3, titulo: 'Simulación de Fluidos en Tiempo Real', orden: 3, contenido_markdown: '# Simulación de Fluidos\n\n## Modelos\n- Hidrodinámica (Navier-Stokes)\n- Termodinámica (Balance de energía)\n\n## Aplicación en Plantas de Fraccionamiento' },
        { modulo_id: 4, titulo: 'LLMs para Documentación Técnica', orden: 1, contenido_markdown: '# Large Language Models\n\n## GPT - Generative Pre-trained Transformer\n\n### Aplicación en PDVSA\n- Generación de informes\n- Resumen de documentos\n- Traducción de manuales' },
        { modulo_id: 4, titulo: 'Visión Artificial para Corrosión', orden: 2, contenido_markdown: '# Visión Artificial\n\n## DALL-E y Stable Diffusion\n\n### Proceso:\n1. Capturar imágenes de tuberías\n2. Procesar con modelos de visión\n3. Identificar patrones de corrosión\n4. Generar mapas de calor' },
        { modulo_id: 4, titulo: 'Python para Automatización Petrotécnica', orden: 3, contenido_markdown: '# Python en Petróleo\n\n## Procesamiento de Archivos LAS\n```python\nimport lasio\nimport pandas as pd\ncurves = lasio.read("pozo_ABC.las")\ndf = curves.df\n```' }
    ];

    lecciones.forEach((l, idx) => {
        const existe = memoryStorage.lecciones.find(
            ex => ex.modulo_id === l.modulo_id && ex.orden === l.orden
        );
        if (!existe) {
            memoryStorage.lecciones.push({
                id: memoryStorage.lecciones.length + 1,
                ...l,
                video_url: `https://videos.nassergroup.com/modulo${l.modulo_id}/leccion${l.orden}.mp4`,
                recursos_descargables: JSON.stringify([{ nombre: 'Guia del modulo.pdf', url: '#' }]),
                created_at: new Date().toISOString()
            });
        }
    });

    // Asignar tutor a participantes
    const participanteIds = memoryStorage.usuarios.filter(u => u.rol_id === 3).map(u => u.id);
    const tutorId = memoryStorage.usuarios.find(u => u.rol_id === 2)?.id;

    if (tutorId) {
        participanteIds.forEach(pid => {
            const existe = memoryStorage.asignaciones_tutores.find(
                a => a.tutor_id === tutorId && a.estudiante_id === pid && a.activa
            );
            if (!existe) {
                memoryStorage.asignaciones_tutores.push({
                    id: memoryStorage.asignaciones_tutores.length + 1,
                    tutor_id: tutorId,
                    estudiante_id: pid,
                    fecha_asignacion: new Date().toISOString(),
                    activa: true
                });
            }
        });
    }

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
                    { id: 4, pregunta: '¿Qué es un LLM?', opciones: ['Un modelo de lenguaje entrenado con grandes volúmenes de datos', 'Un tipo de hardware especializado', 'Un protocolo de red', 'Un sistema de refrigeración'], respuesta_correcta: 0 },
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
                    { id: 2, pregunta: '¿Qué significa SCADA?', opciones: ['Supervisory Control and Data Acquisition', 'Sistema Centralizado de Análisis', 'Sensor de Control y Adquisición', 'Software de Control de Acceso'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Cuál es el beneficio principal?', opciones: ['Simular sin riesgo operacional', 'Eliminar sensores', 'Reducir seguridad', 'Aumentar costos'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué tipo de datos usan?', opciones: ['Datos en tiempo real de sensores', 'Solo datos históricos', 'Solo imágenes', 'Solo texto'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Dónde se aplican en PDVSA?', opciones: ['Refinerías y plantas de fraccionamiento', 'Solo oficinas', 'Solo tiendas', 'Áreas de descanso'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            },
            {
                id: 4, titulo: 'Evaluación Módulo 4: IA Generativa',
                descripcion: 'Evaluación sobre IA generativa aplicada al sector petrolero',
                modulo: 'IA Generativa', ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es un LLM?', opciones: ['Large Language Model', 'Low Level Machine', 'Linear Learning Model', 'Linked List Management'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cómo se usa la visión artificial en corrosión?', opciones: ['Analizar imágenes para detectar patrones de deterioro', 'Crear arte digital', 'Diseñar edificios', 'Navegar por internet'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Qué librería Python se usa para archivos LAS?', opciones: ['lasio', 'pandas', 'numpy', 'matplotlib'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es Stable Diffusion?', opciones: ['Modelo de generación de imágenes por difusión', 'Una red neuronal para texto', 'Un protocolo de red', 'Un sistema operativo'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Cuál es la ventaja de Python en petróleo?', opciones: ['Librerías científicas y automatización', 'Es el más rápido', 'No necesita instalación', 'Es el más caro'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30, fecha_limite: '2026-12-31T23:59:59', activo: true, creado_en: new Date().toISOString()
            }
        ];
    }

    console.log('Seed completado exitosamente');
    console.log('================================');
    console.log('Credenciales de acceso:');
    console.log('Admin:   admin@nassergroup.com / admin123');
    console.log('Tutor:   tutor@nassergroup.com / tutor123');
    console.log('Alumno:  maria.garcia@pdvsa.com / participante123');
    console.log('================================');
};

seedDatabase().catch(console.error);

module.exports = { seedDatabase };
