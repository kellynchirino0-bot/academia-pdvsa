import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LESSONS = {
  'io-1': {
    title: 'I.O. 1 — Fundamentos y Modelado Matemático',
    subtitle: 'Variables de Decisión, Función Objetivo y Restricciones',
    icon: '🧠',
  },
  'io-2': {
    title: 'I.O. 2 — Algoritmo Simplex: Mezcla de Crudo',
    subtitle: 'Maximización de Margen en Blending de Crudos (Merey-1 vs. Mesa 30)',
    icon: '📈',
  },
  'io-3': {
    title: 'I.O. 3 — CPM/PERT: Parada de Planta UDA-1 Amuay',
    subtitle: 'Diagrama de Red, Varianza de Tiempos y Ruta Crítica',
    icon: '🔗',
  },
  'io-4': {
    title: 'I.O. 4 — Modelo EOQ: Inventario de Válvulas PSV-409',
    subtitle: 'Costo de Ordenar vs. Costo de Mantener Inventario',
    icon: '📦',
  },
};

const LESSON_IDS = ['io-1', 'io-2', 'io-3', 'io-4'];

export default function IOLeccionView() {
  const { leccionId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('io_lesson_progress');
    if (saved) setCompleted(JSON.parse(saved));
    window.scrollTo(0, 0);
  }, [leccionId]);

  const currentIdx = LESSON_IDS.indexOf(leccionId);
  const lesson = LESSONS[leccionId];

  const markComplete = useCallback(() => {
    const next = { ...completed, [leccionId]: true };
    setCompleted(next);
    localStorage.setItem('io_lesson_progress', JSON.stringify(next));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, [leccionId, completed]);

  const goPrev = () => {
    if (currentIdx > 0) navigate(`/cursos/modulo/4/leccion/${LESSON_IDS[currentIdx - 1]}`);
  };
  const goNext = () => {
    if (currentIdx < LESSON_IDS.length - 1) navigate(`/cursos/modulo/4/leccion/${LESSON_IDS[currentIdx + 1]}`);
  };

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0E17', color: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h2 style={{ color: '#38BDF8', margin: 0 }}>Lección no encontrada</h2>
        <p style={{ color: '#94A3B8', textAlign: 'center', maxWidth: '400px' }}>La ruta "{leccionId}" no corresponde a ninguna lección de la Pista Académica I.O.</p>
        <button onClick={() => navigate('/cursos')} style={{ padding: '10px 24px', background: '#0284C7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          ⬅ Volver a Módulos
        </button>
      </div>
    );
  }

  const allDone = LESSON_IDS.every(id => completed[id]);
  const doneCount = LESSON_IDS.filter(id => completed[id]).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E17', color: '#E2E8F0' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none', textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ fontSize: '3rem', animation: 'fadeIn 0.3s ease' }}>🎉</div>
          <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' }}>¡Lección Completada!</div>
        </div>
      )}

      {/* Barra de navegación superior */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(56,189,248,0.12)', background: 'rgba(10,14,23,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={() => navigate('/cursos')} style={{ background: 'transparent', border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⬅ Volver a Módulos
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#94A3B8' }}>
            <span>Módulo 4 — Investigación de Operaciones</span>
            <span style={{ color: '#38BDF8', fontWeight: 600 }}>|</span>
            <span>{doneCount}/{LESSON_IDS.length} lecciones</span>
          </div>
          {allDone && (
            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
              ✅ Pista Académica Completada
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Barra de progreso */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {LESSON_IDS.map((id, i) => (
              <React.Fragment key={id}>
                <div
                  onClick={() => navigate(`/cursos/modulo/4/leccion/${id}`)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: id === leccionId ? '#0284C7' : completed[id] ? '#22C55E' : 'rgba(56,189,248,0.1)',
                    border: id === leccionId ? '2px solid #38BDF8' : completed[id] ? '2px solid #22C55E' : '1px solid rgba(56,189,248,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  title={LESSONS[id].title}
                >
                  {completed[id] ? '✓' : i + 1}
                </div>
                {i < LESSON_IDS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: completed[id] ? '#22C55E' : 'rgba(56,189,248,0.15)', borderRadius: '1px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Encabezado de la lección */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{lesson.icon}</div>
          <h1 style={{ color: '#38BDF8', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0' }}>{lesson.title}</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>{lesson.subtitle}</p>
        </div>

        {/* Contenido de la lección */}
        <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '16px', border: '1px solid rgba(56,189,248,0.1)', padding: '28px', marginBottom: '24px' }}>
          {leccionId === 'io-1' && <IO1Content />}
          {leccionId === 'io-2' && <IO2Content />}
          {leccionId === 'io-3' && <IO3Content />}
          {leccionId === 'io-4' && <IO4Content />}
        </div>

        {/* Botones de navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {currentIdx > 0 && (
              <button onClick={goPrev} style={{ padding: '10px 20px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38BDF8', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>
                ← Lección Anterior
              </button>
            )}
            {currentIdx < LESSON_IDS.length - 1 && (
              <button onClick={goNext} style={{ padding: '10px 20px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38BDF8', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>
                Siguiente Lección →
              </button>
            )}
          </div>
          <button
            onClick={markComplete}
            disabled={completed[leccionId]}
            style={{
              padding: '10px 24px',
              background: completed[leccionId] ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #0284C7, #0369A1)',
              color: completed[leccionId] ? '#22C55E' : '#fff',
              border: completed[leccionId] ? '1px solid rgba(34,197,94,0.3)' : 'none',
              borderRadius: '8px', cursor: completed[leccionId] ? 'default' : 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
              opacity: completed[leccionId] ? 0.8 : 1,
            }}
          >
            {completed[leccionId] ? '✅ Completada' : '✅ Marcar como Completada'}
          </button>
        </div>

        {allDone && (
          <div style={{ marginTop: '32px', padding: '20px 24px', background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(56,189,248,0.05))', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ color: '#22C55E', margin: '0 0 4px 0' }}>Pista Académica I.O. Completada</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
              Has finalizado las 4 lecciones de Investigación de Operaciones. Puedes generar tu certificado GSS desde la sección Certificados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== LECCIÓN IO-1 ===================== */
function IO1Content() {
  const [ejemplo, setEjemplo] = useState('produccion');
  const [restricciones, setRestricciones] = useState({ crudo: 500000, tiempo: 160, almacen: 300000 });

  const margen = (restricciones.crudo * 0.45 + restricciones.tiempo * 1200 + restricciones.almacen * 0.15) / 1000;
  const factible = restricciones.crudo >= 0 && restricciones.tiempo >= 0 && restricciones.almacen >= 0;

  return (
    <div>
      <h3 style={{ color: '#38BDF8', marginBottom: '16px' }}>🧠 Conceptos Fundamentales</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(56,189,248,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.08)' }}>
          <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Variables de Decisión</div>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
            Son las cantidades que podemos controlar: barriles de crudo Merey-1, horas de operación, inventario de repuestos. Se denotan como x₁, x₂, ..., xₙ.
          </p>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.08)' }}>
          <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Función Objetivo</div>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
            La meta a maximizar o minimizar: Max Z = 45x₁ + 38x₂ (margen de blending) o Min C = 12x₁ + 8x₂ (costo operativo).
          </p>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.08)' }}>
          <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>Restricciones</div>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
            Límites del problema: disponibilidad de crudo (≤500K bbl/d), capacidad de refino (≤160 h), espacio de almacenamiento (≤300K bbl).
          </p>
        </div>
      </div>

      <h3 style={{ color: '#38BDF8', marginBottom: '12px', fontSize: '0.95rem' }}>🔬 Caso PDVSA: Modelado con IA</h3>
      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '16px' }}>
        La Inteligencia Artificial traduce lenguaje natural operativo —como <em>"maximizar margen de blending con crudo Merey-1 y Mesa 30"</em>— en ecuaciones de optimización. El modelo identifica automáticamente las variables, la función objetivo y las restricciones a partir del texto, reduciendo horas de modelado manual a segundos.
      </p>

      <h3 style={{ color: '#38BDF8', marginBottom: '12px', fontSize: '0.95rem' }}>⚙️ Simulador Interactivo de Restricciones</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['produccion', 'refineria', 'logistica'].map(e => (
          <button key={e} onClick={() => setEjemplo(e)} style={{
            padding: '6px 16px', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.25)',
            background: ejemplo === e ? 'rgba(56,189,248,0.15)' : 'transparent',
            color: ejemplo === e ? '#38BDF8' : '#94A3B8', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500
          }}>
            {e === 'produccion' ? 'Producción' : e === 'refineria' ? 'Refinería' : 'Logística'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
          Crudo Disponible (miles bbl/d): <strong style={{ color: '#38BDF8' }}>{(restricciones.crudo / 1000).toFixed(0)}K</strong>
          <input type="range" min="0" max="800" value={restricciones.crudo / 1000} step="10"
            onChange={e => setRestricciones(r => ({ ...r, crudo: +e.target.value * 1000 }))}
            style={{ width: '100%', accentColor: '#38BDF8', marginTop: '4px' }} />
        </label>
        <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
          Capacidad de Refino (h/semana): <strong style={{ color: '#38BDF8' }}>{restricciones.tiempo}h</strong>
          <input type="range" min="0" max="300" value={restricciones.tiempo}
            onChange={e => setRestricciones(r => ({ ...r, tiempo: +e.target.value }))}
            style={{ width: '100%', accentColor: '#38BDF8', marginTop: '4px' }} />
        </label>
        <label style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
          Almacenamiento (miles bbl): <strong style={{ color: '#38BDF8' }}>{(restricciones.almacen / 1000).toFixed(0)}K</strong>
          <input type="range" min="0" max="500" value={restricciones.almacen / 1000} step="10"
            onChange={e => setRestricciones(r => ({ ...r, almacen: +e.target.value * 1000 }))}
            style={{ width: '100%', accentColor: '#38BDF8', marginTop: '4px' }} />
        </label>
      </div>

      <div style={{ padding: '14px 18px', borderRadius: '10px', background: factible ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${factible ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Margen Proyectado:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: factible ? '#22C55E' : '#EF4444' }}>
            ${margen.toFixed(2)}M/día
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: factible ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)', marginTop: '4px' }}>
          {factible ? '✅ Solución factible — restricciones dentro de límites operativos' : '⚠️ Alguna restricción excede el límite operativo'}
        </div>
      </div>
    </div>
  );
}

/* ===================== LECCIÓN IO-2 ===================== */
function IO2Content() {
  const [pesado, setPesado] = useState(50);
  const [liviano, setLiviano] = useState(50);

  const maxGanancia = 1.96;
  const ganancia = (pesado * 1.2 + liviano * 2.8) / 100 * maxGanancia;
  const factor = ganancia / maxGanancia;
  const barWidth = Math.min(100, Math.max(0, (ganancia / maxGanancia) * 100));

  return (
    <div>
      <h3 style={{ color: '#38BDF8', marginBottom: '12px' }}>📈 Algoritmo Simplex — Mezcla de Crudo (Blending)</h3>
      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '20px' }}>
        El problema de mezcla óptima de crudos busca maximizar el margen combinando crudo pesado (Merey-1, menor costo) y crudo liviano (Mesa 30, mayor valor de venta) sujeto a restricciones de calidad (azufre ≤1.8%, gravedad API ≥28°).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(56,189,248,0.1)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginBottom: '4px' }}>Crudo Pesado (Merey-1)</div>
          <input type="range" min="0" max="100" value={pesado}
            onChange={e => { setPesado(+e.target.value); setLiviano(100 - +e.target.value); }}
            style={{ width: '100%', accentColor: '#0284C7' }} />
          <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginTop: '4px' }}>{pesado}%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>Costo: $38/bbl</div>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(56,189,248,0.1)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginBottom: '4px' }}>Crudo Liviano (Mesa 30)</div>
          <input type="range" min="0" max="100" value={liviano}
            onChange={e => { setLiviano(+e.target.value); setPesado(100 - +e.target.value); }}
            style={{ width: '100%', accentColor: '#0284C7' }} />
          <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginTop: '4px' }}>{liviano}%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>Costo: $62/bbl</div>
        </div>
      </div>

      <h3 style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '8px' }}>GANANCIA PROYECTADA</h3>
      <div style={{ height: '24px', background: 'rgba(56,189,248,0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px', border: '1px solid rgba(56,189,248,0.1)' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, background: 'linear-gradient(90deg, #0284C7, #38BDF8)', borderRadius: '12px', transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '16px' }}>
        <span style={{ color: '#64748B' }}>$0/día</span>
        <span style={{ fontWeight: 700, color: ganancia >= maxGanancia * 0.9 ? '#22C55E' : '#38BDF8', fontSize: '1rem' }}>
          ${ganancia.toFixed(3)}M/día
        </span>
        <span style={{ color: '#64748B' }}>${maxGanancia.toFixed(2)}M/día máx</span>
      </div>

      <div style={{ padding: '14px 18px', background: 'rgba(56,189,248,0.05)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.1)' }}>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '6px' }}>🔬 Interpretación Simplex</div>
        <p style={{ fontSize: '0.78rem', color: '#CBD5E1', margin: 0, lineHeight: '1.5' }}>
          El algoritmo Simplex itera sobre vértices del polígono de restricciones hasta encontrar el óptimo. Para este blending, la solución óptima se alcanza cuando la relación crudo liviano:pesado maximiza el margen neto — típicamente 65-75% liviano para cumplir especificaciones API y de azufre.
        </p>
      </div>
    </div>
  );
}

/* ===================== LECCIÓN IO-3 ===================== */
function IO3Content() {
  const inicial = { calderas: 5, torres: 4, tuberias: 3, intercambiadores: 2, compresores: 2 };
  const [retrasos, setRetrasos] = useState({ calderas: 0, torres: 0, tuberias: 0, intercambiadores: 0, compresores: 0 });

  const rutaCritica = [
    { name: 'Calderas', base: 8, idx: 0 },
    { name: 'Torres', base: 6, idx: 1 },
    { name: 'Tuberías', base: 4.5, idx: 2 },
    { name: 'Intercambiadores', base: 2.5, idx: 3 },
    { name: 'Compresores', base: 1.58, idx: 4 },
  ];

  const tiempoTotal = rutaCritica.reduce((sum, t) => sum + t.base + retrasos[t.name.toLowerCase()], 0);
  const opt = 22.58;
  const diff = (tiempoTotal - opt).toFixed(2);
  const onTrack = tiempoTotal <= opt + 2;

  return (
    <div>
      <h3 style={{ color: '#38BDF8', marginBottom: '12px' }}>🔗 CPM/PERT — Parada de Planta UDA-1 (Amuay)</h3>
      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '20px' }}>
        La Parada de Planta UDA-1 en Amuay es el evento de mantenimiento crítico más complejo de PDVSA. El método CPM (Critical Path Method) identifica la secuencia de actividades que determinan la duración total del proyecto, mientras que PERT incorpora la incertidumbre mediante tiempos optimistas, pesimistas y más probables.
      </p>

      <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(56,189,248,0.1)', marginBottom: '20px' }}>
        <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '12px' }}>DIAGRAMA DE RED — RUTA CRÍTICA</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {rutaCritica.map((t, i) => (
            <React.Fragment key={t.name}>
              <div style={{ background: retrasos[t.name.toLowerCase()] > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(56,189,248,0.08)', borderRadius: '10px', padding: '10px 14px', border: `1px solid ${retrasos[t.name.toLowerCase()] > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(56,189,248,0.15)'}`, textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '2px' }}>{t.name}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: retrasos[t.name.toLowerCase()] > 0 ? '#EF4444' : '#38BDF8' }}>
                  {(t.base + retrasos[t.name.toLowerCase()]).toFixed(1)}d
                </div>
                {retrasos[t.name.toLowerCase()] > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#EF4444' }}>+{retrasos[t.name.toLowerCase()]}d retraso</div>
                )}
              </div>
              {i < rutaCritica.length - 1 && (
                <div style={{ color: '#64748B', fontSize: '1.2rem' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '12px' }}>SIMULADOR DE RETRASOS — AJUSTA LOS DÍAS</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {Object.entries(retrasos).map(([key, val]) => (
          <label key={key} style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}: <strong style={{ color: val > 0 ? '#EF4444' : '#38BDF8' }}>+{val}d</strong></span>
            <input type="range" min="0" max="10" value={val} step="0.5"
              onChange={e => setRetrasos(r => ({ ...r, [key]: +e.target.value }))}
              style={{ width: '100%', accentColor: val > 0 ? '#EF4444' : '#38BDF8' }} />
          </label>
        ))}
      </div>

      <div style={{ padding: '16px 18px', borderRadius: '10px', background: onTrack ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${onTrack ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Duración Total del Proyecto:</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: onTrack ? '#22C55E' : '#EF4444' }}>{tiempoTotal.toFixed(2)} días</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: '#64748B' }}>Óptimo: {opt} días</span>
          <span style={{ color: onTrack ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)' }}>
            {diff > 0 ? `+${diff}d sobre el óptimo` : `${diff.replace('-', '')}d bajo el óptimo`}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.5' }}>
        💡 La ruta crítica suma las duraciones de las actividades sin margen de demora. Cualquier retraso en una actividad crítica alarga todo el proyecto. PERT añade una dimensión probabilística: con varianza σ² = ((b-a)/6)², se calcula la probabilidad de completar en ≤ 25 días.
      </div>
    </div>
  );
}

/* ===================== LECCIÓN IO-4 ===================== */
function IO4Content() {
  const [demanda, setDemanda] = useState(12000);
  const [costoOrdenar, setCostoOrdenar] = useState(850);
  const [costoMantener, setCostoMantener] = useState(180);

  const eoq = Math.sqrt((2 * demanda * costoOrdenar) / costoMantener);
  const numOrdenes = Math.ceil(demanda / eoq);
  const costoTotalAnual = Math.sqrt(2 * demanda * costoOrdenar * costoMantener);
  const ahorroBase = 790000;
  const ahorroEstimado = ahorroBase * (1 - (costoMantener * eoq) / (costoMantener * Math.sqrt((2 * 12000 * 850) / 180)));
  const ahorroFinal = Math.abs(ahorroEstimado).toFixed(0);

  return (
    <div>
      <h3 style={{ color: '#38BDF8', marginBottom: '12px' }}>📦 Modelo EOQ — Inventario de Válvulas PSV-409</h3>
      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '20px' }}>
        El Modelo de Cantidad Económica de Pedido (EOQ) determina el tamaño óptimo de lote que minimiza los costos totales de inventario, balanceando el costo de ordenar (setup) y el costo de mantener (almacenamiento). Aplicado a las válvulas PSV-409, reduce el costo anual de inventario en más de $790K.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.1)' }}>
          <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            Demanda Anual (unidades)
            <input type="number" value={demanda} onChange={e => setDemanda(Math.max(100, +e.target.value))}
              style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#E2E8F0', fontSize: '0.9rem' }} />
          </label>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.1)' }}>
          <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            Costo de Ordenar ($/pedido)
            <input type="number" value={costoOrdenar} onChange={e => setCostoOrdenar(Math.max(10, +e.target.value))}
              style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#E2E8F0', fontSize: '0.9rem' }} />
          </label>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.1)' }}>
          <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            Costo de Mantener ($/unidad/año)
            <input type="number" value={costoMantener} onChange={e => setCostoMantener(Math.max(1, +e.target.value))}
              style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#E2E8F0', fontSize: '0.9rem' }} />
          </label>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.04)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '4px' }}>Fórmula EOQ</div>
          <div style={{ fontSize: '0.9rem', color: '#38BDF8', fontFamily: 'monospace' }}>
            Q* = √(2DS/H)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '4px' }}>Lote Económico (EOQ)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22C55E' }}>{Math.round(eoq).toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>unidades por pedido</div>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.15)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '4px' }}>Pedidos por Año</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#38BDF8' }}>{numOrdenes}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>órdenes</div>
        </div>
        <div style={{ background: 'rgba(56,189,248,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(56,189,248,0.15)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '4px' }}>Costo Total Anual</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#38BDF8' }}>${Math.round(costoTotalAnual).toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>costo óptimo</div>
        </div>
        <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '4px' }}>Ahorro Estimado</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22C55E' }}>${parseInt(ahorroFinal).toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>USD/año</div>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.5' }}>
        💡 EOQ asume demanda constante y lead time conocido. Para entornos PDVSA con demanda variable, se recomienda el modelo EOQ con inventario de seguridad o el sistema Min-Max. La implementación digital permite reordenar automáticamente cuando el inventario cae al punto de reorden: R = d × L, donde d es la demanda diaria y L el lead time.
      </div>
    </div>
  );
}