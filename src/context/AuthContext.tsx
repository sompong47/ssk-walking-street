'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  role: 'user' | 'admin' | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (user: User, role: 'user'|'admin') => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // เช็คสถานะตอนโหลดเว็บครั้งแรก
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) {
          setUser(data.user);
          setRole(data.role);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData: User, userRole: 'user'|'admin') => {
    setUser(userData);
    setRole(userRole);
    setShowLoginModal(false);
  };

  const logout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
    setRole(null);
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn: !!user, loading, login, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);