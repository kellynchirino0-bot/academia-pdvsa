const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, '.vercel', 'output');
const STATIC_DIR = path.join(OUTPUT_DIR, 'static');
const FUNCTIONS_DIR = path.join(OUTPUT_DIR, 'functions');

async function build() {
  console.log('[1/4] Cleaning...');
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

  console.log('[2/4] Building React...');
  execSync('cd frontend && npm install && npm run build', { cwd: ROOT, stdio: 'inherit' });

  console.log('[3/4] Creating .vercel/output/static/...');
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  copyRecursive(path.join(ROOT, 'frontend', 'build'), STATIC_DIR);

  console.log('[4/4] Bundling API...');
  const funcDir = path.join(FUNCTIONS_DIR, 'api', 'index.func');
  fs.mkdirSync(funcDir, { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'api', 'index.js')],
    bundle: true, platform: 'node', target: 'node18',
    outfile: path.join(funcDir, 'index.js'),
    logLevel: 'info',
  });

  fs.writeFileSync(path.join(funcDir, '.func-config.json'), JSON.stringify({
    runtime: 'nodejs18.x',
    handler: 'index.js',
  }));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'config.json'), JSON.stringify({
    version: 3,
    routes: [
      { src: '/api/(.*)', dest: '/api/index' },
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' }
    ]
  }, null, 2));

  console.log('[DONE] Static files in .vercel/output/static/:');
  const files = fs.readdirSync(STATIC_DIR);
  console.log(files);
  console.log('index.html exists:', fs.existsSync(path.join(STATIC_DIR, 'index.html')));
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) copyRecursive(path.join(src, entry), path.join(dest, entry));
  } else { fs.copyFileSync(src, dest); }
}

build().catch(err => { console.error('Build failed:', err); process.exit(1); });
