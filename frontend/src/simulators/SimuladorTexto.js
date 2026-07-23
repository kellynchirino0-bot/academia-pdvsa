import React, { useState } from 'react';
import { Send, Copy, Download, RotateCcw, Sparkles, Code, FileText, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const SimuladorTexto = () => {
  const [prompt, setPrompt] = useState('');
  const [contexto, setContexto] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('informe_tecnico');
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  const tiposDocumento = [
    { value: 'informe_tecnico', label: 'Informe Técnico PDVSA', icon: <FileText size={16} /> },
    { value: 'auditoria_financiera', label: 'Auditoría Financiera', icon: <TrendingUp size={16} /> },
    { value: 'codigo_automatizacion', label: 'Código de Automatización', icon: <Code size={16} /> }
  ];

  const promptsEjemplo = [
    'Generar un informe técnico sobre el análisis de producción del pozo PDVSA-001',
    'Crear un plan de auditoría para el área de explotación petrolera',
    'Desarrollar un script de monitoreo de presión de yacimiento',
    'Analizar tendencias de producción de los últimos 6 meses',
    'Redactar un protocolo de mantenimiento predictivo para bombas sumergibles',
    'Generar código Python para automatizar la recolección de datos sísmicos'
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
        parametros: { formato: 'detallado', nivel: 'avanzado' }
      });

      const newResponse = {
        id: Date.now(),
        prompt: prompt.trim(),
        resultado: response.data.respuesta,
        timestamp: new Date().toLocaleString()
      };

      setRespuesta(newResponse);
      setHistorial(prev => [newResponse, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
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
            <h1>Simulador de Prompts GPT</h1>
            <p>Diseña y prueba prompts para informes técnicos, auditorías y código de automatización</p>
          </div>
        </div>
      </div>

      <div className="simulator-body">
        <div className="simulator-grid">
          <div className="input-panel">
            <h3>Configuración del Prompt</h3>
            
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
              <label>Contexto Adicional (Opcional)</label>
              <textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Ej: Análisis de producción del pozo ABC-123 en el mes de enero 2024..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-group">
              <label>Prompt / Instrucción</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Escribe tu prompt aquí..."
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
                {loading ? 'Procesando...' : 'Generar Respuesta'}
                {!loading && <Send size={18} />}
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={18} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Prompts de Ejemplo:
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
            <h3>Respuesta Generada</h3>
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                  Procesando tu solicitud...
                </p>
              </div>
            )}

            {!loading && !respuesta && (
              <div className="empty-state">
                <div className="icon">💬</div>
                <h3>Sin respuesta aún</h3>
                <p>Escribe un prompt y haz clic en "Generar Respuesta" para ver el resultado</p>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Prompt enviado:</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{respuesta.prompt}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {respuesta.timestamp}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary-blue)', marginBottom: '8px' }}>
                    {respuesta.resultado.titulo}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Tokens utilizados: {respuesta.resultado.tokens_utilizados}
                  </p>
                </div>

                <div className="response-box">
                  {respuesta.resultado.contenido}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '16px' 
                }}>
                  <button 
                    className="btn-primary"
                    onClick={() => copyToClipboard(respuesta.resultado.contenido)}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <Copy size={16} /> Copiar
                  </button>
                  <button 
                    className="btn-gold"
                    onClick={() => {
                      const blob = new Blob([respuesta.resultado.contenido], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `informe_${Date.now()}.txt`;
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
              Historial de Simulaciones
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Prompt</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item) => (
                    <tr key={item.id}>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.prompt}
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {item.resultado.titulo.split(' - ')[0]}
                        </span>
                      </td>
                      <td>{item.timestamp}</td>
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
