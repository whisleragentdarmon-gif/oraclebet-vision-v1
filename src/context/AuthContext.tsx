import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // Check LocalStorage on load to persist session
  useEffect(() => {
    const storedAuth = localStorage.getItem('oracle_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser('whisler69');
    }
  }, []);

  const login = (id: string, pass: string) => {
    // Hardcoded credentials as requested
    if (id === 'whisler69' && pass === 'Charona@19') {
      setIsAuthenticated(true);
      setUser(id);
      localStorage.setItem('oracle_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('oracle_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
