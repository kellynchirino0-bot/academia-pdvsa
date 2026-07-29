const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.VERCEL ? '/tmp/academia_data.json' : path.join(__dirname, '..', '..', '.academia_data.json');

const storage = {
  usuarios: [],
  roles: [
    { id: 1, nombre_rol: 'administrador', descripcion: 'Acceso total al sistema' },
    { id: 2, nombre_rol: 'tutor', descripcion: 'Gestión de cursos y seguimiento de estudiantes' },
    { id: 3, nombre_rol: 'participante', descripcion: 'Acceso a módulos y simuladores' }
  ],
  evaluaciones: [],
  notas: [],
  certificados: [],
  simulaciones: [],
  leads: [],
  modulos: [],
  lecciones: [],
  progresos: [],
  asignaciones_tutores: [],
  retroalimentacion: [],
  contenido_multimedia: [],
  tareas: [],
  entregas: [],
  auditoria: [],
  pagos: [],
  notifications: [],
  badges: [],
  user_badges: []
};

let nextIds = {};

function getNextId(arr) {
  if (!arr || arr.length === 0) return 1;
  return Math.max(...arr.map(item => item.id || 0)) + 1;
}

function saveToDisk() {
  try {
    const persistible = {
      usuarios: storage.usuarios,
      leads: storage.leads,
      pagos: storage.pagos,
      evaluaciones: storage.evaluaciones,
      notas: storage.notas,
      certificados: storage.certificados,
      progresos: storage.progresos,
      auditoria: storage.auditoria,
      notifications: storage.notifications,
      user_badges: storage.user_badges,
      simulaciones: storage.simulaciones,
      modulos: storage.modulos,
      lecciones: storage.lecciones,
      tareas: storage.tareas,
      entregas: storage.entregas,
      retroalimentacion: storage.retroalimentacion,
      contenido_multimedia: storage.contenido_multimedia,
      asignaciones_tutores: storage.asignaciones_tutores
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(persistible));
  } catch (e) {
    console.error('Persistence save error:', e.message);
  }
}

function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (data && data.usuarios && data.usuarios.length > 0) {
        Object.assign(storage, data);
        return true;
      }
    }
  } catch (e) {
    console.error('Persistence load error:', e.message);
  }
  return false;
}

function persistAfterMutation() {
  if (typeof setImmediate !== 'undefined') setImmediate(saveToDisk);
  else setTimeout(saveToDisk, 0);
}

function logAuditoria(usuario_id, accion, detalles) {
  storage.auditoria.push({
    id: getNextId(storage.auditoria),
    usuario_id, accion, detalles,
    ip: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
}

module.exports = { storage, getNextId, saveToDisk, loadFromDisk, persistAfterMutation, logAuditoria, DATA_FILE };