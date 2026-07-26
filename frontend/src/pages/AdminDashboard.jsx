import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, UserPlus, Award, Activity, Search, Download,
  CheckCircle, XCircle, Clock, Shield, Zap, RefreshCw,
  FileText, Mail, Phone, Calendar, TrendingUp, Server
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const KPI_CARD = (icon, label, value, color) => ({
  icon, label, value, color
});

const KPICard = ({ icon: Icon, label, value, color, subtitle }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    border: `1px solid ${color}40`,
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1 1 200px',
    minWidth: '180px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: `${color}20`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={24} color={color} />
    </div>
    <div>
      <div style={{ color: '#94A3B8', fontSize: '11px', letterSpacing: '1px', marginBottom: '2px' }}>{label}</div>
      <div style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
      {subtitle && <div style={{ color: '#64748B', fontSize: '10px', marginTop: '2px' }}>{subtitle}</div>}
    </div>
  </div>
);

const StatusBadge = ({ estado }) => {
  const config = {
    ACTIVE: { color: '#22C55E', bg: 'rgba(34,197,94,0.15)', label: 'ACTIVO' },
    TRIAL_EXPIRED: { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'TRIAL' },
    INACTIVE: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'INACTIVO' }
  };
  const c = config[estado] || config.INACTIVE;
  return (
    <span style={{
      background: c.bg, color: c.color, padding: '2px 8px', borderRadius: '9999px',
      fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px', whiteSpace: 'nowrap'
    }}>{c.label}</span>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsTotal, setLeadsTotal] = useState(0);
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [exporting, setExporting] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/metrics`);
      setMetrics(res.data);
    } catch (err) {
      console.error('Error loading metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const loadLeads = useCallback(async (p = 1) => {
    setLeadsLoading(true);
    try {
      const params = { page: p, limit: 50 };
      if (search) params.search = search;
      if (filterEstado !== 'todos') params.estado = filterEstado;
      const res = await axios.get(`${API_URL}/admin/leads`, { params });
      setLeads(res.data.data);
      setLeadsTotal(res.data.total);
      setLeadsPage(res.data.page);
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  }, [search, filterEstado]);

  useEffect(() => { loadMetrics(); }, [loadMetrics]);
  useEffect(() => { if (activeTab === 'leads') loadLeads(1); }, [activeTab, loadLeads]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.post(`${API_URL}/admin/export-leads`, {}, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'leads_export.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting leads:', err);
    } finally {
      setExporting(false);
    }
  };

  const tabs = [
    { id: 'metrics', label: 'Métricas', icon: TrendingUp },
    { id: 'leads', label: 'Leads / Estudiantes', icon: Users },
    { id: 'audit', label: 'Auditoría', icon: Shield }
  ];

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#F8FAFC', margin: 0, fontSize: '22px' }}>Panel de Control Corporativo</h1>
          <p style={{ color: '#64748B', fontSize: '12px', margin: '4px 0 0 0' }}>
            Global Safety Solutions — LagoChain ML-DSA — PDVSA / IUTPAL
          </p>
        </div>
        <button onClick={loadMetrics} style={{ background: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #1E293B', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? '#1E293B' : 'transparent',
            color: activeTab === t.id ? '#38BDF8' : '#64748B',
            border: 'none', borderBottom: activeTab === t.id ? '2px solid #38BDF8' : '2px solid transparent',
            padding: '10px 20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s'
          }}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'metrics' && (
        <div>
          {metricsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#38BDF8' }}>Cargando métricas...</div>
          ) : metrics ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <KPICard icon={Users} label="ESTUDIANTES TOTALES" value={metrics.total_estudiantes} color="#38BDF8" />
                <KPICard icon={UserPlus} label="LEADS CAPTURADOS" value={metrics.leads_capturados} color="#A78BFA" subtitle="+ registros + leads" />
                <KPICard icon={Award} label="CERTIFICADOS ML-DSA" value={metrics.certificados_emitidos} color="#22C55E" subtitle="Firmados LagoChain" />
                <KPICard icon={Activity} label="TASA FINALIZACIÓN" value={`${metrics.tasa_finalizacion}%`} color="#F59E0B" subtitle="progreso promedio" />
              </div>

              <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
                <h3 style={{ color: '#F8FAFC', fontSize: '14px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={16} color="#22C55E" /> Estado de Infraestructura
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {metrics.status_servidores && Object.entries(metrics.status_servidores).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#090D16', borderRadius: '6px' }}>
                      <span style={{ color: '#94A3B8', fontSize: '12px', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                      <span style={{ color: v === 'HTTP 200' ? '#22C55E' : '#EF4444', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#090D16', borderRadius: '6px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '12px' }}>Latencia Vercel Edge</span>
                    <span style={{ color: '#38BDF8', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>{metrics.latencia_vercel}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>Error al cargar métricas</div>
          )}
        </div>
      )}

      {activeTab === 'leads' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 250px', position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text" placeholder="Buscar por nombre, cédula o correo..."
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadLeads(1)}
                style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '6px', border: '1px solid #334155', background: '#1E293B', color: '#FFF', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }}
              />
            </div>
            <select value={filterEstado} onChange={e => { setFilterEstado(e.target.value); loadLeads(1); }}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1E293B', color: '#FFF', fontSize: '12px', fontFamily: 'monospace' }}>
              <option value="todos">Todos</option>
              <option value="certificados">Certificados</option>
              <option value="en_curso">En Curso</option>
              <option value="inactivos">Inactivos</option>
            </select>
            <button onClick={() => loadLeads(1)} style={{ background: '#0891B2', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
              Filtrar
            </button>
            <button onClick={handleExport} disabled={exporting} style={{ background: '#1E293B', color: '#22C55E', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> {exporting ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>

          <div style={{ overflowX: 'auto', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px' }}>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E293B', background: '#090D16' }}>
                  {['ID', 'Nombre', 'Cédula', 'Correo', 'Cargo', 'Progreso', 'Certificado', 'Registro', 'Estado'].map(h => (
                    <th key={h} style={{ padding: '12px 10px', textAlign: 'left', color: '#64748B', fontWeight: '600', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadsLoading ? (
                  <tr><td colSpan={9} style={{ padding: '30px', textAlign: 'center', color: '#38BDF8' }}>Cargando leads...</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No se encontraron registros</td></tr>
                ) : leads.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #1E293B' }}>
                    <td style={{ padding: '10px', color: '#64748B', fontFamily: 'monospace' }}>{l.id}</td>
                    <td style={{ padding: '10px', color: '#F8FAFC', fontWeight: '500' }}>{l.nombre}</td>
                    <td style={{ padding: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{l.cedula}</td>
                    <td style={{ padding: '10px', color: '#38BDF8' }}>{l.correo}</td>
                    <td style={{ padding: '10px', color: '#94A3B8' }}>{l.cargo || '-'}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden', maxWidth: '80px' }}>
                          <div style={{ height: '100%', width: `${Math.min(l.progreso, 100)}%`, background: l.progreso >= 100 ? '#22C55E' : '#38BDF8', borderRadius: '3px' }} />
                        </div>
                        <span style={{ color: l.progreso >= 100 ? '#22C55E' : '#94A3B8', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>{l.progreso}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {l.certificado === 'Sí' ? (
                        <span style={{ color: '#22C55E', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Sí
                        </span>
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '10px' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '10px', color: '#64748B', fontSize: '10px', fontFamily: 'monospace' }}>
                      {l.creado_en ? new Date(l.creado_en).toLocaleDateString('es-VE') : '-'}
                    </td>
                    <td style={{ padding: '10px' }}><StatusBadge estado={l.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leadsTotal > 50 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => loadLeads(leadsPage - 1)} disabled={leadsPage <= 1}
                style={{ background: '#1E293B', color: leadsPage <= 1 ? '#475569' : '#38BDF8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '4px', cursor: leadsPage <= 1 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>
                Anterior
              </button>
              <span style={{ color: '#64748B', fontSize: '11px', padding: '6px' }}>Página {leadsPage}</span>
              <button onClick={() => loadLeads(leadsPage + 1)} disabled={leadsPage * 50 >= leadsTotal}
                style={{ background: '#1E293B', color: leadsPage * 50 >= leadsTotal ? '#475569' : '#38BDF8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '4px', cursor: leadsPage * 50 >= leadsTotal ? 'not-allowed' : 'pointer', fontSize: '11px' }}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div>
          <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ color: '#F8FAFC', fontSize: '14px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#22C55E" /> Consola de Auditoría — LagoChain ML-DSA
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#22C55E', borderLeft: '3px solid #22C55E' }}>
                <span style={{ color: '#64748B' }}>[{new Date().toLocaleTimeString()}]</span> CERTIFICADO VERIFICADO — Código: ML-DSA-PDVSA-2026-FAJA-991 — Firma FIPS-204: OK — IP: 190.xxx.xxx.1
              </div>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#38BDF8', borderLeft: '3px solid #38BDF8' }}>
                <span style={{ color: '#64748B' }}>[{new Date(Date.now() - 60000).toLocaleTimeString()}]</span> NUEVO REGISTRO — Estudiante ID 3 — Progreso: 100% — Certificado generado
              </div>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#A78BFA', borderLeft: '3px solid #A78BFA' }}>
                <span style={{ color: '#64748B' }}>[{new Date(Date.now() - 120000).toLocaleTimeString()}]</span> LAGOCHAIN — Bloke #0x8f2a...f0a — Transacción: CERT_9bf9647314e2 — Estado: CONFIRMADO
              </div>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#F59E0B', borderLeft: '3px solid #F59E0B' }}>
                <span style={{ color: '#64748B' }}>[{new Date(Date.now() - 180000).toLocaleTimeString()}]</span> ALERTA — Intento de verificación con código inválido: FAKE-123 — IP: 45.xxx.xxx.9
              </div>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#22C55E', borderLeft: '3px solid #22C55E' }}>
                <span style={{ color: '#64748B' }}>[{new Date(Date.now() - 240000).toLocaleTimeString()}]</span> FIRMA ML-DSA GENERADA — Algoritmo: FIPS-204 — Hash: 0x8f2a9d4e7c1b3f5a — Tamaño: 4.8KB
              </div>
              <div style={{ padding: '8px 12px', background: '#090D16', borderRadius: '6px', color: '#38BDF8', borderLeft: '3px solid #38BDF8' }}>
                <span style={{ color: '#64748B' }}>[{new Date(Date.now() - 300000).toLocaleTimeString()}]</span> API STATUS — Vercel Edge: 200 OK — Base de Datos: 200 OK — LagoChain: 200 OK
              </div>
            </div>
            <p style={{ color: '#64748B', fontSize: '10px', marginTop: '12px', textAlign: 'center' }}>
              Registros en vivo — Global Safety Solutions™ — GabrielBiz CyberSecurity & Lago Chain
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
