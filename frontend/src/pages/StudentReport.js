import React, { useState, useEffect } from 'react';
import { Download, FileText, Award, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const StudentReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadReport(); }, []);

  const loadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/student/${user.id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header background
      doc.setFillColor(10, 35, 66);
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Gold accent line
      doc.setFillColor(212, 168, 67);
      doc.rect(0, 40, pageWidth, 3, 'F');

      // Title
      doc.setTextColor(212, 168, 67);
      doc.setFontSize(18);
      doc.text('ACADEMIA VIRTUAL NASSER GROUP', pageWidth / 2, 15, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE DE DESEMPEÑO ACADEMICO - PDVSA', pageWidth / 2, 23, { align: 'center' });

      doc.setFontSize(8);
      doc.text(`Generado: ${new Date().toLocaleString('es-VE')}`, pageWidth / 2, 30, { align: 'center' });
      doc.text(`Codigo Verificacion: ${data.estudiante.id}-${Date.now()}`, pageWidth / 2, 36, { align: 'center' });

      // Student Info
      let y = 52;
      doc.setFillColor(245, 245, 245);
      doc.rect(14, y - 4, pageWidth - 28, 28, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);

      doc.setFont(undefined, 'bold');
      doc.text('INFORMACION DEL ESTUDIANTE', 20, y + 2);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(`Nombre: ${data.estudiante.nombre_completo}`, 20, y + 10);
      doc.text(`Cedula: ${data.estudiante.cedula}`, 20, y + 16);
      doc.text(`Correo: ${data.estudiante.correo}`, 20, y + 22);

      doc.text(`Empresa: ${data.estudiante.empresa_filial || 'PDVSA'}`, 120, y + 10);
      doc.text(`Cargo: ${data.estudiante.cargo || 'N/A'}`, 120, y + 16);
      doc.text(`Estado: ${data.estudiante.estado || 'Activo'}`, 120, y + 22);

      y += 36;

      // Grades
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(10, 35, 66);
      doc.text('DESGLOSE DE CALIFICACIONES POR MODULO', 14, y);
      y += 8;

      // Table header
      doc.setFillColor(10, 35, 66);
      doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('MODULO', 20, y + 1);
      doc.text('LECCIONES', 100, y + 1);
      doc.text('PROMEDIO', 140, y + 1);
      doc.text('ESTADO', 170, y + 1);
      y += 10;

      doc.setTextColor(30, 41, 59);
      if (data.calificaciones && data.calificaciones.length > 0) {
        data.calificaciones.forEach((cal, idx) => {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
          doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
          doc.setFontSize(8);
          doc.text(cal.modulo || `Modulo ${idx + 1}`, 20, y + 1);
          doc.text(`${cal.lecciones_completadas || 0}/${cal.total_lecciones || 0}`, 105, y + 1);
          doc.text(`${cal.promedio || 0}%`, 145, y + 1);
          const passed = (cal.promedio || 0) >= 70;
          doc.setTextColor(passed ? 16 : 239, passed ? 185 : 68, passed ? 129 : 68);
          doc.text(passed ? 'Aprobado' : 'Pendiente', 175, y + 1);
          doc.setTextColor(30, 41, 59);
          y += 8;
        });
      } else {
        doc.text('Sin calificaciones registradas', 20, y + 4);
        y += 8;
      }

      y += 8;

      // Progress summary
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(10, 35, 66);
      doc.text('RESUMEN DE PROGRESO', 14, y);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(`Progreso Global: ${data.resumen?.porcentaje_avance || 0}%`, 20, y);
      doc.text(`Lecciones Completadas: ${data.resumen?.lecciones_completadas || 0}/${data.resumen?.total_lecciones || 0}`, 20, y + 7);
      doc.text(`Promedio General: ${data.resumen?.promedio_general || 0}%`, 20, y + 14);
      doc.text(`Evaluaciones Aprobadas: ${data.resumen?.evaluaciones_aprobadas || 0}/${data.resumen?.total_evaluaciones || 0}`, 120, y);
      doc.text(`Modulos Completados: ${data.resumen?.modulos_completados || 0}/4`, 120, y + 7);
      y += 24;

      // Trial status
      if (data.resumen?.trial) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(10, 35, 66);
        doc.text('ESTADO DE MEMBRESIA / TRIAL', 14, y);
        y += 8;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        const trial = data.resumen.trial;
        doc.text(`Estado: ${trial.estado || 'Activo'}`, 20, y);
        doc.text(`Dias Restantes: ${trial.dias_restantes || 'N/A'}`, 20, y + 7);
        doc.text(`Membresia Extendida: ${trial.membresia_extendida ? 'Si' : 'No'}`, 120, y);
        y += 18;
      }

      // Badges
      if (data.badges && data.badges.length > 0) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(10, 35, 66);
        doc.text('INSIGNIAS OBTENIDAS', 14, y);
        y += 8;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        data.badges.forEach(badge => {
          if (badge.otorgada) {
            doc.text(`${badge.icono} ${badge.nombre} - ${badge.descripcion}`, 20, y);
            y += 7;
          }
        });
        y += 8;
      }

      // Signatures
      if (y > 220) { doc.addPage(); y = 20; }
      y += 10;
      doc.setDrawColor(30, 41, 59);
      doc.line(20, y, 80, y);
      doc.line(130, y, 190, y);
      y += 5;
      doc.setFontSize(8);
      doc.text('Coordinador Academico', 35, y);
      doc.text('Instructor / Tutor', 150, y);

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(128, 128, 128);
      doc.text(
        'Academia Virtual Nasser Group PDVSA - Documento Generado Automaticamente',
        pageWidth / 2, 285, { align: 'center' }
      );

      doc.save(`reporte_desempeno_${user.id}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error al generar el PDF');
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
              <FileText size={24} /> Mi Reporte de Desempeño
            </h1>
            <p>Expediente academico completo y certificable</p>
          </div>
          <button
            className="btn-primary"
            onClick={generatePDF}
            disabled={generating}
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={18} /> {generating ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><BookOpen size={24} /></div>
          <h3>Progreso</h3>
          <div className="stat-value">{data.resumen?.porcentaje_avance || 0}%</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Award size={24} /></div>
          <h3>Promedio</h3>
          <div className="stat-value">{data.resumen?.promedio_general || 0}%</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon"><FileText size={24} /></div>
          <h3>Lecciones</h3>
          <div className="stat-value">{data.resumen?.lecciones_completadas || 0}/{data.resumen?.total_lecciones || 0}</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#8b5cf6' }}>
          <div className="stat-icon"><Clock size={24} color="#8b5cf6" /></div>
          <h3>Trial</h3>
          <div className="stat-value">{data.resumen?.trial?.dias_restantes || 'N/A'}d</div>
        </div>
      </div>

      {data.calificaciones && data.calificaciones.length > 0 && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><h2>Calificaciones por Modulo</h2></div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Modulo</th><th>Lecciones</th><th>Promedio</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {(data.calificaciones || []).map((cal, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '500' }}>{cal.modulo || `Modulo ${idx + 1}`}</td>
                    <td>{cal.lecciones_completadas || 0}/{cal.total_lecciones || 0}</td>
                    <td style={{ fontWeight: '600' }}>{cal.promedio || 0}%</td>
                    <td>
                      <span className="badge" style={{
                        background: (cal.promedio || 0) >= 70 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: (cal.promedio || 0) >= 70 ? '#10b981' : '#f59e0b'
                      }}>
                        {(cal.promedio || 0) >= 70 ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(data.badges || []).filter(b => b.otorgada).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#d4a843" /> Insignias Obtenidas
            </h2>
          </div>
          <div style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {(data.badges || []).filter(b => b.otorgada).map((badge, idx) => (
              <div key={idx} style={{
                padding: '12px 16px', borderRadius: '12px', textAlign: 'center',
                background: `${badge.color}15`, border: `2px solid ${badge.color}`,
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{badge.icono}</div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: badge.color }}>{badge.nombre}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReport;
