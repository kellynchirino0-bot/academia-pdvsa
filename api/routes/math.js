const { Router } = require('express');
const { resolverSimplexBlend, resolverCPM, resolverEOQ } = require('../math-solvers');

const router = Router();

router.post('/math/simplex-blend', (req, res) => {
  try {
    const { crudoA, crudoB, target } = req.body;
    const resultado = resolverSimplexBlend(crudoA, crudoB, target);
    res.json({ exito: true, ...resultado });
  } catch (err) {
    res.status(400).json({ exito: false, error: err.message });
  }
});

router.post('/math/cpm-pert', (req, res) => {
  try {
    const { actividades } = req.body;
    const resultado = resolverCPM(actividades);
    res.json({ exito: true, ...resultado });
  } catch (err) {
    res.status(400).json({ exito: false, error: err.message });
  }
});

router.post('/math/eoq', (req, res) => {
  try {
    const params = req.body;
    const resultado = resolverEOQ(params);
    res.json({ exito: true, ...resultado });
  } catch (err) {
    res.status(400).json({ exito: false, error: err.message });
  }
});

module.exports = router;