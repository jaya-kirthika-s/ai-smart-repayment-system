import random
import pandas as pd
from faker import Faker

# Initialize Faker
fake = Faker()

# Parameters
num_customers = 20
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October']

# Create an empty list to hold the data
data = []

# Function to generate a random expenditure
def generate_expenditure():
    return round(random.uniform(15000, 70000), 2)

# Function to generate EMI amount based on loan amount
def generate_emi(loan_amount):
    return round(loan_amount / random.randint(24, 60), 2)

# Function to generate random income
def generate_income():
    return round(random.uniform(50000, 200000), 2)

# Function to generate debt-to-income ratio
def generate_dti_ratio(debt, income):
    return round(debt / income, 2)

# Function to generate payment history for EMI
def generate_payment_history():
    return random.choice(['Yes', 'No'])

# Function to generate credit score
def generate_credit_score():
    return random.randint(300, 850)

# Function to generate outstanding balance
def generate_outstanding_balance(loan_amount, paid_percentage):
    return round(loan_amount * (1 - paid_percentage), 2)

# Function to generate random loan terms
def generate_loan_terms():
    interest_rate = round(random.uniform(3.0, 10.0), 2)  # Random interest rate between 3-10%
    repayment_period = random.randint(12, 60)  # Repayment period between 1 to 5 years
    return interest_rate, repayment_period

# Generate data for each customer
for _ in range(num_customers):
    name = fake.name()
    loan_amount = round(random.uniform(100000, 500000), 2)  # Loan amount between 100,000 and 500,000
    income = generate_income()  # Monthly income
    credit_score = generate_credit_score()
    credit_history_years = random.randint(1, 15)  # Credit history between 1 and 15 years
    paid_percentage = random.uniform(0.1, 0.9)  # Percentage of loan paid off
    outstanding_balance = generate_outstanding_balance(loan_amount, paid_percentage)
    emi = generate_emi(loan_amount)
    interest_rate, repayment_period = generate_loan_terms()  # Loan terms
    dti_ratio = generate_dti_ratio(emi, income)  # Debt-to-income ratio

    for month in months:
        expenditure = generate_expenditure()  # Monthly expenditure
        payment_history = generate_payment_history()  # Previous payment history
        bank_statement = f"Transactions: {random.randint(5, 20)}, Deposits: {round(random.uniform(30000, 100000), 2)}, Withdrawals: {round(random.uniform(20000, 80000), 2)}"
        
        record = {
            'Customer Name': name,
            'Month': month,
            'Loan Amount': loan_amount,
            'Income': income,
            'Monthly Expenditure': expenditure,
            'EMI Amount': emi,
            'Previous Payment History': payment_history,
            'Debt-to-Income Ratio': dti_ratio,
            'Interest Rate (%)': interest_rate,
            'Repayment Period (Months)': repayment_period,
            'Credit Score': credit_score,
            'Credit History (Years)': credit_history_years,
            'Outstanding Balance Amount': outstanding_balance,
            'Bank Statement': bank_statement
        }
        data.append(record)

# Convert the data to a DataFrame
df = pd.DataFrame(data)

# Save the DataFrame to an Excel file
output_file = 'customer_loan_data_detailed.xlsx'
df.to_excel(output_file, index=False)

print(f"Data successfully saved to {output_file}")
