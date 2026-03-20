import joblib
import os

from pathlib import Path
MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = str(MODEL_DIR / "disruption_model.pkl")

def load_disruption_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None
