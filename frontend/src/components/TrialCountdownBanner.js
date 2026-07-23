import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Crown } from 'lucide-react';

const TrialCountdownBanner = ({ trial }) => {
  if (!trial || trial.rol === 'administrador' || trial.rol === 'tutor') return null;

  const diasRestantes = trial.dias_restantes;
  const isActive = trial.estado === 'ACTIVE' && diasRestantes > 0;
  const isExpired = trial.estado === 'TRIAL_EXPIRED' || diasRestantes <= 0;
  const isExtended = trial.membresia_extendida;

  if (isExtended) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: '#fff', padding: '12px 20px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
      }}>
        <Crown size={22} />
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Membresia Activa</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Tu acceso ha sido extendido por el administrador</div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        color: '#fff', padding: '12px 20px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
      }}>
        <AlertTriangle size={22} />
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Prueba Expirada</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Tu periodo de prueba de 30 dias ha finalizado. Contacta al administrador.</div>
        </div>
      </div>
    );
  }

  const urgencyColor = diasRestantes <= 7 ? '#f59e0b' : diasRestantes <= 14 ? '#3b82f6' : '#10b981';
  const urgencyBg = diasRestantes <= 7 ? 'rgba(245, 158, 11, 0.1)' : diasRestantes <= 14 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)';

  return (
    <div style={{
      background: urgencyBg,
      border: `2px solid ${urgencyColor}`,
      color: urgencyColor, padding: '12px 20px', borderRadius: '12px',
      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'
    }}>
      <Clock size={22} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
          Quedan {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''} de prueba gratuita
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Tu prueba termina el {new Date(trial.trial_end).toLocaleDateString('es-VE')}
        </div>
      </div>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: `3px solid ${urgencyColor}`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontWeight: '800', fontSize: '1.1rem'
      }}>
        {diasRestantes}
      </div>
    </div>
  );
};

export default TrialCountdownBanner;
