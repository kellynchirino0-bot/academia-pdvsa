import React, { useState, useRef } from 'react';

const voces = [
  { id: 'ejecutivo', label: 'Ejecutivo Corporativo', tono: 'formal' },
  { id: 'instructor', label: 'Instructor Técnico', tono: 'didáctico' },
  { id: 'asistente', label: 'Asistente Virtual', tono: 'amigable' },
];

export default function SimuladorVideoAudio() {
  const [modo, setModo] = useState('voz');
  const [texto, setTexto] = useState('');
  const [voz, setVoz] = useState(voces[0]);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [frames, setFrames] = useState([]);
  const [prediciendo, setPrediciendo] = useState(false);
  const canvasRef = useRef(null);

  const simularVoz = () => {
    if (!texto.trim()) return;
    setGenerando(true);
    setResultado(null);
    setTimeout(() => {
      setResultado({
        duracion: `${(texto.length * 0.05).toFixed(1)}s`,
        formato: 'WAV 16-bit 44.1kHz',
        texto: texto,
        voz: voz.label,
      });
      setGenerando(false);
    }, 2000);
  };

  const simularVideo = () => {
    setPrediciendo(true);
    setFrames([]);
    const nuevosFrames = [];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= 8) { clearInterval(interval); setPrediciendo(false); return; }
      const canvas = document.createElement('canvas');
      canvas.width = 320; canvas.height = 200;
      const ctx = canvas.getContext('2d');
      const t = i / 8;
      ctx.fillStyle = '#0A1628';
      ctx.fillRect(0, 0, 320, 200);
      const x = 60 + i * 30;
      const y = 60 + Math.sin(t * Math.PI * 2) * 40;
      ctx.fillStyle = `hsl(${200 + i * 20}, 80%, ${50 + i * 5}%)`;
      ctx.beginPath();
      ctx.arc(x, y, 15 + i * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00B4D8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 100);
      for (let px = 0; px <= 320; px += 10) {
        ctx.lineTo(px, 100 + Math.sin((px + i * 40) * 0.05) * 30);
      }
      ctx.stroke();
      nuevosFrames.push(canvas.toDataURL());
      i++;
    }, 300);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Simulador de Video y Audio</h1>
        <p>Predicción de fotogramas · Texto a Voz · Clonación de Voz Corporativa</p>
      </div>
      <div className="sim-toolbar" style={{ marginBottom: 20 }}>
        <button className={`sim-tab ${modo === 'voz' ? 'active' : ''}`} onClick={() => setModo('voz')}>🔊 Texto a Voz</button>
        <button className={`sim-tab ${modo === 'video' ? 'active' : ''}`} onClick={() => setModo('video')}>🎞 Predicción de Fotogramas</button>
      </div>

      {modo === 'voz' && (
        <div className="sim-row">
          <div className="sim-panel sim-left">
            <h3>Parámetros de Síntesis</h3>
            <div className="form-group">
              <label>Selecciona Voz</label>
              <div className="voces-grid">
                {voces.map(v => (
                  <div key={v.id} className={`voz-card ${voz.id === v.id ? 'active' : ''}`}
                    onClick={() => setVoz(v)}>
                    <strong>{v.label}</strong>
                    <small>Tono: {v.tono}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Texto a Sintetizar</label>
              <textarea value={texto} onChange={e => setTexto(e.target.value)}
                placeholder="Ingresa el texto que deseas convertir a voz..." rows={4} />
            </div>
            <button className="btn-primary" onClick={simularVoz} disabled={generando || !texto.trim()}>
              {generando ? '🔊 Sintetizando...' : '🔊 Generar Audio'}
            </button>
          </div>
          <div className="sim-panel sim-right">
            <h3>Audio Generado</h3>
            {resultado && (
              <div className="audio-result">
                <div className="audio-wave">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="wave-bar" style={{
                      height: `${20 + Math.sin(i * 0.5 + Date.now() * 0.001) * 30 + Math.random() * 10}px`,
                      animationDelay: `${i * 0.05}s`
                    }} />
                  ))}
                </div>
                <div className="audio-meta">
                  <p>✅ Audio Sintetizado</p>
                  <p>Voz: {resultado.voz} · Duración: {resultado.duracion} · Formato: {resultado.formato}</p>
                  <p className="audio-texto">"{resultado.texto.substring(0, 120)}..."</p>
                </div>
              </div>
            )}
            {!resultado && !generando && <div className="placeholder-audio"><p>Selecciona una voz, ingresa el texto y genera el audio sintético.</p></div>}
            {generando && <div className="generating"><div className="spinner"></div><p>Procesando síntesis de voz...</p></div>}
          </div>
        </div>
      )}

      {modo === 'video' && (
        <div className="sim-row">
          <div className="sim-panel sim-left">
            <h3>Predicción de Fotogramas</h3>
            <p>Simulación de un modelo de predicción de video que genera fotogramas futuros basados en patrones temporales aprendidos.</p>
            <button className="btn-primary" onClick={simularVideo} disabled={prediciendo}>
              {prediciendo ? '🎬 Prediciendo...' : '🎬 Iniciar Predicción'}
            </button>
          </div>
          <div className="sim-panel sim-right">
            <h3>Fotogramas Generados</h3>
            <div className="frames-grid">
              {frames.length === 0 && !prediciendo && (
                <div className="placeholder-video">
                  <p>Haz clic en "Iniciar Predicción" para simular la generación secuencial de fotogramas. Cada fotograma representa una predicción del modelo sobre el siguiente estado del sistema.</p>
                </div>
              )}
              {prediciendo && frames.length === 0 && (
                <div className="generating"><div className="spinner"></div><p>Prediciendo secuencia de video...</p></div>
              )}
              {frames.map((f, i) => (
                <div key={i} className="frame-card">
                  <img src={f} alt={`Frame ${i + 1}`} />
                  <small>t+{i + 1}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
