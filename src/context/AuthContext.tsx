import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "../types";
import { loginUser, registerUser } from "../services/services";
import { getErrorMessage } from "../services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string; email: string; password: string; confirmPassword: string;
    college?: string; course?: string; graduationYear?: number;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sih_user");
    const token = localStorage.getItem("sih_token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("sih_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem("sih_token", token);
      localStorage.setItem("sih_user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }, []);

  const register = useCallback(async (payload: {
    name: string; email: string; password: string; confirmPassword: string;
    college?: string; course?: string; graduationYear?: number;
  }) => {
    try {
      const { token, user } = await registerUser(payload);
      localStorage.setItem("sih_token", token);
      localStorage.setItem("sih_user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sih_token");
    localStorage.removeItem("sih_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
