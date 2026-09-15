import os
import io
import json
import sqlite3 as sq
import pandas as pd
import numpy as np
import bcrypt
import joblib
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler

# Import XAI and PDF Services
try:
    from xai_engine import explain_decision
except ImportError:
    from backend.xai_engine import explain_decision

try:
    from pdf_service import generate_sanction_letter_pdf
except ImportError:
    from backend.pdf_service import generate_sanction_letter_pdf

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.db')

# Load Persisted Models and Metadata
MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'eligibility_model.joblib')
SCALER_PATH = os.path.join(MODELS_DIR, 'scaler.joblib')
META_PATH = os.path.join(MODELS_DIR, 'model_metadata.json')

FEATURE_COLUMNS = [
    'EMI Amount', 
    'ontime_payment', 
    'offtime_payment', 
    'loan_count', 
    'Income', 
    'Average Monthly Expenditure', 
    'Credit Score'
]

# Ensure models exist; if not, train them once
if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
    print("[!] Model artifacts not found. Initiating offline pipeline training...")
    try:
        from ml_pipeline.train_pipeline import train_and_save_pipeline
    except ImportError:
        from backend.ml_pipeline.train_pipeline import train_and_save_pipeline
    train_and_save_pipeline(output_dir=MODELS_DIR)

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

model_metadata = {}
if os.path.exists(META_PATH):
    with open(META_PATH, 'r') as f:
        model_metadata = json.load(f)

print("[+] Antigravity AI Engine loaded successfully:")
print(f"    Model: {model_metadata.get('model_name', 'Random Forest')} v{model_metadata.get('version', '1.0')}")
print(f"    Accuracy: {model_metadata.get('metrics', {}).get('accuracy', 1.0) * 100:.1f}%")

# State tracker for last uploaded customer file
LAST_UPLOADED_FILES = {"first": "sample.csv", "second": "sampleloan.csv"}

def loaneligableamount(income_per_month, total_obligations, max_emi_ratio=0.3):
    """
    Calculates maximum safe borrowing ceiling based on net disposable income and DTI cap.
    """
    disposable_income = income_per_month - total_obligations
    if disposable_income <= 0:
        return 0.0
    max_emi = disposable_income * max_emi_ratio
    eligible_loan_amount = max_emi * 60  # 5-year maximum ceiling
    return round(eligible_loan_amount, 2)

def customer(s):
    engine = sq.connect(DB_PATH)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], s)
    sample = pd.read_csv(file_path)
    sample.to_sql('customer', con=engine, if_exists='append', index=False)

def repaymentamount(loan_amount_new, income_new, risk_tier="Low Risk"):
    """
    Risk-adjusted repayment engine: dynamically generates 10 tailored repayment options
    varying by tenure, EMI, and interest costs, adjusted by the borrower's risk tier.
    """
    # Risk-adjusted APR
    if risk_tier == "Low Risk":
        interest_rate = 7.5
    elif risk_tier == "Moderate Risk":
        interest_rate = 9.5
    else:
        interest_rate = 12.0

    # 10 tenure options between 12 months and 120 months
    tenures = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
    monthly_rate = interest_rate / (12 * 100)

    repayment_options = []
    for tenure in tenures:
        emi = (loan_amount_new * monthly_rate * ((1 + monthly_rate) ** tenure)) / (((1 + monthly_rate) ** tenure) - 1)
        tot_payment = emi * tenure
        tot_interest = tot_payment - loan_amount_new
        repayment_options.append([
            int(tenure),
            round(emi, 2),
            round(tot_interest, 2),
            round(tot_payment, 2)
        ])

    return repayment_options

def customerloan(s, sd):
    engine = sq.connect(DB_PATH)
    customer_file = os.path.join(app.config['UPLOAD_FOLDER'], sd)
    loan_file = os.path.join(app.config['UPLOAD_FOLDER'], s)

    sample = pd.read_csv(customer_file)
    sample.to_sql('customer', con=engine, if_exists='append', index=False)

    sampleloan = pd.read_csv(loan_file)
    sampleloan.to_sql('customer_loan', con=engine, if_exists='append', index=False)

    agg_rules = {
        'Loan Amount': 'first',
        'Interest Rate (%)': 'first',
        'EMI Amount': 'first',
        'Repayment Period (Months)': 'first',
        'Outstanding Balance Amount': 'first',
        'Bank Statement': 'first',
        'payment': ['sum', lambda x: int((x == 0).sum())]
    }
    unique_customers_df = sampleloan.groupby(['customerid', 'loanno']).agg(agg_rules).reset_index()

    unique_customers_df.columns = [
        'customerid', 'loanno', 'Loan Amount', 'Interest Rate (%)', 
        'EMI Amount', 'Repayment Period (Months)', 'Outstanding Balance Amount', 
        'Bank Statement', 'ontime_payment', 'offtime_payment'
    ]

    result = unique_customers_df.groupby('customerid').agg({
        'EMI Amount': 'sum',
        'ontime_payment': 'sum',
        'offtime_payment': 'sum',
        'loanno': 'count'
    }).reset_index()
    result.rename(columns={'loanno': 'loan_count'}, inplace=True)

    merged_df = pd.merge(result, sample, left_on='customerid', right_on='Customerid')
    merged_df.drop(columns=['Customerid'], inplace=True)
    data = merged_df.values.tolist()

    # Features order: ['EMI Amount', 'ontime_payment', 'offtime_payment', 'loan_count', 'Income', 'AverageMonthlyExpenditure', 'CreditScore']
    # merged_df columns: ['customerid', 'EMI Amount', 'ontime_payment', 'offtime_payment', 'loan_count', 'CustomerName', 'Income', 'AverageMonthlyExpenditure', 'CreditScore']
    feat_values = [
        float(data[0][1]),  # EMI Amount
        int(data[0][2]),    # ontime_payment
        int(data[0][3]),    # offtime_payment
        int(data[0][4]),    # loan_count
        float(data[0][6]),  # Income
        float(data[0][7]),  # AverageMonthlyExpenditure
        int(data[0][8])     # CreditScore
    ]

    # Pre-loaded scaling and inference
    scaled_features = scaler.transform([feat_values])
    prediction = model.predict(scaled_features)[0]
    eligibility_status = 'Eligible' if prediction == 1 else 'Not Eligible'

    # Explainable AI (XAI) & Default Probability computation
    xai_results = explain_decision(model, scaler, feat_values, FEATURE_COLUMNS)

    customer_summary = {
        "customerid": str(data[0][0]),
        "CustomerName": str(data[0][5]),
        "Income": float(data[0][6]),
        "Expenditure": float(data[0][7]),
        "CreditScore": int(data[0][8]),
        "ExistingEMI": float(data[0][1]),
        "OnTime": int(data[0][2]),
        "OffTime": int(data[0][3]),
        "LoanCount": int(data[0][4])
    }

    if eligibility_status == 'Eligible':
        # Calculate maximum borrowing capacity
        loanamount = loaneligableamount(customer_summary["Income"], customer_summary["ExistingEMI"] + customer_summary["Expenditure"], 0.3)
        if loanamount > 0:
            plans = repaymentamount(loanamount, customer_summary["Income"], risk_tier=xai_results["risk_tier"])
            return {
                "eligibility_status": eligibility_status,
                "loanamount": loanamount,
                "plans": plans,
                "xai": xai_results,
                "customer_summary": customer_summary,
                "risk_tier": xai_results["risk_tier"],
                "default_probability": xai_results["default_probability"],
                "approval_probability": xai_results["approval_probability"]
            }
        else:
            return {
                "eligibility_status": 'Not Eligible',
                "reason": "Disposable income insufficient after existing debt obligations.",
                "xai": xai_results,
                "customer_summary": customer_summary
            }
    else:
        return {
            "eligibility_status": eligibility_status,
            "xai": xai_results,
            "customer_summary": customer_summary,
            "risk_tier": xai_results["risk_tier"],
            "default_probability": xai_results["default_probability"]
        }

@app.route('/upload', methods=['POST'])
def file():
    if 'file' not in request.files:
        return jsonify(message='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(message='No selected file'), 400

    save_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(save_path)

    reason = request.form.get("reason", "first")
    if reason == "first":
        LAST_UPLOADED_FILES["first"] = file.filename
        customer(file.filename)
        return jsonify(message='File successfully uploaded', file=file.filename), 200

    elif reason == "second":
        LAST_UPLOADED_FILES["second"] = file.filename
        # Pair with previously uploaded profile or fallback to sample.csv
        profile_file = LAST_UPLOADED_FILES.get("first", "sample.csv")
        data = customerloan(file.filename, profile_file)
        return jsonify(message=data, file=file.filename), 200

    return jsonify(message='Invalid reason'), 400

@app.route('/download-sanction-letter', methods=['POST'])
def download_sanction_letter():
    """
    Generates and returns an official PDF Sanction Letter.
    """
    try:
        req = request.json or {}
        customer_info = req.get("customer_summary", {})
        decision_data = req.get("decision_data", {})
        selected_plan = req.get("selected_plan", None)

        pdf_bytes = generate_sanction_letter_pdf(customer_info, decision_data, selected_plan)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Loan_Sanction_Letter_{customer_info.get('customerid', 'CUS')}.pdf"
        )
    except Exception as e:
        print("[!] Error generating PDF:", str(e))
        return jsonify(error=str(e)), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify(status='healthy', service='Smart Repayment AI Backend'), 200

@app.route('/model-metrics', methods=['GET'])
def get_model_metrics():
    """
    Returns metadata and validation metrics of the active serialized model.
    """
    return jsonify(model_metadata), 200

@app.route('/reg', methods=['POST'])
def reg():
    r = request.json
    s = sq.connect(DB_PATH)
    hashed_password = bcrypt.hashpw(r["password"].encode('utf-8'), bcrypt.gensalt())
    s.execute("create table if not exists user(uid integer primary key autoincrement, name varchar(1000),password varchar(1000),role varchar(100),email varchar(100))")
    s.execute("insert into user (name,password,role,email) values (?,?,?,?)", (r["name"], hashed_password, r["role"], r["email"]))
    s.commit()
    return 's'

@app.route('/', methods=['POST'])
def log():
    r = request.json
    s = sq.connect(DB_PATH)
    user = s.execute("SELECT * FROM user WHERE email=?", (r["email"],)).fetchone()
    if user and bcrypt.checkpw(r["password"].encode('utf-8'), user[2]):
        return jsonify({"uid": user[0], "name": user[1], "role": user[3], "email": user[4]})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/viewuser', methods=['POST'])
def viewuser():
    r = request.json
    s = sq.connect(DB_PATH)
    x = """SELECT 
    c.customerid, 
    cl.loanno, 
    MAX(c.Income) AS Income, 
    MAX(c.AverageMonthlyExpenditure) AS AverageMonthlyExpenditure, 
    MAX(c.CreditScore) AS CreditScore, 
    MAX(cl.`Loan Amount`) AS `Loan Amount`, 
    MAX(cl.`Interest Rate (%)`) AS `Interest Rate (%)`, 
    MAX(cl.`Repayment Period (Months)`) AS `Repayment Period (Months)`, 
    MAX(cl.`EMI Amount`) AS `EMI Amount`, 
    COUNT(CASE WHEN cl.payment = 1 THEN 1 END) AS OnTimePayments, 
    COUNT(CASE WHEN cl.payment = 0 THEN 1 END) AS OffTimePayments
FROM 
    customer c 
JOIN 
    customer_loan cl ON c.customerid = cl.Customerid 
WHERE 
    c.customerid = '{0}'
GROUP BY 
    c.customerid, cl.loanno;""".format(r["uid"])
    
    d = s.execute(x).fetchall()
    s.commit()
    return jsonify(d)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)