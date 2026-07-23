import React, { useState } from 'react';

const templates = [
  { label: 'Informe Técnico PDVSA', prompt: 'Redacta un informe técnico sobre el estado de la infraestructura de perforación en el Lago de Maracaibo, incluyendo recomendaciones basadas en análisis predictivo de datos históricos.' },
  { label: 'Auditoría Financiera', prompt: 'Genera un resumen ejecutivo de auditoría financiera para el departamento de contabilidad de PDVSA, destacando hallazgos clave y acciones correctivas.' },
  { label: 'Código Automatización', prompt: 'Escribe un script en Python para monitorear sensores de temperatura y presión en una refinería, enviando alertas cuando los valores superen umbrales críticos.' },
  { label: 'Análisis de Riesgo Operacional', prompt: 'Realiza un análisis de riesgo operacional para un oleoducto de 200 km, considerando variables geológicas, climáticas y de mantenimiento.' },
];

export default function SimuladorTextos() {
  const [prompt, setPrompt] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [historial, setHistorial] = useState([]);
  const [modo, setModo] = useState('texto');

  const simularRespuesta = () => {
    if (!prompt.trim()) return;
    const respuestasSimuladas = {
      texto: `[RESPUESTA GENERADA - MODO ${modo === 'texto' ? 'TEXTO' : 'CÓDIGO'}]\n\nComo asistente de IA especializado en el sector petrolero venezolano, en respuesta a su consulta:\n\n"${prompt}"\n\nSe ha procesado el análisis exitosamente. Los resultados indican que:\n1. Los parámetros evaluados están dentro del rango operativo seguro.\n2. Se recomienda implementar monitoreo continuo con alertas tempranas.\n3. La eficiencia del proceso puede mejorarse un 23% mediante la optimización de variables críticas.\n\nDocumento generado con IA - Nasser Group Academy © 2026`,
      codigo: `// Código generado para: ${prompt}\n// Framework: Node.js + Python Bridge\n\nasync function monitorearActivo(idActivo) {\n  const sensores = await obtenerLecturas(idActivo);\n  const umbrales = { temperatura: 85, presion: 150 };\n  \n  if (sensores.temperatura > umbrales.temperatura) {\n    enviarAlerta('CRITICO', 'Temperatura fuera de rango');\n    activarEnfriamiento();\n  }\n  \n  if (sensores.presion > umbrales.presion) {\n    enviarAlerta('ALTO', 'Presion excedida');\n    activarValvulaSeguridad();\n  }\n  \n  return { status: 'monitoreado', timestamp: new Date().toISOString() };\n}`,
    };
    const rta = respuestasSimuladas[modo];
    setRespuesta(rta);
    setHistorial(prev => [{ prompt, respuesta: rta, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Simulador de Prompts — Texto y Código</h1>
        <p>Modelos GPT · Informes PDVSA · Auditorías · Automatización Industrial</p>
      </div>
      <div className="sim-row">
        <div className="sim-panel sim-left">
          <div className="sim-toolbar">
            <button className={`sim-tab ${modo === 'texto' ? 'active' : ''}`} onClick={() => setModo('texto')}>📝 Modo Texto</button>
            <button className={`sim-tab ${modo === 'codigo' ? 'active' : ''}`} onClick={() => setModo('codigo')}>💻 Modo Código</button>
          </div>
          <div className="prompt-templates">
            {templates.map((t, i) => (
              <button key={i} className="template-btn" onClick={() => setPrompt(t.prompt)}>
                {t.label}
              </button>
            ))}
          </div>
          <textarea className="prompt-input" value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt aquí..." rows={6} />
          <button className="btn-primary" onClick={simularRespuesta} disabled={!prompt.trim()}>
            🚀 Generar Respuesta
          </button>
        </div>
        <div className="sim-panel sim-right">
          <h3>Respuesta Generada</h3>
          <div className="respuesta-box">
            <pre className={modo === 'codigo' ? 'code-block' : ''}>{respuesta || 'Ingresa un prompt y haz clic en "Generar Respuesta" para simular la salida del modelo GPT.'}</pre>
          </div>
          {historial.length > 0 && (
            <div className="historial">
              <h4>Historial de Consultas</h4>
              {historial.map((h, i) => (
                <div key={i} className="historial-item">
                  <small className="h-time">{h.timestamp}</small>
                  <p className="h-prompt">{h.prompt.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
