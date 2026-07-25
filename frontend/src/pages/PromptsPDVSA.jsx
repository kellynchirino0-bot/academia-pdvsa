import React, { useState } from 'react';

export const PromptsPDVSA = () => {
  const [copiadoId, setCopiadoId] = useState(null);

  const promptsEstrategicos = [
    {
      id: 'simplex-faja',
      titulo: '📊 Optimización de Mezcla de Crudo (Simplex)',
      rol: 'Gerencia Financiera y Planificación',
      impacto: '+$1.96M / día en Margen Operativo',
      casoReal: 'Faja del Orinoco (16° API) & Crudo Mediano (30° API)',
      promptTexto: 'Actúa como Consultor Senior en Investigación de Operaciones de PDVSA. Formula un modelo de Programación Lineal (Método Simplex) para optimizar la mezcla de crudo extrapesado de la Faja del Orinoco (16° API) con crudo mediano (30° API). Define la función objetivo para maximizar el margen de ganancia diaria sujeto a restricciones de capacidad de transporte por oleoducto, especificaciones de refinación y contratos de exportación, buscando alcanzar la meta de +$1.96M/día.'
    },
    {
      id: 'pert-amuay',
      titulo: '⚙️ Ruta Crítica en Parada de Planta UDA-1 (CPM/PERT)',
      rol: 'Supervisión de Mantenimiento y Operaciones',
      impacto: '94.3% Certidumbre / 22.58 Días Ejecución',
      casoReal: 'Refinería Amuay - Unidad UDA-1',
      promptTexto: 'Actúa como Gerente de Mantenimiento Industrial en PDVSA Refinación. Estructura el análisis CPM/PERT para la Parada de Planta de la Unidad UDA-1 de Amuay abarcando sus 16 actividades críticas. Identifica las holguras, determina la Ruta Crítica para garantizar una duración máxima de 22.58 días y calcula la probabilidad estadística (meta 94.3%) de cumplir el cronograma frente a eventos no planificados.'
    },
    {
      id: 'eoq-bare',
      titulo: '📦 Lote Óptimo de Inventario Crítico (Modelo EOQ)',
      rol: 'Logística, Procura y Administración',
      impacto: '$790,996 / año en Ahorro de Capital',
      casoReal: 'Campo Bare - Válvulas PSV-409',
      promptTexto: 'Actúa como Especialista en Cadena de Suministros para PDVSA Exploración y Producción. Aplica el modelo EOQ (Economic Order Quantity) para la gestión de inventario de Válvulas de Seguridad PSV-409 en Campo Bare. Evalúa el costo de ordenar vs. costo de mantenimiento de inventario, determina el lote óptimo de 21 unidades y el punto de reorden, proyectando un ahorro de $790,996/año.'
    }
  ];

  const handleCopiarPrompt = (id, texto) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2500);
  };

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ borderBottom: '2px solid #22C55E', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' }}>
        <span style={{ backgroundColor: '#10B981', color: '#0F172A', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
          MOTOR DE INTELIGENCIA EJECUTIVA
        </span>
        <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '26px' }}>
          Optimización de Recursos y Toma de Decisiones Estratégicas
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '13px' }}>
          Prompts maestros para Simplex, CPM/PERT y EOQ | Validado con LagoChain ML-DSA
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {promptsEstrategicos.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              border: '1px solid #334155',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', backgroundColor: '#0F172A', color: '#38BDF8', borderRadius: '4px', border: '1px solid #334155' }}>
                  {item.rol}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', borderRadius: '4px' }}>
                  Validado LagoChain ML-DSA
                </span>
              </div>

              <h3 style={{ fontSize: '16px', color: '#FFF', marginTop: '8px', marginBottom: '6px' }}>
                {item.titulo}
              </h3>

              <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                <strong>Caso Real:</strong> {item.casoReal}
              </p>

              <div style={{ backgroundColor: '#0F172A', padding: '10px', borderRadius: '6px', border: '1px solid #334155', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: 'bold', display: 'block' }}>IMPACTO MEDIBLE:</span>
                <span style={{ fontSize: '14px', color: '#22C55E', fontWeight: 'bold' }}>{item.impacto}</span>
              </div>

              <div style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38BDF8', fontSize: '12px', fontFamily: 'monospace', color: '#CBD5E1', maxHeight: '130px', overflowY: 'auto', lineHeight: '1.5' }}>
                &ldquo;{item.promptTexto}&rdquo;
              </div>
            </div>

            <button
              onClick={() => handleCopiarPrompt(item.id, item.promptTexto)}
              style={{
                marginTop: '15px',
                width: '100%',
                backgroundColor: copiadoId === item.id ? '#22C55E' : '#0284C7',
                color: '#FFF',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copiadoId === item.id ? '✓ Prompt Copiado a Portapapeles' : '📋 Copiar Prompt Estratégico'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptsPDVSA;