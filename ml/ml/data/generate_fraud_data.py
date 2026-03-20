import pandas as pd
import numpy as np
import os

def generate_fraud_data(n=6000):
    np.random.seed(42)

    data = []

    for _ in range(n):
        # Normal behavior
        active_hours = np.random.uniform(4, 10)
        gps_variance = np.random.uniform(0.1, 2.0)
        earnings_drop = np.random.uniform(0, 0.5)
        claim_frequency = np.random.uniform(0, 3)

        # Inject fraud cases
        is_fraud = 0

        if np.random.rand() < 0.1:  # 10% fraud
            is_fraud = 1
            active_hours = np.random.uniform(0, 2)
            gps_variance = np.random.uniform(5, 15)
            earnings_drop = np.random.uniform(0.8, 1.0)
            claim_frequency = np.random.uniform(5, 10)

        data.append([
            active_hours,
            gps_variance,
            earnings_drop,
            claim_frequency,
            is_fraud
        ])

    df = pd.DataFrame(data, columns=[
        "active_hours",
        "gps_variance",
        "earnings_drop",
        "claim_frequency",
        "is_fraud"
    ])

    return df

if __name__ == "__main__":
    df = generate_fraud_data()
    os.makedirs("ml/data", exist_ok=True)
    df.to_csv("ml/data/fraud_data.csv", index=False)
    print("✅ Fraud dataset generated at ml/data/fraud_data.csv")
