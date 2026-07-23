import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight, Trophy } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Evaluaciones = () => {
  const { user } = useAuth();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionActiva, setEvaluacionActiva] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [notasUsuario, setNotasUsuario] = useState([]);

  useEffect(() => {
    loadEvaluaciones();
    loadNotas();
  }, []);

  useEffect(() => {
    let interval;
    if (evaluacionActiva && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitEvaluacion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [evaluacionActiva, tiempoRestante]);

  const loadEvaluaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/evaluations`);
      setEvaluaciones(response.data);
    } catch (error) {
      console.error('Error loading evaluaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotas = async () => {
    try {
      const response = await axios.get(`${API_URL}/evaluations/user/${user?.id}/grades`);
      setNotasUsuario(response.data);
    } catch (error) {
      console.error('Error loading notas:', error);
    }
  };

  const iniciarEvaluacion = (evaluacion) => {
    setEvaluacionActiva(evaluacion);
    setRespuestas({});
    setTiempoRestante(evaluacion.tiempo_limite_minutos * 60);
    setResultado(null);
  };

  const seleccionarRespuesta = (preguntaId, respuestaIndex) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: respuestaIndex
    });
  };

  const handleSubmitEvaluacion = async () => {
    if (!evaluacionActiva || enviando) return;
    
    setEnviando(true);
    try {
      const respuestasArray = evaluacionActiva.preguntas.map((pregunta) => ({
        pregunta_id: pregunta.id,
        respuesta: respuestas[pregunta.id] ?? -1
      }));

      const tiempoEmpleado = Math.ceil((evaluacionActiva.tiempo_limite_minutos * 60 - tiempoRestante) / 60);

      const response = await axios.post(`${API_URL}/evaluations/${evaluacionActiva.id}/submit`, {
        respuestas: respuestasArray,
        tiempo_empleado: tiempoEmpleado
      });

      setResultado(response.data);
      loadNotas();
    } catch (error) {
      console.error('Error submitting evaluacion:', error);
      alert('Error al enviar la evaluación');
    } finally {
      setEnviando(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEvaluacionEstado = (evaluacionId) => {
    const nota = notasUsuario.find(n => n.evaluacion_id === evaluacionId);
    if (nota) {
      return nota.estatus_aprobacion ? 'aprobada' : 'reprobada';
    }
    return 'pendiente';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  // Vista de resultado
  if (resultado) {
    return (
      <div>
        <div className="page-header">
          <h1>Resultado de Evaluación</h1>
        </div>
        
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%',
            background: resultado.estatus_aprobacion ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            {resultado.estatus_aprobacion ? (
              <Trophy size={40} color="var(--success-green)" />
            ) : (
              <AlertCircle size={40} color="var(--danger-red)" />
            )}
          </div>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '8px',
            color: resultado.estatus_aprobacion ? 'var(--success-green)' : 'var(--danger-red)'
          }}>
            {resultado.estatus_aprobacion ? '¡Felicitaciones! Has Aprobado' : 'No alcanzaste el puntaje mínimo'}
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {evaluacionActiva?.titulo}
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-blue)' }}>
                {resultado.calificacion}%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calificación</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-green)' }}>
                {resultado.respuestas_correctas}/{resultado.total_preguntas}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correctas</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                {resultado.tiempo_empleado} min
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tiempo</div>
            </div>
          </div>

          <div className="alert" style={{ 
            justifyContent: 'center',
            background: resultado.estatus_aprobacion ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: resultado.estatus_aprobacion ? 'var(--success-green)' : 'var(--danger-red)'
          }}>
            <span>Puntaje mínimo requerido: 80%</span>
          </div>

          <button 
            className="btn-primary"
            onClick={() => {
              setEvaluacionActiva(null);
              setResultado(null);
            }}
          >
            Volver a Evaluaciones
          </button>
        </div>
      </div>
    );
  }

  // Vista de evaluación activa
  if (evaluacionActiva) {
    return (
      <div>
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{evaluacionActiva?.titulo || 'Sin título'}</h1>
              <p>{evaluacionActiva.descripcion}</p>
            </div>
            <div className="timer-display">
              <Clock size={20} style={{ marginRight: '8px' }} />
              {formatTime(tiempoRestante)}
            </div>
          </div>
        </div>

        <div className="quiz-container">
          {evaluacionActiva.preguntas.map((pregunta, index) => (
            <div 
              key={pregunta.id} 
              className={`question-card ${respuestas[pregunta.id] !== undefined ? 'selected' : ''}`}
            >
              <h4>
                <span style={{ 
                  color: 'var(--primary-blue)', 
                  marginRight: '8px',
                  fontWeight: '700'
                }}>
                  {index + 1}.
                </span>
                {pregunta.pregunta}
              </h4>
              <div className="options-list">
                {pregunta.opciones.map((opcion, opcionIndex) => (
                  <button
                    key={opcionIndex}
                    className={`option-btn ${respuestas[pregunta.id] === opcionIndex ? 'selected' : ''}`}
                    onClick={() => seleccionarRespuesta(pregunta.id, opcionIndex)}
                  >
                    <span style={{ 
                      marginRight: '12px',
                      fontWeight: '600',
                      color: respuestas[pregunta.id] === opcionIndex ? 'var(--primary-blue)' : 'var(--text-secondary)'
                    }}>
                      {String.fromCharCode(65 + opcionIndex)}.
                    </span>
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button 
              className="btn-primary"
              onClick={handleSubmitEvaluacion}
              disabled={enviando || Object.keys(respuestas).length < evaluacionActiva.preguntas.length}
              style={{ flex: 1 }}
            >
              {enviando ? 'Enviando...' : 'Finalizar Evaluación'}
              <CheckCircle size={18} />
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                if (window.confirm('¿Estás seguro de salir? Se perderán tus respuestas.')) {
                  setEvaluacionActiva(null);
                }
              }}
            >
              Cancelar
            </button>
          </div>

          <div style={{ 
            marginTop: '16px', 
            textAlign: 'center', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)' 
          }}>
            Respondidas: {Object.keys(respuestas).length} / {evaluacionActiva.preguntas.length}
          </div>
        </div>
      </div>
    );
  }

  // Lista de evaluaciones
  return (
    <div>
      <div className="page-header">
        <h1>Evaluaciones del Curso</h1>
        <p>Completa las evaluaciones con un mínimo del 80% para aprobar</p>
      </div>

      <div className="module-grid">
        {evaluaciones.map((evaluacion) => {
          const estado = getEvaluacionEstado(evaluacion.id);
          const nota = notasUsuario.find(n => n.evaluacion_id === evaluacion.id);
          
          return (
            <div key={evaluacion.id} className="module-card" style={{
              borderTopColor: estado === 'aprobada' ? 'var(--success-green)' : 
                              estado === 'reprobada' ? 'var(--danger-red)' : 'var(--accent-gold)'
            }}>
              <div className="module-icon" style={{
                background: estado === 'aprobada' ? 'rgba(16, 185, 129, 0.1)' : 
                           estado === 'reprobada' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 168, 67, 0.1)',
                color: estado === 'aprobada' ? 'var(--success-green)' : 
                       estado === 'reprobada' ? 'var(--danger-red)' : 'var(--accent-gold)'
              }}>
                {estado === 'aprobada' ? <CheckCircle size={24} /> : <FileText size={24} />}
              </div>
              
              <h3>{evaluacion?.titulo || 'Sin título'}</h3>
              <p>{evaluacion.descripcion}</p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="badge badge-info">{evaluacion.modulo}</span>
                <span className="badge badge-warning">{evaluacion.preguntas?.length || 0} preguntas</span>
                <span className="badge badge-info">{evaluacion.tiempo_limite_minutos} min</span>
              </div>

              {estado !== 'pendiente' && nota && (
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tu calificación:</div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700',
                    color: nota.estatus_aprobacion ? 'var(--success-green)' : 'var(--danger-red)'
                  }}>
                    {nota.calificacion}%
                  </div>
                </div>
              )}

              {estado === 'pendiente' ? (
                <button 
                  className="btn-primary"
                  onClick={() => iniciarEvaluacion(evaluacion)}
                  style={{ width: '100%' }}
                >
                  Iniciar Evaluación <ChevronRight size={18} />
                </button>
              ) : estado === 'aprobada' ? (
                <div className="alert alert-success" style={{ marginBottom: 0, justifyContent: 'center' }}>
                  Aprobada
                </div>
              ) : (
                <button 
                  className="btn-secondary"
                  onClick={() => iniciarEvaluacion(evaluacion)}
                  style={{ width: '100%' }}
                >
                  Intentar Nuevamente
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Evaluaciones;
