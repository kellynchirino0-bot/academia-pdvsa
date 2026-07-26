import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const industrialAssets = {
  bomba: (scene) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 1.8, 24),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6, roughness: 0.3 })
    );
    body.position.y = 0.9;
    group.add(body);
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.2 })
    );
    top.position.y = 1.8;
    group.add(top);
    const flange = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.08, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5 })
    );
    flange.position.y = 0;
    flange.rotation.x = Math.PI / 2;
    group.add(flange);
    const flange2 = flange.clone();
    flange2.position.y = 1.8;
    group.add(flange2);
    scene.add(group);
    return { group, piezas: [{ mesh: body, nombre: 'Cuerpo de Bomba', estado: 'OPERATIVO' }, { mesh: top, nombre: 'Tapa Superior', estado: 'OPERATIVO' }] };
  },
  valvula: (scene) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.4 })
    );
    group.add(body);
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 })
    );
    stem.position.y = 0.6;
    group.add(stem);
    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.06, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.3 })
    );
    wheel.position.y = 0.9;
    wheel.rotation.x = Math.PI / 2;
    group.add(wheel);
    const pipeL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b })
    );
    pipeL.rotation.z = Math.PI / 2;
    pipeL.position.x = -0.7;
    group.add(pipeL);
    const pipeR = pipeL.clone();
    pipeR.position.x = 0.7;
    group.add(pipeR);
    scene.add(group);
    return { group, piezas: [{ mesh: body, nombre: 'Cuerpo Válvula', estado: 'OPERATIVO' }, { mesh: wheel, nombre: 'Volante', estado: 'OPERATIVO' }] };
  },
  tanque: (scene) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.8, 2.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3, roughness: 0.5 })
    );
    body.position.y = 1.2;
    group.add(body);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3, roughness: 0.5 })
    );
    dome.position.y = 2.4;
    dome.scale.y = 0.5;
    group.add(dome);
    const ladder = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.8, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5 })
    );
    ladder.position.set(1.9, 1.4, 0);
    group.add(ladder);
    scene.add(group);
    return { group, piezas: [{ mesh: body, nombre: 'Tanque Almacenamiento', estado: 'OPERATIVO' }] };
  },
  balancin: (scene) => {
    const group = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.3, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.4, roughness: 0.6 })
    );
    base.position.y = 0.15;
    group.add(base);
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.0, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 })
    );
    post.position.y = 1.15;
    group.add(post);
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.15, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5 })
    );
    beam.position.y = 2.15;
    group.add(beam);
    const counterWeight = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.3 })
    );
    counterWeight.position.set(-1.2, 1.9, 0);
    group.add(counterWeight);
    scene.add(group);
    return { group, piezas: [{ mesh: base, nombre: 'Base Balancín', estado: 'ESTABLE' }, { mesh: beam, nombre: 'Brazo Principal', estado: 'OPERATIVO' }] };
  }
};

const Simulador3D = ({ assetType = 'bomba', width = '100%', height = '400px', onPieceClick }) => {
  const mountRef = useRef(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(4, 3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.target.set(0, 0.8, 0);

    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-3, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.3);
    rimLight.position.set(0, -2, 5);
    scene.add(rimLight);

    const gridHelper = new THREE.GridHelper(10, 10, 0x22c55e, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    const assetFn = industrialAssets[assetType] || industrialAssets.bomba;
    const { group, piezas } = assetFn(scene);
    setPieces(piezas);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        const pieza = piezas.find(p => p.mesh === clicked);
        if (pieza) {
          setSelectedPiece(pieza);
          if (onPieceClick) onPieceClick(pieza);
        }
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('click', handleClick);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [assetType, onPieceClick]);

  return (
    <div style={{ position: 'relative', width, borderRadius: '10px', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height }} />
      {selectedPiece && (
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px', right: '12px',
          background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56,189,248,0.2)', borderRadius: '8px',
          padding: '10px 14px', color: '#E2E8F0', fontSize: '12px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedPiece.estado === 'OPERATIVO' ? '#22C55E' : selectedPiece.estado === 'ALERTA' ? '#F59E0B' : '#EF4444', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#F8FAFC' }}>{selectedPiece.nombre}</strong>
            <span style={{ marginLeft: '8px', color: '#22C55E' }}>COVENIN 3049-93: {selectedPiece.estado}</span>
          </div>
          <button onClick={() => setSelectedPiece(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px' }}>✕</button>
        </div>
      )}
    </div>
  );
};

export default Simulador3D;
