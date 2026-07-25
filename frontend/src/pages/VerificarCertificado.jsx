import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

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

  useEffect(() => {
    if (initialCode && initialCode !== ':id') {
      consultarCertificado(initialCode);
    }
  }, [location.search, paramId]);

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Courier New', 'Segoe UI', monospace" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
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

        <div style={{ maxWidth: '640px', margin: '0 auto 30px auto', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ingrese el Código del Certificado (ej: ML-DSA-PDVSA-2026-FAJA-991)"
            value={codigoBusqueda}
            onChange={(e) => setCodigoBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && consultarCertificado()}
            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', fontFamily: 'monospace', fontSize: '13px' }}
          />
          <button
            onClick={() => consultarCertificado()}
            style={{ backgroundColor: '#0891B2', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            Validar Certificado
          </button>
        </div>

        {loading && (
          <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px', textAlign: 'center', color: '#38BDF8', fontSize: '13px' }}>
            Verificando firma criptográfica en LagoChain...
          </div>
        )}

        {error && (
          <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', padding: '15px', borderRadius: '8px', color: '#EF4444', textAlign: 'center', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {certificado && (
          <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#0F172A', borderRadius: '10px', border: '2px solid #22C55E', padding: '24px', boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16,185,129,0.4)', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                  CERTIFICADO VÁLIDO & VIGENTE
                </span>
                <h2 style={{ color: '#F8FAFC', margin: '12px 0 4px 0', fontSize: '18px' }}>
                  {certificado.estudiante || certificado.certificado?.nombre_estudiante}
                </h2>
                <p style={{ color: '#22D3EE', fontSize: '13px', margin: 0 }}>
                  {certificado.curso || certificado.certificado?.curso}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
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
                    {certificado.codigo || certificado.certificado?.codigo_verificacion || certificado.certificado?.id}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Institución Acreditadora</td>
                  <td style={{ color: '#CBD5E1', padding: '6px 8px' }}>
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
              <div style={{ backgroundColor: '#090D16', border: '1px solid #1E293B', borderRadius: '6px', padding: '10px', fontSize: '11px', color: '#34D399', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {certificado.firma_mldsa || 'FIPS-204-ML-DSA-87-LAGOCHAIN'}
              </div>
            </div>

            {certificado.certificado?.codigo_verificacion && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                  <QRCodeSVG
                    value={`https://academia-pdvsa.vercel.app/verificar-certificado?id=${encodeURIComponent(certificado.certificado.codigo_verificacion)}`}
                    size={120}
                    level="H"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarCertificado;
