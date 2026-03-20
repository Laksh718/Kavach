import pandas as pd
import numpy as np
import os

def generate_earnings_data(n=8000):
    np.random.seed(42)

    data = []

    for _ in range(n):
        day_of_week = np.random.randint(0, 7)
        hour_bucket = np.random.randint(0, 4)  # 0 morning, 1 afternoon, 2 evening, 3 night
        city = np.random.randint(0, 5)
        platform = np.random.randint(0, 3)

        rainfall = np.random.uniform(0, 100)
        aqi = np.random.uniform(50, 500)

        # base earnings logic
        base = 200

        if hour_bucket == 2:  # evening peak
            base += 100

        if day_of_week in [5, 6]:  # weekend
            base += 80

        if rainfall > 60:
            base -= 120

        if aqi > 350:
            base -= 80

        earnings = max(50, base + np.random.normal(0, 30))

        data.append([
            day_of_week,
            hour_bucket,
            city,
            platform,
            rainfall,
            aqi,
            earnings
        ])

    df = pd.DataFrame(data, columns=[
        "day_of_week",
        "hour_bucket",
        "city",
        "platform",
        "rainfall",
        "aqi",
        "earnings"
    ])

    return df

if __name__ == "__main__":
    df = generate_earnings_data()
    os.makedirs("ml/data", exist_ok=True)
    df.to_csv("ml/data/earnings_data.csv", index=False)
    print("✅ Earnings dataset generated at ml/data/earnings_data.csv")
