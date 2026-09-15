import numpy as np
import os
import json

# Friendly names and interpretation rules for financial features
FEATURE_META = {
    'ontime_payment': {
        'label': 'On-Time Repayments',
        'unit': 'installments',
        'favorable': 'higher',
        'pos_msg': 'Consistent track record of on-time loan installments demonstrates strong repayment discipline.',
        'neg_msg': 'Low count of on-time installments weakens borrower reliability profile.',
        'rec': 'Maintain automatic bank debit / ECS mandate to ensure uninterrupted on-time repayments.'
    },
    'offtime_payment': {
        'label': 'Delayed / Missed Payments',
        'unit': 'defaults',
        'favorable': 'lower',
        'pos_msg': 'Minimal or zero delayed payments indicates low delinquency risk.',
        'neg_msg': 'History of delayed/missed payments significantly escalates default risk.',
        'rec': 'Clear outstanding overdue amounts immediately to reverse negative bureau impact.'
    },
    'Credit Score': {
        'label': 'Credit Bureau Score',
        'unit': 'pts',
        'favorable': 'higher',
        'pos_msg': 'Healthy credit score qualifies applicant for lower risk tiers and preferential pricing.',
        'neg_msg': 'Sub-prime credit score reflects elevated historical credit stress.',
        'rec': 'Keep overall credit card utilization below 30% and avoid multiple new credit inquiries.'
    },
    'Income': {
        'label': 'Monthly Net Income',
        'unit': 'INR',
        'favorable': 'higher',
        'pos_msg': 'Strong recurring income provides sufficient cash flow cushion for debt service.',
        'neg_msg': 'Income level restricts the maximum borrowing ceiling.',
        'rec': 'Include secondary household income or co-applicant to enhance debt servicing capacity.'
    },
    'Average Monthly Expenditure': {
        'label': 'Monthly Living Expenditure',
        'unit': 'INR',
        'favorable': 'lower',
        'pos_msg': 'Prudent monthly living expenses preserve disposable income for EMI servicing.',
        'neg_msg': 'Elevated living expenditures constrain net disposable cash flow.',
        'rec': 'Optimize discretionary spending to improve monthly debt-to-income (DTI) margin.'
    },
    'EMI Amount': {
        'label': 'Existing Monthly Debt (EMI)',
        'unit': 'INR',
        'favorable': 'lower',
        'pos_msg': 'Low existing debt commitments leave ample room for fresh credit facilities.',
        'neg_msg': 'High existing EMI obligations create repayment stress under unexpected income shocks.',
        'rec': 'Consider closing high-interest short-term loans prior to fresh borrowing.'
    },
    'loan_count': {
        'label': 'Active / Historical Loans',
        'unit': 'loans',
        'favorable': 'moderate',
        'pos_msg': 'Balanced credit history confirms sufficient borrowing and repayment experience.',
        'neg_msg': 'Multiple simultaneous loans raise concerns regarding credit-hungry behavior.',
        'rec': 'Limit total active credit lines to avoid leverage stacking.'
    }
}

def explain_decision(model, scaler, input_vector, feature_names):
    """
    Computes Explainable AI (XAI) feature attributions for a single applicant.
    Attempts SHAP TreeExplainer first, with a calibrated marginal feature contribution fallback.
    Returns:
      dict: {
         'base_value': float,
         'approval_probability': float,
         'default_probability': float,
         'risk_tier': 'Low Risk' | 'Moderate Risk' | 'High Risk',
         'factors': list of detailed factor attribution dicts
      }
    """
    input_array = np.array(input_vector).reshape(1, -1)
    scaled_input = scaler.transform(input_array)
    
    # Probabilities
    probas = model.predict_proba(scaled_input)[0]
    # Class 1 = Eligible (Approval), Class 0 = Default / Ineligible
    approval_proba = float(probas[1])
    default_proba = float(probas[0])
    
    if default_proba < 0.20:
        risk_tier = "Low Risk"
        risk_color = "#28a745"
    elif default_proba < 0.45:
        risk_tier = "Moderate Risk"
        risk_color = "#ffc107"
    else:
        risk_tier = "High Risk"
        risk_color = "#dc3545"

    feature_contributions = []

    # Attempt SHAP
    shap_success = False
    try:
        import importlib
        shap = importlib.import_module("shap")
        explainer = getattr(shap, "TreeExplainer")(model)
        shap_values = explainer.shap_values(scaled_input)
        
        # Handle SHAP multi-output
        if hasattr(shap_values, 'shape') and len(shap_values.shape) == 3:
            raw_contribs = shap_values[0, :, 1] # Class 1 (Eligibility)
        elif isinstance(shap_values, list) and len(shap_values) > 1:
            raw_contribs = shap_values[1][0] # Class 1 (Eligibility)
        elif hasattr(shap_values, 'values'):
            # shap.Explanation object
            raw_contribs = shap_values.values[0, :, 1] if len(shap_values.values.shape) > 2 else shap_values.values[0]
        else:
            raw_contribs = shap_values[0]
            
        raw_contribs = np.asarray(raw_contribs).flatten()
        shap_success = True
    except Exception as e:
        shap_success = False

    # Fallback to feature importance * scaled directional divergence
    if not shap_success:
        importances = getattr(model, 'feature_importances_', np.ones(len(feature_names)) / len(feature_names))
        # Scaled values indicate deviations from the mean (z-score)
        z_scores = scaled_input[0]
        raw_contribs = []
        for feat, z, imp in zip(feature_names, z_scores, importances):
            meta = FEATURE_META.get(feat, {})
            direction = 1 if meta.get('favorable') == 'higher' else -1
            # Contribution to eligibility
            raw_contribs.append(z * imp * direction)

    raw_contribs = np.array(raw_contribs, dtype=float)
    total_abs = np.sum(np.abs(raw_contribs))
    if total_abs == 0:
        normalized_pct = np.zeros_like(raw_contribs)
    else:
        normalized_pct = (raw_contribs / total_abs) * 100.0

    for i, name in enumerate(feature_names):
        val = input_vector[i]
        impact_pct = round(float(normalized_pct[i]), 1)
        direction = "positive" if impact_pct >= 0 else "negative"
        meta = FEATURE_META.get(name, {
            'label': name,
            'unit': '',
            'pos_msg': 'Positively supported this credit decision.',
            'neg_msg': 'Posed an elevated risk factor.',
            'rec': 'Review metric regularly.'
        })
        
        explanation_text = meta['pos_msg'] if direction == "positive" else meta['neg_msg']

        feature_contributions.append({
            'key': name,
            'label': meta['label'],
            'unit': meta.get('unit', ''),
            'actual_value': round(float(val), 2) if isinstance(val, (int, float)) else val,
            'impact_pct': impact_pct,
            'direction': direction,
            'explanation': explanation_text,
            'recommendation': meta.get('rec', '')
        })

    # Sort factors by absolute impact magnitude
    feature_contributions.sort(key=lambda x: abs(x['impact_pct']), reverse=True)

    return {
        'approval_probability': round(approval_proba * 100, 1),
        'default_probability': round(default_proba * 100, 1),
        'risk_tier': risk_tier,
        'risk_color': risk_color,
        'factors': feature_contributions
    }
