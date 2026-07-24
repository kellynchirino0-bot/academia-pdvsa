import React, { useState, useEffect } from 'react';
import { Download, Users, Award, TrendingUp, BarChart3, FileText } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const AdminConsolidatedReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadReport(); }, []);

  const loadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/admin/consolidado`);
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('landscape');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(10, 35, 66);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setFillColor(212, 168, 67);
      doc.rect(0, 35, pageWidth, 3, 'F');

      doc.setTextColor(212, 168, 67);
      doc.setFontSize(16);
      doc.text('REPORTE CONSOLIDADO - ACADEMIA VIRTUAL NASSER GROUP', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('PDVSA - Matriz de Talento y Cumplimiento de Capacitacion', pageWidth / 2, 23, { align: 'center' });
      doc.text(`Generado: ${new Date().toLocaleString('es-VE')}`, pageWidth / 2, 30, { align: 'center' });

      // Summary
      doc.setTextColor(0, 0, 0);
      let y = 45;
      doc.setFillColor(240, 240, 240);
      doc.rect(10, y - 5, pageWidth - 20, 20, 'F');
      doc.setFontSize(9);
      doc.text(`Total Estudiantes: ${data.resumen.total_estudiantes}`, 15, y + 5);
      doc.text(`Activos: ${data.resumen.activos}`, 80, y + 5);
      doc.text(`Con Certificado: ${data.resumen.con_certificado}`, 130, y + 5);
      doc.text(`Tasa Certificacion: ${data.resumen.tasa_certificacion}%`, 195, y + 5);
      doc.text(`Promedio General: ${data.resumen.promedio_general}%`, 260, y + 5);
      y += 25;

      // Table Header
      doc.setFillColor(10, 35, 66);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      const cols = [12, 50, 105, 150, 180, 205, 230, 255, 280];
      const headers = ['ID', 'NOMBRE', 'EMAIL', 'LECCIONES', 'PROGRESO', 'PROMEDIO', 'CERTIFICADO', 'ESTADO', 'TRIAL FIN'];
      headers.forEach((h, i) => doc.text(h, cols[i], y + 3));
      y += 8;

      // Table Rows
      doc.setTextColor(0, 0, 0);
      data.matriz_talento.forEach((est, idx) => {
        if (y > 190) { doc.addPage(); y = 20; }
        doc.setFillColor(idx % 2 === 0 ? 245 : 255, idx % 2 === 0 ? 245 : 255, idx % 2 === 0 ? 245 : 255);
        doc.rect(10, y - 4, pageWidth - 20, 7, 'F');
        doc.setFontSize(7);
        doc.text(String(est.id), cols[0], y + 1);
        doc.text((est.nombre || '').substring(0, 22), cols[1], y + 1);
        doc.text((est.correo || '').substring(0, 22), cols[2], y + 1);
        doc.text(`${est.lecciones_completadas || 0}/${est.total_lecciones || 0}`, cols[3], y + 1);
        doc.text(`${est.porcentaje_avance || 0}%`, cols[4], y + 1);
        doc.text(`${est.promedio || 0}%`, cols[5], y + 1);
        doc.text(est.certificado || 'Pendiente', cols[6], y + 1);
        doc.text(est.estado || 'N/A', cols[7], y + 1);
        doc.text(est.trial_fin ? new Date(est.trial_fin).toLocaleDateString('es-VE') : 'N/A', cols[8], y + 1);
        y += 8;
      });

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(128, 128, 128);
      doc.text('Academia Virtual Nasser Group PDVSA - Documento Confidencial', pageWidth / 2, 200, { align: 'center' });

      doc.save(`reporte_consolidado_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF error:', error);
      alert('Error al generar PDF');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!data) return <div className="card"><div className="empty-state"><h3>Error al cargar reporte</h3></div></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={24} /> Reporte Consolidado Gerencia
            </h1>
            <p>Matriz de talento y cumplimiento de capacitacion PDVSA</p>
          </div>
          <button className="btn-primary" onClick={generatePDF} disabled={generating} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> {generating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-icon"><Users size={24} /></div><h3>Total Estudiantes</h3><div className="stat-value">{data.resumen.total_estudiantes}</div></div>
        <div className="stat-card green"><div className="stat-icon"><Users size={24} /></div><h3>Activos</h3><div className="stat-value">{data.resumen.activos}</div></div>
        <div className="stat-card gold"><div className="stat-icon"><Award size={24} /></div><h3>Con Certificado</h3><div className="stat-value">{data.resumen.con_certificado}</div></div>
        <div className="stat-card" style={{ borderTopColor: '#8b5cf6' }}><div className="stat-icon"><TrendingUp size={24} color="#8b5cf6" /></div><h3>Tasa Certificacion</h3><div className="stat-value">{data.resumen.tasa_certificacion}%</div></div>
        <div className="stat-card teal"><div className="stat-icon"><BarChart3 size={24} /></div><h3>Promedio General</h3><div className="stat-value">{data.resumen.promedio_general}%</div></div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Matriz de Talento ({data.matriz_talento.length} estudiantes)</h2></div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Cedula</th><th>Empresa</th><th>Progreso</th><th>Promedio</th><th>Certificado</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {(data.matriz_talento || []).map(est => (
                <tr key={est.id}>
                  <td style={{ fontWeight: '500' }}>{est.nombre}</td>
                  <td>{est.cedula}</td>
                  <td style={{ fontSize: '0.85rem' }}>{est.empresa}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ height: '6px', width: '60px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${est.porcentaje_avance}%`, background: est.porcentaje_avance >= 70 ? '#10b981' : '#f59e0b', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{est.porcentaje_avance}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{est.promedio}%</td>
                  <td>{est.certificado ? <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{est.certificado}</span> : <span style={{ color: '#94a3b8' }}>Pendiente</span>}</td>
                  <td><span className="badge" style={{ background: est.estado === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: est.estado === 'ACTIVE' ? '#10b981' : '#f59e0b' }}>{est.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminConsolidatedReport;
