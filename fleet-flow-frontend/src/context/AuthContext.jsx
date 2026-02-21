import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setUser({ email: storedEmail, role: storedRole });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: newToken, email: userEmail, role: userRole } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("role", userRole);
      localStorage.setItem("email", userEmail);

      setToken(newToken);
      setRole(userRole);
      setUser({ email: userEmail, role: userRole });

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, userRole) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        fullName,
        role: userRole,
      });
      const { token: newToken, email: userEmail, role: resRole } = res.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("role", resRole);
      localStorage.setItem("email", userEmail);

      setToken(newToken);
      setRole(resRole);
      setUser({ email: userEmail, role: resRole });

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
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
