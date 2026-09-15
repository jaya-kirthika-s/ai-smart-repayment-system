import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_sanction_letter_pdf(customer_info, decision_data, selected_plan=None):
    """
    Generates an official, publication-quality Loan Sanction & Credit Audit PDF.
    Returns bytes buffer of the generated PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1A365D"),
        alignment=1, # Center
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4A5568"),
        alignment=1,
        spaceAfter=15
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2B6CB0"),
        spaceBefore=10,
        spaceAfter=6,
        fontName="Helvetica-Bold"
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#2D3748")
    )
    bold_style = ParagraphStyle(
        'BodyDarkBold',
        parent=body_style,
        fontName="Helvetica-Bold"
    )
    badge_approved = ParagraphStyle(
        'BadgeApproved',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#22543D"),
        fontName="Helvetica-Bold",
        alignment=1
    )

    elements = []

    # 1. Header Banner
    elements.append(Paragraph("SMART REPAYMENT FINANCIAL MANAGEMENT", title_style))
    elements.append(Paragraph("AI-DRIVEN CREDIT APPRAISAL & LOAN SANCTION MEMORANDUM", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2B6CB0"), spaceAfter=12))

    # Meta Info Row (Ref No, Date)
    ref_no = f"SRM-{datetime.now().strftime('%Y%m%d')}-{customer_info.get('customerid', 'CUS01')[-4:]}"
    meta_data = [
        [Paragraph(f"<b>Sanction Ref:</b> {ref_no}", body_style),
         Paragraph(f"<b>Date of Appraisal:</b> {datetime.now().strftime('%B %d, %Y')}", body_style)],
        [Paragraph(f"<b>Borrower ID:</b> {customer_info.get('customerid', 'N/A')}", body_style),
         Paragraph(f"<b>Appraisal Status:</b> <font color='#28a745'><b>OFFICIALLY SANCTIONED</b></font>", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F7FAFC")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#EDF2F7"))
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))

    # 2. Borrower Financial Profile
    elements.append(Paragraph("1. Borrower Financial Summary", section_heading))
    profile_rows = [
        [Paragraph("Monthly Net Income:", bold_style), Paragraph(f"INR {customer_info.get('Income', 0):,.2f}", body_style),
         Paragraph("Credit Bureau Score:", bold_style), Paragraph(f"{customer_info.get('CreditScore', 'N/A')} / 900", body_style)],
        [Paragraph("Average Living Expenses:", bold_style), Paragraph(f"INR {customer_info.get('Expenditure', 0):,.2f}", body_style),
         Paragraph("Existing Monthly Debt (EMI):", bold_style), Paragraph(f"INR {customer_info.get('ExistingEMI', 0):,.2f}", body_style)],
        [Paragraph("Historical On-Time Payments:", bold_style), Paragraph(f"{customer_info.get('OnTime', 0)} cycles", body_style),
         Paragraph("Historical Delayed Payments:", bold_style), Paragraph(f"{customer_info.get('OffTime', 0)} cycles", body_style)]
    ]
    profile_table = Table(profile_rows, colWidths=[140, 120, 140, 120])
    profile_table.setStyle(TableStyle([
        ('PADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#EDF2F7")),
    ]))
    elements.append(profile_table)
    elements.append(Spacer(1, 10))

    # 3. AI Underwriting & Risk Assessment
    elements.append(Paragraph("2. Automated Risk Assessment & Explainable AI (XAI) Audit", section_heading))
    
    xai_data = decision_data.get('xai', {})
    risk_tier = xai_data.get('risk_tier', 'Low Risk')
    default_prob = xai_data.get('default_probability', 5.0)
    approval_prob = xai_data.get('approval_probability', 95.0)

    risk_summary = [
        [Paragraph(f"<b>Eligibility Decision:</b> <font color='#28a745'>ELIGIBLE</font>", body_style),
         Paragraph(f"<b>Assessed Risk Tier:</b> <b>{risk_tier}</b>", body_style)],
        [Paragraph(f"<b>Model Approval Confidence:</b> {approval_prob}%", body_style),
         Paragraph(f"<b>Estimated Probability of Default (PD):</b> {default_prob}%", body_style)]
    ]
    risk_table = Table(risk_summary, colWidths=[260, 260])
    risk_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EBF8FF")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#BEE3F8")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(risk_table)
    elements.append(Spacer(1, 6))

    # Top contributing factors
    factors = xai_data.get('factors', [])[:4]
    if factors:
        factor_rows = [[Paragraph("<b>Key Financial Metric</b>", bold_style), 
                        Paragraph("<b>Recorded Value</b>", bold_style), 
                        Paragraph("<b>Impact Direction</b>", bold_style), 
                        Paragraph("<b>Underwriting Interpretation</b>", bold_style)]]
        for f in factors:
            color = "#28a745" if f['direction'] == 'positive' else "#dc3545"
            dir_text = f"<font color='{color}'><b>{f['direction'].upper()} ({f['impact_pct']}%)</b></font>"
            factor_rows.append([
                Paragraph(f['label'], body_style),
                Paragraph(f"{f['actual_value']} {f['unit']}", body_style),
                Paragraph(dir_text, body_style),
                Paragraph(f['explanation'], body_style)
            ])
        factor_table = Table(factor_rows, colWidths=[120, 80, 100, 220])
        factor_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDF2F7")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
            ('PADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(factor_table)

    elements.append(Spacer(1, 10))

    # 4. Sanctioned Facility & Selected Repayment Option
    elements.append(Paragraph("3. Sanctioned Credit Facility & Repayment Structure", section_heading))
    loan_amount = float(decision_data.get('loanamount', 0))

    if selected_plan:
        tenure = selected_plan[0]
        emi = selected_plan[1]
        tot_interest = selected_plan[2]
        tot_payment = selected_plan[3]
    else:
        # Default to first plan if available
        first_plan = decision_data.get('plans', [[60, 0, 0, 0]])[0]
        tenure, emi, tot_interest, tot_payment = first_plan[0], first_plan[1], first_plan[2], first_plan[3]

    sanction_rows = [
        [Paragraph("<b>Approved Principal:</b>", body_style), Paragraph(f"<b>INR {loan_amount:,.2f}</b>", bold_style),
         Paragraph("<b>Selected Loan Tenure:</b>", body_style), Paragraph(f"<b>{tenure} Months</b>", bold_style)],
        [Paragraph("<b>Monthly EMI Amount:</b>", body_style), Paragraph(f"<b>INR {emi:,.2f}</b>", bold_style),
         Paragraph("<b>Annual Interest Rate:</b>", body_style), Paragraph("<b>7.50% p.a. (Fixed)</b>", bold_style)],
        [Paragraph("<b>Total Interest Payable:</b>", body_style), Paragraph(f"INR {tot_interest:,.2f}", body_style),
         Paragraph("<b>Total Repayment Value:</b>", body_style), Paragraph(f"INR {tot_payment:,.2f}", body_style)]
    ]
    sanction_table = Table(sanction_rows, colWidths=[140, 120, 140, 120])
    sanction_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FFF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#9AE6B4")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#C6F6D5")),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    elements.append(sanction_table)
    elements.append(Spacer(1, 12))

    # 5. Regulatory & Authorized Signatory Block
    elements.append(Paragraph("4. Authorization & Digital Sign-off", section_heading))
    sign_rows = [
        [Paragraph("This credit assessment is digitally generated by the AI-Driven Smart Repayment Underwriting Engine. Terms are valid for 30 calendar days from issuance.", body_style),
         Paragraph("<b>Authorized Underwriter:</b><br/>Credit Risk Committee<br/>Smart Repayment Management Ltd.", body_style)]
    ]
    sign_table = Table(sign_rows, colWidths=[340, 180])
    sign_table.setStyle(TableStyle([
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    elements.append(sign_table)

    # Build Document
    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
