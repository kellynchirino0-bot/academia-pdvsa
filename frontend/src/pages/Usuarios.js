import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cedula: '',
    nombre_completo: '',
    cargo: '',
    correo: '',
    password: '',
    rol_id: 3
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/users/${editingUser.id}`, {
          nombre_completo: formData.nombre_completo,
          cargo: formData.cargo,
          correo: formData.correo,
          rol_id: formData.rol_id
        });
      } else {
        await axios.post(`${API_URL}/users`, formData);
      }
      loadUsuarios();
      closeModal();
    } catch (error) {
      console.error('Error saving usuario:', error);
      alert('Error al guardar el usuario');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        loadUsuarios();
      } catch (error) {
        console.error('Error deleting usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const openEditModal = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      cedula: usuario.cedula,
      nombre_completo: usuario.nombre_completo,
      cargo: usuario.cargo,
      correo: usuario.correo,
      password: '',
      rol_id: usuario.rol === 'administrador' ? 1 : usuario.rol === 'instructor' ? 2 : 3
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      cedula: '',
      nombre_completo: '',
      cargo: '',
      correo: '',
      password: '',
      rol_id: 3
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.cedula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'administrador': return 'badge-danger';
      case 'instructor': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Administrar participantes, instructores y administradores del sistema</p>
          </div>
          <button className="btn-primary" onClick={openCreateModal} style={{ width: 'auto' }}>
            <Plus size={18} /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Usuarios Registrados ({usuarios.length})</h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              style={{ paddingLeft: '40px', width: '250px' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cédula</th>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td style={{ fontWeight: '500' }}>{usuario.cedula}</td>
                  <td>{usuario.nombre_completo}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{usuario.cargo}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`badge ${getRolBadgeClass(usuario.rol)}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${usuario.activo ? 'badge-success' : 'badge-danger'}`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(usuario)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--primary-blue)', 
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--danger-red)', 
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsuarios.length === 0 && (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No se encontraron usuarios</h3>
            <p>{searchTerm ? 'Intenta con otros términos de búsqueda' : 'Registra el primer usuario del sistema'}</p>
          </div>
        )}
      </div>

      {/* Modal de usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cédula</label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  placeholder="V-12345678"
                  disabled={editingUser}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                  placeholder="Líder de Proyecto"
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  placeholder="correo@pdvsa.com"
                  required
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required={!editingUser}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.rol_id}
                  onChange={(e) => setFormData({...formData, rol_id: parseInt(e.target.value)})}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Instructor</option>
                  <option value={3}>Participante</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  <Save size={18} /> {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
