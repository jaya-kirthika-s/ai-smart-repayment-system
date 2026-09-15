import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
import API_BASE_URL from "./config";

const FileUpload = ({ d, setx, r, setdetails }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
      setIsError(false);
    }
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage("Please select a valid CSV file to upload.");
      setIsError(true);
      return;
    }

    setUploading(true);
    setMessage("");
    setIsError(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reason", d);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      setdetails(response.data.message);
      setx(r);
    } catch (error) {
      setUploading(false);
      setIsError(true);
      setMessage("File upload failed. Please ensure the backend server is running.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
      <div className="glass-panel p-4 p-md-5">
        <div className="upload-dropzone mb-4">
          <input
            type="file"
            accept=".csv"
            className="file-hidden-input"
            onChange={onFileChange}
          />
          <div className="upload-icon-circle">
            <span>☁️</span>
          </div>

          <h5 style={{ fontWeight: "700", marginBottom: "6px" }}>
            {file ? "File Ready for Ingestion" : "Click or Drag & Drop File"}
          </h5>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>
            Accepted format: Standard comma-separated values (<strong>.csv</strong>)
          </p>

          {file ? (
            <div className="file-selected-chip">
              <span>📄</span>
              <span>{file.name}</span>
              <small style={{ color: "rgba(255,255,255,0.7)" }}>
                ({(file.size / 1024).toFixed(1)} KB)
              </small>
            </div>
          ) : (
            <span className="glow-badge glow-badge-primary">
              Browse Local Storage
            </span>
          )}
        </div>

        <button
          className="btn btn-gradient-primary w-100 py-3"
          onClick={onFileUpload}
          disabled={uploading || !file}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Ingesting & Extracting Features...
            </>
          ) : (
            <>
              <span>⚡</span> Ingest & Process Telemetry →
            </>
          )}
        </button>

        {message && (
          <div
            className={`alert mt-3 py-2 px-3 text-center ${
              isError ? "alert-danger" : "alert-info"
            }`}
            style={{
              borderRadius: "10px",
              fontSize: "0.88rem",
              background: isError
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(6, 182, 212, 0.15)",
              border: `1px solid ${
                isError ? "rgba(239, 68, 68, 0.3)" : "rgba(6, 182, 212, 0.3)"
              }`,
              color: isError ? "#fca5a5" : "#67e8f9",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
