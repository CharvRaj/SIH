import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAssessment = (userData) => {
    if (!userData) return null;
    if (userData.role === 'hr' || userData.role === 'admin') {
      return { ...userData, hasCompletedAssessment: true };
    }
    const isCompleted = localStorage.getItem(`mospi-assessment-${userData.email}`) === 'completed' || userData.email === 'rajesh.sharma@mospi.gov.in';
    return { ...userData, hasCompletedAssessment: isCompleted };
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('mospi-access-token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(checkAssessment(res.data.user));
    } catch (err) {
      localStorage.removeItem('mospi-access-token');
      localStorage.removeItem('mospi-refresh-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.accessToken || res.data.token || 'demo-token';
      const refreshToken = res.data.refreshToken || token;
      localStorage.setItem('mospi-access-token', token);
      localStorage.setItem('mospi-refresh-token', refreshToken);
      const enrichedUser = checkAssessment(res.data.user);
      setUser(enrichedUser);
      return { ...res.data, user: enrichedUser };
    } catch (err) {
      // If server is not running, provide demo credentials fallback
      if (!err.response || err.code === 'ERR_NETWORK') {
        let demoUser = {
          name: 'Shri Rajesh Sharma',
          email: email || 'rajesh.sharma@mospi.gov.in',
          role: 'employee',
          department: 'Field Operations Division (FOD)',
          designation: 'Senior Statistical Officer (SSO)',
          employeeId: 'EMP-2024-089'
        };
        if (email.includes('admin')) {
          demoUser = {
            name: 'Dr. Alok Verma',
            email: 'admin@mospi.gov.in',
            role: 'admin',
            department: 'Administration',
            designation: 'Super Administrator',
            employeeId: 'ADM-2020-001'
          };
        } else if (email.includes('hr')) {
          demoUser = {
            name: 'Smt. Sunita Rao',
            email: 'hr@mospi.gov.in',
            role: 'hr',
            department: 'Training Division (NASA)',
            designation: 'Director (Training)',
            employeeId: 'HR-2018-042'
          };
        }
        localStorage.setItem('mospi-access-token', 'mock-token-2026');
        localStorage.setItem('mospi-refresh-token', 'mock-refresh-token-2026');
        setUser(demoUser);
        return { success: true, user: demoUser, token: 'mock-token-2026' };
      }
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (data) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', data);
      const token = res.data.accessToken || res.data.token || 'mock-token-2026';
      localStorage.setItem('mospi-access-token', token);
      localStorage.setItem('mospi-refresh-token', token);
      const enrichedUser = checkAssessment(res.data.user);
      setUser(enrichedUser);
      return { ...res.data, user: enrichedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('mospi-access-token');
      localStorage.removeItem('mospi-refresh-token');
      setUser(null);
    }
  }, []);

  const forgotPassword = async (email) => {
    setError(null);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (token, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const completeAssessment = (results) => {
    if (!user) return;
    localStorage.setItem(`mospi-assessment-${user.email}`, 'completed');
    if (results) {
      localStorage.setItem(`mospi-assessment-result-${user.email}`, JSON.stringify(results));
    }
    setUser(prev => ({
      ...prev,
      hasCompletedAssessment: true,
      lastAssessmentResult: results || prev?.lastAssessmentResult
    }));
  };

  const isAuthenticated = !!user;
  const isEmployee = user?.role === 'employee';
  const isHR = user?.role === 'hr';
  const isAdmin = user?.role === 'admin';
  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider value={{
      user, loading, error, isAuthenticated, isEmployee, isHR, isAdmin,
      hasRole, login, register, logout, forgotPassword, resetPassword,
      updateProfile, completeAssessment, loadUser, setError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
