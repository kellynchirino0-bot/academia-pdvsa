import React from 'react';

export const MatrizEnfoqueEjecutivo = () => {
  const roles = [
    {
      titulo: 'Gerentes y L\u00edderes de Negocio',
      dolor: 'Incertidumbre en decisiones financieras y asignaci\u00f3n de presupuesto.',
      solucion: 'Decisiones basadas en optimizaci\u00f3n matem\u00e1tica pura (Simplex & EOQ).',
      impacto: '+$1.96M/d\u00eda en margen de mezcla y $790K/a\u00f1o de ahorro en inventario.',
      badge: 'Visi\u00f3n Financiera'
    },
    {
      titulo: 'Supervisores de Planta y Operaciones',
      dolor: 'Retrasos en paradas de planta y exceso de reportes de falla no planificados.',
      solucion: 'Matriz PERT/CPM para identificar la Ruta Cr\u00edtica en UDA-1 Amuay.',
      impacto: 'Cumplimiento del 94.3% en metas de entrega de mantenimiento.',
      badge: 'Eficiencia Operativa'
    },
    {
      titulo: 'Personal Administrativo y Auditor\u00eda',
      dolor: 'Carga burocr\u00e1tica, lentitud en memor\u00e1ndums y gesti\u00f3n documental.',
      solucion: 'Motor de Inteligencia Ejecutiva (Prompts) + Trazabilidad LagoChain ML-DSA.',
      impacto: 'Reducci\u00f3n del 80% del tiempo de redacci\u00f3n con sello inmutable.',
      badge: 'Soberan\u00eda Digital'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0B1120', padding: '30px', borderRadius: '12px', border: '1px solid #1E293B', color: '#F8FAFC', margin: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ backgroundColor: '#0284C7', color: '#FFF', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          De la Intuici\u00f3n a la Decisi\u00f3n Matem\u00e1tica Asistida
        </span>
        <h2 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '24px' }}>
          Optimizaci\u00f3n de Recursos y Toma de Decisiones Estrat\u00e9gicas
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '700px', margin: '0 auto' }}>
          Matriz de impacto directo para la transformaci\u00f3n operativa de PDVSA con respaldo acad\u00e9mico del IUTPAL.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {roles.map((item, idx) => (
          <div key={idx} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #38BDF8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>{item.badge}</span>
              </div>
              <h3 style={{ fontSize: '16px', color: '#FFF', margin: '0 0 10px 0' }}>{item.titulo}</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 8px 0' }}><strong>Desaf\u00edo:</strong> {item.dolor}</p>
              <p style={{ fontSize: '12px', color: '#CBD5E1', margin: '0 0 12px 0' }}><strong>Soluci\u00f3n:</strong> {item.solucion}</p>
            </div>
            <div style={{ backgroundColor: '#0F172A', padding: '10px', borderRadius: '6px', border: '1px solid #334155' }}>
              <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: 'bold', display: 'block' }}>IMPACTO MEDIBLE:</span>
              <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: 'bold' }}>{item.impacto}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrizEnfoqueEjecutivo;