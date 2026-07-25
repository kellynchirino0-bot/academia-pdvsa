import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

export const VerificarCertificado = () => {
  const [searchParams] = useSearchParams();
  const [codigoInput, setCodigoInput] = useState('');
  const [resultadoVerificacion, setResultadoVerificacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [modoEscaneo, setModoEscaneo] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setCodigoInput(idFromUrl);
      setModoEscaneo(true);
      ejecutarAuditoria(idFromUrl);
    }
  }, [searchParams]);

  const ejecutarAuditoria = async (codigo) => {
    const query = (codigo || codigoInput).trim();
    if (!query) return;

    setCargando(true);
    setError(null);
    setResultadoVerificacion(null);

    try {
      const response = await API.get(`/certificates/verify/${query}`);
      const data = response.data;
      if (data.valido) {
        setResultadoVerificacion({
          valido: true,
          tipo: 'Certificación de Competencia IA/IO',
          identificador: query.toUpperCase(),
          institucion: 'PDVSA - IUTPAL / Nasser Group',
          estandar: 'Global Safety Solutions & LagoChain ML-DSA',
          fechaEmision: data.certificado.fecha_emision ? new Date(data.certificado.fecha_emision).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
          detalles: `Participante: ${data.certificado.nombre_estudiante}. Curso: ${data.certificado.curso}. Calificación: ${data.certificado.calificacion_final}%. Avalado internacionalmente por Global Safety Solutions.`,
          certificado: data.certificado
        });
      } else {
        setError('Certificado no encontrado o no válido');
      }
    } catch (err) {
      console.error('Error en verificación:', err);
      setError('Error de conexión con el servicio de verificación. Verifique su conexión a internet e intente nuevamente.');
    }
    setCargando(false);
  };

  const probarDemo = (tipo) => {
    const demoCode = tipo === 'cert' ? 'CERT_mariagarcia2026' : 'ML-DSA-PDVSA-2026-FAJA-991';
    setCodigoInput(demoCode);
    setModoEscaneo(false);
    ejecutarAuditoria(demoCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModoEscaneo(false);
    ejecutarAuditoria();
  };

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Courier New', 'Segoe UI', monospace" }}>
      <div style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <span style={{ backgroundColor: '#10B981', color: '#0F172A', fontSize: '10px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {modoEscaneo ? 'QR SCAN - VERIFICACION EN VIVO' : 'CENTRO DE AUDITORIA FORENSE CRIPTOGRAFICA'}
        </span>
        <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '26px' }}>
          Verificación y Trazabilidad ML-DSA
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '12px' }}>
          Global Safety Solutions &bull; LagoChain Post-Quantum &bull; IUTPAL / PDVSA
        </p>
      </div>

      {modoEscaneo && (
        <div style={{ maxWidth: '640px', margin: '0 auto 24px auto', padding: '16px', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid #22C55E', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }}>📱</span>
          <strong style={{ color: '#22C55E' }}>Escaneo QR detectado</strong>
          <p style={{ color: '#94A3B8', fontSize: '12px', margin: '6px 0 0 0' }}>Verificando certificado ID: {codigoInput}</p>
        </div>
      )}

      <div style={{ maxWidth: '640px', margin: '0 auto 24px auto', textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => probarDemo('cert')} style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          Probar Certificado Ejemplo
        </button>
        <button onClick={() => probarDemo('decision')} style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          Probar Decision Simplex (+$1.96M)
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto 30px auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ingrese codigo de certificado o hash ML-DSA..."
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
          Escaneando registro en LagoChain ML-DSA y Global Safety Solutions...
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
            <span style={{ fontSize: '20px' }}>✅</span>
            <div>
              <div style={{ color: '#22C55E', fontWeight: 'bold', fontSize: '14px' }}>AUTENTICO / REGISTRO INMUTABLE</div>
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
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Institucion</td>
                <td style={{ color: '#CBD5E1', padding: '6px 8px' }}>{resultadoVerificacion.institucion}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Aval Internacional</td>
                <td style={{ color: '#00A859', padding: '6px 8px', fontWeight: 'bold' }}>Global Safety Solutions™</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Algoritmo</td>
                <td style={{ color: '#38BDF8', padding: '6px 8px', fontFamily: 'monospace' }}>{resultadoVerificacion.estandar}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Validador Infraestructura</td>
                <td style={{ color: '#38BDF8', padding: '6px 8px', fontSize: '12px', fontWeight: 600, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }}></span>
                  GabrielBiz CyberSecurity & Lago Chain
                </td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Sello Temporal</td>
                <td style={{ color: '#CBD5E1', padding: '6px 8px' }}>{resultadoVerificacion.fechaEmision}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', padding: '6px 8px', verticalAlign: 'top' }}>Soberanía</td>
                <td style={{ color: '#22C55E', padding: '6px 8px', fontWeight: 'bold' }}>IUTPAL / PDVSA / Global Safety Solutions</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#090D16', borderRadius: '6px', borderLeft: '3px solid #38BDF8', fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
            {resultadoVerificacion.detalles}
          </div>

          {resultadoVerificacion.certificado && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', display: 'inline-block' }}>
                <QRCodeSVG 
                  value={`${process.env.REACT_APP_VERIFY_BASE_URL || window.location.origin}/verificar-certificado?id=${resultadoVerificacion.certificado.codigo_verificacion}`}
                  size={120}
                  level="H"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificarCertificado;