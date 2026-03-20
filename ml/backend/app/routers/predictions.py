import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import DisruptionRequest, DisruptionResponse, EarningsRequest, EarningsResponse
from backend.app.services.disruption_service import evaluate_disruption
from backend.app.services.earnings_service import get_expected_earnings

router = APIRouter(
    prefix="/predict",
    tags=["predictions"]
)

@router.post("/disruption", response_model=DisruptionResponse)
def predict_disruption_endpoint(request: DisruptionRequest):
    try:
        event = {
            "rainfall": request.rainfall,
            "aqi": request.aqi,
            "temperature": request.temperature
        }
        result = evaluate_disruption(event)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return {
            "disruption": result["disruption"],
            "confidence": result["confidence"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/earnings", response_model=EarningsResponse)
def predict_earnings_endpoint(request: EarningsRequest):
    try:
        event = {
            "day_of_week": request.day_of_week,
            "hour_bucket": request.hour_bucket,
            "city": request.city,
            "platform": request.platform,
            "rainfall": request.rainfall,
            "aqi": request.aqi
        }
        result = get_expected_earnings(event, request.worker_avg)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return {
            "expected_earnings": result["expected_earnings"],
            "base_prediction": result["base_prediction"],
            "deviation_factor": result["deviation_factor"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
