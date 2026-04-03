import joblib
import os

# Setup paths relative to project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

def load_disruption_model():
    try:
        model_path = os.path.join(MODEL_DIR, 'disruption_model.joblib')
        model = joblib.load(model_path)
        print(f"✅ Loaded production disruption model from: {model_path}")
        return model
    except Exception as e:
        print(f"❌ Error loading disruption model: {e}")
        return None

def load_risk_model():
    try:
        model_path = os.path.join(MODEL_DIR, 'risk_model.joblib')
        model = joblib.load(model_path)
        print(f"✅ Loaded production risk model from: {model_path}")
        return model
    except Exception as e:
        print(f"❌ Error loading risk model: {e}")
        return None
