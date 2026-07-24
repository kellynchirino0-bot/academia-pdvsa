import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  BookOpen
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const modules = [
    {
      id: 1,
      title: 'Módulo 1: Fundamentos de IA',
      description: 'Conceptos básicos, ML, DL, y aplicaciones en industria petrolera',
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

  return (
    <div>
      <div className="page-header">
        <h1>Bienvenido, {user?.nombre_completo}</h1>
        <p>Plataforma Academia Virtual Nasser Group - PDVSA</p>
      </div>

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
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Módulos del Curso</h2>
          <BookOpen size={20} color="var(--text-secondary)" />
        </div>
        <div className="module-grid">
          {modules.map((module, index) => (
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

      <div className="card">
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
