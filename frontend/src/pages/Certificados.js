import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Download, CheckCircle, Search, Clock, XCircle, ExternalLink, Zap, RotateCcw } from 'lucide-react';
import axios from 'axios';
import DigitalBadgeGSS from '../components/DigitalBadgeGSS';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Certificados = () => {
  const { user, progress } = useAuth();
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [verificacionCodigo, setVerificacionCodigo] = useState('');
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [showBadge, setShowBadge] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const canRequestCert = progress && progress.porcentaje_global >= 100;
  const isAdmin = user?.rol === 'administrador' || user?.nombre_rol === 'administrador' || user?.rol_id === 1;

  useEffect(() => {
    loadCertificados();
  }, []);

  const completarModoDemo = async () => {
    setDemoMode(true);
    try {
      await axios.post(`${API_URL}/demo/complete-all`);
      setDemoMode(false);
      window.location.reload();
    } catch (err) {
      setDemoMode(false);
    }
  };

  const loadCertificados = async () => {
    try {
      const response = await axios.get(`${API_URL}/certificates/user/${user?.id}`);
      setCertificados(response.data);
    } catch (error) {
      console.error('Error loading certificados:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarCertificado = async () => {
    setGenerando(true);
    try {
      const response = await axios.post(`${API_URL}/certificates/generate`);
      setCertificados([...certificados, response.data.certificado]);
      alert(response.data.message || 'Solicitud de certificado enviada. Pendiente de aprobación por administración.');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al generar el certificado. Asegúrese de haber aprobado todas las evaluaciones.');
    } finally {
      setGenerando(false);
    }
  };

  const verificarCertificado = async () => {
    if (!verificacionCodigo.trim()) return;
    try {
      const response = await axios.get(`${API_URL}/certificates/verify/${verificacionCodigo}`);
      setResultadoVerificacion(response.data);
    } catch (error) {
      setResultadoVerificacion({ valido: false, error: 'Certificado no encontrado' });
    }
  };

  const downloadBadge = (cert) => {
    const badgeContent = `
================================================================================
                         ACADAMIA VIRTUAL NASSER GROUP - PDVSA
                              CURSO DE INTELIGENCIA ARTIFICIAL
================================================================================

                              D I G I T A L   B A D G E

  Course:       ${cert.curso}
  Awarded to:   ${cert.nombre_estudiante}
  Issued:       ${cert.fecha_emision ? new Date(cert.fecha_emision).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pendiente'}
  Language:     ES
  ID:           ${cert.codigo_verificacion}
  Calificacion: ${cert.calificacion_final}%

  Verifique en: ${window.location.origin}/verify/${cert.codigo_verificacion}

================================================================================
  Instituto: Nasser Group - PDVSA
  Fecha de emision: ${new Date().toLocaleDateString('es-VE')}
================================================================================
    `;

    const blob = new Blob([badgeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital_badge_${cert.codigo_verificacion}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: Clock, label: 'Pendiente de Aprobación' },
      aprobado: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: CheckCircle, label: 'Aprobado' },
      rechazado: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: XCircle, label: 'Rechazado' }
    };
    return badges[estado] || badges.pendiente;
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Mis Certificados</h1>
        <p>Gestiona y verifica tus certificados de completación del curso</p>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2>Verificar Certificado</h2>
          <Search size={20} color="var(--text-secondary)" />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <input
            type="text"
            value={verificacionCodigo}
            onChange={(e) => setVerificacionCodigo(e.target.value)}
            placeholder="Ingrese el código de verificación (CERT_...)"
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={verificarCertificado} style={{ width: 'auto' }}>
            Verificar
          </button>
        </div>

        {resultadoVerificacion && (
          <div style={{ marginTop: '20px' }}>
            {resultadoVerificacion.valido ? (
              <div style={{
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '2px solid var(--success-green)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CheckCircle size={24} color="var(--success-green)" />
                  <h3 style={{ color: 'var(--success-green)' }}>Certificado Valido</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estudiante</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.nombre_estudiante}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Curso</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.curso}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calificacion</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.calificacion_final}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha de Emision</div>
                    <div style={{ fontWeight: '500' }}>
                      {new Date(resultadoVerificacion.certificado.fecha_emision).toLocaleDateString('es-VE')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-error">
                {resultadoVerificacion.error || 'Certificado no encontrado o inválido'}
              </div>
            )}
          </div>
        )}
      </div>

      {certificados.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">🎓</div>
            <h3>Sin certificados aun</h3>
            <p>Completa el 100% del curso para solicitar tu certificado</p>

            {progress && (
              <div style={{ width: '100%', maxWidth: '400px', margin: '16px auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Progreso del curso</span>
                  <span>{progress.porcentaje_global}%</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(0,0,0,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(progress.porcentaje_global, 100)}%`, background: 'linear-gradient(90deg, #003366, #0066cc)', borderRadius: '5px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {progress.lecciones_completadas} de {progress.total_lecciones} lecciones completadas
                  {progress.evaluaciones_realizadas > 0 && ` · ${progress.evaluaciones_realizadas} evaluaciones realizadas`}
                </div>
                {progress.modulos?.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '6px', padding: '4px 8px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
                    <span>Módulo {m.id}: {m.titulo?.substring(0, 30)}...</span>
                    <span style={{ fontWeight: m.porcentaje >= 100 ? '600' : '400', color: m.porcentaje >= 100 ? '#10b981' : '#f59e0b' }}>{m.porcentaje}%</span>
                  </div>
                ))}
              </div>
            )}

            {canRequestCert && (
              <button 
                className="btn-primary" 
                onClick={generarCertificado}
                disabled={generando}
                style={{ width: 'auto', marginTop: '20px' }}
              >
                {generando ? 'Enviando...' : 'Solicitar Certificado'}
              </button>
            )}
            {isAdmin && !canRequestCert && (
              <button 
                onClick={completarModoDemo}
                disabled={demoMode}
                style={{ marginTop: '12px', padding: '10px 24px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '8px', cursor: demoMode ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Zap size={18} /> {demoMode ? 'Completando...' : 'Completar Módulos (Modo Demo)'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {certificados.map((cert) => {
            const badge = getEstadoBadge(cert.estado);
            const BadgeIcon = badge.icon;
            const isAprobado = cert.estado === 'aprobado';
            
            return (
              <div key={cert.id} style={{ marginBottom: '32px' }}>
                {isAprobado ? (
                  <div>
                    <DigitalBadgeGSS certificado={{
                      id: cert.codigo_verificacion,
                      estudiante: cert.nombre_estudiante,
                      curso: cert.curso,
                      fecha: cert.fecha_emision ? new Date(cert.fecha_emision).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pendiente',
                      idioma: 'ES',
                      calificacion: cert.calificacion_final
                    }} />
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => downloadBadge(cert)}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={18} /> Descargar Badge
                      </button>
                      <a 
                        href={`${window.location.origin}/verificar-certificado?id=${cert.codigo_verificacion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          width: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '10px 20px', background: 'rgba(2, 132, 199, 0.15)', color: '#38BDF8',
                          borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
                          border: '1px solid rgba(2, 132, 199, 0.3)'
                        }}
                      >
                        <ExternalLink size={18} /> Verificar en Linea
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ borderLeft: `4px solid ${badge.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <Award size={24} color={badge.color} />
                          <h3 style={{ margin: 0 }}>Certificado - {cert.curso}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span className="badge" style={{ background: badge.bg, color: badge.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <BadgeIcon size={12} /> {badge.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Solicitado: {new Date(cert.fecha_solicitud || cert.fecha_emision).toLocaleDateString('es-VE')}
                          {cert.fecha_aprobacion && ` | Aprobado: ${new Date(cert.fecha_aprobacion).toLocaleDateString('es-VE')}`}
                        </div>
                        {cert.calificacion_final && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Calificacion final: <strong>{cert.calificacion_final}%</strong>
                          </div>
                        )}
                        {cert.notas_admin && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--danger-red)', marginTop: '4px' }}>
                            Motivo: {cert.notas_admin}
                          </div>
                        )}
                      </div>
                      {cert.estado === 'pendiente' && (
                        <div style={{ 
                          padding: '8px 16px', 
                          background: 'rgba(245, 158, 11, 0.1)', 
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          color: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Clock size={14} /> En revision
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {certificados.every(c => c.estado === 'aprobado') && (
            <div className="card">
              <div className="empty-state">
                <div className="icon">✨</div>
                <h3>Todos tus certificados estan aprobados</h3>
                <p>Puedes descargar tus Digital Badges o verificarlos en linea</p>
              </div>
            </div>
          )}

          {certificados.some(c => c.estado === 'pendiente') && (
            <div style={{ 
              padding: '16px', 
              background: 'rgba(245, 158, 11, 0.05)', 
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <Clock size={16} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#f59e0b' }} />
              Tus certificados pendientes estan en revision. Recibiras una notificacion cuando sean aprobados.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificados;