import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TrialCountdownBanner from './TrialCountdownBanner';
import NotificationsCenter from './NotificationsCenter';
import FooterGabrielBiz from './FooterGabrielBiz';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image, 
  Video, 
  FileText, 
  Award, 
  Users,
  LogOut,
  BookOpen,
  GraduationCap,
  UserPlus,
  Settings,
  Briefcase,
  Target,
  ClipboardList,
  BarChart3,
  UserCog,
  Edit3,
  FileBarChart,
  HelpCircle,
  Shield,
  Box,
  Thermometer,
  Cpu,
  Flame,
  CreditCard,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, trial } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const plan = user?.plan_suscripcion || 'gratuito';
  const planesFullAccess = ['vip_diplomado', 'b2b_enterprise'];
  const isPremium = planesFullAccess.includes(plan) || ['sim_petroleo', 'sim_calderas', 'sim_plc', 'sim_soldadura'].includes(plan);
  const hasPlanAccess = (requiredPlan) => planesFullAccess.includes(plan) || plan === requiredPlan;

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: '📊 Consola de Inteligencia', roles: ['administrador', 'tutor', 'participante'] },
    // --- Cursos Gratuitos ---
    { divider: '📚 Cursos Gratuitos', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/cursos', icon: BookOpen, label: 'Módulos del Curso IA', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/texto', icon: MessageSquare, label: '🤖 Asistente Ejecutivo IA', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/imagenes', icon: Image, label: '🖼️ Análisis de Imágenes', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/video-audio', icon: Video, label: '🎬 Síntesis Multimedia', roles: ['administrador', 'tutor', 'participante'] },
    // --- Simuladores 3D VIP ---
    { divider: '🎮 Simuladores 3D Especializados (VIP)', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/petroleo', icon: Box, label: '🛢️ Petróleo — Bombeo IA', roles: ['administrador', 'tutor', 'participante'], premium: true, requiredPlan: 'sim_petroleo' },
    { to: '/simulador/calderas', icon: Thermometer, label: '♨️ Calderas — LIMS 3D', roles: ['administrador', 'tutor', 'participante'], premium: true, requiredPlan: 'sim_calderas' },
    { to: '/simulador/plc', icon: Cpu, label: '⚡ PLC / SCADA Industrial', roles: ['administrador', 'tutor', 'participante'], premium: true, requiredPlan: 'sim_plc' },
    { to: '/simulador/soldadura', icon: Flame, label: '👨‍🏭 Soldadura AWS + NDT', roles: ['administrador', 'tutor', 'participante'], premium: true, requiredPlan: 'sim_soldadura' },
    // --- Planes y Certificaciones ---
    { divider: '💳 Membresía & Certificaciones', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/suscripcion', icon: CreditCard, label: isPremium ? '✅ Mi Membresía VIP' : '🔓 Planes & Suscripción VIP', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/certificados', icon: Award, label: '🎓 Mis Certificados y ML-DSA', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/verificar-certificado', icon: FileText, label: '🔍 Auditoría / Verificar Certificado', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/evaluaciones', icon: ClipboardList, label: '📝 Evaluaciones', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/notas', icon: Target, label: '📈 Mi Progreso', roles: ['participante'] },
    { to: '/mi-reporte', icon: FileBarChart, label: '📋 Mi Reporte', roles: ['participante'] },
    { to: '/ayuda', icon: HelpCircle, label: '❓ Centro de Ayuda', roles: ['administrador', 'tutor', 'participante'] },
    // --- Tutor ---
    { divider: '📘 Gestión Tutor', roles: ['administrador', 'tutor'] },
    { to: '/tutor', icon: Users, label: 'Panel Tutor', roles: ['administrador', 'tutor'] },
    { to: '/tutor/editor-cursos', icon: Edit3, label: 'Editor Cursos', roles: ['administrador', 'tutor'] },
    // --- Admin ---
    { divider: '👑 Gestión Ejecutiva', roles: ['administrador'] },
    { to: '/admin/dashboard', icon: BarChart3, label: 'Consola Ejecutiva', roles: ['administrador'] },
    { to: '/admin/panel', icon: Shield, label: 'Panel Corporativo', roles: ['administrador'] },
    { to: '/b2b-dashboard', icon: TrendingUp, label: '💼 Panel B2B / ROI Empresa', roles: ['administrador'] },
    { to: '/leads', icon: UserPlus, label: 'Gestión de Proyectos (Leads)', roles: ['administrador'] },
    { to: '/admin/usuarios', icon: UserCog, label: 'Gestión de Usuarios', roles: ['administrador'] },
    { to: '/admin/curso', icon: Settings, label: 'Admin Curso', roles: ['administrador'] },
    { to: '/admin/certificados', icon: Award, label: 'Aprobar Certificaciones', roles: ['administrador'] },
    { to: '/admin/reportes', icon: FileBarChart, label: 'Reportes Gerencia', roles: ['administrador'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.rol)
  );

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menú">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <GraduationCap size={28} color="#d4a843" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1rem', margin: 0 }}>Nasser Group</h2>
              <span className="user-role" style={{ 
                display: 'inline-block',
                padding: '2px 8px',
                background: user?.rol === 'administrador' ? 'rgba(239, 68, 68, 0.2)' : 
                           user?.rol === 'tutor' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: user?.rol === 'administrador' ? '#fca5a5' : 
                       user?.rol === 'tutor' ? '#fcd34d' : '#6ee7b7',
                borderRadius: '12px',
                fontSize: '0.7rem',
                textTransform: 'capitalize'
              }}>
                {user?.rol}
              </span>
            </div>
            <NotificationsCenter />
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '8px' }}>
            Academia Virtual PDVSA — IUTPAL
          </div>
        </div>
        
        <ul className="nav-menu">
          {filteredNavItems.map((item, index) => {
            if (item.divider) {
              return (
                <li key={`divider-${index}`} style={{ 
                  margin: '16px 0 8px', 
                  padding: '0 16px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.5px',
                    opacity: 0.6,
                    color: '#94A3B8'
                  }}>
                    {item.divider}
                  </span>
                </li>
              );
            }
            
            return (
              <li key={item.to} className="nav-item">
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.premium && (
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>
                      {hasPlanAccess(item.requiredPlan) ? '✅' : '🔒'}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
        
        <div className="sidebar-footer">
          <div style={{ 
            fontSize: '0.8rem', 
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{user?.nombre_completo}</div>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.75rem' }}>{user?.correo}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <TrialCountdownBanner trial={trial} />
        {children}
        <FooterGabrielBiz />
      </main>
    </div>
  );
};

export default Layout;
