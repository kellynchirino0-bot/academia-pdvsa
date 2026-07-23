import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Edit2, Shield, Clock, CheckCircle, 
  XCircle, Download, UserCheck, UserX, Calendar, Mail, Building2
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AdminUsersManager = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [extensionDias, setExtensionDias] = useState(30);

  useEffect(() => { loadUsuarios(); }, []);

  const loadUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsuarios(response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const cambiarRol = async (userId, nuevoRol) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { rol_id: nuevoRol });
      loadUsuarios();
    } catch (error) { alert(error.response?.data?.error || 'Error al cambiar rol'); }
  };

  const actualizarTrial = async (userId) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/trial`, { extension_dias: parseInt(extensionDias) });
      loadUsuarios();
      setShowModal(false);
    } catch (error) { alert('Error al actualizar trial'); }
  };

  const toggleMembresia = async (userId, estado) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/trial`, { membresia_extendida: !estado });
      loadUsuarios();
    } catch (error) { alert('Error al actualizar membresia'); }
  };

  const toggleEstado = async (userId, activo) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/status`, { activo: !activo });
      loadUsuarios();
    } catch (error) { alert('Error al actualizar estado'); }
  };

  const exportUsers = async (format) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/export?format=${format}`, { responseType: format === 'csv' ? 'blob' : 'json' });
      const blob = format === 'csv' ? new Blob([response.data]) : new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `usuarios_export.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch (error) { alert('Error al exportar'); }
  };

  const filtered = usuarios.filter(u => {
    const matchRol = filtroRol === 'todos' || u.rol_id === parseInt(filtroRol);
    const matchEstado = filtroEstado === 'todos' || u.estado === filtroEstado;
    const matchBusqueda = !busqueda || u.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) || u.correo?.toLowerCase().includes(busqueda.toLowerCase());
    return matchRol && matchEstado && matchBusqueda;
  });

  const getRolBadge = (rol) => {
    const badges = { 1: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Admin' }, 2: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Tutor' }, 3: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Estudiante' } };
    return badges[rol] || badges[3];
  };

  const getEstadoBadge = (estado) => {
    const badges = { ACTIVE: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Activo' }, TRIAL_EXPIRED: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Trial Expirado' }, BLOCKED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Bloqueado' } };
    return badges[estado] || badges.ACTIVE;
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Gestion de Usuarios</h1>
            <p>Administra usuarios, roles y periodos de prueba</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => exportUsers('csv')} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Download size={16} /> CSV
            </button>
            <button className="btn-secondary" onClick={() => exportUsers('json')} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Download size={16} /> JSON
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-icon"><Users size={24} /></div><h3>Total</h3><div className="stat-value">{usuarios.length}</div></div>
        <div className="stat-card green"><div className="stat-icon"><UserCheck size={24} /></div><h3>Activos</h3><div className="stat-value">{usuarios.filter(u => u.estado === 'ACTIVE').length}</div></div>
        <div className="stat-card gold"><div className="stat-icon"><Clock size={24} /></div><h3>Trial Expirado</h3><div className="stat-value">{usuarios.filter(u => u.estado === 'TRIAL_EXPIRED').length}</div></div>
        <div className="stat-card" style={{ borderTopColor: '#ef4444' }}><div className="stat-icon"><UserX size={24} color="#ef4444" /></div><h3>Bloqueados</h3><div className="stat-value">{usuarios.filter(u => u.estado === 'BLOCKED').length}</div></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o email..." style={{ paddingLeft: '40px', width: '100%' }} />
            </div>
          </div>
          <div className="tabs">
            {[{ v: 'todos', l: 'Todos' }, { v: '1', l: 'Admin' }, { v: '2', l: 'Tutor' }, { v: '3', l: 'Estudiante' }].map(r => (
              <button key={r.v} className={`tab-btn ${filtroRol === r.v ? 'active' : ''}`} onClick={() => setFiltroRol(r.v)}>{r.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Usuarios ({filtered.length})</h2></div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Contacto</th><th>Rol</th><th>Estado</th><th>Trial</th><th>Membresia</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rolBadge = getRolBadge(u.rol_id);
                const estadoBadge = getEstadoBadge(u.estado);
                const trialDays = u.trial_end ? Math.max(0, Math.ceil((new Date(u.trial_end) - new Date()) / (1000 * 60 * 60 * 24))) : null;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: rolBadge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Shield size={14} color={rolBadge.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{u.nombre_completo}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.cedula}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Mail size={12} /> {u.correo}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.empresa_filial}</span>
                      </div>
                    </td>
                    <td>
                      <select value={u.rol_id} onChange={(e) => cambiarRol(u.id, parseInt(e.target.value))} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        <option value={1}>Admin</option>
                        <option value={2}>Tutor</option>
                        <option value={3}>Estudiante</option>
                      </select>
                    </td>
                    <td><span className="badge" style={{ background: estadoBadge.bg, color: estadoBadge.color }}>{estadoBadge.label}</span></td>
                    <td>
                      {trialDays !== null ? (
                        <span style={{ fontSize: '0.85rem', color: trialDays <= 7 ? '#f59e0b' : '#10b981' }}>{trialDays} dias</span>
                      ) : '-'}
                    </td>
                    <td>
                      <button onClick={() => toggleMembresia(u.id, u.membresia_extendida)} style={{ background: u.membresia_extendida ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: u.membresia_extendida ? '#10b981' : '#6b7280', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        {u.membresia_extendida ? 'Activa' : 'Sin membresia'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {u.rol_id === 3 && (
                          <button onClick={() => { setSelectedUser(u); setShowModal(true); }} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }} title="Extender trial">
                            <Clock size={14} /> Trial
                          </button>
                        )}
                        <button onClick={() => toggleEstado(u.id, u.activo)} style={{ background: u.activo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: u.activo ? '#ef4444' : '#10b981', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title={u.activo ? 'Desactivar' : 'Activar'}>
                          {u.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Extender Trial</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '16px' }}>Usuario: <strong>{selectedUser.nombre_completo}</strong></p>
              <p style={{ marginBottom: '16px' }}>Trial actual: {selectedUser.trial_end ? new Date(selectedUser.trial_end).toLocaleDateString('es-VE') : 'Sin trial'}</p>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Extension (dias)</label>
              <input type="number" value={extensionDias} onChange={(e) => setExtensionDias(e.target.value)} min="1" max="365" style={{ width: '100%', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => actualizarTrial(selectedUser.id)} style={{ flex: 1 }}>Extender {extensionDias} dias</button>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManager;
