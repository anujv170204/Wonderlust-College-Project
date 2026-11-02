import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('staySphereUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading stored user:', err);
      localStorage.removeItem('staySphereUser');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password, role) => {
    const res = await API.post('/auth/login', { email, password, role });
    if (res.data && res.data.data) {
      const userData = res.data.data;
      localStorage.setItem('staySphereUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error('Login failed: Invalid server response.');
  };

  // Register function
  const register = async (name, email, password, role = 'user') => {
    const res = await API.post('/auth/register', { name, email, password, role });
    if (res.data && res.data.data) {
      const userData = res.data.data;
      localStorage.setItem('staySphereUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error('Registration failed: Invalid server response.');
  };


  // Logout function
  const logout = () => {
    localStorage.removeItem('staySphereUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
