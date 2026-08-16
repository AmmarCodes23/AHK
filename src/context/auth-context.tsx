"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

type SessionResponse = {
  isAuth?: boolean;
  role?: string;
  user?: string;
};

type AuthContextValue = {
  auth: boolean;
  role?: string;
  loading: boolean;
  refresh: () => Promise<void>;
  setAuth: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const dataposter = await api.get<SessionResponse>("/getsession");
      const response = dataposter.data;
      setAuth(Boolean(response?.isAuth));
      setRole(response?.role);
    } catch {
      setAuth(false);
      setRole(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  return (
    <AuthContext.Provider value={{ auth, role, loading, refresh, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
