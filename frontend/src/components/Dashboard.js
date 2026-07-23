import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario, getApi } = useAuth();
  const [stats, setStats] = useState({ evaluaciones: 0, aprobadas: 0, promedio: 0 });

  useEffect(() => {
    getApi().get('/notas/mis-notas').then(r => {
      const data = r.data;
      setStats({
        evaluaciones: data.length,
        aprobadas: data.filter(n => n.estatus_aprobacion === 'Aprobado').length,
        promedio: data.length > 0
          ? (data.reduce((s, n) => s + parseFloat(n.calificacion), 0) / data.length).toFixed(1)
          : 0,
      });
    }).catch(() => {});
  }, [getApi]);

  const tarjetas = [
    { titulo: 'Evaluaciones', valor: stats.evaluaciones, icon: '📝', color: '#0077B6' },
    { titulo: 'Aprobadas', valor: stats.aprobadas, icon: '✅', color: '#00B4D8' },
    { titulo: 'Promedio', valor: `${stats.promedio}%`, icon: '📊', color: '#F4A261' },
    { titulo: 'Rol', valor: usuario?.rol || '-', icon: '👤', color: '#E76F51' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido, <strong>{usuario?.nombre_completo}</strong> — {usuario?.cargo || 'Participante'}</p>
      </div>
      <div className="stats-grid">
        {tarjetas.map((t, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: t.color }}>
            <div className="stat-icon">{t.icon}</div>
            <div className="stat-info">
              <div className="stat-val">{t.valor}</div>
              <div className="stat-lbl">{t.titulo}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="info-section">
        <h2>Curso: Inteligencia Artificial para Líderes de Negocio</h2>
        <p>Programa diseñado para profesionales de PDVSA que buscan integrar herramientas de IA generativa, gemelos digitales y automatización inteligente en la industria petrolera venezolana.</p>
        <div className="modulos-resumen">
          <div className="modulo-card"><span>💬</span><strong>Módulo 1:</strong> Fundamentos de IA Generativa</div>
          <div className="modulo-card"><span>🤖</span><strong>Módulo 2:</strong> Prompt Engineering para PDVSA</div>
          <div className="modulo-card"><span>🖼️</span><strong>Módulo 3:</strong> Visión Artificial e Inspección de Ductos</div>
          <div className="modulo-card"><span>🎬</span><strong>Módulo 4:</strong> Síntesis de Video y Audio Corporativo</div>
          <div className="modulo-card"><span>⚙️</span><strong>Módulo 5:</strong> Automatización Industrial con IA</div>
          <div className="modulo-card"><span>📜</span><strong>Módulo 6:</strong> Ética, Regulación y Despliegue</div>
        </div>
      </div>
    </div>
  );
}
