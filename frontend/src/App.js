import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulosList from './pages/ModulosList';
import ModuloDetalle from './pages/ModuloDetalle';
import SimuladorTexto from './simulators/SimuladorTexto';
import SimuladorImagenes from './simulators/SimuladorImagenes';
import SimuladorVideoAudio from './simulators/SimuladorVideoAudio';
import Evaluaciones from './pages/Evaluaciones';
import Notas from './pages/Notas';
import Certificados from './pages/Certificados';
import Usuarios from './pages/Usuarios';
import GestionLeads from './pages/GestionLeads';
import AdminCurso from './pages/AdminCurso';
import TutorDashboard from './pages/TutorDashboard';
import Layout from './components/Layout';
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
          
          {/* Rutas Admin */}
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <Usuarios />
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
          
          {/* Rutas Tutor */}
          <Route path="/tutor" element={
            <ProtectedRoute allowedRoles={['administrador', 'tutor']}>
              <TutorDashboard />
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
