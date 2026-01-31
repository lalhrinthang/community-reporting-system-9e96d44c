import { useState, useCallback } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
}

// Demo credentials for MVP
const DEMO_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
    return { isAuthenticated: false, user: null };
  });

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      const newState = { isAuthenticated: true, user: { username } };
      setAuthState(newState);
      localStorage.setItem("auth", JSON.stringify(newState));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem("auth");
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout,
  };
};
