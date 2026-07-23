import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Building } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    cedula: '',
    nombre_completo: '',
    cargo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.correo, formData.password);
      } else {
        result = await register({
          cedula: formData.cedula,
          nombre_completo: formData.nombre_completo,
          cargo: formData.cargo,
          correo: formData.correo,
          password: formData.password
        });
      }

      if (result.success) {
        const rol = result.user?.rol;
        if (rol === 'administrador') navigate('/admin/dashboard');
        else if (rol === 'tutor') navigate('/tutor');
        else navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <GraduationCap size={48} color="#0a2342" />
          <h1>Academia Virtual</h1>
          <div className="subtitle">Nasser Group</div>
          <div className="pdvsa-badge">PDVSA - Inteligencia Artificial</div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Cédula</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    name="cedula"
                    placeholder="V-12345678"
                    value={formData.cedula}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    name="nombre_completo"
                    placeholder="Juan Pérez"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    name="cargo"
                    placeholder="Líder de Proyecto"
                    value={formData.cargo}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                name="correo"
                placeholder="correo@pdvsa.com"
                value={formData.correo}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-blue)', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {isLogin ? '¿No tiene cuenta? Regístrese aquí' : '¿Ya tiene cuenta? Inicie sesión'}
          </button>
        </div>

        {isLogin && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            background: 'var(--bg-primary)', 
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <strong>Credenciales de prueba:</strong><br />
            Admin: admin@nassergroup.com / admin123
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
