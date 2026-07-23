import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Award, TrendingUp, Clock, FileText, 
  ClipboardList, UserCheck, BarChart3, Activity, CheckCircle,
  AlertTriangle, ArrowUpRight, ArrowDownRight, GitBranch, Package, Target,
  Play, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AdminExecutiveDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuiaSimulacion, setShowGuiaSimulacion] = useState(false);

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
    { title: 'Entregas Pendientes', value: kpis.entregasPendientes || 0, icon: ClipboardList, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' },
    { title: 'Modelos de Optimización I.O. Ejecutados', value: Math.floor((kpis.progresosCompletados || 0) * 1.2), icon: GitBranch, color: '#0891b2', bg: 'rgba(8, 145, 178, 0.1)' },
    { title: 'Eficiencia CPM/PERT en Paradas', value: `${Math.min(95, 70 + (kpis.tasaAprobacion || 0) * 0.25)}%`, icon: Target, color: '#0369a1', bg: 'rgba(3, 105, 161, 0.1)' },
    { title: 'Ahorro Proyectado en Inventario EOQ', value: `$${((kpis.progresosCompletados || 0) * 1800).toLocaleString()}`, icon: Package, color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)' }
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

      {/* Guía de Simulación en Vivo para el Profesor Jarvis */}
      <div className="card" style={{ marginBottom: '24px', border: '2px solid #0891b2' }}>
        <div 
          onClick={() => setShowGuiaSimulacion(!showGuiaSimulacion)}
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(8,145,178,0.05), rgba(2,132,199,0.08))'
          }}
        >
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            background: 'rgba(8,145,178,0.15)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Play size={20} color="#0891b2" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#003366' }}>
              Guía de Apertura y Ejercicios en Vivo (5 Minutos)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Casos prácticos de Investigación de Operaciones para proyectar durante las jornadas con directiva PDVSA
            </div>
          </div>
          {showGuiaSimulacion ? <ChevronUp size={20} color="#0891b2" /> : <ChevronDown size={20} color="#0891b2" />}
        </div>

        {showGuiaSimulacion && (
          <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ padding: '16px', background: 'rgba(8,145,178,0.03)', borderRadius: '8px', marginTop: '16px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <strong style={{ color: '#003366' }}>Instrucciones para el Profesor Jarvis:</strong> Durante la jornada con directiva y supervisores de PDVSA, proyecte esta guía y ejecute cada caso en el <strong>Asistente Ejecutivo IA</strong> en vivo. Cada ejercicio toma aproximadamente 5 minutos.
              </p>
            </div>

            {/* Caso 1: Simplex */}
            <div style={{ marginTop: '16px', padding: '16px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', borderLeft: '4px solid #0891b2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', 
                  background: 'rgba(8,145,178,0.1)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#0891b2'
                }}>1</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.95rem' }}>Caso 1 — Método Simplex: Mezcla de Crudo</div>
                  <div style={{ fontSize: '0.75rem', color: '#0891b2' }}>Plantilla I.O.: <code>io1</code></div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px' }}>
                Cargue en el Asistente Ejecutivo la plantilla <strong>io1</strong> para demostrar cómo calcular la proporción óptima de procesamiento entre Crudo Pesado y Liviano que maximiza el margen operativo bajo capacidad limitada de refinación.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(8,145,178,0.1)', color: '#0891b2', borderRadius: '12px' }}>Método Simplex</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(8,145,178,0.1)', color: '#0891b2', borderRadius: '12px' }}>Programación Lineal</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(8,145,178,0.1)', color: '#0891b2', borderRadius: '12px' }}>Optimización de Mezclas</span>
              </div>
            </div>

            {/* Caso 2: CPM/PERT */}
            <div style={{ marginTop: '12px', padding: '16px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', borderLeft: '4px solid #0369a1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', 
                  background: 'rgba(3,105,161,0.1)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#0369a1'
                }}>2</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.95rem' }}>Caso 2 — CPM/PERT: Parada de Planta</div>
                  <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>Plantilla I.O.: <code>io2</code></div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px' }}>
                Cargue la plantilla <strong>io2</strong> para mostrar el cálculo probabilístico de holguras, ruta crítica y reducción del tiempo total en la parada de mantenimiento de una planta de fraccionamiento.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(3,105,161,0.1)', color: '#0369a1', borderRadius: '12px' }}>CPM/PERT</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(3,105,161,0.1)', color: '#0369a1', borderRadius: '12px' }}>Ruta Crítica</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(3,105,161,0.1)', color: '#0369a1', borderRadius: '12px' }}>Gestión de Proyectos</span>
              </div>
            </div>

            {/* Caso 3: EOQ */}
            <div style={{ marginTop: '12px', padding: '16px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', 
                  background: 'rgba(2,132,199,0.1)', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700', color: '#0284c7'
                }}>3</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.95rem' }}>Caso 3 — EOQ: Repuestos Críticos</div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>Plantilla I.O.: <code>io3</code></div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 10px' }}>
                Cargue la plantilla <strong>io3</strong> para simular la reducción de costos en almacén aplicando el Lote Económico de Pedido (EOQ) sin arriesgar la continuidad operativa por falta de bombas o repuestos críticos.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', borderRadius: '12px' }}>EOQ</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', borderRadius: '12px' }}>Inventarios</span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', borderRadius: '12px' }}>Reducción de Costos</span>
              </div>
            </div>

            {/* Nota al pie */}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(212,168,67,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={16} color="#d4a843" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#003366' }}>Tip:</strong> Después de cada ejercicio, pida a los participantes que propongan sus propios datos para resolver en tiempo real con el Asistente Ejecutivo IA.
              </span>
            </div>
          </div>
        )}
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
