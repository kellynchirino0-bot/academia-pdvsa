import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const GlobalSafetyLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
      <path d="M20 80 C 30 20, 70 20, 80 80" stroke="#00A859" strokeWidth="8" fill="none"/>
      <path d="M30 75 C 40 30, 60 30, 70 75" stroke="#0284C7" strokeWidth="6" fill="none"/>
      <path d="M40 70 C 45 40, 55 40, 60 70" stroke="#E11D48" strokeWidth="5" fill="none"/>
    </svg>
    <div>
      <div style={{ color: '#0284C7', fontWeight: '900', fontSize: '18px', letterSpacing: '1px', fontFamily: 'sans-serif' }}>
        GLOBAL<span style={{ fontSize: '10px', verticalAlign: 'super' }}>TM</span>
      </div>
      <div style={{ color: '#0284C7', fontSize: '8px', fontWeight: 'bold', letterSpacing: '2px' }}>
        SAFETY SOLUTIONS
      </div>
    </div>
  </div>
);

const DigitalBadgeGSS = ({ certificado, size = 'normal' }) => {
  const {
    id = "CERT_9bf9647314e2",
    estudiante = "Javier Andres Ferrer Clemente",
    curso = "Fundamentos de IA y Optimización I.O.",
    fecha = "Jul 22, 2026",
    idioma = "ES",
    calificacion = "100"
  } = certificado || {};

  const verificationUrl = `${process.env.REACT_APP_VERIFY_BASE_URL || window.location.origin}/verificar-certificado?id=${id}`;
  const isCompact = size === 'compact';

  return (
    <div style={{
      width: isCompact ? '100%' : '600px',
      maxWidth: '100%',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      border: '4px solid #0284C7',
      borderRadius: '12px',
      padding: '24px 24px 16px 24px',
      boxSizing: 'border-box',
      position: 'relative',
      color: '#F8FAFC',
      fontFamily: "'Courier New', Courier, monospace",
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GlobalSafetyLogo />
        <div style={{ color: '#EAB308', fontWeight: 'bold', fontSize: isCompact ? '14px' : '18px', letterSpacing: '2px' }}>
          DIGITAL BADGE
        </div>
      </div>

      <div style={{ marginTop: '30px', fontSize: isCompact ? '12px' : '13px', lineHeight: '2' }}>
        <div>
          <span style={{ color: '#94A3B8' }}>Course: </span>
          <strong style={{ color: '#38BDF8' }}>{curso}</strong>
        </div>
        <div style={{ marginTop: '10px' }}>
          <span style={{ color: '#94A3B8' }}>Awarded to: </span>
          <strong style={{ color: '#FACC15', fontSize: isCompact ? '13px' : '15px' }}>{estudiante}</strong>
        </div>
        <div style={{ marginTop: '10px' }}>
          <span style={{ color: '#94A3B8' }}>Issued: </span>{fecha}
        </div>
        <div>
          <span style={{ color: '#94A3B8' }}>Language: </span>{idioma}
        </div>
        {calificacion && (
          <div>
            <span style={{ color: '#94A3B8' }}>Grade: </span>
            <span style={{ color: parseFloat(calificacion) >= 70 ? '#4ADE80' : '#EF4444', fontWeight: '600' }}>{calificacion}%</span>
          </div>
        )}
        <div style={{ marginTop: '10px' }}>
          <span style={{ color: '#94A3B8' }}>ID: </span>
          <span style={{ color: '#4ADE80' }}>{id}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', right: '24px', textAlign: 'center' }}>
        <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', display: 'inline-block' }}>
          <QRCodeSVG value={verificationUrl} size={isCompact ? 70 : 90} level="H" />
        </div>
        <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
          Scan to verify
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '2px', justifyContent: 'center' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8', display: 'inline-block' }}></span>
          <span>GabrielBiz ✓</span>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(100,116,139,0.5)', textAlign: 'center', fontSize: '11px', color: '#94A3B8' }}>
        <div style={{ fontWeight: 500, color: '#CBD5E1', marginBottom: '2px' }}>
          Infraestructura & Ciberseguridad: <span style={{ color: '#38BDF8', fontWeight: 600 }}>GabrielBiz CyberSecurity & Lago Chain</span>
        </div>
        <div style={{ fontSize: '10px', color: '#64748B' }}>
          Acreditado por Global Safety Solutions &bull; PDVSA / IUTPAL
        </div>
      </div>
    </div>
  );
};

export default DigitalBadgeGSS;