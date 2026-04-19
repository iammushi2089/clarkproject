// frontend/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import API from '../api/axios';

// 1. Define the shape of our User data based on the backend model
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  profilePic?: string;
  bio?: string;
}

// 2. Define the shape of our Context Provider
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

// Initialize context as undefined to force usage within the Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Lazy initialize loading state: only set to true if a token actually exists in storage
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook with built-in safety check
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};