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
import Evaluaciones from './pages/Evaluaciones';
import Notas from './pages/Notas';
import Certificados from './pages/Certificados';
import Usuarios from './pages/Usuarios';
import GestionLeads from './pages/GestionLeads';
import AdminCurso from './pages/AdminCurso';
import AdminCertificados from './pages/AdminCertificados';
import AdminUsersManager from './pages/AdminUsersManager';
import AdminExecutiveDashboard from './pages/AdminExecutiveDashboard';
import AdminConsolidatedReport from './pages/AdminConsolidatedReport';
import TutorDashboard from './pages/TutorDashboard';
import TutorCourseEditor from './pages/TutorCourseEditor';
import StudentReport from './pages/StudentReport';
import CertificateVerify from './pages/CertificateVerify';
import FaqPage from './pages/FaqPage';
import GuionEstrategicoPDF from './components/GuionEstrategicoPDF';
import PromptsPDVSA from './pages/PromptsPDVSA';
import RecursosEnterprise from './pages/RecursosEnterprise';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:certificateId" element={<CertificateVerify />} />
          
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
