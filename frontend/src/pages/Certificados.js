import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Download, CheckCircle, Search, ExternalLink } from 'lucide-react';
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
      alert('Certificado generado exitosamente');
    } catch (error) {
      console.error('Error generating certificado:', error);
      alert('Error al generar el certificado. Asegúrese de haber aprobado todas las evaluaciones.');
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

  const downloadCertificado = (certificado) => {
    const certContent = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    CERTIFICADO DE COMPLETACIÓN                    ║
║                                                                  ║
║                     ACADEMIA VIRTUAL NASSER GROUP                 ║
║                     Inteligencia Artificial para                 ║
║                     Líderes de Negocio - PDVSA                   ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Se certifica que:                                               ║
║                                                                  ║
║  ${certificado.participante?.nombre?.padEnd(50) || user?.nombre_completo?.padEnd(50) || ''.padEnd(50)} ║
║  Cédula: ${(certificado.participante?.cedula || user?.cedula || '').padEnd(54)} ║
║                                                                  ║
║  Ha completado satisfactoriamente el curso de                    ║
║  Inteligencia Artificial para Líderes de Negocio                 ║
║                                                                  ║
║  Calificación Final: ${(certificado.calificacion_final?.toString() || '0').padEnd(42)}% ║
║  Fecha de Emisión: ${new Date(certificado.fecha_emision).toLocaleDateString('es-VE').padEnd(41)} ║
║  Código de Verificación: ${certificado.codigo_verificacion?.padEnd(37)} ║
║                                                                  ║
║  Instituto: Nasser Group - PDVSA                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Verifique su certificado en: ${API_URL}/certificates/verify/${certificado.codigo_verificacion}
    `;

    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado_${certificado.codigo_verificacion}.txt`;
    a.click();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Certificados</h1>
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
            placeholder="Ingrese el código de verificación (NG-...)"
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
                  <h3 style={{ color: 'var(--success-green)' }}>Certificado Válido</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Participante</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.participante?.nombre}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cédula</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.participante?.cedula}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calificación</div>
                    <div style={{ fontWeight: '500' }}>{resultadoVerificacion.certificado.calificacion_final}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha de Emisión</div>
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
            <div className="icon">🏆</div>
            <h3>Sin certificados aún</h3>
            <p>Completa todas las evaluaciones con al menos 80% para obtener tu certificado</p>
            <button 
              className="btn-primary" 
              onClick={generarCertificado}
              disabled={generando}
              style={{ width: 'auto', marginTop: '20px' }}
            >
              {generando ? 'Generando...' : 'Generar Mi Certificado'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button 
              className="btn-gold" 
              onClick={generarCertificado}
              disabled={generando}
              style={{ width: 'auto' }}
            >
              {generando ? 'Generando...' : 'Generar Nuevo Certificado'}
            </button>
          </div>

          {certificados.map((certificado) => (
            <div key={certificado.id} className="certificate-card" style={{ marginBottom: '32px' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Award size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
                
                <h1>CERTIFICADO DE COMPLETACIÓN</h1>
                <div className="institution">NASSER GROUP - PDVSA</div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Otorga el presente certificado a:
                </p>
                
                <div className="participant-name">
                  {certificado.participante?.nombre || user?.nombre_completo}
                </div>
                
                <div className="course-name">
                  Por haber completado satisfactoriamente el curso de<br />
                  <strong>Inteligencia Artificial para Líderes de Negocio</strong>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '24px',
                  maxWidth: '400px',
                  margin: '0 auto 24px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calificación Final</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-green)' }}>
                      {certificado.calificacion_final}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha de Emisión</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      {new Date(certificado.fecha_emision).toLocaleDateString('es-VE')}
                    </div>
                  </div>
                </div>

                <div className="qr-container">
                  <QRCodeSVG 
                    value={JSON.stringify({
                      institucion: 'Nasser Group',
                      curso: 'IA para Líderes de Negocio',
                      participante: certificado.participante?.nombre,
                      codigo: certificado.codigo_verificacion
                    })}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="verification-code">
                  Código: {certificado.codigo_verificacion}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => downloadCertificado(certificado)}
                    style={{ width: 'auto' }}
                  >
                    <Download size={18} /> Descargar Certificado
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificados;
