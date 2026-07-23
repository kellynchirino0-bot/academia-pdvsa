import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Users, BookOpen, Award, TrendingUp, Settings,
  Edit2, Plus, X, CheckCircle, AlertCircle, Save, Trash2,
  FileText, UserPlus
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function AdminCurso() {
  const [stats, setStats] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('metricas');
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, modulosRes, evalRes, usersRes, tutoresRes] = await Promise.all([
        axios.get(`${API_URL}/courses/stats`).catch(() => ({ data: null })),
        axios.get(`${API_URL}/courses/modulos`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/evaluations`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/users`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/tutors/lista`).catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setModulos(modulosRes.data);
      setEvaluaciones(evalRes.data);
      setUsuarios(usersRes.data);
      setTutores(tutoresRes.data);
    } catch (error) {
      console.error('Error al cargar datos administrativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const asignarTutor = async () => {
    if (!selectedTutor || selectedEstudiantes.length === 0) {
      setMensaje('Seleccione al menos un estudiante y un tutor.');
      setTimeout(() => setMensaje(''), 4000);
      return;
    }
    try {
      await axios.post(`${API_URL}/tutors/asignar-masiva`, {
        tutor_id: parseInt(selectedTutor),
        estudiante_ids: selectedEstudiantes.map((id) => parseInt(id))
      });
      setMensaje('Tutor asignado exitosamente a los estudiantes seleccionados.');
      setShowAsignarModal(false);
      setSelectedTutor('');
      setSelectedEstudiantes([]);
    } catch (error) {
      setMensaje('Error al asignar tutor. Intente de nuevo.');
    }
    setTimeout(() => setMensaje(''), 4000);
  };

  const toggleEstudiante = (id) => {
    setSelectedEstudiantes((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>Cargando panel ejecutivo...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#003366', marginBottom: '8px' }}>
        Panel de Administración - Academia Virtual Nasser Group
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Gestión global del curso, métricas y asignación de tutores
      </p>

      {mensaje && (
        <div style={{
          background: '#e2e8f0',
          padding: '12px 16px',
          marginBottom: '16px',
          borderLeft: '4px solid #CC0000',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          {mensaje}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
        {[
          { key: 'metricas', label: 'Métricas' },
          { key: 'modulos', label: 'Módulos' },
          { key: 'evaluaciones', label: 'Evaluaciones' },
          { key: 'asignaciones', label: 'Asignar Tutores' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#003366' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? '600' : '400',
              fontSize: '0.85rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Métricas */}
      {activeTab === 'metricas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Estudiantes', value: stats?.totalEstudiantes || 0, icon: <Users size={20} />, color: '#003366' },
            { label: 'Módulos', value: stats?.totalModulos || 0, icon: <BookOpen size={20} />, color: '#0d6e6e' },
            { label: 'Promedio Global', value: `${stats?.promedioNotas || 0}%`, icon: <TrendingUp size={20} />, color: '#d4a843' },
            { label: 'Certificados', value: stats?.totalCertificados || 0, icon: <Award size={20} />, color: '#10b981' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${item.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>{item.label}</span>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1f2937' }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Módulos */}
      {activeTab === 'modulos' && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {modulos.map((mod) => (
            <div key={mod.id} style={{
              background: '#fff',
              padding: '16px 20px',
              borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'rgba(0,51,102,0.08)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                {mod.icono}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#003366' }}>Módulo {mod?.numero_modulo}: {mod?.titulo || 'Sin título'}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>{mod.descripcion}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{ background: 'rgba(0,51,102,0.08)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#003366' }}>
                    {mod.duracion_horas}h
                  </span>
                  <span style={{ background: 'rgba(0,51,102,0.08)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#003366' }}>
                    {mod.total_lecciones} lecciones
                  </span>
                  <span style={{ background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#10b981' }}>
                    {mod.porcentaje_avance || 0}%
                  </span>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#003366', cursor: 'pointer', padding: '8px' }}>
                <Edit2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Evaluaciones */}
      {activeTab === 'evaluaciones' && (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Título</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Módulo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Preguntas</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Tiempo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((ev) => (
                <tr key={ev.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                   <td style={{ padding: '12px 16px', fontWeight: '500' }}>{ev?.titulo || 'Sin título'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: 'rgba(0,51,102,0.08)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#003366' }}>
                      {ev.modulo}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{ev.preguntas?.length || 0}</td>
                  <td style={{ padding: '12px 16px' }}>{ev.tiempo_limite_minutos} min</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      background: ev.activo ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: ev.activo ? '#10b981' : '#ef4444'
                    }}>
                      {ev.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asignación de Tutores */}
      {activeTab === 'asignaciones' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#003366' }}>Asignar Tutor a Estudiantes</h3>
            <button
              onClick={() => setShowAsignarModal(true)}
              style={{
                background: '#003366',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem'
              }}
            >
              <UserPlus size={16} /> Nueva Asignación
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {usuarios.filter((u) => u.rol === 'participante').map((est) => (
              <div key={est.id} style={{
                background: '#fff',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#003366',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  {est.nombre_completo?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{est.nombre_completo}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{est.empresa_filial || 'Sin filial'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Asignación */}
      {showAsignarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#003366', margin: 0 }}>Asignar Tutor</h3>
              <button onClick={() => setShowAsignarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Seleccionar Tutor</label>
              <select
                value={selectedTutor}
                onChange={(e) => setSelectedTutor(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.9rem' }}
              >
                <option value="">-- Seleccionar --</option>
                {tutores.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre_completo} ({t.correo})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Seleccionar Estudiantes</label>
              <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px' }}>
                {usuarios.filter((u) => u.rol === 'participante').map((est) => (
                  <label key={est.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: selectedEstudiantes.includes(est.id) ? 'rgba(0,51,102,0.06)' : 'transparent'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedEstudiantes.includes(est.id)}
                      onChange={() => toggleEstudiante(est.id)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{est.nombre_completo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={asignarTutor}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#003366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Asignar
              </button>
              <button
                onClick={() => setShowAsignarModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
