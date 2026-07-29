const http = require('http');
const https = require('https');

const BASE_URL = process.env.MONITOR_URL || 'https://academia-pdvsa.vercel.app';
const LATENCY_WARN_MS = 1500;
const LATENCY_CRITICAL_MS = 3000;

const ENDPOINTS = [
  { path: '/api/health', label: 'Health Check', method: 'GET', public: true },
  { path: '/api/auth/fallback-login', label: 'Fallback Login', method: 'GET', public: true },
  { path: '/api/certificates/verify/ML-DSA-PDVSA-TEST', label: 'Verificar Certificado ML-DSA', method: 'GET', public: true },
  { path: '/api/certificados/verificar?codigo=CERT-PDVSA-2026-001', label: 'Verificar Certificado BD', method: 'GET', public: true },
  { path: '/api/lagochain/verify/LC-MONITOR-TEST', label: 'LagoChain Verify', method: 'GET', public: true },
  { path: '/login', label: 'Frontend SPA (Login)', method: 'GET', public: true },
];

function fetchUrl(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method, timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({ status: res.statusCode, latency, body: data.substring(0, 500) });
      });
    });
    req.on('error', (err) => {
      const latency = Date.now() - start;
      resolve({ status: 0, latency, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      const latency = Date.now() - start;
      resolve({ status: 0, latency, error: 'TIMEOUT' });
    });
    req.end();
  });
}

function formatStatus(status, label, latency, details = '') {
  const icon = status >= 200 && status < 400 ? '✅' : '❌';
  const latencyStr = latency > 0 ? `${latency}ms` : '-';
  let latencyIcon = '';
  if (latency > LATENCY_CRITICAL_MS) latencyIcon = ' 🔴 CRÍTICA';
  else if (latency > LATENCY_WARN_MS) latencyIcon = ' ⚠️ LENTA';
  else latencyIcon = ' 🟢';

  const detailsStr = details ? ` — ${details}` : '';
  return `  ${icon} ${status}  | ${latencyStr}${latencyIcon} | ${label}${detailsStr}`;
}

async function run() {
  const startTime = Date.now();
  const sep = '═'.repeat(70);
  const subSep = '─'.repeat(70);

  console.log(`\n${sep}`);
  console.log(`  🏥 MONITOR DE SALUD — ACADEMIA VIRTUAL NASSER GROUP PDVSA`);
  console.log(`  ${new Date().toISOString()}`);
  console.log(`  URL Base: ${BASE_URL}`);
  console.log(`${sep}\n`);

  let passed = 0;
  let failed = 0;
  let totalLatency = 0;

  for (const ep of ENDPOINTS) {
    const url = `${BASE_URL}${ep.path}`;
    const result = await fetchUrl(url, ep.method);
    const isOk = result.status >= 200 && result.status < 400;

    let details = '';
    if (result.error) details = result.error;
    else if (result.body) {
      try {
        const parsed = JSON.parse(result.body);
        if (parsed.status) details = `status: ${parsed.status}`;
        if (parsed.version) details += ` | version: ${parsed.version}`;
        if (parsed.valido !== undefined) details += ` | válido: ${parsed.valido}`;
        if (parsed.exito !== undefined) details += ` | éxito: ${parsed.exito}`;
        if (parsed.message) details = details || parsed.message.substring(0, 80);
      } catch {
        details = result.body.replace(/<[^>]*>/g, '').substring(0, 80).trim();
      }
    }

    console.log(formatStatus(result.status, ep.label, result.latency, details));
    if (isOk) passed++;
    else failed++;
    if (result.latency > 0) totalLatency += result.latency;
  }

  const avgLatency = passed + failed > 0 ? Math.round(totalLatency / (passed + failed)) : 0;
  const totalTime = Date.now() - startTime;
  const healthScore = passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0;

  console.log(`\n${subSep}`);
  console.log(`  📊 RESUMEN`);
  console.log(`${subSep}`);
  console.log(`  ✅ Pasaron: ${passed}`);
  console.log(`  ❌ Fallaron: ${failed}`);
  console.log(`  📈 Salud: ${healthScore}%`);
  console.log(`  ⏱️  Latencia Promedio: ${avgLatency}ms`);
  console.log(`  ⏱️  Tiempo Total: ${totalTime}ms`);
  console.log(`${sep}\n`);

  if (failed > 0) {
    console.log('  ⚠️  ALERTA: Algunos endpoints fallaron. Revisa el reporte.\n');
    process.exit(1);
  }
  if (avgLatency > LATENCY_CRITICAL_MS) {
    console.log('  🔴 ALERTA CRÍTICA: Latencia promedio excede 3000ms.\n');
    process.exit(1);
  }
  if (avgLatency > LATENCY_WARN_MS) {
    console.log('  ⚠️  ADVERTENCIA: Latencia promedio excede 1500ms. Monitorear.\n');
  }

  console.log('  ✅ Todos los sistemas operativos.\n');
  process.exit(0);
}

run().catch((err) => {
  console.error('  💥 Error crítico en monitor:', err.message);
  process.exit(1);
});