import React, { useState } from "react";

const XaiExplanationCard = ({ xaiData }) => {
  const [filter, setFilter] = useState("all");

  if (!xaiData || !xaiData.factors || xaiData.factors.length === 0) {
    return null;
  }

  const factors = xaiData.factors;
  const positiveFactors = factors.filter((f) => f.direction === "positive");
  const negativeFactors = factors.filter((f) => f.direction === "negative");

  const displayedFactors =
    filter === "positive"
      ? positiveFactors
      : filter === "negative"
      ? negativeFactors
      : factors;

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.3rem" }}>🧠</span>
            <h4 style={{ margin: 0, fontWeight: "800" }} className="text-gradient">
              Explainable AI (XAI) Decision Audit
            </h4>
          </div>
          <small style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            SHAP TreeExplainer feature attributions explaining the model's credit decision
          </small>
        </div>

        {/* Filter Pills */}
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${
              filter === "all"
                ? "btn-light text-dark fw-bold"
                : "btn-outline-secondary text-light"
            }`}
            onClick={() => setFilter("all")}
            style={{ borderRadius: "8px 0 0 8px", fontSize: "0.8rem", padding: "6px 14px" }}
          >
            All Factors ({factors.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filter === "positive"
                ? "btn-success text-white fw-bold"
                : "btn-outline-secondary text-light"
            }`}
            onClick={() => setFilter("positive")}
            style={{ fontSize: "0.8rem", padding: "6px 14px" }}
          >
            Positive ({positiveFactors.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              filter === "negative"
                ? "btn-danger text-white fw-bold"
                : "btn-outline-secondary text-light"
            }`}
            onClick={() => setFilter("negative")}
            style={{ borderRadius: "0 8px 8px 0", fontSize: "0.8rem", padding: "6px 14px" }}
          >
            Risk Drivers ({negativeFactors.length})
          </button>
        </div>
      </div>

      {/* Grid of Factors */}
      <div className="row g-3">
        {displayedFactors.map((factor, idx) => {
          const isPos = factor.direction === "positive";
          const barColor = isPos ? "#10b981" : "#ef4444";
          const cardBg = isPos
            ? "rgba(16, 185, 129, 0.05)"
            : "rgba(239, 68, 68, 0.05)";
          const borderStyle = isPos
            ? "1px solid rgba(16, 185, 129, 0.25)"
            : "1px solid rgba(239, 68, 68, 0.25)";
          const absImpact = Math.abs(factor.impact_pct);

          return (
            <div key={idx} className="col-md-6">
              <div
                className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between"
                style={{
                  background: cardBg,
                  border: borderStyle,
                  transition: "all 0.2s ease",
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#f8fafc" }}>
                      {factor.label}
                    </span>
                    <span
                      className={`glow-badge ${
                        isPos ? "glow-badge-success" : "glow-badge-danger"
                      }`}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {isPos ? `+${absImpact}% Approval` : `-${absImpact}% Risk`}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>Observed Value:</strong>{" "}
                    <span style={{ color: "#38bdf8", fontWeight: "600" }}>
                      {factor.actual_value} {factor.unit}
                    </span>
                  </div>

                  {/* Impact Meter */}
                  <div
                    className="progress mb-2"
                    style={{
                      height: "6px",
                      background: "rgba(15, 23, 42, 0.6)",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.min(absImpact * 2, 100)}%`,
                        backgroundColor: barColor,
                        boxShadow: `0 0 8px ${barColor}`,
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.4",
                      marginBottom: "8px",
                    }}
                  >
                    {factor.explanation}
                  </p>
                </div>

                {factor.recommendation && (
                  <div
                    style={{
                      paddingTop: "8px",
                      borderTop: "1px dashed rgba(255, 255, 255, 0.08)",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    💡 <span style={{ color: "#94a3b8" }}>Tip:</span> {factor.recommendation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default XaiExplanationCard;
