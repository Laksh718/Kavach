import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from ml.inference.disruption_inference import predict_disruption

def evaluate_disruption(event: dict):
    """
    event = {
        "rainfall": 70,
        "aqi": 200,
        "temperature": 30,
        "uv_index": 5.0
    }
    """
    result = predict_disruption(
        event.get("rainfall", 0),
        event.get("aqi", 0),
        event.get("temperature", 25),
        event.get("uv_index", 5.0)
    )
    return result
