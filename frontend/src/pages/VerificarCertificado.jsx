import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

const styles = `
@media print {
  body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  .cert-verify-card {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 20px !important;
    border: 2px solid #000 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: #fff !important;
    color: #000 !important;
    font-family: 'Courier New', monospace !important;
    page-break-after: avoid;
  }
  .cert-verify-card h2 { color: #000 !important; }
  .cert-verify-card table td { color: #333 !important; }
  .cert-verify-card .badge-valid { border: 1px solid #22C55E; color: #166534; background: rgba(34,197,94,0.1) !important; }
  .cert-verify-card .signature-box { border: 1px solid #ccc !important; background: #f8f8f8 !important; color: #333 !important; }
  .print-footer { display: block !important; }
}
@media screen {
  .print-only { display: none !important; }
  .print-footer { display: none !important; }
}
@keyframes pulse-cyber {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
@keyframes scan-line {
  0% { top: 0%; }
  100% { top: 100%; }
}
.spinner-cyber {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(56, 189, 248, 0.15);
  border-top: 3px solid #22C55E;
  border-radius: 50%;
  animation: pulse-cyber 1.2s ease-in-out infinite;
}
`;

export const VerificarCertificado = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id') || queryParams.get('codigo');

  const initialCode = paramId || queryId || 'ML-DSA-PDVSA-2026-FAJA-991';
  const [codigoBusqueda, setCodigoBusqueda] = useState(initialCode);
  const [certificado, setCertificado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const cardRef = useRef(null);

  const consultarCertificado = async (codeToVerify) => {
    const code = codeToVerify || codigoBusqueda;
    if (!code || code === ':id') return;

    setLoading(true);
    setError(null);
    setCertificado(null);
    try {
      const cleanCode = encodeURIComponent(code.trim());
      const res = await API.get(`/certificates/verify/${cleanCode}`);
      if (res.data && res.data.valido) {
        setCertificado(res.data);
      } else {
        setError('El certificado consultado no se encuentra registrado o no es válido.');
      }
    } catch (err) {
      console.error('Error al verificar certificado:', err);
      setError('Error al conectar con la red de auditoría LagoChain. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const copiarEnlace = () => {
    if (!certificado) return;
    const codigo = certificado.codigo || certificado.certificado?.codigo_verificacion || certificado.certificado?.id;
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/verificar-certificado?id=${encodeURIComponent(codigo)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const imprimirPDF = () => window.print();

  useEffect(() => {
    if (initialCode && initialCode !== ':id') {
      consultarCertificado(initialCode);
    }
  }, [location.search, paramId]);

  const codigoActual = certificado?.codigo || certificado?.certificado?.codigo_verificacion || certificado?.certificado?.id;

  return (
    <>
      <style>{styles}</style>
      <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Courier New', 'Segoe UI', monospace", overflowX: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div className="no-print" style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#10B981', color: '#0F172A', fontSize: '10px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
              CENTRO DE VERIFICACIÓN Y AUDITORÍA CRIPTOGRÁFICA ML-DSA
            </span>
            <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '26px' }}>
              Verificación y Trazabilidad ML-DSA
            </h1>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '12px' }}>
              Global Safety Solutions &bull; LagoChain Post-Quantum &bull; IUTPAL / PDVSA
            </p>
          </div>

          <div className="no-print" style={{ maxWidth: '640px', margin: '0 auto 30px auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Ingrese el Código del Certificado (ej: ML-DSA-PDVSA-2026-FAJA-991)"
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && consultarCertificado()}
              style={{ flex: '1 1 200px', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', fontFamily: 'monospace', fontSize: '13px' }}
            />
            <button
              onClick={() => consultarCertificado()}
              style={{ backgroundColor: '#0891B2', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              Validar Certificado
            </button>
          </div>

          {loading && (
            <div className="no-print" style={{ maxWidth: '640px', margin: '0 auto', padding: '30px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="spinner-cyber" />
                <div style={{ color: '#22D3EE', fontSize: '13px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#22C55E' }}>&gt;</span> Validando firma FIPS-204 en LagoChain...
                </div>
                <div style={{ width: '200px', height: '2px', background: 'rgba(56,189,248,0.15)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #22C55E, #22D3EE)', borderRadius: '2px', animation: 'scan-line 1.5s ease-in-out infinite', position: 'absolute' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="no-print" style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', padding: '15px', borderRadius: '8px', color: '#EF4444', textAlign: 'center', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {certificado && (
            <div ref={cardRef} className="cert-verify-card" style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#0F172A', borderRadius: '10px', border: '2px solid #22C55E', padding: '24px', boxShadow: '0 0 20px rgba(34,197,94,0.15)', overflowX: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ minWidth: '200px' }}>
                  <span className="badge-valid" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16,185,129,0.4)', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', display: 'inline-block' }}>
                    CERTIFICADO VÁLIDO & VIGENTE
                  </span>
                  <h2 style={{ color: '#F8FAFC', margin: '12px 0 4px 0', fontSize: '18px', wordBreak: 'break-word' }}>
                    {certificado.estudiante || certificado.certificado?.nombre_estudiante}
                  </h2>
                  <p style={{ color: '#22D3EE', fontSize: '13px', margin: 0, wordBreak: 'break-word' }}>
                    {certificado.curso || certificado.certificado?.curso}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#64748B', fontSize: '11px', margin: '0 0 2px 0' }}>Fecha de Emisión</p>
                  <p style={{ color: '#CBD5E1', fontSize: '13px', fontFamily: 'monospace', margin: 0 }}>
                    {certificado.fecha_emision || certificado.certificado?.fecha_emision}
                  </p>
                </div>
              </div>

              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', width: '140px', verticalAlign: 'top' }}>Código Unívoco</td>
                    <td style={{ color: '#22D3EE', padding: '6px 8px', fontFamily: 'monospace', fontWeight: 'bold', wordBreak: 'break-all' }}>
                      {codigoActual}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Institución Acreditadora</td>
                    <td style={{ color: '#CBD5E1', padding: '6px 8px', wordBreak: 'break-word' }}>
                      {certificado.institucion || 'PDVSA / IUTPAL / Global Safety Solutions'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Aval Internacional</td>
                    <td style={{ color: '#00A859', padding: '6px 8px', fontWeight: 'bold' }}>Global Safety Solutions™</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Algoritmo</td>
                    <td style={{ color: '#38BDF8', padding: '6px 8px', fontFamily: 'monospace' }}>ML-DSA (NIST FIPS 204) — Post-Quantum</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Validador</td>
                    <td style={{ color: '#38BDF8', padding: '6px 8px', fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block', marginRight: '6px' }}></span>
                      GabrielBiz CyberSecurity & Lago Chain
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Soberanía</td>
                    <td style={{ color: '#22C55E', padding: '6px 8px', fontWeight: 'bold' }}>IUTPAL / PDVSA / Global Safety Solutions</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '16px' }}>
                <p style={{ color: '#64748B', fontSize: '11px', margin: '0 0 4px 0' }}>Firma Post-Cuántica (NIST FIPS 204):</p>
                <div className="signature-box" style={{ backgroundColor: '#090D16', border: '1px solid #1E293B', borderRadius: '6px', padding: '10px', fontSize: '11px', color: '#34D399', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {certificado.firma_mldsa || 'FIPS-204-ML-DSA-87-LAGOCHAIN'}
                </div>
              </div>

              {codigoActual && (
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                    <QRCodeSVG
                      value={`${window.location.origin}/verificar-certificado?id=${encodeURIComponent(codigoActual)}`}
                      size={120}
                      level="H"
                    />
                  </div>
                </div>
              )}

              <div className="print-footer" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #334155', textAlign: 'center', fontSize: '10px', color: '#64748B' }}>
                <div>Verificado en {window.location.origin} — Global Safety Solutions™ — ML-DSA FIPS 204</div>
                <div style={{ marginTop: '2px' }}>{new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>
          )}

          {certificado && (
            <div className="no-print" style={{ maxWidth: '640px', margin: '20px auto 0', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={copiarEnlace}
                style={{ backgroundColor: copiado ? '#22C55E' : '#1E293B', color: copiado ? '#0F172A' : '#38BDF8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: '0.2s' }}
              >
                {copiado ? '¡Enlace Copiado!' : 'Copiar Enlace de Verificación'}
              </button>
              <button
                onClick={imprimirPDF}
                style={{ backgroundColor: '#1E293B', color: '#22C55E', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                Imprimir / PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificarCertificado;
