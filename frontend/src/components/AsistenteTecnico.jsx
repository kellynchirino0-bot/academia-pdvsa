import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Shield, ExternalLink, BookOpen, RotateCcw } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AsistenteTecnico = () => {
  const [consulta, setConsulta] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);

  const preguntasSugeridas = [
    '¿Cada cuánto inspeccionar una bomba centrífuga?',
    '¿Qué dice la COVENIN 3049-93 sobre mantenimiento?',
    'Protocolo HSE ante derrame en Lago de Maracaibo',
    '¿Cómo documentar una orden de trabajo según PDVSA SI-1?',
    'Normas para válvulas de seguridad en refinería'
  ];

  const handleConsultar = async (texto) => {
    const q = texto || consulta;
    if (!q || q.trim().length < 3) return;
    setLoading(true); setError(null);
    try {
      const res = await axios.post(`${API_URL}/ai/copilot`, { consulta: q });
      setRespuesta(res.data);
      setHistorial(prev => [...prev, { consulta: q, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  };

  const containerStyle = {
    background: '#1E293B', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '12px', overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1A2440)', padding: '14px 16px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={16} color="#38BDF8" />
        </div>
        <div>
          <div style={{ color: '#F1F5F9', fontWeight: '700', fontSize: '13px' }}>Asistente Técnico Senior PDVSA</div>
          <div style={{ color: '#64748B', fontSize: '10px' }}>RAG — COVENIN / PDVSA SI / HSE</div>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {historial.length === 0 && !respuesta && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#94A3B8', fontSize: '11px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={12} /> Consultas sugeridas:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {preguntasSugeridas.map((p, i) => (
                <button key={i} onClick={() => handleConsultar(p)}
                  style={{
                    padding: '6px 10px', background: '#0F172A', border: '1px solid #334155',
                    borderRadius: '6px', color: '#94A3B8', cursor: 'pointer', fontSize: '10px',
                    transition: 'all 0.2s'
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {respuesta && (
          <div style={{ marginBottom: '12px', maxHeight: '320px', overflowY: 'auto' }}>
            <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '11px', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#E2E8F0' }}>
              {respuesta.respuesta}
            </div>
            {respuesta.normativas_relevantes?.length > 0 && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {respuesta.normativas_relevantes.map((n, i) => (
                  <span key={i} style={{ padding: '3px 8px', background: 'rgba(139,92,246,0.1)', borderRadius: '4px', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA', fontSize: '9px', fontWeight: '600' }}>
                    {n.ref}
                  </span>
                ))}
              </div>
            )}
            <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(139,92,246,0.06)', borderRadius: '6px', border: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={10} color="#A78BFA" />
              <span style={{ color: '#A78BFA', fontSize: '9px' }}>Powered by GabrielBiz Galaxy | LagoChain ML-DSA (FIPS 204)</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#EF4444', fontSize: '11px', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px' }}>
          <input value={consulta} onChange={e => setConsulta(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConsultar()}
            placeholder="Escriba su consulta técnica..."
            style={{
              flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155',
              background: '#0F172A', color: '#F1F5F9', fontSize: '12px', outline: 'none'
            }} />
          <button onClick={() => handleConsultar()} disabled={loading || consulta.length < 3}
            style={{
              padding: '10px 14px', borderRadius: '8px', border: 'none',
              background: loading ? '#334155' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: '#FFF', cursor: (loading || consulta.length < 3) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center'
            }}>
            <Send size={16} />
          </button>
          <button onClick={() => { setRespuesta(null); setError(null); setConsulta(''); }}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0F172A', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenteTecnico;
