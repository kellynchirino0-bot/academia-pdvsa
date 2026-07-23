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
    { titulo: 'Evaluaciones Completadas', valor: stats.evaluaciones, icon: '📝', color: '#0077B6' },
    { titulo: 'Módulos Aprobados', valor: stats.aprobadas, icon: '✅', color: '#00B4D8' },
    { titulo: 'Índice de Certeza', valor: `${stats.promedio}%`, icon: '📊', color: '#F4A261' },
    { titulo: 'Rol', valor: usuario?.rol || '-', icon: '👤', color: '#E76F51' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Consola de Inteligencia</h1>
        <p>Bienvenido, <strong>{usuario?.nombre_completo}</strong> — {usuario?.cargo || 'Participante'}</p>
      </div>
      <div className="stats-grid">
        {tarjetas.map((t, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: t.color }}>
            <div className="stat-icon">{t.icon}</div>
            <div className="stat-info">
              <div className="stat-val">{t.valor}</div>
              <div className="stat-lbl">{t?.titulo || ''}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="info-section">
        <h2>IA para Líderes de Negocio — PDVSA / IUTPAL</h2>
        <p>Programa de formación ejecutiva diseñado para gerentes, administrativos y supervisores de PDVSA que buscan tomar decisiones estratégicas respaldadas por Inteligencia Artificial, optimizar procesos administrativos y liderar la transformación digital.</p>
        <div className="modulos-resumen">
          <div className="modulo-card"><span>🛡️</span><strong>Módulo 1:</strong> IA como Activo Estratégico y Soberanía Digital</div>
          <div className="modulo-card"><span>💬</span><strong>Módulo 2:</strong> Inteligencia de Datos e Ingeniería de Prompts para Gerentes</div>
          <div className="modulo-card"><span>📊</span><strong>Módulo 3:</strong> Eficiencia Administrativa y Gestión de Recursos</div>
          <div className="modulo-card"><span>⚡</span><strong>Módulo 4:</strong> Simulación de Crisis, Gestión de Riesgos y Liderazgo Aumentado</div>
        </div>
      </div>
    </div>
  );
}
