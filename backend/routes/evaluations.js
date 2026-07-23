const express = require('express');
const router = express.Router();
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Obtener todas las evaluaciones
router.get('/', verifyToken, (req, res) => {
    const evaluaciones = memoryStorage.evaluaciones.map(e => ({
        ...e,
        total_preguntas: e.preguntas ? e.preguntas.length : 0
    }));
    res.json(evaluaciones);
});

// Obtener evaluación por ID
router.get('/:id', verifyToken, (req, res) => {
    const evaluacion = memoryStorage.evaluaciones.find(e => e.id === parseInt(req.params.id));
    if (!evaluacion) {
        return res.status(404).json({ error: 'Evaluación no encontrada' });
    }
    res.json(evaluacion);
});

// Enviar respuestas de evaluación
router.post('/:id/submit', verifyToken, (req, res) => {
    try {
        const evaluacion = memoryStorage.evaluaciones.find(e => e.id === parseInt(req.params.id));
        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        const { respuestas, tiempo_empleado } = req.body;
        const usuarioId = req.user.id;

        // Calcular calificación
        let correctas = 0;
        const totalPreguntas = evaluacion.preguntas.length;

        if (respuestas && Array.isArray(respuestas)) {
            respuestas.forEach((respuesta, index) => {
                if (evaluacion.preguntas[index] && 
                    respuesta.respuesta === evaluacion.preguntas[index].respuesta_correcta) {
                    correctas++;
                }
            });
        }

        const calificacion = (correctas / totalPreguntas) * 100;
        const estatus_aprobacion = calificacion >= 80;

        const registroNota = {
            id: memoryStorage.notas.length + 1,
            usuario_id: usuarioId,
            evaluacion_id: evaluacion.id,
            calificacion: calificacion.toFixed(2),
            estatus_aprobacion,
            respuestas: respuestas,
            tiempo_empleado_minutos: tiempo_empleado || 0,
            fecha_evaluacion: new Date().toISOString()
        };

        memoryStorage.notas.push(registroNota);

        res.json({
            message: estatus_aprobacion ? '¡Felicitaciones! Ha aprobado la evaluación' : 'Evaluación completada',
            calificacion: calificacion.toFixed(2),
            estatus_aprobacion,
            total_preguntas: totalPreguntas,
            respuestas_correctas: correctas,
            tiempo_empleado: tiempo_empleado || 0
        });
    } catch (error) {
        console.error('Error al enviar evaluación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear evaluación (Admin e Instructor)
router.post('/', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const { titulo, descripcion, modulo, ponderacion, preguntas, tiempo_limite_minutos, fecha_limite } = req.body;

        const nuevaEvaluacion = {
            id: memoryStorage.evaluaciones.length + 1,
            titulo,
            descripcion: descripcion || '',
            modulo: modulo || 'General',
            ponderacion: ponderacion || 100,
            preguntas: preguntas || [],
            tiempo_limite_minutos: tiempo_limite_minutos || 60,
            fecha_limite: fecha_limite || null,
            activo: true,
            creado_en: new Date().toISOString()
        };

        memoryStorage.evaluaciones.push(nuevaEvaluacion);

        res.status(201).json({
            message: 'Evaluación creada exitosamente',
            evaluacion: nuevaEvaluacion
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener notas de un usuario
router.get('/user/:userId/grades', verifyToken, (req, res) => {
    const usuarioId = parseInt(req.params.userId);
    const notas = memoryStorage.notas
        .filter(n => n.usuario_id === usuarioId)
        .map(n => {
            const evaluacion = memoryStorage.evaluaciones.find(e => e.id === n.evaluacion_id);
            return {
                ...n,
                evaluacion_titulo: evaluacion?.titulo || 'Evaluación desconocida',
                evaluacion_modulo: evaluacion?.modulo || 'General'
            };
        });
    res.json(notas);
});

module.exports = router;
