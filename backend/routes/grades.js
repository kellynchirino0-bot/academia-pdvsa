import { Router } from 'express';
import { query } from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/my-grades', verifyToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT rn.id, rn.calificacion, rn.estatus_aprobacion, rn.fecha_evaluacion,
              ec.titulo AS evaluacion_titulo, ec.id AS evaluacion_id,
              ec.ponderacion
       FROM registros_notas rn
       JOIN evaluaciones_cuestionarios ec ON rn.evaluacion_id = ec.id
       WHERE rn.usuario_id = $1
       ORDER BY rn.fecha_evaluacion DESC`,
      [req.user.id]
    );

    const statsResult = await query(
      `SELECT
         COUNT(*) AS total_evaluaciones,
         COUNT(*) FILTER (WHERE rn.estatus_aprobacion = TRUE) AS aprobadas,
         COALESCE(AVG(rn.calificacion), 0) AS promedio_general
       FROM registros_notas rn
       WHERE rn.usuario_id = $1`,
      [req.user.id]
    );

    res.json({
      evaluaciones: result.rows,
      estadisticas: statsResult.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.get('/:userId', verifyToken, requireRole('Admin', 'Instructor'), async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await query(
      'SELECT id, cedula, nombre_completo, cargo, correo FROM usuarios_academia WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const gradesResult = await query(
      `SELECT rn.id, rn.calificacion, rn.estatus_aprobacion, rn.fecha_evaluacion,
              ec.titulo AS evaluacion_titulo, ec.id AS evaluacion_id,
              ec.ponderacion
       FROM registros_notas rn
       JOIN evaluaciones_cuestionarios ec ON rn.evaluacion_id = ec.id
       WHERE rn.usuario_id = $1
       ORDER BY rn.fecha_evaluacion DESC`,
      [userId]
    );

    res.json({
      usuario: userResult.rows[0],
      evaluaciones: gradesResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener calificaciones del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.get('/report/:evaluationId', verifyToken, requireRole('Admin', 'Instructor'), async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evalResult = await query(
      'SELECT * FROM evaluaciones_cuestionarios WHERE id = $1',
      [evaluationId]
    );

    if (evalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada.' });
    }

    const distributionResult = await query(
      `SELECT
         COUNT(*) AS total_participantes,
         COALESCE(AVG(rn.calificacion), 0) AS promedio,
         COALESCE(MIN(rn.calificacion), 0) AS minima,
         COALESCE(MAX(rn.calificacion), 0) AS maxima,
         COUNT(*) FILTER (WHERE rn.estatus_aprobacion = TRUE) AS aprobados,
         COUNT(*) FILTER (WHERE rn.estatus_aprobacion = FALSE) AS reprobados,
         COUNT(*) FILTER (WHERE rn.calificacion >= 90) AS excelente,
         COUNT(*) FILTER (WHERE rn.calificacion >= 80 AND rn.calificacion < 90) AS bueno,
         COUNT(*) FILTER (WHERE rn.calificacion >= 70 AND rn.calificacion < 80) AS regular,
         COUNT(*) FILTER (WHERE rn.calificacion < 70) AS deficiente
       FROM registros_notas rn
       WHERE rn.evaluacion_id = $1`,
      [evaluationId]
    );

    const participantsResult = await query(
      `SELECT u.id, u.cedula, u.nombre_completo, u.cargo,
              rn.calificacion, rn.estatus_aprobacion, rn.fecha_evaluacion
       FROM registros_notas rn
       JOIN usuarios_academia u ON rn.usuario_id = u.id
       WHERE rn.evaluacion_id = $1
       ORDER BY rn.calificacion DESC`,
      [evaluationId]
    );

    res.json({
      evaluacion: evalResult.rows[0],
      distribucion: distributionResult.rows[0],
      participantes: participantsResult.rows,
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;
