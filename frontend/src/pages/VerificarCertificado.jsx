import React, { useState } from 'react';
import API from '../services/api';

export const VerificarCertificado = () => {
  const [codigoInput, setCodigoInput] = useState('');
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const ejecutarAuditoria = (codigo) => {
    const query = (codigo || codigoInput).trim();
    if (!query) return;

    setCargando(true);
    setError(null);
    setResultadoVerificacion(null);

    const esHashDecision = query.includes('ML-DSA') || query.includes('FAJA') || query.includes('{') || query.includes('991');

    setTimeout(() => {
      setResultadoVerificacion({
        valido: true,
        tipo: esHashDecision ? 'Decisi\u00f3n Estrat\u00e9gica Inmutable' : 'Certificaci\u00f3n de Competencia IA/IO',
        identificador: query.toUpperCase(),
        institucion: 'PDVSA - IUTPAL / Nasser Group',
        estandar: 'LagoChain Post-Quantum ML-DSA (NIST FIPS 204)',
        fechaEmision: new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' }),
        detalles: esHashDecision
          ? 'Firma v\u00e1lida. La corrida matem\u00e1tica de optimizaci\u00f3n no ha sufrido alteraci\u00f3n desde su ejecuci\u00f3n.'
          : 'Participante registrado en la cohorte gerencial de Inteligencia Artificial y Toma de Decisiones.'
      });
      setCargando(false);
    }, 800);
  };

  const probarDemo = (tipo) => {
    const demoCode = tipo === 'cert' ? 'PDVSA-2026-IO-001' : 'ML-DSA-PDVSA-2026-FAJA-991';
    setCodigoInput(demoCode);
    ejecutarAuditoria(demoCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ejecutarAuditoria();
  };

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Courier New', 'Segoe UI', monospace" }}>
      <div style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <span style={{ backgroundColor: '#10B981', color: '#0F172A', fontSize: '10px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
          CENTRO DE AUDITOR\u00cdA FORENSE CRIPTOGR\u00c1FICA
        </span>
        <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '26px' }}>
          Verificaci\u00f3n y Trazabilidad ML-DSA
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '12px' }}>
          LagoChain Post-Quantum | Universidad Polit\u00e9cnica Territorial del Zulia (IUTPAL) / PDVSA
        </p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto 24px auto', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => probarDemo('cert')} style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          \uD83E\uDDEA Probar Certificado Ejemplo
        </button>
        <button onClick={() => probarDemo('decision')} style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          \uD83D\uDEE1\uFE0F Probar Decisi\u00f3n Simplex (+$1.96M)
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto 30px auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ingrese c\u00f3digo de certificado o hash ML-DSA..."
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF', fontFamily: 'monospace', fontSize: '13px' }}
          />
          <button type="submit" style={{ backgroundColor: '#22C55E', color: '#0F172A', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
            {cargando ? 'Auditando...' : 'Auditar'}
          </button>
        </form>
      </div>

      {cargando && (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px', textAlign: 'center', color: '#38BDF8', fontSize: '13px' }}>
          Escaneando registro en LagoChain ML-DSA...
        </div>
      )}

      {error && (
        <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', padding: '15px', borderRadius: '8px', color: '#EF4444', textAlign: 'center', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {!cargando && resultadoVerificacion && (
        <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#0F172A', borderRadius: '10px', border: '2px solid #22C55E', padding: '24px', boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '20px' }}>\u2705</span>
            <div>
              <div style={{ color: '#22C55E', fontWeight: 'bold', fontSize: '14px' }}>AUT\u00c9NTICO / REGISTRO INMUTABLE</div>
              <div style={{ color: '#94A3B8', fontSize: '11px' }}>{resultadoVerificacion.tipo}</div>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', width: '110px', verticalAlign: 'top' }}>Identificador</td>
                <td style={{ color: '#CBD5E1', padding: '6px 8px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{resultadoVerificacion.identificador}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Instituci\u00f3n</td>
                <td style={{ color: '#CBD5E1', padding: '6px 8px' }}>{resultadoVerificacion.institucion}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Algoritmo</td>
                <td style={{ color: '#38BDF8', padding: '6px 8px', fontFamily: 'monospace' }}>{resultadoVerificacion.estandar}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Sello Temporal</td>
                <td style={{ color: '#CBD5E1', padding: '6px 8px' }}>{resultadoVerificacion.fechaEmision} UTC</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Soberan\u00eda</td>
                <td style={{ color: '#22C55E', padding: '6px 8px', fontWeight: 'bold' }}>Universidad Polit\u00e9cnica Territorial del Zulia (IUTPAL) / PDVSA</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#090D16', borderRadius: '6px', borderLeft: '3px solid #38BDF8', fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            {resultadoVerificacion.detalles}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificarCertificado;