const express = require('express');
const router = express.Router();
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Obtener todos los módulos con progreso del usuario actual
router.get('/modulos', verifyToken, (req, res) => {
    const usuarioId = req.user.id;
    const modulos = memoryStorage.modulos.map(modulo => {
        const lecciones = memoryStorage.lecciones.filter(l => l.modulo_id === modulo.id);
        const leccionesCompletadas = memoryStorage.progresos.filter(
            p => p.usuario_id === usuarioId && lecciones.some(l => l.id === p.leccion_id) && p.completado
        ).length;

        const totalLecciones = lecciones.length;
        const porcentajeAvance = totalLecciones > 0 ? ((leccionesCompletadas / totalLecciones) * 100).toFixed(1) : 0;

        return {
            ...modulo,
            total_lecciones: totalLecciones,
            lecciones_completadas: leccionesCompletadas,
            porcentaje_avance: parseFloat(porcentajeAvance)
        };
    });

    res.json(modulos);
});

// Obtener módulo por ID con sus lecciones
router.get('/modulos/:id', verifyToken, (req, res) => {
    const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
    if (!modulo) {
        return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    const lecciones = memoryStorage.lecciones
        .filter(l => l.modulo_id === modulo.id)
        .sort((a, b) => a.orden - b.orden);

    const leccionesConProgreso = lecciones.map(l => {
        const progreso = memoryStorage.progresos.find(
            p => p.usuario_id === req.user.id && p.leccion_id === l.id
        );
        return {
            ...l,
            completado: progreso?.completado || false,
            fecha_completado: progreso?.fecha_completado || null
        };
    });

    res.json({
        ...modulo,
        lecciones: leccionesConProgreso
    });
});

// Obtener lecciones de un módulo
router.get('/modulos/:id/lecciones', verifyToken, (req, res) => {
    const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
    if (!modulo) {
        return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    const lecciones = memoryStorage.lecciones
        .filter(l => l.modulo_id === modulo.id)
        .sort((a, b) => a.orden - b.orden);

    const leccionesConProgreso = lecciones.map(l => {
        const progreso = memoryStorage.progresos.find(
            p => p.usuario_id === req.user.id && p.leccion_id === l.id
        );
        return {
            ...l,
            completado: progreso?.completado || false,
            fecha_completado: progreso?.fecha_completado || null
        };
    });

    res.json(leccionesConProgreso);
});

// Marcar lección como completada
router.post('/lecciones/completar', verifyToken, (req, res) => {
    try {
        const { leccion_id } = req.body;
        const usuarioId = req.user.id;

        if (!leccion_id) {
            return res.status(400).json({ error: 'leccion_id es requerido' });
        }

        const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(leccion_id));
        if (!leccion) {
            return res.status(404).json({ error: 'Lección no encontrada' });
        }

        const progresoExistente = memoryStorage.progresos.find(
            p => p.usuario_id === usuarioId && p.leccion_id === parseInt(leccion_id)
        );

        if (progresoExistente) {
            progresoExistente.completado = true;
            progresoExistente.fecha_completado = new Date().toISOString();
        } else {
            memoryStorage.progresos.push({
                id: memoryStorage.progresos.length + 1,
                usuario_id: usuarioId,
                leccion_id: parseInt(leccion_id),
                completado: true,
                fecha_completado: new Date().toISOString()
            });
        }

        res.json({ message: 'Lección marcada como completada' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener detalle de una lección
router.get('/lecciones/:id', verifyToken, (req, res) => {
    const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(req.params.id));
    if (!leccion) {
        return res.status(404).json({ error: 'Lección no encontrada' });
    }

    const progreso = memoryStorage.progresos.find(
        p => p.usuario_id === req.user.id && p.leccion_id === leccion.id
    );

    const modulo = memoryStorage.modulos.find(m => m.id === leccion.modulo_id);

    res.json({
        ...leccion,
        completado: progreso?.completado || false,
        fecha_completado: progreso?.fecha_completado || null,
        modulo_titulo: modulo?.titulo,
        modulo_numero: modulo?.numero_modulo
    });
});

// CRUD Módulos (Solo Admin/Tutor)
router.post('/modulos', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const { numero_modulo, titulo, descripcion, icono, duracion_horas } = req.body;

        const nuevoModulo = {
            id: memoryStorage.modulos.length + 1,
            numero_modulo,
            titulo,
            descripcion: descripcion || '',
            icono: icono || '📚',
            duracion_horas: duracion_horas || 10,
            created_at: new Date().toISOString()
        };

        memoryStorage.modulos.push(nuevoModulo);
        res.status(201).json({ message: 'Módulo creado exitosamente', modulo: nuevoModulo });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/modulos/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const modulo = memoryStorage.modulos.find(m => m.id === parseInt(req.params.id));
        if (!modulo) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }

        const { titulo, descripcion, icono, duracion_horas } = req.body;
        if (titulo) modulo.titulo = titulo;
        if (descripcion !== undefined) modulo.descripcion = descripcion;
        if (icono) modulo.icono = icono;
        if (duracion_horas) modulo.duracion_horas = duracion_horas;

        res.json({ message: 'Módulo actualizado exitosamente', modulo });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// CRUD Lecciones (Solo Admin/Tutor)
router.post('/lecciones', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const { modulo_id, titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;

        if (!modulo_id || !titulo) {
            return res.status(400).json({ error: 'modulo_id y titulo son requeridos' });
        }

        const modulo = memoryStorage.modulos.find(m => m.id === parseInt(modulo_id));
        if (!modulo) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }

        const leccionesExistentes = memoryStorage.lecciones.filter(l => l.modulo_id === parseInt(modulo_id));
        const nuevaLeccion = {
            id: memoryStorage.lecciones.length + 1,
            modulo_id: parseInt(modulo_id),
            titulo,
            contenido_markdown: contenido_markdown || '',
            video_url: video_url || '',
            orden: orden || leccionesExistentes.length + 1,
            recursos_descargables: recursos_descargables || '[]',
            created_at: new Date().toISOString()
        };

        memoryStorage.lecciones.push(nuevaLeccion);
        res.status(201).json({ message: 'Lección creada exitosamente', leccion: nuevaLeccion });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/lecciones/:id', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const leccion = memoryStorage.lecciones.find(l => l.id === parseInt(req.params.id));
        if (!leccion) {
            return res.status(404).json({ error: 'Lección no encontrada' });
        }

        const { titulo, contenido_markdown, video_url, orden, recursos_descargables } = req.body;
        if (titulo) leccion.titulo = titulo;
        if (contenido_markdown !== undefined) leccion.contenido_markdown = contenido_markdown;
        if (video_url !== undefined) leccion.video_url = video_url;
        if (orden) leccion.orden = orden;
        if (recursos_descargables) leccion.recursos_descargables = recursos_descargables;

        res.json({ message: 'Lección actualizada exitosamente', leccion });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Estadísticas del curso (Admin)
router.get('/stats', verifyToken, verifyRole(1, 2), (req, res) => {
    const totalEstudiantes = memoryStorage.usuarios.filter(u => u.rol_id === 3).length;
    const totalModulos = memoryStorage.modulos.length;
    const totalLecciones = memoryStorage.lecciones.length;
    const totalEvaluaciones = memoryStorage.evaluaciones.length;
    const totalCertificados = memoryStorage.certificados.length;

    const progresos = memoryStorage.progresos.filter(p => p.completado);
    const totalCompletados = progresos.length;

    const notas = memoryStorage.notas;
    const promedioNotas = notas.length > 0
        ? (notas.reduce((acc, n) => acc + parseFloat(n.calificacion), 0) / notas.length).toFixed(2)
        : 0;

    const aprobados = notas.filter(n => n.estatus_aprobacion).length;
    const tasaAprobacion = notas.length > 0 ? ((aprobados / notas.length) * 100).toFixed(1) : 0;

    res.json({
        totalEstudiantes,
        totalModulos,
        totalLecciones,
        totalEvaluaciones,
        totalCertificados,
        totalCompletados,
        promedioNotas: parseFloat(promedioNotas),
        tasaAprobacion: parseFloat(tasaAprobacion)
    });
});

module.exports = router;
