import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, QrCode, DollarSign, CheckCircle, Copy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';
const BINANCE_PAY_ID = 'NASSER_GROUP_BINANCE_PAY_ID_2026';
const BEP20_ADDRESS = '0x8f2a9d4e7c1b3f5a6b8c9d0e1f2a3b4c5d6e7f8a';
const ZELLE_EMAIL = 'pagos@nassergroup.com';
const ZELLE_TITULAR = 'Nasser Group LLC';
const BANCO = 'Banco de Venezuela';
const BANCO_RIF = 'J-41234567-8';
const BANCO_TELEFONO = '0412-1234567';

const PlanCard = ({ titulo, precio, descripcion, selected, onSelect, features }) => (
  <div onClick={onSelect} style={{
    border: selected ? '2px solid #22C55E' : '1px solid #334155',
    borderRadius: '10px', padding: '20px', cursor: 'pointer',
    background: selected ? 'rgba(34,197,94,0.05)' : '#0F172A',
    transition: '0.2s', flex: '1 1 280px', maxWidth: '320px'
  }}>
    <h3 style={{ color: '#F8FAFC', margin: '0 0 4px 0', fontSize: '16px' }}>{titulo}</h3>
    <div style={{ color: '#22C55E', fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>${precio} USD</div>
    <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '12px' }}>{descripcion}</p>
    {features && (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#CBD5E1' }}>
        {features.map((f, i) => <li key={i} style={{ padding: '3px 0' }}>✓ {f}</li>)}
      </ul>
    )}
  </div>
);

const CheckoutPagos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState('vip_diplomado');
  const [metodo, setMetodo] = useState('');
  const [referencia, setReferencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState('');

  const copiar = (texto, label) => { navigator.clipboard.writeText(texto); setCopiado(label); setTimeout(() => setCopiado(''), 2000); };

  const planes = [
    { id: 'vip_diplomado', titulo: 'Diplomado VIP', precio: 450, descripcion: 'Acceso completo a diplomados avanzados, simuladores IA y certificación ML-DSA', features: ['Diplomados avanzados IA/IO', 'Simulador texto, imágenes, video', 'Certificación ML-DSA LagoChain', 'Soporte prioritario 24/7'] },
    { id: 'b2b_enterprise', titulo: 'Plan B2B Enterprise', precio: 2500, descripcion: 'Consultoría empresarial, métricas B2B, integración CRM, dashboard ejecutivo', features: ['Todo lo del Plan VIP', 'Dashboard B2B & ROI', 'Integración CRM (HubSpot)', 'Calculadora de impacto financiero', 'Consultoría personalizada', 'Exportación de leads CSV'] },
    { id: 'sim_petroleo', titulo: 'Petróleo — Bombeo IA', precio: 85, descripcion: 'Simulador 3D de elevación artificial con optimización Simplex', features: ['Escena 3D pozo + balancín', 'Control frecuencia variador', 'Cálculo producción y ahorro', 'Manómetro y flujo multifásico'] },
    { id: 'sim_calderas', titulo: 'Calderas — LIMS 3D', precio: 75, descripcion: 'Simulador 3D de caldera industrial con protocolo LIMS', features: ['Vista corte 3D caldera', 'Control nivel agua y presión', 'Alertas de seguridad críticas', 'Protocolo LIMS interactivo'] },
    { id: 'sim_plc', titulo: 'PLC / SCADA Industrial', precio: 95, descripcion: 'Simulador 3D de PLC Siemens S7-1200 con HMI virtual', features: ['Panel PLC 3D con gabinete', 'HMI virtual en tiempo real', 'Señal 4-20mA y setpoints', 'Multímetro y terminales'] },
    { id: 'sim_soldadura', titulo: 'Soldadura AWS + NDT', precio: 90, descripcion: 'Simulador 3D de soldadura AWS D1.1 con inspección NDT', features: ['Junta tubería 3D biselada', 'Control ángulo, arco, velocidad', 'Calidad de cordón en tiempo real', 'NDT: ultrasonido + partículas'] }
  ];

  const handleSubmit = async () => {
    if (!metodo || !referencia) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/payments/reportar`, { metodo, referencia, plan_solicitado: plan });
      setResultado(res.data);
    } catch (err) {
      setResultado({ exito: false, error: err.response?.data?.error || 'Error al reportar pago' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace", maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
        <ArrowLeft size={14} /> Volver
      </button>

      <h1 style={{ color: '#F8FAFC', fontSize: '24px', marginBottom: '4px' }}>Suscripción y Pagos</h1>
      <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '24px' }}>Seleccione su plan y método de pago — Binance Pay, Zelle o Pago Móvil</p>

      {user?.plan_suscripcion && user.plan_suscripcion !== 'gratuito' && (
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22C55E', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#22C55E' }}>
          <CheckCircle size={16} /> Plan actual: <strong>{user.plan_suscripcion}</strong> — Ya tienes acceso a contenido premium
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {planes.map(p => (
          <PlanCard key={p.id} titulo={p.titulo} precio={p.precio} descripcion={p.descripcion}
            features={p.features} selected={plan === p.id} onSelect={() => setPlan(p.id)} />
        ))}
      </div>

      <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '24px' }}>
        <h3 style={{ color: '#F8FAFC', fontSize: '14px', margin: '0 0 16px 0' }}>Seleccione Método de Pago</h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'binance', label: 'Binance Pay', icon: QrCode, color: '#FBBF24' },
            { id: 'zelle', label: 'Zelle', icon: DollarSign, color: '#22C55E' },
            { id: 'pago_movil', label: 'Pago Móvil', icon: CreditCard, color: '#38BDF8' }
          ].map(m => (
            <button key={m.id} onClick={() => setMetodo(m.id)}
              style={{ flex: '1 1 150px', padding: '14px', background: metodo === m.id ? `${m.color}20` : '#1E293B', border: metodo === m.id ? `2px solid ${m.color}` : '1px solid #334155', borderRadius: '8px', cursor: 'pointer', color: metodo === m.id ? m.color : '#94A3B8', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', transition: '0.2s' }}>
              <m.icon size={18} /> {m.label}
            </button>
          ))}
        </div>

        {metodo === 'binance' && (
          <div style={{ background: '#090D16', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#FBBF24', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Binance Pay — USDT (BEP-20)</p>
            <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.8' }}>
              <div>ID de Pagador: <span style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>{BINANCE_PAY_ID}</span>
                <button onClick={() => copiar(BINANCE_PAY_ID, 'binance')} style={{ background: 'none', border: 'none', color: copiado === 'binance' ? '#22C55E' : '#38BDF8', cursor: 'pointer', fontSize: '11px', marginLeft: '8px' }}>
                  <Copy size={12} /> {copiado === 'binance' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div>Dirección BEP-20: <span style={{ color: '#F8FAFC', fontFamily: 'monospace', wordBreak: 'break-all' }}>{BEP20_ADDRESS}</span>
                <button onClick={() => copiar(BEP20_ADDRESS, 'bep20')} style={{ background: 'none', border: 'none', color: copiado === 'bep20' ? '#22C55E' : '#38BDF8', cursor: 'pointer', fontSize: '11px', marginLeft: '8px' }}>
                  <Copy size={12} /> {copiado === 'bep20' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div style={{ marginTop: '8px', color: '#64748B', fontSize: '10px' }}>Envíe el monto exacto en USDT (BEP-20) e ingrese el Order ID / TXID de Binance</div>
            </div>
          </div>
        )}

        {metodo === 'zelle' && (
          <div style={{ background: '#090D16', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Zelle — Transferencia Bancaria</p>
            <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.8' }}>
              <div>Correo Zelle: <span style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>{ZELLE_EMAIL}</span>
                <button onClick={() => copiar(ZELLE_EMAIL, 'zelle')} style={{ background: 'none', border: 'none', color: copiado === 'zelle' ? '#22C55E' : '#38BDF8', cursor: 'pointer', fontSize: '11px', marginLeft: '8px' }}>
                  <Copy size={12} /> {copiado === 'zelle' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div>Titular: <span style={{ color: '#F8FAFC' }}>{ZELLE_TITULAR}</span></div>
              <div style={{ marginTop: '8px', color: '#F59E0B', fontSize: '10px' }}>Nota: Incluya su nombre completo y correo en la referencia Zelle.</div>
            </div>
          </div>
        )}

        {metodo === 'pago_movil' && (
          <div style={{ background: '#090D16', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Pago Móvil / Transferencia Local</p>
            <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.8' }}>
              <div>Banco: <span style={{ color: '#F8FAFC' }}>{BANCO}</span></div>
              <div>RIF: <span style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>{BANCO_RIF}</span></div>
              <div>Teléfono: <span style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>{BANCO_TELEFONO}</span></div>
            </div>
          </div>
        )}

        {metodo && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94A3B8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Número de Referencia / ID de Transacción</label>
            <input type="text" placeholder="Ingrese el código de referencia..." value={referencia} onChange={e => setReferencia(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1E293B', color: '#FFF', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
          </div>
        )}

        {metodo && (
          <button onClick={handleSubmit} disabled={!referencia || loading}
            style={{ width: '100%', padding: '14px', background: !referencia || loading ? '#334155' : 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: !referencia || loading ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
            {loading ? 'Reportando pago...' : `Reportar Pago — $${planes.find(p => p.id === plan)?.precio} USD`}
          </button>
        )}

        {resultado && (
          <div style={{ marginTop: '16px', padding: '12px', background: resultado.exito ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${resultado.exito ? '#22C55E' : '#EF4444'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: resultado.exito ? '#22C55E' : '#EF4444' }}>
            {resultado.exito ? <CheckCircle size={16} /> : null} {resultado.mensaje || resultado.error || 'Error al procesar'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPagos;
