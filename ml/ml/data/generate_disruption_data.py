import pandas as pd
import numpy as np
import os

def generate_data(n=5000):
    np.random.seed(42)

    rainfall = np.random.uniform(0, 100, n)
    aqi = np.random.uniform(50, 500, n)
    temperature = np.random.uniform(20, 45, n)

    disruption = []

    for r, a, t in zip(rainfall, aqi, temperature):
        score = 0

        if r > 60:
            score += 1
        if a > 350:
            score += 1
        if t > 42:
            score += 1

        disruption.append(1 if score >= 1 else 0)

    df = pd.DataFrame({
        "rainfall": rainfall,
        "aqi": aqi,
        "temperature": temperature,
        "disruption": disruption
    })

    return df

if __name__ == "__main__":
    df = generate_data()
    os.makedirs("ml/data", exist_ok=True)
    df.to_csv("ml/data/disruption_data.csv", index=False)
    print("✅ Dataset generated at ml/data/disruption_data.csv")
