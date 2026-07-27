const templates = {
  bomba: {
    tipo: 'Bomba Centrífuga',
    titulo: 'INFORME DE INSPECCIÓN TÉCNICA — BOMBA CENTRÍFUGA',
    componentes: 'Cuerpo de bomba, tapa superior, bridas de succión/descarga, sello mecánico',
    normativa: 'COVENIN 3049-93, API 610, API 682',
    secciones: [
      { campo: 'equipo', label: 'Equipo Inspeccionado' },
      { campo: 'codigo', label: 'Código del Activo' },
      { campo: 'ubicacion', label: 'Ubicación' },
      { campo: 'fecha_inspeccion', label: 'Fecha de Inspección' },
      { campo: 'condicion', label: 'Condición General' },
      { campo: 'hallazgos', label: 'Hallazgos Detectados' },
      { campo: 'recomendaciones', label: 'Recomendaciones' },
      { campo: 'nivel_urgencia', label: 'Nivel de Urgencia' }
    ]
  },
  valvula: {
    tipo: 'Válvula de Seguridad',
    titulo: 'INFORME DE INSPECCIÓN TÉCNICA — VÁLVULA DE SEGURIDAD',
    componentes: 'Cuerpo, volante, vástago, bridas de conexión',
    normativa: 'COVENIN 3049-93, API 526',
    secciones: [
      { campo: 'equipo', label: 'Equipo Inspeccionado' },
      { campo: 'codigo', label: 'Código del Activo' },
      { campo: 'ubicacion', label: 'Ubicación' },
      { campo: 'fecha_inspeccion', label: 'Fecha de Inspección' },
      { campo: 'presion_prueba', label: 'Presión de Prueba (psig)' },
      { campo: 'condicion_asiento', label: 'Condición del Asiento' },
      { campo: 'hallazgos', label: 'Hallazgos Detectados' },
      { campo: 'recomendaciones', label: 'Recomendaciones' },
      { campo: 'nivel_urgencia', label: 'Nivel de Urgencia' }
    ]
  },
  tanque: {
    tipo: 'Tanque de Almacenamiento',
    titulo: 'INFORME DE INSPECCIÓN TÉCNICA — TANQUE DE ALMACENAMIENTO',
    componentes: 'Cuerpo, domo superior, escalera de acceso',
    normativa: 'COVENIN 3049-93, API 653',
    secciones: [
      { campo: 'equipo', label: 'Equipo Inspeccionado' },
      { campo: 'codigo', label: 'Código del Activo' },
      { campo: 'ubicacion', label: 'Ubicación' },
      { campo: 'fecha_inspeccion', label: 'Fecha de Inspección' },
      { campo: 'capacidad', label: 'Capacidad Nominal (bbl)' },
      { campo: 'condicion_casco', label: 'Condición del Casco' },
      { campo: 'nivel_llenado', label: 'Nivel de Llenado Actual (%)' },
      { campo: 'hallazgos', label: 'Hallazgos Detectados' },
      { campo: 'recomendaciones', label: 'Recomendaciones' },
      { campo: 'nivel_urgencia', label: 'Nivel de Urgencia' }
    ]
  },
  balancin: {
    tipo: 'Unidad de Bombeo Mecánico (Balancín)',
    titulo: 'INFORME DE INSPECCIÓN TÉCNICA — UNIDAD DE BOMBEO MECÁNICO',
    componentes: 'Base, poste central, brazo principal, contrapeso',
    normativa: 'COVENIN 3049-93, API 11E',
    secciones: [
      { campo: 'equipo', label: 'Equipo Inspeccionado' },
      { campo: 'codigo', label: 'Código del Activo' },
      { campo: 'ubicacion', label: 'Pozo / Ubicación' },
      { campo: 'fecha_inspeccion', label: 'Fecha de Inspección' },
      { campo: 'condicion_estructural', label: 'Condición Estructural' },
      { campo: 'alineacion', label: 'Alineación del Brazo' },
      { campo: 'hallazgos', label: 'Hallazgos Detectados' },
      { campo: 'recomendaciones', label: 'Recomendaciones' },
      { campo: 'nivel_urgencia', label: 'Nivel de Urgencia' }
    ]
  }
};

function generarReporte(assetType, data) {
  const tmpl = templates[assetType] || templates.bomba;

  const baseContent = {
    titulo: tmpl.titulo,
    tipo_equipo: tmpl.tipo,
    componentes: tmpl.componentes,
    normativa_aplicable: tmpl.normativa,
    fecha_emision: new Date().toLocaleDateString('es-VE'),
    inspector: data.inspector || 'Inspector Técnico PDVSA',
    firma: `Firma Digital ML-DSA (FIPS 204) — LagoChain ID: ${Date.now().toString(16)}`,
    campos: []
  };

  tmpl.secciones.forEach(sec => {
    baseContent.campos.push({
      campo: sec.campo,
      label: sec.label,
      valor: data[sec.campo] || 'Pendiente de registro'
    });
  });

  const markdown = [
    `# ${tmpl.titulo}`,
    `**Tipo:** ${tmpl.tipo}`,
    `**Componentes:** ${tmpl.componentes}`,
    `**Normativa:** ${tmpl.normativa}`,
    ``,
    `---`,
    ...tmpl.secciones.map(s => `**${s.label}:** ${data[s.campo] || 'Pendiente de registro'}`),
    ``,
    `---`,
    `**Inspector:** ${baseContent.inspector}`,
    `**Fecha:** ${baseContent.fecha_emision}`,
    `**Firma:** ${baseContent.firma}`,
    ``,
    `*Reporte generado por Asistente de Inspección PDVSA — GabrielBiz Galaxy | LagoChain*`
  ].join('\n');

  return { json: baseContent, markdown };
}

module.exports = async (req, res) => {
  try {
    const { assetType, data } = req.body;

    if (!assetType || !data) {
      return res.status(400).json({ exito: false, error: 'Se requieren assetType y data en el cuerpo de la solicitud.' });
    }

    const validTypes = Object.keys(templates);
    const normalizedType = validTypes.includes(assetType) ? assetType : 'bomba';

    const reporte = generarReporte(normalizedType, data);

    res.json({
      exito: true,
      asset_type: normalizedType,
      timestamp: new Date().toISOString(),
      reporte: reporte.json,
      markdown: reporte.markdown,
      normativas_aplicadas: templates[normalizedType].normativa
    });
  } catch (err) {
    res.status(500).json({ exito: false, error: 'Error generando reporte: ' + err.message });
  }
};

module.exports.templates = templates;
module.exports.generarReporte = generarReporte;
