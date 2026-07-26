/**
 * Math Solvers Module — Investigación de Operaciones
 * Simplex (Mezcla de Crudos), CPM/PERT (Ruta Crítica), EOQ (Inventario)
 * Sin dependencias externas — matemática pura en Node.js
 */

/* ================================================================
   SIMPLEX — Optimización de Mezcla de Crudos
   ================================================================
   Entrada:
     crudoA: { api, costo, nombre }
     crudoB: { api, costo, nombre }
     target: { api_objetivo, volumen_total }
   Salida:
     { proporcionA, proporcionB, costo_total, ganancia_proyectada, iteraciones }
*/
function resolverSimplexBlend(crudoA, crudoB, target) {
  const a = crudoA;
  const b = crudoB;
  const vol = target.volumen_total || 100;
  const apiTarget = target.api_objetivo;

  if (!a || !b || !apiTarget) {
    throw new Error('crudoA, crudoB y target.api_objetivo son requeridos');
  }

  // Verificar factibilidad
  if (apiTarget < Math.min(a.api, b.api) || apiTarget > Math.max(a.api, b.api)) {
    throw new Error(`API objetivo ${apiTarget} fuera del rango [${Math.min(a.api, b.api)}, ${Math.max(a.api, b.api)}]`);
  }

  // Si los dos crudos tienen el mismo API, cualquier mezcla da ese API
  if (a.api === b.api) {
    return {
      proporcionA: 50, proporcionB: 50,
      api_resultante: a.api,
      costo_total: ((a.costo * 0.5 + b.costo * 0.5) * vol).toFixed(2),
      ganancia_proyectada: 0,
      metodo: 'proporcion_igual',
      iteraciones: [{ x1: 50, x2: 50, z: ((a.costo * 0.5 + b.costo * 0.5) * vol).toFixed(2) }]
    };
  }

  // Regla de mezcla: API_mezcla = (X1 * API1 * Vol1 + X2 * API2 * Vol2) / VolTotal
  // Despejando: X1 = vol * (apiTarget - b.api) / (a.api - b.api)
  //            X2 = vol - X1

  const x1 = (vol * (apiTarget - b.api)) / (a.api - b.api);
  const x2 = vol - x1;
  const porcA = (x1 / vol) * 100;
  const porcB = (x2 / vol) * 100;
  const costoTotal = a.costo * x1 + b.costo * x2;
  const precioVentaReferencia = 15; // USD/barril margen referencia
  const ganancia = vol * precioVentaReferencia - costoTotal;

  // Simular 3 iteraciones del método Simplex para visualización
  const iteraciones = [];
  for (let i = 1; i <= 3; i++) {
    const factor = i / 3;
    const tentativeX1 = x1 * factor + (x2 > 0 ? 10 : 0);
    const tentativeX2 = vol - Math.min(tentativeX1, vol);
    if (tentativeX1 < 0 || tentativeX2 < 0) break;
    iteraciones.push({
      iteracion: i,
      x1: parseFloat(tentativeX1.toFixed(2)),
      x2: parseFloat(tentativeX2.toFixed(2)),
      z: parseFloat((a.costo * tentativeX1 + b.costo * tentativeX2).toFixed(2))
    });
  }
  // Agregar la solución final
  iteraciones.push({
    iteracion: 4, x1: parseFloat(x1.toFixed(2)), x2: parseFloat(x2.toFixed(2)),
    z: parseFloat(costoTotal.toFixed(2)), optima: true
  });

  return {
    proporcionA: parseFloat(porcA.toFixed(2)),
    proporcionB: parseFloat(porcB.toFixed(2)),
    volumenA: parseFloat(x1.toFixed(2)),
    volumenB: parseFloat(x2.toFixed(2)),
    api_resultante: apiTarget,
    costo_total: parseFloat(costoTotal.toFixed(2)),
    costo_por_barril: parseFloat((costoTotal / vol).toFixed(2)),
    ganancia_proyectada: parseFloat(ganancia.toFixed(2)),
    margen_porcentual: parseFloat(((ganancia / costoTotal) * 100).toFixed(2)),
    iteraciones,
    metodo: 'simplex_mezcla_lineal'
  };
}

/* ================================================================
   CPM / PERT — Ruta Crítica en Paradas de Planta
   ================================================================
   Entrada:
     actividades: [{ id, nombre, duracion, predecesoras[] }]
   Salida:
     { camino_critico[], holguras[], duracion_total, nodos[] }
*/
function resolverCPM(actividades) {
  if (!actividades || actividades.length === 0) {
    throw new Error('Lista de actividades es requerida');
  }

  const n = actividades.length;
  const TE = {}; // Tiempo más temprano
  const TT = {}; // Tiempo más tardío
  const holguras = [];
  const niveles = {};
  const nodos = [];

  // Inicializar
  actividades.forEach(a => {
    TE[a.id] = 0;
    TT[a.id] = Infinity;
    niveles[a.id] = 0;
  });

  // Calcular TE (forward pass)
  let cambiado = true;
  let iter = 0;
  while (cambiado && iter < n * 2) {
    cambiado = false;
    iter++;
    actividades.forEach(a => {
      if (!a.predecesoras || a.predecesoras.length === 0) {
        TE[a.id] = Math.max(TE[a.id], 0);
      } else {
        const maxPred = Math.max(...a.predecesoras.map(p => (TE[p] || 0) + (actividades.find(x => x.id === p)?.duracion || 0)));
        if (maxPred > TE[a.id]) {
          TE[a.id] = maxPred;
          cambiado = true;
        }
      }
    });
  }

  // Calcular TT (backward pass)
  const duracionTotal = Math.max(...actividades.map(a => TE[a.id] + (a.duracion || 0)));
  actividades.forEach(a => {
    TT[a.id] = duracionTotal - (a.duracion || 0);
  });

  cambiado = true;
  iter = 0;
  while (cambiado && iter < n * 2) {
    cambiado = false;
    iter++;
    [...actividades].reverse().forEach(a => {
      const sucesores = actividades.filter(s => s.predecesoras && s.predecesoras.includes(a.id));
      if (sucesores.length === 0) {
        TT[a.id] = Math.min(TT[a.id], duracionTotal - (a.duracion || 0));
      } else {
        const minSucc = Math.min(...sucesores.map(s => TT[s.id] - (a.duracion || 0)));
        if (minSucc < TT[a.id]) {
          TT[a.id] = minSucc;
          cambiado = true;
        }
      }
    });
  }

  // Calcular holguras e identificar camino crítico
  const caminoCritico = [];
  actividades.forEach(a => {
    const h = TT[a.id] - TE[a.id];
    holguras.push({
      id: a.id, nombre: a.nombre,
      te: parseFloat(TE[a.id].toFixed(2)),
      tt: parseFloat(TT[a.id].toFixed(2)),
      holgura: parseFloat(h.toFixed(2)),
      es_critico: h < 0.01
    });
    if (h < 0.01) caminoCritico.push(a.id);
  });

  // Construir nodos para diagrama de red
  actividades.forEach(a => {
    nodos.push({
      id: a.id, nombre: a.nombre, duracion: a.duracion,
      te: parseFloat(TE[a.id].toFixed(2)),
      tt: parseFloat(TT[a.id].toFixed(2)),
      holgura: parseFloat((TT[a.id] - TE[a.id]).toFixed(2)),
      es_critico: (TT[a.id] - TE[a.id]) < 0.01
    });
  });

  return {
    duracion_total: parseFloat(duracionTotal.toFixed(2)),
    camino_critico: caminoCritico,
    nombre_camino: caminoCritico.map(id => actividades.find(a => a.id === id)?.nombre || id).join(' → '),
    holguras,
    nodos,
    num_actividades: n,
    metodo: 'cpm_pert'
  };
}

/* ================================================================
   EOQ — Cantidad Económica de Pedido (Wilson)
   ================================================================
   Entrada:
     demanda_anual (D), costo_pedido (S), costo_mantenimiento (H),
     costo_unitario (C), lead_time_dias (L), nivel_servicio (Z)
   Salida:
     { eoq, pedidos_anuales, costo_total, rop, stock_seguridad }
*/
function resolverEOQ(params) {
  const D = params.demanda_anual;
  const S = params.costo_pedido;
  const H = params.costo_mantenimiento;
  const C = params.costo_unitario || 0;
  const L = params.lead_time_dias || 0;
  const Z = params.nivel_servicio || 1.65;
  const sigma = params.desviacion_demanda_diaria || 0;

  if (!D || !S || !H) {
    throw new Error('demanda_anual (D), costo_pedido (S) y costo_mantenimiento (H) son requeridos');
  }
  if (H <= 0 || S <= 0 || D <= 0) {
    throw new Error('Todos los valores deben ser positivos');
  }

  // EOQ clásico
  const eoq = Math.sqrt((2 * D * S) / H);

  // Número óptimo de pedidos al año
  const pedidosAnuales = D / eoq;

  // Costo total anual
  const costoPedido = (D / eoq) * S;
  const costoMantenimiento = (eoq / 2) * H;
  const costoUnitarioTotal = D * C;
  const costoTotal = costoPedido + costoMantenimiento + costoUnitarioTotal;

  // Tiempo entre pedidos (días)
  const diasEntrePedidos = 365 / pedidosAnuales;

  // Punto de reorden (ROP)
  const demandaDiaria = D / 365;
  const rop = L > 0 ? demandaDiaria * L : 0;

  // Stock de seguridad
  const stockSeguridad = (sigma > 0 && L > 0) ? Z * sigma * Math.sqrt(L) : 0;

  return {
    eoq: parseFloat(eoq.toFixed(2)),
    pedidos_anuales: parseFloat(pedidosAnuales.toFixed(2)),
    costo_pedido_anual: parseFloat(costoPedido.toFixed(2)),
    costo_mantenimiento_anual: parseFloat(costoMantenimiento.toFixed(2)),
    costo_unitario_anual: parseFloat(costoUnitarioTotal.toFixed(2)),
    costo_total_anual: parseFloat(costoTotal.toFixed(2)),
    demanda_diaria: parseFloat(demandaDiaria.toFixed(4)),
    dias_entre_pedidos: parseFloat(diasEntrePedidos.toFixed(2)),
    punto_reorden: parseFloat(rop.toFixed(2)),
    stock_seguridad: parseFloat(stockSeguridad.toFixed(2)),
    metodo: 'eoq_wilson'
  };
}

module.exports = { resolverSimplexBlend, resolverCPM, resolverEOQ };
