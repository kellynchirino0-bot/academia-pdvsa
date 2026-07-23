import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Award, TrendingUp, Clock, FileText, 
  ClipboardList, UserCheck, BarChart3, Activity, CheckCircle,
  AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AdminExecutiveDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      setData(response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner"></div>;
  if (!data) return <div className="card"><div className="empty-state"><h3>Error al cargar dashboard</h3></div></div>;

  const { kpis, auditoria } = data;

  const kpiCards = [
    { title: 'Líderes en Formación', value: kpis.estudiantesActivos, icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Certificaciones IUTPAL', value: kpis.certificadosAprobados, icon: Award, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
    { title: 'Índice de Certeza en Decisiones', value: `${kpis.tasaAprobacion}%`, icon: BarChart3, color: '#0891b2', bg: 'rgba(8, 145, 178, 0.1)' },
    { title: 'Promedio de Evaluación', value: `${kpis.promedioNotas}%`, icon: Activity, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { title: 'Módulos Completados', value: kpis.progresosCompletados, icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Proyectos Analizados', value: kpis.totalLeads || 0, icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { title: 'Horas Burocráticas Ahorradas', value: `${(kpis.progresosCompletados || 0) * 2.5}h`, icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Entregas Pendientes', value: kpis.entregasPendientes || 0, icon: ClipboardList, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' }
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Consola de Inteligencia Ejecutiva</h1>
            <p>Plataforma de Formación en IA para Líderes PDVSA — Nasser Group / IUTPAL</p>
          </div>
          <button className="btn-secondary" onClick={loadDashboard} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Actualizar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ borderTop: `3px solid ${kpi.color}`, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={kpi.color} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{kpi.title}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: kpi.color }}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-header"><h2>Logins Recientes</h2></div>
          <div style={{ padding: '16px' }}>
            {auditoria.loginsRecientes.length === 0 ? (
              <div className="empty-state"><p>Sin actividad reciente</p></div>
            ) : (
              auditoria.loginsRecientes.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: idx < auditoria.loginsRecientes.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={14} color="var(--text-secondary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{log.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.correo}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.ultimo_acceso).toLocaleString('es-VE')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Lecciones Completadas Recientes</h2></div>
          <div style={{ padding: '16px' }}>
            {auditoria.leccionesRecientes.length === 0 ? (
              <div className="empty-state"><p>Sin actividad reciente</p></div>
            ) : (
              auditoria.leccionesRecientes.map((lec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: idx < auditoria.leccionesRecientes.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={14} color="#10b981" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{lec.leccion}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lec.estudiante}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(lec.fecha).toLocaleString('es-VE')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExecutiveDashboard;
