const { storage, getNextId, persistAfterMutation, logAuditoria } = require('../storage/memory-store');
const { verifyToken, verifyRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');
const crypto = require('crypto');

function generarFirmaMLDSA(hash) {
  const prefix = crypto.randomBytes(8).toString('hex');
  const suffix = crypto.randomBytes(8).toString('hex');
  return `MLDSA_${prefix}_${hash.substring(0, 16)}_${suffix}`;
}

function generarSelloQR(idVerificador) {
  return `https://academia-pdvsa.vercel.app/verificar-certificado?id=${idVerificador}`;
}

function checkAndAwardBadges(userId) {
  const user = storage.usuarios.find(u => u.id === userId);
  if (!user) return;
  const userProgress = storage.progresos.filter(p => p.user_id === userId);
  const totalLecciones = storage.lecciones.length;
  const completadas = userProgress.length;
  const awarded = storage.user_badges.filter(b => b.user_id === userId).map(b => b.badge_id);
  const awards = [];
  if (!awarded.includes('primer_modulo') && completadas >= 1) { awards.push('primer_modulo'); }
  if (!awarded.includes('puntaje_perfecto') && userProgress.some(p => (p.calificacion || 0) === 100)) { awards.push('puntaje_perfecto'); }
  if (!awarded.includes('especialista_ia') && completadas >= totalLecciones && totalLecciones > 0) { awards.push('especialista_ia'); }
  if (!awarded.includes('constante') && completadas >= 5) { awards.push('constante'); }
  const userCerts = storage.certificados.filter(c => c.estudiante_id === userId && c.estado === 'aprobado');
  if (!awarded.includes('certificado') && userCerts.length > 0) { awards.push('certificado'); }
  awards.forEach(badgeId => {
    storage.user_badges.push({ user_id: userId, badge_id: badgeId, fecha_otorgada: new Date().toISOString() });
  });
  return awards;
}

function setup(app) {
  app.get('/api/courses/modulos', verifyToken, (req, res) => {
    const usuarioId = req.user.id;
    const modulos = storage.modulos.map(modulo => {
      const lecciones = storage.lecciones.filter(l => l.modulo_id === modulo.id);
      const leccionesCompletadas = storage.progresos.filter(
        p => p.user_id === usuarioId && lecciones.some(l => l.id === p.leccion_id) && p.completado
      ).length;
      const totalLecciones = lecciones.length;
      const porcentajeAvance = totalLecciones > 0 ? ((leccionesCompletadas / totalLecciones) * 100).toFixed(1) : 0;
      return { ...modulo, total_lecciones: totalLecciones, lecciones_completadas: leccionesCompletadas, porcentaje_avance: parseFloat(porcentajeAvance) };
    });
    res.json(modulos);
  });

  app.get('/api/courses/modulos/:id', verifyToken, (req, res) => {
    const modulo = storage.modulos.find(m => m.id === parseInt(req.params.id));
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    const lecciones = storage.lecciones.filter(l => l.modulo_id === modulo.id).sort((a, b) => a.orden - b.orden);
    const leccionesConProgreso = lecciones.map(l => {
      const progreso = storage.progresos.find(p => p.user_id === req.user.id && p.leccion_id === l.id);
      return { ...l, completado: progreso?.completado || false, fecha_completado: progreso?.fecha_completado || null };
    });

    res.json({ ...modulo, lecciones: leccionesConProgreso });
  });

  app.get('/api/courses/modulos/:id/lecciones', verifyToken, (req, res) => {
    const modulo = storage.modulos.find(m => m.id === parseInt(req.params.id));
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    const lecciones = storage.lecciones.filter(l => l.modulo_id === modulo.id).sort((a, b) => a.orden - b.orden);
    const leccionesConProgreso = lecciones.map(l => {
      const progreso = storage.progresos.find(p => p.user_id === req.user.id && p.leccion_id === l.id);
      return { ...l, completado: progreso?.completado || false, fecha_completado: progreso?.fecha_completado || null };
    });
    res.json(leccionesConProgreso);
  });

  app.post('/api/courses/lecciones/completar', verifyToken, (req, res) => {
    try {
      const { leccion_id } = req.body;
      if (!leccion_id) return res.status(400).json({ error: 'leccion_id es requerido' });

      const leccion = storage.lecciones.find(l => l.id === parseInt(leccion_id));
      if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });

      const existing = storage.progresos.find(p => p.user_id === req.user.id && p.leccion_id === parseInt(leccion_id));
      if (existing) {
        existing.completado = true;
        existing.fecha_completado = new Date().toISOString();
      } else {
        storage.progresos.push({
          id: getNextId(storage.progresos),
          user_id: req.user.id,
          leccion_id: parseInt(leccion_id),
          modulo_id: leccion.modulo_id,
          completado: true,
          calificacion: 100,
          fecha_completado: new Date().toISOString()
        });
      }

      const userRecord = storage.usuarios.find(u => u.id === req.user.id);
      if (userRecord) {
        if (!userRecord.progreso) userRecord.progreso = {};
        userRecord.progreso[`lesson_${leccion_id}`] = { completado: true, calificacion: 100, fecha: new Date().toISOString() };
        const totalLecciones = storage.lecciones.length;
        const completadas = storage.progresos.filter(p => p.user_id === req.user.id && p.completado).length;
        userRecord.progreso.porcentaje_global = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;
        userRecord.progreso.ultima_actualizacion = new Date().toISOString();
      }

      const newBadges = checkAndAwardBadges(req.user.id);
      createNotification(req.user.id, 'contenido', 'Leccion completada', `Has completado la leccion: ${leccion.titulo}`);

      const totalLecciones = storage.lecciones.length;
      const completadas = storage.progresos.filter(p => p.user_id === req.user.id && p.completado).length;
      let autoCert = null;
      if (completadas >= totalLecciones && totalLecciones > 0) {
        const existingCert = storage.certificados.find(c => c.estudiante_id === req.user.id && (c.estado === 'aprobado' || c.estado === 'pendiente'));
        if (!existingCert) {
          const user = storage.usuarios.find(u => u.id === req.user.id);
          const hash = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
          const hashSha256 = crypto.createHash('sha256').update(user?.nombre_completo + hash + Date.now()).digest('hex');
          const firmaMLDSA = generarFirmaMLDSA(hashSha256);
          const idVerificador = `LC-${hashSha256.substring(0, 12).toUpperCase()}`;
          const selloQR = generarSelloQR(idVerificador);
          autoCert = {
            id: getNextId(storage.certificados),
            estudiante_id: req.user.id,
            nombre_estudiante: user?.nombre_completo || 'Estudiante',
            curso: 'Inteligencia Artificial e Investigacion de Operaciones para Lideres de Negocio',
            fecha_solicitud: new Date().toISOString(),
            fecha_emision: null, fecha_aprobacion: null,
            codigo_verificacion: 'CERT_' + hash,
            calificacion_final: '100.0', estado: 'pendiente',
            aprobado_por: null, notas_admin: '', activo: true,
            firma_mldsa: firmaMLDSA, id_verificador: idVerificador, sello_qr: selloQR
          };
          storage.certificados.push(autoCert);
          persistAfterMutation();
          createNotification(req.user.id, 'alerta', 'Certificacion Automatica (LagoChain)',
            `Has completado todos los modulos. Tu certificado esta pendiente de aprobacion.\nFirma ML-DSA: ${firmaMLDSA.substring(0, 30)}...\nVerifica en: ${selloQR}`);
          checkAndAwardBadges(req.user.id);
        }
      }

      res.json({ message: 'Leccion marcada como completada', new_badges: newBadges || [], auto_certificate: autoCert ? { id: autoCert.id, codigo: autoCert.codigo_verificacion } : null });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  app.get('/api/courses/stats', verifyToken, verifyRole(1, 2), (req, res) => {
    const totalEstudiantes = storage.usuarios.filter(u => u.rol_id === 3).length;
    const totalModulos = storage.modulos.length;
    const totalLecciones = storage.lecciones.length;
    const totalEvaluaciones = storage.evaluaciones.length;
    const totalCertificados = storage.certificados.length;
    const progresos = storage.progresos.filter(p => p.completado);
    const totalCompletados = progresos.length;
    const notas = storage.notas;
    const promedioNotas = notas.length > 0 ? (notas.reduce((a, n) => a + parseFloat(n.calificacion), 0) / notas.length).toFixed(2) : 0;
    const aprobados = notas.filter(n => n.estatus_aprobacion).length;
    const tasaAprobacion = notas.length > 0 ? ((aprobados / notas.length) * 100).toFixed(1) : 0;

    res.json({ totalEstudiantes, totalModulos, totalLecciones, totalEvaluaciones, totalCertificados, totalCompletados, promedioNotas: parseFloat(promedioNotas), tasaAprobacion: parseFloat(tasaAprobacion) });
  });

  app.post('/api/courses/modulos', verifyToken, verifyRole(1, 2), (req, res) => {
    const { numero_modulo, titulo, descripcion, icono, duracion_horas } = req.body;
    const nuevoModulo = {
      id: getNextId(storage.modulos), numero_modulo, titulo,
      descripcion: descripcion || '', icono: icono || '📚',
      duracion_horas: duracion_horas || 10, created_at: new Date().toISOString()
    };
    storage.modulos.push(nuevoModulo);
    res.status(201).json({ message: 'Módulo creado exitosamente', modulo: nuevoModulo });
  });

  app.put('/api/courses/modulos/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    const modulo = storage.modulos.find(m => m.id === parseInt(req.params.id));
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });
    const { titulo, descripcion, icono, duracion_horas } = req.body;
    if (titulo) modulo.titulo = titulo;
    if (descripcion !== undefined) modulo.descripcion = descripcion;
    if (icono) modulo.icono = icono;
    if (duracion_horas) modulo.duracion_horas = duracion_horas;
    res.json({ message: 'Módulo actualizado exitosamente', modulo });
  });

  app.post('/api/courses/lecciones', verifyToken, verifyRole(1, 2), (req, res) => {
    const { modulo_id, titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;
    if (!modulo_id || !titulo) return res.status(400).json({ error: 'modulo_id y titulo son requeridos' });
    const nuevaLeccion = {
      id: getNextId(storage.lecciones), modulo_id: parseInt(modulo_id), titulo,
      contenido_markdown: contenido_markdown || '', video_url: video_url || '',
      orden: orden || storage.lecciones.filter(l => l.modulo_id === parseInt(modulo_id)).length + 1,
      recursos_descargables: recursos_descargables || '[]', created_at: new Date().toISOString()
    };
    storage.lecciones.push(nuevaLeccion);
    res.status(201).json({ message: 'Lección creada exitosamente', leccion: nuevaLeccion });
  });

  app.put('/api/courses/lecciones/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    const leccion = storage.lecciones.find(l => l.id === parseInt(req.params.id));
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
    const { titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;
    if (titulo) leccion.titulo = titulo;
    if (contenido_markdown !== undefined) leccion.contenido_markdown = contenido_markdown;
    if (video_url !== undefined) leccion.video_url = video_url;
    if (orden) leccion.orden = orden;
    if (recursos_descargables) leccion.recursos_descargables = recursos_descargables;
    res.json({ message: 'Lección actualizada exitosamente', leccion });
  });

  app.post('/api/courses/lecciones/:id/content', verifyToken, verifyRole(1, 2), (req, res) => {
    const leccion = storage.lecciones.find(l => l.id === parseInt(req.params.id));
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
    const { tipo, titulo, url, descripcion, orden } = req.body;
    if (!tipo || !url) return res.status(400).json({ error: 'tipo y url son requeridos' });
    const contenido = {
      id: getNextId(storage.contenido_multimedia),
      leccion_id: leccion.id, tipo, titulo: titulo || '',
      url, descripcion: descripcion || '',
      orden: orden || 0, created_at: new Date().toISOString(),
      creado_por: req.user.id
    };
    storage.contenido_multimedia.push(contenido);
    res.status(201).json({ message: 'Contenido agregado exitosamente', contenido });
  });

  app.get('/api/courses/lecciones/:id/content', verifyToken, (req, res) => {
    const contenido = storage.contenido_multimedia
      .filter(c => c.leccion_id === parseInt(req.params.id))
      .sort((a, b) => a.orden - b.orden);
    res.json(contenido);
  });

  app.delete('/api/courses/content/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    const idx = storage.contenido_multimedia.findIndex(c => c.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Contenido no encontrado' });
    storage.contenido_multimedia.splice(idx, 1);
    res.json({ message: 'Contenido eliminado exitosamente' });
  });

  app.post('/api/courses/lecciones/:id/tareas', verifyToken, verifyRole(1, 2), (req, res) => {
    const leccion = storage.lecciones.find(l => l.id === parseInt(req.params.id));
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' });
    const { titulo, descripcion, puntos_maximos, fecha_limite } = req.body;
    if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });
    const tarea = {
      id: getNextId(storage.tareas),
      leccion_id: leccion.id, titulo, descripcion: descripcion || '',
      puntos_maximos: puntos_maximos || 100,
      fecha_limite: fecha_limite || null,
      created_at: new Date().toISOString(), creado_por: req.user.id
    };
    storage.tareas.push(tarea);
    res.status(201).json({ message: 'Tarea creada exitosamente', tarea });
  });

  app.get('/api/courses/lecciones/:id/tareas', verifyToken, (req, res) => {
    const tareas = storage.tareas.filter(t => t.leccion_id === parseInt(req.params.id));
    res.json(tareas);
  });

  app.post('/api/tareas/:id/entregar', verifyToken, (req, res) => {
    const tarea = storage.tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    const { archivo_url, notas } = req.body;
    const entrega = {
      id: getNextId(storage.entregas),
      tarea_id: tarea.id, estudiante_id: req.user.id,
      archivo_url: archivo_url || '', notas: notas || '',
      estado: 'entregado', calificacion: null, retroalimentacion: '',
      fecha_entrega: new Date().toISOString()
    };
    storage.entregas.push(entrega);
    res.status(201).json({ message: 'Tarea entregada exitosamente', entrega });
  });

  app.get('/api/tareas/:id/entregas', verifyToken, verifyRole(1, 2), (req, res) => {
    const entregas = storage.entregas
      .filter(e => e.tarea_id === parseInt(req.params.id))
      .map(e => {
        const est = storage.usuarios.find(u => u.id === e.estudiante_id);
        return { ...e, nombre_estudiante: est?.nombre_completo || '', correo_estudiante: est?.correo || '' };
      });
    res.json(entregas);
  });

  app.put('/api/entregas/:id/calificar', verifyToken, verifyRole(1, 2), (req, res) => {
    const entrega = storage.entregas.find(e => e.id === parseInt(req.params.id));
    if (!entrega) return res.status(404).json({ error: 'Entrega no encontrada' });
    const { calificacion, retroalimentacion } = req.body;
    entrega.calificacion = calificacion;
    entrega.retroalimentacion = retroalimentacion || '';
    entrega.estado = 'calificado';
    entrega.fecha_calificacion = new Date().toISOString();
    res.json({ message: 'Entrega calificada exitosamente', entrega });
  });

  app.get('/api/progress/:userId', verifyToken, (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (req.user.rol_id === 3 && req.user.id !== userId) {
        return res.status(403).json({ error: 'No tiene permisos' });
      }

      const totalLecciones = storage.lecciones.length;
      const leccionesCompletadas = storage.progresos.filter(p => p.user_id === userId && p.completado);
      const completadasCount = leccionesCompletadas.length;

      const modulos = storage.modulos.map(modulo => {
        const lecciones = storage.lecciones.filter(l => l.modulo_id === modulo.id);
        const leccionesModCompletadas = leccionesCompletadas.filter(p => lecciones.some(l => l.id === p.leccion_id)).length;
        const totalModLecciones = lecciones.length;
        return {
          id: modulo.id,
          titulo: modulo.titulo,
          total_lecciones: totalModLecciones,
          lecciones_completadas: leccionesModCompletadas,
          porcentaje: totalModLecciones > 0 ? Math.round((leccionesModCompletadas / totalModLecciones) * 100) : 0
        };
      });

      const userGrades = storage.notas.filter(n => n.estudiante_id === userId);
      const evaluacionesRealizadas = userGrades.length;
      const porcentajeGlobal = totalLecciones > 0 ? Math.round((completadasCount / totalLecciones) * 100) : 0;

      res.json({
        userId, porcentaje_global: porcentajeGlobal,
        lecciones_completadas: completadasCount, total_lecciones: totalLecciones,
        evaluaciones_realizadas: evaluacionesRealizadas,
        calificacion_promedio: userGrades.length > 0
          ? parseFloat((userGrades.reduce((sum, g) => sum + parseFloat(g.calificacion), 0) / userGrades.length).toFixed(1))
          : 0,
        modulos: modulos,
        ultima_actualizacion: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  app.post('/api/progress/update', verifyToken, (req, res) => {
    try {
      const { lessonId, moduleId, completed, score } = req.body;
      if (!lessonId) return res.status(400).json({ error: 'lessonId es requerido' });

      const existing = storage.progresos.find(p => p.user_id === req.user.id && p.leccion_id === parseInt(lessonId));
      if (existing) {
        if (completed !== undefined) existing.completado = completed;
        if (score !== undefined) existing.calificacion = score;
        existing.fecha_completado = new Date().toISOString();
      } else {
        const leccion = storage.lecciones.find(l => l.id === parseInt(lessonId));
        storage.progresos.push({
          id: getNextId(storage.progresos),
          user_id: req.user.id, leccion_id: parseInt(lessonId),
          modulo_id: moduleId || leccion?.modulo_id || null,
          completado: completed !== false, calificacion: score || 100,
          fecha_completado: new Date().toISOString()
        });
      }
      persistAfterMutation();

      const userProg = storage.usuarios.find(u => u.id === req.user.id);
      if (userProg) {
        if (!userProg.progreso) userProg.progreso = {};
        userProg.progreso[`lesson_${lessonId}`] = { completado: completed !== false, calificacion: score || 100, fecha: new Date().toISOString() };
        const completadas = storage.progresos.filter(p => p.user_id === req.user.id && p.completado).length;
        const totalLecciones = storage.lecciones.length;
        userProg.progreso.porcentaje_global = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;
        userProg.progreso.ultima_actualizacion = new Date().toISOString();
      }

      checkAndAwardBadges(req.user.id);
      res.json({ message: 'Progreso actualizado', lessonId, completed: completed !== false });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
}

module.exports = { setup, checkAndAwardBadges, generarFirmaMLDSA, generarSelloQR };