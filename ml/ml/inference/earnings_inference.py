import sys
import os
# Add root to path for imports to work if run directly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import joblib
from ml.utils.earnings_helpers import compute_deviation_factor, adjust_prediction

# Load model
from pathlib import Path
MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = str(MODEL_DIR / "earnings_model.pkl")
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def predict_expected_earnings(features: dict, worker_avg=250):
    if model is None:
        return {"error": "Model not loaded"}
    
    X = [[
        features["day_of_week"],
        features["hour_bucket"],
        features["city"],
        features["platform"],
        features["rainfall"],
        features["aqi"]
    ]]

    base_prediction = model.predict(X)[0]

    # simulate predicted avg baseline
    predicted_avg = 250

    deviation = compute_deviation_factor(worker_avg, predicted_avg)

    final_prediction = adjust_prediction(base_prediction, deviation)

    return {
        "expected_earnings": round(float(final_prediction), 2),
        "base_prediction": round(float(base_prediction), 2),
        "deviation_factor": round(float(deviation), 2)
    }

if __name__ == "__main__":
    test = {
        "day_of_week": 5,
        "hour_bucket": 2,
        "city": 1,
        "platform": 0,
        "rainfall": 80,
        "aqi": 300
    }

    result = predict_expected_earnings(test)
    print("\n💰 Earnings Prediction:")
    print(result)
