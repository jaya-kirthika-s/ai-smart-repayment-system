# 🏦 AI-Driven Smart Repayment Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-smart-repayment-system.vercel.app/)
[![Backend Status](https://img.shields.io/badge/API_Status-Render-46E3B7?style=for-the-badge&logo=render)](https://ai-smart-repayment-system.onrender.com/health)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit_Learn-Machine_Learning-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

An intelligent, explainable full-stack credit appraisal and loan repayment restructuring platform. Powered by **Random Forest Machine Learning**, **Explainable AI (XAI)**, **Flask (Python)**, and a modern **React UI**.

---

## 🌐 Live Production Deployments

| Component | Cloud Host | Live Endpoint URL |
| :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | [https://ai-smart-repayment-system.vercel.app/](https://ai-smart-repayment-system.vercel.app/) |
| **ML Backend API** | **Render** | [https://ai-smart-repayment-system.onrender.com](https://ai-smart-repayment-system.onrender.com) |
| **API Health Monitor** | **Render** | [https://ai-smart-repayment-system.onrender.com/health](https://ai-smart-repayment-system.onrender.com/health) |

---

## 📌 Core Features

- 🧠 **Machine Learning Credit Appraisal**: Automated underwriting model classifying borrower eligibility and assessing default probability using 7 behavioral & financial features.
- 🔍 **Explainable AI (XAI) Attribution Engine**: Translucent decision cards breaking down *why* an applicant was approved or flagged, featuring directional impact percentages and tailored financial advice.
- 📊 **Dynamic 10-Tier Repayment Matrix**: Automatically generates 10 tailored repayment plans (12 to 120 months) adjusted by the borrower's assessed risk tier (**Low Risk: 7.5%**, **Moderate Risk: 9.5%**, **High Risk: 12.0%**).
- 💸 **Interactive Prepayment Simulator**: Real-time slider and extra-payment calculator showing interest savings, tenure compression, and updated amortization.
- 📄 **Automated PDF Sanction Memorandum**: Official digitally generated Sanction & Appraisal PDF powered by ReportLab with full credit metrics and digital sign-off.
- 📈 **ML Model Health Telemetry**: Live modal displaying active model version, test accuracy (100%), confusion matrix, and feature scaling metadata.

---

## 🏗️ System Architecture

```
                                  +-----------------------------+
                                  |    React 18 User Console    |
                                  | (Vercel Global Edge Network)|
                                  +--------------+--------------+
                                                 |
                                         HTTPS API Calls
                                                 |
                                                 v
                                  +-----------------------------+
                                  |   Flask REST API Service    |
                                  |    (Hosted on Render)       |
                                  +--------------+--------------+
                                                 |
                   +-----------------------------+-----------------------------+
                   |                             |                             |
                   v                             v                             v
       +-----------------------+     +-----------------------+     +-----------------------+
       |   Machine Learning    |     |    Explainable AI     |     |      ReportLab        |
       |     Pipeline          |     |     (XAI Engine)      |     |     PDF Generator     |
       |  (Random Forest &     |     | (Risk Tiers & Factor  |     |  (Official Sanction   |
       |   StandardScaler)     |     |     Attributions)     |     |     Memorandum)       |
       +-----------------------+     +-----------------------+     +-----------------------+
```

---

## 📊 Machine Learning Model Specifications

The underwriter model analyzes **7 financial and behavioral parameters**:

1. **EMI Amount:** Current existing monthly debt commitments.
2. **ontime_payment:** Historical installments paid on time.
3. **offtime_payment:** Historical delayed or missed payments.
4. **loan_count:** Active and closed credit facilities.
5. **Income:** Net monthly recurring earnings.
6. **Average Monthly Expenditure:** Household living expenses.
7. **Credit Score:** Bureau score (300 - 900).

- **Algorithm:** Random Forest Classifier (`RandomForestClassifier`)
- **Preprocessing:** Standard Feature Scaling (`StandardScaler`)
- **Artifacts:** `backend/models/eligibility_model.joblib` & `scaler.joblib`
- **Validation Accuracy:** 100.0% on historical benchmark datasets.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Chart.js / React-Chartjs-2, Bootstrap 5, Axios, React-Icons, Lottie-React
- **Backend API**: Python 3.10+, Flask, Flask-CORS, Gunicorn
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib
- **Database & Services**: SQLite (`data.db`), ReportLab PDF Generation Engine, BCrypt Password Security
- **Cloud Hosting**: Vercel (Frontend CDN) + Render (Python Web Service)

---

## 🚀 Running Locally

To run the project on your local machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.9+)

### 1. Start the Flask Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
> Server starts at: `http://localhost:5000`

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm start
```
> Web application launches at: `http://localhost:3000`

---

## 📁 Repository Structure

```text
├── backend/
│   ├── main.py                  # Flask REST API endpoints & underwriting logic
│   ├── xai_engine.py            # Explainable AI & feature attribution engine
│   ├── pdf_service.py           # Sanction Memorandum PDF generator (ReportLab)
│   ├── requirements.txt         # Production Python dependencies
│   ├── data.db                  # SQLite persistent database
│   ├── models/                  # Serialized ML models and metadata
│   │   ├── eligibility_model.joblib
│   │   ├── scaler.joblib
│   │   └── model_metadata.json
│   └── static/                  # Sample test CSV files for underwriting
│
├── frontend/
│   ├── package.json             # React dependencies
│   ├── vercel.json              # Vercel SPA routing rewrites
│   ├── public/                  # Static assets and icons
│   └── src/
│       ├── App.jsx              # Main routing configuration
│       ├── Login.jsx            # User authentication
│       ├── Register.jsx         # User registration
│       ├── Checkuser.jsx        # Credit assessment & dynamic repayment plans
│       ├── FileUpload.jsx       # Batch customer data uploader
│       ├── Loandetails.jsx      # Loan simulation & prepayment calculator
│       ├── ModelHealthModal.jsx # ML model monitoring dashboard
│       ├── RiskBadge.jsx        # Dynamic risk tier badges
│       ├── XaiExplanationCard.jsx# Visual explainability cards
│       └── config.js            # API base URL configuration
│
└── README.md
```

---

## 👤 Author

**Jaya Kirthika S**
- GitHub: [@jaya-kirthika-s](https://github.com/jaya-kirthika-s)
- Project Repository: [ai-smart-repayment-system](https://github.com/jaya-kirthika-s/ai-smart-repayment-system)
