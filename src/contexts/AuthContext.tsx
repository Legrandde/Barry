import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getMe,
  getToken,
  login as apiLogin,
  setToken,
  verify2FA as apiVerify2FA,
  type AdminUser,
} from "../services/adminApi";

export interface LoginResult {
  requires2FA: boolean;
  challengeToken?: string;
}

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  verify2FA: (challengeToken: string, code: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(getToken()));

  const refresh = async () => {
    if (!getToken()) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getMe();
      setAdmin(me);
    } catch {
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    const res = await apiLogin(username, password);
    if (res.requires_2fa && res.challenge_token) {
      return { requires2FA: true, challengeToken: res.challenge_token };
    }
    const me = await getMe();
    setAdmin(me);
    return { requires2FA: false };
  };

  const verify2FA = async (challengeToken: string, code: string): Promise<void> => {
    await apiVerify2FA(challengeToken, code);
    const me = await getMe();
    setAdmin(me);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, verify2FA, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
