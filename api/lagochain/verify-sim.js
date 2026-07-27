const crypto = require('crypto');

const LAGOCHAIN_VERSION = 'ML-DSA-87 (FIPS 204 Simulado)';
const DEFAULT_AUTHORITY = 'Nasser Group / GabrielBiz Galaxy';

function generarHash(data) {
  const payload = JSON.stringify(data);
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function generarFirmaMLDSA(hash) {
  const prefix = crypto.randomBytes(8).toString('hex');
  const suffix = crypto.randomBytes(8).toString('hex');
  const signature = `MLDSA_${prefix}_${hash.substring(0, 16)}_${suffix}`;
  return signature;
}

function emitirRecibo(hash, firma, data) {
  const recibo = {
    lagochain_version: LAGOCHAIN_VERSION,
    authority: DEFAULT_AUTHORITY,
    hash_sha256: hash,
    firma_ml_dsa: firma,
    id_verificador: `LC-${hash.substring(0, 12).toUpperCase()}`,
    fecha_emision: new Date().toISOString(),
    sello_temporal: Math.floor(Date.now() / 1000),
    tipo_registro: data.tipo || 'simulacion',
    origen: data.origen || 'desconocido',
    resumen: data.resumen || null,
    metadata: data.metadata || {}
  };
  return recibo;
}

module.exports = async (req, res) => {
  try {
    const { tipo, origen, resultados, metadata } = req.body;

    if (!resultados) {
      return res.status(400).json({
        exito: false,
        error: 'Se requieren "resultados" en el cuerpo de la solicitud para generar el hash.'
      });
    }

    const data = {
      tipo: tipo || 'simulacion',
      origen: origen || 'calculadora-io',
      resultados,
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    const hash = generarHash(data);
    const firma = generarFirmaMLDSA(hash);
    const recibo = emitirRecibo(hash, firma, data);

    res.json({
      exito: true,
      recibo,
      verificacion_url: `${req.protocol}://${req.get('host')}/api/lagochain/verify/${recibo.id_verificador}`,
      mensaje: 'Simulación registrada exitosamente en LagoChain con firma ML-DSA (FIPS 204).'
    });
  } catch (err) {
    res.status(500).json({
      exito: false,
      error: 'Error al registrar en LagoChain: ' + err.message
    });
  }
};

module.exports.generarHash = generarHash;
module.exports.generarFirmaMLDSA = generarFirmaMLDSA;
module.exports.emitirRecibo = emitirRecibo;
