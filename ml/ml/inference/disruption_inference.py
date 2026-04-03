import sys
import os
import joblib
import numpy as np

# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ml.utils.model_loader import load_disruption_model

model = load_disruption_model()

def predict_disruption(rainfall, aqi, temperature, uv_index):
    """
    ML Inference: RandomForest Classifier (4 Features)
    1. precip_mm
    2. air_quality_PM2.5
    3. temperature_celsius
    4. uv_index
    """
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        # ENSURE EXACT 4-FEATURE SHAPE: (1, 4)
        # Using float64 to match training precision
        data = np.array([[
            float(rainfall), 
            float(aqi), 
            float(temperature), 
            float(uv_index)
        ]], dtype=np.float64)

        prediction = model.predict(data)[0]
        # Get probability for the predicted class
        probabilities = model.predict_proba(data)[0]
        probability = float(np.max(probabilities))

        return {
            "disruption": int(prediction),
            "confidence": round(probability, 3)
        }
    except Exception as e:
        print(f"❌ ML Inference Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Internal validation of 4-feature logic
    result = predict_disruption(75, 200, 30, 5.0)
    print("\n🚨 Production 4-Feature Test Result:")
    print(result)
