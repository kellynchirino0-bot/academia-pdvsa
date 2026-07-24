import React, { useState, useEffect } from 'react';

export const PromptsPDVSA = () => {
  const [prompts, setPrompts] = useState([]);
  const [filtroArea, setFiltroArea] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [copiadoId, setCopiadoId] = useState(null);

  useEffect(() => {
    fetch('/api/prompts/pdvsa')
      .then((res) => res.json())
      .then((data) => {
        if (data.exito) setPrompts(data.data);
      })
      .catch(() => {
        setPrompts([
          {
            id: 'op-01',
            area: 'Operaciones y Producci\u00f3n',
            problemaReal: 'Falla Recurrente en Bombas (Campo Merey-1)',
            solucion: 'Diagn\u00f3stico en <2 min',
            modeloIO: 'An\u00e1lisis RCA',
            promptText: 'Act\u00faa como Ingeniero Senior de Confiabilidad. Analiza este historial de vibraciones y temperaturas...'
          }
        ]);
      });
  }, []);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const areas = ['Todas', ...new Set(prompts.map((p) => p.area))];

  const promptsFiltrados = prompts.filter((p) => {
    const coincideArea = filtroArea === 'Todas' || p.area === filtroArea;
    const coincideTexto =
      p.problemaReal.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.promptText.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.modeloIO.toLowerCase().includes(busqueda.toLowerCase());
    return coincideArea && coincideTexto;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ marginBottom: '25px', borderBottom: '2px solid #D32F2F', paddingBottom: '15px' }}>
        <h1 style={{ color: '#003366', margin: 0, fontSize: '26px' }}>
          Banco Estrat\u00e9gico de Prompts Industria 4.0 — PDVSA
        </h1>
        <p style={{ color: '#555', marginTop: '6px' }}>
          Plataforma de Soluci\u00f3n Inmediata a Problemas Operativos | GabrielBiz Galaxy & LagoChain
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por problema, modelo I.O. o palabra clave..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: '280px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CCC' }}
        />
        <select
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #CCC', backgroundColor: '#FFF' }}
        >
          {(areas || []).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {promptsFiltrados.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFF',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', backgroundColor: '#E3F2FD', color: '#0D47A1', borderRadius: '4px' }}>
                  {item.area}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '4px' }}>
                  {item.modeloIO}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', color: '#003366', marginTop: '5px', marginBottom: '8px' }}>
                {item.problemaReal}
              </h3>

              <p style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 'bold', marginBottom: '12px' }}>
                Soluci\u00f3n: {item.solucion}
              </p>

              <div style={{ backgroundColor: '#F8F9FA', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #003366', fontSize: '12px', fontFamily: 'monospace', color: '#333', maxHeight: '120px', overflowY: 'auto' }}>
                &ldquo;{item.promptText}&rdquo;
              </div>
            </div>

            <button
              onClick={() => handleCopy(item.promptText, item.id)}
              style={{
                marginTop: '15px',
                width: '100%',
                backgroundColor: copiadoId === item.id ? '#2E7D32' : '#003366',
                color: '#FFF',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {copiadoId === item.id ? 'Prompt Copiado' : 'Copiar Prompt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptsPDVSA;