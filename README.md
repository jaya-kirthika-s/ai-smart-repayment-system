# 🏦 AI-Driven Smart Repayment Management System

An intelligent, explainable full-stack loan repayment prediction and dynamic EMI rescheduling platform. Powered by **Machine Learning (Scikit-Learn)**, **Explainable AI (XAI)**, **Flask (Python)**, and a modern **React UI**.

---

## 📌 Features

- 🧠 **ML Loan Default & Eligibility Prediction**: Instant creditworthiness evaluation based on historical repayment trends, credit score, expenditure, and EMI metrics.
- 🔍 **Explainable AI (XAI) Engine**: Feature importance breakdowns explaining *why* a customer was approved or placed at risk.
- 📊 **Dynamic Loan Restructuring & Simulation**: Interactive prepayment calculator showing interest savings, tenure reduction, and revised amortization schedules.
- 📄 **Automated PDF Sanction Letter**: Generate downloadable official sanction letters with terms and dynamic repayment schedules.
- 📈 **Model Health & Performance Monitoring**: Live tracking of model accuracy, drift metrics, and evaluation reports.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Chart.js / React-Chartjs-2, Bootstrap 5, Axios, React-Icons
- **Backend API**: Python 3.10+, Flask, Flask-CORS, Gunicorn
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib
- **Database & Storage**: SQLite (`data.db`), ReportLab (PDF generation)

---

## 🚀 How to Run the Project Locally

To run the complete system, you will need **two terminal windows** (one for the Flask Backend and one for the React Frontend).

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)

---

### Step 1: Start the Backend (Flask API)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. *(First time only)* Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python main.py
   ```
   > 🟢 **Backend will start running on**: `http://localhost:5000`

---

### Step 2: Start the Frontend (React Application)

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. *(First time only)* Install the Node dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   > 🌐 **Frontend will automatically launch in your browser at**: `http://localhost:3000`

---

## 📁 Project Structure

```text
├── backend/
│   ├── main.py                  # Flask REST API endpoints & routing
│   ├── xai_engine.py            # Explainable AI & feature attribution logic
│   ├── pdf_service.py           # Loan sanction letter PDF generator
│   ├── requirements.txt         # Python dependencies
│   ├── data.db                  # SQLite database
│   ├── models/                  # Trained ML models & metadata
│   │   ├── eligibility_model.joblib
│   │   ├── scaler.joblib
│   │   └── model_metadata.json
│   └── ml_pipeline/             # Model training scripts
│
├── frontend/
│   ├── package.json             # React dependencies & scripts
│   ├── public/                  # Public assets, icons, HTML template
│   └── src/
│       ├── App.jsx              # Main router & layout
│       ├── Login.jsx            # User authentication
│       ├── Register.jsx         # User registration
│       ├── Checkuser.jsx        # Customer assessment & repayment plans
│       ├── FileUpload.jsx       # CSV batch processing & inference
│       ├── Loandetails.jsx      # Loan breakdown & interactive simulation
│       ├── Next.jsx             # Customer search & loan history
│       ├── ModelHealthModal.jsx # ML model monitoring dashboard
│       ├── RiskBadge.jsx        # Dynamic risk badge component
│       ├── XaiExplanationCard.jsx# Visual explainability cards
│       └── config.js            # Centralized API Base URL configuration
│
└── README.md
```

---

## 🌐 Free Cloud Deployment (For Resume & Portfolio)

| Layer | Recommended Free Host | Setup Summary |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) | Root directory: `frontend` \| Build: `npm run build` \| Set `REACT_APP_API_URL` to backend URL |
| **Backend** | [Render](https://render.com/) / [Koyeb](https://koyeb.com/) | Root directory: `backend` \| Start Command: `gunicorn main:app` |
