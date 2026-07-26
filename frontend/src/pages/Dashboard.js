import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatrizEnfoqueEjecutivo from '../components/MatrizEnfoqueEjecutivo';
import { 
  MessageSquare, 
  Image, 
  Video, 
  FileText, 
  Award, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  Box, Thermometer, Cpu, Flame,
  CreditCard, Shield
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = user?.plan_suscripcion || 'gratuito';
  const isPremium = ['vip_diplomado', 'b2b_enterprise', 'sim_petroleo', 'sim_calderas', 'sim_plc', 'sim_soldadura'].includes(plan);

  const [stats, setStats] = useState({
    evaluaciones: 0,
    aprobadas: 0,
    pendientes: 0,
    certificados: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

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
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const quickActions = [
    {
      icon: <MessageSquare size={24} />,
      title: 'Simulador GPT',
      description: 'Practica con prompts de texto y código',
      path: '/simulador/texto',
      color: 'var(--primary-blue)',
      bg: 'rgba(10, 35, 66, 0.1)'
    },
    {
      icon: <Image size={24} />,
      title: 'Simulador Imágenes',
      description: 'Explora VAE y GANs para inspección visual',
      path: '/simulador/imagenes',
      color: 'var(--secondary-teal)',
      bg: 'rgba(13, 110, 110, 0.1)'
    },
    {
      icon: <Video size={24} />,
      title: 'Simulador Video/Audio',
      description: 'Practica con video y síntesis de voz',
      path: '/simulador/video-audio',
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 168, 67, 0.1)'
    },
    {
      icon: <FileText size={24} />,
      title: 'Evaluaciones',
      description: 'Realiza cuestionarios del curso',
      path: '/evaluaciones',
      color: 'var(--success-green)',
      bg: 'rgba(16, 185, 129, 0.1)'
    }
  ];

  const modulos = [
    {
      id: 1,
      title: 'Módulo 1: Fundamentos de IA',
      description: 'Conceptos básicos, ML, DL y aplicaciones en la industria petrolera',
      icon: '🤖',
      color: 'var(--primary-blue)'
    },
    {
      id: 2,
      title: 'Módulo 2: Prompt Engineering',
      description: 'Diseño de prompts efectivos para GPT y modelos de lenguaje',
      icon: '💬',
      color: 'var(--accent-gold)'
    },
    {
      id: 3,
      title: 'Módulo 3: Gemelos Digitales',
      description: 'Réplicas virtuales de activos y procesos industriales',
      icon: '🏭',
      color: 'var(--secondary-teal)'
    },
    {
      id: 4,
      title: 'Módulo 4: IA Generativa',
      description: 'GPT, DALL-E, Stable Diffusion y modelos de código',
      icon: '🎨',
      color: 'var(--success-green)'
    }
  ];

  const simuladoresPremium = [
    { id: 'petroleo', title: '🛢️ Petróleo — Bombeo IA', desc: 'Balancín 3D + optimización Simplex', icon: <Box size={24} />, path: '/simulador/petroleo', color: '#22C55E', precio: '$85 USD' },
    { id: 'calderas', title: '♨️ Calderas — LIMS 3D', desc: 'Caldera industrial + protocolo LIMS', icon: <Thermometer size={24} />, path: '/simulador/calderas', color: '#F97316', precio: '$75 USD' },
    { id: 'plc', title: '⚡ PLC / SCADA Industrial', desc: 'Siemens S7-1200 + HMI virtual', icon: <Cpu size={24} />, path: '/simulador/plc', color: '#38BDF8', precio: '$95 USD' },
    { id: 'soldadura', title: '👨‍🏭 Soldadura AWS + NDT', desc: 'AWS D1.1 + inspección NDT IA', icon: <Flame size={24} />, path: '/simulador/soldadura', color: '#FBBF24', precio: '$90 USD' }
  ];

  const roleColors = {
    administrador: '#EF4444', tutor: '#F59E0B', participante: '#22C55E'
  };

  return (
    <div>
      {/* ===== BANNER DE ESTADO DE CUENTA (NUEVO) ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '1px solid #334155', borderRadius: '14px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${roleColors[user?.rol] || '#64748B'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            {user?.rol === 'administrador' ? '👑' : user?.rol === 'tutor' ? '📘' : '🎓'}
          </div>
          <div>
            <div style={{ color: '#F8FAFC', fontSize: '16px', fontWeight: 'bold' }}>{user?.nombre_completo || 'Usuario'}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 'bold', background: `${roleColors[user?.rol] || '#64748B'}20`, color: roleColors[user?.rol] || '#64748B', border: `1px solid ${roleColors[user?.rol] || '#64748B'}40` }}>
                {user?.rol === 'administrador' ? '👑 Administrador' : user?.rol === 'tutor' ? '📘 Tutor' : '🎓 Estudiante'}
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 'bold', background: isPremium ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)', color: isPremium ? '#22C55E' : '#94A3B8', border: isPremium ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(100,116,139,0.3)' }}>
                {isPremium ? '✅ Membresía VIP' : '🔓 Plan Gratuito'}
              </span>
            </div>
          </div>
        </div>
        {!isPremium && (
          <button onClick={() => navigate('/suscripcion')} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CreditCard size={14} /> Mejorar a VIP
          </button>
        )}
      </div>

      {/* ===== BANNER ORIGINAL (CON MATRIZ) ===== */}
      <div style={{ backgroundColor: '#1E293B', padding: '25px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #334155' }}>
        <h1 style={{ color: '#38BDF8', fontSize: '26px', margin: '0 0 10px 0' }}>
          Bienvenido al Portal de Decisiones Estratégicas PDVSA — IUTPAL
        </h1>
        <blockquote style={{ margin: '0 0 20px 0', fontStyle: 'italic', color: '#CBD5E1', borderLeft: '3px solid #38BDF8', paddingLeft: '15px', fontSize: '15px' }}>
          &ldquo;En PDVSA no nos falta talento ni experiencia; nos falta velocidad para procesar datos complejos. Esta plataforma transforma la intuición en precisión matemática mediante el Motor de Inteligencia Ejecutiva y la Investigación de Operaciones.&rdquo;
        </blockquote>
        <MatrizEnfoqueEjecutivo />
      </div>

      {/* ===== ESTADÍSTICAS ===== */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FileText size={24} /></div>
          <h3>Evaluaciones Disponibles</h3>
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

      {/* ===== ACCESOS RÁPIDOS (ORIGINAL + CATÁLOGO) ===== */}
      <div className="card">
        <div className="card-header">
          <h2>Accesos Rápidos</h2>
          <TrendingUp size={20} color="var(--text-secondary)" />
        </div>
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              className="quick-action-card"
              onClick={() => navigate(action.path)}
            >
              <div className="icon" style={{ background: action.bg, color: action.color }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          ))}

          {/* Tarjeta destacada: Catálogo de Cursos */}
          <div
            onClick={() => navigate('/cursos')}
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(56,189,248,0.4)',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              gridColumn: '1 / -1'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38BDF8'; e.currentTarget.style.boxShadow = '0 0 20px rgba(56,189,248,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ padding: '12px', background: 'rgba(56,189,248,0.1)', color: '#38BDF8', borderRadius: '8px', fontSize: '1.5rem' }}>
                📚
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38BDF8', background: 'rgba(12,74,110,0.5)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(56,189,248,0.3)' }}>
                Acceso Inmediato
              </span>
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700 }}>Catálogo de Cursos</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: 0 }}>
                Explora los módulos, pistas I.O. y contenido académico en academia-pdvsa.vercel.app/cursos
              </p>
            </div>
            <button style={{ width: '100%', padding: '10px', background: '#0284C7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Ir a Cursos <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== SIMULADORES 3D PREMIUM (NUEVO) ===== */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>🎮 Simuladores 3D — Industria Petrolera (Acceso Técnico)</h2>
          <Shield size={20} color="#FBBF24" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {simuladoresPremium.map((s) => {
            const tieneAcceso = isPremium;
            return (
              <div key={s.id} onClick={() => navigate(tieneAcceso ? s.path : '/suscripcion?recurso=' + encodeURIComponent(s.title))}
                style={{
                  background: '#0F172A', border: `1px solid ${tieneAcceso ? '#22C55E40' : '#334155'}`,
                  borderRadius: '10px', padding: '16px', cursor: 'pointer',
                  transition: '0.2s', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? '#22C55E' : '#FBBF24'; e.currentTarget.style.boxShadow = tieneAcceso ? '0 0 12px rgba(34,197,94,0.12)' : '0 0 12px rgba(251,191,36,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? '#22C55E40' : '#334155'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {!tieneAcceso && <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '16px' }}>🔒</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                  <div>
                    <div style={{ color: '#F8FAFC', fontWeight: 'bold', fontSize: '13px' }}>{s.title}</div>
                    <div style={{ color: s.color, fontSize: '10px', fontWeight: 'bold' }}>{s.precio}</div>
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '11px', margin: 0, flex: 1 }}>{s.desc}</p>
                <button style={{
                  marginTop: '12px', width: '100%', padding: '8px', borderRadius: '6px',
                  border: 'none', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer',
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

      {/* ===== MÓDULOS DEL CURSO (ORIGINAL) ===== */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Módulos del Curso</h2>
          <BookOpen size={20} color="var(--text-secondary)" />
        </div>
        <div className="module-grid">
          {modulos.map((module, index) => (
            <div 
              key={index}
              className="module-card"
              style={{ borderTopColor: module.color }}
            >
              <div className="module-icon" style={{ color: module.color }}>
                {module.icon}
              </div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <Link 
                to={`/cursos/modulo/${module.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  padding: '10px 20px',
                  background: module.color,
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
              >
                Entrar al Módulo →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CURSO IA (ORIGINAL) ===== */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2>Curso: IA para Líderes de Negocio</h2>
        </div>
        <div style={{ padding: '8px 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Programa de formación en Inteligencia Artificial aplicada al sector Oil & Gas,
            diseñado especialmente para los equipos de PDVSA. Incluye fundamentos de IA,
            Prompt Engineering, Gemelos Digitales y aplicaciones prácticas con simuladores interactivos.
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
