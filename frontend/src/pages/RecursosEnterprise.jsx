import React, { useState } from 'react';
import MatrizEnfoqueEjecutivo from '../components/MatrizEnfoqueEjecutivo';

export const RecursosEnterprise = () => {
  const [copiadoIdx, setCopiadoIdx] = useState(null);

  const postsRedes = [
    {
      titulo: "Post 1: Lanzamiento Estrat\u00e9gico (Soberan\u00eda e Industria 4.0)",
      copy: "PDVSA da el salto a la Industria 4.0 con Soberan\u00eda Tecnol\u00f3gica.\n\nNasser Group, junto a GabrielBiz Galaxy e IUTPAL, presenta el programa \"IA para L\u00edderes de Negocio\": capacitaci\u00f3n de alto nivel en Inteligencia Artificial Generativa e Investigaci\u00f3n de Operaciones.\n\n\u2705 Optimizaci\u00f3n de mezclas de crudo con M\u00e9todo Simplex.\n\u2705 Gesti\u00f3n de paradas de planta con CPM/PERT.\n\u2705 Criptograf\u00eda Post-Cu\u00e1ntica ML-DSA para protecci\u00f3n de datos nacionales.\n\nNo es solo tecnolog\u00eda; es continuidad operativa y toma de decisiones matem\u00e1ticas."
    },
    {
      titulo: "Post 2: Enfoque T\u00e9cnico-Operativo (Simulador GPT + I.O.)",
      copy: "\u00bfParada de planta o falla cr\u00edtica? La IA decide en segundos.\n\nPresentamos el Simulador de Prompts GPT integrado con modelos de Investigaci\u00f3n de Operaciones. Nuestros l\u00edderes aprenden a:\n\u00a0Calcular inventarios \u00f3ptimos (EOQ) para evitar desabastecimiento.\n\u00a0Redactar protocolos HSE instant\u00e1neos bajo normas COVENIN.\n\u00a0Validar cada decisi\u00f3n con trazabilidad blockchain en LagoChain.\n\nTransformamos la burocracia en eficiencia operativa real."
    },
    {
      titulo: "Post 3: Validez Acad\u00e9mica e Inmutabilidad Criptogr\u00e1fica",
      copy: "Certificaci\u00f3n con Validez Acad\u00e9mica y Trazabilidad Forense.\n\nCada participante recibe un certificado avalado por el IUTPAL (Universidad Polit\u00e9cnica Territorial del Zulia) y registrado en nuestra blockchain LagoChain. Garantizamos que el talento formado en PDVSA posee competencias verificables, inmutables y alineadas a los est\u00e1ndares globales de seguridad industrial.\n\nFormaci\u00f3n In-Company | Cabimas & Sede Corporativa."
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
          Activos de alto impacto, estrategia de medios y respaldos de soberan\u00eda digital para Nasser Group & IUTPAL.
        </p>
      </div>

      <MatrizEnfoqueEjecutivo />

      <h2 style={{ color: '#FFF', fontSize: '20px', borderLeft: '4px solid #38BDF8', paddingLeft: '10px', marginBottom: '20px' }}>
        Conceptos Gr\u00e1ficos de Alto Impacto (Dark Mode Pro)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#F59E0B', marginTop: 0, fontSize: '16px' }}>Imagen A: El L\u00edder Soberano</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Gerente de PDVSA con Digital Twin hologr\u00e1fico de refiner\u00eda y criptograf\u00eda LagoChain. Representa el control nacional y la tecnolog\u00eda de punta.
          </p>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Uso: Portada Dossier / Banner Bienvenida</span>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#10B981', marginTop: 0, fontSize: '16px' }}>Imagen B: Decisi\u00f3n Matem\u00e1tica</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Tablet industrial con modelos Simplex y CPM/PERT sobrevolando la Faja del Orinoco.
          </p>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Uso: M\u00f3dulo I.O. / Presentaciones T\u00e9cnicas</span>
        </div>

        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#EF4444', marginTop: 0, fontSize: '16px' }}>Imagen C: Resiliencia ante Crisis</h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
            Pantalla dividida entre Alerta de Falla El\u00e9ctrica y Respuesta Autom\u00e1tica del Simulador GPT en tiempo real.
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
              {copiadoIdx === idx ? 'Copy Copiado' : 'Copiar Texto para Publicaci\u00f3n'}
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ color: '#FFF', fontSize: '20px', borderLeft: '4px solid #10B981', paddingLeft: '10px', marginBottom: '20px' }}>
        Ficha de Referencias Institucionales y Blindaje
      </h2>

      <div style={{ backgroundColor: '#1E293B', padding: '25px', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', lineHeight: '1.7', color: '#CBD5E1' }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Aval Acad\u00e9mico:</strong> Universidad Polit\u00e9cnica Territorial del Zulia (IUTPAL).
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Plataforma e Infraestructura:</strong> GabrielBiz Galaxy & Nasser Group.
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Seguridad y Criptograf\u00eda:</strong> Red Blockchain LagoChain con firma digital post-cu\u00e1ntica ML-DSA.
        </p>
        <p style={{ margin: 0, color: '#10B981', fontWeight: 'bold' }}>
          Todos los datos procesados en la Academia Virtual permanecen bajo la soberan\u00eda estricta del Estado Venezolano.
        </p>
      </div>
    </div>
  );
};

export default RecursosEnterprise;