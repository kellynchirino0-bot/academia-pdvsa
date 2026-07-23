/**
 * Seed script: Contenido Académico Completo
 * Módulos 1-4 del curso "IA para Líderes de Negocio - PDVSA"
 * 16 lecciones, 16 simuladores, 12 evaluaciones
 */

const academicModules = [
  {
    id: 1, numero_modulo: 1,
    titulo: 'IA como Activo Estratégico y Soberanía Digital',
    descripcion: 'Protección de datos en PDVSA, transparencia auditante y la IA como motor de decisiones estratégicas en tiempos de crisis. Marco para líderes que toman decisiones bajo presión.',
    icono: '🛡️', duracion_horas: 8,
    objetivos: [
      'Comprender la IA como herramienta estratégica para la toma de decisiones ejecutivas',
      'Evaluar el impacto de la IA en la soberanía digital y protección de datos de PDVSA',
      'Diseñar marcos de transparencia y auditabilidad para decisiones basadas en IA',
      'Liderar la transformación digital con enfoque en eficiencia y reducción de costos'
    ],
    competencias: ['Liderazgo digital', 'Gestión de riesgos', 'Soberanía de datos']
  },
  {
    id: 2, numero_modulo: 2,
    titulo: 'Inteligencia de Datos e Ingeniería de Prompts para Gerentes',
    descripcion: 'Transformar reportes históricos desordenados en matrices de decisión. Cómo formular preguntas estratégicas a la IA para obtener resúmenes ejecutivos accionables.',
    icono: '💬', duracion_horas: 8,
    objetivos: [
      'Formular preguntas estratégicas a la IA para obtener resúmenes ejecutivos',
      'Transformar datos operativos en inteligencia accionable para la toma de decisiones',
      'Crear plantillas de prompts reutilizables para memorandums, informes y análisis',
      'Evaluar y validar la calidad de las respuestas generadas por IA'
    ],
    competencias: ['Comunicación ejecutiva', 'Análisis estratégico', 'Inteligencia de negocios']
  },
  {
    id: 3, numero_modulo: 3,
    titulo: 'Eficiencia Administrativa y Gestión de Recursos',
    descripcion: 'Análisis comparativo de presupuestos, gestión inteligente de inventarios de repuestos críticos y eliminación de la burocracia en papeleo. Optimización de procesos administrativos con IA.',
    icono: '📊', duracion_horas: 8,
    objetivos: [
      'Aplicar IA para análisis comparativo de presupuestos y optimización de costos',
      'Implementar sistemas inteligentes de gestión de inventarios de repuestos críticos',
      'Eliminar la burocracia en procesos administrativos mediante automatización',
      'Medir el ahorro de horas-burocráticas logrado con la implementación de IA'
    ],
    competencias: ['Eficiencia operativa', 'Gestión de costos', 'Automatización administrativa']
  },
  {
    id: 4, numero_modulo: 4,
    titulo: 'Investigación de Operaciones (I.O.) y Toma de Decisiones Asistida por IA',
    descripcion: 'Métodos cuantitativos de Investigación de Operaciones aplicados al sector energético: Programación Lineal (Simplex), Ruta Crítica (CPM/PERT), Modelos de Inventario (EOQ) e Inteligencia Artificial para la optimización de decisiones gerenciales en PDVSA.',
    icono: '⚡', duracion_horas: 8,
    objetivos: [
      'Comprender los fundamentos de Investigación de Operaciones y su aplicación en el sector petrolero',
      'Aplicar Programación Lineal y Método Simplex para optimización de mezclas y distribución de recursos',
      'Implementar CPM/PERT en la planificación de paradas de planta y mantenimiento industrial',
      'Utilizar modelos de inventario EOQ para la gestión eficiente de stock de repuestos críticos'
    ],
    competencias: ['Optimización matemática', 'Gestión de proyectos', 'Control de inventarios']
  }
];

const academicLessons = [
  // ============ MÓDULO 1: FUNDAMENTOS DE IA ============
  {
    modulo_id: 1, titulo: '¿Qué es la Inteligencia Artificial? Del Concepto a la Realidad Operacional',
    orden: 1,
    contenido_markdown: `# Lección 1.1: ¿Qué es la Inteligencia Artificial?

## Descripción
Establece la base conceptual para comprender cómo la IA está transformando la industria del Petróleo y Gas a nivel mundial.

## Duración: 2 horas

---

## Contenido Teórico

### Definición de Inteligencia Artificial
La Inteligencia Artificial (IA) es una rama de la ciencia de la computación que busca crear sistemas capaces de realizar tareas que típicamente requieren inteligencia humana: razonamiento, aprendizaje, percepción, comprensión del lenguaje y toma de decisiones.

En el contexto del Oil & Gas, la IA no reemplaza al ingeniero o al gerente de operaciones — lo potencia. Es una herramienta estratégica que permite procesar volúmenes masivos de datos (Big Data) que serían imposibles de analizar manualmente.

### Las Tres Capas de la IA

| Nivel | Definición | Ejemplo en Oil & Gas |
|-------|-----------|----------------------|
| **IA (Inteligencia Artificial)** | Concepto general: máquinas que ejecutan tareas inteligentes | Sistemas de control de procesos en refinerías |
| **ML (Machine Learning)** | Algoritmos que aprenden de datos sin programación explícita | Modelos que predicen fallas en bombas basándose en historial de vibración |
| **DL (Deep Learning)** | Redes neuronales profundas que procesan patrones complejos | Análisis automático de imágenes sísmicas para identificar trampas de hidrocarburos |

### Inteligencia Artificial vs. Automatización Tradicional

| Característica | Automatización Tradicional | Inteligencia Artificial |
|---------------|---------------------------|------------------------|
| Programación | Reglas fijas escritas por humanos | Aprende de datos históricos |
| Adaptabilidad | No se adapta a cambios | Se ajusta con nuevos datos |
| Complejidad | Tareas simples y repetitivas | Patrones complejos y no lineales |
| Ejemplo PDVSA | Válvula que se abre/cierra por temporizador | Sistema que ajusta presión según condiciones del pozo |

### El Proceso de Aprendizaje del Machine Learning

\`\`\`
Datos Históricos → Entrenamiento del Modelo → Validación → Despliegue → Predicción
     ↑                                                                    |
     └────────────────── Retroalimentación (Feedback Loop) ───────────────┘
\`\`\`

En PDVSA:
- **Datos:** Registros de producción, datos de sensores SCADA, historial de mantenimiento
- **Entrenamiento:** El modelo aprende patrones como "cuando la temperatura supera 85°C y la vibración aumenta 15%, hay 78% de probabilidad de falla en 72 horas"
- **Predicción:** El sistema alerta al operador antes de que ocurra la falla
- **Retroalimentación:** Si la predicción fue correcta, el modelo se fortalece

---

## Caso Práctico: Análisis de Pozos en la Faja Petrolífera del Orinoco

La Faja Petrolífera del Orinoco contiene las reservas de petróleo pesado y extrapesado más grandes del mundo. La producción de crudos extra-pesados (API < 10°) requiere procesos especiales de inyección de vapor y monitoreo constante.

**Problema:** Un campo con 200 pozos productores genera aproximadamente 50,000 registros diarios de datos de sensores. Un equipo de 10 ingenieros puede analizar manualmente un máximo de 50 pozos por día.

**Solución con IA:** Un modelo de Machine Learning puede procesar los 50,000 registros en minutos, identificando patrones de declinación anormal, fugas de vapor y condiciones óptimas de inyección.

**Impacto:** Reducción del 40% en tiempo de diagnóstico, aumento del 12% en factor de recuperação de petróleo.

---

## Conceptos Clave
1. IA es el paraguas; ML y DL son herramientas específicas dentro de ese paraguas
2. La IA en Oil & Gas no reemplaza personas — amplifica capacidades
3. Los modelos de IA aprenden de datos históricos y mejoran con retroalimentación
4. PDVSA ya genera los datos necesarios; falta activar su valor estratégico mediante IA`,
    duracion_minutos: 120
  },
  {
    modulo_id: 1, titulo: 'Aplicaciones de IA en Exploración y Producción',
    orden: 2,
    contenido_markdown: `# Lección 1.2: Aplicaciones de IA en Exploración y Producción

## Descripción
Identificar y evaluar las aplicaciones de IA en las fases de exploración, perforación y producción de hidrocarburos.

## Duración: 2 horas

---

## Contenido Teórico

### IA en Exploración Sísmica
El análisis sísmico es fundamental para localizar yacimientos de hidrocarburos. La IA permite:
- **Segmentación automática de cuerpos geológicos:** Redes neuronales convolucionales (CNN) identifican automáticamente estructuras como fallas, anticlinales y zonas de reservoir
- **Atributos sísmicos inteligentes:** Algoritmos de ML clasifican facies rocosas a partir de atributos sísmicos
- **Interpolación de datos faltantes:** Técnicas de DL completan líneas sísmicas obstruidas

**Caso PDVSA:** En el Bloque Ayacucho (Faja del Orinoco), la aplicación de CNN para interpretación sísmica redujo el tiempo de identificación de trampas estratigráficas de 6 meses a 3 semanas, con una precisión del 87%.

### IA en Perforación
La perforación de pozos representa entre el 30% y 50% del costo total de un proyecto de desarrollo.

| Parámetro | Sin IA | Con IA | Mejora |
|-----------|--------|--------|--------|
| Velocidad de penetración (ROP) | Estimación por experiencia | Modelo predictivo en tiempo real | +15-25% |
| Tiempo fuera de producción (NPT) | Reactivo | Predictivo | -40% |
| Consumo de lodo | Sobre-diseñado | Optimizado por ML | -20% |

### Mantenimiento Predictivo
El mantenimiento predictivo es una de las aplicaciones de IA con mayor ROI en Oil & Gas:

**Evolución del Mantenimiento:**
- **Reactivo:** "Se rompió, lo reparamos" (costo alto)
- **Preventivo:** "Cada 6 meses cambiamos la bomba" (costo medio)
- **Predictivo:** "La bomba fallará en 15 días" (costo óptimo)
- **Prescriptivo:** "Reemplazar la bomba X reduce el riesgo en 94%" (costo mínimo)

### Pozos Inteligentes (Smart Wells)
Los pozos inteligentes utilizan sensores en tiempo real y IA para:
- Optimizar la tasa de producción de cada zona productora
- Detectar anticipadamente la entrada de agua o gas
- Ajustar automáticamente las válvulas de control de flujo

---

## Caso Práctico: Mantenimiento Predictivo en Bombas de Extracción

**Indicadores monitoreados por IA:**
- Bombas de extracción: vibración, temperatura, consumo eléctrico, carga del motor
- Compresores: eficiencia isentrópica, temperatura de descarga, flujo
- Líneas de flujo: presión, temperatura, composición del fluido, corrosión

**Ejercicio:** Identifique 3 procesos en su área de trabajo que actualmente se realizan de forma manual o reactiva. Para cada uno responda:
1. ¿Qué datos se generan actualmente?
2. ¿Qué decisiones se toman basándose en esos datos?
3. ¿Cómo podría un modelo de IA mejorar esas decisiones?`,
    duracion_minutos: 120
  },
  {
    modulo_id: 1, titulo: 'IA en Refinación y Procesos Industriales',
    orden: 3,
    contenido_markdown: `# Lección 1.3: IA en Refinación y Procesos Industriales

## Descripción
Comprender cómo la IA optimiza los procesos de refinación, control de calidad y seguridad operacional.

## Duración: 2 horas

---

## Contenido Teórico

### Optimización de Refinerías con IA
Las refinerías de PDVSA (Amuay, Bajo Grande, El Palito, Cardón) procesan crudos de diferentes gravedades API y composiciones.

**Variables de entrada:**
- Composición del crudo alimentado (API, azufre, vanadio, níquel)
- Condiciones ambientales
- Disponibilidad de energía
- Especificaciones del producto final

**La IA resuelve mediante:**
- Modelos de optimización basados en ML
- Control predictivo de proceso (MPC con IA)
- Detección de anomalías

**Impacto reportado:**
- Aumento del 2-5% en rendimiento de gasolina
- Reducción del 10-15% en consumo energético
- Disminución del 30% en productos fuera de especificación

### Seguridad Operacional
- Análisis de tendencias de seguridad
- Monitoreo de integridad de activos
- Simulación de escenarios de falla
- Análisis de causa raíz automático

### Calidad del Producto con Visión Artificial
- Análisis en línea con sensores NIR + ML
- Control automático de mezcla
- Trazabilidad completa de lotes

---

## Caso Práctico: Optimización del Proceso de Destilación Atmosférica

**Planteamiento:** La columna de destilación de Amuay procesa 180,000 bbl/día de crudo mixto.

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Columna de Destilación Atmosférica

CONDICIONES ACTUALES:
- Crudo alimentado: Mixto (API 24°, Azufre 2.1%, Agua 3.5%)
- Temperatura del horno: 365°C
- Temperatura del reflux: 108°C
- Presión del tope: 1.5 kg/cm²

PRODUCTOS ACTUALES:
- Gasolina: Octanaje 87 (meta: ≥91)
- Kerosene: Azufre 0.18% (meta: ≤0.20%)
- Diésel: Azufre 0.35% (meta: ≤0.30%) ⚠️
- Fuel Oil: Rendimiento 28% (meta: ≤25%)

INSTRUCCIÓN: Ajuste las variables para que TODOS los productos cumplan especificación.
\`\`\`

**Respuesta Esperada:**
1. Aumentar temperatura del horno de 365°C a 372°C
2. Mantener reflux en 108°C
3. Reducir caudal de 7,500 a 7,200 bph
4. Resultado: Todos los productos dentro de especificación`,
    duracion_minutos: 120
  },
  {
    modulo_id: 1, titulo: 'Evaluación del Impacto y ROI de Proyectos de IA',
    orden: 4,
    contenido_markdown: `# Lección 1.4: Evaluación del Impacto y ROI de Proyectos de IA

## Descripción
Desarrollar la capacidad de evaluar, priorizar y presentar propuestas de proyectos de IA con métricas de impacto concretas.

## Duración: 2 horas

---

## Contenido Teórico

### Marco de Evaluación en 4 Dimensiones

| Dimensión | Preguntas Clave | Peso |
|-----------|-----------------|------|
| **Impacto de Negocio** | ¿Cuánto dinero se ahorraría o ganaría? | 35% |
| **Viabilidad Técnica** | ¿Tenemos los datos necesarios? | 25% |
| **Disponibilidad de Talent** | ¿Tenemos el equipo humano necesario? | 20% |
| **Alineación Estratégica** | ¿Está alineado con los objetivos de PDVSA? | 20% |

### Métricas de Impacto Comunes

**Métricas Financieras:**
- Ahorro en costos de mantenimiento: 15-30%
- Aumento de producción: 5-15%
- Reducción de NPT: 20-40%

**Métricas Operacionales:**
- Tiempo de respuesta a incidentes: -50-70%
- Precisión de predicciones: >80%
- Disponibilidad de equipos: +3-8%

### Estructura de Propuesta de IA

1. Resumen Ejecutivo (1 página)
2. Análisis del Problema (2-3 páginas)
3. Solución Técnica (3-4 páginas)
4. Impacto de Negocio (2 páginas)
5. Plan de Implementación (2 páginas)

---

## Ejercicio: Desarrollo de Propuesta de Proyecto de IA

**Ejemplo de Propuesta:**

> **Proyecto: Mantenimiento Predictivo para Bombas en Cerro Negro**
>
> **Inversión:** $120,000 USD
> **Beneficio anual:** $547,600 USD
> **ROI: 356% | Payback: 2.6 meses**

Desarrolle una propuesta para un área de su operación en PDVSA.`,
    duracion_minutos: 120
  },

  // ============ MÓDULO 2: PROMPT ENGINEERING ============
  {
    modulo_id: 2, titulo: 'Fundamentos del Prompt Engineering',
    orden: 1,
    contenido_markdown: `# Lección 2.1: Fundamentos del Prompt Engineering

## Descripción
Comprender los principios fundamentales del diseño de prompts y aplicar técnicas básicas.

## Duración: 2 horas

---

## Contenido Teórico

### ¿Qué es un Prompt?
Un prompt es la instrucción o solicitud que le damos a un modelo de lenguaje para obtener una respuesta específica. La calidad del prompt determina directamente la calidad de la respuesta.

**Analogía:** Un prompt es como una orden de trabajo. Si le dice a un empleado "haz un informe", obtendrá algo genérico. Si le dice "haz un informe de 2 páginas sobre la producción del campo Cerro Negro del Q1 2024, comparándolo con el Q1 2023, incluyendo gráficos de tendencia y recomendaciones", obtendrá algo mucho más útil.

### Los 5 Componentes de un Prompt Efectivo

| Componente | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Rol** | Quién quieres que sea la IA | "Actúa como un ingeniero petrolero senior" |
| **Contexto** | Información de fondo relevante | "Trabajo en PDVSA, opero campos en la Faja del Orinoco" |
| **Tarea** | Qué específicamente necesitas | "Analiza los datos de producción de los últimos 6 meses" |
| **Formato** | Cómo quieres la respuesta | "Presenta en una tabla comparativa" |
| **Restricciones** | Limitaciones o especificaciones | "Máximo 500 palabras, en lenguaje técnico pero accesible" |

### Tipos de Prompts

**a) Prompt Directo:**
\`\`\`
"Resume los puntos clave del protocolo de seguridad para operaciones de perforación en cuencas con alta concentración de H2S."
\`\`\`

**b) Prompt con Rol (Role Prompting):**
\`\`\`
"Eres un gerente de seguridad operacional con 15 años de experiencia en plantas de procesamiento de gas. Redacta un memo para el personal de operaciones sobre los procedimientos de emergencia ante una fuga de gas."
\`\`\`

**c) Few-Shot Prompting:**
\`\`\`
"Genera reportes de incidentes siguiendo este formato:
Ejemplo 1:
- Fecha: 15/03/2024
- Ubicación: Planta de Amuay, Compresor C-102
- Incidente: Vibración anormal detectada
[Ejemplo 2: Genera uno nuevo siguiendo este formato]"
\`\`\`

**d) Chain of Thought:**
\`\`\`
"Analiza por qué la producción del pozo PDV-4521 ha disminuido un 18% en los últimos 3 meses. Piensa paso a paso:
1. Primero, analiza los datos de presión y temperatura
2. Luego, revisa el historial de mantenimiento
3. Después, considera factores geológicos
4. Finalmente, dame tu diagnóstico"
\`\`\`

---

## Ejercicio: De Malo a Buen Prompt

**Prompt Malo:** "Háblame sobre la seguridad en PDVSA"

**Prompt Bueno:** "Actúa como un especialista en seguridad industrial con 15 años de experiencia en PDVSA. Diseña un checklist de 10 puntos para la inspección de seguridad pre-operacional de una estación de compresión de gas natural. Formato: tabla Markdown."

---

## Conceptos Clave
1. Un buen prompt tiene 5 componentes: Rol, Contexto, Tarea, Formato y Restricciones
2. Few-Shot Prompting muestra ejemplos antes de hacer la solicitud
3. Chain of Thought pide razonamiento paso a paso
4. La especificidad del prompt determina la utilidad de la respuesta`,
    duracion_minutos: 120
  },
  {
    modulo_id: 2, titulo: 'Técnicas Avanzadas de Prompt Engineering',
    orden: 2,
    contenido_markdown: `# Lección 2.2: Técnicas Avanzadas de Prompt Engineering

## Descripción
Dominar técnicas avanzadas de prompting para resolver problemas complejos de negocio.

## Duración: 2 horas

---

## Contenido Teórico

### Prompt Chaining (Cadena de Prompts)

Para problemas complejos, se divide en pasos:

\`\`\`
Paso 1: "Describe los 5 principales retos técnicos de implementar mantenimiento predictivo en bombas de extracción"

Paso 2: "Para cada reto, sugiere una solución técnica específica con herramientas"

Paso 3: "Estima los costos y tiempos de implementación"

Paso 4: "Consolida todo en un documento de viabilidad técnica de 2 páginas"
\`\`\`

### Self-Consistency (Autoconsistencia)

\`\`\`
"Genera 3 análisis diferentes de las causas de la disminución de producción del campo Merey-2. Luego, compara los 3 y determina cuál es el más completo."
\`\`\`

### Tree of Thought (Árbol de Pensamiento)

\`\`\`
"Un pozo muestra disminución del 15% en producción. Explora 3 hipótesis:
Hipótesis A: Problema mecánico
Hipótesis B: Problema del reservoir
Hipótesis C: Problema operacional
Para cada una: evidencia a favor, en contra, pruebas necesarias, probabilidad."
\`\`\`

### Estructura de un Prompt Avanzado

\`\`\`
[CONTEXTO]
Soy [rol] en [empresa], trabajando en [área].

[TAREA]
Necesito que [acción específica].

[FORMATO]
La respuesta debe ser:
- Extensión: [número] palabras
- Formato: [tabla/lista/informe]
- Audiencia: [geres/ingenieros/directivos]

[RESTRICCIONES]
- No incluir [lo que no quieres]
- Enfocarse solo en [lo que sí quieres]
\`\`\`

---

## Caso Práctico: Generación de Reporte Técnico con Prompt Engineering

**Situación:** Gerente de producción del Campo Cerro Negro necesita un reporte de 3 páginas sobre estado de bombas de extracción.

**Prompt Encadenado:**

**Paso 1:** "Genera una tabla ficticia pero realista de 10 bombas del Campo Cerro Negro con: ID, Tipo, Fecha instalación, Horas operación, Temperatura, Vibración, Eficiencia, Estado"

**Paso 2:** "Realiza un análisis ABC: Clase A (eficiencia <85% o vibración >7), Clase B (85-92% o 5-7), Clase C (>92% y <5)"

**Paso 3:** "Redacta informe ejecutivo de 3 párrafos para el Director de Producción con hallazgos, recomendaciones y estimación de inversión"`,
    duracion_minutos: 120
  },
  {
    modulo_id: 2, titulo: 'Plantillas de Prompts para PDVSA — Kit de Herramientas',
    orden: 3,
    contenido_markdown: `# Lección 2.3: Guía Oficial de Plantillas de Prompts Ejecutivos PDVSA/IUTPAL

## Descripción
Kit completo de plantillas oficiales para gerentes, supervisores y administrativos de PDVSA. Incluye 4 plantillas estratégicas de uso inmediato.

## Duración: 2 horas

---

## 📋 RECURSO DESCARGABLE
**Guía_Oficial_Prompts_Gerenciales_PDVSA_IUTPAL.pdf**

*Accede al Asistente Ejecutivo IA para usar estas plantillas interactivamente con un solo clic.*

---

## Plantillas Ejecutivas Oficiales

### Plantilla 1: Análisis de Oportunidades y Reducción de Costos

\`\`\`
[ROL]: Actúa como Asesor Senior de Eficiencia Operativa en PDVSA.
[CONTEXTO]: Se ha detectado una variación del [X]% en el presupuesto asignado a la división [Nombre División].
[TAREA]: Analiza los siguientes datos operativos [Pegar Datos/Reporte] e identifica:
1. Tres áreas de desperdicio o sobrecosto inmediato.
2. Dos medidas de optimización sin afectar la seguridad de la planta/unidad.
3. Formato de salida: Tabla comparativa con Costo vs. Impacto Estimado.
\`\`\`

### Plantilla 2: Redacción de Memorándums Ejecutivos de Alto Impacto

\`\`\`
[ROL]: Actúa como Director de Comunicaciones Corporativas.
[CONTEXTO]: Se requiere solicitar la aprobación inmediata para [Objeto de la Solicitud] dirigida a [Destinatario/Gerencia].
[TAREA]: Redacta un memorándum de no más de 300 palabras estructurado en:
- Antecedentes clave en 2 viñetas.
- Justificación de ROI/Impacto en continuidad operativa.
- Petición concreta y fecha límite de respuesta.
- Tono: Formal, institucional, directo.
\`\`\`

### Plantilla 3: Evaluación de Riesgos y Matriz de Contención

\`\`\`
[ROL]: Actúa como Especialista en Gestión de Riesgos e Inclemencias Operativas.
[CONTEXTO]: Se presenta la siguiente eventualidad no programada: [Describir falla o contingencia].
[TAREA]: Proyecta 3 escenarios hipotéticos (Conservador, Moderado, Crítico) evaluando:
- Impacto financiero proyectado.
- Tiempo de recuperación estimado (MTTR).
- Protocolo de mitigación inmediato para supervisores de campo.
\`\`\`

### Plantilla 4: Resumen Ejecutivo de Informes Extensos

\`\`\`
[ROL]: Actúa como Analista Ejecutivo de Junta Directiva.
[TAREA]: Sintetiza el siguiente informe técnico/financiero [Pegar Texto Extenso] en una "Ficha Gerencial de 1 Página" que contenga:
- Resumen en 3 oraciones principales.
- 3 KPIs o cifras más relevantes.
- Riesgo principal detectado.
- Decisión recomendada (Aprobar / Rechazar / Requerir más datos).
\`\`\`

---

## Cómo Usar Estas Plantillas

1. **Ingresa al Asistente Ejecutivo IA** desde el menú lateral
2. **Selecciona la plantilla** que deseas usar de la "Guía de Plantillas Gerenciales"
3. **Personaliza los campos** entre corchetes [X] con tus datos reales
4. **Genera el análisis** y revisa la respuesta del asistente
5. **Copia o descarga** el informe resultante

---

## Ejercicio Práctico

1. Seleccione una de las 4 plantillas ejecutivas
2. Personalice los campos con un escenario real de su área en PDVSA
3. Genere el análisis con el Asistente Ejecutivo IA
4. Presente el resultado a un compañero para retroalimentación`,
    duracion_minutos: 120
  },
  {
    modulo_id: 2, titulo: 'Evaluación y Mejora Continua de Prompts',
    orden: 4,
    contenido_markdown: `# Lección 2.4: Evaluación y Mejora Continua de Prompts

## Descripción
Evaluar la calidad de las respuestas de IA y aplicar técnicas de mejora continua.

## Duración: 2 horas

---

## Contenido Teórico

### Métricas de Calidad

| Métrica | Descripción | Cómo Evaluarla |
|---------|-------------|----------------|
| **Relevancia** | ¿Aborda exactamente lo que preguntaste? | ¿Incluye información directamente relacionada? |
| **Precisión** | ¿La información es correcta? | ¿Los datos y cifras son coherentes? |
| **Completitud** | ¿Cubre todos los aspectos? | ¿Todas las partes fueron abordadas? |
| **Claridad** | ¿Es fácil de entender? | ¿Un colega no técnico entendería? |
| **Acciónabilidad** | ¿Puedes actuar basándote en ella? | ¿Incluye pasos específicos? |
| **Formato** | ¿Respeta el formato solicitado? | ¿Es tabla, lista, informe? |

### Errores Comunes y Correcciones

| Error | Ejemplo | Corrección |
|-------|---------|-----------|
| Demasiado vago | "Háblame de producción" | "Analiza la producción del Campo Cerro Negro en marzo 2024 vs. meta" |
| Sin contexto | "¿Es seguro operar esta bomba?" | "¿Es seguro operar una bomba centrífuga con vibración de 8 mm/s y temperatura de 95°C?" |
| Sin formato | "Hazme un reporte" | "Hazme un reporte de 1 página con: resumen, tabla, recomendaciones" |
| Múltiples preguntas | "¿Qué es ML? ¿Cómo se usa? ¿Cuánto cuesta?" | Separar en prompts individuales |

### Técnica de Iteración de Prompts

\`\`\`
Escribir Prompt → Evaluar Respuesta → Identificar Brechas → Mejorar Prompt → Re-evaluar
\`\`\`

**Preguntas de Evaluación Post-Respuesta:**
1. ¿Fue demasiado genérica o específica?
2. ¿Faltó información importante?
3. ¿El formato fue el esperado?
4. ¿Hay información incorrecta?
5. ¿Puedo usar esta respuesta tal cual?

---

## Ejercicio: Evaluación y Mejora

1. Tome un prompt creado en la Lección 2.3
2. Evalúe la respuesta usando las 6 métricas (1-5)
3. Identifique las 2 áreas de mejora
4. Reescriba el prompt incorporando mejoras
5. Compare las respuestas antes y después

| Métrica | Antes (1-5) | Después (1-5) |
|---------|------------|--------------|
| Relevancia | | |
| Precisión | | |
| Completitud | | |
| Claridad | | |
| Acciónabilidad | | |
| Formato | | |`,
    duracion_minutos: 120
  },

  // ============ MÓDULO 3: GEMELOS DIGITALES ============
  {
    modulo_id: 3, titulo: 'Fundamentos de Gemelos Digitales',
    orden: 1,
    contenido_markdown: `# Lección 3.1: Fundamentos de Gemelos Digitales

## Descripción
Comprender los conceptos fundamentales de gemelos digitales, su arquitectura y applicación en Oil & Gas.

## Duración: 2 horas

---

## Contenido Teórico

### ¿Qué es un Gemelo Digital?
Un gemelo digital es una representación virtual de un objeto, proceso o sistema físico que se actualiza continuamente con datos del mundo real. A diferencia de un modelo estático, un gemelo digital está vivo — refleja el estado actual del activo en todo momento.

**Analogía:** Piense en un gemelo digital como el "panel de instrumentos" de un avión, pero para una refinería completa.

### Los 3 Componentes Fundamentales

| Componente | Función | Ejemplo en PDVSA |
|-----------|---------|------------------|
| **Físico (Asset)** | El equipo o proceso real | Bomba de extracción BEP-4521 |
| **Digital (Modelo)** | Réplica virtual con modelos matemáticos | Modelo que calcula eficiencia, temperatura, vibración |
| **Conectividad (Data)** | Sensores y comunicación en tiempo real | SCADA, IoT sensors, PLC |

### Niveles de Madurez

\`\`\`
Nivel 1: MONITOREO BÁSICO → Dashboard de datos en tiempo real
Nivel 2: DIAGNÓSTICO → Análisis de tendencias y anomalías
Nivel 3: PREDICCIÓN → Modelos que predicen comportamiento futuro
Nivel 4: SIMULACIÓN → Prueba de escenarios "¿qué pasaría si...?"
Nivel 5: OPTIMIZACIÓN AUTÓNOMA → El gemelo ajusta automáticamente
\`\`\`

La mayoría de Oil & Gas está en Nivel 1-2. El objetivo es alcanzar Nivel 3-4.

### Arquitectura Típica

\`\`\`
┌─────────────────────────────────────────┐
│ CAPA DE VISUALIZACIÓN                    │
│ Dashboards, Reportes, Alertas            │
├─────────────────────────────────────────┤
│ CAPA DE ANALYTICS                        │
│ Machine Learning, Modelos Físicos        │
├─────────────────────────────────────────┤
│ CAPA DE DATOS                            │
│ Data Lake, Time-Series Database          │
├─────────────────────────────────────────┤
│ CAPA DE CONECTIVIDAD                     │
│ IoT Sensors, SCADA, PLC, MQTT           │
├─────────────────────────────────────────┤
│ CAPA FÍSICA                              │
│ Bombas, Compresores, Pozos, Refinería   │
└─────────────────────────────────────────┘
\`\`\`

---

## Caso Práctico: Gemelo Digital de Estación de Bombeo — Campo Merey-1

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Gemelo Digital de Estación de Bombeo

DATOS EN TIEMPO REAL:
- Total bombas: 45
- Operando normal: 38 (84%)
- Alerta amarilla: 5 (11%)
- Alerta roja: 2 (4%)

DETALLE DE ALERTAS:
BEP-012: Vibración 8.2 mm/s, Temp 89°C → ALERTA
BEP-031: Vibración 12.5 mm/s, Temp 98°C → CRÍTICO
BEP-045: Vibración 15.2 mm/s, Temp 105°C → CRÍTICO

INSTRUCCIÓN: Identifique prioridades de acción y simule escenario a 48 horas.
\`\`\`

**Respuesta Esperada:**
- BEP-045: Parada inmediata (riesgo de falla catastrófica)
- BEP-031: Parada programada en 24 horas
- Escenario a simular: "¿Qué pasa si BEP-045 opera 48 horas más?"`,
    duracion_minutos: 120
  },
  {
    modulo_id: 3, titulo: 'Gemelos Digitales en Refinerías',
    orden: 2,
    contenido_markdown: `# Lección 3.2: Gemelos Digitales en Refinerías

## Descripción
Aplicación de gemelos digitales a procesos complejos de refinación.

## Duración: 2 horas

---

## Contenido Teórico

### Tipos de Gemelos en Refinería

| Tipo | Objetivo | Ejemplo | Complejidad |
|------|----------|---------|-------------|
| **Gemelo de Activo** | Monitorear UN equipo | Bomba, compresor | Media |
| **Gemelo de Proceso** | Optimizar UN PROCESO | Columna de destilación | Alta |
| **Gemelo de Planta** | Integrar múltiples procesos | Toda la refinería | Muy Alta |

### Aplicaciones Principales

**a) Optimización de Hornos:**
- Monitoreo de temperatura tubeskin
- Predicción de fouling (formación de carbón)
- Optimización de combustión
- Simulación de cambios de crudo

**b) Simulación de Columnas de Destilación:**
- Temperatura del horno, tope, reflux ratio
- Composición del crudo
- Calidad y rendimiento de productos

**c) Monitoreo de Integridad:**
- Corrosión predictiva
- Erosión en codos y válvulas
- Fatiga de recipientes a presión

---

## Caso Práctico: Gemelo Digital del Horno H-101 — Refinería de Amuay

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Horno H-101 — Refinería de Amuay

ESTADO ACTUAL:
- Temperatura tubeskin: 425°C (límite: 450°C)
- Eficiencia térmica: 82% (meta: 88%)
- Combustible: Gas Natural — 15,000 m³/h
- CO₂ emitido: 8.2 ton/h (límite: 9.0)
- Fouling factor: 0.00045 (limpieza: >0.0006)

SIMULACIÓN: Impacto de cambiar gas natural por gasóleo
- Gas Natural: 8,500 kcal/m³, $3.50/MMBTU
- Gasóleo: 10,800 kcal/kg, $4.20/MMBTU, eficiencia -3%

INSTRUCCIÓN: Calcule costos, beneficios, riesgos y recomiende.
\`\`\`

**Respuesta Esperada:**
- Costo actual gas natural: ~$460,000/año
- Costo gasóleo: ~$447,000/año (ahorro 2.8%)
- Riesgo: +15% emisiones CO₂
- **Recomendación:** Mantener gas natural; optimizar combustion para alcanzar 85% eficiencia (ahorro $25,000/año)`,
    duracion_minutos: 120
  },
  {
    modulo_id: 3, titulo: 'Monitoreo de Campos en Tiempo Real',
    orden: 3,
    contenido_markdown: `# Lección 3.3: Monitoreo de Campos en Tiempo Real

## Descripción
Implementar estrategias de monitoreo y prevención de fallas usando gemelos digitales.

## Duración: 2 horas

---

## Contenido Teórico

### Arquitectura de Monitoreo

\`\`\`
Campo Petrolero → Sensores IoT → Edge Computing → Plataforma Cloud → Acción
\`\`\`

### Tipos de Fallas y Detección

| Tipo de Falla | Parámetros | Anticipación |
|---------------|-----------|-------------|
| Falla mecánica (bomba) | Vibración, temperatura, corriente | 7-15 días |
| Falla de sellos | Presión, temperatura | 3-7 días |
| Corrosión | Espesor de pared, pH | 30-90 días |
| Falla eléctrica | Corriente, factor de potencia | 14-30 días |

### Sistema de Alertas

| Nivel | Condición | Acción | Tiempo |
|-------|-----------|--------|--------|
| Verde | Normal | Monitoreo continuo | Sin acción |
| Amarillo | 1 parámetro fuera de rango | Monitoreo intensivo | 24-48h |
| Naranja | 2+ parámetros fuera | Inspección programada | 8-24h |
| Rojo | Parámetro fuera de rango seguro | Parada programada | 0-4h |
| Rojo parpadeante | Condición de seguridad | Parada inmediata | Inmediata |

---

## Caso Práctico: Monitoreo del Campo Cerro Negro — 150 Bombas

**Prompt para el Simulador:**

\`\`\`
ESTADO GENERAL (15:45:32):
- Operando normal: 132 (88%)
- Pre-alerta: 12 (8%)
- Alerta: 4 (2.7%)
- Crítico: 2 (1.3%)

ALERTAS CRÍTICAS:
BEP-067: Vibración 11.2 mm/s↑, Temp 91°C → Rojo
BEP-134: Vibración 12.8 mm/s↑, Temp 95°C → Rojo

INSTRUCCIÓN: Analice tendencias, determine acciones, identifique patrones.
\`\`\`

**Respuesta Esperada:**
- BEP-067: Parada programada en 4 horas (desgaste de rodamientos)
- BEP-134: Parada inmediata (falla múltiple)
- Patrón: 75% de alertas en bombas centrífugas
- Mejora: Agregar análisis de firma de corriente para fallas eléctricas`,
    duracion_minutos: 120
  },
  {
    modulo_id: 3, titulo: 'Implementación Estratégica de Gemelos Digitales',
    orden: 4,
    contenido_markdown: `# Lección 3.4: Implementación Estratégica

## Descripción
Diseñar una estrategia de implementación priorizada por impacto y viabilidad.

## Duración: 2 horas

---

## Contenido Teórico

### Framework de Priorización

|  | Alto Impacto | Bajo Impacto |
|--|-------------|-------------|
| **Alta Viabilidad** | **PRIORIDAD 1:** Implementar ya | **PRIORIDAD 3:** Si hay recursos |
| **Baja Viabilidad** | **PRIORIDAD 2:** Invertir en preparación | **PRIORIDAD 4:** Postponer |

### Roadmap de Implementación

**Fase 1 — Piloto (6 meses):**
- 1 activo crítico
- Gemelo básico (Nivel 1-2)
- Medir baseline
- Evaluar ROI

**Fase 2 — Expansión (12-18 meses):**
- 5-10 activos críticos
- Gemelos de Nivel 2-3
- Integrar con SAP, SCADA
- Capacitar equipo interno

**Fase 3 — Escalamiento (24-36 meses):**
- Gemelos de planta completa
- Nivel 4-5
- Plataforma central
- Centro de Excelencia

### Métricas de Éxito

| Métrica | Baseline | Meta Fase 1 | Meta Fase 3 |
|---------|---------|-------------|-------------|
| Downtime no planificado | 8% | 5% | 2% |
| Costo mantenimiento | $X/año | -10% | -30% |
| Tiempo de diagnóstico | 8 horas | 4 horas | 1 hora |
| Predicción de fallas | 0% | 60% | 90% |

---

## Ejercicio: Desarrollo de Estrategia

1. Seleccione un área de PDVSA
2. Identifique 3 activos críticos
3. Evalúe con el framework de priorización
4. Desarrolle roadmap de 12 meses
5. Defina métricas de éxito`,
    duracion_minutos: 120
  },

  // ============ MÓDULO 4: INVESTIGACIÓN DE OPERACIONES Y OPTIMIZACIÓN ============
  {
    modulo_id: 4, titulo: 'Fundamentos de Investigación de Operaciones y Modelado Matemático con IA',
    orden: 1,
    contenido_markdown: `# Lección 4.1: Fundamentos de Investigación de Operaciones

## Descripción
Introducción a los métodos cuantitativos de la Investigación de Operaciones (I.O.) y su aplicación en la industria petrolera.

## Duración: 2 horas

---

## Contenido Teórico

### ¿Qué es la Investigación de Operaciones?

La Investigación de Operaciones (I.O.) es una disciplina que aplica métodos analíticos avanzados para la toma de decisiones. Combina matemáticas, estadística e ingeniería para optimizar sistemas complejos.

| Componente | Definición | Ejemplo en Oil & Gas |
|-----------|-----------|---------------------|
| **Modelo Matemático** | Representación abstracta del sistema real | Función de producción de un pozo |
| **Variables de Decisión** | Elementos que el decisor puede controlar | Volumen de inyección de vapor |
| **Restricciones** | Límites del sistema | Capacidad de la refinería |
| **Función Objetivo** | Meta a maximizar o minimizar | Maximizar margen de refinación |

### Ramas Principales de la I.O.

| Rama | Método | Aplicación Petrolera |
|------|--------|---------------------|
| **Programación Lineal** | Simplex, Dual Simplex | Optimización de mezclas de crudo |
| **Teoría de Grafos** | CPM, PERT, Dijkstra | Planificación de paradas de planta |
| **Modelos de Inventario** | EOQ, Lote Económico | Gestión de repuestos críticos |
| **Teoría de Colas** | M/M/1, M/M/c | Gestión de tráfico portuario |
| **Programación Entera** | Branch and Bound | Asignación de pozos a plantas |

### El Proceso de Modelado I.O.

\`\`\`
Problema Real → Formulación Matemática → Solución → Interpretación → Implementación
     ↓                ↓                    ↓           ↓              ↓
 Observación      Ecuaciones         Simplex/CPM   Resultados    Acción
\`\`\`

---

## Ejercicio: Identificación de Problemas I.O.

Identifique qué rama de la I.O. aplicaría para cada situación:

1. Optimizar el blend de crudo para maximizar ganancias → ¿?
2. Planificar la parada de mantenimiento de una refinería → ¿?
3. Determinar cuántos repuestos pedir al año → ¿?
4. Reducir el tiempo de espera en una estación de carga → ¿?

**Respuestas:** 1-Programación Lineal, 2-Teoría de Grafos, 3-Modelos de Inventario, 4-Teoría de Colas`,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'Optimización de Recursos con Programación Lineal y Método Simplex',
    orden: 2,
    contenido_markdown: `# Lección 4.2: Programación Lineal y Método Simplex

## Descripción
Aplicación del Método Simplex para resolver problemas de optimización en la industria petrolera: mezclas de crudo, distribución de presupuesto y asignación de recursos.

## Duración: 2 horas

---

## Contenido Teórico

### Programación Lineal: Definición

Un problema de Programación Lineal (PL) se define como:

\`\`\`
Maximizar (o Minimizar): Z = c₁x₁ + c₂x₂ + ... + cₙxₙ  (Función Objetivo)
Sujeto a:
    a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ ≤ b₁  (Restricción 1)
    a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ ≤ b₂  (Restricción 2)
    x₁, x₂, ..., xₙ ≥ 0                (No negatividad)
\`\`\`

### Método Simplex: Pasos

| Paso | Operación | Descripción |
|------|----------|-------------|
| 1 | Estandarizar | Convertir desigualdades en igualdades con variables de holgura |
| 2 | Tabla inicial | Construir tabla con variables básicas y no básicas |
| 3 | Variable entrante | Seleccionar columna con mayor coeficiente positivo (Z) |
| 4 | Variable saliente | Dividir columna derecha / columna entrante → menor ratio positivo |
| 5 | Pivote | Operaciones fila para hacer pivote = 1 y resto = 0 |
| 6 | Repetir | Hasta que todos los coeficientes de Z sean ≤ 0 |

### Caso Petrolero: Optimización de Mezcla de Crudo

**Problema:** Una refinería procesa dos tipos de crudo:
- Crudo Pesado (X₁): Margen $12/barril, requiere 4 horas de procesamiento
- Crudo Liviano (X₂): Margen $20/barril, requiere 2 horas de procesamiento

**Restricciones:**
- Capacidad: 4X₁ + 2X₂ ≤ 400 horas/día
- Mezcla: X₁ + X₂ ≤ 120 barriles/día
- Demanda mínima de pesado: X₁ ≥ 20 barriles/día

**Formulación:**
\`\`\`
Maximizar Z = 12X₁ + 20X₂
Sujeto a:
4X₁ + 2X₂ ≤ 400
X₁ + X₂ ≤ 120
X₁ ≥ 20
X₁, X₂ ≥ 0
\`\`\`

### Solución por Simplex (Resumen)

| Iteración | X₁ | X₂ | Holgura 1 | Holgura 2 | Z |
|-----------|----|----|-----------|-----------|-----|
| Inicial | 0 | 0 | 400 | 120 | 0 |
| Iteración 1 | 0 | 120 | 160 | 0 | 2400 |
| Iteración 2 | 20 | 100 | 0 | 0 | 2240 |

**Solución óptima:** X₁ = 20, X₂ = 100, Z* = $2,240/día

---

## Caso Práctico: Asignación de Presupuesto

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Asignación de Presupuesto de Mantenimiento

DATOS:
- Presupuesto total: $5,000,000
- 3 áreas: Refinería (A), Planta de Gas (B), Oleoducto (C)
- Margen por inversión: A = $1.50, B = $1.80, C = $1.20 (por dólar invertido)
- Restricciones:
  - Mínimo $1,000,000 por área
  - Máximo 40% del total en una sola área
  - Total no puede exceder presupuesto

INSTRUCCIÓN: Resuelva con Simplex y presente la asignación óptima.
\`\`\`

**Respuesta Esperada:**
- Refinería: $2,000,000 (40%)
- Planta de Gas: $2,000,000 (40%)
- Oleoducto: $1,000,000 (20%)
- ROI total: $8,200,000`,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'Planificación Crítica de Proyectos Petroleros con CPM/PERT y Algoritmos de Red',
    orden: 3,
    contenido_markdown: `# Lección 4.3: Planificación con CPM/PERT y Teoría de Grafos

## Descripción
Aplicación de los métodos de la Ruta Crítica (CPM) y PERT para la planificación y control de proyectos petroleros, con énfasis en paradas de planta y mantenimiento industrial.

## Duración: 2 horas

---

## Contenido Teórico

### Método del Camino Crítico (CPM)

**Definición:** El CPM (Critical Path Method) es una técnica de gestión de proyectos que identifica las tareas más largas (camino crítico) que determinan la duración mínima del proyecto.

| Concepto | Definición | Fórmula |
|----------|-----------|---------|
| **Tiempo Temprano (TE)** | Fecha más temprana de inicio | TE = max(TE_predecesora + Duración) |
| **Tiempo Tardío (TT)** | Fecha más tardía de inicio sin retrasar proyecto | TT = min(TT_sucesora - Duración) |
| **Holgura Total** | Tiempo disponible de demora sin afectar proyecto | HT = TT - TE |
| **Camino Crítico** | Secuencia de tareas con HT = 0 | Ruta más larga de la red |

### Método PERT (Program Evaluation and Review Technique)

**Diferencia con CPM:** PERT usa estimaciones probabilísticas:

\`\`\`
Tiempo Esperado (TE) = (O + 4M + P) / 6
Varianza (σ²) = [(P - O) / 6]²

O = Optimista, M = Más probable, P = Pessimista
\`\`\`

### Algoritmos de Red

| Algoritmo | Objetivo | Complejidad |
|-----------|---------|------------|
| **Dijkstra** | Ruta más corta entre dos nodos | O(V²) |
| **Bellman-Ford** | Ruta más corta con pesos negativos | O(VE) |
| **Floyd-Warshall** | Rutas más cortas entre todos los pares | O(V³) |
| **Flujo Máximo (Ford-Fulkerson)** | Capacidad máxima de flujo en red | O(EF) |

### Diagrama de Red AON (Activity On Node)

\`\`\`
[Nodo Inicio] → [A: Desarmar] → [C: Inspeccionar] → [E: Rearmar] → [Fin]
       ↓              ↓                ↓                ↓
   [B: Drenar] → [D: Reparar]  → [F: Pruebas]  → [Fin]
\`\`\`

---

## Caso Práctico: Parada de Mantenimiento — Planta de Fraccionamiento

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Parada de Mantenimiento — Planta Y

TAREAS IDENTIFICADAS:
| ID | Tarea | Duración (días) | Predecesoras |
|----|-------|-----------------|--------------|
| A  | Drenaje y limpieza | 3 | Ninguna |
| B  | Aislamiento eléctrico | 2 | Ninguna |
| C  | Desarme de equipamiento | 5 | A, B |
| D  | Inspección visual | 2 | C |
| E  | Reparación de corrosión | 7 | D |
| F  | Pruebas hidrostáticas | 3 | E |
| G  | Remontaje y alineación | 4 | F |
| H  | Puesta en marcha | 2 | G |

INSTRUCCIÓN:
1. Construya el diagrama de red
2. Calcule TE y TT de cada tarea
3. Identifique el camino crítico
4. Determine la duración total del proyecto
5. ¿Cuánto tiempo se ahorraría si la tarea E se reduce a 5 días?
\`\`\`

**Respuesta Esperada:**
- Camino crítico: A → C → D → E → F → G → H
- Duración total: 26 días
- Con E reducida a 5 días: 24 días (ahorro de 2 días)`,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'Modelos de Inventario Inteligente (EOQ) para la Reducción de Costos en Almacén',
    orden: 4,
    contenido_markdown: `# Lección 4.4: Modelos de Inventario — EOQ y Gestión de Stock

## Descripción
Aplicación del modelo de Lote Económico de Pedido (EOQ) y sus variantes para la gestión eficiente de inventarios de repuestos críticos en la industria petrolera.

## Duración: 2 horas

---

## Contenido Teórico

### El Problema del Inventario

En Oil & Gas, el inventario de repuestos críticos representa un equilibrio entre:
- **Costo de pedir** (setup): Trámites, transporte, inspección
- **Costo de mantener** (holding): Almacenamiento, obsolescencia, capital de trabajo
- **Costo de desabastecimiento** (stockout): Parada de planta, pérdida de producción

### Modelo EOQ Clásico (Wilson)

\`\`\`
                    ___________
Q* = √( 2 × D × S / H )

Q* = Cantidad óptima de pedido
D  = Demanda anual (unidades/año)
S  = Costo fijo por pedido (USD/pedido)
H  = Costo de mantener unidad por año (USD/unidad/año)
\`\`\`

**Fórmulas complementarias:**

| Fórmula | Descripción |
|---------|------------|
| N* = D/Q* | Número óptimo de pedidos por año |
| CT = (D/Q*)S + (Q*/2)H + DC | Costo total anual |
| ROP = d × L | Punto de reorden (demanda diaria × lead time) |
| SS = Z × σ × √L | Stock de seguridad (Z = factor服务水平, σ = desviación) |

### Variantes del Modelo EOQ

| Modelo | Condición | Aplicación |
|--------|----------|-----------|
| **EOQ Clásico** | Demanda constante, sin restricciones | Repuestos estándar |
| **EOQ con Descuento** | Precio variable por volumen | Compras al por mayor |
| **EOQ con Restricción de Espacio** | Almacenamiento limitado | Almacenes pequeños |
| **EOQ con Desabastecimiento Permitido** | Stockout parcial controlado | Repuestos no críticos |
| **Modelo (Q,R)** | Revisión continua | Repuestos de alto valor |

### Clasificación ABC para Inventario

| Clase | % Artículos | % Valor | Estrategia |
|-------|-----------|---------|-----------|
| **A** | 10-20% | 70-80% | Control estricto, EOQ clásico |
| **B** | 20-30% | 15-25% | Control moderado, revisión periódica |
| **C** | 50-70% | 5-10% | Control simple, pedido por lote |

---

## Caso Práctico: Repuestos Críticos para Bombas

**Prompt para el Simulador:**

\`\`\`
SIMULADOR: Gestión de Inventario — Repuestos Cr DATOS DEL REPUESTO:
- Tipo: Rodamiento de bomba centrífuga (BRG-450)
- Demanda anual: 120 unidades
- Costo por unidad: $850 USD
- Costo fijo por pedido: $150 USD
- Costo de mantenimiento: 20% del valor unitario/año
- Lead time del proveedor: 15 días
- Demanda diaria: 0.33 unidades/día
- Desviación estándar de demanda: 0.1 unidades
- Nivel de servicio deseado: 95% (Z = 1.65)

INSTRUCCIÓN:
1. Calcule Q* (lote económico)
2. Calcule N* (pedidos por año)
3. Calcule ROP (punto de reorden)
4. Calcule Stock de Seguridad
5. Calcule el costo total anual
6. Compare con el pedido actual de 50 unidades cada vez
7. Genere gráfico de ciclo de inventario
\`\`\`

**Respuesta Esperada:**
- Q* = √(2 × 120 × 150 / 170) = √211.76 ≈ 15 unidades
- N* = 120/15 = 8 pedidos/año
- ROP = 0.33 × 15 = 5 unidades
- SS = 1.65 × 0.1 × √15 = 0.64 ≈ 1 unidad
- Costo total: $103,200/año (vs. $105,000 con pedido actual de 50)
- **Ahorro: $1,800/año (1.7%)**

---

## Ejercicio: Análisis de Sensibilidad

¿Qué pasa si:
1. La demanda sube a 150 unidades/año?
2. El costo de pedido baja a $100 USD?
3. El lead time aumenta a 25 días?
4. El nivel de servicio sube a 99% (Z = 2.33)?`,
    duracion_minutos: 120
  }
];

const academicEvaluations = [
  // ============ MÓDULO 1 ============
  {
    modulo_id: 1,
    titulo: 'Evaluación Módulo 1: Fundamentos de IA',
    descripcion: 'Evaluación sobre conceptos básicos de Inteligencia Artificial aplicados a Oil & Gas',
    ponderacion: 100,
    tiempo_limite_minutos: 30,
    preguntas: [
      {
        id: 1,
        pregunta: '¿Cuál es la diferencia principal entre Machine Learning (ML) y Deep Learning (DL)?',
        opciones: [
          'ML usa redes neuronales; DL usa algoritmos estadísticos',
          'ML aprende de datos estructurados; DL utiliza redes neuronales profundas para patrones complejos',
          'DL es un subset de ML que solo funciona con datos de imagen',
          'No hay diferencia, son sinónimos'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El Deep Learning es un subconjunto del Machine Learning que utiliza redes neuronales con múltiples capas para aprender patrones complejos. ML es el paraguas general que incluye también regresión, árboles de decisión, etc.'
      },
      {
        id: 2,
        pregunta: '¿Cuál de las siguientes aplicaciones de IA tiene MAYOR impacto en la reducción de costos de mantenimiento en una refinería?',
        opciones: [
          'Análisis de sentimientos en redes sociales',
          'Mantenimiento predictivo basado en datos de sensores',
          'Chatbot para atención al cliente',
          'Generación automática de contenido para redes sociales'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El mantenimiento predictivo permite anticipar fallas antes de que ocurran, reduciendo el downtime no planificado hasta en un 50%, con un ROI que típicamente supera el 300% en el primer año.'
      },
      {
        id: 3,
        pregunta: 'En el contexto de PDVSA, ¿cuál es el "costo de no hacer nada" más significativo al no implementar IA?',
        opciones: [
          'Perder competitividad en redes sociales',
          'Continuar con mantenimiento reactivo que genera costos de downtime impredecibles',
          'No tener suficientes empleados',
          'No tener acceso a internet de alta velocidad'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El mantenimiento reactivo genera costos impredecibles y downtime que afecta directamente la producción y los ingresos. La IA permite pasar de reactivo a predictivo, eliminando sorpresas.'
      }
    ]
  },
  // ============ MÓDULO 2 ============
  {
    modulo_id: 2,
    titulo: 'Evaluación Módulo 2: Prompt Engineering',
    descripcion: 'Evaluación sobre diseño efectivo de prompts para modelos de lenguaje',
    ponderacion: 100,
    tiempo_limite_minutos: 30,
    preguntas: [
      {
        id: 1,
        pregunta: '¿Cuál de los siguientes prompts generará una respuesta MÁS útil para un reporte de producción?',
        opciones: [
          '"Háblame de producción"',
          '"Actúa como ingeniero de producción de PDVSA. Analiza la producción del Campo Cerro Negro en marzo 2024 vs. meta, presenta en tabla comparativa, extensión 500 palabras."',
          '"Genera un reporte"',
          '"¿Qué es la producción de petróleo?"'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El prompt B incluye los 5 componentes clave: Rol (ingeniero de producción), Contexto (Cerro Negro, marzo 2024), Tarea (analizar vs. meta), Formato (tabla comparativa) y Restricciones (500 palabras).'
      },
      {
        id: 2,
        pregunta: '¿Qué técnica de Prompt Engineering es más adecuada cuando necesitas que la IA analice un problema paso a paso?',
        opciones: [
          'Few-Shot Prompting',
          'Role Prompting',
          'Chain of Thought (Cadena de Pensamiento)',
          'Prompt Directo'
        ],
        respuesta_correcta: 2,
        retroalimentacion: 'Chain of Thought solicita a la IA que razon paso a paso antes de dar una conclusión, lo cual es útil para problemas de análisis técnico.'
      },
      {
        id: 3,
        pregunta: '¿Cuál es el error más común al escribir prompts y cómo se corrige?',
        opciones: [
          'Escribir prompts demasiado largos → Acortar a 10 palabras',
          'No incluir formato de salida → Agregar especificación de formato (tabla, lista, informe)',
          'Usar demasiados ejemplos → Limitar a 1 ejemplo',
          'Escribir en inglés → Siempre usar español'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'No especificar el formato de salida es uno de los errores más comunes. Siempre especifique: "Presenta en tabla", "Formato de lista numerada", "Genera un informe de 2 párrafos".'
      }
    ]
  },
  // ============ MÓDULO 3 ============
  {
    modulo_id: 3,
    titulo: 'Evaluación Módulo 3: Gemelos Digitales',
    descripcion: 'Evaluación sobre gemelos digitales en la industria petrolera',
    ponderacion: 100,
    tiempo_limite_minutos: 30,
    preguntas: [
      {
        id: 1,
        pregunta: '¿Cuáles son los 3 componentes fundamentales de un gemelo digital?',
        opciones: [
          'Hardware, Software, Internet',
          'Físico (el activo), Digital (el modelo) y Conectividad (sensores)',
          'Datos, Algoritmos, Resultados',
          'SCADA, PLC, IoT'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'Un gemelo digital requiere: 1) El activo físico real, 2) Una réplica virtual (modelo matemático), y 3) Conexión en tiempo real entre ambos (sensores, SCADA, IoT).'
      },
      {
        id: 2,
        pregunta: '¿En qué nivel de madurez se encuentra la mayoría de las operaciones de Oil & Gas actualmente?',
        opciones: [
          'Nivel 5 — Optimización Autónoma',
          'Nivel 4 — Simulación',
          'Nivel 1-2 — Monitoreo Básico y Diagnóstico',
          'No hay niveles definidos'
        ],
        respuesta_correcta: 2,
        retroalimentacion: 'La mayoría está en Nivel 1 (monitoreo básico) o Nivel 2 (diagnóstico). El objetivo es avanzar hacia Nivel 3-4 (predicción y simulación).'
      },
      {
        id: 3,
        pregunta: '¿Cuál es la principal ventaja de un gemelo digital sobre un modelo estático?',
        opciones: [
          'Es más barato de implementar',
          'Se actualiza en tiempo real con datos del activo físico',
          'No requiere sensores',
          'Puede reemplazar completamente al ingeniero'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'La diferencia clave es que un gemelo digital está "vivo" — se actualiza continuamente con datos de sensores del activo real, a diferencia de un modelo estático.'
      }
    ]
  },
  // ============ MÓDULO 4 ============
  {
    modulo_id: 4,
    titulo: 'Evaluación Módulo 4: Investigación de Operaciones',
    descripcion: 'Evaluación sobre métodos de Investigación de Operaciones aplicados a la industria petrolera',
    ponderacion: 100,
    tiempo_limite_minutos: 30,
    preguntas: [
      {
        id: 1,
        pregunta: '¿Cuál es el objetivo principal del Método Simplex en Programación Lineal?',
        opciones: [
          'Encontrar la ruta más corta en un grafo',
          'Encontrar la solución óptima que maximiza o minimiza la función objetivo',
          'Calcular el punto de reorden de inventario',
          'Predecir la demanda futura de productos'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El Método Simplex es un algoritmo que resuelve problemas de Programación Lineal encontrando la solución óptima en los vértices del poliedro de soluciones factibles.'
      },
      {
        id: 2,
        pregunta: 'En el CPM (Critical Path Method), ¿qué representa una tarea con holgura total igual a cero?',
        opciones: [
          'Es una tarea que puede retrasarse sin afectar el proyecto',
          'Es una tarea crítica que determina la duración del proyecto',
          'Es una tarea que no tiene predecesoras',
          'Es una tarea que puede ejecutarse en paralelo con cualquier otra'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'Las tareas con holgura total = 0 forman el camino crítico. Cualquier retraso en estas tareas retrasa todo el proyecto.'
      },
      {
        id: 3,
        pregunta: '¿Cuál es la fórmula del modelo EOQ (Lote Económico de Pedido)?',
        opciones: [
          'Q* = D × S / H',
          'Q* = √(2DS/H)',
          'Q* = (D + S) / 2',
          'Q* = D / (S × H)'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'El EOQ se calcula como Q* = √(2DS/H), donde D = demanda anual, S = costo por pedido, H = costo de mantener unidad por año.'
      }
    ]
  }
];

module.exports = { academicModules, academicLessons, academicEvaluations };
