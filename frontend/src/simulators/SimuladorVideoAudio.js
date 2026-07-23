import React, { useState } from 'react';
import { Send, Video, Mic, Music, Play, Pause, Volume2, SkipForward, Settings } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const SimuladorVideoAudio = () => {
  const [prompt, setPrompt] = useState('');
  const [tipoOperacion, setTipoOperacion] = useState('texto_a_voz');
  const [parametros, setParametros] = useState({
    idioma: 'es',
    velocidad: 1.0,
    tono: 'profesional',
    formato: 'mp4'
  });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const tiposOperacion = [
    { value: 'texto_a_voz', label: 'Texto a Voz (TTS)', icon: <Mic size={20} />, color: '#0a2342' },
    { value: 'video_fotogramas', label: 'Generación de Video', icon: <Video size={20} />, color: '#d4a843' },
    { value: 'clonacion_voz', label: 'Clonación de Voz', icon: <Music size={20} />, color: '#0d6e6e' }
  ];

  const promptsEjemplo = [
    'Generar narración para presentación ejecutiva de resultados trimestrales',
    'Crear video de orientación para nuevos empleados de PDVSA',
    'Sintetizar voz para asistente virtual de atención al participante',
    'Producir video de capacitación sobre protocolo de seguridad industrial',
    'Generar audio de notificaciones para sistema de monitoreo operativo',
    'Crear resumen ejecutivo en audio para gerencia de operaciones'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/simulators/video-audio-prompt`, {
        prompt: prompt.trim(),
        tipo_operacion: tipoOperacion,
        parametros
      });

      setResultado(response.data?.respuesta || response.data);
    } catch (error) {
      console.error('Error:', error);
      let fallback;
      if (tipoOperacion === 'texto_a_voz') {
        fallback = {
          titulo: 'Síntesis de Voz (Modo Offline)',
          descripcion: 'Síntesis de voz simulada.',
          tipo: 'audio', duracion: '2:45', formato: 'WAV 44.1kHz'
        };
      } else if (tipoOperacion === 'video_fotogramas') {
        fallback = {
          titulo: 'Video Generado (Modo Offline)',
          descripcion: 'Video generado en modo simulado.',
          tipo: 'video', fotogramas: 30, duracion: '1:00', resolucion: '1920x1080'
        };
      } else {
        fallback = {
          titulo: 'Clonación de Voz (Modo Offline)',
          descripcion: 'Clonación de voz simulada.',
          tipo: 'audio_clonado', duracion: '2:30'
        };
      }
      setResultado(fallback);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0a2342)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Video size={24} />
          <div>
            <h1>Simulador de Video y Audio</h1>
            <p>Predicción de fotogramas, síntesis de voz y clonación de audio</p>
          </div>
        </div>
      </div>

      <div className="simulator-body">
        <div className="simulator-grid">
          <div className="input-panel">
            <h3>Configuración de Medios</h3>

            <div className="form-group">
              <label>Tipo de Operación</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {tiposOperacion.map((tipo) => (
                  <button
                    key={tipo.value}
                    onClick={() => setTipoOperacion(tipo.value)}
                    style={{
                      padding: '16px',
                      background: tipoOperacion === tipo.value 
                        ? `linear-gradient(135deg, ${tipo.color}15, ${tipo.color}25)` 
                        : 'var(--bg-primary)',
                      border: `2px solid ${tipoOperacion === tipo.value ? tipo.color : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: `${tipo.color}20`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tipo.color
                    }}>
                      {tipo.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{tipo.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {tipo.value === 'texto_a_voz' && 'Convierte texto en audio natural'}
                        {tipo.value === 'video_fotogramas' && 'Genera secuencias de video'}
                        {tipo.value === 'clonacion_voz' && 'Crea réplicas de voz sintética'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Contenido / Descripción</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  tipoOperacion === 'texto_a_voz' 
                    ? 'Escribe el texto que deseas convertir a voz...'
                    : tipoOperacion === 'video_fotogramas'
                    ? 'Describe la secuencia de video que deseas generar...'
                    : 'Proporciona una muestra de voz para clonar...'
                }
                style={{ minHeight: '100px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Idioma</label>
                <select 
                  value={parametros.idioma}
                  onChange={(e) => setParametros({...parametros, idioma: e.target.value})}
                >
                  <option value="es">Español (Latinoamérica)</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div className="form-group">
                <label>Velocidad</label>
                <select 
                  value={parametros.velocidad}
                  onChange={(e) => setParametros({...parametros, velocidad: parseFloat(e.target.value)})}
                >
                  <option value="0.5">0.5x (Lenta)</option>
                  <option value="0.75">0.75x</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x (Rápida)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tono / Estilo</label>
              <select 
                value={parametros.tono}
                onChange={(e) => setParametros({...parametros, tono: e.target.value})}
              >
                <option value="profesional">Profesional Corporativo</option>
                <option value="amigable">Amigable y Cercano</option>
                <option value="tecnico">Técnico / Científico</option>
                <option value="urgente">Urgente / Alerta</option>
              </select>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              style={{ width: '100%', marginTop: '16px' }}
            >
              {loading ? 'Procesando...' : 'Generar Medio'}
              {!loading && <Send size={18} />}
            </button>

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                Ejemplos:
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
            <h3>Resultado</h3>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                  {tipoOperacion === 'texto_a_voz' && 'Sintetizando voz...'}
                  {tipoOperacion === 'video_fotogramas' && 'Generando fotogramas...'}
                  {tipoOperacion === 'clonacion_voz' && 'Entrenando modelo de voz...'}
                </p>
              </div>
            )}

            {!loading && !resultado && (
              <div className="empty-state">
                <div className="icon">🎬</div>
                <h3>Sin resultado</h3>
                <p>Configura los parámetros y ejecuta para generar el medio</p>
              </div>
            )}

            {!loading && resultado && (
              <div>
                <div style={{ 
                  padding: '16px', 
                  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.05), rgba(10, 35, 66, 0.1))',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ color: 'var(--primary-blue)', marginBottom: '8px' }}>
                    {resultado?.titulo || 'Sin título'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {resultado.descripcion}
                  </p>
                </div>

                {/* Player模拟器 */}
                <div style={{
                  background: 'var(--bg-dark)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  marginBottom: '20px'
                }}>
                  {tipoOperacion === 'video_fotogramas' ? (
                    <div>
                      <div style={{
                        background: 'linear-gradient(135deg, #1a1a2e, #0a2342)',
                        borderRadius: 'var(--radius-md)',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        position: 'relative'
                      }}>
                        <Video size={48} color="rgba(255,255,255,0.3)" />
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.7)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          color: 'white'
                        }}>
                          00:15 / 01:30
                        </div>
                      </div>
                      <div className="progress-bar" style={{ marginBottom: '16px' }}>
                        <div className="progress-fill" style={{ width: '25%' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '8px'
                        }}>
                          <SkipForward size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button 
                          onClick={togglePlayback}
                          style={{ 
                            background: 'var(--primary-blue)', 
                            border: 'none', 
                            color: 'white', 
                            cursor: 'pointer',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '8px'
                        }}>
                          <SkipForward size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <button 
                          onClick={togglePlayback}
                          style={{ 
                            background: 'var(--primary-blue)', 
                            border: 'none', 
                            color: 'white', 
                            cursor: 'pointer',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>
                            Audio generado
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            {resultado.resultados?.duracion_audio || '45 segundos'}
                          </div>
                        </div>
                        <Volume2 size={20} color="white" />
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {Object.entries(resultado?.resultados || {}).map(([key, value]) => (
                    <div key={key} style={{
                      padding: '14px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ 
                  padding: '16px', 
                  background: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)' 
                }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={16} /> Metadatos Técnicos
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorVideoAudio;
