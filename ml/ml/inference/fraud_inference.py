import sys
import os
# Add root to path for imports to work if run directly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import joblib
from ml.utils.fraud_features import build_fraud_features

# Load model
MODEL_PATH = "ml/models/fraud_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

def predict_fraud(data: dict):
    if model is None:
        return {"error": "Model not loaded"}
        
    X = build_fraud_features(data)

    prediction = model.predict(X)[0]  # -1 = anomaly, 1 = normal
    score = model.decision_function(X)[0]

    return {
        "fraud": True if prediction == -1 else False,
        "score": float(score)
    }

if __name__ == "__main__":
    test = {
        "active_hours": 1,
        "gps_variance": 12,
        "earnings_drop": 0.9,
        "claim_frequency": 8
    }

    print("\n🛡️ Fraud Detection:")
    print(predict_fraud(test))
