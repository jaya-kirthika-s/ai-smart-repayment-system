import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MetricTile = ({ label, value, unit, color }) => (
  <div
    className="p-3 rounded-3"
    style={{
      background: "rgba(15, 23, 42, 0.6)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }}
  >
    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
      {label}
    </div>
    <div style={{ fontSize: "1.15rem", fontWeight: "800", color: color || "#ffffff", marginTop: "2px" }}>
      {value} {unit && <small style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{unit}</small>}
    </div>
  </div>
);

const ProgressBar = ({ completedPeriod, totalPeriod }) => {
  const progress = Math.min(100, Math.round((completedPeriod / totalPeriod) * 100));

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 style={{ fontWeight: "700", margin: 0 }}>
          Repayment Timeline Progress
        </h6>
        <span className="glow-badge glow-badge-primary">
          {progress}% Complete
        </span>
      </div>

      <div
        className="progress"
        style={{
          height: "12px",
          borderRadius: "6px",
          background: "rgba(15, 23, 42, 0.8)",
          overflow: "hidden",
        }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6366f1 0%, #10b981 100%)",
            boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
            transition: "width 0.4s ease-in-out",
          }}
        />
      </div>

      <div className="d-flex justify-content-between mt-2" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
        <span>{completedPeriod} Installments Settled</span>
        <span>{totalPeriod} Total Tenure Months</span>
      </div>
    </div>
  );
};

const PieChart = ({ onTimePayments, offTimePayments }) => {
  const data = {
    labels: ["On-Time Installments", "Delayed / Off-Time"],
    datasets: [
      {
        label: "Payments Count",
        data: [onTimePayments, offTimePayments],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["rgba(16, 185, 129, 0.4)", "rgba(239, 68, 68, 0.4)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="glass-panel p-4 text-center">
      <h6 style={{ fontWeight: "700", marginBottom: "16px" }}>
        Punctuality Ratio Breakdown
      </h6>
      <div style={{ maxWidth: "240px", margin: "0 auto" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

const LoanDetailsComponent = ({ loanData }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    if (loanData && loanData.length > 0) {
      setSelectedLoan(loanData[0]);
    }
  }, [loanData]);

  const handleSelectLoan = (event) => {
    const loanNo = event.target.value;
    const selected = loanData.find((loan) => loan[1] === loanNo);
    setSelectedLoan(selected);
  };

  const calculateCreditScore = (loan) => {
    const onTimePayments = loan[9];
    const offTimePayments = loan[10];
    const totalPayments = onTimePayments + offTimePayments;
    if (totalPayments === 0) return loan[4];

    const scorePercentage = (onTimePayments / totalPayments) * 100;
    return Math.round((scorePercentage / 100) * loan[4]);
  };

  const calculateOverallCreditScore = (loans) => {
    if (!loans || loans.length === 0) return 0;
    const totalCreditScore = loans.reduce(
      (total, loan) => total + calculateCreditScore(loan),
      0
    );
    return Math.round(totalCreditScore / loans.length);
  };

  const overallCreditScore = calculateOverallCreditScore(loanData);
  const completedPeriod = selectedLoan ? selectedLoan[9] + selectedLoan[10] : 0;

  return (
    <div>
      {/* Top Banner: Overall Credit Health */}
      <div
        className="glass-panel p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
        style={{
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: "700" }}>
            Portfolio Multi-Loan Credit Standing
          </span>
          <h3 style={{ margin: "2px 0 0 0", fontWeight: "800" }} className="text-gradient">
            Overall Credit Score: {overallCreditScore} / 900
          </h3>
          <small style={{ color: "var(--text-secondary)" }}>
            Aggregated across {loanData.length} historical credit lines
          </small>
        </div>

        {/* Loan Selector */}
        <div style={{ minWidth: "220px" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "4px" }}>
            SELECT ACTIVE LOAN
          </label>
          <select
            value={selectedLoan ? selectedLoan[1] : ""}
            onChange={handleSelectLoan}
            className="form-select glass-input"
            style={{ padding: "8px 14px", fontSize: "0.88rem" }}
          >
            {loanData.map((loan) => (
              <option key={loan[1]} value={loan[1]} style={{ background: "#0f172a" }}>
                Loan ID: {loan[1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedLoan && (
        <div className="row g-4">
          {/* Left Column: Loan Metric Grid */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                <div>
                  <span className="glow-badge glow-badge-primary mb-1">
                    Facility Details
                  </span>
                  <h5 style={{ fontWeight: "700", margin: 0 }}>
                    Loan Record: {selectedLoan[1]}
                  </h5>
                </div>

                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  Score: {calculateCreditScore(selectedLoan)} pts
                </span>
              </div>

              <div className="row g-3">
                <div className="col-sm-6">
                  <MetricTile label="Borrower ID" value={selectedLoan[0]} color="#38bdf8" />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Monthly Income" value={`₹${parseFloat(selectedLoan[2])?.toLocaleString()}`} />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Monthly Living Expenses" value={`₹${parseFloat(selectedLoan[3])?.toLocaleString()}`} />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Sanctioned Loan Amount" value={`₹${parseFloat(selectedLoan[5])?.toLocaleString()}`} color="#f8fafc" />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Annual Interest Rate" value={`${selectedLoan[6]}%`} color="#fbbf24" />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Tenure Period" value={`${selectedLoan[7]} Months`} />
                </div>
                <div className="col-sm-6">
                  <MetricTile label="Monthly Installment (EMI)" value={`₹${parseFloat(selectedLoan[8])?.toLocaleString()}`} color="#a5b4fc" />
                </div>
                <div className="col-sm-3">
                  <MetricTile label="On-Time Payments" value={selectedLoan[9]} color="#10b981" />
                </div>
                <div className="col-sm-3">
                  <MetricTile label="Off-Time Payments" value={selectedLoan[10]} color="#ef4444" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Charts */}
          <div className="col-lg-5 d-flex flex-column gap-3">
            <ProgressBar
              completedPeriod={completedPeriod}
              totalPeriod={selectedLoan[7]}
            />
            <PieChart
              onTimePayments={selectedLoan[9]}
              offTimePayments={selectedLoan[10]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsComponent;
