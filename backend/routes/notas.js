const express = require('express');
const pool = require('../config/db');
const { verificarToken, verificarRol } = require('../middleware/auth');
const QRCode = require('qrcode');
const crypto = require('crypto');
const router = express.Router();

router.post('/calificar', verificarToken, async (req, res) => {
  try {
    const { evaluacion_id, respuestas } = req.body;
    const preguntas = await pool.query(
      `SELECT id, respuesta_correcta FROM preguntas WHERE evaluacion_id = $1`,
      [evaluacion_id]
    );
    if (preguntas.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluacion sin preguntas.' });
    }
    let aciertos = 0;
    preguntas.rows.forEach((p, i) => {
      if (respuestas[i] === p.respuesta_correcta) aciertos++;
    });
    const calificacion = parseFloat(((aciertos / preguntas.rows.length) * 100).toFixed(2));
    const estatus = calificacion >= 80 ? 'Aprobado' : 'Reprobado';
    await pool.query(
      `INSERT INTO registros_notas (usuario_id, evaluacion_id, calificacion, estatus_aprobacion)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (usuario_id, evaluacion_id)
       DO UPDATE SET calificacion = $3, estatus_aprobacion = $4, fecha_evaluacion = CURRENT_TIMESTAMP`,
      [req.usuario.id, evaluacion_id, calificacion, estatus]
    );
    res.json({ calificacion, aciertos, total: preguntas.rows.length, estatus });
  } catch (err) {
    console.error('[CALIFICAR]', err.message);
    res.status(500).json({ error: 'Error al calificar.' });
  }
});

router.get('/mis-notas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.titulo, r.calificacion, r.estatus_aprobacion, r.fecha_evaluacion
       FROM registros_notas r
       JOIN evaluaciones_cuestionarios e ON e.id = r.evaluacion_id
       WHERE r.usuario_id = $1
       ORDER BY r.fecha_evaluacion DESC`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notas.' });
  }
});

router.get('/certificado', verificarToken, async (req, res) => {
  try {
    const notas = await pool.query(
      `SELECT estatus_aprobacion FROM registros_notas WHERE usuario_id = $1`,
      [req.usuario.id]
    );
    const aprobadas = notas.rows.filter(n => n.estatus_aprobacion === 'Aprobado');
    if (aprobadas.length < 1) {
      return res.status(400).json({ error: 'Debes aprobar al menos una evaluacion para obtener el certificado.' });
    }
    const usuario = await pool.query(
      `SELECT nombre_completo, cedula FROM usuarios_academia WHERE id = $1`,
      [req.usuario.id]
    );
    const codigo = 'NASSER-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    const qrData = JSON.stringify({ codigo, nombre: usuario.rows[0].nombre_completo, curso: 'IA para Lideres de Negocio PDVSA' });
    const qrBase64 = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
    await pool.query(
      `INSERT INTO certificados (usuario_id, codigo_verificacion, qr_data)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [req.usuario.id, codigo, qrData]
    );
    res.json({
      codigo,
      nombre: usuario.rows[0].nombre_completo,
      curso: 'Inteligencia Artificial para Lideres de Negocio - PDVSA',
      emitido: new Date().toISOString(),
      qr: qrBase64,
    });
  } catch (err) {
    console.error('[CERTIFICADO]', err.message);
    res.status(500).json({ error: 'Error al generar certificado.' });
  }
});

router.get('/admin/notas', verificarToken, verificarRol('Administrador', 'Instructor'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.nombre_completo, u.cedula, e.titulo, r.calificacion, r.estatus_aprobacion, r.fecha_evaluacion
       FROM registros_notas r
       JOIN usuarios_academia u ON u.id = r.usuario_id
       JOIN evaluaciones_cuestionarios e ON e.id = r.evaluacion_id
       ORDER BY r.fecha_evaluacion DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte.' });
  }
});

module.exports = router;
