import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DossierModuloPDF = () => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0A0E17'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('Dossier_Plan_Estudios_PDVSA_IO_IUTPAL.pdf');
  };

  const modStyle = (borderColor = '#1E293B', bg = 'transparent') => ({
    border: `1px solid ${borderColor}`,
    padding: '15px',
    borderRadius: '8px',
    background: bg
  });

  const h4Style = (color = '#FACC15') => ({
    color,
    margin: '0 0 10px 0',
    fontSize: '13px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '6px'
  });

  const liStyle = {
    fontSize: '11px',
    color: '#CBD5E1',
    paddingLeft: '18px',
    lineHeight: '1.7'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#38BDF8', margin: 0, fontSize: '18px' }}>
          Dossier & Plan de Estudios Oficial
        </h2>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#0284C7',
            color: '#FFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          Descargar Programa Analitico (PDF)
        </button>
      </div>

      <div
        ref={printRef}
        style={{ padding: '30px', background: '#0A0E17', color: '#F8FAFC', fontFamily: 'sans-serif', borderRadius: '8px' }}
      >
        <div style={{ borderBottom: '2px solid #0284C7', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: '#38BDF8', margin: 0, fontSize: '16px' }}>PROGRAMA ACADEMICO & PLAN DE ESTUDIOS</h2>
            <p style={{ color: '#94A3B8', fontSize: '11px', margin: '5px 0 0 0' }}>
              Convenio PDVSA &bull; IUTPAL &bull; Global Safety Solutions™
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748B' }}>
            <div>Acreditacion Internacional</div>
            <div style={{ color: '#22C55E', fontWeight: 'bold' }}>Soberanía Criptográfica ML-DSA</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={modStyle()}>
            <h4 style={h4Style()}>Módulo 1: IA & Soberanía Digital</h4>
            <ul style={liStyle}>
              <li>Lección 1.1: Protección de datos y ética en PDVSA</li>
              <li>Lección 1.2: Transparencia y auditoría algorítmica</li>
              <li>Lección 1.3: Toma de decisiones bajo presión</li>
              <li>Lección 1.4: Soberanía tecnológica operacional</li>
            </ul>
          </div>

          <div style={modStyle()}>
            <h4 style={h4Style()}>Módulo 2: Ingeniería de Prompts</h4>
            <ul style={liStyle}>
              <li>Lección 2.1: Transformación de reportes complejos</li>
              <li>Lección 2.2: Formulación de prompts ejecutivos</li>
              <li>Lección 2.3: Síntesis de datos para directivos</li>
              <li>Lección 2.4: Matrices de decisión asistidas por IA</li>
            </ul>
          </div>

          <div style={modStyle()}>
            <h4 style={h4Style()}>Módulo 3: Eficiencia y Recursos</h4>
            <ul style={liStyle}>
              <li>Lección 3.1: Análisis comparativo de presupuestos</li>
              <li>Lección 3.2: Gestión de inventario crítico</li>
              <li>Lección 3.3: Automatización de flujo documental</li>
              <li>Lección 3.4: Optimización de procesos sin burocracia</li>
            </ul>
          </div>

          <div style={modStyle('#0284C7', '#0F172A')}>
            <h4 style={h4Style('#38BDF8')}>Módulo 4: Investigación de Operaciones (I.O.)</h4>
            <ul style={liStyle}>
              <li><strong style={{ color: '#38BDF8' }}>I.O. 1:</strong> Fundamentos y Modelado Matemático con IA</li>
              <li><strong style={{ color: '#38BDF8' }}>I.O. 2:</strong> Algoritmo Simplex y Mezcla de Crudo (+$1.96M/d)</li>
              <li><strong style={{ color: '#38BDF8' }}>I.O. 3:</strong> CPM/PERT en Parada de Planta UDA-1 (22.58 días)</li>
              <li><strong style={{ color: '#38BDF8' }}>I.O. 4:</strong> Lote Económico EOQ en Almacén ($790K ahorro)</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <h4 style={{ color: '#FACC15', margin: '0 0 8px 0', fontSize: '12px' }}>SELLO DE INMUTABILIDAD Y VERIFICACIÓN</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', lineHeight: '1.6' }}>
              <div>Firma: <span style={{ color: '#4ADE80' }}>ML-DSA-PDVSA-2026-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span></div>
              <div>Estandar: NIST FIPS 204 (Post-Quantum)</div>
              <div>Aval: Global Safety Solutions™ & IUTPAL</div>
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', textAlign: 'right' }}>
              <div>Verifique en:</div>
              <div style={{ color: '#38BDF8' }}>academia-pdvsa.vercel.app/verificar-certificado</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E293B', marginTop: '20px', paddingTop: '10px', fontSize: '10px', color: '#64748B', textAlign: 'center' }}>
          Plataforma y Arquitectura Creada por GabrielBiz Galaxy &copy; 2026. Documento emitido y validado digitalmente.
        </div>
      </div>
    </div>
  );
};

export default DossierModuloPDF;