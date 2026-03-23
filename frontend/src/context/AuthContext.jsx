import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Listen for custom expiration event from axios interceptor
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData, token: jwt } = response.data;
    
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    const { user: userData, token: jwt } = response.data;

    setToken(jwt);
    setUser(userData);
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isEmployer: user?.role === 'employer',
    isCandidate: user?.role === 'candidate'
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-dark-bg text-dark-text">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
