import React, { useState } from 'react';
import { Send, RotateCcw, Eye, Layers, Maximize, Settings, Camera, Thermometer, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const SimuladorImagenes = () => {
  const [prompt, setPrompt] = useState('');
  const [tipoModelo, setTipoModelo] = useState('gan');
  const [tipoAnalisis, setTipoAnalisis] = useState('inspeccion_ductos');
  const [parametros, setParametros] = useState({
    resolucion: '1920x1080',
    calidad: 'alta',
    formato: 'png'
  });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const tiposAnalisis = [
    { value: 'inspeccion_ductos', label: 'Inspección de Diagramas Ejecutivos', icon: <Camera size={16} />, description: 'Análisis visual de diagramas de procesos y flujos operativos' },
    { value: 'mapa_calor_corrosion', label: 'Mapa de Calor de Riesgos', icon: <Thermometer size={16} />, description: 'Visualización de áreas de riesgo y criticidad operativa' },
    { value: 'render_activos', label: 'Visualización de Infraestructura', icon: <Layers size={16} />, description: 'Render 3D de instalaciones y activos industriales' }
  ];

  const modelos = [
    { value: 'gan', label: 'GAN (Generative Adversarial Network)' },
    { value: 'vae', label: 'VAE (Variational Autoencoder)' },
    { value: 'diffusion', label: 'Diffusion Model' },
    { value: 'stylegan', label: 'StyleGAN3' }
  ];

  const promptsEjemplo = [
    'Analizar diagrama de flujo de proceso de refinería para identificar cuellos de botella',
    'Generar mapa de calor de riesgos operativos por área de la planta',
    'Visualizar distribución de personal y recursos en planta de extracción',
    'Identificar puntos críticos en diagrama de distribución deactivos',
    'Renderizar modelo 3D de terminal de carga para presentación ejecutiva',
    'Detectar anomalías en patrones de distribución de inventario'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/simulators/image-prompt`, {
        prompt: prompt.trim(),
        tipo_modelo: tipoModelo,
        parametros: {
          tipo_analisis: tipoAnalisis,
          ...parametros
        }
      });

      setResultado(response.data?.respuesta || response.data);
    } catch (error) {
      console.error('Error:', error);
      setResultado({
        titulo: 'Simulación Modo Offline',
        descripcion: 'Análisis de imagen generado en modo simulado.',
        resultados: {
          zone_detection: '8 zonas identificadas',
          anomaly_score: '89.5%',
          structural_integrity: 'Aceptable',
          recommendations: 'Inspección programada'
        },
        metadata: {
          modelo: tipoModelo || 'VAE',
          precision: '95.2%',
          tiempo_inferencia: '1.5s',
          resolucion: '512x512'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (title, value, icon, color) => (
    <div style={{
      padding: '16px',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${color}20`,
      borderLeft: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {icon}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="simulator-container">
      <div className="simulator-header" style={{ background: 'linear-gradient(135deg, var(--secondary-teal), #0a5c5c)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={24} />
          <div>
            <h1>Simulador de Imágenes - VAE & GANs</h1>
            <p>Inspección visual, análisis de corrosión y renders de activos industriales</p>
          </div>
        </div>
      </div>

      <div className="simulator-body">
        <div className="simulator-grid">
          <div className="input-panel">
            <h3>Configuración del Análisis</h3>

            <div className="form-group">
              <label>Tipo de Análisis</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {tiposAnalisis.map((tipo) => (
                  <button
                    key={tipo.value}
                    onClick={() => setTipoAnalisis(tipo.value)}
                    style={{
                      padding: '14px',
                      background: tipoAnalisis === tipo.value ? 'rgba(13, 110, 110, 0.1)' : 'var(--bg-primary)',
                      border: `2px solid ${tipoAnalisis === tipo.value ? 'var(--secondary-teal)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tipo.icon}
                      <span style={{ fontWeight: '500' }}>{tipo.label}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '24px' }}>
                      {tipo.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Modelo de IA</label>
              <select 
                value={tipoModelo} 
                onChange={(e) => setTipoModelo(e.target.value)}
              >
                {modelos.map((modelo) => (
                  <option key={modelo.value} value={modelo.value}>{modelo.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Descripción / Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe el análisis o visualización que deseas realizar..."
                style={{ minHeight: '100px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Resolución</label>
                <select 
                  value={parametros.resolucion}
                  onChange={(e) => setParametros({...parametros, resolucion: e.target.value})}
                >
                  <option value="1920x1080">1080p (Full HD)</option>
                  <option value="2560x1440">2K (QHD)</option>
                  <option value="3840x2160">4K (Ultra HD)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Calidad</label>
                <select 
                  value={parametros.calidad}
                  onChange={(e) => setParametros({...parametros, calidad: e.target.value})}
                >
                  <option value="rapida">Rápida</option>
                  <option value="estandar">Estándar</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {loading ? 'Procesando imagen...' : 'Ejecutar Análisis'}
              {!loading && <Send size={18} />}
            </button>

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Ejemplos de uso:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {promptsEjemplo.map((ejemplo, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(ejemplo)}
                    style={{
                      padding: '10px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {ejemplo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="output-panel">
            <h3>Resultados del Análisis</h3>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                  Procesando imagen con modelo {tipoModelo.toUpperCase()}...
                </p>
              </div>
            )}

            {!loading && !resultado && (
              <div className="empty-state">
                <div className="icon">🖼️</div>
                <h3>Sin resultados</h3>
                <p>Configura los parámetros y ejecuta el análisis para ver los resultados</p>
              </div>
            )}

            {!loading && resultado && (
              <div>
                <div style={{ 
                  padding: '16px', 
                  background: 'linear-gradient(135deg, rgba(13, 110, 110, 0.05), rgba(13, 110, 110, 0.1))',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: 'var(--secondary-teal)', marginBottom: '8px' }}>
                    {resultado?.titulo || 'Sin título'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {resultado.descripcion}
                  </p>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {Object.entries(resultado?.resultados || {}).map(([key, value], index) => {
                    const icons = [<Camera />, <AlertTriangle />, <Maximize />, <Settings />];
                    const colors = ['#0d6e6e', '#f59e0b', '#10b981', '#0a2342'];
                    return renderResultCard(
                      key.replace(/_/g, ' '),
                      value,
                      icons[index % icons.length],
                      colors[index % colors.length]
                    );
                  })}
                </div>

                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)' 
                }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Metadatos del Procesamiento
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {Object.entries(resultado?.metadata || {}).map(([key, value]) => (
                      <div key={key} style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{key.replace(/_/g, ' ')}: </span>
                        <span style={{ fontWeight: '500' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  marginTop: '20px', 
                  padding: '20px', 
                  background: 'linear-gradient(135deg, var(--bg-dark), #1a1a2e)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: 'linear-gradient(135deg, #0d6e6e33, #0a234233)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Eye size={48} />
                      <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        Visualización generada por {tipoModelo.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorImagenes;
