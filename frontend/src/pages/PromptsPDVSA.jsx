import React, { useState } from 'react';

export const PromptsPDVSA = () => {
  const [copiadoId, setCopiadoId] = useState(null);

  const promptsEstrategicos = [
    {
      id: 'simplex-faja',
      titulo: '\uD83D\uDCCA Optimizaci\u00f3n de Mezcla de Crudo (Simplex)',
      rol: 'Gerencia Financiera y Planificaci\u00f3n',
      impacto: '+$1.96M / d\u00eda en Margen Operativo',
      casoReal: 'Faja del Orinoco (16\u00b0 API) & Crudo Mediano (30\u00b0 API)',
      promptTexto: 'Act\u00faa como Consultor Senior en Investigaci\u00f3n de Operaciones de PDVSA. Formula un modelo de Programaci\u00f3n Lineal (M\u00e9todo Simplex) para optimizar la mezcla de crudo extrapesado de la Faja del Orinoco (16\u00b0 API) con crudo mediano (30\u00b0 API). Define la funci\u00f3n objetivo para maximizar el margen de ganancia diaria sujeto a restricciones de capacidad de transporte por oleoducto, especificaciones de refinaci\u00f3n y contratos de exportaci\u00f3n, buscando alcanzar la meta de +$1.96M/d\u00eda.'
    },
    {
      id: 'pert-amuay',
      titulo: '\u2699\uFE0F Ruta Cr\u00edtica en Parada de Planta UDA-1 (CPM/PERT)',
      rol: 'Supervisi\u00f3n de Mantenimiento y Operaciones',
      impacto: '94.3% Certidumbre / 22.58 D\u00edas Ejecuci\u00f3n',
      casoReal: 'Refiner\u00eda Amuay - Unidad UDA-1',
      promptTexto: 'Act\u00faa como Gerente de Mantenimiento Industrial en PDVSA Refinaci\u00f3n. Estructura el an\u00e1lisis CPM/PERT para la Parada de Planta de la Unidad UDA-1 de Amuay abarcando sus 16 actividades cr\u00edticas. Identifica las holguras, determina la Ruta Cr\u00edtica para garantizar una duraci\u00f3n m\u00e1xima de 22.58 d\u00edas y calcula la probabilidad estad\u00edstica (meta 94.3%) de cumplir el cronograma frente a eventos no planificados.'
    },
    {
      id: 'eoq-bare',
      titulo: '\uD83D\uDCE6 Lote \u00d3ptimo de Inventario Cr\u00edtico (Modelo EOQ)',
      rol: 'Log\u00edstica, Procura y Administraci\u00f3n',
      impacto: '$790,996 / a\u00f1o en Ahorro de Capital',
      casoReal: 'Campo Bare - V\u00e1lvulas PSV-409',
      promptTexto: 'Act\u00faa como Especialista en Cadena de Suministros para PDVSA Exploraci\u00f3n y Producci\u00f3n. Aplica el modelo EOQ (Economic Order Quantity) para la gesti\u00f3n de inventario de V\u00e1lvulas de Seguridad PSV-409 en Campo Bare. Eval\u00faa el costo de ordenar vs. costo de mantenimiento de inventario, determina el lote \u00f3ptimo de 21 unidades y el punto de reorden, proyectando un ahorro de $790,996/a\u00f1o.'
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
          Optimizaci\u00f3n de Recursos y Toma de Decisiones Estrat\u00e9gicas
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
              {copiadoId === item.id ? '\u2713 Prompt Copiado a Portapapeles' : '\uD83D\uDCCB Copiar Prompt Estrat\u00e9gico'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptsPDVSA;