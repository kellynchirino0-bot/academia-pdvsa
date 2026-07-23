import React, { useState } from 'react';
import { Send, Copy, Download, RotateCcw, Sparkles, FileText, TrendingUp, Shield, BarChart3, BookOpen, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const SimuladorTexto = () => {
  const [prompt, setPrompt] = useState('');
  const [contexto, setContexto] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('memorandum');
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  const tiposDocumento = [
    { value: 'memorandum', label: 'Memorandum Ejecutivo', icon: <FileText size={16} /> },
    { value: 'analisis_riesgos', label: 'Análisis de Riesgos', icon: <Shield size={16} /> },
    { value: 'matriz_decision', label: 'Matriz de Decisión', icon: <BarChart3 size={16} /> },
    { value: 'informe_gerencial', label: 'Informe Gerencial', icon: <TrendingUp size={16} /> }
  ];

  const promptsEjemplo = [
    'Actúa como Gerente de Operaciones de PDVSA. Analiza una baja de eficiencia del 12% en el Área X e identifica las 3 causas principales y propone 2 acciones correctivas inmediatas.',
    'Redacta un memorándum ejecutivo dirigido a Dirección solicitando la reasignación presupuestaria para mantenimiento preventivo justificando el ROI operativo.',
    'Simula 3 escenarios (Conservador, Moderado, Agresivo) ante una parada técnica no programada y proyecta su impacto financiero y en la continuidad operativa.',
    'Genera un resumen ejecutivo del avance trimestral de optimización de costos en las áreas de Explotación y Producción con indicadores clave.',
    'Elabora una evaluación comparativa de 3 proveedores de servicios de mantenimiento industrial considerando costo, tiempo de respuesta y garantía.',
    'Diseña un plan de contingencia para garantizar la continuidad operativa ante una emergencia climática que afecte las instalaciones principales.'
  ];

  const plantillasGerenciales = [
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

  const [plantillaActiva, setPlantillaActiva] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const cargarPlantilla = (plantilla) => {
    setPrompt(plantilla.plantilla);
    setPlantillaActiva(plantilla.id);
  };

  const copiarPlantilla = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
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
                <h4 style={{ fontSize: '0.9rem', color: '#003366', margin: 0 }}>Guía de Plantillas Gerenciales PDVSA/IUTPAL</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                Plantillas oficiales del Módulo 2. Selecciona una para cargarla en el editor o cópiala para uso personal.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plantillasGerenciales.map((plantilla) => (
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
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `informe_ejecutivo_${Date.now()}.txt`;
                      a.click();
                    }}
                    style={{ flex: 1, padding: '10px', color: 'var(--primary-blue-dark)' }}
                  >
                    <Download size={16} /> Descargar
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
