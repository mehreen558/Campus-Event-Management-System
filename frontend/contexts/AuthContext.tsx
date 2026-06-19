'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI } from '@/utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: any;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Verify token is valid by making a simple request
        const profileResponse = await userAPI.getProfile();
        if (profileResponse.data && profileResponse.data.length > 0) {
          setUser({
            id: profileResponse.data[0].user,
            username: 'admin', // You might want to get this from user endpoint
            email: '',
            first_name: '',
            last_name: '',
            profile: profileResponse.data[0]
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user profile after login
      const profileResponse = await userAPI.getProfile();
      if (profileResponse.data && profileResponse.data.length > 0) {
        setUser({
          id: profileResponse.data[0].user,
          username,
          email: '',
          first_name: '',
          last_name: '',
          profile: profileResponse.data[0]
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};