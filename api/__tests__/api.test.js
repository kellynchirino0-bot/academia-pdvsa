process.env.JWT_SECRET = 'test_jwt_secret_for_integration_tests_2026';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { storage } = require('../storage/memory-store');

let authToken = '';
let adminToken = '';

beforeAll(() => {
  expect(storage.usuarios.length).toBeGreaterThanOrEqual(3);
  expect(storage.modulos.length).toBe(4);
  expect(storage.lecciones.length).toBe(16);
  expect(storage.evaluaciones.length).toBe(4);
});

describe('🔵 HEALTH & SYSTEM', () => {
  test('GET /api/health → 200 + version 2.0.0', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.version).toBe('2.0.0');
    expect(res.body.message).toContain('Academia Virtual');
  });

  test('GET /api/health → incluye timestamp ISO', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.timestamp).toBeDefined();
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});

describe('🟡 AUTHENTICATION', () => {
  test('POST /api/auth/login con credenciales válidas → 200 + token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@pdvsa.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Inicio de sesión exitoso');
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split('.')).toHaveLength(3);
    expect(res.body.user.rol).toBe('administrador');
    expect(res.body.user.plan_suscripcion).toBe('b2b_enterprise');
    adminToken = res.body.token;
  });

  test('POST /api/auth/login con credenciales inválidas → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'admin@pdvsa.com', password: 'wrong_password_xyz' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });

  test('POST /api/auth/login con campos vacíos → 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('requeridos');
  });

  test('GET /api/auth/verify con token válido → 200 + valid:true', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  test('GET /api/auth/verify sin token → 403', async () => {
    const res = await request(app).get('/api/auth/verify');
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Token');
  });

  test('GET /api/auth/verify con token inválido → 401', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('inválido');
  });

  test('POST /api/auth/register con datos válidos → 201 + token JWT', async () => {
    const uniqueEmail = `test_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        cedula: `V-${90000000 + Math.floor(Math.random() * 10000000)}`,
        nombre_completo: 'Test User QA',
        cargo: 'QA Engineer',
        correo: uniqueEmail,
        password: 'TestPass2026!'
      });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.rol).toBe('participante');
    authToken = res.body.token;
  });

  test('POST /api/auth/register con correo duplicado → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        cedula: 'V-99999999',
        nombre_completo: 'Duplicate User',
        correo: 'admin@pdvsa.com',
        password: 'TestPass2026!'
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('ya existe');
  });

  test('POST /api/auth/register campos incompletos → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ correo: 'only@email.com' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/change-password con token → 200', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ currentPassword: 'TestPass2026!', newPassword: 'NewPass2026!' });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('actualizada');
  });
});

describe('🟢 USERS & ROLES', () => {
  test('GET /api/users sin rol admin → 403', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(403);
  });

  test('GET /api/users con rol admin → 200 + array usuarios', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(8);
    expect(res.body[0]).toHaveProperty('nombre_completo');
    expect(res.body[0]).toHaveProperty('correo');
    expect(res.body[0]).toHaveProperty('rol_id');
  });

  test('GET /api/users/:id propio perfil → 200', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
});

describe('🟠 COURSES & MODULES', () => {
  test('GET /api/courses/modulos con token → 200 + 4 módulos', async () => {
    const res = await request(app)
      .get('/api/courses/modulos')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(4);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('total_lecciones');
    expect(res.body[0]).toHaveProperty('porcentaje_avance');
  });

  test('GET /api/courses/modulos/:id detalle → 200', async () => {
    const res = await request(app)
      .get('/api/courses/modulos/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(Array.isArray(res.body.lecciones)).toBe(true);
    expect(res.body.lecciones.length).toBe(4);
  });

  test('GET /api/courses/modulos/:id/lecciones → 200', async () => {
    const res = await request(app)
      .get('/api/courses/modulos/1/lecciones')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  test('GET /api/courses/modulos/999 → 404', async () => {
    const res = await request(app)
      .get('/api/courses/modulos/999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  test('POST /api/courses/lecciones/completar → 200', async () => {
    const res = await request(app)
      .post('/api/courses/lecciones/completar')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ leccion_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('completada');
  });

  test('GET /api/courses/stats → 200 + KPIs', async () => {
    const res = await request(app)
      .get('/api/courses/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalModulos');
    expect(res.body).toHaveProperty('totalEstudiantes');
    expect(res.body).toHaveProperty('totalLecciones');
    expect(res.body.totalModulos).toBe(4);
  });
});

describe('🟣 EVALUATIONS', () => {
  test('GET /api/evaluations → 200 + 4 evaluaciones', async () => {
    const res = await request(app)
      .get('/api/evaluations')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  test('GET /api/evaluations/:id → 200', async () => {
    const res = await request(app)
      .get('/api/evaluations/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.titulo).toContain('Fundamentos');
  });

  test('POST /api/evaluations/:id/submit → 200 + calificación', async () => {
    const res = await request(app)
      .post('/api/evaluations/1/submit')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ respuestas: [0, 1, 0] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('calificacion');
    expect(res.body).toHaveProperty('aprobado');
    expect(res.body).toHaveProperty('correctas');
    expect(res.body.total).toBe(3);
  });
});

describe('🔴 CERTIFICATES & LAGOCHAIN', () => {
  test('GET /api/certificates → 200 + array', async () => {
    const res = await request(app)
      .get('/api/certificates')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/certificates/verify/:code → 200 + valido:true', async () => {
    const res = await request(app)
      .get('/api/certificates/verify/CERT_TEST_2026');
    expect(res.status).toBe(200);
    expect(res.body.valido).toBe(true);
    expect(res.body.certificado).toHaveProperty('codigo_verificacion');
    expect(res.body.certificado).toHaveProperty('firma_mldsa');
  });

  test('GET /api/certificados/verificar?codigo= → 200', async () => {
    const res = await request(app)
      .get('/api/certificados/verificar?codigo=CERT-PDVSA-2026-001');
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.encontrado).toBe(true);
  });

  test('POST /api/lagochain/verify-sim → 200 + firma ML-DSA', async () => {
    const res = await request(app)
      .post('/api/lagochain/verify-sim')
      .send({ resultados: { prueba: 'test_integracion' }, tipo: 'test_qa' });
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.recibo).toHaveProperty('firma_ml_dsa');
    expect(res.body.recibo).toHaveProperty('lagochain_version');
    expect(res.body.recibo.lagochain_version).toContain('ML-DSA');
  });

  test('GET /api/lagochain/verify/:id → 200', async () => {
    const res = await request(app)
      .get('/api/lagochain/verify/LC-TEST12345678');
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.estado).toBe('REGISTRADO');
  });
});

describe('🟤 MATH SOLVERS (IO)', () => {
  test('POST /api/math/eoq → 200 + resultado EOQ', async () => {
    const res = await request(app)
      .post('/api/math/eoq')
      .send({ demanda_anual: 1000, costo_pedido: 50, costo_mantenimiento: 2 });
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.eoq).toBeGreaterThan(0);
  });

  test('POST /api/math/cpm-pert → 200', async () => {
    const res = await request(app)
      .post('/api/math/cpm-pert')
      .send({
        actividades: [
          { id: 'A', duracion: 5, dependencias: [] },
          { id: 'B', duracion: 3, dependencias: ['A'] },
          { id: 'C', duracion: 4, dependencias: ['A'] },
          { id: 'D', duracion: 2, dependencias: ['B', 'C'] }
        ]
      });
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
  });
});

describe('⚪ AI & COPILOT', () => {
  test('POST /api/ai/copilot con consulta válida → 200 + respuesta', async () => {
    const res = await request(app)
      .post('/api/ai/copilot')
      .send({ consulta: 'bomba centrifuga mantenimiento preventivo' });
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.respuesta).toContain('Diagnóstico');
    expect(res.body.normativas_relevantes.length).toBeGreaterThanOrEqual(1);
  });

  test('POST /api/ai/copilot con consulta corta → 400', async () => {
    const res = await request(app)
      .post('/api/ai/copilot')
      .send({ consulta: 'ab' });
    expect(res.status).toBe(400);
  });

  test('POST /api/ai/generate-report → 200', async () => {
    const res = await request(app)
      .post('/api/ai/generate-report')
      .send({
        assetType: 'bomba',
        data: { equipo: 'Bomba Centrífuga A-101', hallazgos: 'Fuga en sello mecánico', nivel_urgencia: 'ALTA' }
      });
    expect(res.status).toBe(200);
    expect(res.body.exito).toBe(true);
    expect(res.body.reporte.titulo).toContain('BOMBA');
    expect(res.body.markdown).toContain('INFORME');
  });
});

describe('🔵 LEADS & CRM', () => {
  test('GET /api/leads con rol admin → 200', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/leads (público) → 201', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({ nombre_completo: 'Test Lead QA', email: `lead_${Date.now()}@test.com`, telefono: '+58-412-0000000' });
    expect(res.status).toBe(201);
    expect(res.body.lead).toHaveProperty('id');
  });

  test('GET /api/leads/stats → 200 + KPIs', async () => {
    const res = await request(app)
      .get('/api/leads/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('tasaConversion');
  });
});

describe('🟢 NOTIFICATIONS & BADGES', () => {
  test('GET /api/notifications → 200 + array', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('notificaciones');
    expect(res.body).toHaveProperty('no_leidas');
  });

  test('GET /api/badges/user/:id/all → 200 + lista de badges', async () => {
    const res = await request(app)
      .get('/api/badges/user/1/all')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('nombre');
    expect(res.body[0]).toHaveProperty('otorgada');
  });
});

describe('🟠 PROGRESS & REPORTS', () => {
  test('GET /api/progress/:userId → 200 + porcentaje', async () => {
    const res = await request(app)
      .get('/api/progress/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('porcentaje_global');
    expect(res.body).toHaveProperty('lecciones_completadas');
    expect(res.body).toHaveProperty('modulos');
    expect(res.body.modulos.length).toBe(4);
  });

  test('GET /api/reports/student/:userId → 200', async () => {
    const res = await request(app)
      .get('/api/reports/student/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.estudiante).toBeDefined();
    expect(res.body.calificaciones.length).toBe(4);
  });

  test('GET /api/reports/admin/consolidado → 200', async () => {
    const res = await request(app)
      .get('/api/reports/admin/consolidado')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.resumen).toBeDefined();
    expect(res.body.matriz_talento).toBeDefined();
  });
});

describe('🟣 ADMIN DASHBOARD', () => {
  test('GET /api/admin/dashboard → 200 + KPIs completos', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.kpis).toBeDefined();
    expect(res.body.kpis.totalEstudiantes).toBeGreaterThanOrEqual(3);
    expect(res.body.kpis.totalModulos).toBe(4);
    expect(res.body.kpis.totalEvaluaciones).toBe(4);
  });

  test('GET /api/admin/metrics → 200', async () => {
    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total_estudiantes');
    expect(res.body).toHaveProperty('status_servidores');
    expect(res.body.status_servidores.api_vercel).toBe('HTTP 200');
  });

  test('GET /api/admin/business-metrics → 200', async () => {
    const res = await request(app)
      .get('/api/admin/business-metrics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('licencias_b2b_activas');
    expect(res.body).toHaveProperty('ingresos_estimados_usd');
    expect(res.body).toHaveProperty('impacto_operativo_faja');
  });
});

describe('🟤 SIMULATORS', () => {
  test('POST /api/simulators/text-prompt → 200 + respuesta ejecutiva', async () => {
    const res = await request(app)
      .post('/api/simulators/text-prompt')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ prompt: 'Analizar producción petrolera Q4 2026' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.respuesta.respuesta).toContain('INFORME EJECUTIVO');
  });

  test('POST /api/simulators/image-prompt → 200', async () => {
    const res = await request(app)
      .post('/api/simulators/image-prompt')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ prompt: 'Analizar soldadura en tubería 12"', tipo_modelo: 'GAN' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('⚪ PAYMENTS', () => {
  test('POST /api/payments/reportar → 201', async () => {
    const res = await request(app)
      .post('/api/payments/reportar')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ metodo: 'binance', referencia: `REF_${Date.now()}`, monto: 450, plan_solicitado: 'vip_diplomado' });
    expect(res.status).toBe(201);
    expect(res.body.exito).toBe(true);
  });
});

describe('🔴 FALLBACK & ERROR HANDLING', () => {
  test('GET /api/auth/fallback-login → 200 + token', async () => {
    const res = await request(app).get('/api/auth/fallback-login');
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.rol).toBe('administrador');
  });

  test('GET /api/ruta/inexistente → 404', async () => {
    const res = await request(app).get('/api/ruta/que/no/existe');
    expect(res.status).toBe(404);
  });

  test('POST /api/auth/login con body malformed → no crash', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(null);
    expect(res.status).toBe(400);
  });
});