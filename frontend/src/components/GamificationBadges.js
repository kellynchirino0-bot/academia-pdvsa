import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const GamificationBadges = ({ userId }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBadges(); }, [userId]);

  const loadBadges = async () => {
    const uid = userId || user?.id;
    if (!uid) return;
    try {
      const response = await axios.get(`${API_URL}/badges/user/${uid}/all`);
      setBadges(response.data);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ width: '24px', height: '24px' }}></div>;

  const otorgadas = badges.filter(b => b.otorgada).length;

  return (
    <div className="card">
      <div className="card-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#d4a843" /> Mis Insignias
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '400' }}>({otorgadas}/{badges.length})</span>
        </h2>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {badges.map((badge, idx) => (
            <div key={idx} style={{
              padding: '16px', borderRadius: '12px', textAlign: 'center',
              background: badge.otorgada ? `${badge.color}15` : '#f8fafc',
              border: `2px solid ${badge.otorgada ? badge.color : '#e2e8f0'}`,
              opacity: badge.otorgada ? 1 : 0.5,
              position: 'relative'
            }}>
              {badge.otorgada && (
                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <CheckCircle size={14} color={badge.color} />
                </div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{badge.icono}</div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '4px', color: badge.otorgada ? badge.color : '#94a3b8' }}>
                {badge.nombre}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {badge.descripcion}
              </div>
              {badge.otorgada ? (
                <div style={{ fontSize: '0.7rem', color: badge.color, marginTop: '6px', fontWeight: '500' }}>
                  Obtenida: {new Date(badge.fecha_otorgada).toLocaleDateString('es-VE')}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <Lock size={10} /> Bloqueada
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationBadges;
