import random
import pandas as pd

# Function to generate random credit score data
def generate_credit_score_data(num_customers=100):
    data = []
    
    for _ in range(num_customers):
        # Randomly generate values for each credit score factor

        # Payment history (0 - 100%, where 100 is perfect on-time payment history)
        payment_history = random.randint(70, 100)
        
        # Credit utilization (percentage of credit used, lower is better, 0-100%)
        credit_utilization = random.uniform(10, 80)
        
        # Length of credit history (in years)
        credit_history_length = random.randint(1, 30)
        
        # Credit mix (number of different types of credit accounts)
        credit_mix = random.randint(1, 5)
        
        # New credit inquiries in the last 6 months (more inquiries lower score)
        new_credit_inquiries = random.randint(0, 5)
        
        # Calculate a rough credit score (simple formula for demonstration)
        credit_score = (0.35 * payment_history) + \
                       (0.30 * (100 - credit_utilization)) + \
                       (0.15 * (credit_history_length / 30) * 100) + \
                       (0.10 * (credit_mix / 5) * 100) + \
                       (0.10 * (5 - new_credit_inquiries) / 5 * 100)
        
        # Append the data to the list
        data.append([payment_history, credit_utilization, credit_history_length, credit_mix, new_credit_inquiries, credit_score])
    
    # Create a pandas DataFrame with the data
    df = pd.DataFrame(data, columns=[
        'Payment History (%)', 
        'Credit Utilization (%)', 
        'Credit History Length (years)', 
        'Credit Mix (types)', 
        'New Credit Inquiries (last 6 months)', 
        'Credit Score'
    ])
    
    return df

# Generate dataset for 100 customers
credit_data = generate_credit_score_data(100)

# Save the dataset to an Excel file
credit_data.to_excel('credit_score_data.xlsx', index=False)

print("Data saved to 'credit_score_data.xlsx'")