import sys
import os
from pathlib import Path

# Add 'ml' directory to Python path
CURRENT_DIR = Path(__file__).resolve().parent
# Current is Kavach/ml/tests/ml
# parent is Kavach/ml/tests
# parent.parent is Kavach/ml
ML_ROOT = CURRENT_DIR.parent.parent
sys.path.append(str(ML_ROOT))

def test_load_models():
    print("Testing Disruption Model...")
    from ml.utils.model_loader import load_disruption_model
    disruption = load_disruption_model()
    print(f"Disruption model: {disruption}")
    assert disruption is not None, "Disruption model failed to load"

    print("\nTesting Earnings Model...")
    from ml.inference.earnings_inference import model as earnings_model
    print(f"Earnings model: {earnings_model}")
    assert earnings_model is not None, "Earnings model failed to load"

    print("\nTesting Fraud Model...")
    from ml.inference.fraud_inference import model as fraud_model
    print(f"Fraud model: {fraud_model}")
    assert fraud_model is not None, "Fraud model failed to load"

    print("\n✅ All models loaded successfully!")

if __name__ == "__main__":
    try:
        test_load_models()
    except AssertionError as e:
        print(f"\n❌ Verification Failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error during verification: {e}")
        sys.exit(1)
