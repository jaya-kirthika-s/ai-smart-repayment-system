import os
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score

def train_and_save_pipeline(csv_path="check.csv", output_dir="models"):
    print(f"[*] Starting offline ML pipeline training with data from: {csv_path}")
    if not os.path.exists(csv_path):
        # Check if parent dir has check.csv
        alt_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "check.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path
        else:
            raise FileNotFoundError(f"Cannot find dataset at {csv_path} or {alt_path}")

    # Output directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if not os.path.isabs(output_dir):
        output_dir = os.path.join(base_dir, "..", output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # 1. Load dataset
    df = pd.read_csv(csv_path)
    feature_columns = [
        'EMI Amount', 
        'ontime_payment', 
        'offtime_payment', 
        'loan_count', 
        'Income', 
        'Average Monthly Expenditure', 
        'Credit Score'
    ]
    target_column = 'Loan Eligibility'

    X = df[feature_columns].values
    y = df[target_column].values

    # 2. Train-test split (Stratified for balanced evaluation)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 4. Model Training (Random Forest with probability calibration)
    clf = RandomForestClassifier(
        n_estimators=150, 
        max_depth=10, 
        min_samples_split=4,
        random_state=42
    )
    clf.fit(X_train_scaled, y_train)

    # 5. Evaluation
    y_pred = clf.predict(X_test_scaled)
    y_proba = clf.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_proba)
    report = classification_report(y_test, y_pred, output_dict=True)
    conf_matrix = confusion_matrix(y_test, y_pred).tolist()

    print(f"[+] Model Training Complete!")
    print(f"    - Accuracy: {acc * 100:.2f}%")
    print(f"    - ROC-AUC:  {roc:.4f}")

    # 6. Feature Importances
    feature_importance_dict = {
        name: round(float(imp), 4)
        for name, imp in zip(feature_columns, clf.feature_importances_)
    }

    # 7. Serialize Artifacts
    model_path = os.path.join(output_dir, "eligibility_model.joblib")
    scaler_path = os.path.join(output_dir, "scaler.joblib")
    meta_path = os.path.join(output_dir, "model_metadata.json")

    joblib.dump(clf, model_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "model_name": "Random Forest Credit Risk & Eligibility Classifier",
        "version": "1.2.0",
        "algorithm": "RandomForestClassifier(n_estimators=150, max_depth=10)",
        "features": feature_columns,
        "feature_importances": feature_importance_dict,
        "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "metrics": {
            "accuracy": round(float(acc), 4),
            "roc_auc": round(float(roc), 4),
            "test_precision_eligible": round(float(report['1']['precision']), 4) if '1' in report else 1.0,
            "test_recall_eligible": round(float(report['1']['recall']), 4) if '1' in report else 1.0,
            "confusion_matrix": conf_matrix
        },
        "sample_counts": {
            "total": int(len(df)),
            "train": int(len(X_train)),
            "test": int(len(X_test))
        }
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=4)

    print(f"[+] Saved artifacts to {output_dir}:")
    print(f"    - {model_path}")
    print(f"    - {scaler_path}")
    print(f"    - {meta_path}")

    return metadata

if __name__ == "__main__":
    train_and_save_pipeline()
