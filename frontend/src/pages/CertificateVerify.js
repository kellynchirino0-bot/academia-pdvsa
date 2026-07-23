import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award, CheckCircle, XCircle, ExternalLink, Shield } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const CertificateVerify = () => {
  const { certificateId } = useParams();
  const [certificado, setCertificado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verificarCertificado();
  }, [certificateId]);

  const verificarCertificado = async () => {
    try {
      const response = await axios.get(`${API_URL}/certificates/verify/${certificateId}`);
      setCertificado(response.data.certificado);
    } catch (err) {
      setError(err.response?.data?.error || 'Certificado no encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a2342 0%, #0d6e6e 50%, #2d8a4e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="spinner" style={{ borderColor: '#d4a843', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a2342 0%, #0d6e6e 50%, #2d8a4e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '48px', 
          maxWidth: '480px', 
          width: '100%', 
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.1)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
          }}>
            <XCircle size={40} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '8px' }}>
            Certificado No Válido
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
          <div style={{ 
            background: '#f8f9fa', borderRadius: '8px', padding: '16px',
            fontSize: '0.85rem', color: '#666'
          }}>
            <Shield size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Verificación de certificados - Academia Virtual Nasser Group PDVSA
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a2342 0%, #0d6e6e 50%, #2d8a4e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '550px', width: '100%' }}>
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #0a2342 0%, #0d6e6e 50%, #2d8a4e 100%)',
            padding: '24px 32px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
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
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', 
                padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <CheckCircle size={12} /> Válido
              </span>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Course</div>
                  <div style={{ fontWeight: '500', color: '#1a1a1a', fontSize: '0.95rem' }}>{certificado.curso}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Awarded to</div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '1.1rem' }}>{certificado.nombre_estudiante}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Issued</div>
                  <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                    {new Date(certificado.fecha_emision).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Language</div>
                  <div style={{ fontWeight: '500', color: '#1a1a1a' }}>ES</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>ID</div>
                  <div style={{ fontWeight: '500', color: '#1a1a1a', fontFamily: 'monospace', fontSize: '0.9rem' }}>{certificado.codigo_verificacion}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Score</div>
                  <div style={{ fontWeight: '600', color: '#10b981', fontSize: '1.1rem' }}>{certificado.calificacion_final}%</div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <QRCodeSVG 
                  value={window.location.href}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
                <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '4px' }}>Scan to verify</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '0.8rem', color: '#999'
            }}>
              <Shield size={14} />
              Certificado verificado - Academia Virtual Nasser Group PDVSA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;