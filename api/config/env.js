const env = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'https://academia-pdvsa.vercel.app,http://localhost:3000,http://localhost:5173').split(','),
  CRM_WEBHOOK_URL: process.env.CRM_WEBHOOK_URL || '',
  HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
};

if (!env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET no está configurada en las variables de entorno');
  process.exit(1);
}

module.exports = env;