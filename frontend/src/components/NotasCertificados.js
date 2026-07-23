import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NotasCertificados() {
  const { usuario, getApi } = useAuth();
  const [notas, setNotas] = useState([]);
  const [certificado, setCertificado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);

  useEffect(() => {
    getApi().get('/notas/mis-notas').then(r => {
      setNotas(r.data);
    }).catch(() => {}).finally(() => setCargando(false));
  }, [getApi]);

  const generarCertificado = async () => {
    setGenerando(true);
    try {
      const r = await getApi().get('/notas/certificado');
      setCertificado(r.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al generar certificado.');
    }
    setGenerando(false);
  };

  const aprobadas = notas.filter(n => n.estatus_aprobacion === 'Aprobado').length;
  const puedeCertificarse = aprobadas > 0;

  if (cargando) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notas y Certificados</h1>
        <p>Consulta tus calificaciones y genera tu certificado digital avalado por Nasser Group.</p>
      </div>

      <div className="notas-section">
        <h2>📊 Boletín de Notas</h2>
        {notas.length === 0 ? (
          <div className="empty-state">Aún no tienes evaluaciones registradas. Completa los quizzes en la sección Evaluaciones.</div>
        ) : (
          <table className="notas-table">
            <thead>
              <tr><th>Evaluación</th><th>Calificación</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {notas.map((n, i) => (
                <tr key={i}>
                  <td>{n?.titulo || 'Sin título'}</td>
                  <td className={parseFloat(n.calificacion) >= 80 ? 'nota-alta' : 'nota-baja'}>{n.calificacion}%</td>
                  <td><span className={`badge ${n.estatus_aprobacion === 'Aprobado' ? 'badge-ok' : 'badge-fail'}`}>{n.estatus_aprobacion}</span></td>
                  <td>{new Date(n.fecha_evaluacion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="resumen-notas">
          <span>✅ Aprobadas: <strong>{aprobadas}</strong></span>
          <span>❌ Reprobadas: <strong>{notas.length - aprobadas}</strong></span>
          <span>📝 Total: <strong>{notas.length}</strong></span>
        </div>
      </div>

      <div className="cert-section">
        <h2>🎓 Certificado Digital</h2>
        {certificado ? (
          <div className="certificado-card">
            <div className="cert-header">
              <div className="cert-logo">NA</div>
              <h3>NASSER GROUP</h3>
              <p>Academia Virtual - Inteligencia Artificial para Líderes de Negocio</p>
            </div>
            <div className="cert-body">
              <p className="cert-otorga">Otorga el presente certificado a:</p>
              <h2 className="cert-nombre">{certificado.nombre}</h2>
              <p className="cert-curso">{certificado.curso}</p>
              <p className="cert-fecha">Emitido: {new Date(certificado.emitido).toLocaleDateString('es-VE')}</p>
              <div className="cert-qr">
                <img src={certificado.qr} alt="QR Verificación" />
              </div>
              <p className="cert-codigo">Código: <strong>{certificado.codigo}</strong></p>
              <p className="cert-aviso">Verificable en línea · Avalado por Nasser Group © 2026</p>
            </div>
            <button className="btn-primary" onClick={() => window.print()}>🖨 Imprimir Certificado</button>
          </div>
        ) : (
          <div className="cert-placeholder">
            <div className="cert-icon">🎓</div>
            <p>Completa y aprueba al menos una evaluación para obtener tu certificado digital con código QR de verificación.</p>
            <button className="btn-primary" onClick={generarCertificado} disabled={!puedeCertificarse || generando}>
              {generando ? 'Generando...' : '🎓 Generar Certificado'}
            </button>
            {!puedeCertificarse && <small className="cert-requisito">Debes aprobar al menos una evaluación primero.</small>}
          </div>
        )}
      </div>
    </div>
  );
}
