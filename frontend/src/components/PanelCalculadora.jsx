import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, TrendingUp, GitBranch, Package, ChevronRight, RotateCcw } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const PanelCalculadora = () => {
  const [activeTab, setActiveTab] = useState('simplex');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  /* ---- Simplex State ---- */
  const [simplex, setSimplex] = useState({
    crudoA: { nombre: 'Merey-16', api: 16, costo: 45 },
    crudoB: { nombre: 'Mesa-30', api: 30, costo: 62 },
    target: { api_objetivo: 24, volumen_total: 10000 }
  });

  /* ---- CPM State ---- */
  const [cpmActividades, setCpmActividades] = useState([
    { id: 'A', nombre: 'Drenaje y limpieza', duracion: 3, predecesoras: [] },
    { id: 'B', nombre: 'Aislamiento eléctrico', duracion: 2, predecesoras: [] },
    { id: 'C', nombre: 'Desarme de equipamiento', duracion: 5, predecesoras: ['A', 'B'] },
    { id: 'D', nombre: 'Inspección visual', duracion: 2, predecesoras: ['C'] },
    { id: 'E', nombre: 'Reparación de corrosión', duracion: 7, predecesoras: ['D'] },
    { id: 'F', nombre: 'Pruebas hidrostáticas', duracion: 3, predecesoras: ['E'] },
    { id: 'G', nombre: 'Remontaje y alineación', duracion: 4, predecesoras: ['F'] },
    { id: 'H', nombre: 'Puesta en marcha', duracion: 2, predecesoras: ['G'] }
  ]);

  /* ---- EOQ State ---- */
  const [eoq, setEoq] = useState({
    demanda_anual: 120,
    costo_pedido: 150,
    costo_mantenimiento: 170,
    costo_unitario: 850,
    lead_time_dias: 15,
    nivel_servicio: 1.65,
    desviacion_demanda_diaria: 0.1
  });

  const handleSimplex = async () => {
    setLoading(true); setError(null); setResultado(null);
    try {
      const res = await axios.post(`${API_URL}/math/simplex-blend`, simplex);
      setResultado(res.data);
    } catch (err) { setError(err.response?.data?.error || err.message); }
    finally { setLoading(false); }
  };

  const handleCPM = async () => {
    setLoading(true); setError(null); setResultado(null);
    try {
      const res = await axios.post(`${API_URL}/math/cpm-pert`, { actividades: cpmActividades });
      setResultado(res.data);
    } catch (err) { setError(err.response?.data?.error || err.message); }
    finally { setLoading(false); }
  };

  const handleEOQ = async () => {
    setLoading(true); setError(null); setResultado(null);
    try {
      const res = await axios.post(`${API_URL}/math/eoq`, eoq);
      setResultado(res.data);
    } catch (err) { setError(err.response?.data?.error || err.message); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'simplex', label: 'Simplex Mezcla', icon: TrendingUp, color: '#3B82F6' },
    { id: 'cpm', label: 'CPM / PERT', icon: GitBranch, color: '#F59E0B' },
    { id: 'eoq', label: 'EOQ Inventario', icon: Package, color: '#22C55E' }
  ];

  const renderResultado = () => {
    if (!resultado || !resultado.exito) return null;
    return (
      <div style={{ marginTop: '16px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
        <div style={{ color: '#22C55E', fontWeight: 'bold', marginBottom: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calculator size={14} /> Resultado del Cálculo
        </div>
        {Object.entries(resultado).filter(([k]) => k !== 'exito').map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(51,65,85,0.3)' }}>
            <span style={{ color: '#94A3B8' }}>{key.replace(/_/g, ' ')}</span>
            <span style={{ color: '#F1F5F9', fontWeight: '600', textAlign: 'right' }}>
              {typeof val === 'object' ? JSON.stringify(val).substring(0, 60) + '...' : val}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSimplexForm = () => (
    <div>
      <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '14px' }}>
        Optimización lineal de mezcla de crudos usando el Método Simplex. Calcula la proporción óptima para alcanzar un API objetivo al menor costo.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div>
          <label style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Crudo A (Pesado)</label>
          <input value={simplex.crudoA.nombre} onChange={e => setSimplex({ ...simplex, crudoA: { ...simplex.crudoA, nombre: e.target.value } })}
            style={inputStyle} placeholder="Nombre" />
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <input type="number" value={simplex.crudoA.api} onChange={e => setSimplex({ ...simplex, crudoA: { ...simplex.crudoA, api: +e.target.value } })}
              style={{ ...inputStyle, width: '50%' }} placeholder="API" />
            <input type="number" value={simplex.crudoA.costo} onChange={e => setSimplex({ ...simplex, crudoA: { ...simplex.crudoA, costo: +e.target.value } })}
              style={{ ...inputStyle, width: '50%' }} placeholder="$/bbl" />
          </div>
        </div>
        <div>
          <label style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Crudo B (Liviano)</label>
          <input value={simplex.crudoB.nombre} onChange={e => setSimplex({ ...simplex, crudoB: { ...simplex.crudoB, nombre: e.target.value } })}
            style={inputStyle} placeholder="Nombre" />
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <input type="number" value={simplex.crudoB.api} onChange={e => setSimplex({ ...simplex, crudoB: { ...simplex.crudoB, api: +e.target.value } })}
              style={{ ...inputStyle, width: '50%' }} placeholder="API" />
            <input type="number" value={simplex.crudoB.costo} onChange={e => setSimplex({ ...simplex, crudoB: { ...simplex.crudoB, costo: +e.target.value } })}
              style={{ ...inputStyle, width: '50%' }} placeholder="$/bbl" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>API Objetivo</label>
          <input type="number" value={simplex.target.api_objetivo} onChange={e => setSimplex({ ...simplex, target: { ...simplex.target, api_objetivo: +e.target.value } })}
            style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Volumen Total (bbl)</label>
          <input type="number" value={simplex.target.volumen_total} onChange={e => setSimplex({ ...simplex, target: { ...simplex.target, volumen_total: +e.target.value } })}
            style={inputStyle} />
        </div>
      </div>
    </div>
  );

  const renderCPMForm = () => (
    <div>
      <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '14px' }}>
        Planificación de parada de mantenimiento con CPM/PERT. Identifica la ruta crítica, holguras y duración total del proyecto.
      </p>
      <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '10px' }}>
        {cpmActividades.map((act, i) => (
          <div key={act.id} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
            <span style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '12px', width: '24px' }}>{act.id}</span>
            <input value={act.nombre} onChange={e => { const a = [...cpmActividades]; a[i].nombre = e.target.value; setCpmActividades(a); }}
              style={{ ...inputStyle, flex: 2 }} />
            <input type="number" value={act.duracion} onChange={e => { const a = [...cpmActividades]; a[i].duracion = +e.target.value; setCpmActividades(a); }}
              style={{ ...inputStyle, width: '50px' }} placeholder="Días" />
            <input value={act.predecesoras.join(',')} onChange={e => { const a = [...cpmActividades]; a[i].predecesoras = e.target.value ? e.target.value.split(',').map(s => s.trim()) : []; setCpmActividades(a); }}
              style={{ ...inputStyle, flex: 1 }} placeholder="Preds" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderEOQForm = () => (
    <div>
      <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '14px' }}>
        Modelo de Lote Económico de Pedido (Wilson). Calcula la cantidad óptima de pedido, punto de reorden y costo total anual.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { key: 'demanda_anual', label: 'Demanda Anual (D)', placeholder: 'unidades/año' },
          { key: 'costo_pedido', label: 'Costo de Pedido (S)', placeholder: '$/pedido' },
          { key: 'costo_mantenimiento', label: 'Costo Mantenimiento (H)', placeholder: '$/unidad/año' },
          { key: 'costo_unitario', label: 'Costo Unitario (C)', placeholder: '$/unidad' },
          { key: 'lead_time_dias', label: 'Lead Time (L)', placeholder: 'días' },
          { key: 'nivel_servicio', label: 'Nivel Servicio (Z)', placeholder: '1.65 = 95%' }
        ].map(f => (
          <div key={f.key}>
            <label style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>{f.label}</label>
            <input type="number" step="0.01" value={eoq[f.key]} onChange={e => setEoq({ ...eoq, [f.key]: +e.target.value })}
              style={inputStyle} placeholder={f.placeholder} />
          </div>
        ))}
      </div>
    </div>
  );

  const handleExecute = () => {
    if (activeTab === 'simplex') handleSimplex();
    else if (activeTab === 'cpm') handleCPM();
    else handleEOQ();
  };

  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '18px', background: '#0F172A', padding: '4px', borderRadius: '8px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setResultado(null); setError(null); }}
            style={{
              flex: 1, padding: '10px', background: activeTab === t.id ? '#1E293B' : 'transparent',
              color: activeTab === t.id ? t.color : '#64748B', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: activeTab === t.id ? '700' : '500', fontSize: '11px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              border: activeTab === t.id ? `1px solid ${t.color}30` : '1px solid transparent',
              transition: 'all 0.2s'
            }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'simplex' && renderSimplexForm()}
      {activeTab === 'cpm' && renderCPMForm()}
      {activeTab === 'eoq' && renderEOQForm()}

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button onClick={handleExecute} disabled={loading}
          style={{
            flex: 1, padding: '12px', background: loading ? '#334155' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
          {loading ? 'Calculando...' : <><Calculator size={16} /> Ejecutar Cálculo</>}
        </button>
        <button onClick={() => { setResultado(null); setError(null); }}
          style={{ padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <RotateCcw size={16} />
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#EF4444', fontSize: '12px' }}>
          {error}
        </div>
      )}

      {renderResultado()}
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155',
  background: '#0F172A', color: '#F1F5F9', fontSize: '12px', fontFamily: 'monospace',
  boxSizing: 'border-box', outline: 'none', marginTop: '4px'
};

export default PanelCalculadora;
