import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, ChevronRight, CheckCircle, Lock, Download, FileText } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const ModulosList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModulos();
  }, []);

  const loadModulos = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/modulos`);
      setModulos(response.data);
    } catch (error) {
      console.error('Error loading modulos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuloColor = (numero) => {
    const colors = {
      1: { bg: 'linear-gradient(135deg, #003366, #004080)', icon: '#4FC3F7' },
      2: { bg: 'linear-gradient(135deg, #1565C0, #1976D2)', icon: '#81C784' },
      3: { bg: 'linear-gradient(135deg, #00695C, #00796B)', icon: '#FFB74D' },
      4: { bg: 'linear-gradient(135deg, #6A1B9A, #7B1FA2)', icon: '#F48FB1' }
    };
    return colors[numero] || colors[1];
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Módulos del Curso</h1>
        <p>Inteligencia Artificial para Líderes de Negocio - PDVSA</p>
      </div>

      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #003366, #001a33)', 
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <BookOpen size={32} color="#d4a843" />
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Programa de Formación en IA</h2>
            <p style={{ opacity: 0.8, margin: 0, fontSize: '0.9rem' }}>
              40 horas | 4 módulos | 12 lecciones | Certificado digital
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            Progreso: {modulos.filter(m => m.porcentaje_avance === 100).length}/4 módulos completados
          </div>
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(212, 168, 67, 0.3)', 
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            Avance total: {modulos.length > 0 ? (modulos.reduce((acc, m) => acc + m.porcentaje_avance, 0) / modulos.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Biblioteca de Prompts Descargable */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '20px 24px', 
        background: 'linear-gradient(135deg, rgba(0,51,102,0.04), rgba(212,168,67,0.06))', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid rgba(0,51,102,0.12)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            background: 'rgba(0,51,102,0.1)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}>
            <FileText size={20} color="#003366" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', color: '#003366', fontSize: '0.95rem' }}>Biblioteca de Prompts Gerenciales</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Plantillas compiladas por departamento — Archivo .TXT descargable</div>
          </div>
          <button
            onClick={() => {
              const biblioteca = `BIBLIOTECA DE PROMPTS GERENCIALES — PDVSA / IUTPAL
${'═'.repeat(60)}
Plataforma: Academia Virtual Nasser Group
Fecha de descarga: ${new Date().toLocaleDateString('es-VE')}
${'═'.repeat(60)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 1: FINANZAS Y AUDITORÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[FIN-01] Análisis de Desviación Presupuestaria
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Director Financiero de PDVSA.
[CONTEXTO]: Se ha detectado una desviación del [X]% en el presupuesto del área de [Nombre Área] durante el período [Trimestre/Año].
[TAREA]: Evalúa el siguiente plan de gastos [Pegar Datos] y genera:
1. Matriz de costo-beneficio por categoría de gasto.
2. Identificación de las 3 partidas con mayor desviación.
3. Proyección de flujo de caja para los próximos 3 meses.
4. Recomendaciones de reasignación presupuestaria.
FORMATO: Tabla ejecutiva con indicadores financieros clave.
└─────────────────────────────────────────────────┘

[FIN-02] Evaluación de ROI en Proyectos Petroleros
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Analista de Inversiones Senior.
[CONTEXTO]: Se presenta el siguiente proyecto de inversión: [Descripción del Proyecto].
[TAREA]: Calcula y presenta:
1. ROI proyectado a 1, 3 y 5 años.
2. Tasa de retorno interno (TIR) estimada.
3. Período de recuperación de la inversión.
4. Análisis de sensibilidad con 3 escenarios.
FORMATO: Ficha de inversión ejecutiva con gráficos de tendencia.
└─────────────────────────────────────────────────┘

[FIN-03] Auditoría de Inconsistencias Contables
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Auditor Senior certificado con 15 años de experiencia.
[CONTEXTO]: Se requiere revisar el siguiente listado de asientos contables del período [Período].
[TAREA]: Identifica:
1. Inconsistencias y partidas sospechosas.
2. Riesgos de incumplimiento normativo (NIIF/CPC).
3. Oportunidades de optimización fiscal.
4. Recomendaciones de ajuste contable.
FORMATO: Informe de auditoría con clasificación de riesgos (Alto/Medio/Bajo).
└─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 2: TALENTO HUMANO Y PLANIFICACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[RRHH-01] Evaluación de Desempeño y Planificación
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Gerente de Recursos Humanos de PDVSA.
[CONTEXTO]: Se presenta la siguiente situación de personal: [Descripción].
[TAREA]: Desarrolla:
1. Evaluación de desempeño del personal involucrado.
2. Plan de contingencia para redistribuir cargas de trabajo.
3. Identificación de necesidades de capacitación urgente.
4. Propuesta de incentivos para retención de talento.
FORMATO: Plan de acción ejecutivo con cronograma de 30/60/90 días.
└─────────────────────────────────────────────────┘

[RRHH-02] Análisis de Clima Organizacional
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Especialista en Organización y Métodos.
[CONTEXTO]: Se realizó una encuesta de clima organizacional con [N] respuestas del área de [Nombre].
[TAREA]: Analiza los resultados y presenta:
1. Top 3 fortalezas organizacionales.
2. Top 3 áreas de mejora con plan de acción.
3. Índice de satisfacción general y comparativa histórico.
4. Recomendaciones para mejorar el clima laboral.
FORMATO: Reporte ejecutivo con gráficos de tendencia y acción inmediata.
└─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 3: MARKETING Y COMUNICACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[MKT-01] Posicionamiento Institucional
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Gerente de Relaciones Institucionales.
[CONTEXTO]: Se requiere mejorar la imagen institucional de PDVSA ante [Audiencia Objetivo].
[TAREA]: Diseña:
1. Estrategia de posicionamiento en 3 canales clave.
2. Mensajes principales para comunicación de crisis.
3. Calendario de comunicados para los próximos 3 meses.
4. KPIs de medición de impacto reputacional.
FORMATO: Plan de comunicación ejecutivo con matriz de mensajes.
└─────────────────────────────────────────────────┘

[MKT-02] Análisis de Competidores
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Analista de Mercado Senior.
[CONTEXTO]: Evaluar la posición competitiva de PDVSA frente a [Competidores/Países].
[TAREA]: Realiza:
1. Análisis FODA comparativo con 5 competidores.
2. Benchmarking de precios y servicios.
3. Identificación de ventajas competitivas diferenciadoras.
4. Estrategias de diferenciación para el mercado internacional.
FORMATO: Matriz competitiva ejecutiva con recomendaciones estratégicas.
└─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 4: INVESTIGACIÓN DE OPERACIONES (I.O.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[IO-01] Optimización de Mezclas — Método Simplex
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Ingeniero de I.O. y Optimización Financiera.
[CONTEXTO]: Se requiere determinar la proporción óptima de procesamiento entre Crudo Pesado y Crudo Liviano en la refinería de [Nombre], con una capacidad de refinación de [X] BPD.
[TAREA]: Utiliza el enfoque del Método Simplex para resolver el problema de programación lineal:
1. Define las variables de decisión (X1 = crudo pesado, X2 = crudo liviano).
2. Establece la función objetivo: Maximizar Z = C1·X1 + C2·X2.
3. Restricciones de capacidad, mezcla mínima y disponibilidad.
4. Presenta la tabla Simplex paso a paso con iteraciones.
5. Indica la solución óptima y el margen máximo alcanzable.
FORMATO: Tabla de iteraciones Simplex + resultado óptimo.
└─────────────────────────────────────────────────┘

[IO-02] Parada de Planta — Ruta Crítica CPM/PERT
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Gerente de Proyectos (PMP/I.O.).
[CONTEXTO]: Planificar la parada técnica de mantenimiento de la Planta de Fraccionamiento [Nombre].
[TAREA]: Aplica el método CPM/PERT:
1. Lista de tareas con duración, predecesoras y holguras.
2. Diagrama de red (AON o AOA).
3. Cálculo de tiempos tempranos, tardíos y holguras.
4. Identificación del camino crítico.
5. Análisis PERT con estimaciones y varianza.
FORMATO: Tabla de actividades + diagrama de ruta crítica.
└─────────────────────────────────────────────────┘

[IO-03] Gestión de Inventario — Lote Económico EOQ
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Especialista en Logística e Inventarios.
[CONTEXTO]: Optimizar el stock de [Repuesto] para [N] bombas del Campo [Nombre].
[TAREA]: Utiliza el modelo EOQ:
1. Cantidad óptima de pedido: Q* = √(2DS/H)
2. Número de pedidos por año.
3. Punto de reorden.
4. Costo total anual vs. costo actual.
5. Análisis de sensibilidad.
FORMATO: Tabla de cálculo EOQ + comparativa costo actual vs. óptimo.
└─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECCIÓN 5: ANÁLISIS DE RIESGOS Y ESTRATEGIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[GEN-01] Evaluación de Riesgos y Matriz de Contención
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Especialista en Gestión de Riesgos.
[CONTEXTO]: Se presenta la siguiente eventualidad: [Describir falla o contingencia].
[TAREA]: Proyecta 3 escenarios hipotéticos (Conservador, Moderado, Crítico):
- Impacto financiero proyectado.
- Tiempo de recuperación estimado (MTTR).
- Protocolo de mitigación inmediato.
FORMATO: Tabla comparativa de escenarios con recomendación.
└─────────────────────────────────────────────────┘

[GEN-02] Resumen Ejecutivo de Informes Extensos
┌─────────────────────────────────────────────────┐
[ROL]: Actúa como Analista Ejecutivo de Junta Directiva.
[TAREA]: Sintetiza el siguiente informe [Pegar Texto] en una "Ficha Gerencial de 1 Página":
- Resumen en 3 oraciones.
- 3 KPIs más relevantes.
- Riesgo principal detectado.
- Decisión recomendada (Aprobar / Rechazar / Requerir más datos).
FORMATO: Ficha ejecutiva de 1 página.
└─────────────────────────────────────────────────┘

${'═'.repeat(60)}
Documento generado por la Plataforma Academia Virtual PDVSA
Nasser Group — IUTPAL
Línea de desarrollo: Investigación de Operaciones y Toma de Decisiones
${'═'.repeat(60)}`;
              const blob = new Blob([biblioteca], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'biblioteca_prompts_gerenciales_pdvsa.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              padding: '10px 20px',
              background: '#003366',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            <Download size={16} />
            Descargar Biblioteca
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Finanzas', 'Talento Humano', 'Marketing', 'Investigación de Operaciones', 'Riesgos'].map(dept => (
            <span key={dept} style={{ 
              fontSize: '0.72rem', padding: '3px 10px', 
              background: 'rgba(0,51,102,0.08)', color: '#003366', 
              borderRadius: '12px', fontWeight: '500' 
            }}>
              {dept}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {modulos.map((modulo, index) => {
          const colores = getModuloColor(modulo.numero_modulo);
          const estaCompletado = modulo.porcentaje_avance === 100;
          const estaEnProgreso = modulo.porcentaje_avance > 0 && modulo.porcentaje_avance < 100;
          
          return (
            <div 
              key={modulo.id}
              onClick={() => navigate(`/cursos/modulo/${modulo.id}`)}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: estaCompletado ? '2px solid var(--success-green)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{ 
                background: colores.bg, 
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {modulo.icono}
                </div>
                <div style={{ flex: 1, color: 'white' }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.8, 
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Módulo {modulo.numero_modulo}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                    {modulo?.titulo || 'Sin título'}
                  </h3>
                </div>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%',
                  background: estaCompletado ? '#10b981' : 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {estaCompletado ? (
                    <CheckCircle size={24} color="white" />
                  ) : (
                    <ChevronRight size={24} color="white" />
                  )}
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                  lineHeight: '1.6'
                }}>
                  {modulo.descripcion}
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <Clock size={14} /> {modulo.duracion_horas} horas
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <BookOpen size={14} /> {modulo.total_lecciones} lecciones
                  </span>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Progreso</span>
                    <span style={{ 
                      fontWeight: '600',
                      color: estaCompletado ? 'var(--success-green)' : 
                             estaEnProgreso ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}>
                      {modulo.porcentaje_avance}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${modulo.porcentaje_avance}%`,
                        background: estaCompletado ? 'var(--success-green)' : 
                                   estaEnProgreso ? 'linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light))' :
                                   'var(--border-color)'
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '0.8rem', 
                  color: estaCompletado ? 'var(--success-green)' : 
                         estaEnProgreso ? 'var(--accent-gold)' : 'var(--text-secondary)'
                }}>
                  {estaCompletado ? '✓ Completado' : 
                   estaEnProgreso ? `${modulo.lecciones_completadas} de ${modulo.total_lecciones} lecciones` :
                   'No iniciado'}
                </div>

                <Link 
                  to={`/cursos/modulo/${modulo.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    padding: '10px 20px',
                    background: 'var(--primary-blue)',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Entrar al Módulo →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulosList;
