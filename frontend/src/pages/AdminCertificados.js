import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award, CheckCircle, XCircle, Clock, Search, Eye, 
  User, Mail, Calendar, Hash, Filter, Edit3, Save, X, Download
} from 'lucide-react';
import axios from 'axios';
import DigitalBadgeGSS from '../components/DigitalBadgeGSS';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AdminCertificados = () => {
  const { user } = useAuth();
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('pendiente');
  const [busqueda, setBusqueda] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [notasRechazo, setNotasRechazo] = useState('');
  const [processing, setProcessing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadCertificados();
  }, []);

  const loadCertificados = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/certificates/all`);
      setCertificados(response.data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprobarCertificado = async (certId) => {
    setProcessing(certId);
    try {
      await axios.post(`${API_URL}/admin/certificates/${certId}/approve`);
      loadCertificados();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al aprobar certificado');
    } finally {
      setProcessing(null);
    }
  };

  const rechazarCertificado = async (certId) => {
    setProcessing(certId);
    try {
      await axios.post(`${API_URL}/admin/certificates/${certId}/reject`, { notas: notasRechazo });
      loadCertificados();
      setShowRejectModal(false);
      setSelectedCert(null);
      setNotasRechazo('');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al rechazar certificado');
    } finally {
      setProcessing(null);
    }
  };

  const editarCertificado = async () => {
    if (!selectedCert) return;
    setProcessing(selectedCert.id);
    try {
      await axios.put(`${API_URL}/admin/certificates/${selectedCert.id}`, editForm);
      loadCertificados();
      setShowEditModal(false);
      setSelectedCert(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Error al editar certificado');
    } finally {
      setProcessing(null);
    }
  };

  const openEditModal = (cert) => {
    setSelectedCert(cert);
    setEditForm({
      nombre_estudiante: cert.nombre_estudiante,
      curso: cert.curso,
      fecha_emision: cert.fecha_emision ? cert.fecha_emision.split('T')[0] : '',
      codigo_verificacion: cert.codigo_verificacion,
      calificacion_final: cert.calificacion_final
    });
    setShowEditModal(true);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: Clock, label: 'Pendiente' },
      aprobado: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: CheckCircle, label: 'Aprobado' },
      rechazado: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: XCircle, label: 'Rechazado' }
    };
    return badges[estado] || badges.pendiente;
  };

  const filteredCertificados = certificados.filter(cert => {
    const matchFiltro = filtro === 'todos' || cert.estado === filtro;
    const matchBusqueda = !busqueda || 
      cert.nombre_estudiante?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cert.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cert.codigo_verificacion?.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  const stats = {
    total: certificados.length,
    pendientes: certificados.filter(c => c.estado === 'pendiente').length,
    aprobados: certificados.filter(c => c.estado === 'aprobado').length,
    rechazados: certificados.filter(c => c.estado === 'rechazado').length
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Aprobación de Certificados</h1>
        <p>Revisa, edita y aprueba certificados con aval Global Safety Solutions</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><Award size={24} /></div>
          <h3>Total</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><Clock size={24} /></div>
          <h3>Pendientes</h3>
          <div className="stat-value">{stats.pendientes}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <h3>Aprobados</h3>
          <div className="stat-value">{stats.aprobados}</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#ef4444' }}>
          <div className="stat-icon"><XCircle size={24} color="#ef4444" /></div>
          <h3>Rechazados</h3>
          <div className="stat-value">{stats.rechazados}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, email o código..."
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>
          <div className="tabs">
            {['pendiente', 'aprobado', 'rechazado', 'todos'].map(estado => (
              <button
                key={estado}
                className={`tab-btn ${filtro === estado ? 'active' : ''}`}
                onClick={() => setFiltro(estado)}
              >
                {estado === 'todos' ? 'Todos' : estado.charAt(0).toUpperCase() + estado.slice(1)}
                {estado === 'pendiente' && stats.pendientes > 0 && (
                  <span style={{ 
                    marginLeft: '6px', background: '#f59e0b', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' 
                  }}>{stats.pendientes}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Certificados ({filteredCertificados.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Email</th>
                <th>Calificación</th>
                <th>Fecha Solicitud</th>
                <th>Estado</th>
                <th>Código</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificados.map((cert) => {
                const badge = getEstadoBadge(cert.estado);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={cert.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="var(--text-secondary)" />
                        <span style={{ fontWeight: '500' }}>{cert.nombre_estudiante}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Mail size={12} color="var(--text-secondary)" />
                        {cert.correo}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: parseFloat(cert.calificacion_final) >= 70 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                        {cert.calificacion_final}%
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {cert.fecha_solicitud ? new Date(cert.fecha_solicitud).toLocaleDateString('es-VE') : 'N/A'}
                    </td>
                    <td>
                      <span className="badge" style={{ background: badge.bg, color: badge.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <BadgeIcon size={12} /> {badge.label}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.8rem', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px' }}>
                        {cert.codigo_verificacion || 'Pendiente'}
                      </code>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {cert.estado === 'pendiente' && (
                          <>
                            <button
                              onClick={() => aprobarCertificado(cert.id)}
                              disabled={processing === cert.id}
                              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Aprobar certificado"
                            >
                              <CheckCircle size={14} /> Aprobar
                            </button>
                            <button
                              onClick={() => { setSelectedCert(cert); setShowRejectModal(true); setNotasRechazo(''); }}
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Rechazar certificado"
                            >
                              <XCircle size={14} /> Rechazar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(cert)}
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Editar certificado"
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                        {cert.estado === 'aprobado' && (
                          <button
                            onClick={() => { setSelectedCert(cert); setShowPreviewModal(true); }}
                            style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={14} /> Ver Badge
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCertificados.length === 0 && (
          <div className="empty-state">
            <div className="icon">🎓</div>
            <h3>No hay certificados {filtro !== 'todos' ? `con estado "${filtro}"` : ''}</h3>
            <p>Los certificados aparecerán aquí cuando los estudiantes los soliciten</p>
          </div>
        )}
      </div>

      {/* Modal Rechazar */}
      {showRejectModal && selectedCert && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Rechazar Certificado</h2>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '16px' }}>
                Estudiante: <strong>{selectedCert.nombre_estudiante}</strong><br />
                Código: <code>{selectedCert.codigo_verificacion}</code>
              </p>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Motivo de rechazo (opcional)
              </label>
              <textarea
                value={notasRechazo}
                onChange={(e) => setNotasRechazo(e.target.value)}
                placeholder="Ingrese el motivo del rechazo..."
                style={{ width: '100%', minHeight: '80px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '0 20px 20px' }}>
              <button className="btn-primary" onClick={() => rechazarCertificado(selectedCert.id)} disabled={processing === selectedCert.id} style={{ flex: 1, background: '#ef4444' }}>
                {processing === selectedCert.id ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && selectedCert && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>Editar Certificado</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Nombre del Estudiante</label>
                <input type="text" value={editForm.nombre_estudiante || ''} onChange={(e) => setEditForm({ ...editForm, nombre_estudiante: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Curso / Diplomado</label>
                <input type="text" value={editForm.curso || ''} onChange={(e) => setEditForm({ ...editForm, curso: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Fecha de Emisión</label>
                <input type="date" value={editForm.fecha_emision || ''} onChange={(e) => setEditForm({ ...editForm, fecha_emision: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Calificación Final (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={editForm.calificacion_final || ''} onChange={(e) => setEditForm({ ...editForm, calificacion_final: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Código de Verificación (ID)</label>
                <input type="text" value={editForm.codigo_verificacion || ''} onChange={(e) => setEditForm({ ...editForm, codigo_verificacion: e.target.value })} style={{ width: '100%', fontFamily: 'monospace' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '0 20px 20px' }}>
              <button className="btn-primary" onClick={editarCertificado} disabled={processing === selectedCert.id} style={{ flex: 1 }}>
                <Save size={16} /> {processing === selectedCert.id ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Previa Badge */}
      {showPreviewModal && selectedCert && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', padding: 0, background: 'transparent', boxShadow: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button onClick={() => setShowPreviewModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <X size={20} />
              </button>
            </div>
            <DigitalBadgeGSS certificado={{
              id: selectedCert.codigo_verificacion,
              estudiante: selectedCert.nombre_estudiante,
              curso: selectedCert.curso,
              fecha: selectedCert.fecha_emision ? new Date(selectedCert.fecha_emision).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pendiente',
              idioma: 'ES',
              calificacion: selectedCert.calificacion_final
            }} />
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a href={`${window.location.origin}/verificar-certificado?id=${selectedCert.codigo_verificacion}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#0284C7', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                <Download size={16} /> Vista Pública de Verificación
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificados;