import React, { useState } from 'react';
import Scene3D from './Scene3D';
import * as THREE from 'three';
import { Cpu, Zap, Activity } from 'lucide-react';

const buildPLCScene = (scene) => {
  // Control panel cabinet
  const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.5, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 })
  );
  cabinet.position.y = 1.25;
  scene.add(cabinet);

  // HMI Screen
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.3 })
  );
  screen.position.set(0, 1.8, 0.35);
  scene.add(screen);

  // PLC module
  const plc = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.3, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x64748b })
  );
  plc.position.set(0, 1.2, 0.35);
  scene.add(plc);

  // LEDs
  for (let i = 0; i < 4; i++) {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: i < 2 ? 0x22c55e : 0xf59e0b, emissive: i < 2 ? 0x22c55e : 0xf59e0b, emissiveIntensity: 0.5 })
    );
    led.position.set(-0.4 + i * 0.25, 1.35, 0.35);
    scene.add(led);
  }

  // Terminal blocks
  for (let i = 0; i < 8; i++) {
    const term = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.12, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    term.position.set(-0.7 + i * 0.2, 0.9, 0.35);
    scene.add(term);
  }

  // Multimeter (floating nearby)
  const mm = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  mm.position.set(1.5, 0.8, 0);
  scene.add(mm);

  const mmFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.13, 12),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc })
  );
  mmFace.position.set(1.5, 0.8, 0.05);
  scene.add(mmFace);
};

const SimuladorPLC = () => {
  const [temperatura, setTemperatura] = useState(75);
  const [presion, setPresion] = useState(60);
  const [valvula, setValvula] = useState(45);

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace", padding: '30px' }}>
      <h1 style={{ color: '#F8FAFC', fontSize: '22px', marginBottom: '4px' }}>Simulador 3D — PLC / SCADA Industrial</h1>
      <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '24px' }}>Siemens S7-1200 — HMI Virtual — Instrumentación 4-20mA</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px' }}>
          <Scene3D sceneObjects={buildPLCScene} height="450px" />
        </div>
        <div style={{ flex: '1 1 300px', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#38BDF8', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={16} /> Panel de Control — HMI Virtual
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#090D16', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontSize: '10px' }}>Temp. Reactor</div>
              <div style={{ color: temperatura > 90 ? '#EF4444' : '#22D3EE', fontSize: '18px', fontWeight: 'bold' }}>{temperatura}°C</div>
            </div>
            <div style={{ background: '#090D16', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontSize: '10px' }}>Presión Línea</div>
              <div style={{ color: presion > 80 ? '#EF4444' : '#22C55E', fontSize: '18px', fontWeight: 'bold' }}>{presion} psi</div>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Válvula de Control (%)</label>
            <input type="range" min="0" max="100" value={valvula} onChange={e => setValvula(Number(e.target.value))} style={{ width: '100%', accentColor: '#38BDF8' }} />
            <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>{valvula}%</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Setpoint Temperatura</label>
            <input type="range" min="40" max="150" value={temperatura} onChange={e => setTemperatura(Number(e.target.value))} style={{ width: '100%', accentColor: '#F59E0B' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Setpoint Presión</label>
            <input type="range" min="20" max="120" value={presion} onChange={e => setPresion(Number(e.target.value))} style={{ width: '100%', accentColor: '#F59E0B' }} />
          </div>

          <div style={{ background: '#090D16', borderRadius: '6px', padding: '10px', fontSize: '10px', color: '#64748B' }}>
            <div><span style={{ color: '#22C55E' }}>●</span> CPU RUN — Modo Operación Normal</div>
            <div><span style={{ color: valvula > 0 ? '#38BDF8' : '#64748B' }}>●</span> Señal 4-20mA: {Math.round(4 + valvula * 0.16)} mA</div>
            <div><span style={{ color: '#F59E0B' }}>●</span> DI/DO: 8 entradas / 6 salidas activas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPLC;
