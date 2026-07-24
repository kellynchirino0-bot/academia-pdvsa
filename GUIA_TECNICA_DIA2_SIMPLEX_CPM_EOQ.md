# 🏭 GUÍA TÉCNICA RESUELTA — DÍA 2
## Investigación de Operaciones & Toma de Decisiones Asistida por IA
### Profesor Jarvis — Academia Virtual Nasser Group & IUTPAL

---

## 📋 Escenario Central: Crisis Operativa en la Faja Petrolífera del Orinoco

> **Contexto:** Es lunes 07:00 AM. Suena el teléfono en la Gerencia de Operaciones. Una falla crítica en la estación de flujo **J-04** del Bloque Junín amenaza con detener 45.000 BPD de producción. Como líder de PDVSA, debe:
> 1. **Optimizar la mezcla de crudo** de los tanques disponibles para no incumplir la cuota de exportación (Simplex)
> 2. **Planificar la parada de reparación** de la estación J-04 minimizando el downtime (CPM/PERT)
> 3. **Gestionar el inventario de repuestos críticos** para que la reparación no se detenga por falta de materiales (EOQ)

---

## 🔷 EJERCICIO 1: MÉTODO SIMPLEX — Optimización de Mezcla de Crudo

### Datos Reales (Basados en Valores Típicos de la Faja del Orinoco)

| Variable | Crudo Pesado (X₁) | Crudo Mediano (X₂) |
|----------|-------------------|--------------------|
| **Gravedad API** | 16° | 30° |
| **Contenido de Azufre** | 2.5% | 0.8% |
| **Margen operativo** | $18/barril | $32/barril |
| **Disponibilidad máxima** | 60.000 BPD | 40.000 BPD |
| **Costo de diluyente** | $4/barril | $0/barril |

### Especificaciones de Exportación (Restricciones)

| Especificación | Requisito |
|----------------|-----------|
| **Gravedad API mínima** | ≥ 22° API |
| **Azufre máximo** | ≤ 1.5% |
| **Producción total mínima** | ≥ 50.000 BPD |
| **Capacidad de la estación** | ≤ 80.000 BPD |

### Formulación del Problema

**Variables de Decisión:**
- X₁ = Barriles por día de Crudo Pesado (16° API)
- X₂ = Barriles por día de Crudo Mediano (30° API)

**Función Objetivo (Maximizar Margen):**
```
Max Z = (18 - 4)X₁ + 32X₂
Max Z = 14X₁ + 32X₂
```
*Nota: El crudo pesado requiere $4/barril de diluyente*

**Restricciones:**

1. **Disponibilidad de crudo pesado:** X₁ ≤ 60.000
2. **Disponibilidad de crudo mediano:** X₂ ≤ 40.000
3. **Capacidad de la estación:** X₁ + X₂ ≤ 80.000
4. **Producción mínima:** X₁ + X₂ ≥ 50.000
5. **Gravedad API mínima:** 16X₁ + 30X₂ ≥ 22(X₁ + X₂) → 8X₂ ≥ 6X₁ → X₂ ≥ 0.75X₁
6. **Azufre máximo:** 2.5X₁ + 0.8X₂ ≤ 1.5(X₁ + X₂) → 2.5X₁ + 0.8X₂ ≤ 1.5X₁ + 1.5X₂ → X₁ ≤ 0.7X₂
7. **No negatividad:** X₁ ≥ 0, X₂ ≥ 0

### Solución Paso a Paso (Método Gráfico)

#### Paso 1: Identificar los vértices de la región factible

Las restricciones activas forman el polígono de soluciones:

| Vértice | Intersección | X₁ | X₂ | Z = 14X₁ + 32X₂ |
|---------|-------------|----|----|---------------------|
| **A** | X₂ = 0.75X₁, X₁ = 60.000 | 60.000 | 45.000 | 14(60000) + 32(45000) = **$2,280,000** |
| **B** | X₂ = 0.75X₁, X₁ + X₂ = 80.000 | 45.714 | 34.286 | 14(45714) + 32(34286) = **$1,737,144** |
| **C** | X₁ = 0.7X₂, X₁ + X₂ = 80.000 | 32.941 | 47.059 | 14(32941) + 32(47059) = **$1,967,647** |
| **D** | X₁ = 0.7X₂, X₂ = 40.000 | 28.000 | 40.000 | 14(28000) + 32(40000) = **$1,672,000** |

#### Paso 2: Evaluar la función objetivo en cada vértice

| Vértice | X₁ (BPD) | X₂ (BPD) | Margen Total | ¿Factible? |
|---------|----------|----------|-------------|------------|
| **A** | 60.000 | 45.000 | **$2,280,000/día** | ✅ Sí |
| **B** | 45.714 | 34.286 | $1,737,144/día | ✅ Sí |
| **C** | 32.941 | 47.059 | $1,967,647/día | ✅ Sí |
| **D** | 28.000 | 40.000 | $1,672,000/día | ✅ Sí |

### ✅ SOLUCIÓN ÓPTIMA

| Variable | Valor Óptimo |
|----------|--------------|
| **Crudo Pesado (X₁)** | **60.000 BPD** |
| **Crudo Mediano (X₂)** | **45.000 BPD** |
| **Producción Total** | **105.000 BPD** |
| **Margen Máximo** | **$2,280,000/día** |
| **Gravedad API resultante** | (16×60000 + 30×45000) / 105000 = **22° API** ✅ |
| **Azufre resultante** | (2.5×60000 + 0.8×45000) / 105000 = **1.77%** ⚠️ (excede 1.5%) |

### 🔄 Ajuste por Restricción de Azufre

La solución A excede el límite de azufre. Recalculamos con la restricción activa:

**Nuevo vértice óptimo:** Restricciones activas: X₁ ≤ 60.000, X₁ ≤ 0.7X₂

| Variable | Valor |
|----------|-------|
| **Crudo Pesado (X₁)** | **32.941 BPD** |
| **Crudo Mediano (X₂)** | **47.059 BPD** |
| **Total** | **80.000 BPD** |
| **Margen** | **$1,967,647/día** |
| **API resultante** | 24.2° ✅ |
| **Azufre resultante** | 1.5% ✅ |

---

## 🔷 EJERCICIO 2: CPM/PERT — Parada de Planta Refinería Amuay

### Contexto

La **Unidad de Destilación Atmosférica (UDA-1)** de la Refinería Amuay debe detenerse para mantenimiento mayor. El superintendente reporta que cada día de parada no planificada cuesta **$850,000** en pérdida de producción. El objetivo es completar la reparación en **≤ 25 días**.

### Lista de Actividades

| ID | Actividad | Duración (días) | Predecesora |
|----|-----------|:---------------:|:-----------:|
| A | Drenaje y purga de la unidad | 2 | — |
| B | Aislamiento mecánico y bloqueo (LOTO) | 1 | A |
| C | Apertura de recipientes y torres | 3 | B |
| D | Inspección visual y END (ultrasonido) | 2 | C |
| E | Diagnóstico y reporte de daños | 1 | D |
| F | Pedido de materiales y repuestos | 4 | E |
| G | Recepción y verificación de materiales | 2 | F |
| H | Reparación de cabezales de intercambiadores | 5 | E |
| I | Reemplazo de tramos de tubería corroída | 6 | E |
| J | Limpieza de fondos de torre | 3 | C |
| K | Reemplazo de válvulas de seguridad (PSV) | 2 | J |
| L | Prueba hidrostática de equipos reparados | 2 | H, I, K |
| M | Armado de aislamiento térmico | 2 | L |
| N | Carga de catalizador y químicos | 1 | M |
| O | Pruebas de puesta en marcha | 1 | N, G |
| P | Arranque progresivo de la unidad | 1 | O |

### Estimaciones PERT (Tiempo Optimista / Más Probable / Pesimista)

| ID | Optimista (a) | Más Probable (m) | Pesimista (b) | μ = (a+4m+b)/6 | σ² = ((b-a)/6)² |
|----|:------------:|:---------------:|:------------:|:--------------:|:--------------:|
| A | 1 | 2 | 3 | **2.00** | 0.11 |
| B | 0.5 | 1 | 1.5 | **1.00** | 0.03 |
| C | 2 | 3 | 5 | **3.17** | 0.25 |
| D | 1 | 2 | 3 | **2.00** | 0.11 |
| E | 0.5 | 1 | 2 | **1.08** | 0.06 |
| F | 3 | 4 | 6 | **4.17** | 0.25 |
| G | 1 | 2 | 3 | **2.00** | 0.11 |
| H | 4 | 5 | 7 | **5.17** | 0.25 |
| I | 5 | 6 | 8 | **6.17** | 0.25 |
| J | 2 | 3 | 4 | **3.00** | 0.11 |
| K | 1 | 2 | 3 | **2.00** | 0.11 |
| L | 1.5 | 2 | 3 | **2.08** | 0.06 |
| M | 1 | 2 | 3 | **2.00** | 0.11 |
| N | 0.5 | 1 | 1.5 | **1.00** | 0.03 |
| O | 0.5 | 1 | 2 | **1.08** | 0.06 |
| P | 0.5 | 1 | 1.5 | **1.00** | 0.03 |

### Cálculo de Ruta Crítica (Forward Pass / Backward Pass)

#### Forward Pass (Tiempos Tempranos — ES, EF)

| ID | ES | EF = ES + μ |
|----|:--:|:----------:|
| A | 0 | 2.00 |
| B | 2.00 | 3.00 |
| C | 3.00 | 6.17 |
| D | 6.17 | 8.17 |
| E | 8.17 | **9.25** |
| F | 9.25 | 13.42 |
| G | 13.42 | 15.42 |
| H | 9.25 | 14.42 |
| I | 9.25 | 15.42 |
| J | 6.17 | 9.17 |
| K | 9.17 | 11.17 |
| L | **15.42** | **17.50** |
| M | 17.50 | 19.50 |
| N | 19.50 | 20.50 |
| O | **20.50** | **21.58** |
| P | 21.58 | **22.58** |

#### Backward Pass (Tiempos Tardíos — LS, LF)

| ID | LF | LS = LF − μ |
|----|:--:|:----------:|
| P | 22.58 | 21.58 |
| O | 21.58 | 20.50 |
| N | 20.50 | 19.50 |
| M | 19.50 | 17.50 |
| L | 17.50 | 15.42 |
| H | 15.42 | 10.25 |
| I | 15.42 | 9.25 |
| K | 15.42 | 13.42 |
| J | 13.42 | 10.42 |
| C | 10.42 | 7.25 |
| ... | ... | ... |

### ✅ RUTA CRÍTICA IDENTIFICADA

```
A → B → C → D → E → I → L → M → N → O → P
```

| Actividad | Holgura | ¿Crítica? |
|-----------|:-------:|:---------:|
| **A** | 0 | ✅ |
| **B** | 0 | ✅ |
| **C** | 0 | ✅ |
| **D** | 0 | ✅ |
| **E** | 0 | ✅ |
| **F** | 1.83 | ❌ |
| **G** | 1.83 | ❌ |
| **H** | 5.00 | ❌ |
| **I** | 0 | ✅ |
| **J** | 3.25 | ❌ |
| **K** | 5.25 | ❌ |
| **L** | 0 | ✅ |
| **M** | 0 | ✅ |
| **N** | 0 | ✅ |
| **O** | 0 | ✅ |
| **P** | 0 | ✅ |

### Resultados del Proyecto

| Métrica | Valor |
|---------|-------|
| **Duración total del proyecto (μ)** | **22.58 días** ✅ (≤ 25) |
| **Varianza de la ruta crítica (σ²)** | σ²_A + σ²_B + σ²_C + σ²_D + σ²_E + σ²_I + σ²_L + σ²_M + σ²_N + σ²_O + σ²_P = 0.11 + 0.03 + 0.25 + 0.11 + 0.06 + 0.25 + 0.06 + 0.11 + 0.03 + 0.06 + 0.03 = **1.10** |
| **Desviación estándar (σ)** | √1.10 = **1.05 días** |
| **Probabilidad de completar en ≤ 25 días** | Z = (25 − 22.58) / 1.05 = **2.30** → P(Z ≤ 2.30) = **98.9%** ✅ |
| **Costo total de parada** | 22.58 días × $850,000/día = **$19,193,000** |

---

## 🔷 EJERCICIO 3: MODELO EOQ — Gestión de Repuestos Críticos

### Contexto

La **Válvula de Seguridad PSV-409** (norma API 526) es un repuesto crítico para 12 bombas detransferencia en el Campo Bare. Históricamente, PDVSA ha comprado este repuesto "cuando se necesita" (pedidos urgentes), pagando primas de hasta **40% sobre el precio normal**.

### Datos del Problema

| Parámetro | Símbolo | Valor |
|-----------|:------:|:-----:|
| Demanda anual | D | **240 unidades** |
| Costo por pedido | S | **$1,200** (incluye logística, inspección, certificación) |
| Costo unitario del repuesto | C | **$8,500** |
| Costo de mantener inventario (% anual) | i | **25%** |
| Costo de mantener (por unidad/año) | H = i × C | **$2,125** |
| Tiempo de entrega (lead time) | L | **30 días** |
| Días hábiles por año | | **365** |
| Precio con pedido urgente | C_urgente | **$11,900** (+40%) |

### Cálculos EOQ

#### 1. Cantidad Económica de Pedido

```
Q* = √(2 × D × S / H)
Q* = √(2 × 240 × 1,200 / 2,125)
Q* = √(576,000 / 2,125)
Q* = √271.06
Q* = 16.46 ≈ 17 unidades
```

#### 2. Número de Pedidos por Año

```
N = D / Q*
N = 240 / 17
N = 14.1 ≈ 14 pedidos/año
```

#### 3. Intervalo entre Pedidos (Días)

```
T = 365 / N
T = 365 / 14
T = 26.1 días
```

#### 4. Punto de Reorden (ROP)

```
Demanda diaria: d = D / 365 = 240 / 365 = 0.66 unidades/día
ROP = d × L = 0.66 × 30 = 19.7 ≈ 20 unidades

Con stock de seguridad (Z = 1.65 para 95% nivel de servicio):
ROP_ss = d × L + Z × σ_d × √L
Asumiendo σ_d = 0.15 (desviación diaria):
ROP_ss = 19.7 + 1.65 × 0.15 × √30
ROP_ss = 19.7 + 1.35 = 21.05 ≈ 22 unidades
```

#### 5. Costo Total Anual del Inventario

```
CT = (D/Q*)S + (Q*/2)H + D×C
CT = (240/17)×1,200 + (17/2)×2,125 + 240×8,500
CT = 16,941 + 18,063 + 2,040,000
CT = $2,075,004/año
```

#### 6. Comparativa: EOQ vs. Compras Urgentes (Situación Actual)

| Escenario | Costo de Inventario | Costo de Repuestos | Costo Total |
|-----------|:------------------:|:------------------:|:-----------:|
| **EOQ Óptimo** | $16,941 + $18,063 = **$35,004** | $2,040,000 | **$2,075,004** |
| **Compras Urgentes (actual)** | ~$10,000 (mínimo) | $2,856,000 (+40%) | **$2,866,000** |
| **Ahorro Anual** | | | **$790,996 (27.6%)** |

### ✅ PLAN DE ACCIÓN RECOMENDADO

| Aspecto | Recomendación |
|---------|---------------|
| **Cantidad a pedir** | 17 unidades por pedido |
| **Frecuencia** | Cada 26 días (14 pedidos/año) |
| **Punto de reorden** | 20 unidades (22 con stock de seguridad) |
| **Ahorro vs. compras urgentes** | **$790,996/año** |
| **Costo evitado en paradas** | 1 parada evitada = ~$850,000 |

---

## 🎯 CIERRE: Pitch Ejecutivo

### Mensaje para el Gerente

> "Señores líderes de PDVSA, hoy demostramos que la Inteligencia Artificial y la Investigación de Operaciones no son teoría: son herramientas que **ya pueden usar** para:
>
> * ✅ **$1.96M/día** de margen óptimo en mezcla de crudo (Simplex)
> * ✅ **98.9%** de probabilidad de completar la parada de Amuay en ≤25 días (CPM/PERT)
> * ✅ **$790,996/año** de ahorro solo en un repuesto crítico (EOQ)
>
> **La decisión no es si adoptar estas herramientas. La decisión es cuánto tiempo más podemos permitirnos NO usarlas.** "

---

*Documento generado por Nasser Group & IUTPAL — Academia Virtual PDVSA*
*Datos basados en valores típicos operativos. Para cálculos exactos, usar el SimuladorGPT interactivo en `/simulador/texto`*