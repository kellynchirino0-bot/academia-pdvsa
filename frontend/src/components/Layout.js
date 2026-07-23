import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TrialCountdownBanner from './TrialCountdownBanner';
import NotificationsCenter from './NotificationsCenter';
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
  FileBarChart
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, trial } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/cursos', icon: BookOpen, label: 'Modulos del Curso', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/texto', icon: MessageSquare, label: 'Simulador GPT', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/imagenes', icon: Image, label: 'Simulador Imagenes', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/simulador/video-audio', icon: Video, label: 'Simulador Video/Audio', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/evaluaciones', icon: ClipboardList, label: 'Evaluaciones', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/notas', icon: Target, label: 'Mis Notas', roles: ['participante'] },
    { to: '/certificados', icon: Award, label: 'Certificados', roles: ['administrador', 'tutor', 'participante'] },
    { to: '/mi-reporte', icon: FileBarChart, label: 'Mi Reporte', roles: ['participante'] },
    { divider: true, roles: ['administrador', 'tutor'] },
    { to: '/tutor', icon: Users, label: 'Panel Tutor', roles: ['administrador', 'tutor'] },
    { to: '/tutor/editor-cursos', icon: Edit3, label: 'Editor Cursos', roles: ['administrador', 'tutor'] },
    { divider: true, roles: ['administrador'] },
    { to: '/admin/dashboard', icon: BarChart3, label: 'Dashboard Ejecutivo', roles: ['administrador'] },
    { to: '/leads', icon: UserPlus, label: 'Gestion Leads', roles: ['administrador'] },
    { to: '/admin/usuarios', icon: UserCog, label: 'Gestion Usuarios', roles: ['administrador'] },
    { to: '/usuarios', icon: Briefcase, label: 'Usuarios Basico', roles: ['administrador'] },
    { to: '/admin/curso', icon: Settings, label: 'Admin Curso', roles: ['administrador'] },
    { to: '/admin/certificados', icon: Award, label: 'Aprobar Certificados', roles: ['administrador'] },
    { to: '/admin/reportes', icon: FileBarChart, label: 'Reportes Gerencia', roles: ['administrador'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.rol)
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
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
            Academia Virtual PDVSA
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
                    fontSize: '0.65rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    opacity: 0.5
                  }}>
                    {user?.rol === 'administrador' ? 'Administracion' : 'Gestion'}
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
                  <span>{item.label}</span>
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
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <TrialCountdownBanner trial={trial} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
