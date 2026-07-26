import React, { useState } from 'react';
import Scene3D from './Scene3D';
import * as THREE from 'three';
import { Flame, Crosshair, Shield, AlertTriangle } from 'lucide-react';

const buildWeldScene = (scene) => {
  // Pipe joint (beveled pipe connection)
  const pipe1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1.5, 20),
    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.7 })
  );
  pipe1.position.set(-0.8, 0.8, 0);
  pipe1.rotation.z = 0.3;
  scene.add(pipe1);

  const pipe2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1.5, 20),
    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.7 })
  );
  pipe2.position.set(0.8, 0.8, 0);
  pipe2.rotation.z = -0.3;
  scene.add(pipe2);

  // Weld bead
  const bead = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.06, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.2 })
  );
  bead.position.set(0, 0.8, 0);
  bead.rotation.x = Math.PI / 2;
  scene.add(bead);

  // Weld cap (second layer)
  const cap = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.04, 10, 24),
    new THREE.MeshStandardMaterial({ color: 0x22c55e })
  );
  cap.position.set(0, 0.8, 0.05);
  cap.rotation.x = Math.PI / 2;
  scene.add(cap);

  // Electrode / Torch
  const torch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.5 })
  );
  torch.position.set(0.3, 1.3, 0.3);
  torch.rotation.x = 0.5;
  scene.add(torch);

  // Arc flash (small glowing sphere)
  const arc = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 2 })
  );
  arc.position.set(0.1, 0.85, 0.1);
  scene.add(arc);

  // NDT defects (porosity indicators)
  for (let i = 0; i < 3; i++) {
    const defect = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    defect.position.set(-0.15 + i * 0.15, 0.8, 0.15);
    scene.add(defect);
  }
};

const SimuladorSoldadura = () => {
  const [angulo, setAngulo] = useState(45);
  const [distanciaArco, setDistanciaArco] = useState(3);
  const [velocidad, setVelocidad] = useState(5);
  const [inspection, setInspection] = useState(null);
  const [defectos, setDefectos] = useState([]);

  const score = Math.max(0, Math.min(100,
    30 - Math.abs(angulo - 60) * 0.5 +
    30 - Math.abs(distanciaArco - 2.5) * 10 +
    30 - Math.abs(velocidad - 4) * 5 +
    10
  ));

  const ejecutarNDT = () => {
    const found = [];
    if (angulo < 40 || angulo > 70) found.push('Falta de penetración — ángulo incorrecto');
    if (distanciaArco < 1.5 || distanciaArco > 4) found.push('Porosidad — distancia de arco inestable');
    if (velocidad < 2 || velocidad > 7) found.push('Socavación — velocidad inadecuada');
    if (found.length === 0) found.push('Cordón OK — Sin defectos detectados');
    setDefectos(found);
    setInspection('Completada');
  };

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace", padding: '30px' }}>
      <h1 style={{ color: '#F8FAFC', fontSize: '22px', marginBottom: '4px' }}>Simulador 3D — Soldadura AWS Nivel 2 + IA</h1>
      <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '24px' }}>Estándar AWS D1.1 / API 1104 — SMAW/GTAW/GMAW — NDT Inspection</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px' }}>
          <Scene3D sceneObjects={buildWeldScene} height="450px" />
        </div>
        <div style={{ flex: '1 1 300px', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#FBBF24', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} /> Control de Antorcha
          </h3>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Ángulo de Ataque (°)</label>
            <input type="range" min="20" max="80" value={angulo} onChange={e => setAngulo(Number(e.target.value))} style={{ width: '100%', accentColor: '#FBBF24' }} />
            <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{angulo}°</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Distancia de Arco (mm)</label>
            <input type="range" min="1" max="6" step="0.5" value={distanciaArco} onChange={e => setDistanciaArco(Number(e.target.value))} style={{ width: '100%', accentColor: '#38BDF8' }} />
            <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>{distanciaArco} mm</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '2px' }}>Velocidad de Avance (mm/s)</label>
            <input type="range" min="1" max="10" value={velocidad} onChange={e => setVelocidad(Number(e.target.value))} style={{ width: '100%', accentColor: '#22C55E' }} />
            <span style={{ color: '#22C55E', fontWeight: 'bold' }}>{velocidad} mm/s</span>
          </div>

          <div style={{ background: '#090D16', borderRadius: '8px', padding: '12px', marginBottom: '12px', textAlign: 'center' }}>
            <div style={{ color: '#64748B', fontSize: '10px', letterSpacing: '1px' }}>CALIDAD DEL CORDÓN</div>
            <div style={{ color: score >= 70 ? '#22C55E' : score >= 40 ? '#FBBF24' : '#EF4444', fontSize: '28px', fontWeight: 'bold' }}>{Math.round(score)}%</div>
          </div>

          <button onClick={ejecutarNDT}
            style={{ width: '100%', padding: '10px', background: '#1E293B', color: '#38BDF8', border: '1px solid #38BDF8', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
            <Crosshair size={14} /> Ejecutar Inspección NDT (IA)
          </button>

          {defectos.length > 0 && (
            <div style={{ background: defectos[0] === 'Cordón OK' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${defectos[0] === 'Cordón OK' ? '#22C55E' : '#EF4444'}`, borderRadius: '6px', padding: '10px' }}>
              <div style={{ color: defectos[0] === 'Cordón OK' ? '#22C55E' : '#EF4444', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> Auditoría IA — Resultados NDT
              </div>
              {defectos.map((d, i) => (
                <div key={i} style={{ fontSize: '10px', color: d === 'Cordón OK' ? '#22C55E' : '#EF4444', padding: '2px 0' }}>
                  {d === 'Cordón OK' ? '✓' : '✗'} {d}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimuladorSoldadura;
