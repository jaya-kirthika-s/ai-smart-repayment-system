import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import Nav from "./Nav";
import RiskBadge from "./RiskBadge";
import XaiExplanationCard from "./XaiExplanationCard";
import API_BASE_URL from "./config";

const Checkuser = () => {
  const [x, setx] = useState(0);
  const [details, setdetails] = useState("");
  const [user, setuser] = useState([]);
  const [user1, setuser1] = useState([]);
  const [d, setd] = useState(""); // Extra payment value
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!details) return;
    setDownloading(true);
    try {
      const selectedPlan =
        user && user.length > 0 ? user : details.plans ? details.plans[0] : null;

      const response = await axios.post(
        `${API_BASE_URL}/download-sanction-letter`,
        {
          customer_summary: details.customer_summary || {},
          decision_data: details,
          selected_plan: selectedPlan,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const custId = details.customer_summary?.customerid || "CUS";
      link.setAttribute("download", `Loan_Sanction_Letter_${custId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (error) {
      console.error("Failed to download PDF sanction letter:", error);
      alert("Error generating PDF sanction letter. Please ensure the backend is running.");
      setDownloading(false);
    }
  };

  const calculateUpdatedEMI = (plan, extraPayment) => {
    const tenure = plan[0];
    const emi = plan[1];
    const totalInterest = plan[2];
    const totalPayment = plan[3];

    let remainingTenure = tenure;
    let adjustedInterest = totalInterest;
    let adjustedPayment = totalPayment;

    if (extraPayment && extraPayment > 0) {
      const yearlyEMI = emi * 12;
      const totalExtraPayment = extraPayment;

      adjustedInterest = totalInterest - totalExtraPayment * (remainingTenure / 12);
      adjustedPayment = totalPayment - totalExtraPayment;
      remainingTenure -= Math.floor(totalExtraPayment / yearlyEMI);
    }

    return {
      remainingTenure,
      adjustedInterest,
      adjustedPayment,
    };
  };

  const handleExtraPayment = () => {
    if (!d || d <= 0) return;
    const activePlan =
      user && user.length > 0 ? user : details.plans ? details.plans[0] : null;
    if (!activePlan) return;

    const updatedUserPlan = calculateUpdatedEMI(activePlan, d);
    setuser1([
      activePlan[0],
      activePlan[1],
      updatedUserPlan.adjustedInterest.toFixed(2),
      updatedUserPlan.adjustedPayment.toFixed(2),
    ]);
  };

  return (
    <div className="app-shell">
      <Nav />

      <main className="app-main-content">
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <span className="glow-badge glow-badge-primary mb-2">
              Autonomous Underwriting Module
            </span>
            <h2 style={{ fontWeight: "800", margin: 0 }} className="text-gradient">
              AI Credit Appraisal & Smart Repayment Engine
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
              Upload customer profile & historical loan transactions to compute ML eligibility and XAI telemetry.
            </p>
          </div>

          {x === 2 && (
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
              style={{
                borderRadius: "10px",
                padding: "8px 16px",
                borderColor: "rgba(255,255,255,0.15)",
                color: "#f8fafc",
              }}
              onClick={() => {
                setx(0);
                setdetails("");
                setuser([]);
                setuser1([]);
              }}
            >
              <span>🔄</span> Assess Another Borrower
            </button>
          )}
        </div>

        {/* Stepper Header */}
        <div
          className="glass-panel p-3 mb-4 d-flex justify-content-around align-items-center"
          style={{ maxWidth: "800px", margin: "0 auto 30px auto" }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: x >= 0 ? "var(--primary)" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.85rem",
                boxShadow: x >= 0 ? "0 0 12px var(--primary-glow)" : "none",
              }}
            >
              1
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: "600", color: x >= 0 ? "#ffffff" : "var(--text-muted)" }}>
              Customer Profile
            </span>
          </div>

          <div style={{ width: "60px", height: "2px", background: x >= 1 ? "var(--primary)" : "rgba(255,255,255,0.1)" }} />

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: x >= 1 ? "var(--primary)" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.85rem",
                boxShadow: x >= 1 ? "0 0 12px var(--primary-glow)" : "none",
              }}
            >
              2
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: "600", color: x >= 1 ? "#ffffff" : "var(--text-muted)" }}>
              Loan Records
            </span>
          </div>

          <div style={{ width: "60px", height: "2px", background: x === 2 ? "var(--success)" : "rgba(255,255,255,0.1)" }} />

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: x === 2 ? "var(--success)" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.85rem",
                boxShadow: x === 2 ? "0 0 12px var(--success-glow)" : "none",
              }}
            >
              3
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: "600", color: x === 2 ? "#ffffff" : "var(--text-muted)" }}>
              AI Appraisal & Terms
            </span>
          </div>
        </div>

        {/* Step 0: Upload Profile */}
        {x === 0 && (
          <div className="py-3">
            <div className="text-center mb-4">
              <h4 style={{ fontWeight: "700" }}>Upload Customer Demographic & Bureau Profile</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Select customer baseline file containing Monthly Income, Expenses, and Credit Bureau Score.
              </p>
            </div>
            <FileUpload d={"first"} setx={setx} r={1} setdetails={setdetails} />
          </div>
        )}

        {/* Step 1: Upload Loan History */}
        {x === 1 && (
          <div className="py-3">
            <div className="text-center mb-4">
              <h4 style={{ fontWeight: "700" }}>Upload Historical Loan Transactions</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Select past loan records containing installment timelines, on-time vs off-time payments, and active EMI load.
              </p>
            </div>
            <FileUpload d={"second"} setx={setx} r={2} setdetails={setdetails} />
          </div>
        )}

        {/* Step 2: Appraisal & Repayment Results */}
        {x === 2 && details && (
          <div>
            {/* Risk Badge Module */}
            <RiskBadge
              riskTier={details.risk_tier}
              defaultProb={details.default_probability}
              approvalProb={details.approval_probability}
            />

            {/* XAI Attribution Module */}
            {details.xai && <XaiExplanationCard xaiData={details.xai} />}

            {/* Approved Facility */}
            {details.eligibility_status === "Eligible" ? (
              <div className="glass-panel p-4 mb-4">
                {/* Banner */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-4 mb-4 border-bottom border-secondary border-opacity-25">
                  <div>
                    <span className="glow-badge glow-badge-success mb-2">
                      FACILITY SANCTION APPROVED
                    </span>
                    <h2 style={{ fontWeight: "800", margin: 0, color: "#ffffff" }}>
                      Sanctioned Limit:{" "}
                      <span style={{ color: "var(--success)" }}>
                        INR {details.loanamount?.toLocaleString()}
                      </span>
                    </h2>
                    <small style={{ color: "var(--text-secondary)" }}>
                      Safe borrowing ceiling calculated at 30% DTI margin over 60 months
                    </small>
                  </div>

                  <button
                    className="btn btn-gradient-success py-3 px-4"
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Generating Official PDF...
                      </>
                    ) : (
                      <>
                        <span>📄</span> Download Official Sanction Letter (PDF)
                      </>
                    )}
                  </button>
                </div>

                {/* Adaptive Repayment Matrix */}
                <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 style={{ fontWeight: "700", margin: 0 }}>
                        📊 Adaptive Repayment Options (Risk-Adjusted Matrix)
                      </h5>
                      <small style={{ color: "var(--text-secondary)" }}>
                        Select your preferred tenure to calibrate monthly cash flow:
                      </small>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle text-center mb-0" style={{ borderRadius: "12px", overflow: "hidden", background: "rgba(15, 23, 42, 0.6)" }}>
                      <thead>
                        <tr style={{ background: "rgba(30, 41, 59, 0.9)", color: "var(--text-secondary)", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          <th className="py-3">Tenure</th>
                          <th className="py-3">Monthly EMI</th>
                          <th className="py-3">Total Interest</th>
                          <th className="py-3">Total Payable</th>
                          <th className="py-3">Selection</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.plans?.map((d, index) => {
                          const isSelected = user && user[0] === d[0];
                          return (
                            <tr
                              key={index}
                              style={{
                                background: isSelected ? "rgba(99, 102, 241, 0.2)" : "transparent",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <td style={{ fontWeight: "700", color: "#ffffff" }}>
                                <span className="glow-badge glow-badge-primary">
                                  {d[0]} Months
                                </span>
                              </td>
                              <td style={{ fontWeight: "800", color: "#38bdf8", fontSize: "1.05rem" }}>
                                ₹{d[1]?.toLocaleString()}
                              </td>
                              <td style={{ color: "#fbbf24", fontWeight: "600" }}>
                                ₹{d[2]?.toLocaleString()}
                              </td>
                              <td style={{ fontWeight: "700", color: "#f8fafc" }}>
                                ₹{d[3]?.toLocaleString()}
                              </td>
                              <td>
                                <button
                                  className={`btn btn-sm ${
                                    isSelected
                                      ? "btn-gradient-success"
                                      : "btn-outline-primary text-light"
                                  }`}
                                  style={{ borderRadius: "8px", padding: "6px 14px", fontSize: "0.8rem" }}
                                  onClick={() => {
                                    setuser(d);
                                    setuser1([]);
                                  }}
                                >
                                  {isSelected ? "✓ Active Plan" : "Select"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prepayment Optimizer */}
                <div
                  className="p-4 rounded-3"
                  style={{
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: "1.2rem" }}>💰</span>
                    <h5 style={{ fontWeight: "700", margin: 0 }} className="text-gradient">
                      Smart Prepayment & Accelerated Debt Freedom Simulator
                    </h5>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "16px" }}>
                    Simulate how allocating annual bonuses or lump-sum repayments slashes total interest:
                  </p>

                  <div className="row g-3 align-items-center mb-4">
                    <div className="col-md-5">
                      <input
                        type="number"
                        className="form-control glass-input"
                        placeholder="Enter extra annual payment (INR), e.g. 50000"
                        value={d}
                        onChange={(e) => setd(parseInt(e.target.value) || "")}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-gradient-primary w-100"
                        onClick={handleExtraPayment}
                      >
                        Calculate Savings ⚡
                      </button>
                    </div>
                  </div>

                  {user && user.length > 0 && (
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 h-100" style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <small style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: "700" }}>
                            SELECTED SCHEDULE
                          </small>
                          <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#f8fafc", marginTop: "4px" }}>
                            {user[0]} Months @ ₹{user[1]} / mo
                          </div>
                          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Total Interest: ₹{user[2]}
                          </div>
                        </div>
                      </div>

                      {user1 && user1.length > 0 ? (
                        <>
                          <div className="col-md-4">
                            <div className="p-3 rounded-3 h-100" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                              <small style={{ color: "#34d399", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: "700" }}>
                                OPTIMIZED ACCELERATED SCHEDULE
                              </small>
                              <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#34d399", marginTop: "4px" }}>
                                Total Repayment: ₹{user1[3]}
                              </div>
                              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                                New Total Interest: ₹{user1[2]}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="p-3 rounded-3 h-100 text-center" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)", border: "1px solid rgba(99, 102, 241, 0.35)" }}>
                              <small style={{ color: "#a5b4fc", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: "700" }}>
                                TOTAL INTEREST SAVINGS
                              </small>
                              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#38bdf8", marginTop: "2px" }}>
                                ₹{Math.max(0, Math.round(parseFloat(user[2]) - parseFloat(user1[2]))).toLocaleString()}
                              </div>
                              <span className="glow-badge glow-badge-primary">
                                Reduced Debt Lifetime
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-md-8 d-flex align-items-center p-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                          💡 Enter an extra annual prepayment amount above to view your personalized interest savings!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-5 border-danger border-opacity-50">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span style={{ fontSize: "2rem" }}>❌</span>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#f87171" }}>
                      Credit Facility Not Approved
                    </h3>
                    <small style={{ color: "var(--text-muted)" }}>
                      Adverse Action Notice Generated by Underwriting Model
                    </small>
                  </div>
                </div>

                <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
                  {details.reason ||
                    "Based on historical delinquency metrics, high debt-to-income obligations, or sub-prime bureau indicators, this applicant does not currently meet underwriting approval thresholds."}
                </p>

                <div
                  className="p-3 rounded-3 mt-3"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}
                >
                  <strong style={{ color: "#fca5a5", fontSize: "0.9rem" }}>
                    Adverse Action Advisory:
                  </strong>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                    Please inspect the Explainable AI (XAI) risk drivers above to review the decisive determining factors (e.g. historical missed payments or existing leverage) and see targeted optimization guidance.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkuser;
