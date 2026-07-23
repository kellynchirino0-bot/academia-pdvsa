import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, CheckCheck, Award, FileText, Clock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const NotificationsCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowPanel(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data?.notificaciones || []);
      setUnread(response.data?.no_leidas || 0);
    } catch (error) {
      setNotifications([]);
      setUnread(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, leida: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`);
      setNotifications(notifications.map(n => ({ ...n, leida: true })));
      setUnread(0);
    } catch (error) {
      console.error('Error marking all:', error);
    }
  };

  const getNotifIcon = (tipo) => {
    const icons = { badge: Award, contenido: FileText, tarea: FileText, trial: Clock, alerta: AlertTriangle };
    const Icon = icons[tipo] || Bell;
    return <Icon size={16} />;
  };

  const getNotifColor = (tipo) => {
    const colors = { badge: '#d4a843', contenido: '#3b82f6', tarea: '#10b981', trial: '#f59e0b', alerta: '#ef4444' };
    return colors[tipo] || '#6b7280';
  };

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', padding: '8px', borderRadius: '8px',
          color: 'inherit', display: 'flex', alignItems: 'center'
        }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: '18px', height: '18px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: '700'
          }}>{unread}</span>
        )}
      </button>

      {showPanel && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, width: '360px',
          background: '#fff', borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0',
          zIndex: 1000, maxHeight: '480px', overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px', borderBottom: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Notificaciones</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unread > 0 && (
                <button onClick={markAllAsRead} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#3b82f6', fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <CheckCheck size={14} /> Marcar todas
                </button>
              )}
              <button onClick={() => setShowPanel(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
              }}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                <BellOff size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>Sin notificaciones</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.leida && markAsRead(n.id)}
                  style={{
                    padding: '12px 16px', borderBottom: '1px solid #f1f5f9',
                    cursor: n.leida ? 'default' : 'pointer',
                    background: n.leida ? 'transparent' : 'rgba(59, 130, 246, 0.03)',
                    display: 'flex', gap: '12px', alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: `${getNotifColor(n.tipo)}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    color: getNotifColor(n.tipo)
                  }}>
                    {getNotifIcon(n.tipo)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: n.leida ? '400' : '600',
                      fontSize: '0.9rem', marginBottom: '2px', color: '#1e293b'
                    }}>{n?.titulo || 'Sin título'}</div>
                    <div style={{
                      fontSize: '0.8rem', color: '#64748b',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{n.mensaje}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(n.created_at).toLocaleString('es-VE')}
                    </div>
                  </div>
                  {!n.leida && (
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#3b82f6', flexShrink: 0, marginTop: '6px'
                    }}></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
