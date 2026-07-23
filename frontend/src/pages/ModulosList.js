import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const ModulosList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModulos();
  }, []);

  const loadModulos = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/modulos`);
      setModulos(response.data);
    } catch (error) {
      console.error('Error loading modulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuloColor = (numero) => {
    const colors = {
      1: { bg: 'linear-gradient(135deg, #003366, #004080)', icon: '#4FC3F7' },
      2: { bg: 'linear-gradient(135deg, #1565C0, #1976D2)', icon: '#81C784' },
      3: { bg: 'linear-gradient(135deg, #00695C, #00796B)', icon: '#FFB74D' },
      4: { bg: 'linear-gradient(135deg, #6A1B9A, #7B1FA2)', icon: '#F48FB1' }
    };
    return colors[numero] || colors[1];
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Módulos del Curso</h1>
        <p>Inteligencia Artificial para Líderes de Negocio - PDVSA</p>
      </div>

      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #003366, #001a33)', 
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <BookOpen size={32} color="#d4a843" />
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Programa de Formación en IA</h2>
            <p style={{ opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              40 horas | 4 módulos | 12 lecciones | Certificado digital
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            Progreso: {modulos.filter(m => m.porcentaje_avance === 100).length}/4 módulos completados
          </div>
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(212, 168, 67, 0.3)', 
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            Avance total: {modulos.length > 0 ? (modulos.reduce((acc, m) => acc + m.porcentaje_avance, 0) / modulos.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {modulos.map((modulo, index) => {
          const colores = getModuloColor(modulo.numero_modulo);
          const estaCompletado = modulo.porcentaje_avance === 100;
          const estaEnProgreso = modulo.porcentaje_avance > 0 && modulo.porcentaje_avance < 100;
          
          return (
            <div 
              key={modulo.id}
              onClick={() => navigate(`/cursos/modulo/${modulo.id}`)}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: estaCompletado ? '2px solid var(--success-green)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{ 
                background: colores.bg, 
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {modulo.icono}
                </div>
                <div style={{ flex: 1, color: 'white' }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.8, 
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Módulo {modulo.numero_modulo}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                    {modulo?.titulo || 'Sin título'}
                  </h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%',
                  background: estaCompletado ? '#10b981' : 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {estaCompletado ? (
                    <CheckCircle size={24} color="white" />
                  ) : (
                    <ChevronRight size={24} color="white" />
                  )}
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}>
                  {modulo.descripcion}
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <Clock size={14} /> {modulo.duracion_horas} horas
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <BookOpen size={14} /> {modulo.total_lecciones} lecciones
                  </span>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Progreso</span>
                    <span style={{ 
                      fontWeight: '600',
                      color: estaCompletado ? 'var(--success-green)' : 
                             estaEnProgreso ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}>
                      {modulo.porcentaje_avance}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${modulo.porcentaje_avance}%`,
                        background: estaCompletado ? 'var(--success-green)' : 
                                   estaEnProgreso ? 'linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light))' :
                                   'var(--border-color)'
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '0.8rem', 
                  color: estaCompletado ? 'var(--success-green)' : 
                         estaEnProgreso ? 'var(--accent-gold)' : 'var(--text-secondary)'
                }}>
                  {estaCompletado ? '✓ Completado' : 
                   estaEnProgreso ? `${modulo.lecciones_completadas} de ${modulo.total_lecciones} lecciones` :
                   'No iniciado'}
                </div>

                <Link 
                  to={`/cursos/modulo/${modulo.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    padding: '10px 20px',
                    background: 'var(--primary-blue)',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Entrar al Módulo →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulosList;
