import React, { useState } from 'react';
import { Send, Copy, Download, RotateCcw, Sparkles, FileText, TrendingUp, Shield, BarChart3, BookOpen, CheckCircle, DollarSign, Users, Megaphone, Calculator, Brain, GitBranch, Package, Route } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const SimuladorTexto = () => {
  const [prompt, setPrompt] = useState('');
  const [contexto, setContexto] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('memorandum');
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [areaFuncional, setAreaFuncional] = useState('todas');

  const areasFuncionales = [
    { value: 'todas', label: 'Todas las Áreas', icon: <Brain size={16} />, color: '#003366' },
    { value: 'finanzas', label: 'Finanzas', icon: <DollarSign size={16} />, color: '#10b981' },
    { value: 'contabilidad', label: 'Contabilidad', icon: <Calculator size={16} />, color: '#3b82f6' },
    { value: 'rrhh', label: 'Talento Humano', icon: <Users size={16} />, color: '#f59e0b' },
    { value: 'marketing', label: 'Marketing', icon: <Megaphone size={16} />, color: '#8b5cf6' },
    { value: 'io', label: 'Investigación de Operaciones', icon: <GitBranch size={16} />, color: '#0891b2' }
  ];

  const tiposDocumento = [
    { value: 'memorandum', label: 'Memorandum Ejecutivo', icon: <FileText size={16} /> },
    { value: 'analisis_riesgos', label: 'Análisis de Riesgos', icon: <Shield size={16} /> },
    { value: 'matriz_decision', label: 'Matriz de Decisión', icon: <BarChart3 size={16} /> },
    { value: 'informe_gerencial', label: 'Informe Gerencial', icon: <TrendingUp size={16} /> }
  ];

  const plantillasPorArea = {
    finanzas: [
      {
        id: 'fin1',
        titulo: 'Análisis de Desviación Presupuestaria',
        icon: <DollarSign size={16} />,
        color: '#10b981',
        area: 'Finanzas',
        plantilla: `[ROL]: Actúa como Director Financiero de PDVSA.
[CONTEXTO]: Se ha detectado una desviación del [X]% en el presupuesto del área de [Nombre Área] durante el período [Trimestre/Año].
[TAREA]: Evalúa el siguiente plan de gastos [Pegar Datos] y genera:
1. Matriz de costo-beneficio por categoría de gasto.
2. Identificación de las 3 partidas con mayor desviación.
3. Proyección de flujo de caja para los próximos 3 meses.
4. Recomendaciones de reasignación presupuestaria.
FORMATO: Tabla ejecutiva con indicadores financieros clave.`
      },
      {
        id: 'fin2',
        titulo: 'Evaluación de ROI en Proyectos Petroleros',
        icon: <TrendingUp size={16} />,
        color: '#059669',
        area: 'Finanzas',
        plantilla: `[ROL]: Actúa como Analista de Inversiones Senior.
[CONTEXTO]: Se presenta el siguiente proyecto de inversión: [Descripción del Proyecto].
[TAREA]: Calcula y presenta:
1. ROI proyectado a 1, 3 y 5 años.
2. Tasa de retorno interno (TIR) estimada.
3. Período de recuperación de la inversión.
4. Análisis de sensibilidad con 3 escenarios.
FORMATO: Ficha de inversión ejecutiva con gráficos de tendencia.`
      }
    ],
    contabilidad: [
      {
        id: 'cont1',
        titulo: 'Auditoría de Inconsistencias Contables',
        icon: <Calculator size={16} />,
        color: '#3b82f6',
        area: 'Contabilidad',
        plantilla: `[ROL]: Actúa como Auditor Senior certificado con 15 años de experiencia.
[CONTEXTO]: Se requiere revisar el siguiente listado de asientos contables del período [Período].
[TAREA]: Identifica:
1. Inconsistencias y partidas sospechosas.
2. Riesgos de incumplimiento normativo (NIIF/CPC).
3. Oportunidades de optimización fiscal.
4. Recomendaciones de ajuste contable.
FORMATO: Informe de auditoría con clasificación de riesgos (Alto/Medio/Bajo).`
      },
      {
        id: 'cont2',
        titulo: 'Cumplimiento Normativo y Facturación',
        icon: <Shield size={16} />,
        color: '#2563eb',
        area: 'Contabilidad',
        plantilla: `[ROL]: Actúa como Especialista en Cumplimiento Tributario.
[CONTEXTO]: Revisar la facturación del período [Fecha] para el área de [Nombre].
[TAREA]: Evalúa:
1. Cumplimiento de obligaciones fiscales.
2. Conciliación de facturas con pagos registrados.
3. Detección de anomalías en la facturación.
4. Acciones correctivas inmediatas.
FORMATO: Dashboard de cumplimiento con semáforo de riesgo.`
      }
    ],
    rrhh: [
      {
        id: 'rrhh1',
        titulo: 'Evaluación de Desempeño y Planificación',
        icon: <Users size={16} />,
        color: '#f59e0b',
        area: 'Talento Humano',
        plantilla: `[ROL]: Actúa como Gerente de Recursos Humanos de PDVSA.
[CONTEXTO]: Se presenta la siguiente situación de personal: [Descripción].
[TAREA]: Desarrolla:
1. Evaluación de desempeño del personal involucrado.
2. Plan de contingencia para redistribuir cargas de trabajo.
3. Identificación de necesidades de capacitación urgente.
4. Propuesta de incentivos para retención de talento.
FORMATO: Plan de acción ejecutivo con cronograma de 30/60/90 días.`
      },
      {
        id: 'rrhh2',
        titulo: 'Análisis de Clima Organizacional',
        icon: <Megaphone size={16} />,
        color: '#d97706',
        area: 'Talento Humano',
        plantilla: `[ROL]: Actúa como Especialista en Organización y Métodos.
[CONTEXTO]: Se realizó una encuesta de clima organizacional con [N] respuestas del área de [Nombre].
[TAREA]: Analiza los resultados y presenta:
1. Top 3 fortalezas organizacionales.
2. Top 3 áreas de mejora con plan de acción.
3. Índice de satisfacción general y comparativa histórico.
4. Recomendaciones para mejorar el clima laboral.
FORMATO: Reporte ejecutivo con gráficos de tendencia y acción inmediata.`
      }
    ],
    marketing: [
      {
        id: 'mkt1',
        titulo: 'Posicionamiento Institucional y Comunicación',
        icon: <Megaphone size={16} />,
        color: '#8b5cf6',
        area: 'Marketing',
        plantilla: `[ROL]: Actúa como Gerente de Relaciones Institucionales.
[CONTEXTO]: Se requiere mejorar la imagen institucional de PDVSA ante [Audiencia Objetivo].
[TAREA]: Diseña:
1. Estrategia de posicionamiento en 3 canales clave.
2. Mensajes principales para comunicación de crisis.
3. Calendario de comunicados para los próximos 3 meses.
4. KPIs de medición de impacto reputacional.
FORMATO: Plan de comunicación ejecutivo con matriz de mensajes.`
      },
      {
        id: 'mkt2',
        titulo: 'Análisis de Competidores del Mercado Energético',
        icon: <BarChart3 size={16} />,
        color: '#7c3aed',
        area: 'Marketing',
        plantilla: `[ROL]: Actúa como Analista de Mercado Senior.
[CONTEXTO]: Evaluar la posición competitiva de PDVSA frente a [Competidores/Países].
[TAREA]: Realiza:
1. Análisis FODA comparativo con 5 competidores.
2. Benchmarking de precios y servicios.
3. Identificación de ventajas competitivas diferenciadoras.
4. Estrategias de diferenciación para el mercado internacional.
FORMATO: Matriz competitiva ejecutiva con recomendaciones estratégicas.`
      }
    ],
    io: [
      {
        id: 'io1',
        titulo: 'Optimización de Mezclas — Método Simplex',
        icon: <TrendingUp size={16} />,
        color: '#0891b2',
        area: 'Investigación de Operaciones',
        plantilla: `[ROL]: Actúa como Ingeniero de I.O. y Optimización Financiera.
[CONTEXTO]: Se requiere determinar la proporción óptima de procesamiento entre Crudo Pesado y Crudo Liviano en la refinería de [Nombre], con una capacidad de refinación de [X] BPD (Barriles Por Día).
[TAREA]: Utiliza el enfoque del Método Simplex para resolver el problema de programación lineal:
1. Define las variables de decisión (X1 = crudo pesado, X2 = crudo liviano).
2. Establece la función objetivo: Maximizar Z = C1·X1 + C2·X2 (margen operativo por barril).
3. Restricciones:
   - Capacidad total: X1 + X2 ≤ [X] BPD
   - Mezcla mínima de pesado: X1 ≥ [Y]% del total
   - Disponibilidad de crudo: X1 ≤ [A] BPD, X2 ≤ [B] BPD
4. Presenta la tabla Simplex paso a paso con iteraciones.
5. Indica la solución óptima y el margen máximo alcanzable.
FORMATO: Tabla de iteraciones Simplex + resultado óptimo + gráfico de factibilidad.`
      },
      {
        id: 'io2',
        titulo: 'Parada de Planta — Ruta Crítica CPM/PERT',
        icon: <GitBranch size={16} />,
        color: '#0369a1',
        area: 'Investigación de Operaciones',
        plantilla: `[ROL]: Actúa como Gerente de Proyectos (PMP/I.O.) especializado en mantenimiento de refinerías.
[CONTEXTO]: Se debe planificar la parada técnica de mantenimiento de la Planta de Fraccionamiento [Nombre], con [N] tareas identificadas y tiempos estimados.
[TAREA]: Aplica el método de la Ruta Crítica (CPM/PERT) para estructurar el plan:
1. Lista de tareas con duración, predecesoras y holguras:
   - Tarea A: [Descripción] — [X] días — Predecesora: Ninguna
   - Tarea B: [Descripción] — [X] días — Predecesora: A
   - (agregar todas las tareas)
2. Diagrama de red (AON o AOA).
3. Cálculo de tiempos tempranos, tardíos y holguras.
4. Identificación del camino crítico y duración total del proyecto.
5. Análisis PERT con estimaciones (Optimista, Más probable, Pessimista) y varianza.
6. Probabilidad de completar en [D] días o menos.
FORMATO: Tabla de actividades + diagrama de ruta crítica + cronograma Gantt simplificado.`
      },
      {
        id: 'io3',
        titulo: 'Gestión de Inventario — Lote Económico EOQ',
        icon: <Package size={16} />,
        color: '#0284c7',
        area: 'Investigación de Operaciones',
        plantilla: `[ROL]: Actúa como Especialista en Logística e Inventarios de Repuestos Críticos.
[CONTEXTO]: Se necesita optimizar el stock de [Nombre del Repuesto] para [N] bombas del Campo [Nombre]. Datos: demanda anual [D] unidades, costo de pedido [S] USD, costo de mantenimiento unitario [H] USD/año, costo por unidad [C] USD, tiempo de entrega [L] días.
[TAREA]: Utiliza el modelo de Lote Económico de Pedido (EOQ) para determinar:
1. Cantidad óptima de pedido: Q* = √(2DS/H)
2. Número de pedidos por año: N = D/Q*
3. Punto de reorden: ROP = d × L (demanda diaria × lead time)
4. Costo total anual: CT = (D/Q*)S + (Q*/2)H + DC
5. Comparación con el pedido actual y ahorro proyectado.
6. Análisis de sensibilidad: ¿Qué pasa si la demanda sube 20%? ¿Si el costo de pedido baja 30%?
FORMATO: Tabla de cálculo EOQ + comparativa costo actual vs. óptimo + gráfico de inventario.`
      }
    ]
  };

  const plantillasGenerales = [
    {
      id: 1,
      titulo: 'Análisis de Oportunidades y Reducción de Costos',
      icon: <TrendingUp size={16} />,
      color: '#10b981',
      plantilla: `[ROL]: Actúa como Asesor Senior de Eficiencia Operativa en PDVSA.
[CONTEXTO]: Se ha detectado una variación del [X]% en el presupuesto asignado a la división [Nombre División].
[TAREA]: Analiza los siguientes datos operativos [Pegar Datos/Reporte] e identifica:
1. Tres áreas de desperdicio o sobrecosto inmediato.
2. Dos medidas de optimización sin afectar la seguridad de la planta/unidad.
3. Formato de salida: Tabla comparativa con Costo vs. Impacto Estimado.`
    },
    {
      id: 2,
      titulo: 'Redacción de Memorándums Ejecutivos de Alto Impacto',
      icon: <FileText size={16} />,
      color: '#3b82f6',
      plantilla: `[ROL]: Actúa como Director de Comunicaciones Corporativas.
[CONTEXTO]: Se requiere solicitar la aprobación inmediata para [Objeto de la Solicitud] dirigida a [Destinatario/Gerencia].
[TAREA]: Redacta un memorándum de no más de 300 palabras estructurado en:
- Antecedentes clave en 2 viñetas.
- Justificación de ROI/Impacto en continuidad operativa.
- Petición concreta y fecha límite de respuesta.
- Tono: Formal, institucional, directo.`
    },
    {
      id: 3,
      titulo: 'Evaluación de Riesgos y Matriz de Contención',
      icon: <Shield size={16} />,
      color: '#f59e0b',
      plantilla: `[ROL]: Actúa como Especialista en Gestión de Riesgos e Inclemencias Operativas.
[CONTEXTO]: Se presenta la siguiente eventualidad no programada: [Describir falla o contingencia].
[TAREA]: Proyecta 3 escenarios hipotéticos (Conservador, Moderado, Crítico) evaluando:
- Impacto financiero proyectado.
- Tiempo de recuperación estimado (MTTR).
- Protocolo de mitigación inmediato para supervisores de campo.`
    },
    {
      id: 4,
      titulo: 'Resumen Ejecutivo de Informes Extensos',
      icon: <BarChart3 size={16} />,
      color: '#8b5cf6',
      plantilla: `[ROL]: Actúa como Analista Ejecutivo de Junta Directiva.
[TAREA]: Sintetiza el siguiente informe técnico/financiero [Pegar Texto Extenso] en una "Ficha Gerencial de 1 Página" que contenga:
- Resumen en 3 oraciones principales.
- 3 KPIs o cifras más relevantes.
- Riesgo principal detectado.
- Decisión recomendada (Aprobar / Rechazar / Requerir más datos).`
    }
  ];

  const getPlantillasFiltradas = () => {
    if (areaFuncional === 'todas') return plantillasGenerales;
    return plantillasPorArea[areaFuncional] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/simulators/text-prompt`, {
        prompt: prompt.trim(),
        contexto: contexto.trim(),
        tipo_documento: tipoDocumento,
        parametros: { formato: 'ejecutivo', nivel: 'gerencial' }
      });

      const newResponse = {
        id: Date.now(),
        prompt: prompt.trim(),
        resultado: response.data?.respuesta || response.data,
        timestamp: new Date().toLocaleString()
      };

      setRespuesta(newResponse);
      setHistorial(prev => [newResponse, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error:', error);
      const fallback = {
        id: Date.now(),
        prompt: prompt.trim(),
        resultado: {
          titulo: 'Análisis Ejecutivo Simulado',
          respuesta: generateExecutiveResponse(prompt.trim(), contexto.trim()),
          tokens_utilizados: Math.floor(prompt.length * 1.3)
        },
        timestamp: new Date().toLocaleString()
      };
      setRespuesta(fallback);
      setHistorial(prev => [fallback, ...prev].slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  const generateExecutiveResponse = (promptText, contextoText) => {
    return `INFORME EJECUTIVO — CONSOLA DE INTELIGENCIA PDVSA
${'═'.repeat(55)}

Fecha: ${new Date().toLocaleDateString('es-VE')}
Clasificación: USO INTERNO — DIRECCIÓN DE OPERACIONES
Analista IA: Asistente Ejecutivo Nasser Group

${'─'.repeat(55)}
RESUMEN EJECUTIVO
${'─'.repeat(55)}

Solicitud analizada: "${promptText.substring(0, 100)}${promptText.length > 100 ? '...' : ''}"

${contextoText ? `Contexto operativo: ${contextoText}` : 'Contexto: Operaciones generales PDVSA'}

${'─'.repeat(55)}
PUNTOS CLAVE DEL ANÁLISIS
${'─'.repeat(55)}

1. SITUACIÓN ACTUAL
   • Se identificaron factores de impacto en las operaciones actuales
   • El análisis considera variables financieras, operativas y de riesgo
   • Se recomienda revisión inmediata de los indicadores clave

2. HALLAZGOS PRINCIPALES
   • Eficiencia operativa actual: 78% (meta: 90%)
   • Impacto estimado en costos: Reducción potencial del 15-20%
   • Riesgos identificados: 3 factores críticos requieren atención

3. ANÁLISIS DE ESCENARIOS
   • ESCENARIO CONSERVADOR: Inversión mínima, mejora del 8% en 6 meses
   • ESCENARIO MODERADO: Inversión media, mejora del 15% en 4 meses
   • ESCENARIO AGRESIVO: Inversión alta, mejora del 25% en 3 meses

${'─'.repeat(55)}
RECOMENDACIÓN DEL ASESOR IA
${'─'.repeat(55)}

Se recomienda adoptar el ESCENARIO MODERADO con las siguientes acciones:

  a) Implementar sistema de monitoreo continuo en áreas críticas
  b) Establecer KPIs semanales de seguimiento con dashboard ejecutivo
  c) Designar equipo de proyecto con representantes de cada área
  d) Presentar avances quincenales a Dirección General

PRIORIDAD: ALTA — Implementar dentro de los próximos 30 días

${'─'.repeat(56)}
Nota: Este análisis fue generado por IA. Se recomienda validar con datos
operativos reales antes de tomar decisiones ejecutivas.
${'═'.repeat(56)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  const handleReset = () => {
    setPrompt('');
    setContexto('');
    setRespuesta(null);
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={24} />
          <div>
            <h1>Asistente Ejecutivo IA</h1>
            <p>Genera memorandums, análisis de riesgos, matrices de decisión y resúmenes ejecutivos para PDVSA</p>
          </div>
        </div>
      </div>

      <div className="simulator-body">
        <div className="simulator-grid">
          <div className="input-panel">
            <h3>Configuración del Análisis</h3>
            
            <div className="form-group">
              <label>Tipo de Documento</label>
              <div className="tabs">
                {tiposDocumento.map((tipo) => (
                  <button
                    key={tipo.value}
                    className={`tab-btn ${tipoDocumento === tipo.value ? 'active' : ''}`}
                    onClick={() => setTipoDocumento(tipo.value)}
                  >
                    {tipo.icon}
                    <span style={{ marginLeft: '6px' }}>{tipo.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Contexto Operativo (Opcional)</label>
              <textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Ej: Área de Producción, Refinería Amuay, Q3 2024..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-group">
              <label>Instrucción / Prompt Ejecutivo</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Escribe tu solicitud ejecutiva aquí..."
                style={{ minHeight: '120px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                style={{ flex: 1 }}
              >
                {loading ? 'Procesando...' : 'Generar Análisis'}
                {!loading && <Send size={18} />}
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Casos Ejecutivos de Ejemplo:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {promptsEjemplo.map((ejemplo, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(ejemplo)}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {ejemplo}
                  </button>
                ))}
              </div>
            </div>

            {/* Biblioteca de Plantillas Rápidas */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'linear-gradient(135deg, rgba(0,51,102,0.03), rgba(212,168,67,0.05))', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,51,102,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <BookOpen size={18} color="#003366" />
                <h4 style={{ fontSize: '0.9rem', color: '#003366', margin: 0 }}>Guía de Plantillas por Área Funcional</h4>
              </div>
              
              {/* Selector de Área Funcional */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {areasFuncionales.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => setAreaFuncional(area.value)}
                    style={{
                      padding: '6px 10px',
                      background: areaFuncional === area.value ? area.color : 'var(--bg-secondary)',
                      color: areaFuncional === area.value ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${areaFuncional === area.value ? area.color : 'var(--border-color)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {area.icon}
                    {area.label}
                  </button>
                ))}
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                {areaFuncional === 'todas' 
                  ? 'Plantillas generales gerenciales. Selecciona un área específica para ver plantillas especializadas.'
                  : `Plantillas especializadas para ${areasFuncionales.find(a => a.value === areaFuncional)?.label}.`}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {getPlantillasFiltradas().map((plantilla) => (
                  <div key={plantilla.id} style={{
                    padding: '10px 12px',
                    background: plantillaActiva === plantilla.id ? `${plantilla.color}10` : '#fff',
                    border: `1px solid ${plantillaActiva === plantilla.id ? plantilla.color : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: plantilla.color }}>{plantilla.icon}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#003366' }}>{plantilla.titulo}</span>
                        {plantilla.area && (
                          <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: `${plantilla.color}20`, color: plantilla.color, borderRadius: '8px' }}>
                            {plantilla.area}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => copiarPlantilla(plantilla.plantilla)}
                          style={{ padding: '4px 8px', background: copiado ? '#10b981' : 'var(--bg-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiado ? <CheckCircle size={12} /> : <Copy size={12} />}
                          {copiado ? 'Copiado' : 'Copiar'}
                        </button>
                        <button
                          onClick={() => cargarPlantilla(plantilla)}
                          style={{ padding: '4px 8px', background: plantilla.color, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          Cargar
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: '1.4', maxHeight: '60px', overflow: 'hidden' }}>
                      {plantilla.plantilla.substring(0, 120)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="output-panel">
            <h3>Respuesta del Asistente Ejecutivo</h3>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                  Analizando solicitud ejecutiva...
                </p>
              </div>
            )}

            {!loading && !respuesta && (
              <div className="empty-state">
                <div className="icon">📊</div>
                <h3>Consola de Inteligencia</h3>
                <p>Selecciona un caso ejecutivo o escribe tu solicitud para generar un análisis estratégico</p>
              </div>
            )}

            {!loading && respuesta && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Solicitud analizada:</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{respuesta?.prompt || 'Sin prompt'}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {respuesta?.timestamp || ''}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary-blue)', marginBottom: '8px' }}>
                    {respuesta?.resultado?.titulo || 'Sin título'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Tokens procesados: {respuesta?.resultado?.tokens_utilizados || 0}
                  </p>
                </div>

                <div className="response-box" style={{ whiteSpace: 'pre-wrap', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', lineHeight: '1.6' }}>
                  {respuesta?.resultado?.respuesta || respuesta?.resultado?.contenido || 'Sin contenido'}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '16px' 
                }}>
                  <button 
                    className="btn-primary"
                    onClick={() => copyToClipboard(respuesta?.resultado?.respuesta || respuesta?.resultado?.contenido || '')}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <Copy size={16} /> Copiar Informe
                  </button>
                  <button 
                    className="btn-gold"
                    onClick={() => {
                      const content = respuesta?.resultado?.respuesta || respuesta?.resultado?.contenido || '';
                      const header = `FICHA DE DECISIÓN EJECUTIVA\n${'═'.repeat(60)}\nInstitución: Nasser Group / IUTPAL\nPlataforma: Academia Virtual PDVSA\nFecha: ${new Date().toLocaleDateString('es-VE')}\nHora: ${new Date().toLocaleTimeString('es-VE')}\nTipo de Documento: ${tiposDocumento.find(t => t.value === tipoDocumento)?.label || tipoDocumento}\n${'═'.repeat(60)}\n\nSOLICITUD ORIGINAL:\n${respuesta?.prompt || 'N/A'}\n${'─'.repeat(60)}\n\nRESPUESTA DEL ASISTENTE IA:\n${'─'.repeat(60)}\n\n${content}\n\n${'═'.repeat(60)}\nDocumento generado por la Plataforma Academia Virtual PDVSA\nNasser Group — Instituto Universitario de Tecnología de Processos\nLínea de desarrollo: Investigación de Operaciones y Toma de Decisiones\n${'═'.repeat(60)}\nEste documento puede ser utilizado como respaldo institucional.\nFirma autorizada: ___________________________`;
                      const blob = new Blob([header], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ficha_decision_${Date.now()}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{ flex: 1, padding: '10px', color: 'var(--primary-blue-dark)' }}
                  >
                    <Download size={16} /> Exportar Ficha
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {historial.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-blue)' }}>
              Historial de Análisis Ejecutivos
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Solicitud</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item) => (
                    <tr key={item?.id || Math.random()}>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item?.prompt || 'Sin prompt'}
                      </td>
                      <td>
                        <span className="badge badge-info">
                           {item?.resultado?.titulo?.split(' - ')[0] || 'Análisis'}
                        </span>
                      </td>
                      <td>{item?.timestamp || ''}</td>
                      <td>
                        <button 
                          onClick={() => setRespuesta(item)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--primary-blue)', 
                            cursor: 'pointer' 
                          }}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimuladorTexto;
