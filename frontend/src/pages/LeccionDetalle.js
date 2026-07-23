import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const LeccionDetalle = () => {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [leccion, setLeccion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeccion = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/courses/modulos/${id}`, config);
        setModulo(res.data);
        const found = res.data.lecciones?.find(l => String(l.id) === String(lessonId));
        setLeccion(found || null);
      } catch (err) {
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeccion();
  }, [id, lessonId]);

  const completarLeccion = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/courses/lecciones/completar`, { leccion_id: lessonId }, config);
      setLeccion(prev => ({ ...prev, completado: true }));
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" /></div>;
  if (!leccion) return <div style={{ padding: '40px', textAlign: 'center' }}>Lección no encontrada</div>;

  const lecciones = modulo?.lecciones || [];
  const currentIndex = lecciones.findIndex(l => String(l.id) === String(lessonId));
  const prevLesson = currentIndex > 0 ? lecciones[currentIndex - 1] : null;
  const nextLesson = currentIndex < lecciones.length - 1 ? lecciones[currentIndex + 1] : null;

  return (
    <div>
      <button onClick={() => navigate(`/cursos/modulo/${id}`)} style={{
        display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none',
        color: '#003366', cursor: 'pointer', marginBottom: '16px', fontSize: '0.95rem', fontWeight: '500'
      }}>
        <ArrowLeft size={18} /> Volver a {modulo?.titulo}
      </button>

      <div style={{
        background: 'linear-gradient(135deg, #003366, #001a33)', borderRadius: '16px',
        padding: '28px', marginBottom: '24px', color: '#fff'
      }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Módulo {modulo?.numero_modulo} — Lección {currentIndex + 1} de {lecciones.length}
        </div>
        <h1 style={{ margin: '8px 0 0', fontSize: '1.3rem', fontWeight: '700' }}>{leccion.titulo}</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ lineHeight: '1.9', color: '#374151', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
          {leccion.contenido_markdown || 'Contenido no disponible'}
        </div>

        {!leccion.completado && (
          <button onClick={completarLeccion} style={{
            marginTop: '24px', padding: '12px 24px', background: '#10b981', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
            display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}>
            <CheckCircle size={18} /> Marcar como Completada
          </button>
        )}
        {leccion.completado && (
          <div style={{ marginTop: '24px', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> Lección completada
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        {prevLesson ? (
          <Link to={`/cursos/modulo/${id}/leccion/${prevLesson.id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
            background: '#e2e8f0', color: '#374151', borderRadius: '8px', textDecoration: 'none',
            fontWeight: '600', fontSize: '0.9rem'
          }}>
            <ChevronLeft size={18} /> Anterior
          </Link>
        ) : <div />}
        {nextLesson ? (
          <Link to={`/cursos/modulo/${id}/leccion/${nextLesson.id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
            background: '#003366', color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontWeight: '600', fontSize: '0.9rem'
          }}>
            Siguiente <ChevronRight size={18} />
          </Link>
        ) : (
          <Link to={`/cursos/modulo/${id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
            background: '#10b981', color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontWeight: '600', fontSize: '0.9rem'
          }}>
            Volver al Módulo <ChevronRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default LeccionDetalle;
