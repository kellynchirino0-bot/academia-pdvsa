import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Shield, Award, Brain, Download, Lock, FileText } from 'lucide-react';

const faqData = [
  {
    id: 1,
    icon: <Lock size={18} />,
    color: '#0891b2',
    pregunta: '¿Mis datos e informes ingresados en la IA son confidenciales?',
    respuesta: 'Sí, la plataforma opera bajo protocolos de soberanía digital y protección de datos respaldados por la red LagoChain e IUTPAL. Nunca se almacenan ni comparten datos sensibles de producción o financieros fuera del entorno seguro de la plataforma.'
  },
  {
    id: 2,
    icon: <Brain size={18} />,
    color: '#003366',
    pregunta: '¿Cómo justifico ante la dirección una decisión asistida por la IA?',
    respuesta: 'Utilizando la opción "Exportar Ficha de Decisión" en el Asistente Ejecutivo IA, la cual genera un reporte formal con el sustento matemático y metodológico (CPM/PERT, Simplex, EOQ). Este documento incluye encabezado institucional Nasser Group / IUTPAL y espacio para firma autorizada.'
  },
  {
    id: 3,
    icon: <Award size={18} />,
    color: '#10b981',
    pregunta: '¿Cómo obtengo mi Certificación Digital Avalada?',
    respuesta: 'Al completar el 100% de las lecciones de los 4 Módulos y aprobar las evaluaciones, el sistema emitirá automáticamente su certificado digital con código QR de verificación pública. Puede acceder desde la sección "Certificaciones" en el menú lateral.'
  },
  {
    id: 4,
    icon: <FileText size={18} />,
    color: '#8b5cf6',
    pregunta: '¿Qué son las Plantillas de Prompt y cómo las uso?',
    respuesta: 'Las plantillas de prompt son formatos predefinidos para obtener respuestas estructuradas de la IA. En el Asistente Ejecutivo IA encontrará plantillas organizadas por área: Finanzas, Contabilidad, Talento Humano, Marketing e Investigación de Operaciones. Seleccione una plantilla, modifique los datos entre corchetes [X] y genere el análisis.'
  },
  {
    id: 5,
    icon: <Download size={18} />,
    color: '#f59e0b',
    pregunta: '¿Puedo descargar las plantillas de prompts para uso offline?',
    respuesta: 'Sí, desde la sección "Módulos del Curso" tiene acceso al botón "Descargar Biblioteca de Prompts" que genera un archivo .TXT compilado con todas las plantillas organizadas por departamento, listas para usar fuera de la plataforma.'
  },
  {
    id: 6,
    icon: <Shield size={18} />,
    color: '#e11d48',
    pregunta: '¿Qué hago si tengo problemas técnicos con la plataforma?',
    respuesta: 'Puede contactar al equipo de soporte de Nasser Group a través del centro de soporte técnico. Si el problema persiste, verifique su conexión a internet y navegador recomendado (Chrome o Firefox). Los datos se sincronizan automáticamente cuando se restablece la conexión.'
  }
];

const FaqPage = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HelpCircle size={28} color="#0891b2" />
          <div>
            <h1>Centro de Ayuda</h1>
            <p>Preguntas Frecuentes — Academia Virtual PDVSA / IUTPAL</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, #003366, #001a33)', 
          borderRadius: 'var(--radius-lg)', 
          color: '#fff', 
          marginBottom: '24px' 
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6' }}>
            Encuentre respuestas a las preguntas más comunes sobre el uso de la plataforma, 
            la generación de reportes ejecutivos y la obtención de certificaciones.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqData.map((faq) => (
            <div 
              key={faq.id} 
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: expandedId === faq.id ? `2px solid ${faq.color}` : '2px solid var(--border-color)',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              <div 
                onClick={() => toggleExpand(faq.id)}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '8px', 
                  background: `${faq.color}15`, display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', color: faq.color,
                  flexShrink: 0
                }}>
                  {faq.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {faq.pregunta}
                  </div>
                </div>
                {expandedId === faq.id ? 
                  <ChevronUp size={18} color="var(--text-secondary)" /> : 
                  <ChevronDown size={18} color="var(--text-secondary)" />
                }
              </div>
              {expandedId === faq.id && (
                <div style={{ 
                  padding: '0 20px 16px 68px', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.7' 
                }}>
                  {faq.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '20px 24px', 
          background: 'rgba(8,145,178,0.05)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid rgba(8,145,178,0.15)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HelpCircle size={16} color="#0891b2" />
            <span style={{ fontWeight: '600', color: '#003366', fontSize: '0.9rem' }}>¿No encontró su respuesta?</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Contacte al equipo de soporte técnico de Nasser Group o al coordinador de IUTPAL para asistencia personalizada con la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
