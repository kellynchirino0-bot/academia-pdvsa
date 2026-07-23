/**
 * Vercel Build Output API Script
 * Builds React to .vercel/output/static/ via temp dir
 * Also overwrites frontend/build/ so stale cache manifests are replaced
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = __dirname;
const OUTPUT_DIR = path.join(ROOT, '.vercel', 'output');
const STATIC_DIR = path.join(OUTPUT_DIR, 'static');
const FUNCTIONS_DIR = path.join(OUTPUT_DIR, 'functions');

async function build() {
  console.log('[1/4] Cleaning previous .vercel/output...');
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

  console.log('[2/4] Building React frontend...');
  execSync('cd frontend && npm install && npm run build', { cwd: ROOT, stdio: 'inherit' });

  console.log('[3/4] Copying React build to .vercel/output/static/...');
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  copyRecursive(path.join(ROOT, 'frontend', 'build'), STATIC_DIR);

  console.log('[4/4] Bundling API function with esbuild...');
  const funcDir = path.join(FUNCTIONS_DIR, 'api', 'index.func');
  fs.mkdirSync(funcDir, { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(ROOT, 'api', 'index.js')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: path.join(funcDir, 'index.js'),
    external: [],
    minify: false,
    sourcemap: false,
    metafile: false,
    logLevel: 'info',
  });

  fs.writeFileSync(path.join(funcDir, '.func-config.json'), JSON.stringify({
    runtime: 'nodejs18.x',
    handler: 'index.js',
  }));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'config.json'), JSON.stringify({
    version: 3,
    routes: [
      { src: '/api/(.*)', dest: '/api/index.js' },
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' }
    ]
  }, null, 2));

  console.log('[OK] Build complete. Output at .vercel/output/ and frontend/build/');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
