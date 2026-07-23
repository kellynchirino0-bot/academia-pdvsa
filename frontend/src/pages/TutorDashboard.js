import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, BookOpen, Award, MessageSquare, Send, Eye, 
  CheckCircle, AlertCircle, Clock, TrendingUp, Search,
  ChevronRight, FileText, Star
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const TutorDashboard = () => {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [retroalimentacion, setRetroalimentacion] = useState('');
  const [tipoFeedback, setTipoFeedback] = useState('general');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [retroalimentaciones, setRetroalimentaciones] = useState([]);

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      const response = await axios.get(`${API_URL}/tutors/estudiantes`);
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error loading estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRetroalimentacion = async (estudianteId) => {
    try {
      const response = await axios.get(`${API_URL}/tutors/retroalimentacion/${estudianteId}`);
      setRetroalimentaciones(response.data);
    } catch (error) {
      console.error('Error loading retroalimentacion:', error);
    }
  };

  const enviarRetroalimentacion = async () => {
    if (!estudianteSeleccionado || !retroalimentacion.trim()) return;

    try {
      await axios.post(`${API_URL}/tutors/retroalimentacion`, {
        estudiante_id: estudianteSeleccionado.id,
        comentario: retroalimentacion,
        tipo: tipoFeedback
      });
      alert('Retroalimentación enviada exitosamente');
      setRetroalimentacion('');
      loadRetroalimentacion(estudianteSeleccionado.id);
    } catch (error) {
      alert('Error al enviar retroalimentación');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'verde': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Al día' };
      case 'amarillo': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'En curso' };
      case 'rojo': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Retrasado' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: 'Sin datos' };
    }
  };

  const getCalificacionColor = (promedio) => {
    if (promedio >= 80) return '#10b981';
    if (promedio >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const estudiantesFiltrados = estudiantes.filter(est => 
    est.nombre_completo?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    est.empresa_filial?.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  const stats = {
    total: estudiantes.length,
    alDia: estudiantes.filter(e => e.progreso?.estado === 'verde').length,
    enCurso: estudiantes.filter(e => e.progreso?.estado === 'amarillo').length,
    retrasados: estudiantes.filter(e => e.progreso?.estado === 'rojo').length,
    promedioGeneral: estudiantes.length > 0 
      ? (estudiantes.reduce((acc, e) => acc + (e.notas?.promedio || 0), 0) / estudiantes.length).toFixed(1)
      : 0
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Panel del Tutor</h1>
        <p>Bienvenido, {user?.nombre_completo} - Gestiona el progreso de tus estudiantes</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><Users size={24} /></div>
          <h3>Mis Estudiantes</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <h3>Al Día</h3>
          <div className="stat-value">{stats.alDia}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><Clock size={24} /></div>
          <h3>En Curso</h3>
          <div className="stat-value">{stats.enCurso}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <h3>Retrasados</h3>
          <div className="stat-value">{stats.retrasados}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Lista de Estudiantes */}
        <div className="card">
          <div className="card-header">
            <h2>Mis Estudiantes Asignados</h2>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                placeholder="Buscar..."
                style={{ paddingLeft: '40px', width: '200px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {estudiantesFiltrados.map(estudiante => {
              const estadoColor = getEstadoColor(estudiante.progreso?.estado);
              const isSelected = estudianteSeleccionado?.id === estudiante.id;

              return (
                <div
                  key={estudiante.id}
                  onClick={() => {
                    setEstudianteSeleccionado(estudiante);
                    loadRetroalimentacion(estudiante.id);
                  }}
                  style={{
                    padding: '16px',
                    background: isSelected ? 'rgba(0, 51, 102, 0.05)' : 'var(--bg-primary)',
                    border: `2px solid ${isSelected ? 'var(--primary-blue)' : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        background: 'var(--primary-blue)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}>
                        {estudiante.nombre_completo?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{estudiante.nombre_completo}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {estudiante.empresa_filial || 'Sin filial'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {estudiante.cargo}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge" style={{ 
                        background: estadoColor.bg, 
                        color: estadoColor.color,
                        marginBottom: '4px'
                      }}>
                        {estadoColor.label}
                      </span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Progreso: {estudiante.progreso?.porcentaje || 0}%
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '12px', 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '8px' 
                  }}>
                    <div style={{ 
                      padding: '8px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Progreso</div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>
                        {estudiante.progreso?.lecciones_completadas || 0}/{estudiante.progreso?.total_lecciones || 0}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '8px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Promedio</div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: getCalificacionColor(estudiante.notas?.promedio || 0) 
                      }}>
                        {estudiante.notas?.promedio || 0}%
                      </div>
                    </div>
                    <div style={{ 
                      padding: '8px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Certificado</div>
                      <div style={{ fontWeight: '600', color: estudiante.tiene_certificado ? '#10b981' : '#6b7280' }}>
                        {estudiante.tiene_certificado ? '✓' : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de Detalle y Retroalimentación */}
        <div>
          {estudianteSeleccionado ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Perfil del Estudiante */}
              <div className="card">
                <div className="card-header">
                  <h2>Detalle del Estudiante</h2>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'var(--primary-blue)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '2rem',
                    margin: '0 auto 16px'
                  }}>
                    {estudianteSeleccionado.nombre_completo?.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0 }}>{estudianteSeleccionado.nombre_completo}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    {estudianteSeleccionado.cargo}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {estudianteSeleccionado.empresa_filial}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ 
                    padding: '12px', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-blue)' }}>
                      {estudianteSeleccionado.progreso?.porcentaje || 0}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progreso</div>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    background: 'var(--bg-primary)', 
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: getCalificacionColor(estudianteSeleccionado.notas?.promedio || 0) 
                    }}>
                      {estudianteSeleccionado.notas?.promedio || 0}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Promedio</div>
                  </div>
                </div>
              </div>

              {/* Formulario de Retroalimentación */}
              <div className="card">
                <div className="card-header">
                  <h2>Enviar Retroalimentación</h2>
                </div>
                <div className="form-group">
                  <label>Tipo de Observación</label>
                  <select 
                    value={tipoFeedback}
                    onChange={(e) => setTipoFeedback(e.target.value)}
                  >
                    <option value="general">General</option>
                    <option value="evaluacion">Sobre Evaluación</option>
                    <option value="progreso">Progreso en Curso</option>
                    <option value="certificacion">Certificación</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea
                    value={retroalimentacion}
                    onChange={(e) => setRetroalimentacion(e.target.value)}
                    placeholder="Escribe tu observación para el estudiante..."
                    style={{ minHeight: '100px' }}
                  />
                </div>
                <button 
                  className="btn-primary"
                  onClick={enviarRetroalimentacion}
                  disabled={!retroalimentacion.trim()}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={18} /> Enviar Retroalimentación
                </button>
              </div>

              {/* Historial de Retroalimentación */}
              <div className="card">
                <div className="card-header">
                  <h2>Historial de Observaciones</h2>
                </div>
                {retroalimentaciones.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {retroalimentaciones.slice(0, 5).map(retro => (
                      <div key={retro.id} style={{ 
                        padding: '12px', 
                        background: 'var(--bg-primary)', 
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--primary-blue)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="badge badge-info">{retro.tipo}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {new Date(retro.created_at).toLocaleDateString('es-VE')}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{retro.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0 }}>Sin observaciones registradas</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: 'var(--text-secondary)' 
              }}>
                <Users size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h3>Selecciona un estudiante</h3>
                <p>Haz clic en un estudiante de la lista para ver su detalle y enviar retroalimentación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
