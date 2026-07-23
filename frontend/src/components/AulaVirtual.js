import React, { useState, useRef } from 'react';

const modulos = [
  { id: 1, titulo: 'Fundamentos de IA Generativa', duracion: '45:00', video: '', desc: 'Introducción a modelos GPT, VAE y GANs aplicados a PDVSA.' },
  { id: 2, titulo: 'Prompt Engineering para PDVSA', duracion: '50:00', video: '', desc: 'Redacción de prompts técnicos para informes, auditorías y automatización.' },
  { id: 3, titulo: 'Visión Artificial e Inspección de Ductos', duracion: '55:00', video: '', desc: 'Detección de corrosión y fallas estructurales con redes neuronales.' },
  { id: 4, titulo: 'Síntesis de Video y Audio', duracion: '40:00', video: '', desc: 'Clonación de voz, texto a voz y predicción de fotogramas.' },
  { id: 5, titulo: 'Automatización Industrial con IA', duracion: '50:00', video: '', desc: 'Gemelos digitales, IoT y control predictivo de activos.' },
  { id: 6, titulo: 'Ética, Regulación y Despliegue', duracion: '35:00', video: '', desc: 'Marco regulatorio PDVSA, privacidad y gobernanza de IA.' },
];

export default function AulaVirtual() {
  const [moduloActual, setModuloActual] = useState(0);
  const [avance, setAvance] = useState({});
  const videoRef = useRef(null);

  const marcarAvance = (id) => {
    setAvance(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Aula Virtual</h1>
        <p>Repositorio de clases asíncronas con control de avance</p>
      </div>
      <div className="aula-grid">
        <div className="aula-sidebar">
          <h3>Módulos del Curso</h3>
          {modulos.map((m, i) => (
            <div key={m.id}
              className={`modulo-item ${i === moduloActual ? 'active' : ''} ${avance[m.id] ? 'completado' : ''}`}
              onClick={() => { setModuloActual(i); }}>
              <span className="modulo-num">{String(m.id).padStart(2, '0')}</span>
              <div className="modulo-info">
                <strong>{m?.titulo || 'Sin título'}</strong>
                <small>{m.duracion} · {avance[m.id] ? '✅ Completado' : 'Pendiente'}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="aula-main">
          {modulos[moduloActual] && (
            <div className="aula-content">
              <div className="aula-header">
                <h2>Módulo {modulos[moduloActual]?.id}: {modulos[moduloActual]?.titulo || 'Sin título'}</h2>
                <span className="aula-duracion">⏱ {modulos[moduloActual].duracion}</span>
              </div>
              <div className="aula-player">
                <div className="player-placeholder">
                  <div className="play-icon">▶</div>
                   <p>Reproductor Multimedia — Clase: {modulos[moduloActual]?.titulo || 'Sin título'}</p>
                  <small>Video incrustado desde el repositorio corporativo de Nasser Group</small>
                  <div className="player-controls">
                    <button className="btn-control" onClick={() => alert('Simulación: reproduciendo clase...')}>▶ Reproducir</button>
                    <button className="btn-control" onClick={() => alert('Simulación: clase pausada.')}>⏸ Pausar</button>
                  </div>
                </div>
              </div>
              <div className="aula-desc">
                <p>{modulos[moduloActual].desc}</p>
                <button className={avance[modulos[moduloActual].id] ? 'btn-completed' : 'btn-primary'}
                  onClick={() => marcarAvance(modulos[moduloActual].id)}>
                  {avance[modulos[moduloActual].id] ? '✅ Completado' : 'Marcar como Completado'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
