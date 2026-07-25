import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MatrizEnfoqueEjecutivo from '../components/MatrizEnfoqueEjecutivo';

export const RecursosEnterprise = () => {
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  const postsRedes = [
    {
      titulo: "Post 1: Lanzamiento Estratégico (Soberanía e Industria 4.0)",
      copy: "PDVSA da el salto a la Industria 4.0 con Soberanía Tecnológica.\n\nNasser Group, junto a GabrielBiz Galaxy e IUTPAL, presenta el programa \"IA para Líderes de Negocio\": capacitación de alto nivel en Inteligencia Artificial Generativa e Investigación de Operaciones.\n\n✅ Optimización de mezclas de crudo con Método Simplex.\n✅ Gestión de paradas de planta con CPM/PERT.\n✅ Criptografía Post-Cuántica ML-DSA para protección de datos nacionales.\n\nNo es solo tecnología; es continuidad operativa y toma de decisiones matemáticas."
    },
    {
      titulo: "Post 2: Enfoque Técnico-Operativo (Simulador GPT + I.O.)",
      copy: "¿Parada de planta o falla crítica? La IA decide en segundos.\n\nPresentamos el Simulador de Prompts GPT integrado con modelos de Investigación de Operaciones. Nuestros líderes aprenden a:\n  Calcular inventarios óptimos (EOQ) para evitar desabastecimiento.\n  Redactar protocolos HSE instantáneos bajo normas COVENIN.\n  Validar cada decisión con trazabilidad blockchain en LagoChain.\n\nTransformamos la burocracia en eficiencia operativa real."
    },
    {
      titulo: "Post 3: Validez Académica e Inmutabilidad Criptográfica",
      copy: "Certificación con Validez Académica y Trazabilidad Forense.\n\nCada participante recibe un certificado avalado por el IUTPAL (Universidad Politécnica Territorial del Zulia) y registrado en nuestra blockchain LagoChain. Garantizamos que el talento formado en PDVSA posee competencias verificables, inmutables y alineadas a los estándares globales de seguridad industrial.\n\nFormación In-Company | Cabimas & Sede Corporativa."
    }
  ];

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiadoIdx(index);
    setTimeout(() => setCopiadoIdx(null), 2000);
  };

  return (
    <div style={{ backgroundColor: '#0A0E17', color: '#E2E8F0', minHeight: '100vh', padding: '30px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ borderBottom: '2px solid #D32F2F', paddingBottom: '15px', marginBottom: '30px' }}>
        <span style={{ backgroundColor: '#D32F2F', color: '#FFF', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
          ENTERPRISE MARKETING & BRANDING
        </span>
        <h1 style={{ color: '#38BDF8', margin: '10px 0 5px 0', fontSize: '28px' }}>
          Centro de Recursos y Referencias Institucionales PDVSA
        </h1>
        <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
          Activos de alto impacto, estrategia de medios y respaldos de soberanía digital para Nasser Group & IUTPAL.
        </p>
      </div>

      <div style={{ 
        marginBottom: '24px', 
        padding: '16px 20px', 
        background: 'linear-gradient(135deg, rgba(2,132,199,0.1), rgba(212,168,67,0.06))', 
        borderRadius: '8px', 
        border: '1px solid rgba(2,132,199,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: '700', color: '#38BDF8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Dossier y Plan de Estudios Oficial (PDF)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
            Descarga el temario académico oficial con el desglose de lecciones por módulo, avalado por IUTPAL, Global Safety Solutions y PDVSA.
          </div>
        </div>
        <Link
          to="/guion-pdf"
          style={{
            padding: '10px 24px',
            background: '#0284C7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Descargar Programa Analítico (PDF)
        </Link>
      </div>

      <MatrizEnfoqueEjecutivo />

      <h2 style={{ color: '#FFF', fontSize: '20px', borderLeft: '4px solid #38BDF8', paddingLeft: '10px', marginBottom: '20px' }}>
        Conceptos Gráficos de Alto Impacto (Dark Mode Pro)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#F59E0B', marginTop: 0, fontSize: '16px' }}>Imagen A: El Líder Soberano</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Gerente de PDVSA con Digital Twin holográfico de refinería y criptografía LagoChain. Representa el control nacional y la tecnología de punta.
          </p>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Uso: Portada Dossier / Banner Bienvenida</span>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#10B981', marginTop: 0, fontSize: '16px' }}>Imagen B: Decisión Matemática</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Tablet industrial con modelos Simplex y CPM/PERT sobrevolando la Faja del Orinoco.
          </p>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Uso: Módulo I.O. / Presentaciones Técnicas</span>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#EF4444', marginTop: 0, fontSize: '16px' }}>Imagen C: Resiliencia ante Crisis</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Pantalla dividida entre Alerta de Falla Eléctrica y Respuesta Automática del Simulador GPT en tiempo real.
          </p>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Uso: Demostraciones en Vivo</span>
        </div>
      </div>

      <h2 style={{ color: '#FFF', fontSize: '20px', borderLeft: '4px solid #F59E0B', paddingLeft: '10px', marginBottom: '20px' }}>
        Copys Oficiales para Comunicaciones y Redes Sociales
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {postsRedes.map((post, idx) => (
          <div key={idx} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: '#38BDF8', marginTop: 0, fontSize: '15px' }}>{post.titulo}</h3>
              <pre style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '180px', overflowY: 'auto' }}>
                {post.copy}
              </pre>
            </div>
            <button
              onClick={() => handleCopyText(post.copy, idx)}
              style={{
                marginTop: '15px',
                backgroundColor: copiadoIdx === idx ? '#10B981' : '#0284C7',
                color: '#FFF',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {copiadoIdx === idx ? 'Copy Copiado' : 'Copiar Texto para Publicación'}
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ color: '#FFF', fontSize: '20px', borderLeft: '4px solid #10B981', paddingLeft: '10px', marginBottom: '20px' }}>
        Ficha de Referencias Institucionales y Blindaje
      </h2>

      <div style={{ backgroundColor: '#1E293B', padding: '25px', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', lineHeight: '1.7', color: '#CBD5E1' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Aval Académico:</strong> Universidad Politécnica Territorial del Zulia (IUTPAL).
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Plataforma e Infraestructura:</strong> GabrielBiz Galaxy & Nasser Group.
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Seguridad y Criptografía:</strong> Red Blockchain LagoChain con firma digital post-cuántica ML-DSA.
        </p>
        <p style={{ margin: 0, color: '#10B981', fontWeight: 'bold' }}>
          Todos los datos procesados en la Academia Virtual permanecen bajo la soberanía estricta del Estado Venezolano.
        </p>
      </div>
    </div>
  );
};

export default RecursosEnterprise;