import React, { useState, useCallback } from 'react';
import Scene3D from './Scene3D';
import * as THREE from 'three';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';

const buildWellScene = (scene) => {
  // Ground platform
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(4, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.8 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  scene.add(ground);

  // Wellhead / Christmas tree
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 }));
  base.position.y = 0.15;
  scene.add(base);

  const wellPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 }));
  wellPipe.position.y = 1.15;
  scene.add(wellPipe);

  // Pumpjack (balancín) geometry
  const samsonPost = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.15), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 }));
  samsonPost.position.set(0.8, 0.8, 0);
  scene.add(samsonPost);

  const walkingBeam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.12), new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.5 }));
  walkingBeam.position.set(-0.1, 1.4, 0);
  scene.add(walkingBeam);

  const horseHead = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.3, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
  horseHead.position.set(-0.9, 1.15, 0);
  horseHead.rotation.z = 0.3;
  scene.add(horseHead);

  const crankWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 }));
  crankWheel.position.set(0.8, 0.2, 0);
  crankWheel.rotation.x = Math.PI / 2;
  scene.add(crankWheel);

  // Instruments: pressure gauge
  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
  gauge.position.set(0.3, 0.4, 0.3);
  scene.add(gauge);

  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
  gaugeFace.position.set(0.3, 0.425, 0.3);
  scene.add(gaugeFace);

  // Flow meter
  const flowMeter = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.15), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
  flowMeter.position.set(-0.2, 0.3, 0.3);
  scene.add(flowMeter);
};

const SimuladorPetroleo = () => {
  const [frecuencia, setFrecuencia] = useState(45);
  const [pozos, setPozos] = useState(10);
  const produccion = Math.round(frecuencia * pozos * 1.2);
  const ahorroDiario = Math.round(frecuencia * pozos * 245);
  const ahorroAnual = ahorroDiario * 365;

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Courier New', 'Segoe UI', monospace", padding: '30px' }}>
      <h1 style={{ color: '#F8FAFC', fontSize: '22px', marginBottom: '4px' }}>Simulador 3D — Producción Petrolera IA/IO</h1>
      <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '24px' }}>Sistema de Elevación Artificial — Optimización Simplex en Tiempo Real</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px' }}>
          <Scene3D sceneObjects={buildWellScene} height="450px" />
        </div>
        <div style={{ flex: '1 1 300px', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ color: '#38BDF8', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} /> Control de Producción
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Frecuencia Variador (Hz)</label>
            <input type="range" min="15" max="65" value={frecuencia} onChange={e => setFrecuencia(Number(e.target.value))} style={{ width: '100%', accentColor: '#22C55E' }} />
            <span style={{ color: '#22C55E', fontSize: '14px', fontWeight: 'bold' }}>{frecuencia} Hz</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94A3B8', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Pozos en Operación</label>
            <input type="range" min="1" max="50" value={pozos} onChange={e => setPozos(Number(e.target.value))} style={{ width: '100%', accentColor: '#38BDF8' }} />
            <span style={{ color: '#38BDF8', fontSize: '14px', fontWeight: 'bold' }}>{pozos} pozos</span>
          </div>

          <div style={{ background: '#090D16', borderRadius: '8px', padding: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Producción Total</span>
              <span style={{ color: '#22D3EE', fontWeight: 'bold' }}>{produccion.toLocaleString()} bbl/día</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Ahorro Diario Estimado</span>
              <span style={{ color: '#22C55E', fontWeight: 'bold' }}>${ahorroDiario.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Ahorro Anual Proyectado</span>
              <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>${ahorroAnual.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '10px', color: '#64748B' }}>
            <span style={{ color: '#22C55E' }}>✓</span> Manómetro cabezal: {Math.round(frecuencia * 2.3 + 120)} psi
            {' | '}
            <span style={{ color: '#38BDF8' }}>⟐</span> Flujo multifásico: {Math.round(produccion * 0.85)} bbl/día
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladorPetroleo;
