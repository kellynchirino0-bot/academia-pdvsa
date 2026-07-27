const COVENIN_KNOWLEDGE_BASE = [
  { ref: 'COVENIN 3049-93', titulo: 'Sistema de Mantenimiento — Inspección de Equipos', contenido: 'Define los intervalos de inspección, criterios de aceptación/rechazo y registros técnicos obligatorios para equipos estáticos y dinámicos en la industria petrolera. Aplica a bombas centrífugas, compresores, válvulas de seguridad, intercambiadores de calor y tanques de almacenamiento.', categorias: ['mantenimiento', 'inspeccion'] },
  { ref: 'COVENIN 200', titulo: 'Código Eléctrico Nacional — Instalaciones en Áreas Clasificadas', contenido: 'Establece los requisitos de diseño, instalación y mantenimiento de sistemas eléctricos en atmósferas explosivas (Clase I, Div 1 y 2). Especifica gabinetes a prueba de explosión (Explosion-Proof), sellos, puesta a tierra y protección intrínseca para equipos en áreas con presencia de hidrocarburos.', categorias: ['electrico', 'seguridad'] },
  { ref: 'PDVSA SI-1', titulo: 'Sistema de Información de Mantenimiento', contenido: 'Procedimiento corporativo PDVSA para la codificación de equipos, registro de órdenes de trabajo, historial de fallas y plan maestro de mantenimiento preventivo (PMP). Exige el uso de indicadores MTBF, MTTR y disponibilidad.', categorias: ['mantenimiento', 'gestion'] },
  { ref: 'COVENIN 3513-98', titulo: 'Sistema de Gestión de Seguridad y Salud Ocupacional', contenido: 'Lineamientos para la identificación de peligros, evaluación de riesgos, determinación de controles operacionales y planes de emergencia en instalaciones industriales. Base del sistema HSE en la industria petrolera venezolana.', categorias: ['hse', 'seguridad'] },
  { ref: 'PDVSA-HSE-01', titulo: 'Permiso de Trabajo en Caliente y en Altura', contenido: 'Formato estandarizado y lista de verificación para autorizar trabajos que involucren fuentes de ignición (soldadura, esmerilado) o ejecución en alturas >1.8m. Requiere evaluación de riesgos, bloqueo/etiquetado (LOTO) y supervisión directa.', categorias: ['hse', 'seguridad'] },
  { ref: 'API 610', titulo: 'Bombas Centrífugas para Servicio Petrolero', contenido: 'Especificación técnica para bombas centrífugas en refinerías y oleoductos. Abarca diseño hidráulico, materiales, sellos mecánicos, pruebas hidrostáticas y tolerancias de vibración. Límite de vibración aceptable: < 3.0 mm/s RMS.', categorias: ['mantenimiento', 'inspeccion'] },
  { ref: 'API 682', titulo: 'Sistemas de Sellos Mecánicos para Bombas', contenido: 'Clasificación de sellos mecánicos (Tipos A, B, C), sistemas de soporte (Planes 1-75) y procedimientos de instalación. El incumplimiento causa >60% de fallas prematuras en bombas centrífugas.', categorias: ['mantenimiento', 'inspeccion'] },
  { ref: 'NORSOK S-002', titulo: 'Sistema de Protección contra Incendios', contenido: 'Norma internacional adoptada por PDVSA para diseño de sistemas contra incendios en plataformas y refinerías. Incluye detección temprana, supresión con espuma/agua y rutas de evacuación.', categorias: ['hse', 'seguridad'] }
];

const systemContext = `Eres un Asistente Senior de Ingeniería y Mantenimiento certificado para PDVSA.
Tu conocimiento integra las normas COVENIN, PDVSA SI, API y HSE.
Debes responder con lenguaje técnico, preciso, citando las referencias normativas aplicables.
Estructura tus respuestas en: (1) Diagnóstico del problema, (2) Fundamento normativo, (3) Recomendaciones operativas.`;

function buscarContexto(query) {
  const terms = query.toLowerCase().split(' ');
  const results = COVENIN_KNOWLEDGE_BASE.filter(norma =>
    terms.some(t => norma.titulo.toLowerCase().includes(t) ||
      norma.contenido.toLowerCase().includes(t) ||
      norma.categorias.some(c => c.includes(t)) ||
      norma.ref.toLowerCase().includes(t))
  ).slice(0, 3);
  return results;
}

function generarRespuesta(query, contextos) {
  const ctx = contextos.map(c => `[${c.ref}] ${c.titulo}: ${c.contenido.substring(0, 200)}...`).join('\n');
  const lines = [
    `## Diagnóstico Técnico`,
    `Tras analizar su consulta: "${query}" y aplicar la base de conocimiento normativa:`,
    ``,
    ctx || 'No se encontraron referencias normativas específicas para esta consulta.',
    ``,
    `## Fundamento Normativo`,
    ...(contextos.length > 0
      ? contextos.map(c => `- **${c.ref}** — ${c.titulo}: aplica directamente a su caso.`)
      : ['- Se recomienda consultar las normas COVENIN 3049-93 o PDVSA SI-1 para mayores detalles.']),
    ``,
    `## Recomendaciones Operativas`,
    `1. Realice inspección visual según lo estipulado en la normativa aplicable.`,
    `2. Documente hallazgos en el formato correspondiente del Sistema de Información de Mantenimiento.`,
    `3. Si la falla persiste, ejecute análisis de causa raíz (RCA) y emita orden de trabajo correctiva.`,
    `4. Registre la intervención en LagoChain para asegurar trazabilidad y firma digital ML-DSA.`,
    ``,
    `---`,
    `*Asistente Senior PDVSA — Powered by GabrielBiz Galaxy | LagoChain ML-DSA (FIPS 204)*`
  ].join('\n');
  return lines;
}

module.exports = async (req, res) => {
  try {
    const { consulta } = req.body;
    if (!consulta || consulta.trim().length < 3) {
      return res.status(400).json({ exito: false, error: 'La consulta debe tener al menos 3 caracteres.' });
    }

    const contextos = buscarContexto(consulta);
    const respuesta = generarRespuesta(consulta, contextos);

    res.json({
      exito: true,
      consulta,
      timestamp: new Date().toISOString(),
      contexto_aplicado: contextos.map(c => c.ref),
      respuesta,
      normativas_relevantes: contextos.map(c => ({ ref: c.ref, titulo: c.titulo }))
    });
  } catch (err) {
    res.status(500).json({ exito: false, error: 'Error interno del Asistente Técnico: ' + err.message });
  }
};
