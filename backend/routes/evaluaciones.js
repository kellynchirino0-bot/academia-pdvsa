const express = require('express');
const pool = require('../config/db');
const { verificarToken, verificarRol } = require('../middleware/auth');
const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, titulo, descripcion, ponderacion, fecha_limite, creado_en
       FROM evaluaciones_cuestionarios ORDER BY fecha_limite ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar evaluaciones.' });
  }
});

router.get('/:id/preguntas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, enunciado, opciones, orden FROM preguntas
       WHERE evaluacion_id = $1 ORDER BY orden`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener preguntas.' });
  }
});

router.post('/', verificarToken, verificarRol('Administrador', 'Instructor'), async (req, res) => {
  try {
    const { titulo, descripcion, ponderacion, fecha_limite } = req.body;
    const result = await pool.query(
      `INSERT INTO evaluaciones_cuestionarios (titulo, descripcion, ponderacion, fecha_limite, creado_por)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, descripcion, ponderacion || 0, fecha_limite, req.usuario.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear evaluacion.' });
  }
});

module.exports = router;
