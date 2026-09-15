import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .post(`${API_BASE_URL}`, {
        email: email,
        password: password,
      })
      .then((res) => {
        setLoading(false);
        window.localStorage.setItem("role", res.data["role"] || "admin");
        navigate("/checkuser");
      })
      .catch((err) => {
        setLoading(false);
        setError("Invalid credentials. Please verify your email and password.");
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background:
          "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 50%), #0b0f19",
      }}
    >
      <div
        className="glass-panel p-4 p-sm-5"
        style={{
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.15)",
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
              marginBottom: "12px",
            }}
          >
            ⚡
          </div>
          <h3 style={{ fontWeight: "800", margin: 0 }} className="text-gradient">
            SmartRepay AI
          </h3>
          <div className="mt-2">
            <span className="glow-badge glow-badge-primary">
              Enterprise FinTech Platform
            </span>
          </div>
        </div>

        <div className="mb-4 text-center">
          <h4 style={{ fontWeight: "700", marginBottom: "4px", color: "#f8fafc" }}>
            Sign In
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: 0 }}>
            Enter your credentials to access the credit console
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger py-2 px-3 mb-4 d-flex align-items-center gap-2"
            style={{
              borderRadius: "10px",
              fontSize: "0.85rem",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control glass-input"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              style={{
                fontSize: "0.82rem",
                fontWeight: "600",
                color: "var(--text-secondary)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control glass-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-gradient-primary w-100 py-3 mb-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing In...
              </>
            ) : (
              <>Sign In to Console →</>
            )}
          </button>

          <div className="text-center" style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Don't have an underwriter account?{" "}
            <NavLink
              to="/reg"
              style={{
                color: "var(--cyan)",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Register here
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
