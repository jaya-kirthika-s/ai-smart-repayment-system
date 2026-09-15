import React, { useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import LoanDetails from "./Loandetails";
import API_BASE_URL from "./config";

const Next = () => {
  const [user, setuser] = useState("");
  const [loanData, setloanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (uid) => {
    const queryId = uid || user;
    if (!queryId) return;

    setLoading(true);
    setSearched(true);
    axios
      .post(`${API_BASE_URL}/viewuser`, { uid: queryId })
      .then((res) => {
        setloanData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error retrieving user loan data:", err);
        setLoading(false);
      });
  };

  return (
    <div className="app-shell">
      <Nav />

      <main className="app-main-content">
        <div className="mb-4">
          <span className="glow-badge glow-badge-primary mb-2">
            Historical Portfolio & Servicing Console
          </span>
          <h2 style={{ fontWeight: "800", margin: 0 }} className="text-gradient">
            Borrower Loan History & Punctuality Analytics
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
            Search customer records by ID to inspect multi-loan performance, on-time ratio, and credit history.
          </p>
        </div>

        {/* Search Panel */}
        <div className="glass-panel p-4 mb-4" style={{ maxWidth: "850px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)", marginBottom: "8px" }}>
            Search Customer ID
          </label>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="d-flex gap-2 flex-wrap"
          >
            <div className="flex-grow-1" style={{ minWidth: "240px" }}>
              <input
                type="text"
                value={user}
                onChange={(e) => setuser(e.target.value)}
                className="form-control glass-input"
                placeholder="Enter Customer ID, e.g. Cus20001 or Cus0001"
              />
            </div>
            <button
              type="submit"
              className="btn btn-gradient-primary px-4"
              disabled={loading || !user}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Searching...
                </>
              ) : (
                <>Search Records 🔍</>
              )}
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>
              Quick Test Profiles:
            </span>
            {["Cus20001", "Cus0001", "Cus0002"].map((chipId) => (
              <button
                key={chipId}
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setuser(chipId);
                  handleSearch(chipId);
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#38bdf8",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  padding: "2px 10px",
                }}
              >
                {chipId}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loanData && loanData.length > 0 ? (
          <LoanDetails loanData={loanData} />
        ) : searched && !loading ? (
          <div className="glass-panel p-5 text-center" style={{ maxWidth: "850px" }}>
            <span style={{ fontSize: "2.5rem" }}>📂</span>
            <h5 style={{ fontWeight: "700", marginTop: "12px", color: "#f8fafc" }}>
              No Active Records Found for "{user}"
            </h5>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Ensure the customer profile and loan data have been ingested via the Underwriting module.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Next;
