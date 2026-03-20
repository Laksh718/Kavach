import joblib
import os

MODEL_PATH = "ml/models/disruption_model.pkl"

def load_disruption_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None
