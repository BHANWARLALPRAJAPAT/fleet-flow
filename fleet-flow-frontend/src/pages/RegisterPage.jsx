import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const ROLES = [
  { value: "MANAGER", label: "Manager" },
  { value: "DISPATCHER", label: "Dispatcher" },
  { value: "SAFETY_OFFICER", label: "Safety Officer" },
  { value: "ANALYST", label: "Analyst" },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await register(email, password, fullName, role);
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
          <p className="auth-card__subtitle">Create your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label className="auth-form__label">Full Name</label>
            <input
              className="auth-form__input"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Email</label>
            <input
              className="auth-form__input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__row">
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

            <div className="auth-form__group">
              <label className="auth-form__label">Confirm</label>
              <input
                className="auth-form__input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label">Role</label>
            <select
              className="auth-form__select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="auth-form__error">{error}</div>}

          <button
            className={`auth-form__submit ${loading ? "auth-form__submit--loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            Create Account
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-card__link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
