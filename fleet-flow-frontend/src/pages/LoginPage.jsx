import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <div className="auth-card__logo">🚛</div>
          <h1 className="auth-card__title">FleetFlow</h1>
          <p className="auth-card__subtitle">Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label className="auth-form__label">Email</label>
            <input
              className="auth-form__input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Password</label>
            <input
              className="auth-form__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-form__error">{error}</div>}

          <button
            className={`auth-form__submit ${loading ? "auth-form__submit--loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            Sign In
          </button>
        </form>

        <div className="auth-card__footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-card__link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
