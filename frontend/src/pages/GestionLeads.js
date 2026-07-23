import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Search, Filter, Plus, Eye, Edit2, Trash2, X, 
  CheckCircle, ArrowRight, Building2, Mail, Phone, 
  TrendingUp, UserPlus, BarChart3, Download
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const GestionLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    loadLeads();
    loadStats();
  }, []);

  const loadLeads = async () => {
    try {
      const params = {};
      if (filtroEstado !== 'todos') params.estado = filtroEstado;
      if (busqueda) params.busqueda = busqueda;
      
      const response = await axios.get(`${API_URL}/leads`, { params });
      setLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const exportLeads = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/leads/export?format=${format}`, { responseType: format === 'csv' ? 'blob' : 'json' });
      if (format === 'csv') {
        const url = URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_export.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('Error al exportar leads');
    }
  };

  const convertirLead = async (leadId) => {
    try {
      const response = await axios.post(`${API_URL}/leads/${leadId}/convertir`);
      alert(`Lead convertido exitosamente.\n\nCredenciales generadas:\nUsuario: ${response.data.usuario.correo}\nContraseña temporal: ${response.data.usuario.password_temporal}`);
      loadLeads();
      loadStats();
      setShowConvertModal(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Error al convertir lead');
    }
  };

  const actualizarLead = async () => {
    if (!leadSeleccionado) return;
    try {
      await axios.put(`${API_URL}/leads/${leadSeleccionado.id}`, {
        notas_admin: notas
      });
      loadLeads();
      setShowModal(false);
    } catch (error) {
      alert('Error al actualizar lead');
    }
  };

  const eliminarLead = async (leadId) => {
    if (!window.confirm('¿Estás seguro de eliminar este lead?')) return;
    try {
      await axios.delete(`${API_URL}/leads/${leadId}`);
      loadLeads();
      loadStats();
    } catch (error) {
      alert('Error al eliminar lead');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      nuevo: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Nuevo' },
      contactado: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Contactado' },
      inscrito: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Inscrito' },
      convertido: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Convertido' },
      rechazado: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Rechazado' },
      descartado: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: 'Descartado' }
    };
    return badges[estado] || badges.nuevo;
  };

  const filteredLeads = leads.filter(lead => {
    const matchEstado = filtroEstado === 'todos' || lead.estado === filtroEstado;
    const matchBusqueda = !busqueda || 
      lead.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      lead.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      lead.empresa_filial?.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Gestión de Leads</h1>
            <p>Administra prospectos interesados en el curso de IA para PDVSA</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-secondary" 
              onClick={() => exportLeads('csv')}
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Download size={16} /> CSV
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => exportLeads('json')}
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Download size={16} /> JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><Users size={24} /></div>
          <h3>Total Leads</h3>
          <div className="stat-value">{stats?.total || 0}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><UserPlus size={24} /></div>
          <h3>Convertidos</h3>
          <div className="stat-value">{stats?.inscritos || 0}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><TrendingUp size={24} /></div>
          <h3>Tasa Conversión</h3>
          <div className="stat-value">{stats?.tasaConversion || 0}%</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon"><BarChart3 size={24} /></div>
          <h3>Nuevos Hoy</h3>
          <div className="stat-value">{stats?.nuevos || 0}</div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="card">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, email o filial..."
                style={{ paddingLeft: '40px', width: '100%' }}
              />
            </div>
          </div>
          <div className="tabs">
            {['todos', 'nuevo', 'contactado', 'inscrito', 'rechazado'].map(estado => (
              <button
                key={estado}
                className={`tab-btn ${filtroEstado === estado ? 'active' : ''}`}
                onClick={() => setFiltroEstado(estado)}
              >
                {estado === 'todos' ? 'Todos' : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Leads */}
      <div className="card">
        <div className="card-header">
          <h2>Leads Registrados ({filteredLeads.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Empresa/Filial</th>
                <th>Cargo</th>
                <th>Estado</th>
                <th>Origen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const badge = getEstadoBadge(lead.estado);
                return (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: '500' }}>{lead.nombre_completo}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Mail size={12} /> {lead.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <Phone size={12} /> {lead.telefono || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={14} color="var(--text-secondary)" />
                        {lead.empresa_filial || 'N/A'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{lead.cargo || 'N/A'}</td>
                    <td>
                      <span className="badge" style={{ background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {lead.origen_registro || 'N/A'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {lead.estado !== 'inscrito' && lead.estado !== 'convertido' && (
                          <button
                            onClick={() => { setLeadSeleccionado(lead); setShowConvertModal(true); }}
                            style={{ 
                              background: 'rgba(16, 185, 129, 0.1)', 
                              color: '#10b981', 
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Convertir a estudiante"
                          >
                            <ArrowRight size={14} /> Convertir
                          </button>
                        )}
                        <button
                          onClick={() => { setLeadSeleccionado(lead); setNotas(lead.notas_admin || ''); setShowModal(true); }}
                          style={{ 
                            background: 'none', 
                            color: 'var(--primary-blue)', 
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        {lead.estado !== 'inscrito' && (
                          <button
                            onClick={() => eliminarLead(lead.id)}
                            style={{ 
                              background: 'none', 
                              color: 'var(--danger-red)', 
                              border: 'none',
                              padding: '6px',
                              cursor: 'pointer'
                            }}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
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

        {filteredLeads.length === 0 && (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No se encontraron leads</h3>
            <p>Ajusta los filtros o registra nuevos prospectos</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles/Notas */}
      {showModal && leadSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Detalles del Lead</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Nombre</label>
                  <div style={{ fontWeight: '500' }}>{leadSeleccionado.nombre_completo}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
                  <div>{leadSeleccionado.email}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Teléfono</label>
                  <div>{leadSeleccionado.telefono || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Empresa/Filial</label>
                  <div>{leadSeleccionado.empresa_filial || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Cargo</label>
                  <div>{leadSeleccionado.cargo || 'N/A'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Estado</label>
                  <span className="badge" style={{ 
                    background: getEstadoBadge(leadSeleccionado.estado).bg, 
                    color: getEstadoBadge(leadSeleccionado.estado).color 
                  }}>
                    {getEstadoBadge(leadSeleccionado.estado).label}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Origen de Registro</label>
                <div>{leadSeleccionado.origen_registro || 'N/A'}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Notas del Administrador</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agregar notas sobre este lead..."
                  style={{ width: '100%', minHeight: '80px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={actualizarLead} style={{ flex: 1 }}>
                Guardar Notas
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conversión */}
      {showConvertModal && leadSeleccionado && (
        <div className="modal-overlay" onClick={() => setShowConvertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Convertir Lead a Estudiante</h2>
              <button className="close-btn" onClick={() => setShowConvertModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <UserPlus size={48} color="var(--success-green)" style={{ marginBottom: '16px' }} />
              <p style={{ marginBottom: '20px' }}>
                Se creará una cuenta para <strong>{leadSeleccionado.nombre_completo}</strong> con las siguientes credenciales:
              </p>
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: '8px',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email: </span>
                  <strong>{leadSeleccionado.email}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Contraseña temporal: </span>
                  <strong>PDVSA2024!</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-success" 
                onClick={() => convertirLead(leadSeleccionado.id)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <CheckCircle size={18} /> Confirmar Conversión
              </button>
              <button className="btn-secondary" onClick={() => setShowConvertModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionLeads;
