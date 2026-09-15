import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ModelHealthModal from "./ModelHealthModal";

const Nav = () => {
  const [showHealthModal, setShowHealthModal] = useState(false);
  const role = window.localStorage.getItem("role") || "admin";

  return (
    <>
      <aside
        style={{
          width: "260px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: "rgba(11, 15, 25, 0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          padding: "24px 18px",
        }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
            }}
          >
            ⚡
          </div>
          <div>
            <h5
              style={{
                fontWeight: "800",
                margin: 0,
                fontSize: "1.15rem",
                letterSpacing: "-0.5px",
              }}
              className="text-gradient"
            >
              SmartRepay AI
            </h5>
            <small style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: "600" }}>
              CREDIT RISK PLATFORM
            </small>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow-1">
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--text-muted)",
              marginBottom: "12px",
              paddingLeft: "10px",
            }}
          >
            Core Modules
          </div>

          <ul className="nav flex-column gap-2 mb-4">
            <li className="nav-item">
              <NavLink
                to="/checkuser"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
                    isActive
                      ? "text-white fw-bold"
                      : "text-secondary hover-text-white"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.08) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99, 102, 241, 0.4)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  fontSize: "0.9rem",
                })}
              >
                <span>🔍</span>
                <span>Underwriting & XAI</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/next"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
                    isActive
                      ? "text-white fw-bold"
                      : "text-secondary hover-text-white"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.08) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99, 102, 241, 0.4)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  fontSize: "0.9rem",
                })}
              >
                <span>📊</span>
                <span>Historical Analytics</span>
              </NavLink>
            </li>
          </ul>

          {/* Model Status Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              marginBottom: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                PIPELINE STATUS
              </span>
              <span className="glow-badge glow-badge-success" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                ● Active v1.2
              </span>
            </div>

            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f8fafc", marginBottom: "4px" }}>
              Random Forest + SHAP
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
              Accuracy: 100% | ROC: 1.00
            </div>

            <button
              className="btn w-100 btn-sm"
              onClick={() => setShowHealthModal(true)}
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                color: "#a5b4fc",
                fontWeight: "600",
                borderRadius: "8px",
                fontSize: "0.78rem",
                padding: "6px 10px",
              }}
            >
              Inspect Model Metrics ⚡
            </button>
          </div>
        </div>

        {/* User Session Footer */}
        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#1e293b",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
              }}
            >
              👤
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#f8fafc" }}>
                Administrator
              </div>
              <small style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: "700" }}>
                {role.toUpperCase()}
              </small>
            </div>
          </div>

          <NavLink
            to="/"
            className="btn btn-sm btn-outline-danger"
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
            title="Logout"
          >
            Logout
          </NavLink>
        </div>
      </aside>

      <ModelHealthModal
        show={showHealthModal}
        onClose={() => setShowHealthModal(false)}
      />
    </>
  );
};

export default Nav;
