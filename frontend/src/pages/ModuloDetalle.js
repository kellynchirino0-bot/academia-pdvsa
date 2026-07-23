import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, BookOpen, 
  Activity, Thermometer, Cpu, Zap, BarChart3,
  MessageSquare, Send, Copy, Code, Eye, 
  AlertTriangle, Play, RotateCcw, ChevronRight,
  FileText, Award, Terminal
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

/* ================================================================
   MÓDULO 1: FUNDAMENTOS DE IA - Simulador BES
   ================================================================ */
const SimuladorBES = () => {
  const [temperatura, setTemperatura] = useState(85);
  const [vibracion, setVibracion] = useState(4.2);
  const [presion, setPresion] = useState(1850);
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);

  const calcularRiesgo = useCallback(() => {
    const tempNorm = Math.pow((temperatura - 60) / 140, 2) * 28;
    const vibNorm = Math.pow(vibracion / 12, 2) * 37;
    const presNorm = Math.pow((presion - 500) / 2500, 2) * 20;
    const ruido = (Math.random() - 0.5) * 8;
    const probabilidad = Math.min(98, Math.max(2, tempNorm + vibNorm + presNorm + ruido + 7));

    let nivel = 'BAJO';
    let color = '#10b981';
    let accion = 'Mantenimiento preventivo programado';
    let rul = '180+ días';
    if (probabilidad > 75) { nivel = 'CRÍTICO'; color = '#CC0000'; accion = 'Parada inmediata requerida'; rul = '< 15 días'; }
    else if (probabilidad > 55) { nivel = 'ALTO'; color = '#ef4444'; accion = 'Inspección en 48 horas'; rul = '15-45 días'; }
    else if (probabilidad > 35) { nivel = 'MEDIO'; color = '#f59e0b'; accion = 'Monitoreo intensivo semanal'; rul = '45-90 días'; }

    const res = {
      probabilidad: probabilidad.toFixed(1),
      nivel,
      color,
      accion,
      rul,
      temp: temperatura,
      vib: vibracion,
      pres: presion,
      timestamp: new Date().toLocaleTimeString('es-VE')
    };
    setResultado(res);
    setHistorial(prev => [res, ...prev].slice(0, 8));
  }, [temperatura, vibracion, presion]);

  const getSliderColor = (val, min, max) => {
    const pct = (val - min) / (max - min);
    if (pct > 0.7) return '#CC0000';
    if (pct > 0.4) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
      <h3 style={{ color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
        <Cpu size={22} color="#4FC3F7" />
        Simulador de Inferencia de Falla - Bomba Electrosumergible (BES)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          {/* Temperatura */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={14} /> Temperatura de Fondo (°C)
              </label>
              <span style={{ color: getSliderColor(temperatura, 40, 200), fontWeight: '700', fontSize: '0.95rem' }}>
                {temperatura}°C
              </span>
            </div>
            <input type="range" min="40" max="200" value={temperatura}
              onChange={(e) => setTemperatura(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: getSliderColor(temperatura, 40, 200) }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.7rem' }}>
              <span>40°C Normal</span><span>120°C Alerta</span><span>200°C Crítico</span>
            </div>
          </div>

          {/* Vibración */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} /> Vibración del Motor (mm/s)
              </label>
              <span style={{ color: getSliderColor(vibracion, 0, 12), fontWeight: '700', fontSize: '0.95rem' }}>
                {vibracion.toFixed(1)} mm/s
              </span>
            </div>
            <input type="range" min="0" max="12" step="0.1" value={vibracion}
              onChange={(e) => setVibracion(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: getSliderColor(vibracion, 0, 12) }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.7rem' }}>
              <span>0 óptimo</span><span>6 alerta</span><span>12 peligro</span>
            </div>
          </div>

          {/* Presión */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} /> Presión de Descarga (PSI)
              </label>
              <span style={{ color: getSliderColor(presion, 500, 3000), fontWeight: '700', fontSize: '0.95rem' }}>
                {presion} PSI
              </span>
            </div>
            <input type="range" min="500" max="3000" value={presion}
              onChange={(e) => setPresion(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: getSliderColor(presion, 500, 3000) }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.7rem' }}>
              <span>500 PSI</span><span>1750 óptimo</span><span>3000 máx</span>
            </div>
          </div>

          <button onClick={calcularRiesgo} style={{
            width: '100%', padding: '14px', background: 'linear-gradient(135deg, #003366, #004080)',
            color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Play size={18} /> Ejecutar Inferencia de Fallas
          </button>
        </div>

        <div>
          {resultado ? (
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: `1px solid ${resultado.color}40` }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: resultado.color }}>{resultado.probabilidad}%</div>
                <div style={{ fontSize: '1.1rem', color: resultado.color, fontWeight: '600', letterSpacing: '1px' }}>
                  RIESGO {resultado.nivel}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'RUL Estimado', value: resultado.rul, icon: <Clock size={14} /> },
                  { label: 'Acción Requerida', value: resultado.accion, icon: <AlertTriangle size={14} /> },
                  { label: 'Temp. Entrada', value: `${resultado.temp}°C`, icon: <Thermometer size={14} /> },
                  { label: 'Vibración', value: `${resultado.vib} mm/s`, icon: <Zap size={14} /> }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.7rem', marginBottom: '4px' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: '500' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${resultado.probabilidad}%`, height: '100%', background: resultado.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ textAlign: 'right', color: '#475569', fontSize: '0.7rem', marginTop: '6px' }}>
                {resultado.timestamp}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', background: '#1e293b', borderRadius: '12px', padding: '40px' }}>
              <Activity size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p style={{ margin: 0 }}>Ajusta los parámetros y ejecuta la inferencia</p>
            </div>
          )}

          {historial.length > 0 && (
            <div style={{ marginTop: '16px', background: '#1e293b', borderRadius: '10px', padding: '14px' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '8px' }}>ÚLTIMOS ANÁLISIS</div>
              {historial.slice(0, 4).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 3 ? '1px solid #334155' : 'none', fontSize: '0.8rem' }}>
                  <span style={{ color: '#94a3b8' }}>{h.timestamp}</span>
                  <span style={{ color: h.color, fontWeight: '600' }}>{h.probabilidad}% — {h.nivel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MÓDULO 2: PROMPT ENGINEERING - Constructor RICE
   ================================================================ */
const ConstructorRICE = () => {
  const [rol, setRol] = useState('');
  const [instruccion, setInstruccion] = useState('');
  const [contexto, setContexto] = useState('');
  const [ejemplo, setEjemplo] = useState('');
  const [promptGenerado, setPromptGenerado] = useState('');
  const [respuestaSimulada, setRespuestaSimulada] = useState('');
  const [evaluacion, setEvaluacion] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const plantillas = [
    { id: 'auditoria', rol: 'Auditor senior certificado ISO 9001/14001 con 15 años en PDVSA', instruccion: 'Realizar una auditoría operacional completa del área de procesos', contexto: 'Refinería Amuay, última auditoría hace 6 meses, 2 hallazgos críticos pendientes', ejemplo: 'RESUMEN: Hallazgos en sistema de válvulas de alivio. CRÍTICO: V-102 sin calibración. MEDIO: Falta registro de inspección visual mensual.' },
    { id: 'informe', rol: 'Ingeniero senior de perforación con especialización en pozos profundos', instruccion: 'Generar informe técnico de perforación del pozo', contexto: 'Pozo ZUL-45, profundidad 3200m, formación productora La Luna, últimas 72 hrs de operación', ejemplo: 'POZO: ZUL-45 | PROF: 3200m | FORMACIÓN: La Luna | ROP: 15 m/hr | FLUIDO: Lodo pesado 12 ppg' },
    { id: 'mantenimiento', rol: 'Especialista en mantenimiento predictivo y confiabilidad de activos', instruccion: 'Desarrollar plan de mantenimiento predictivo para el equipo', contexto: 'Compresor centrifugo GC-201, 8500 hrs operación, último mantenimiento hace 4 meses', ejemplo: 'EQUIPO: GC-201 | TIPO: Compresor centrifugo | HORAS: 8500 | PRÓXIMO SERVICE: 500 hrs' }
  ];

  const cargarPlantilla = (p) => {
    setRol(p.rol);
    setInstruccion(p.instruccion);
    setContexto(p.contexto);
    setEjemplo(p.ejemplo);
    setPromptGenerado('');
    setRespuestaSimulada('');
    setEvaluacion(null);
  };

  const evaluarPrompt = (texto) => {
    let score = 0;
    const feedback = [];
    if (texto.includes('Rol:') || texto.includes('Actúa como') || texto.length > 30) { score += 25; } else { feedback.push('Define un rol claro'); }
    if (texto.includes('Instrucción:') || texto.includes('Genera') || texto.includes('Realizar') || texto.includes('Crear')) { score += 25; } else { feedback.push('Agrega una instrucción específica'); }
    if (texto.includes('Contexto:') || texto.includes('Refinería') || texto.includes('Pozo') || contexto.length > 20) { score += 25; } else { feedback.push('Incluye contexto operacional'); }
    if (texto.includes('Ejemplo:') || texto.includes('Formato:') || ejemplo.length > 20) { score += 25; } else { feedback.push('Proporciona un ejemplo de salida'); }
    return { score, feedback };
  };

  const generarPrompt = () => {
    const texto = `ROL: ${rol}\n\nINSTRUCCIÓN: ${instruccion}\n\nCONTEXTO: ${contexto}\n\nEJEMPLO DE SALIDA ESPERADA:\n${ejemplo}`;
    setPromptGenerado(texto);
    const ev = evaluarPrompt(texto);
    setEvaluacion(ev);
  };

  const simularRespuesta = async () => {
    if (!promptGenerado) return;
    setProcesando(true);
    setRespuestaSimulada('');

    const respuestaBase = `ANÁLISIS TÉCNICO GENERADO POR IA
${'='.repeat(50)}

[${new Date().toLocaleString('es-VE')}] Procesando solicitud con parámetros RICE...

DATOS DE ENTRADA:
• Rol configurado: ${rol.substring(0, 60)}...
• Instrucción: ${instruccion}
• Contexto: ${contexto.substring(0, 80)}...

${'─'.repeat(50)}
INFORME GENERADO:

1. RESUMEN EJECUTIVO
Se realizó el análisis conforme a los parámetros establecidos.
El proceso cubre las áreas solicitadas con un nivel de detalle
adecuado para toma de decisiones operativas en PDVSA.

2. HALLAZGOS PRINCIPALES
• Cumplimiento normativo: 87% (Mejorable)
• Seguridad operacional: Nivel aceptable
• Eficiencia de procesos: 72% vs benchmark industry
• Impacto ambiental: Dentro de parámetros

3. RECOMENDACIONES
a) Implementar monitoreo continuo en puntos críticos
b) Establecer KPIs de seguimiento mensual
c) Capacitar al personal en nuevos protocolos
d) Actualizar documentación operativa

4. CONCLUSIÓN
El análisis technique indica oportunidades de mejora en
un 28% de las áreas evaluadas. Se requiere plan de acción
en un plazo no mayor a 30 días.

[FIN DEL INFORME]`;

    for (let i = 0; i < respuestaBase.length; i += 3) {
      await new Promise(r => setTimeout(r, 8));
      setRespuestaSimulada(respuestaBase.substring(0, i + 3));
    }
    setProcesando(false);
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Plantillas */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h4 style={{ color: '#003366', marginBottom: '12px', fontSize: '0.95rem' }}>Plantillas RICE Predefinidas</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {plantillas.map(p => (
            <button key={p.id} onClick={() => cargarPlantilla(p)} style={{
              padding: '14px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '10px',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#003366', marginBottom: '4px' }}>
                {p.id === 'auditoria' ? '🔍' : p.id === 'informe' ? '📊' : '🔧'} {p.id.charAt(0).toUpperCase() + p.id.slice(1)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.rol.substring(0, 50)}...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Campos RICE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h4 style={{ color: '#003366', marginBottom: '16px' }}>Constructor de Prompt RICE</h4>
          {[
            { label: 'R — Rol', value: rol, setter: setRol, placeholder: 'Actúa como un ingeniero senior de...', color: '#003366' },
            { label: 'I — Instrucción', value: instruccion, setter: setInstruccion, placeholder: 'Genera un informe que incluya...', color: '#CC0000' },
            { label: 'C — Contexto', value: contexto, setter: setContexto, placeholder: 'Refinería Amuay, pozo ZUL-45...', color: '#0d6e6e' },
            { label: 'E — Ejemplo', value: ejemplo, setter: setEjemplo, placeholder: 'Formato: POZO: ZUL-45 | PROF: 3200m...', color: '#d4a843' }
          ].map((campo, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: campo.color, marginBottom: '6px' }}>
                {campo.label}
              </label>
              <textarea value={campo.value} onChange={(e) => campo.setter(e.target.value)}
                placeholder={campo.placeholder}
                style={{ width: '100%', minHeight: '60px', padding: '10px', border: `2px solid ${campo.color}30`, borderRadius: '8px', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={generarPrompt} style={{ flex: 1, padding: '12px', background: '#003366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
              Generar Prompt Maestro
            </button>
            <button onClick={simularRespuesta} disabled={!promptGenerado || procesando} style={{ flex: 1, padding: '12px', background: promptGenerado && !procesando ? '#CC0000' : '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', cursor: promptGenerado && !procesando ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '0.9rem' }}>
              {procesando ? 'Generando...' : 'Simular Respuesta IA'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {evaluacion && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h4 style={{ color: '#003366', marginBottom: '12px', fontSize: '0.9rem' }}>Evaluación del Prompt</h4>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: evaluacion.score >= 75 ? '#10b981' : evaluacion.score >= 50 ? '#f59e0b' : '#CC0000' }}>
                  {evaluacion.score}%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Calidad RICE</div>
              </div>
              {evaluacion.feedback.length > 0 && (
                <div>
                  {evaluacion.feedback.map((f, i) => (
                    <div key={i} style={{ padding: '6px 10px', background: '#fef3c7', borderRadius: '6px', marginBottom: '4px', fontSize: '0.8rem', color: '#92400e', borderLeft: '3px solid #f59e0b' }}>
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {promptGenerado && (
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', maxHeight: '200px', overflow: 'auto' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase' }}>Prompt Generado</div>
              <pre style={{ color: '#e2e8f0', fontSize: '0.8rem', fontFamily: "'Courier New', monospace", whiteSpace: 'pre-wrap', margin: 0 }}>
                {promptGenerado}
              </pre>
            </div>
          )}

          {respuestaSimulada && (
            <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', maxHeight: '300px', overflow: 'auto', border: '1px solid #1e293b' }}>
              <div style={{ color: '#10b981', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={12} /> Respuesta del Modelo
              </div>
              <pre style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: "'Courier New', monospace", whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.6' }}>
                {respuestaSimulada}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MÓDULO 3: GEMELOS DIGITALES - Panel de Planta
   ================================================================ */
const PanelPlanta = () => {
  const [sensores, setSensores] = useState({
    presion_sep1: 285, presion_sep2: 142, flujo_gas: 48.5,
    temp_gas: 92, nivel_tanque: 68, estado_v101: 'abierta', estado_v102: 'cerrada'
  });
  const [alarmas, setAlarmas] = useState([
    { id: 1, tipo: 'info', mensaje: 'Sistema operando dentro de parámetros normales', hora: '08:00' }
  ]);
  const [simulando, setSimulando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensores(prev => ({
        ...prev,
        presion_sep1: Math.max(200, Math.min(400, prev.presion_sep1 + (Math.random() - 0.5) * 6)),
        presion_sep2: Math.max(100, Math.min(200, prev.presion_sep2 + (Math.random() - 0.5) * 4)),
        flujo_gas: Math.max(30, Math.min(70, prev.flujo_gas + (Math.random() - 0.5) * 2)),
        temp_gas: Math.max(70, Math.min(120, prev.temp_gas + (Math.random() - 0.5) * 3)),
        nivel_tanque: Math.max(30, Math.min(90, prev.nivel_tanque + (Math.random() - 0.5) * 2))
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (val, min, max) => {
    if (val < min * 1.05 || val > max * 0.95) return '#CC0000';
    if (val < min * 1.15 || val > max * 0.85) return '#f59e0b';
    return '#10b981';
  };

  const simularAnomalia = (tipo) => {
    setSimulando(true);
    setTimeout(() => {
      if (tipo === 'sobrepresion') {
        setSensores(prev => ({ ...prev, presion_sep1: 380, estado_v102: 'abierta' }));
        setAlarmas(prev => [{
          id: Date.now(), tipo: 'critica',
          mensaje: 'ALERTA CRÍTICA: Sobrepresión en Separador SP-101. Válvula V-102 abierta automáticamente.',
          hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 6));
      } else if (tipo === 'fuga') {
        setSensores(prev => ({ ...prev, flujo_gas: 65, nivel_tanque: 45 }));
        setAlarmas(prev => [{
          id: Date.now(), tipo: 'warning',
          mensaje: 'ALERTA: Descenso de nivel en TK-201 detectado. Posible fuga en línea de gas.',
          hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 6));
      } else {
        setSensores(prev => ({ ...prev, temp_gas: 115 }));
        setAlarmas(prev => [{
          id: Date.now(), tipo: 'warning',
          mensaje: 'ALERTA: Temperatura elevada en línea de gas. Verificar enfriador E-101.',
          hora: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 6));
      }
      setSimulando(false);
    }, 1200);
  };

  const valveColor = (estado) => estado === 'abierta' ? '#10b981' : '#64748b';

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '16px', padding: '24px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          <Cpu size={22} color="#10b981" /> Gemelo Digital — Planta de Fraccionamiento PDVSA
        </h3>
        <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.15)', borderRadius: '20px', color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          EN VIVO
        </div>
      </div>

      {/* Sensores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'SP-101 Presión', value: sensores.presion_sep1.toFixed(0), unit: 'PSI', color: getStatus(sensores.presion_sep1, 250, 350) },
          { label: 'SP-102 Presión', value: sensores.presion_sep2.toFixed(0), unit: 'PSI', color: getStatus(sensores.presion_sep2, 120, 180) },
          { label: 'Flujo Gas', value: sensores.flujo_gas.toFixed(1), unit: 'MMSCFD', color: getStatus(sensores.flujo_gas, 35, 60) },
          { label: 'Temp. Gas', value: sensores.temp_gas.toFixed(0), unit: '°F', color: getStatus(sensores.temp_gas, 75, 110) },
          { label: 'Nivel TK-201', value: sensores.nivel_tanque.toFixed(0), unit: '%', color: getStatus(sensores.nivel_tanque, 40, 85) }
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', border: `1px solid ${s.color}40` }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: '700' }}>{s.value}</div>
            <div style={{ color: '#475569', fontSize: '0.7rem' }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Válvulas y Acciones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px', textTransform: 'uppercase' }}>Estado de Válvulas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { name: 'V-101', estado: sensores.estado_v101 },
              { name: 'V-102', estado: sensores.estado_v102 }
            ].map((v, i) => (
              <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: valveColor(v.estado) }} />
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}>{v.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'capitalize' }}>{v.estado}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px', textTransform: 'uppercase' }}>Simular Anomalías</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { tipo: 'sobrepresion', label: 'Sobrepresión en SP-101', color: '#CC0000' },
              { tipo: 'fuga', label: 'Fuga en línea de gas', color: '#f59e0b' },
              { tipo: 'temp', label: 'Sobrecalentamiento gas', color: '#f97316' }
            ].map((a, i) => (
              <button key={i} onClick={() => simularAnomalia(a.tipo)} disabled={simulando}
                style={{ padding: '10px 14px', background: `${a.color}15`, border: `1px solid ${a.color}40`, borderRadius: '8px', color: a.color, cursor: simulando ? 'wait' : 'pointer', fontSize: '0.85rem', fontWeight: '500', textAlign: 'left', transition: 'all 0.2s' }}>
                {simulando ? 'Procesando...' : `⚠ ${a.label}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alarmas */}
      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
        <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={14} /> Registro de Alarmas
        </h4>
        {alarmas.map(a => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '6px',
            background: a.tipo === 'critica' ? 'rgba(204,0,0,0.12)' : 'rgba(245,158,11,0.08)',
            borderRadius: '8px', borderLeft: `3px solid ${a.tipo === 'critica' ? '#CC0000' : '#f59e0b'}`, fontSize: '0.85rem'
          }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem', flexShrink: 0 }}>{a.hora}</span>
            <span style={{ color: '#e2e8f0' }}>{a.mensaje}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================================================================
   MÓDULO 4: IA GENERATIVA - Generador Python LAS
   ================================================================ */
const GeneradorLAS = () => {
  const [curvaSeleccionada, setCurvaSeleccionada] = useState('gamma_ray');
  const [metodoProcesamiento, setMetodoProcesamiento] = useState('estadistico');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [copiado, setCopiado] = useState(false);

  const curvas = [
    { id: 'gamma_ray', label: 'Gamma Ray (GR)', unit: 'API' },
    { id: 'resistividad', label: 'Resistividad (RT)', unit: 'ohm·m' },
    { id: 'densidad', label: 'Densidad (RHOB)', unit: 'g/cm³' },
    { id: 'porosidad', label: 'Porosidad Neutrón (NPHI)', unit: 'v/v' },
    { id: 'sonico', label: 'Sónico (DT)', unit: 'μs/ft' }
  ];

  const generarScript = () => {
    const curva = curvas.find(c => c.id === curvaSeleccionada);
    const scripts = {
      gamma_ray: `#!/usr/bin/env python3
# ============================================
# Análisis de Curva Gamma Ray - Pozo PDVSA
# Generado por Academia Virtual Nasser Group
# ============================================

import lasio
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def analizar_gamma_ray(archivo_las):
    """Analiza curva Gamma Ray para identificar litología"""
    pozo = lasio.read(archivo_las)
    df = pozo.df
    
    gr = df['GR']
    
    # Parámetros litológicos
    arenisca_max = 60   # API umbral areniscas
    lutita_min = 80     # API umbral lutitas
    
    # Clasificación litológica
    df['Litologia'] = pd.cut(gr,
        bins=[0, arenisca_max, lutita_min, 200],
        labels=['Arenisca', 'Arenolutita', 'Lutita'])
    
    # Estadísticas
    print(f"{'='*50}")
    print(f"ANÁLISIS GAMMA RAY - POZO: {pozo.well.WELL.value}")
    print(f"{'='*50}")
    print(f"Media GR: {gr.mean():.1f} API")
    print(f"Desv. Estándar: {gr.std():.1f} API")
    print(f"Rango: {gr.min():.1f} - {gr.max():.1f} API")
    print(f"\\nDistribución Litológica:")
    print(df['Litologia'].value_counts())
    
    # Visualización
    fig, ax = plt.subplots(figsize=(8, 12))
    ax.plot(gr, df.index, 'g-', linewidth=0.8, label='GR')
    ax.fill_betweenx(df.index, 0, gr, alpha=0.2, color='green')
    ax.axvline(x=arenisca_max, color='blue', linestyle='--', alpha=0.5)
    ax.axvline(x=lutita_min, color='red', linestyle='--', alpha=0.5)
    ax.set_xlabel('Gamma Ray (API)')
    ax.set_ylabel('Profundidad')
    ax.set_title(f'Análisis GR - {pozo.well.WELL.value}')
    ax.invert_yaxis()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('analisis_gr.png', dpi=150)
    plt.show()
    
    return df

if __name__ == "__main__":
    resultado = analizar_gamma_ray("pozo_ejemplo.las")`,

      resistividad: `#!/usr/bin/env python3
# ============================================
# Análisis de Resistividad - Pozo PDVSA
# Generado por Academia Virtual Nasser Group
# ============================================

import lasio
import pandas as pd
import numpy as np

def analizar_resistividad(archivo_las):
    """Analiza curvas de resistividad para detectar hidrocarburos"""
    pozo = lasio.read(archivo_las)
    df = pozo.df
    
    rt = df['RT']   # Resistividad total
    rxo = df['RXOZ'] if 'RXOZ' in df.columns else rt * 0.7
    
    # Indicador de hidrocarburos (sobreexplotación > 10 ohm·m)
    umbral_hc = 10
    df['Indicador_HC'] = rt > umbral_hc
    
    # Ratio de invasión
    df['Ratio_Invasion'] = rt / rxo
    
    print(f"{'='*50}")
    print(f"ANÁLISIS RESISTIVIDAD - POZO: {pozo.well.WELL.value}")
    print(f"{'='*50}")
    print(f"RT Media: {rt.mean():.2f} ohm·m")
    print(f"Zonas con HC potencial: {df['Indicador_HC'].sum()} muestras")
    print(f"Ratio invasión promedio: {df['Ratio_Invasion'].mean():.2f}")
    
    return df

if __name__ == "__main__":
    resultado = analizar_resistividad("pozo_ejemplo.las")`,

      densidad: `#!/usr/bin/env python3
# ============================================
# Análisis Densidad-Porosidad - Pozo PDVSA
# Generado por Academia Virtual Nasser Group
# ============================================

import lasio
import pandas as pd
import numpy as np

def analizar_densidad_porosidad(archivo_las):
    """Calcula porosidad a partir de densidad volumétrica"""
    pozo = lasio.read(archivo_las)
    df = pozo.df
    
    rhob = df['RHOB']  # Densidad volumétrica (g/cm³)
    rhomatra = 2.65     # Densidad matriz arena (g/cm³)
    rhofluido = 1.0     # Densidad del fluido (g/cm³)
    
    # Porosidad densitométrica
    df['Porosidad_Dens'] = (rhomatra - rhob) / (rhomatra - rhofluido) * 100
    
    # Clasificación por calidad de reservorio
    df['Calidad'] = pd.cut(df['Porosidad_Dens'],
        bins=[0, 10, 20, 35, 100],
        labels=['Mala', 'Regular', 'Buena', 'Excelente'])
    
    print(f"{'='*50}")
    print(f"ANÁLISIS DENSIDAD-POROSIDAD")
    print(f"{'='*50}")
    print(f"Porosidad promedio: {df['Porosidad_Dens'].mean():.1f}%")
    print(f"Calidad de reservorio:")
    print(df['Calidad'].value_counts())
    
    return df

if __name__ == "__main__":
    resultado = analizar_densidad_porosidad("pozo_ejemplo.las")`,

      porosidad: `#!/usr/bin/env python3
# ============================================
# Análisis de Porosidad Neutrón - Pozo PDVSA
# Generado por Academia Virtual Nasser Group
# ============================================

import lasio
import pandas as pd
import numpy as np

def analizar_porosidad_neutron(archivo_las):
    """Analiza porosidad neutrón y detecta efecto gas"""
    pozo = lasio.read(archivo_las)
    df = pozo.df
    
    nphi = df['NPHI'] * 100  # Porosidad neutrón (%)
    rhob = df['RHOB']
    
    # Detección de efecto gas (crossover NPHI-RHOB)
    df['Efecto_Gas'] = (nphi < 25) & (rhob < 2.2)
    
    print(f"{'='*50}")
    print(f"ANÁLISIS POROSIDAD NEUTRÓN")
    print(f"{'='*50}")
    print(f"NPHI promedio: {nphi.mean():.1f}%")
    print(f"Zonas con efecto gas: {df['Efecto_Gas'].sum()} muestras")
    
    return df

if __name__ == "__main__":
    resultado = analizar_porosidad_neutron("pozo_ejemplo.las")`,

      sonico: `#!/usr/bin/env python3
# ============================================
# Análisis Sónico - Pozo PDVSA
# Generado por Academia Virtual Nasser Group
# ============================================

import lasio
import pandas as pd
import numpy as np

def analizar_sonico(archivo_las):
    """Calcula porosidad sónica y velocidades de onda"""
    pozo = lasio.read(archivo_las)
    df = pozo.df
    
    dt = df['DT']          # Tiempo de tránsito (μs/ft)
    dt_mat = 55.5          # DT de matriz arena
    dt_fl = 189.0          # DT del fluido
    
    # Porosidad sónica (ecuación de Wyllie)
    df['Porosidad_Sonica'] = (dt - dt_mat) / (dt_fl - dt_mat) * 100
    
    # Velocidad de onda P (m/s)
    df['Velocidad_P'] = 1e6 / dt * 0.3048
    
    print(f"{'='*50}")
    print(f"ANÁLISIS SÓNICO - POZO: {pozo.well.WELL.value}")
    print(f"{'='*50}")
    print(f"DT promedio: {dt.mean():.1f} μs/ft")
    print(f"Porosidad sónica promedio: {df['Porosidad_Sonica'].mean():.1f}%")
    print(f"Velocidad P promedio: {df['Velocidad_P'].mean():.0f} m/s")
    
    return df

if __name__ == "__main__":
    resultado = analizar_sonico("pozo_ejemplo.las")`
    };

    setCodigoGenerado(scripts[curvaSeleccionada] || scripts.gamma_ray);
    setCopiado(false);
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Selector */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h4 style={{ color: '#003366', marginBottom: '14px' }}>Configuración del Análisis Petrofísico</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Curva de Análisis</label>
            <select value={curvaSeleccionada} onChange={(e) => setCurvaSeleccionada(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }}>
              {curvas.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Método</label>
            <select value={metodoProcesamiento} onChange={(e) => setMetodoProcesamiento(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' }}>
              <option value="estadistico">Análisis Estadístico</option>
              <option value="clasificacion">Clasificación Litológica</option>
              <option value="tendencia">Análisis de Tendencia</option>
            </select>
          </div>
        </div>
        <button onClick={generarScript} style={{
          marginTop: '14px', width: '100%', padding: '12px', background: 'linear-gradient(135deg, #003366, #004080)',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <Terminal size={18} /> Generar Script de Procesamiento
        </button>
      </div>

      {/* Código */}
      {codigoGenerado && (
        <div style={{ background: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#2d2d2d', borderBottom: '1px solid #404040' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>🐍 {curvaSeleccionada.replace('_', '_')}_analysis.py</span>
            <button onClick={copiarCodigo} style={{
              padding: '6px 14px', background: copiado ? '#10b981' : '#404040', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              {copiado ? <><CheckCircle size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
            </button>
          </div>
          <pre style={{ margin: 0, padding: '18px', color: '#d4d4d4', fontFamily: "'Courier New', Consolas, monospace", fontSize: '0.82rem', lineHeight: '1.6', maxHeight: '450px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {codigoGenerado}
          </pre>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   CUESTIONARIOS POR MÓDULO
   ================================================================ */
const Cuestionario = ({ preguntas, moduloId, onCompletar }) => {
  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [resultado, setResultado] = useState(null);

  const seleccionarRespuesta = (preguntaId, opcionIdx) => {
    if (enviado) return;
    setRespuestas(prev => ({ ...prev, [preguntaId]: opcionIdx }));
  };

  const evaluar = () => {
    let correctas = 0;
    preguntas.forEach(p => {
      if (respuestas[p.id] === p.correcta) correctas++;
    });
    const pct = (correctas / preguntas.length) * 100;
    setResultado({ correctas, total: preguntas.length, pct, aprobado: pct >= 80 });
    setEnviado(true);
    if (pct >= 80) onCompletar();
  };

  const reiniciar = () => {
    setRespuestas({});
    setEnviado(false);
    setResultado(null);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h4 style={{ color: '#003366', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={18} /> Cuestionario de Validación
      </h4>

      {resultado && (
        <div style={{ padding: '18px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center',
          background: resultado.aprobado ? 'rgba(16,185,129,0.08)' : 'rgba(204,0,0,0.06)',
          border: `2px solid ${resultado.aprobado ? '#10b981' : '#CC0000'}`
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: resultado.aprobado ? '#10b981' : '#CC0000' }}>
            {resultado.pct}%
          </div>
          <div style={{ color: resultado.aprobado ? '#059669' : '#CC0000', fontWeight: '600', marginBottom: '8px' }}>
            {resultado.aprobado ? 'MÓDULO APROBADO' : 'REQUIERE REPASO'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {resultado.correctas}/{resultado.total} respuestas correctas — Mínimo 80%
          </div>
        </div>
      )}

      {preguntas.map((p, idx) => (
        <div key={p.id} style={{ marginBottom: '18px', padding: '16px', background: '#f8fafc', borderRadius: '10px',
          border: enviado ? `2px solid ${respuestas[p.id] === p.correcta ? '#10b981' : '#CC0000'}` : '2px solid transparent'
        }}>
          <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '10px', fontSize: '0.95rem' }}>
            {idx + 1}. {p.pregunta}
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {p.opciones.map((op, opIdx) => (
              <button key={opIdx} onClick={() => seleccionarRespuesta(p.id, opIdx)}
                style={{
                  padding: '10px 14px', textAlign: 'left', borderRadius: '8px', fontSize: '0.88rem',
                  border: `2px solid ${
                    enviado && opIdx === p.correcta ? '#10b981' :
                    enviado && respuestas[p.id] === opIdx && opIdx !== p.correcta ? '#CC0000' :
                    respuestas[p.id] === opIdx ? '#003366' : '#e2e8f0'
                  }`,
                  background: enviado && opIdx === p.correcta ? 'rgba(16,185,129,0.08)' :
                    respuestas[p.id] === opIdx ? 'rgba(0,51,102,0.06)' : '#fff',
                  cursor: enviado ? 'default' : 'pointer', fontWeight: respuestas[p.id] === opIdx ? '600' : '400',
                  color: '#1f2937', transition: 'all 0.15s'
                }}>
                <span style={{ color: '#94a3b8', marginRight: '8px' }}>{String.fromCharCode(65 + opIdx)}.</span> {op}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        {!enviado ? (
          <button onClick={evaluar} disabled={Object.keys(respuestas).length < preguntas.length}
            style={{ flex: 1, padding: '12px', background: Object.keys(respuestas).length >= preguntas.length ? '#003366' : '#94a3b8',
              color: '#fff', border: 'none', borderRadius: '8px', cursor: Object.keys(respuestas).length >= preguntas.length ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Evaluar Respuestas
          </button>
        ) : (
          <button onClick={reiniciar} style={{ flex: 1, padding: '12px', background: '#e2e8f0', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <RotateCcw size={16} /> Intentar Nuevamente
          </button>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   CONTENIDO TEÓRICO POR MÓDULO
   ================================================================ */
const contenidoTeorico = {
  1: {
    titulo: 'Fundamentos de Inteligencia Artificial en Oil & Gas',
    temas: [
      { titulo: 'Machine Learning Supervisado', contenido: 'Algoritmos que aprenden de datos etiquetados para predecir resultados. Aplicaciones: predicción de producción, clasificación de formaciones litológicas, estimación de parámetros petrofísicos.' },
      { titulo: 'Deep Learning y Redes Neuronales', contenido: 'Arquitecturas de capas multicapa (MLP, CNN, RNN) capaces de capturar patrones complejos en datos sísmicos, imágenes de satélite y series temporales de sensores industriales.' },
      { titulo: 'Mantenimiento Predictivo', contenido: 'Uso de modelos de ML para predecir fallas en equipos críticos como bombas electrosumergibles (BES), compresores y turbinas, reduciendo paradas no programadas hasta en un 40%.' }
    ]
  },
  2: {
    titulo: 'Prompt Engineering para la Industria Petrolera',
    temas: [
      { titulo: 'Marco RICE', contenido: 'Estructura para crear prompts de alta precisión: Role (quién es la IA), Instructions (qué debe hacer), Context (información relevante del dominio), Examples (formato esperado de salida).' },
      { titulo: 'Técnicas Avanzadas', contenido: 'Zero-Shot (sin ejemplos), Few-Shot (2-3 ejemplos), Chain-of-Thought (razonamiento paso a paso). Aplicación en generación de reportes de perforación y auditorías operacionales.' },
      { titulo: 'Mitigación de Alucinaciones', contenido: 'Estrategias para reducir respuestas incorrectas: acotar el contexto, pedir fuentes, usar verificación cruzada y establecer límites de conocimiento del modelo.' }
    ]
  },
  3: {
    titulo: 'Gemelos Digitales en la Industria de Hidrocarburos',
    temas: [
      { titulo: 'Arquitectura de Gemelos', contenido: 'Réplica virtual sincronizada con activos físicos mediante IoT. Componentes: sensores, plataforma de integración, motor de simulación, dashboard de visualización.' },
      { titulo: 'Integración SCADA/IoT', contenido: 'Protocolos de comunicación industrial (Modbus, OPC-UA, MQTT) que conectan sensores de campo con plataformas de gemelos digitales en tiempo real.' },
      { titulo: 'Simulación y Predicción', contenido: 'Modelos numéricos que simulan el comportamiento de procesos de refinación, permitiendo probar escenarios de operación sin riesgo en la planta real.' }
    ]
  },
  4: {
    titulo: 'IA Generativa Aplicada a Petrofísica',
    temas: [
      { titulo: 'Large Language Models (LLMs)', contenido: 'Modelos de lenguaje como GPT que pueden generar código Python, informes técnicos y análisis automatizados a partir de instrucciones en lenguaje natural.' },
      { titulo: 'Procesamiento de Archivos LAS', contenido: 'Los archivos LAS contienen registros de pozos (Gamma Ray, Resistividad, Densidad). Python con librerías como lasio permite automatizar su análisis y visualización.' },
      { titulo: 'Automatización de Reportes', contenido: 'Generación automática de informes petrofísicos con estadísticas, gráficos y clasificaciones litológicas usando scripts de Python ejecutables.' }
    ]
  }
};

const preguntasEvaluacion = {
  1: [
    { id: 1, pregunta: '¿Qué tipo de algoritmo es más adecuado para predecir la probabilidad de falla de una BES basándose en datos históricos etiquetados?', opciones: ['Aprendizaje no supervisado (clustering)', 'Aprendizaje supervisado (clasificación/regresión)', 'Procesamiento de lenguaje natural', 'Generación de imágenes'], correcta: 1 },
    { id: 2, pregunta: '¿Cuál es la variable que MÁS contribuye al riesgo de falla en una bomba electrosumergible según el modelo del simulador?', opciones: ['Presión de succión', 'Temperatura del motor y vibración', 'Color del fluido', 'Hora del día'], correcta: 1 },
    { id: 3, pregunta: '¿Qué significa RUL (Remaining Useful Life) en el contexto de mantenimiento predictivo?', opciones: ['Relación Unificada de Laboratorio', 'Vida Útil Restante del equipo', 'Registro Último de Lecturas', 'Unidad de Rendimiento Logístico'], correcta: 1 }
  ],
  2: [
    { id: 1, pregunta: 'En el marco RICE, ¿qué componente define el formato y estructura esperada de la respuesta del modelo?', opciones: ['R - Role (Rol)', 'I - Instructions (Instrucciones)', 'C - Context (Contexto)', 'E - Examples (Ejemplos)'], correcta: 3 },
    { id: 2, pregunta: '¿Qué técnica de prompting es más efectiva para que la IA genere un análisis paso a paso de un informe de perforación?', opciones: ['Zero-Shot directo', 'Chain-of-Thought (razonamiento encadenado)', 'Prompt de sistema genérico', 'Instrucción en mayúsculas'], correcta: 1 },
    { id: 3, pregunta: '¿Cómo se mitigan las alucinaciones de un LLM al generar reportes técnicos de pozos?', opciones: ['Usando prompts más cortos', 'Acotando el contexto, pidiendo fuentes y verificación cruzada', 'Eliminando toda instrucción', 'Usando solo una palabra clave'], correcta: 1 }
  ],
  3: [
    { id: 1, pregunta: '¿Qué protocolo industrial se utiliza comúnmente para la comunicación entre sensores IoT y plataformas de gemelos digitales en refinerías?', opciones: ['HTTP/HTTPS exclusivamente', 'OPC-UA, Modbus, MQTT', 'FTP para transferencia de archivos', 'SMTP para alertas'], correcta: 1 },
    { id: 2, pregunta: '¿Cuál es el principal beneficio de un gemelo digital de una Planta de Fraccionamiento?', opciones: ['Reemplazar completamente al personal de planta', 'Simular escenarios de operación sin riesgo en la planta real', 'Eliminar la necesidad de sensores físicos', 'Reducir el consumo de energía eléctrica'], correcta: 1 },
    { id: 3, pregunta: '¿Qué indica una válvula en estado "cerrada" en el panel del gemelo digital cuando se detecta sobrepresión?', opciones: ['La válvula falló mecánicamente', 'Se abrió automáticamente como protocolo de seguridad', 'No hay presión en el sistema', 'El sensor está desconectado'], correcta: 1 }
  ],
  4: [
    { id: 1, pregunta: '¿Qué librería de Python se utiliza para leer y procesar archivos LAS (registros de pozos petroleros)?', opciones: ['pandas', 'lasio', 'matplotlib', 'tensorflow'], correcta: 1 },
    { id: 2, pregunta: 'En la ecuación de Wyllie para porosidad sónica, ¿qué representan DT_mat y DT_fluido?', opciones: ['Temperatura y flujo del pozo', 'Tiempo de tránsito de la matriz rocosa y del fluido de perforación', 'Densidad de la matriz y del fluido', 'Profundidad del pozo y del sensor'], correcta: 1 },
    { id: 3, pregunta: '¿Cuál es la utilidad de generar scripts Python automatizados para análisis de curvas de registro?', opciones: ['Solo sirven para crear gráficos decorativos', 'Permiten procesamiento masivo, reproducible y auditado de datos petrofísicos', 'Eliminan la necesidad de ingenieros de pozos', 'Solo funcionan con archivos de texto plano'], correcta: 1 }
  ]
};

/* ================================================================
   COMPONENTE PRINCIPAL: MÓDULO DETALLE
   ================================================================ */
const ModuloDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [leccionActiva, setLeccionActiva] = useState(null);
  const [tabActiva, setTabActiva] = useState('teoria');
  const [modulosCompletados, setModulosCompletados] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModulo = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/modulos/${id}`);
        setModulo(res.data);
        if (res.data.lecciones?.length > 0) setLeccionActiva(res.data.lecciones[0]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchModulo();
  }, [id]);

  const completarLeccion = async (leccionId) => {
    try {
      await axios.post(`${API_URL}/courses/lecciones/completar`, { leccion_id: leccionId });
      setModulo(prev => ({
        ...prev,
        lecciones: prev.lecciones.map(l => l.id === leccionId ? { ...l, completado: true } : l)
      }));
    } catch (err) { console.error(err); }
  };

  const marcarModuloCompletado = () => {
    setModulosCompletados(prev => ({ ...prev, [id]: true }));
  };

  const renderSimulador = () => {
    const num = modulo?.numero_modulo || parseInt(id);
    if (num === 1) return <SimuladorBES />;
    if (num === 2) return <ConstructorRICE />;
    if (num === 3) return <PanelPlanta />;
    if (num === 4) return <GeneradorLAS />;
    return null;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" /></div>;
  if (!modulo) return <div style={{ padding: '40px', textAlign: 'center' }}>Módulo no encontrado</div>;

  const numModulo = modulo.numero_modulo || parseInt(id);
  const teoria = contenidoTeorico[numModulo];
  const preguntas = preguntasEvaluacion[numModulo];

  return (
    <div>
      <button onClick={() => navigate('/cursos')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#003366', cursor: 'pointer', marginBottom: '16px', fontSize: '0.95rem', fontWeight: '500' }}>
        <ArrowLeft size={18} /> Volver a Módulos
      </button>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003366, #001a33)', borderRadius: '16px', padding: '28px', marginBottom: '24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.12)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {modulo.icono}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Módulo {numModulo}</div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>{modulo?.titulo || 'Sin título'}</h1>
          </div>
          {modulosCompletados[id] && (
            <div style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(16,185,129,0.2)', borderRadius: '20px', color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Completado
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
        {[
          { key: 'teoria', label: '📚 Teoría', icon: <BookOpen size={16} /> },
          { key: 'simulador', label: '🔬 Simulador Práctico', icon: <Cpu size={16} /> },
          { key: 'examen', label: '📝 Examen de Validación', icon: <FileText size={16} /> }
        ].map(tab => (
          <button key={tab.key} onClick={() => setTabActiva(tab.key)}
            style={{ flex: 1, padding: '10px', background: tabActiva === tab.key ? '#fff' : 'transparent',
              color: tabActiva === tab.key ? '#003366' : '#6b7280', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontWeight: tabActiva === tab.key ? '600' : '400', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Teoría */}
      {tabActiva === 'teoria' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
          <div>
            <h4 style={{ color: '#003366', marginBottom: '12px' }}>Lecciones</h4>
            <div style={{ display: 'grid', gap: '6px' }}>
              {modulo.lecciones?.map((l, i) => (
                <button key={l.id} onClick={() => setLeccionActiva(l)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: leccionActiva?.id === l.id ? 'rgba(0,51,102,0.06)' : '#fff',
                    border: `2px solid ${leccionActiva?.id === l.id ? '#003366' : '#e5e7eb'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: l.completado ? '#10b981' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {l.completado ? <CheckCircle size={14} color="#fff" /> : <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontWeight: '500' }}>{l?.titulo || 'Sin título'}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            {teoria && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
                <h3 style={{ color: '#003366', marginBottom: '20px' }}>{teoria?.titulo || 'Sin título'}</h3>
                {teoria.temas.map((t, i) => (
                  <div key={i} style={{ marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #003366' }}>
                    <h4 style={{ color: '#003366', marginBottom: '8px', fontSize: '1rem' }}>{t?.titulo || 'Sin título'}</h4>
                    <p style={{ color: '#374151', margin: 0, lineHeight: '1.7', fontSize: '0.9rem' }}>{t.contenido}</p>
                  </div>
                ))}
              </div>
            )}

            {leccionActiva && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ color: '#003366', marginBottom: '16px' }}>{leccionActiva?.titulo || 'Sin título'}</h3>
                <div style={{ lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap', fontSize: '0.92rem' }}>
                  {leccionActiva.contenido_markdown || 'Contenido no disponible'}
                </div>
                {!leccionActiva.completado && (
                  <button onClick={() => completarLeccion(leccionActiva.id)} style={{ marginTop: '20px', padding: '12px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} /> Marcar como Completada
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Simulador */}
      {tabActiva === 'simulador' && renderSimulador()}

      {/* Tab: Examen */}
      {tabActiva === 'examen' && preguntas && (
        <Cuestionario preguntas={preguntas} moduloId={numModulo} onCompletar={marcarModuloCompletado} />
      )}
    </div>
  );
};

export default ModuloDetalle;
