import React, { useState } from 'react';
import Scene3D from './Scene3D';
import * as THREE from 'three';
import { Thermometer, Droplets, AlertTriangle } from 'lucide-react';

const buildBoilerScene = (scene) => {
  // Boiler main body
  const boiler = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 2.5, 24),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.5 })
  );
  boiler.position.y = 1.25;
  scene.add(boiler);

  // Cutaway section (transparent)
  const cutaway = new THREE.Mesh(
    new THREE.CylinderGeometry(1.52, 1.52, 2.52, 24, 1, true, 0, Math.PI * 0.6),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
  );
  cutaway.position.y = 1.25;
  scene.add(cutaway);

  // Internal tubes (fire tubes)
  for (let i = 0; i < 7; i++) {
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.3, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3 })
    );
    const angle = (i / 7) * Math.PI * 2;
    tube.position.set(Math.cos(angle) * 0.6, 1.25, Math.sin(angle) * 0.6);
    scene.add(tube);
  }

  // Water level column
  const waterColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 })
  );
  waterColumn.position.set(-1.3, 1.15, 0);
  scene.add(waterColumn);

  // Pressure relief valve
  const valve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.15, 12),
    new THREE.MeshStandardMaterial({ color: 0xef4444 })
  );
  valve.position.set(0.8, 2.5, 0.8);
  scene.add(valve);

  // Burner (base)
  const burner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.6, 0.2, 12),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.2 })
  );
  burner.position.y = 0.1;
  scene.add(burner);

  // Stack
  const stack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.8, 10),
    new THREE.MeshStandardMaterial({ color: 0x64748b })
  );
  stack.position.set(0, 2.8, 0);
  scene.add(stack);

  // Pressure gauge
  const pg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 14), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
  pg.position.set(1.2, 2.2, 0);
  scene.add(pg);
};

const SimuladorCalderas = () => {
  const [nivelAgua, setNivelAgua] = useState(70);
  const [presion, setPresion] = useState(85);
  const [pasos, setPasos] = useState(0);

  const protocoloLIMS = [
    '1. Verificar nivel de agua en columna',
    '2. Purgar lodos del fondo',
    '3. Comprobar presostatos de seguridad',
    '4. Probar válvula de alivio',
    '5. Verificar llama de combustión',
    '6. Registrar parámetros en LIMS'
  ];

  const alerta = nivelAgua < 30 ? 'CRÍTICO: Bajo nivel de agua — Riesgo de sobrecalentamiento' :
    presion > 95 ? 'ALERTA: Presión excediendo límite seguro' : null;

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace", padding: '30px' }}>
      <h1 style={{ color: '#F8FAFC', fontSize: '22px', marginBottom: '4px' }}>Simulador 3D — Caldera Industrial / Boiler</h1>
      <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '24px' }}>Vista de corte — Protocolo LIMS — INCES / PDVSA</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px' }}>
          <Scene3D sceneObjects={buildBoilerScene} height="450px" />
        </div>
        <div style={{ flex: '1 1 300px', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#38BDF8', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={16} /> Instrumentación y Control
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Nivel de Agua (%)</label>
            <input type="range" min="10" max="100" value={nivelAgua} onChange={e => setNivelAgua(Number(e.target.value))} style={{ width: '100%', accentColor: nivelAgua < 30 ? '#EF4444' : '#22C55E' }} />
            <span style={{ color: nivelAgua < 30 ? '#EF4444' : '#22C55E', fontWeight: 'bold' }}>{nivelAgua}%</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Presión Interna (psi)</label>
            <input type="range" min="30" max="120" value={presion} onChange={e => setPresion(Number(e.target.value))} style={{ width: '100%', accentColor: presion > 95 ? '#EF4444' : '#FBBF24' }} />
            <span style={{ color: presion > 95 ? '#EF4444' : '#FBBF24', fontWeight: 'bold' }}>{presion} psi</span>
          </div>

          {alerta && (
            <div style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '6px', color: '#EF4444', fontSize: '11px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> {alerta}
            </div>
          )}

          <div style={{ background: '#090D16', borderRadius: '8px', padding: '12px' }}>
            <h4 style={{ color: '#F8FAFC', fontSize: '11px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={12} color="#22D3EE" /> Protocolo LIMS
            </h4>
            {protocoloLIMS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 0', fontSize: '10px', color: i <= pasos ? '#22C55E' : '#64748B', cursor: 'pointer' }}
                onClick={() => setPasos(i)}>
                {i <= pasos ? '✓' : '○'} {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorCalderas;
