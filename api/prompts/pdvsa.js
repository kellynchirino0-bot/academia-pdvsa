module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const bancoPrompts = [
    {
      id: "op-01",
      area: "Operaciones y Producci\u00f3n",
      problemaReal: "Falla Recurrente en Bombas Centr\u00edfugas (Campo Merey-1)",
      solucion: "Diagn\u00f3stico asistido y RCA en <2 min. Reducci\u00f3n de MTTR.",
      modeloIO: "An\u00e1lisis de Confiabilidad",
      promptText: "Act\u00faa como Ingeniero Senior de Confiabilidad. Analiza este historial de vibraciones y temperaturas de la bomba P-204A. Identifica la causa ra\u00edz probable, sugiere un plan de mantenimiento correctivo inmediato y genera una lista de verificaci\u00f3n (checklist) post-reparaci\u00f3n seg\u00fan normas API 610."
    },
    {
      id: "op-02",
      area: "Operaciones y Producci\u00f3n",
      problemaReal: "Parada de Planta Refiner\u00eda Amuay (Unidad de Destilaci\u00f3n)",
      solucion: "Optimizaci\u00f3n del tiempo de parada y c\u00e1lculo de ruta cr\u00edtica.",
      modeloIO: "CPM / PERT",
      promptText: "Genera un cronograma detallado para la parada mayor de la Unidad de Destilaci\u00f3n Atmosf\u00e9rica. Identifica la Ruta Cr\u00edtica, asigna recursos por d\u00eda y detecta cuellos de botella potenciales si la tarea 'Reemplazo de Intercambiadores E-301' se retrasa 2 d\u00edas."
    },
    {
      id: "op-03",
      area: "Operaciones y Producci\u00f3n",
      problemaReal: "Optimizaci\u00f3n de Mezcla de Crudo Pesado/Liviano",
      solucion: "Maximizaci\u00f3n de ingresos por barril exportado y uso eficiente de diluyentes.",
      modeloIO: "M\u00e9todo Simplex",
      promptText: "Tenemos crudo Merey (16\u00b0API) y Mesa (30\u00b0API). Necesitamos una mezcla para exportaci\u00f3n con m\u00ednimo 22\u00b0API y m\u00e1ximo 1.5% azufre. Calcula la proporci\u00f3n \u00f3ptima para maximizar el margen de refinaci\u00f3n considerando los costos actuales de diluyente."
    },
    {
      id: "log-01",
      area: "Inventarios y Log\u00edstica",
      problemaReal: "Gesti\u00f3n de Repuestos Cr\u00edticos (V\u00e1lvulas de Seguridad API 526)",
      solucion: "Punto de reorden y equilibrio entre inventario y riesgo de desabastecimiento.",
      modeloIO: "Modelo EOQ",
      promptText: "Calcula la Cantidad Econ\u00f3mica de Pedido (EOQ) y el Punto de Reorden para v\u00e1lvulas de seguridad PSV-4\", considerando: Demanda anual=120 uds, Costo pedido=$800, Costo almacenamiento=25%/a\u00f1o, Lead time=45 d\u00edas, Nivel de servicio deseado=98%."
    },
    {
      id: "fin-01",
      area: "Administraci\u00f3n, Finanzas y RRHH",
      problemaReal: "Auditor\u00eda Forense de Gastos Operativos",
      solucion: "Detecci\u00f3n proactiva de anomal\u00edas y fugas de capital.",
      modeloIO: "Estad\u00edstica Infinitesimal / IA",
      promptText: "Act\u00faa como Auditor Forense. Revisa este dataset de gastos de la Gerencia de Servicios Generales. Detecta patrones an\u00f3malos, duplicidades o desviaciones >15% vs presupuesto. Genera un memor\u00e1ndum ejecutivo confidencial con hallazgos prioritarios y recomendaciones de control interno."
    },
    {
      id: "hse-01",
      area: "Seguridad Industrial y HSE",
      problemaReal: "Protocolo de Respuesta Inmediata ante Derrame Mayor",
      solucion: "Respuesta estandarizada y mitigaci\u00f3n de impacto ambiental.",
      modeloIO: "\u00c1rboles de Decisi\u00f3n",
      promptText: "Genera un protocolo de respuesta inmediata ante derrame de crudo en cuerpo de agua en Lago de Maracaibo. Incluye: cadena de mando, equipos de contenci\u00f3n requeridos, procedimientos de notificaci\u00f3n a MINAMB y pasos de remediaci\u00f3n inicial seg\u00fan normativa vigente."
    }
  ];

  return res.status(200).json({
    exito: true,
    total: bancoPrompts.length,
    soberania: "Entorno Seguro GabrielBiz Galaxy - Trazabilidad LagoChain ML-DSA",
    data: bancoPrompts
  });
};