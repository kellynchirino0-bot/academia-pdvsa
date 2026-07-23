import React, { useState } from 'react';
import { Send, Copy, Download, RotateCcw, Sparkles, FileText, TrendingUp, Shield, BarChart3 } from 'lucide-react';
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
