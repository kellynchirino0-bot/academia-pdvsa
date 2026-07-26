import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatrizEnfoqueEjecutivo from '../components/MatrizEnfoqueEjecutivo';
import { 
  MessageSquare, Image, Video, FileText, Award, Users,
  TrendingUp, Clock, CheckCircle, BookOpen, Lock, Unlock,
  ChevronRight, CreditCard, Cpu, Thermometer, Box, Flame,
  Shield
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = user?.plan_suscripcion || 'gratuito';
  const isPremium = ['vip_diplomado', 'b2b_enterprise', 'sim_petroleo', 'sim_calderas', 'sim_plc', 'sim_soldadura'].includes(plan);

  const [stats, setStats] = useState({
    evaluaciones: 0, aprobadas: 0, pendientes: 0, certificados: 0
  });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [evalRes, notasRes, certRes] = await Promise.all([
        axios.get(`${API_URL}/evaluations`),
        axios.get(`${API_URL}/evaluations/user/${user?.id}/grades`),
        axios.get(`${API_URL}/certificates/user/${user?.id}`)
      ]);
      setStats({
        evaluaciones: evalRes.data.length,
        aprobadas: (notasRes.data || []).filter(n => n.estatus_aprobacion).length,
        pendientes: evalRes.data.length - notasRes.data.length,
        certificados: certRes.data.length
      });
    } catch (error) { console.error('Error loading stats:', error); }
  };

  const quickActions = [
    { icon: <MessageSquare size={24} />, title: 'Simulador GPT', desc: 'Prompts de texto y código', path: '/simulador/texto', color: '#38BDF8' },
    { icon: <Image size={24} />, title: 'Simulador Imágenes', desc: 'VAE y GANs para inspección visual', path: '/simulador/imagenes', color: '#22D3EE' },
    { icon: <Video size={24} />, title: 'Simulador Video/Audio', desc: 'Síntesis de voz y video', path: '/simulador/video-audio', color: '#FBBF24' },
    { icon: <FileText size={24} />, title: 'Evaluaciones', desc: 'Cuestionarios del curso', path: '/evaluaciones', color: '#22C55E' }
  ];

  const modulosGratis = [
    { id: 1, title: 'Módulo 1: Fundamentos de IA', desc: 'ML, DL y aplicaciones Oil & Gas', icon: '🤖', color: '#38BDF8' },
    { id: 2, title: 'Módulo 2: Prompt Engineering', desc: 'Diseño de prompts para GPT', icon: '💬', color: '#FBBF24' },
    { id: 3, title: 'Módulo 3: Gemelos Digitales', desc: 'Réplicas virtuales de activos', icon: '🏭', color: '#22D3EE' },
    { id: 4, title: 'Módulo 4: IA Generativa', desc: 'GPT, DALL-E, Stable Diffusion', icon: '🎨', color: '#22C55E' }
  ];

  const simuladoresPremium = [
    { id: 'petroleo', title: 'Petróleo — Bombeo IA', desc: 'Balancín 3D + optimización Simplex', icon: <Box size={28} />, path: '/simulador/petroleo', color: '#22C55E', precio: '$85 USD' },
    { id: 'calderas', title: 'Calderas — LIMS 3D', desc: 'Caldera industrial + protocolo LIMS', icon: <Thermometer size={28} />, path: '/simulador/calderas', color: '#F97316', precio: '$75 USD' },
    { id: 'plc', title: 'PLC / SCADA Industrial', desc: 'Siemens S7-1200 + HMI virtual', icon: <Cpu size={28} />, path: '/simulador/plc', color: '#38BDF8', precio: '$95 USD' },
    { id: 'soldadura', title: 'Soldadura AWS + NDT', desc: 'AWS D1.1 + inspección NDT IA', icon: <Flame size={28} />, path: '/simulador/soldadura', color: '#FBBF24', precio: '$90 USD' }
  ];

  const roleColors = {
    administrador: '#EF4444', tutor: '#F59E0B', participante: '#22C55E'
  };

  return (
    <div>
      {/* ===== BANNER DE ESTADO DE CUENTA ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '1px solid #334155', borderRadius: '14px', padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: roleColors[user?.rol] || '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            {user?.rol === 'administrador' ? '👑' : user?.rol === 'tutor' ? '📘' : '🎓'}
          </div>
          <div>
            <div style={{ color: '#F8FAFC', fontSize: '18px', fontWeight: 'bold' }}>{user?.nombre_completo || 'Usuario'}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', background: `${roleColors[user?.rol] || '#64748B'}20`, color: roleColors[user?.rol] || '#64748B', border: `1px solid ${roleColors[user?.rol] || '#64748B'}40` }}>
                {user?.rol === 'administrador' ? '👑 Administrador' : user?.rol === 'tutor' ? '📘 Tutor' : '🎓 Estudiante'}
              </span>
              <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', background: isPremium ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)', color: isPremium ? '#22C55E' : '#94A3B8', border: isPremium ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(100,116,139,0.3)' }}>
                {isPremium ? '✅ Membresía VIP Activa' : '🔓 Plan Gratuito'}
              </span>
            </div>
          </div>
        </div>
        {!isPremium && (
          <button onClick={() => navigate('/suscripcion')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={16} /> Mejorar a VIP
          </button>
        )}
        {isPremium && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/suscripcion')} style={{ padding: '10px 20px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
              Gestionar Plan
            </button>
          </div>
        )}
      </div>

      {/* ===== ESTADÍSTICAS ===== */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card blue">
          <div className="stat-icon"><FileText size={24} /></div>
          <h3>Evaluaciones</h3>
          <div className="stat-value">{stats.evaluaciones}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <h3>Aprobadas</h3>
          <div className="stat-value">{stats.aprobadas}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><Clock size={24} /></div>
          <h3>Pendientes</h3>
          <div className="stat-value">{stats.pendientes}</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon"><Award size={24} /></div>
          <h3>Certificados</h3>
          <div className="stat-value">{stats.certificados}</div>
        </div>
      </div>

      {/* ===== ACCESOS RÁPIDOS (Simuladores IA Gratuitos) ===== */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2>🧠 Asistentes de IA (100% Gratuitos)</h2>
          <TrendingUp size={20} color="#64748B" />
        </div>
        <div className="quick-actions">
          {quickActions.map((a, i) => (
            <div key={i} className="quick-action-card" onClick={() => navigate(a.path)}>
              <div className="icon" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CURSOS ABIERTOS IA (GRATUITOS) ===== */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2>📚 Cursos Abiertos e IA (100% Gratuitos)</h2>
          <BookOpen size={20} color="#64748B" />
        </div>
        <div className="module-grid">
          {modulosGratis.map((m, i) => (
            <div key={i} className="module-card" style={{ borderTopColor: m.color }}>
              <div className="module-icon" style={{ color: m.color, fontSize: '2rem' }}>{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <Link to={`/cursos/modulo/${m.id}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', background: m.color, color: '#fff',
                  borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
                  fontSize: '0.85rem', cursor: 'pointer'
                }}>
                  Entrar <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SIMULADORES 3D PREMIUM ===== */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2>🎮 Simuladores 3D — Industria Petrolera (Acceso Técnico)</h2>
          <Shield size={20} color="#FBBF24" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {simuladoresPremium.map((s) => {
            const tieneAcceso = isPremium;
            return (
              <div key={s.id} onClick={() => navigate(tieneAcceso ? s.path : '/suscripcion?recurso=' + encodeURIComponent(s.title))}
                style={{
                  background: '#0F172A', border: `1px solid ${tieneAcceso ? '#22C55E40' : '#334155'}`,
                  borderRadius: '12px', padding: '20px', cursor: 'pointer',
                  transition: '0.2s', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? '#22C55E' : '#FBBF24'; e.currentTarget.style.boxShadow = tieneAcceso ? '0 0 15px rgba(34,197,94,0.15)' : '0 0 15px rgba(251,191,36,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? '#22C55E40' : '#334155'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {!tieneAcceso && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '18px' }}>🔒</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                  <div>
                    <div style={{ color: '#F8FAFC', fontWeight: 'bold', fontSize: '14px' }}>{s.title}</div>
                    <div style={{ color: s.color, fontSize: '11px', fontWeight: 'bold' }}>{s.precio}</div>
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0, flex: 1 }}>{s.desc}</p>
                <button style={{
                  marginTop: '14px', width: '100%', padding: '10px', borderRadius: '8px',
                  border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                  background: tieneAcceso ? 'linear-gradient(135deg, #22C55E, #16A34A)' : '#1E293B',
                  color: tieneAcceso ? '#FFF' : '#FBBF24',
                  border: tieneAcceso ? 'none' : '1px solid #FBBF2440',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  {tieneAcceso ? '✅ Acceso Directo' : '🔒 Desbloquear — ' + s.precio}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MATRIZ ESTRATÉGICA ===== */}
      <div style={{ background: '#1E293B', padding: '25px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #334155' }}>
        <h2 style={{ color: '#38BDF8', fontSize: '18px', margin: '0 0 12px 0' }}>📊 Matriz de Enfoque Ejecutivo</h2>
        <MatrizEnfoqueEjecutivo />
      </div>

      {/* ===== MÓDULOS DEL CURSO IA ===== */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2>📖 Curso: IA para Líderes de Negocio</h2>
        </div>
        <div style={{ padding: '8px 0' }}>
          <p style={{ color: '#94A3B8', marginBottom: '16px', fontSize: '14px' }}>
            Programa de formación en Inteligencia Artificial aplicada al sector Oil & Gas,
            diseñado para los equipos de PDVSA. Incluye fundamentos de IA,
            Prompt Engineering, Gemelos Digitales y aplicaciones prácticas.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-info">40 Horas</span>
            <span className="badge badge-success">4 Módulos</span>
            <span className="badge badge-warning">3 Evaluaciones</span>
            <span className="badge badge-info">Certificado Digital</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
