import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL || '/api';
const BYPASS_SECRET = process.env.REACT_APP_VERCEL_BYPASS || 'nasser_group_bypass_key';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.headers.common['x-vercel-protection-bypass'] = BYPASS_SECRET;
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
      return { success: true, user: userData, trial: trialData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error de autenticacion' };
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
      return { success: true, user: userData, trial: trialData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error de registro' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTrial(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, trial, loading, login, register, logout, isAuthenticated: !!token && !!user }}>
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
