const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { memoryStorage } = require('../database/connection');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Generar certificado
router.post('/generate', verifyToken, async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const usuario = memoryStorage.usuarios.find(u => u.id === usuarioId);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ha aprobado todas las evaluaciones obligatorias
        const evaluaciones = memoryStorage.evaluaciones;
        const notasUsuario = memoryStorage.notas.filter(n => n.usuario_id === usuarioId);
        
        let calificacionFinal = 0;
        let evaluacionesAprobadas = 0;

        if (evaluaciones.length > 0) {
            evaluaciones.forEach(ev => {
                const nota = notasUsuario.find(n => n.evaluacion_id === ev.id);
                if (nota && nota.estatus_aprobacion) {
                    evaluacionesAprobadas++;
                    calificacionFinal += parseFloat(nota.calificacion);
                }
            });
            calificacionFinal = (calificacionFinal / evaluacionesAprobadas).toFixed(2);
        }

        // Generar código de verificación único
        const codigoVerificacion = `NG-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`;
        
        // Generar QR Code
        const qrData = JSON.stringify({
            institucion: 'Nasser Group',
            curso: 'Inteligencia Artificial para Líderes de Negocio',
            empresa: 'PDVSA',
            participante: usuario.nombre_completo,
            cedula: usuario.cedula,
            codigo: codigoVerificacion,
            fecha: new Date().toISOString()
        });

        const qrCodeDataURL = await QRCode.toDataURL(qrData);

        const nuevoCertificado = {
            id: memoryStorage.certificados.length + 1,
            usuario_id: usuarioId,
            codigo_verificacion: codigoVerificacion,
            fecha_emision: new Date().toISOString(),
            calificacion_final: parseFloat(calificacionFinal),
            estatus: 'emitido',
            qr_code: qrCodeDataURL,
            participante: {
                nombre: usuario.nombre_completo,
                cedula: usuario.cedula,
                cargo: usuario.cargo
            },
            curso: 'Inteligencia Artificial para Líderes de Negocio',
            institucion: 'Nasser Group - PDVSA'
        };

        memoryStorage.certificados.push(nuevoCertificado);

        res.status(201).json({
            message: 'Certificado generado exitosamente',
            certificado: nuevoCertificado
        });
    } catch (error) {
        console.error('Error al generar certificado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Verificar certificado
router.get('/verify/:codigo', (req, res) => {
    const certificado = memoryStorage.certificados.find(
        c => c.codigo_verificacion === req.params.codigo
    );

    if (!certificado) {
        return res.status(404).json({ error: 'Certificado no encontrado o inválido' });
    }

    res.json({
        valido: true,
        certificado: {
            participante: certificado.participante,
            curso: certificado.curso,
            institucion: certificado.institucion,
            fecha_emision: certificado.fecha_emision,
            calificacion_final: certificado.calificacion_final,
            estatus: certificado.estatus,
            codigo_verificacion: certificado.codigo_verificacion
        }
    });
});

// Obtener certificados de un usuario
router.get('/user/:userId', verifyToken, (req, res) => {
    const usuarioId = parseInt(req.params.userId);
    const certificados = memoryStorage.certificados.filter(c => c.usuario_id === usuarioId);
    res.json(certificados);
});

// Obtener todos los certificados (Admin)
router.get('/', verifyToken, verifyRole(1), (req, res) => {
    const certificados = memoryStorage.certificados.map(c => ({
        ...c,
        participante_nombre: c.participante?.nombre
    }));
    res.json(certificados);
});

module.exports = router;
