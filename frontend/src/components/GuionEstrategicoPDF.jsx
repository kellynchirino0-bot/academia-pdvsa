import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const GuionEstrategicoPDF = () => {
  const printRef = useRef();

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
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

    pdf.save('Guion_Estrategico_Lideres_PDVSA_NasserGroup.pdf');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#003366', margin: 0 }}>Guía Estratégica de Liderazgo para PDVSA</h2>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#D32F2F',
            color: '#FFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Descargar Documento en PDF
        </button>
      </div>

      <div
        ref={printRef}
        style={{
          backgroundColor: '#FFFFFF',
          padding: '40px',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
          color: '#333333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ borderBottom: '3px solid #D32F2F', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#D32F2F', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
              NASSER GROUP & IUTPAL
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
              Academia Virtual de Inteligencia Artificial & Investigación de Operaciones | PDVSA
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#888' }}>
            <span>Soberanía Digital & LagoChain</span><br/>
            <span>Doc. Oficial de Enfoque Gerencial</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#F8F9FA', borderLeft: '4px solid #003366', padding: '15px', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#003366', fontSize: '16px' }}>
            ENFOQUE CENTRAL: "De la Intuición a la Decisión Matemática Asistida"
          </h3>
          <p style={{ fontStyle: 'italic', margin: 0, fontSize: '14px', color: '#444' }}>
            "Señores líderes, en PDVSA no nos falta talento ni experiencia. Lo que nos falta es velocidad para procesar datos complejos. Este curso no les enseñará a programar; les enseñará a usar la Inteligencia Artificial y las Matemáticas de Optimización para tomar decisiones gerenciales más rápidas, seguras y rentables."
          </p>
        </div>

        <h3 style={{ color: '#003366', borderBottom: '1px solid #DDD', paddingBottom: '5px' }}>
          CÓMO EXPLICAR CADA PILAR A LA AUDIENCIA MIXTA
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#D32F2F', margin: '10px 0 5px 0' }}>1. Motor de Inteligencia Ejecutiva (Simulador GPT)</h4>
          <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
            <li><strong>Para el Gerente:</strong> Analista financiero personal para simular escenarios de costos y presupuestos en segundos.</li>
            <li><strong>Para el Supervisor:</strong> Asistente técnico que redacta informes de falla y protocolos COVENIN automáticamente.</li>
            <li><strong>Para el Administrativo:</strong> Herramienta de eficiencia que reduce la carga burocrática de memorándums y reportes.</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#D32F2F', margin: '10px 0 5px 0' }}>2. Investigación de Operaciones (El Cerebro Matemático)</h4>
          <ul style={{ fontSize: '13px', lineHeight: '1.6' }}>
            <li><strong>Método Simplex (Mezcla de Crudo):</strong> Optimización de mezclas pesadas/livianas para maximizar ganancia respetando especificaciones de exportación.</li>
            <li><strong>CPM/PERT (Paradas de Planta):</strong> Identificación de la Ruta Crítica en refinerías para minimizar tiempos de inactividad.</li>
            <li><strong>Modelo EOQ (Inventarios):</strong> Cálculo del punto exacto de equilibrio entre almacenamiento y riesgo de desabastecimiento.</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#D32F2F', margin: '10px 0 5px 0' }}>3. Soberanía y Criptografía (LagoChain & ML-DSA)</h4>
          <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
            Protección de activos de información con criptografía post-cuántica y certificación blockchain soberana para evitar alteraciones o auditorías no autorizadas.
          </p>
        </div>

        <h3 style={{ color: '#003366', borderBottom: '1px solid #DDD', paddingBottom: '5px', marginTop: '25px' }}>
          CLAVES DE CONEXIÓN POR ROL GERENCIAL
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#003366', color: '#FFF' }}>
              <th style={{ padding: '8px', border: '1px solid #DDD', textAlign: 'left' }}>Rol</th>
              <th style={{ padding: '8px', border: '1px solid #DDD', textAlign: 'left' }}>Dolor Principal</th>
              <th style={{ padding: '8px', border: '1px solid #DDD', textAlign: 'left' }}>Solución que Ofrece el Curso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>Gerente</strong></td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}>Incertidumbre en decisiones financieras/operativas.</td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>Simplex & EOQ:</strong> Decisiones basadas en optimización matemática.</td>
            </tr>
            <tr style={{ backgroundColor: '#F9F9F9' }}>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>Supervisor</strong></td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}>Exceso de reportes y fallas no planificadas.</td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>Prompts & CPM/PERT:</strong> Cronogramas e informes automáticos.</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>Administrativo</strong></td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}>Carga burocrática y lentitud de procesos.</td>
              <td style={{ padding: '8px', border: '1px solid #DDD' }}><strong>IA Generativa:</strong> Redacción de documentos y síntesis rápida.</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #EEE', textTransform: 'uppercase', fontSize: '10px', color: '#888', textAlign: 'center' }}>
          Documento Generado por Nasser Group — Socio Estratégico de Transformación Operativa PDVSA
        </div>
      </div>
    </div>
  );
};

export default GuionEstrategicoPDF;