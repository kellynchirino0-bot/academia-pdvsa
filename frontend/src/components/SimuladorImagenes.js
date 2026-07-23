import React, { useState } from 'react';

const escenarios = [
  { label: 'Inspección de Ductos', params: { ruido: 0.05, contraste: 0.8, resolucion: '1024x768', umbral_corrosion: 0.7 }, desc: 'Detección de corrosión en tuberías de transporte de crudo mediante visión artificial.' },
  { label: 'Mapa de Calor - Corrosión', params: { ruido: 0.02, contraste: 0.9, resolucion: '800x600', umbral_corrosion: 0.5 }, desc: 'Generación de mapa térmico para identificar zonas críticas de desgaste en estructuras metálicas.' },
  { label: 'Activación Visual', params: { ruido: 0.08, contraste: 0.6, resolucion: '512x512', umbral_corrosion: 0.3 }, desc: 'Simulación de activaciones de características internas en una red neuronal convolutional (CNN).' },
];

export default function SimuladorImagenes() {
  const [escenario, setEscenario] = useState(0);
  const [params, setParams] = useState(escenarios[0].params);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const actualizarParam = (key, val) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(val) || val }));
  };

  const generarImagen = () => {
    setGenerando(true);
    setResultado(null);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 400; canvas.height = 300;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(200, 150, 10, 200, 150, 200);
      gradient.addColorStop(0, `rgba(255, ${Math.floor(params.contraste * 200)}, 50, 0.9)`);
      gradient.addColorStop(0.5, `rgba(0, ${Math.floor(params.umbral_corrosion * 255)}, 180, 0.6)`);
      gradient.addColorStop(1, 'rgba(10, 20, 40, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(255, ${Math.random() > params.umbral_corrosion ? 100 : 50}, ${Math.random() > params.ruido ? 50 : 200}, ${0.3 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 400, Math.random() * 300, 2 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#00FF8844';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(50 + Math.random() * 300, 50 + Math.random() * 200, 20 + Math.random() * 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      setResultado(canvas.toDataURL());
      setGenerando(false);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Simulador de Imágenes — VAE y GANs</h1>
        <p>Inspección visual de ductos · Mapas de calor · Visión artificial para PDVSA</p>
      </div>
      <div className="sim-row">
        <div className="sim-panel sim-left">
          <h3>Parámetros de Generación</h3>
          <div className="escenarios">
            {escenarios.map((e, i) => (
              <button key={i} className={`template-btn ${i === escenario ? 'active' : ''}`}
                onClick={() => { setEscenario(i); setParams(e.params); setResultado(null); }}>
                {e.label}
              </button>
            ))}
          </div>
          <p className="escenario-desc">{escenarios[escenario].desc}</p>
          <div className="params-grid">
            <label>Ruido: {params.ruido}
              <input type="range" min="0" max="0.2" step="0.01" value={params.ruido}
                onChange={e => actualizarParam('ruido', e.target.value)} />
            </label>
            <label>Contraste: {params.contraste}
              <input type="range" min="0.1" max="1" step="0.05" value={params.contraste}
                onChange={e => actualizarParam('contraste', e.target.value)} />
            </label>
            <label>Umbral Corrosión: {params.umbral_corrosion}
              <input type="range" min="0.1" max="1" step="0.05" value={params.umbral_corrosion}
                onChange={e => actualizarParam('umbral_corrosion', e.target.value)} />
            </label>
            <label>Resolución:
              <select value={params.resolucion} onChange={e => actualizarParam('resolucion', e.target.value)}>
                <option>512x512</option><option>800x600</option><option>1024x768</option>
              </select>
            </label>
          </div>
          <button className="btn-primary" onClick={generarImagen} disabled={generando}>
            {generando ? '🎨 Generando...' : '🎨 Generar Imagen Sintética'}
          </button>
        </div>
        <div className="sim-panel sim-right">
          <h3>Visualización Generada</h3>
          <div className="image-result">
            {generando && <div className="generating"><div className="spinner"></div><p>Generando activación visual...</p></div>}
            {resultado && <img src={resultado} alt="Simulación VAE/GAN" className="gen-image" />}
            {!resultado && !generando && <div className="placeholder-image"><p>Selecciona un escenario y ajusta los parámetros, luego haz clic en "Generar Imagen Sintética" para simular la salida del modelo.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
