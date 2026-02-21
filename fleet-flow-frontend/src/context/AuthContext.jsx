import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  // Sync state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setUser({
        id: storedUserId ? Number(storedUserId) : null,
        email: storedEmail,
        role: storedRole,
      });
    }
  }, []);

  const persistSession = (newToken, userObj) => {
    const userEmail = userObj?.email ?? "";
    const userRole = userObj?.role ?? "";
    const userId = userObj?.id;

    localStorage.setItem("token", newToken);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("role", userRole);
    if (userId !== undefined && userId !== null) {
      localStorage.setItem("userId", String(userId));
    } else {
      localStorage.removeItem("userId");
    }

    setToken(newToken);
    setRole(userRole);
    setUser({ id: userId ?? null, email: userEmail, role: userRole });
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const newToken = res?.data?.token;
      const userObj = res?.data?.user;

      if (typeof newToken !== "string" || newToken.length === 0 || !userObj?.email) {
        return { success: false, error: "Invalid login response from server." };
      }

      persistSession(newToken, userObj);

      return { success: true };
    } catch (err) {
      const message = err.response?.data || "Invalid email or password";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, userRole) => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        email,
        password,
        name,
        role: userRole,
      });

      return { success: true };
    } catch (err) {
      const message = err.response?.data || "Registration failed. Try again.";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
