import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatrizEnfoqueEjecutivo from '../components/MatrizEnfoqueEjecutivo';
import PanelCalculadora from '../components/PanelCalculadora';
import Simulador3D from '../components/Simulador3D';
import {
  MessageSquare, Image, Video, FileText, Award, Users,
  TrendingUp, Clock, CheckCircle, BookOpen,
  Box, Thermometer, Cpu, Flame,
  CreditCard, Shield, GraduationCap, BarChart3, Target,
  Lock, Unlock, Zap, ExternalLink, ChevronRight,
  Search, Activity, Circle, Calculator, GitBranch, Package, Cube
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = user?.plan_suscripcion || 'gratuito';
  const planesFullAccess = ['vip_diplomado', 'b2b_enterprise'];
  const hasPlanAccess = (requiredPlan) => planesFullAccess.includes(plan) || plan === requiredPlan;
  const isPremium = hasPlanAccess('sim_petroleo') || hasPlanAccess('sim_calderas') || hasPlanAccess('sim_plc') || hasPlanAccess('sim_soldadura');

  const [stats, setStats] = useState({
    evaluaciones: 0, aprobadas: 0, pendientes: 0, certificados: 0
  });
  const [modulosProgreso, setModulosProgreso] = useState({});
  const [progresoGlobal, setProgresoGlobal] = useState(0);

  useEffect(() => {
    loadStats();
    loadProgress();
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
        pendientes: Math.max(0, evalRes.data.length - (notasRes.data || []).length),
        certificados: certRes.data.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await axios.get(`${API_URL}/progress/${user?.id}`);
      const data = res.data;
      setProgresoGlobal(data.porcentaje_global || 0);
      const modPros = {};
      (data.modulos || []).forEach(m => {
        modPros[m.id] = m.porcentaje || 0;
      });
      setModulosProgreso(modPros);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const modulos = [
    { id: 1, title: 'Fundamentos de IA en Oil & Gas', desc: 'ML supervisado, Deep Learning, mantenimiento predictivo en hidrocarburos', icon: '🤖', color: '#3B82F6', lecciones: 3 },
    { id: 2, title: 'Prompt Engineering Petrolero', desc: 'Marco RICE, técnicas avanzadas, mitigación de alucinaciones', icon: '💬', color: '#F59E0B', lecciones: 3 },
    { id: 3, title: 'Gemelos Digitales', desc: 'Réplicas virtuales de activos, integración SCADA/IoT, simulación', icon: '🏭', color: '#14B8A6', lecciones: 3 },
    { id: 4, title: 'IA Generativa en Petrofísica', desc: 'LLMs, procesamiento LAS, automatización de reportes', icon: '🎨', color: '#8B5CF6', lecciones: 3 }
  ];

  const [assetType3d, setAssetType3d] = useState('bomba');

  const herramientasGratis = [
    { icon: <MessageSquare size={22} />, title: 'Asistente Ejecutivo IA', desc: 'Simulador GPT con prompts para reportes y análisis petroleros', path: '/simulador/texto', color: '#3B82F6' },
    { icon: <Image size={22} />, title: 'Analizador de Imágenes', desc: 'VAE y GANs para inspección visual de activos', path: '/simulador/imagenes', color: '#14B8A6' },
    { icon: <Video size={22} />, title: 'Síntesis Multimedia', desc: 'Generación de video, audio y clonación de voz', path: '/simulador/video-audio', color: '#F59E0B' },
    { icon: <FileText size={22} />, title: 'Evaluaciones en Vivo', desc: 'Cuestionarios interactivos por módulo académico', path: '/evaluaciones', color: '#22C55E' }
  ];

  const simuladoresPremium = [
    { id: 'petroleo', title: '🛢️ Petróleo — Bombeo IA', desc: 'Balancín 3D + optimización Simplex para elevación artificial', icon: <Box size={24} />, path: '/simulador/petroleo', color: '#22C55E', precio: '$85 USD', requiredPlan: 'sim_petroleo' },
    { id: 'calderas', title: '♨️ Calderas — LIMS 3D', desc: 'Caldera industrial corte transversal + protocolo LIMS interactivo', icon: <Thermometer size={24} />, path: '/simulador/calderas', color: '#F97316', precio: '$75 USD', requiredPlan: 'sim_calderas' },
    { id: 'plc', title: '⚡ PLC / SCADA Industrial', desc: 'Siemens S7-1200 3D con HMI virtual y señales 4-20mA', icon: <Cpu size={24} />, path: '/simulador/plc', color: '#38BDF8', precio: '$95 USD', requiredPlan: 'sim_plc' },
    { id: 'soldadura', title: '👨‍🏭 Soldadura AWS + NDT', desc: 'Junta biselada 3D con inspección por ultrasonido y partículas', icon: <Flame size={24} />, path: '/simulador/soldadura', color: '#FBBF24', precio: '$90 USD', requiredPlan: 'sim_soldadura' }
  ];

  const roleColors = {
    administrador: '#EF4444', tutor: '#F59E0B', participante: '#22C55E'
  };

  const SectionHeader = ({ icon, title, subtitle, action }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
        <div>
          <h2 style={{ color: '#F1F5F9', fontSize: '18px', fontWeight: '700', margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ color: '#64748B', fontSize: '12px', margin: '2px 0 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {action && action}
    </div>
  );

  const PremiumBadge = ({ hasAccess }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px',
      borderRadius: '999px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.3px',
      background: hasAccess ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
      color: hasAccess ? '#22C55E' : '#94A3B8',
      border: hasAccess ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(100,116,139,0.25)'
    }}>
      {hasAccess ? '✅ Desbloqueado' : '🔒 Bloqueado'}
    </span>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ===== BANNER SUPERIOR DE BIENVENIDA ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0F1E 0%, #1A1F35 50%, #0F172A 100%)',
        border: '1px solid rgba(56,189,248,0.15)', borderRadius: '16px',
        padding: '24px 28px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${roleColors[user?.rol] || '#64748B'}30, ${roleColors[user?.rol] || '#64748B'}10)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
              border: `1px solid ${roleColors[user?.rol] || '#64748B'}30`
            }}>
              {user?.rol === 'administrador' ? '👑' : user?.rol === 'tutor' ? '📘' : '🎓'}
            </div>
            <div>
              <h1 style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>
                {user?.rol === 'administrador' ? 'Panel de Administración' : 'Consola de Inteligencia'}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0' }}>
                {user?.nombre_completo} — <strong style={{ color: roleColors[user?.rol] }}>{user?.rol === 'administrador' ? '👑 Administrador' : user?.rol === 'tutor' ? '📘 Tutor' : '🎓 Estudiante'}</strong>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
              background: isPremium ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
              color: isPremium ? '#22C55E' : '#94A3B8',
              border: isPremium ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(100,116,139,0.2)',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {isPremium ? '✅ Membresía VIP Activa' : '🔓 Plan Gratuito'}
            </span>
            {!isPremium && (
              <button onClick={() => navigate('/suscripcion')} style={{
                padding: '8px 16px', background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '700',
                fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s'
              }}>
                <CreditCard size={14} /> Activar Membresía VIP
              </button>
            )}
            {isPremium && (
              <button onClick={() => navigate('/suscripcion')} style={{
                padding: '8px 16px', background: 'rgba(34,197,94,0.1)', color: '#22C55E',
                border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', fontWeight: '700',
                fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Shield size={14} /> Gestionar Membresía
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== BANNER MATRIZ EJECUTIVA ===== */}
      <div style={{ background: '#1E293B', padding: '24px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #334155' }}>
        <h2 style={{ color: '#38BDF8', fontSize: '22px', margin: '0 0 8px 0', fontWeight: '800' }}>
          Portal de Decisiones Estratégicas PDVSA — IUTPAL
        </h2>
        <blockquote style={{ margin: '0 0 18px 0', fontStyle: 'italic', color: '#CBD5E1', borderLeft: '3px solid #38BDF8', paddingLeft: '15px', fontSize: '14px', lineHeight: 1.6 }}>
          &ldquo;En PDVSA no nos falta talento ni experiencia; nos falta velocidad para procesar datos complejos. Esta plataforma transforma la intuición en precisión matemática mediante el Motor de Inteligencia Ejecutiva y la Investigación de Operaciones.&rdquo;
        </blockquote>
        <MatrizEnfoqueEjecutivo />
      </div>

      {/* ===== SECCIÓN 1: CURSO DE IA PARA PDVSA (100% GRATUITO) ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1A2440 100%)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader
          icon="📚"
          title="Curso de Inteligencia Artificial para PDVSA"
          subtitle="100% gratuito — 4 módulos, 16 lecciones, evaluaciones y certificado digital"
          action={
            <button onClick={() => navigate('/cursos')} style={{
              padding: '8px 16px', background: 'rgba(59,130,246,0.12)', color: '#60A5FA',
              border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', fontWeight: '700',
              fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              Ir al Curso <ExternalLink size={14} />
            </button>
          }
        />

        <div style={{ background: 'rgba(59,130,246,0.06)', borderRadius: '10px', padding: '16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            <GraduationCap size={20} color="#60A5FA" />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '600' }}>Progreso Global del Curso</div>
            <div style={{ marginTop: '6px', height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progresoGlobal}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <span style={{ color: '#94A3B8', fontSize: '20px', fontWeight: '800', fontFamily: 'monospace' }}>{progresoGlobal}%</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Evaluaciones', value: stats.evaluaciones, color: '#3B82F6' },
              { label: 'Aprobadas', value: stats.aprobadas, color: '#22C55E' },
              { label: 'Certificados', value: stats.certificados, color: '#8B5CF6' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ color: s.color, fontSize: '18px', fontWeight: '800' }}>{s.value}</div>
                <div style={{ color: '#64748B', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {modulos.map((mod) => {
            const pct = modulosProgreso[mod.id] || 0;
            return (
              <div key={mod.id} onClick={() => navigate(`/cursos/modulo/${mod.id}`)} style={{
                background: '#0F172A', border: `1px solid ${mod.color}20`, borderRadius: '10px',
                padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', gap: '8px'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${mod.color}60`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${mod.color}20`; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{mod.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#F1F5F9', fontWeight: '700', fontSize: '13px' }}>Módulo {mod.id}: {mod.title}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>{mod.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: mod.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', minWidth: '35px', textAlign: 'right' }}>{pct}%</span>
                  <ChevronRight size={14} color="#64748B" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SECCIÓN 2: ASISTENTES Y HERRAMIENTAS IA GRATUITAS ===== */}
      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader icon="🧠" title="Asistentes y Herramientas IA Gratuitas" subtitle="Simuladores de texto, imágenes, video y evaluaciones en vivo" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {herramientasGratis.map((h, i) => (
            <div key={i} onClick={() => navigate(h.path)} style={{
              background: '#1E293B', border: '1px solid #334155', borderRadius: '10px',
              padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', gap: '12px', alignItems: 'flex-start'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${h.color}50`; e.currentTarget.style.background = '#1A2440'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = '#1E293B'; }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${h.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.color, flexShrink: 0 }}>
                {h.icon}
              </div>
              <div>
                <div style={{ color: '#F1F5F9', fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{h.title}</div>
                <p style={{ color: '#64748B', fontSize: '11px', margin: 0, lineHeight: 1.4 }}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SECCIÓN 3: SUITE INDUSTRIAL 3D / SIMULADORES VIP ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1A1F35 100%)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader
          icon="🎮"
          title="Suite Industrial 3D — Simuladores Especializados (VIP)"
          subtitle="Acceso individual desde $75 USD o completo con Membresía VIP ($450 USD)"
          action={
            !isPremium ? (
              <button onClick={() => navigate('/suscripcion')} style={{
                padding: '8px 16px', background: 'linear-gradient(135deg, #FBBF24, #D97706)', color: '#0F172A',
                border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '11px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Zap size={14} /> Ver Planes
              </button>
            ) : null
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {simuladoresPremium.map((s) => {
            const tieneAcceso = hasPlanAccess(s.requiredPlan);
            return (
              <div key={s.id} onClick={() => navigate(tieneAcceso ? s.path : `/suscripcion?recurso=${encodeURIComponent(s.title)}`)} style={{
                background: '#0F172A', border: `1px solid ${tieneAcceso ? 'rgba(34,197,94,0.3)' : '#334155'}`,
                borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? '#22C55E' : '#FBBF24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = tieneAcceso ? 'rgba(34,197,94,0.3)' : '#334155'; e.currentTarget.style.transform = 'none'; }}>
                {!tieneAcceso && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(251,191,36,0.12)', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', color: '#FBBF24', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> {s.precio}
                </div>}
                {tieneAcceso && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(34,197,94,0.12)', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', color: '#22C55E', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Unlock size={12} /> Desbloqueado
                </div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: `${s.color}15`, color: s.color, display: 'flex' }}>{s.icon}</div>
                  <div>
                    <div style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '14px' }}>{s.title}</div>
                    <div style={{ color: s.color, fontSize: '11px', fontWeight: '600' }}>{s.precio}</div>
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '11px', margin: 0, lineHeight: 1.5, minHeight: '33px' }}>{s.desc}</p>
                <button style={{
                  marginTop: '14px', width: '100%', padding: '10px', borderRadius: '8px',
                  border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer',
                  background: tieneAcceso ? 'linear-gradient(135deg, #22C55E, #16A34A)' : '#1E293B',
                  color: tieneAcceso ? '#FFF' : '#FBBF24',
                  border: tieneAcceso ? 'none' : '1px solid rgba(251,191,36,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}>
                  {tieneAcceso ? '✅ Acceder al Simulador' : '🔒 Desbloquear — ' + s.precio}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SECCIÓN 4: INVESTIGACIÓN DE OPERACIONES — CALCULADORAS IO ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1A2440 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader
          icon="🧮"
          title="Investigación de Operaciones — Calculadoras IO"
          subtitle="Simplex (Mezcla de Crudos), CPM/PERT (Ruta Crítica) y EOQ (Inventarios) — Datos pre-cargados para PDVSA"
        />
        <PanelCalculadora />
      </div>

      {/* ===== SECCIÓN 5: VISOR INDUSTRIAL 3D ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader
          icon="🏗️"
          title="Visor Industrial 3D — Equipos de Proceso"
          subtitle="COVENIN 3049-93 — Seleccione un equipo para inspeccionar sus componentes"
          action={
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'bomba', label: 'Bomba', color: '#2563EB' },
                { id: 'valvula', label: 'Válvula', color: '#F59E0B' },
                { id: 'tanque', label: 'Tanque', color: '#10B981' },
                { id: 'balancin', label: 'Balancín', color: '#F97316' }
              ].map(a => (
                <button key={a.id} onClick={() => setAssetType3d(a.id)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', border: `1px solid ${assetType3d === a.id ? a.color : 'transparent'}`,
                    background: assetType3d === a.id ? `${a.color}20` : '#1E293B',
                    color: assetType3d === a.id ? a.color : '#94A3B8', cursor: 'pointer',
                    fontSize: '10px', fontWeight: '600', transition: 'all 0.2s'
                  }}>
                  {a.label}
                </button>
              ))}
            </div>
          }
        />
        <Simulador3D assetType={assetType3d} width="100%" height="420px" />
      </div>

      {/* ===== SECCIÓN 6: CERTIFICACIÓN CRIPTOGRÁFICA ML-DSA & LAGOCHAIN ===== */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <SectionHeader
          icon="🎓"
          title="Certificación Criptográfica ML-DSA & LagoChain"
          subtitle="Diploma digital con firma FIPS-204 ML-DSA-87 sobre blockchain inmutable"
          action={
            <button onClick={() => navigate('/certificados')} style={{
              padding: '8px 16px', background: 'rgba(139,92,246,0.12)', color: '#A78BFA',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: '8px', fontWeight: '700',
              fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              Mis Certificados <ExternalLink size={14} />
            </button>
          }
        />
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', background: 'rgba(139,92,246,0.05)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(139,92,246,0.1)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🏆
              </div>
              <div>
                <div style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '700' }}>Diplomado en IA e IO para Líderes</div>
                <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>Completa los 4 módulos y obtén tu certificado</div>
              </div>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
              {[
                { label: 'Certificados', value: stats.certificados, color: '#A78BFA' },
                { label: 'Evaluaciones', value: `${stats.aprobadas}/${stats.evaluaciones}`, color: '#22C55E' }
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: '#0F172A', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ color: s.color, fontSize: '20px', fontWeight: '800' }}>{s.value}</div>
                  <div style={{ color: '#64748B', fontSize: '10px', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/certificados')} style={{
              padding: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: '8px', color: '#A78BFA', fontWeight: '700', fontSize: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <FileText size={16} /> Ver / Solicitar Certificado
            </button>
            <button onClick={() => navigate('/verificar-certificado')} style={{
              padding: '12px', background: '#1E293B', border: '1px solid #334155',
              borderRadius: '8px', color: '#94A3B8', fontWeight: '600', fontSize: '12px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <Search size={16} /> Verificar Certificado (Blockchain)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
