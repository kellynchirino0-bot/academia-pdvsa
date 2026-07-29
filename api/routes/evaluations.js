const { storage, getNextId } = require('../storage/memory-store');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { checkAndAwardBadges } = require('./courses');

function setup(app) {
  app.get('/api/evaluations', verifyToken, (req, res) => {
    let data = storage.evaluaciones;
    if (req.user.rol_id !== 1 && req.user.rol_id !== 2) {
      data = data.map(e => ({
        ...e,
        preguntas: e.preguntas?.map(p => {
          const { respuesta_correcta, ...rest } = p;
          return rest;
        })
      }));
    }
    res.json(data);
  });

  app.get('/api/evaluations/:id', verifyToken, (req, res) => {
    const ev = storage.evaluaciones.find(e => e.id === parseInt(req.params.id));
    if (!ev) return res.status(404).json({ error: 'Evaluación no encontrada' });
    if (req.user.rol_id !== 1 && req.user.rol_id !== 2) {
      const { respuesta_correcta, ...filtered } = ev;
      return res.json(filtered);
    }
    res.json(ev);
  });

  app.post('/api/evaluations/:id/submit', verifyToken, (req, res) => {
    try {
      const ev = storage.evaluaciones.find(e => e.id === parseInt(req.params.id));
      if (!ev) return res.status(404).json({ error: 'Evaluación no encontrada' });

      const { respuestas } = req.body;
      let correctas = 0;
      const resultados = ev.preguntas.map((preg, idx) => {
        const esCorrecta = respuestas[idx] === preg.respuesta_correcta;
        if (esCorrecta) correctas++;
        return { pregunta_id: preg.id, respuesta_usuario: respuestas[idx], es_correcta: esCorrecta, retroalimentacion: preg.retroalimentacion };
      });

      const calificacion = ((correctas / ev.preguntas.length) * 100).toFixed(1);
      const estatus_aprobacion = parseFloat(calificacion) >= 70;

      storage.notas.push({
        id: getNextId(storage.notas),
        estudiante_id: req.user.id, evaluacion_id: ev.id,
        calificacion, estatus_aprobacion,
        fecha_evaluacion: new Date().toISOString()
      });

      const evalUser = storage.usuarios.find(u => u.id === req.user.id);
      if (evalUser) {
        if (!evalUser.progreso) evalUser.progreso = {};
        evalUser.progreso[`eval_${ev.id}`] = { calificacion: parseFloat(calificacion), aprobado: estatus_aprobacion, fecha: new Date().toISOString() };
        evalUser.progreso.ultima_actualizacion = new Date().toISOString();
      }

      checkAndAwardBadges(req.user.id);

      res.json({ calificacion: parseFloat(calificacion), aprobado: estatus_aprobacion, correctas, total: ev.preguntas.length, resultados });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  app.get('/api/notas', verifyToken, (req, res) => {
    const user = req.user;
    if (user.rol_id === 3) {
      res.json(storage.notas.filter(n => n.estudiante_id === user.id));
    } else {
      res.json(storage.notas);
    }
  });

  app.get('/api/evaluations/user/:userId/grades', verifyToken, (req, res) => {
    const userId = parseInt(req.params.userId);
    if (req.user.rol_id === 3 && req.user.id !== userId) {
      return res.status(403).json({ error: 'No tiene permisos' });
    }
    res.json(storage.notas.filter(n => n.estudiante_id === userId));
  });
}

module.exports = { setup };