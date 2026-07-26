import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL || '/api';
const BYPASS_SECRET = process.env.REACT_APP_VERCEL_BYPASS;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  const loadProgress = async (userId) => {
    try {
      const saved = localStorage.getItem('user_progress');
      if (saved) setProgress(JSON.parse(saved));
      const res = await axios.get(`${API_URL}/progress/${userId}`);
      setProgress(res.data);
      localStorage.setItem('user_progress', JSON.stringify(res.data));
      return res.data;
    } catch {
      const saved = localStorage.getItem('user_progress');
      if (saved) setProgress(JSON.parse(saved));
    }
  };

  const updateUserProgress = async (lessonId, score = 100) => {
    try {
      const res = await axios.post(`${API_URL}/progress/update`, { lessonId, completed: true, score });
      if (user) await loadProgress(user.id);
      return res.data;
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };

  useEffect(() => {
    if (BYPASS_SECRET) {
      axios.defaults.headers.common['x-vercel-protection-bypass'] = BYPASS_SECRET;
    }
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`);
      if (response.data.valid) {
        setUser(response.data.user);
        if (response.data.trial) setTrial(response.data.trial);
        loadProgress(response.data.user.id);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { correo, password });
      const { token: newToken, user: userData, trial: trialData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      if (trialData) setTrial(trialData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      if (userData?.id) loadProgress(userData.id);
      return { success: true, user: userData, trial: trialData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error de autenticación' };
    }
  };

  const register = async (datos) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, datos);
      const { token: newToken, user: userData, trial: trialData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      if (trialData) setTrial(trialData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      if (userData?.id) loadProgress(userData.id);
      return { success: true, user: userData, trial: trialData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error de registro' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_progress');
    setToken(null);
    setUser(null);
    setTrial(null);
    setProgress(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, trial, loading, login, register, logout, isAuthenticated: !!token && !!user, progress, updateUserProgress, loadProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
