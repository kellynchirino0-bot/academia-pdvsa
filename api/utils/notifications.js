const { storage } = require('../storage/memory-store');

let nextNotifId = storage.notifications.length > 0 ? Math.max(...storage.notifications.map(n => n.id), 0) + 1 : 1;

function createNotification(userId, tipo, titulo, mensaje) {
  if (!storage.notifications) storage.notifications = [];
  storage.notifications.push({
    id: nextNotifId++, user_id: userId, tipo, titulo, mensaje,
    leida: false, created_at: new Date().toISOString()
  });
}

module.exports = { createNotification };