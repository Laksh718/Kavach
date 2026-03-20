import sys
import os
# Add root to path for imports to work if run directly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ml.utils.model_loader import load_disruption_model

model = load_disruption_model()

def predict_disruption(rainfall, aqi, temperature):
    if model is None:
        return {"error": "Model not loaded"}
    data = [[rainfall, aqi, temperature]]

    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0].max()

    return {
        "disruption": int(prediction),
        "confidence": round(float(probability), 3)
    }

if __name__ == "__main__":
    result = predict_disruption(75, 200, 30)
    print("\n🚨 Prediction Result:")
    print(result)
