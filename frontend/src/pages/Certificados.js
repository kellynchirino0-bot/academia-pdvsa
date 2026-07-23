import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Download, CheckCircle, Search, Clock, XCircle, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Certificados = () => {
  const { user } = useAuth();
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [verificacionCodigo, setVerificacionCodigo] = useState('');
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [showBadge, setShowBadge] = useState(null);

  useEffect(() => {
    loadCertificados();
  }, []);

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
                {resultadoVerificacion.error || 'Certificado no encontrado o invalido'}
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
            <p>Completa todas las evaluaciones con al menos 70% para solicitar tu certificado</p>
            <button 
              className="btn-primary" 
              onClick={generarCertificado}
              disabled={generando}
              style={{ width: 'auto', marginTop: '20px' }}
            >
              {generando ? 'Enviando...' : 'Solicitar Certificado'}
            </button>
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
                  <div style={{ 
                    background: 'linear-gradient(135deg, #0a2342 0%, #0d6e6e 50%, #2d8a4e 100%)', 
                    padding: '32px', 
                    borderRadius: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Award size={28} color="#d4a843" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Nasser Group</div>
                        <div style={{ color: '#d4a843', fontWeight: '700', letterSpacing: '4px', fontSize: '1rem' }}>DIGITAL BADGE</div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '8px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Course</div>
                          <div style={{ fontWeight: '500', color: '#1a1a1a' }}>{cert.curso}</div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Awarded to</div>
                          <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{cert.nombre_estudiante}</div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Issued</div>
                          <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                            {new Date(cert.fecha_emision).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Language</div>
                          <div style={{ fontWeight: '500', color: '#1a1a1a' }}>ES</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>ID</div>
                          <div style={{ fontWeight: '500', color: '#1a1a1a', fontFamily: 'monospace' }}>{cert.codigo_verificacion}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <QRCodeSVG 
                          value={`${window.location.origin}/verify/${cert.codigo_verificacion}`}
                          size={100}
                          level="H"
                          includeMargin={false}
                        />
                        <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px' }}>Scan to verify</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => downloadBadge(cert)}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={18} /> Descargar Badge
                      </button>
                      <a 
                        href={`${window.location.origin}/verify/${cert.codigo_verificacion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          width: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: '#fff',
                          borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem'
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