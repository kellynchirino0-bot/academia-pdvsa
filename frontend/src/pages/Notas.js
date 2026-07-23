import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, TrendingUp, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Notas = () => {
  const { user } = useAuth();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotas();
  }, []);

  const loadNotas = async () => {
    try {
      const response = await axios.get(`${API_URL}/evaluations/user/${user?.id}/grades`);
      setNotas(response.data);
    } catch (error) {
      console.error('Error loading notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPromedio = () => {
    if (notas.length === 0) return 0;
    const suma = notas.reduce((acc, nota) => acc + parseFloat(nota.calificacion), 0);
    return (suma / notas.length).toFixed(2);
  };

  const getAprobadas = () => notas.filter(n => n.estatus_aprobacion).length;

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Mis Notas</h1>
        <p>Historial de calificaciones y progreso en el curso</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><BookOpen size={24} /></div>
          <h3>Total Evaluaciones</h3>
          <div className="stat-value">{notas.length}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <h3>Aprobadas</h3>
          <div className="stat-value">{getAprobadas()}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <h3>Promedio General</h3>
          <div className="stat-value">{calcularPromedio()}%</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon"><Award size={24} /></div>
          <h3>Estado</h3>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>
            {calcularPromedio() >= 80 ? 'Aprobado' : 'En progreso'}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Historial de Calificaciones</h2>
        </div>

        {notas.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📝</div>
            <h3>Sin evaluaciones realizadas</h3>
            <p>Completa las evaluaciones del curso para ver tus notas aquí</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Evaluación</th>
                  <th>Módulo</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Tiempo</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota) => (
                  <tr key={nota.id}>
                    <td style={{ fontWeight: '500' }}>{nota.evaluacion_titulo}</td>
                    <td>
                      <span className="badge badge-info">{nota.evaluacion_modulo}</span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: nota.estatus_aprobacion ? 'var(--success-green)' : 'var(--danger-red)'
                      }}>
                        {nota.calificacion}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${nota.estatus_aprobacion ? 'badge-success' : 'badge-danger'}`}>
                        {nota.estatus_aprobacion ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {nota.tiempo_empleado_minutos} min
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(nota.fecha_evaluacion).toLocaleDateString('es-VE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {notas.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Progreso por Módulo</h2>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {['Fundamentos IA', 'Prompt Engineering', 'IA en Petróleo'].map((modulo, index) => {
              const notasModulo = notas.filter(n => n.evaluacion_modulo === modulo);
              const promedio = notasModulo.length > 0 
                ? (notasModulo.reduce((acc, n) => acc + parseFloat(n.calificacion), 0) / notasModulo.length).toFixed(2)
                : 0;
              
              return (
                <div key={index} style={{
                  padding: '16px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', marginBottom: '8px' }}>{modulo}</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(promedio, 100)}%`,
                          background: promedio >= 80 ? 'var(--success-green)' : 'var(--warning-orange)'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    color: promedio >= 80 ? 'var(--success-green)' : 'var(--warning-orange)',
                    minWidth: '60px',
                    textAlign: 'right'
                  }}>
                    {notasModulo.length > 0 ? `${promedio}%` : 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notas;
