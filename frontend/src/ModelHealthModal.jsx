import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config";

const ModelHealthModal = ({ show, onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/model-metrics`)
        .then((res) => {
          setMetrics(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching model metrics:", err);
          setLoading(false);
        });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary border-opacity-25"
          style={{ background: "rgba(15, 23, 42, 0.8)" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              ⚡
            </div>
            <div>
              <h5 className="mb-0 text-gradient" style={{ fontWeight: "800" }}>
                AI Model Observability & Health Telemetry
              </h5>
              <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Active Production Inference Pipeline Status
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
          />
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
                Loading model metadata from disk...
              </p>
            </div>
          ) : metrics ? (
            <div>
              {/* Architecture Banner */}
              <div
                className="p-3 mb-4 rounded-3"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="row g-2 align-items-center">
                  <div className="col-sm-6">
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                      ACTIVE MODEL
                    </span>
                    <div style={{ fontWeight: "700", color: "#f8fafc", fontSize: "0.95rem" }}>
                      {metrics.model_name}
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                      VERSION
                    </span>
                    <div>
                      <span className="glow-badge glow-badge-primary">
                        v{metrics.version}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                      RETRAINED
                    </span>
                    <div style={{ fontWeight: "600", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                      {metrics.training_date?.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Metrics Grid */}
              <h6 style={{ fontWeight: "700", marginBottom: "12px" }}>
                Generalization & Validation Benchmarks
              </h6>
              <div className="row g-3 text-center mb-4">
                <div className="col-3">
                  <div className="p-3 rounded-3" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: "700" }}>ACCURACY</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#10b981" }}>
                      {((metrics.metrics?.accuracy || 1.0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3" style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#a5b4fc", fontWeight: "700" }}>ROC-AUC</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#818cf8" }}>
                      {(metrics.metrics?.roc_auc || 1.0).toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3" style={{ background: "rgba(6, 182, 212, 0.08)", border: "1px solid rgba(6, 182, 212, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#67e8f9", fontWeight: "700" }}>PRECISION</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#06b6d4" }}>
                      {((metrics.metrics?.test_precision_eligible || 1.0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3" style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#fcd34d", fontWeight: "700" }}>RECALL</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#f59e0b" }}>
                      {((metrics.metrics?.test_recall_eligible || 1.0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Importances */}
              {metrics.feature_importances && (
                <div>
                  <h6 style={{ fontWeight: "700", marginBottom: "12px" }}>
                    Global Feature Attribution Ranking (Gini Impurity)
                  </h6>
                  <div
                    className="p-3 rounded-3"
                    style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
                  >
                    {Object.entries(metrics.feature_importances)
                      .sort(([, a], [, b]) => b - a)
                      .map(([feat, imp], i) => {
                        const pct = (imp * 100).toFixed(1);
                        return (
                          <div key={i} className="mb-2">
                            <div className="d-flex justify-content-between" style={{ fontSize: "0.82rem", marginBottom: "3px" }}>
                              <span style={{ color: "#f8fafc", fontWeight: "600" }}>{feat}</span>
                              <span style={{ color: "#38bdf8", fontWeight: "700" }}>{pct}%</span>
                            </div>
                            <div className="progress" style={{ height: "6px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "3px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${Math.max(pct, 2)}%`,
                                  background:
                                    i === 0
                                      ? "linear-gradient(90deg, #6366f1, #06b6d4)"
                                      : i === 1
                                      ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                                      : "rgba(148, 163, 184, 0.4)",
                                  boxShadow: i < 2 ? "0 0 8px rgba(99, 102, 241, 0.5)" : "none",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-warning text-center">
              Unable to load model metadata. Please ensure backend server is running.
            </div>
          )}
        </div>

        <div className="p-3 border-top border-secondary border-opacity-25 text-end" style={{ background: "rgba(15, 23, 42, 0.8)" }}>
          <button type="button" className="btn btn-secondary px-4 btn-sm" onClick={onClose} style={{ borderRadius: "8px" }}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelHealthModal;
