const { storage, getNextId } = require('../storage/memory-store');
const { verifyToken } = require('../middleware/auth');

let nextNotifId = 1;

function createNotification(userId, tipo, titulo, mensaje) {
  storage.notifications.push({
    id: nextNotifId++, user_id: userId, tipo, titulo, mensaje,
    leida: false, created_at: new Date().toISOString()
  });
}

function setup(app) {
  app.get('/api/notifications', verifyToken, (req, res) => {
    const userNotifs = storage.notifications
      .filter(n => n.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const no_leidas = userNotifs.filter(n => !n.leida).length;
    res.json({ notificaciones: userNotifs, no_leidas });
  });

  app.put('/api/notifications/:id/read', verifyToken, (req, res) => {
    const notif = storage.notifications.find(n => n.id === parseInt(req.params.id) && n.user_id === req.user.id);
    if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
    notif.leida = true;
    res.json({ message: 'Marcada como leída' });
  });

  app.put('/api/notifications/read-all', verifyToken, (req, res) => {
    storage.notifications.forEach(n => {
      if (n.user_id === req.user.id) n.leida = true;
    });
    res.json({ message: 'Todas marcadas como leídas' });
  });

  app.get('/api/badges/user/:userId/all', verifyToken, (req, res) => {
    const uid = parseInt(req.params.userId);
    const userBadgeIds = storage.user_badges.filter(b => b.user_id === uid).map(b => b.badge_id);
    const result = storage.badges.map(b => ({
      ...b, otorgada: userBadgeIds.includes(b.id),
      fecha_otorgada: (storage.user_badges.find(ub => ub.user_id === uid && ub.badge_id === b.id) || {}).fecha_otorgada || null
    }));
    res.json(result);
  });
}

module.exports = { setup, createNotification };