import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from ml.inference.fraud_inference import predict_fraud

def is_fraudulent(worker_data: dict):
    result = predict_fraud(worker_data)
    if "error" in result:
        return False  # Or handle error appropriately
    return result["fraud"]
