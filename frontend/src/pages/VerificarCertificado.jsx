import React, { useState } from 'react';
import API from '../services/api';

export const VerificarCertificado = () => {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const { data } = await API.get(`/certificados/verificar?codigo=${encodeURIComponent(codigo)}`);
      if (data.encontrado) {
        setResultado(data.certificado);
      }
    } catch (err) {
      setError('C\u00f3digo no registrado en la blockchain inmutable LagoChain ML-DSA.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <span style={{ backgroundColor: '#10B981', color: '#0F172A', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
          VERIFICACI\u00d3N FORENSE BLOCKCHAIN
        </span>
        <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '26px' }}>
          Trazabilidad Criptogr\u00e1fica PDVSA — IUTPAL
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '13px' }}>
          Firma Criptogr\u00e1fica Post-Cu\u00e1ntica ML-DSA | GabrielBiz Galaxy & Nasser Group
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
        <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ingrese c\u00f3digo de certificado (ej: CERT-PDVSA-2026-001) o c\u00e9dula..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF' }}
          />
          <button type="submit" style={{ backgroundColor: '#38BDF8', color: '#0F172A', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {cargando ? 'Consultando...' : 'Validar'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', padding: '15px', borderRadius: '8px', color: '#EF4444', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {resultado && (
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#1E293B', borderRadius: '12px', border: '2px solid #22C55E', padding: '25px' }}>
          <h3 style={{ color: '#22C55E', margin: '0 0 10px 0' }}>CERTIFICADO AUT\u00c9NTICO</h3>
          <h2 style={{ color: '#FFF', margin: '0 0 5px 0' }}>{resultado.estudiante}</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 15px 0' }}>ID / C\u00e9dula: {resultado.cedula}</p>
          <p style={{ color: '#CBD5E1', fontSize: '14px' }}><strong>Programa:</strong> {resultado.curso}</p>
          <p style={{ color: '#CBD5E1', fontSize: '14px' }}><strong>Aval:</strong> {resultado.institucion}</p>
          <div style={{ backgroundColor: '#090D16', padding: '10px', borderRadius: '6px', marginTop: '15px', borderLeft: '3px solid #38BDF8' }}>
            <span style={{ fontSize: '10px', color: '#38BDF8', display: 'block' }}>HASH LAGOCHAIN ML-DSA (POST-CU\u00c1NTICO):</span>
            <code style={{ fontSize: '11px', color: '#94A3B8', wordBreak: 'break-all' }}>{resultado.hashMLDSA}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificarCertificado;