const express = require('express');
const router = express.Router();
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Obtener estudiantes asignados al tutor actual
router.get('/estudiantes', verifyToken, verifyRole(1, 2), (req, res) => {
    const tutorId = req.user.id;

    let asignaciones;
    if (req.user.rol_id === 1) {
        // Admin ve todas las asignaciones activas
        asignaciones = memoryStorage.asignaciones_tutores.filter(a => a.activa);
    } else {
        // Tutor solo ve sus asignaciones
        asignaciones = memoryStorage.asignaciones_tutores.filter(a => a.tutor_id === tutorId && a.activa);
    }

    const estudiantes = asignaciones.map(asignacion => {
        const estudiante = memoryStorage.usuarios.find(u => u.id === asignacion.estudiante_id);
        if (!estudiante) return null;

        const rol = memoryStorage.roles.find(r => r.id === estudiante.rol_id);

        // Calcular progreso
        const progresos = memoryStorage.progresos.filter(
            p => p.usuario_id === estudiante.id && p.completado
        ).length;
        const totalLecciones = memoryStorage.lecciones.length;
        const porcentajeProgreso = totalLecciones > 0 ? ((progresos / totalLecciones) * 100).toFixed(1) : 0;

        // Calcular promedio de notas
        const notas = memoryStorage.notas.filter(n => n.usuario_id === estudiante.id);
        const promedioNotas = notas.length > 0
            ? (notas.reduce((acc, n) => acc + parseFloat(n.calificacion), 0) / notas.length).toFixed(2)
            : 0;

        // Evaluar estado del semáforo
        let estadoProgreso = 'verde';
        if (parseFloat(porcentajeProgreso) < 30) {
            estadoProgreso = 'rojo';
        } else if (parseFloat(porcentajeProgreso) < 70) {
            estadoProgreso = 'amarillo';
        }

        // Verificar si tiene certificado
        const tieneCertificado = memoryStorage.certificados.some(c => c.usuario_id === estudiante.id);

        // Obtener última retroalimentación
        const ultimaRetro = memoryStorage.retroalimentacion
            .filter(r => r.estudiante_id === estudiante.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        return {
            id: estudiante.id,
            cedula: estudiante.cedula,
            nombre_completo: estudiante.nombre_completo,
            correo: estudiante.correo,
            cargo: estudiante.cargo,
            empresa_filial: estudiante.empresa_filial,
            rol: rol?.nombre_rol,
            activo: estudiante.activo,
            ultimo_acceso: estudiante.ultimo_acceso,
            fecha_asignacion: asignacion.fecha_asignacion,
            progreso: {
                lecciones_completadas: progresos,
                total_lecciones: totalLecciones,
                porcentaje: parseFloat(porcentajeProgreso),
                estado: estadoProgreso
            },
            notas: {
                total_evaluaciones: notas.length,
                promedio: parseFloat(promedioNotas),
                aprobadas: notas.filter(n => n.estatus_aprobacion).length
            },
            tiene_certificado: tieneCertificado,
            ultima_retroalimentacion: ultimaRetro ? ultimaRetro.comentario : null
        };
    }).filter(Boolean);

    res.json(estudiantes);
});

// Enviar retroalimentación a un estudiante
router.post('/retroalimentacion', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const { estudiante_id, evaluacion_id, comentario, tipo } = req.body;
        const tutorId = req.user.id;

        if (!estudiante_id || !comentario) {
            return res.status(400).json({ error: 'estudiante_id y comentario son requeridos' });
        }

        const estudiante = memoryStorage.usuarios.find(u => u.id === parseInt(estudiante_id));
        if (!estudiante) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        const nuevaRetro = {
            id: memoryStorage.retroalimentacion.length + 1,
            tutor_id: tutorId,
            estudiante_id: parseInt(estudiante_id),
            evaluacion_id: evaluacion_id ? parseInt(evaluacion_id) : null,
            comentario,
            tipo: tipo || 'general',
            created_at: new Date().toISOString()
        };

        memoryStorage.retroalimentacion.push(nuevaRetro);

        res.status(201).json({
            message: 'Retroalimentación enviada exitosamente',
            retroalimentacion: nuevaRetro
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener retroalimentación de un estudiante
router.get('/retroalimentacion/:estudianteId', verifyToken, verifyRole(1, 2), (req, res) => {
    const estudianteId = parseInt(req.params.estudianteId);
    const retroalimentacion = memoryStorage.retroalimentacion
        .filter(r => r.estudiante_id === estudianteId)
        .map(r => {
            const tutor = memoryStorage.usuarios.find(u => u.id === r.tutor_id);
            return {
                ...r,
                tutor_nombre: tutor?.nombre_completo || 'Tutor'
            };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(retroalimentacion);
});

// Asignar tutor a estudiante (Solo Admin)
router.post('/asignar', verifyToken, verifyRole(1), (req, res) => {
    try {
        const { tutor_id, estudiante_id } = req.body;

        const tutor = memoryStorage.usuarios.find(u => u.id === parseInt(tutor_id));
        if (!tutor || tutor.rol_id !== 2) {
            return res.status(404).json({ error: 'Tutor no encontrado' });
        }

        const estudiante = memoryStorage.usuarios.find(u => u.id === parseInt(estudiante_id));
        if (!estudiante || estudiante.rol_id !== 3) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        const existeAsignacion = memoryStorage.asignaciones_tutores.find(
            a => a.tutor_id === parseInt(tutor_id) && a.estudiante_id === parseInt(estudiante_id) && a.activa
        );

        if (existeAsignacion) {
            return res.status(400).json({ error: 'Esta asignación ya existe' });
        }

        // Desactivar asignaciones anteriores del estudiante
        memoryStorage.asignaciones_tutores.forEach(a => {
            if (a.estudiante_id === parseInt(estudiante_id)) {
                a.activa = false;
            }
        });

        const nuevaAsignacion = {
            id: memoryStorage.asignaciones_tutores.length + 1,
            tutor_id: parseInt(tutor_id),
            estudiante_id: parseInt(estudiante_id),
            fecha_asignacion: new Date().toISOString(),
            activa: true
        };

        memoryStorage.asignaciones_tutores.push(nuevaAsignacion);

        res.status(201).json({
            message: 'Tutor asignado exitosamente al estudiante',
            asignacion: nuevaAsignacion
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Asignación masiva de tutores (Solo Admin)
router.post('/asignar-masiva', verifyToken, verifyRole(1), (req, res) => {
    try {
        const { tutor_id, estudiante_ids } = req.body;

        if (!tutor_id || !estudiante_ids || !Array.isArray(estudiante_ids)) {
            return res.status(400).json({ error: 'tutor_id y estudiante_ids (array) son requeridos' });
        }

        const tutor = memoryStorage.usuarios.find(u => u.id === parseInt(tutor_id));
        if (!tutor || tutor.rol_id !== 2) {
            return res.status(404).json({ error: 'Tutor no encontrado' });
        }

        let asignados = 0;
        estudiante_ids.forEach(eid => {
            const estudiante = memoryStorage.usuarios.find(u => u.id === parseInt(eid));
            if (estudiante && estudiante.rol_id === 3) {
                // Desactivar asignaciones anteriores
                memoryStorage.asignaciones_tutores.forEach(a => {
                    if (a.estudiante_id === parseInt(eid)) a.activa = false;
                });

                memoryStorage.asignaciones_tutores.push({
                    id: memoryStorage.asignaciones_tutores.length + 1,
                    tutor_id: parseInt(tutor_id),
                    estudiante_id: parseInt(eid),
                    fecha_asignacion: new Date().toISOString(),
                    activa: true
                });
                asignados++;
            }
        });

        res.json({
            message: `${asignados} estudiantes asignados exitosamente`,
            asignados
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener todos los tutores disponibles
router.get('/lista', verifyToken, verifyRole(1), (req, res) => {
    const tutores = memoryStorage.usuarios
        .filter(u => u.rol_id === 2)
        .map(u => ({
            id: u.id,
            nombre_completo: u.nombre_completo,
            correo: u.correo,
            cargo: u.cargo,
            activo: u.activo
        }));

    res.json(tutores);
});

// Validar solicitud de certificado (Solo Tutor/Admin)
router.post('/validar-certificado', verifyToken, verifyRole(1, 2), (req, res) => {
    try {
        const { estudiante_id, aprobar } = req.body;
        const tutorId = req.user.id;

        const estudiante = memoryStorage.usuarios.find(u => u.id === parseInt(estudiante_id));
        if (!estudiante) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        // Verificar si el tutor tiene al estudiante asignado
        if (req.user.rol_id === 2) {
            const asignacion = memoryStorage.asignaciones_tutores.find(
                a => a.tutor_id === tutorId && a.estudiante_id === parseInt(estudiante_id) && a.activa
            );
            if (!asignacion) {
                return res.status(403).json({ error: 'No tiene permisos para validar a este estudiante' });
            }
        }

        if (aprobar) {
            // Verificar que el estudiante tenga todas las evaluaciones aprobadas
            const evaluaciones = memoryStorage.evaluaciones;
            const notas = memoryStorage.notas.filter(n => n.usuario_id === parseInt(estudiante_id));
            const todasAprobadas = evaluaciones.every(ev =>
                notas.some(n => n.evaluacion_id === ev.id && n.estatus_aprobacion)
            );

            if (!todasAprobadas) {
                return res.status(400).json({ error: 'El estudiante no tiene todas las evaluaciones aprobadas' });
            }

            // Verificar si ya tiene certificado
            const existeCert = memoryStorage.certificados.find(c => c.usuario_id === parseInt(estudiante_id));
            if (existeCert) {
                return res.status(400).json({ error: 'El estudiante ya tiene un certificado emitido' });
            }

            // Calcular promedio
            const promedio = notas.length > 0
                ? (notas.reduce((acc, n) => acc + parseFloat(n.calificacion), 0) / notas.length).toFixed(2)
                : 0;

            const QRCode = require('qrcode');
            const { v4: uuidv4 } = require('uuid');

            const codigoVerificacion = `NG-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`;

            const nuevoCertificado = {
                id: memoryStorage.certificados.length + 1,
                usuario_id: parseInt(estudiante_id),
                codigo_verificacion: codigoVerificacion,
                fecha_emision: new Date().toISOString(),
                calificacion_final: parseFloat(promedio),
                estatus: 'emitido',
                qr_code: null
            };

            memoryStorage.certificados.push(nuevoCertificado);

            res.json({
                message: 'Certificado validado y emitido exitosamente',
                certificado: nuevoCertificado
            });
        } else {
            // Rechazar solicitud
            memoryStorage.retroalimentacion.push({
                id: memoryStorage.retroalimentacion.length + 1,
                tutor_id: tutorId,
                estudiante_id: parseInt(estudiante_id),
                evaluacion_id: null,
                comentario: 'Solicitud de certificado rechazada por el tutor',
                tipo: 'rechazo_certificado',
                created_at: new Date().toISOString()
            });

            res.json({ message: 'Solicitud de certificado rechazada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
