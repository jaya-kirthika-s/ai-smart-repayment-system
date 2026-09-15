import React from "react";

const RiskBadge = ({ riskTier, defaultProb, approvalProb }) => {
  const isLow = riskTier === "Low Risk";
  const isMod = riskTier === "Moderate Risk";

  const badgeColor = isLow ? "#10b981" : isMod ? "#f59e0b" : "#ef4444";
  const badgeClass = isLow ? "glow-badge-success" : isMod ? "glow-badge-warning" : "glow-badge-danger";

  return (
    <div
      className="glass-panel p-4 mb-4"
      style={{
        borderLeft: `4px solid ${badgeColor}`,
        boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${badgeColor}20`,
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-25">
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--text-muted)", fontWeight: "700" }}>
            Autonomous Underwriting Model Assessment
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontWeight: "800", color: "#ffffff" }}>
            {riskTier || "Assessed Profile"}
          </h3>
        </div>

        <div>
          <span className={`glow-badge ${badgeClass}`} style={{ fontSize: "0.85rem", padding: "6px 16px" }}>
            {isLow ? "✓ Prime Tier Borrower" : isMod ? "⚠ Monitored Credit Facility" : "✕ High Default Probability"}
          </span>
        </div>
      </div>

      <div className="row g-3 text-center mb-3">
        <div className="col-6">
          <div
            className="p-3 rounded-3"
            style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}
          >
            <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: "700", letterSpacing: "0.5px" }}>
              MODEL APPROVAL CONFIDENCE
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981", marginTop: "2px" }}>
              {approvalProb !== undefined ? `${approvalProb}%` : "95.0%"}
            </div>
          </div>
        </div>

        <div className="col-6">
          <div
            className="p-3 rounded-3"
            style={{ background: `${badgeColor}15`, border: `1px solid ${badgeColor}35` }}
          >
            <div style={{ fontSize: "0.75rem", color: badgeColor, fontWeight: "700", letterSpacing: "0.5px" }}>
              PROBABILITY OF DEFAULT (PD)
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: badgeColor, marginTop: "2px" }}>
              {defaultProb !== undefined ? `${defaultProb}%` : "5.0%"}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Progress Meter */}
      <div className="progress" style={{ height: "8px", background: "rgba(15, 23, 42, 0.8)", borderRadius: "6px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${approvalProb || 95}%`, background: "linear-gradient(90deg, #10b981, #059669)" }}
          title={`Approval Probability: ${approvalProb}%`}
        />
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${defaultProb || 5}%`, background: "linear-gradient(90deg, #f87171, #ef4444)" }}
          title={`Default Risk: ${defaultProb}%`}
        />
      </div>
      <div className="d-flex justify-content-between mt-2" style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>
        <span>Safe Repayment Capacity</span>
        <span>Statistical Risk Exposure</span>
      </div>
    </div>
  );
};

export default RiskBadge;
