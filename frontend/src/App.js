import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulosList from './pages/ModulosList';
import ModuloDetalle from './pages/ModuloDetalle';
import LeccionDetalle from './pages/LeccionDetalle';
import SimuladorTexto from './simulators/SimuladorTexto';
import SimuladorImagenes from './simulators/SimuladorImagenes';
import SimuladorVideoAudio from './simulators/SimuladorVideoAudio';
import SimuladorPetroleo from './simulators/SimuladorPetroleo';
import SimuladorCalderas from './simulators/SimuladorCalderas';
import SimuladorPLC from './simulators/SimuladorPLC';
import SimuladorSoldadura from './simulators/SimuladorSoldadura';
import Evaluaciones from './pages/Evaluaciones';
import Notas from './pages/Notas';
import Certificados from './pages/Certificados';
import Usuarios from './pages/Usuarios';
import GestionLeads from './pages/GestionLeads';
import AdminCurso from './pages/AdminCurso';
import AdminCertificados from './pages/AdminCertificados';
import AdminUsersManager from './pages/AdminUsersManager';
import AdminExecutiveDashboard from './pages/AdminExecutiveDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminConsolidatedReport from './pages/AdminConsolidatedReport';
import TutorDashboard from './pages/TutorDashboard';
import TutorCourseEditor from './pages/TutorCourseEditor';
import StudentReport from './pages/StudentReport';
import FaqPage from './pages/FaqPage';
import GuionEstrategicoPDF from './components/GuionEstrategicoPDF';
import IOLeccionView from './pages/IOLeccionView';
import PromptsPDVSA from './pages/PromptsPDVSA';
import RecursosEnterprise from './pages/RecursosEnterprise';
import VerificarCertificado from './pages/VerificarCertificado';
import CheckoutPagos from './pages/CheckoutPagos';
import Layout from './components/Layout';
import TrialCountdownBanner from './components/TrialCountdownBanner';
import './styles/index.css';
import './styles/App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function PremiumRoute({ children, allowedRoles, planName }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  const plan = user?.plan_suscripcion || 'gratuito';
  const planesPago = ['vip_diplomado', 'b2b_enterprise', 'sim_petroleo', 'sim_calderas', 'sim_plc', 'sim_soldadura'];

  if (!planesPago.includes(plan)) {
    return <Navigate to={`/suscripcion?recurso=${encodeURIComponent(planName || 'contenido premium')}`} replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:id" element={<VerificarCertificado />} />
          <Route path="/verificar-certificado/:id" element={<VerificarCertificado />} />
          
          {/* Rutas generales */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Rutas de cursos */}
          <Route path="/cursos" element={
            <ProtectedRoute>
              <ModulosList />
            </ProtectedRoute>
          } />
          <Route path="/cursos/modulo/:id" element={
            <ProtectedRoute>
              <ModuloDetalle />
            </ProtectedRoute>
          } />
          {/* Pista Académica I.O. - debe ir ANTES de la ruta genérica */}
          <Route path="/cursos/modulo/4/leccion/:leccionId" element={
            <ProtectedRoute>
              <IOLeccionView />
            </ProtectedRoute>
          } />
          <Route path="/cursos/modulo/:id/leccion/:lessonId" element={
            <ProtectedRoute>
              <LeccionDetalle />
            </ProtectedRoute>
          } />
          
          {/* Simuladores */}
          <Route path="/simulador/texto" element={
            <ProtectedRoute>
              <SimuladorTexto />
            </ProtectedRoute>
          } />
          <Route path="/simulador/imagenes" element={
            <ProtectedRoute>
              <SimuladorImagenes />
            </ProtectedRoute>
          } />
          <Route path="/simulador/video-audio" element={
            <ProtectedRoute>
              <SimuladorVideoAudio />
            </ProtectedRoute>
          } />
          <Route path="/simulador/petroleo" element={
            <PremiumRoute planName="Simulador 3D de Petróleo — Bombeo IA">
              <SimuladorPetroleo />
            </PremiumRoute>
          } />
          <Route path="/simulador/calderas" element={
            <PremiumRoute planName="Simulador 3D de Calderas — LIMS">
              <SimuladorCalderas />
            </PremiumRoute>
          } />
          <Route path="/simulador/plc" element={
            <PremiumRoute planName="Simulador 3D de PLC / SCADA">
              <SimuladorPLC />
            </PremiumRoute>
          } />
          <Route path="/simulador/soldadura" element={
            <PremiumRoute planName="Simulador 3D de Soldadura AWS + NDT">
              <SimuladorSoldadura />
            </PremiumRoute>
          } />
          
          {/* Evaluaciones y Notas */}
          <Route path="/evaluaciones" element={
            <ProtectedRoute>
              <Evaluaciones />
            </ProtectedRoute>
          } />
          <Route path="/notas" element={
            <ProtectedRoute>
              <Notas />
            </ProtectedRoute>
          } />
          <Route path="/certificados" element={
            <ProtectedRoute>
              <Certificados />
            </ProtectedRoute>
          } />
          <Route path="/mi-reporte" element={
            <ProtectedRoute>
              <StudentReport />
            </ProtectedRoute>
          } />
          <Route path="/ayuda" element={
            <ProtectedRoute>
              <FaqPage />
            </ProtectedRoute>
          } />
          <Route path="/guion-pdf" element={<GuionEstrategicoPDF />} />
          <Route path="/prompts-pdvsa" element={<PromptsPDVSA />} />
          <Route path="/recursos-enterprise" element={<RecursosEnterprise />} />
          <Route path="/verificar-certificado" element={<VerificarCertificado />} />
          <Route path="/suscripcion" element={
            <ProtectedRoute>
              <CheckoutPagos />
            </ProtectedRoute>
          } />
          <Route path="/diplomados-avanzados" element={
            <PremiumRoute>
              <CheckoutPagos />
            </PremiumRoute>
          } />
          <Route path="/b2b-dashboard" element={
            <PremiumRoute allowedRoles={['administrador']}>
              <CheckoutPagos />
            </PremiumRoute>
          } />
          
          {/* Rutas Admin */}
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Usuarios />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminUsersManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminExecutiveDashboard />
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <GestionLeads />
            </ProtectedRoute>
          } />
          <Route path="/admin/curso" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminCurso />
            </ProtectedRoute>
          } />
          <Route path="/admin/certificados" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminCertificados />
            </ProtectedRoute>
          } />
          <Route path="/admin/reportes" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminConsolidatedReport />
            </ProtectedRoute>
          } />
          <Route path="/admin/panel" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Rutas Tutor */}
          <Route path="/tutor" element={
            <ProtectedRoute allowedRoles={['administrador', 'tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/tutor/editor-cursos" element={
            <ProtectedRoute allowedRoles={['administrador', 'tutor']}>
              <TutorCourseEditor />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
