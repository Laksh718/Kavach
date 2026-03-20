import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from ml.inference.earnings_inference import predict_expected_earnings

def get_expected_earnings(event: dict, worker_avg=250):
    return predict_expected_earnings(event, worker_avg)
