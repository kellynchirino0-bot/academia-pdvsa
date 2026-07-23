/**
 * Seed script: Contenido Académico Completo
 * Módulos 1-4 del curso "IA para Líderes de Negocio - PDVSA"
 * 16 lecciones, 16 simuladores, 12 evaluaciones
 */

const academicModules = [
  {
    id: 1, numero_modulo: 1,
    titulo: 'Fundamentos de Inteligencia Artificial',
    descripcion: 'Conceptos básicos de IA, ML y Deep Learning. Aplicaciones directas en mantenimiento predictivo, optimización de pozos y análisis sísmico en la industria Oil & Gas.',
    icono: '🤖', duracion_horas: 8,
    objetivos: [
      'Distinguir entre IA, Machine Learning y Deep Learning con claridad ejecutiva',
      'Identificar casos de uso de IA aplicables a las operaciones de PDVSA',
      'Evaluar el ROI potencial de proyectos de IA en activos petroleros',
      'Comunicar iniciativas de IA a equipos técnicos y directivos'
    ],
    competencias: ['Análisis estratégico', 'Toma de decisiones basada en datos', 'Comunicación ejecutiva']
  },
  {
    id: 2, numero_modulo: 2,
    titulo: 'Prompt Engineering para Sector Oil & Gas',
    descripcion: 'Principios de diseño de prompts efectivos para modelos de lenguaje. Plantillas operacionales para reportes técnicos, resumen de normativas y gestión en PDVSA.',
    icono: '💬', duracion_horas: 8,
    objetivos: [
      'Diseñar prompts efectivos para diferentes contextos de negocio',
      'Crear plantillas de prompts reutilizables para tareas comunes de PDVSA',
      'Evaluar y mejorar la calidad de las respuestas generadas por IA',
      'Aplicar técnicas avanzadas como Few-Shot, Chain of Thought y Role Prompting'
    ],
    competencias: ['Comunicación con IA', 'Optimización de procesos', 'Generación de contenido técnico']
  },
  {
    id: 3, numero_modulo: 3,
    titulo: 'Gemelos Digitales en Industria Petrolera',
    descripcion: 'Réplicas virtuales de activos y procesos industriales. Simulación de refinerías, monitoreo de campos en tiempo real y prevención de fallas.',
    icono: '🏭', duracion_horas: 8,
    objetivos: [
      'Comprender la arquitectura y componentes de un gemelo digital',
      'Identificar activos prioritarios para digitalización en PDVSA',
      'Diseñar estrategias de implementación de gemelos digitales',
      'Interpretar visualizaciones y simulaciones para la toma de decisiones'
    ],
    competencias: ['Simulación industrial', 'Monitoreo en tiempo real', 'Análisis predictivo']
  },
  {
    id: 4, numero_modulo: 4,
    titulo: 'IA Generativa y Herramientas Multimodales',
    descripcion: 'Uso de GPT, DALL-E, Stable Diffusion y modelos de código. Creación de prototipos, visualización de escenarios y automatización de scripts.',
    icono: '🎨', duracion_horas: 8,
    objetivos: [
      'Utilizar GPT-4 para generación de contenido técnico y ejecutivo',
      'Emplear herramientas de generación de imágenes para visualización de escenarios',
      'Generar scripts de código para automatización de procesos',
      'Evaluar la calidad y limitaciones del contenido generado por IA'
    ],
    competencias: ['IA generativa', 'Automatización', 'Visualización de datos']
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
    contenido_markdown: `# Lección 2.3: Plantillas de Prompts para PDVSA

## Descripción
Crear y aplicar un kit de plantillas de prompts reutilizables para las tareas más comunes.

## Duración: 2 horas

---

## Contenido Teórico

### Categorías de Prompts para Oil & Gas

| Categoría | Uso Principal | Frecuencia |
|-----------|--------------|------------|
| **Reportes Técnicos** | Informes de producción, incidentes, mantenimiento | Diaria |
| **Resumen de Normativas** | Sintetizar regulaciones de seguridad | Semanal |
| **Análisis de Datos** | Interpretar tendencias, identificar anomalías | Diaria |
| **Comunicación** | Emails, memorandos, presentaciones | Diaria |
| **Planificación** | Planes de trabajo, cronogramas, presupuestos | Semanal |

### Plantilla 1: Reporte Técnico de Producción

\`\`\`
ACTÚA como: Ingeniero de Producción Senior con 15 años de experiencia en la Faja del Orinoco.

CONTEXTO: Trabajo en PDVSA, campo [NOMBRE]. Generando reporte de [PERÍODO].

TAREA: Reporte técnico que incluya:
1. Resumen ejecutivo (1 párrafo)
2. Producción total vs. meta
3. Análisis de tendencia
4. Factores que afectan la producción
5. Recomendaciones para el próximo período

FORMATO: 500-700 palabras, títulos numerados, tabla resumen, lenguaje técnico accesible
\`\`\`

### Plantilla 2: Resumen de Normativa de Seguridad

\`\`\`
ACTÚA como: Especialista en Seguridad Industrial con certificación en normativas petroleras.

TAREA: Resume la normativa [NOMBRE]:
1. Propósito principal
2. Requisitos clave para el personal
3. Consecuencias del incumplimiento
4. Documentos requeridos
5. Frecuencia de revisión

FORMATO: 300-400 palabras, lista numerada, tabla de cumplimiento Sí/No
\`\`\`

### Plantilla 3: Análisis de Causa Raíz

\`\`\`
ACTÚA como: Investigador de Incidentes con experiencia en Root Cause Analysis.

CONTEXTO: Incidente: [DESCRIPCIÓN]

TAREA: Análisis de causa raíz usando "5 Por Qués":
- Tabla con 5 niveles de causa
- Cada nivel: Causa → Evidencia → Siguiente pregunta
- Conclusión con causa raíz
- 3 recomendaciones (inmediata, corto plazo, largo plazo)
\`\`\`

### Plantilla 4: Email Ejecutivo

\`\`\`
ACTÚA como: Gerente de Área de PDVSA.

TAREA: Email ejecutivo:
1. Asunto claro (máx. 10 palabras)
2. Contexto en 1-2 oraciones
3. Puntos principales (máx. 3 bullets)
4. Solución o recomendación específica
5. Próximos pasos

FORMATO: 150-250 palabras, tono profesional, directo
\`\`\`

---

## Ejercicio: Creación de Prompt Personalizado

1. Identifique una tarea repetitiva en su trabajo diario
2. Use la plantilla maestra para crear un prompt personalizado
3. Pruebe en ChatGPT o Claude
4. Mejore iterativamente hasta obtener resultado satisfactorio`,
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

  // ============ MÓDULO 4: IA GENERATIVA ============
  {
    modulo_id: 4, titulo: 'Fundamentos de IA Generativa — GPT y Modelos de Lenguaje',
    orden: 1,
    contenido_markdown: `# Lección 4.1: Fundamentos de IA Generativa

## Descripción
Comprender los fundamentos de modelos de lenguaje generativos y su aplicación en Oil & Gas.

## Duración: 2 horas

---

## Contenido Teórico

### ¿Qué es la IA Generativa?
Sistemas de IA que crean contenido nuevo (texto, imágenes, código, audio) basándose en patrones aprendidos.

| Característica | IA Tradicional | IA Generativa |
|---------------|----------------|---------------|
| Objetivo | Clasificar, predecir | Crear, generar |
| Entrada | Datos estructurados | Datos + instrucciones |
| Salida | Etiqueta, número | Texto, imagen, código |
| Ejemplo PDVSA | "¿Esta bomba fallará?" | "Diseña un reporte de producción" |

### Modelos de Lenguaje Principales

| Modelo | Desarrollador | Aplicación en Oil & Gas |
|--------|--------------|------------------------|
| **GPT-4** | OpenAI | Análisis técnico, reportes |
| **Claude** | Anthropic | Documentación extensa |
| **Gemini** | Google | Análisis de imágenes técnicas |
| **Llama** | Meta | Implementación on-premise |

### Aplicaciones en PDVSA

1. **Generación de Reportes Técnicos**
2. **Análisis de Documentos Técnicos**
3. **Asistencia en Toma de Decisiones**
4. **Capacitación y Documentación**

### Limitaciones

| Limitación | Mitigación |
|-----------|-----------|
| Alucinaciones | Verificar con fuentes oficiales |
| Conocimiento obsoleto | Proporcionar datos actualizados |
| Sesgos | Evaluar críticamente |
| Sin datos en tiempo real | Incluir datos en el prompt |

---

## Ejercicio: Generación de Contenido Técnico

**Prompt:**

\`\`\`
ACTÚA como: Instructor de seguridad industrial de PDVSA.
TAREA: Guía de capacitación sobre procedimientos de seguridad para operadores de estación de compresión de gas natural.
INCLUYE: 5 riesgos principales, procedimientos, EPP, emergencias.
FORMATO: 500-600 palabras, tabla de verificación pre-operacional con 8 puntos.
\`\`\``,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'Herramientas de Generación de Imágenes',
    orden: 2,
    contenido_markdown: `# Lección 4.2: Herramientas de Generación de Imágenes

## Descripción
Utilizar herramientas de generación de imágenes para visualización de escenarios operacionales.

## Duración: 2 horas

---

## Contenido Teórico

### Herramientas Principales

| Herramienta | Tipo | Caso de Uso en Oil & Gas |
|------------|------|------------------------|
| **DALL-E 3** | Propietario | Visualización de escenarios, presentaciones |
| **Stable Diffusion** | Open Source | Modelos personalizados |
| **Midjourney** | Propietario | Materiales de comunicación |

### Estructura de Prompt de Imagen

\`\`\`
[SUJETO] + [ESTILO] + [CONTEXTO] + [DETALLES] + [ILUMINACIÓN] + [COMPOSICIÓN]
\`\`\`

**Ejemplo:**
\`\`\`
"Una estación de compresión de gas natural industrial, fotografía profesional, 
campo petrolero venezolano día soleado, compresores centrífugos y tuberías 
de acero inoxidable, luz natural, vista panorámica ángulo elevado"
\`\`\`

### Aplicaciones en Oil & Gas

| Aplicación | Herramienta Recomendada |
|-----------|------------------------|
| Visualización de diseños conceptuales | DALL-E 3, Midjourney |
| Materiales de capacitación | DALL-E 3, Stable Diffusion |
| Presentaciones ejecutivas | Midjourney, DALL-E 3 |
| Análisis de escenarios | Stable Diffusion |

### Limitaciones
- NO usar para ingeniería de diseño (son conceptuales)
- Verificar accuracy
- Usar herramientas con licencia comercial
- Revisar sesgos

---

## Ejercicio: Visualización de Escenarios

**Prompt:**

\`\`\`
"Fotografía profesional de una unidad de inyección de vapor en la Faja del Orinoco. 
Pozos con bombas de extracción al fondo, torres de inyección al medio, tuberías 
al frente. Paisaje de sabana, día soleado, estilo documental."
\`\`\`

Evalúe: ¿Es adecuada para uso corporativo? ¿Qué aspectos son realistas?`,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'IA Generativa para Código — Automatización de Scripts',
    orden: 3,
    contenido_markdown: `# Lección 4.3: IA Generativa para Código

## Descripción
Utilizar herramientas de generación de código para automatizar análisis de datos y procesamiento técnico.

## Duración: 2 horas

---

## Contenido Teórico

### Herramientas de Código

| Herramienta | Lenguajes | Aplicación |
|------------|----------|-----------|
| **GitHub Copilot** | Python, SQL, JS | Asistencia en desarrollo |
| **ChatGPT/GPT-4** | Todos | Scripts completos |
| **Claude** | Todos | Análisis y documentación |

### Casos de Uso en Oil & Gas

1. **Scripts de Análisis de Datos de Producción**
2. **Automatización de Reportes**
3. **Procesamiento de Datos Sísmicos**
4. **Scripts de Control de Calidad**

### Estructura de Prompt para Código

\`\`\`
CONTEXTO: Soy ingeniero de producción en PDVSA, trabajo con Python

TAREA: Genera un script en Python que [DESCRIPCIÓN]

ENTRADA: Archivo CSV con columnas: [NOMBRES]

SALIDA: Archivo de salida [NOMBRE] en formato [CSV/Excel/Gráfico]

RESTRICCIONES: Usar solo pandas, matplotlib. Incluir comentarios. Manejar errores.
\`\`\`

---

## Caso Práctico: Script de Análisis de Producción

**Prompt:**

\`\`\`
Genera un script Python que:
1. LEA CSV con: Fecha, ID_Pozo, Produccion_BPD, Water_Cut, Horas_Operacion
2. PROCESO: Promedio diario, top 5 declinación, top 5 water cut, eficiencia
3. SALIDA: Excel (3 hojas) + 2 gráficos PNG
4. RESTRICCIONES: pandas, matplotlib, openpyxl. Comentarios. Manejo de errores.
\`\`\`

**Fragmento de respuesta esperada:**

\`\`\`python
"""
Script de Análisis de Producción — PDVSA
"""
import pandas as pd
import matplotlib.pyplot as plt

def cargar_datos(ruta_archivo):
    """Carga y valida archivo CSV de producción."""
    try:
        df = pd.read_csv(ruta_archivo, parse_dates=['Fecha'])
        return df
    except FileNotFoundError:
        print(f"Error: Archivo no encontrado: {ruta_archivo}")
        sys.exit(1)

def calcular_resumen(df):
    """Calcula resumen general de producción."""
    return {
        'produccion_total': df['Produccion_BPD'].sum(),
        'water_cut_promedio': df['Water_Cut'].mean()
    }
\`\`\``,
    duracion_minutos: 120
  },
  {
    modulo_id: 4, titulo: 'Evaluación y Estrategia de Adopción de IA Generativa',
    orden: 4,
    contenido_markdown: `# Lección 4.4: Evaluación y Estrategia de Adopción

## Descripción
Evaluar herramientas de IA generativa y desarrollar estrategia de adopción responsable.

## Duración: 2 horas

---

## Contenido Teórico

### Framework de Evaluación

| Criterio | Preguntas | Peso |
|---------|----------|------|
| Calidad del Output | ¿Qué tan precisos son los resultados? | 25% |
| Seguridad de Datos | ¿Mis datos están protegidos? | 25% |
| Costo Total | ¿Costo por usuario/mes? | 20% |
| Integración | ¿Se integra con herramientas existentes? | 15% |
| Curva de Aprendizaje | ¿Qué tan fácil es de usar? | 15% |

### Riesgos en Oil & Gas

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|-----------|
| Alucinaciones técnicas | Alta | Verificación con fuentes |
| Fugas de información | Media | Herramientas on-premise |
| Dependencia excesiva | Media | Mantener capacidades humanas |

### Estrategia de Adopción 3 Niveles

**Nivel 1 — Personal (Inmediato):**
- Herramientas gratuitas/bajo costo
- No datos confidenciales
- Ejemplos: ChatGPT Free/Plus

**Nivel 2 — Departamental (3-6 meses):**
- Licencia empresarial
- Equipos específicos
- Ejemplos: ChatGPT Enterprise

**Nivel 3 — Institucional (6-12 meses):**
- On-premise o nube privada
- Toda la organización
- Datos bajo control de PDVSA

### Métricas de Adopción

| Métrica | Meta 6 meses | Meta 12 meses |
|---------|-------------|--------------|
| Usuarios activos | 100 | 500 |
| Horas ahorradas/usuario/semana | 2h | 5h |
| ROI estimado | 200% | 400% |

---

## Ejercicio: Estrategia de Adopción

1. Evalúe 3 herramientas usando el framework
2. Identifique riesgos específicos para PDVSA
3. Desarrolle estrategia de 12 meses
4. Defina métricas de éxito`,
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
    titulo: 'Evaluación Módulo 4: IA Generativa',
    descripcion: 'Evaluación sobre IA generativa y herramientas multimodales',
    ponderacion: 100,
    tiempo_limite_minutos: 30,
    preguntas: [
      {
        id: 1,
        pregunta: '¿Cuál es la principal limitación de los modelos de lenguaje (GPT, Claude) en Oil & Gas?',
        opciones: [
          'No pueden generar texto en español',
          'Pueden generar "alucinaciones" — información que parece real pero es falsa',
          'Son demasiado lentos para uso industrial',
          'No pueden procesar más de 100 palabras'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'Las alucinaciones son la limitación más crítica. Los modelos pueden generar información técnicamente plausible pero incorrecta. Siempre verificar con fuentes oficiales.'
      },
      {
        id: 2,
        pregunta: '¿Para qué tarea es más apropiado usar herramientas de generación de imágenes como DALL-E?',
        opciones: [
          'Crear planos de ingeniería precisos',
          'Visualización conceptual de escenarios y diseños preliminares',
          'Análisis de datos de producción',
          'Monitoreo de activos en tiempo real'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'Las herramientas de generación de imágenes son ideales para visualización conceptual — NO son herramientas de ingeniería y no deben usarse para planos técnicos.'
      },
      {
        id: 3,
        pregunta: '¿Cuál es la recomendación de seguridad MÁS importante al usar IA generativa en PDVSA?',
        opciones: [
          'Usar siempre la herramienta más barata',
          'Nunca ingresar datos sensibles de producción, financieros o estratégicos en herramientas externas',
          'Compartir todas las respuestas en redes sociales',
          'Usar IA para reemplazar completamente a los ingenieros'
        ],
        respuesta_correcta: 1,
        retroalimentacion: 'Los datos de producción, financieros y estratégicos son información confidencial que NUNCA debe ingresarse en herramientas de IA externas. Para datos sensibles, usar herramientas on-premise.'
      }
    ]
  }
];

module.exports = { academicModules, academicLessons, academicEvaluations };
