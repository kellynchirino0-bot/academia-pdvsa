const { memoryStorage } = require('./connection');
const bcrypt = require('bcryptjs');

// Script de inicialización de datos de ejemplo
const initializeData = async () => {
    console.log('Inicializando datos de ejemplo...');

    // Crear evaluaciones de ejemplo si no existen
    if (memoryStorage.evaluaciones.length === 0) {
        memoryStorage.evaluaciones = [
            {
                id: 1,
                titulo: 'Evaluación Módulo 1: Fundamentos de IA',
                descripcion: 'Cuestionario sobre conceptos básicos de Inteligencia Artificial',
                modulo: 'Fundamentos IA',
                ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es la Inteligencia Artificial?', opciones: ['Una rama de la informática que crea sistemas inteligentes', 'Un tipo de robot industrial', 'Un software de oficina', 'Un lenguaje de programación'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cuál es el objetivo principal de la IA en PDVSA?', opciones: ['Reemplazar trabajadores', 'Optimizar procesos y mejorar la toma de decisiones', 'Crear entretenimiento', 'Diseñar páginas web'], respuesta_correcta: 1 },
                    { id: 3, pregunta: '¿Qué es un Gemelo Digital?', opciones: ['Una copia virtual de un activo o proceso físico', 'Un videojuego de simulación', 'Un tipo de base de datos', 'Un sistema operativo'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es un LLM (Large Language Model)?', opciones: ['Un modelo de lenguaje entrenado con grandes volúmenes de datos', 'Un tipo de hardware especializado', 'Un protocolo de red', 'Un sistema de refrigeración'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Qué significa GPT?', opciones: ['Generative Pre-trained Transformer', 'Global Petroleum Technology', 'General Processing Terminal', 'Graphics Performance Tool'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30,
                fecha_limite: '2026-12-31T23:59:59',
                activo: true,
                creado_en: new Date().toISOString()
            },
            {
                id: 2,
                titulo: 'Evaluación Módulo 2: Prompt Engineering',
                descripcion: 'Evaluación práctica de diseño de prompts efectivos',
                modulo: 'Prompt Engineering',
                ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Qué es un prompt en IA generativa?', opciones: ['Una instrucción o petición al modelo', 'Un tipo de base de datos', 'Un dispositivo de entrada', 'Un lenguaje de programación'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Cuál es la estructura de un prompt efectivo?', opciones: ['Contexto + Instrucción + Formato esperado', 'Solo una palabra clave', 'Un número aleatorio', 'Una imagen'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Para qué se aplica Prompt Engineering en PDVSA?', opciones: ['Generar informes técnicos y auditorías', 'Jugar videojuegos', 'Diseñar logos', 'Navegar en internet'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es un prompt de sistema?', opciones: ['Instrucción que define el comportamiento del asistente', 'Un tipo de prompt para usuarios finales', 'Una función de Excel', 'Un error del sistema'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Cómo se optimiza un prompt?', opciones: ['Iterando, refinando y proporcionando contexto claro', 'No se puede optimizar', 'Usando solo mayúsculas', 'Agregando caracteres especiales'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30,
                fecha_limite: '2026-12-31T23:59:59',
                activo: true,
                creado_en: new Date().toISOString()
            },
            {
                id: 3,
                titulo: 'Evaluación Módulo 3: IA en Industria Petrolera',
                descripcion: 'Evaluación sobre aplicaciones de IA en el sector Oil & Gas',
                modulo: 'IA en Petróleo',
                ponderacion: 100,
                preguntas: [
                    { id: 1, pregunta: '¿Cómo se aplica la IA en la exploración sísmica?', opciones: ['Análisis predictivo de yacimientos', 'Diseño de interiores', 'Marketing digital', 'Gestión de redes sociales'], respuesta_correcta: 0 },
                    { id: 2, pregunta: '¿Qué son los Gemelos Digitales en petróleo?', opciones: ['Réplicas virtuales de pozos y instalaciones', 'Documentos impresos', 'Reuniones de equipo', 'Tipo de combustible'], respuesta_correcta: 0 },
                    { id: 3, pregunta: '¿Cuál es el beneficio de la IA en mantenimiento?', opciones: ['Mantenimiento predictivo que reduce costos', 'Aumentar el consumo de energía', 'Eliminar todos los equipos', 'Reducir la seguridad'], respuesta_correcta: 0 },
                    { id: 4, pregunta: '¿Qué es la visión artificial aplicada a inspección?', opciones: ['Uso de cámaras y algoritmos para detectar fallas', 'Un tipo de gafas de seguridad', 'Una herramienta de dibujo', 'Un sistema de ventilación'], respuesta_correcta: 0 },
                    { id: 5, pregunta: '¿Cómo la IA mejora la seguridad operacional?', opciones: ['Detección temprana de anomalías y riesgos', 'Eliminando protocolos de seguridad', 'Aumentando accidentes', 'Reduciendo la capacitación'], respuesta_correcta: 0 }
                ],
                tiempo_limite_minutos: 30,
                fecha_limite: '2026-12-31T23:59:59',
                activo: true,
                creado_en: new Date().toISOString()
            }
        ];
        console.log(`${memoryStorage.evaluaciones.length} evaluaciones creadas`);
    }

    console.log('Inicialización completada');
    console.log('Credenciales de administrador: admin@nassergroup.com / admin123');
};

// Ejecutar inicialización
initializeData().catch(console.error);

module.exports = { initializeData };
