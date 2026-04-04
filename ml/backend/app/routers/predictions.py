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

from backend.app.services.external_api_service import get_live_weather_and_aqi

@router.post("/disruption", response_model=DisruptionResponse)
def predict_disruption_endpoint(request: DisruptionRequest):
    try:
        # Automated Zero-Touch Fetching
        live_data = get_live_weather_and_aqi(request.city_name)
        if not live_data:
            raise HTTPException(status_code=500, detail=f"Signal Lost: Could not fetch Windy data for {request.city_name}")

        event = {
            "rainfall": live_data['precip_mm'],
            "aqi": live_data['air_quality_PM2.5'],
            "temperature": live_data['temperature_celsius'],
            "uv_index": live_data.get('uv_index', 5.0)
        }
        
        result = evaluate_disruption(event)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {
            "disruption": result["disruption"],
            "confidence": result["confidence"],
            "message": f"Real-time Windy.com signals active for {request.city_name}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/earnings", response_model=EarningsResponse)
def predict_earnings_endpoint(request: EarningsRequest):
    try:
        # Automated Zero-Touch Fetching
        live_data = get_live_weather_and_aqi(request.city_name)
        if not live_data:
            raise HTTPException(status_code=500, detail=f"Signal Lost: Could not fetch Windy data for {request.city_name}")

        # Internal City Name -> Training ID Mapper (Robust to casing)
        CITY_MAP = {
            "chennai": 1,
            "mumbai": 2,
            "kolkata": 3,
            "delhi": 4,
            "bangalore": 0
        }
        city_id = CITY_MAP.get(request.city_name.lower(), 0) # Fallback to 0 (General)

        event = {
            "day_of_week": request.day_of_week,
            "hour_bucket": request.hour_bucket,
            "city": city_id,
            "platform": request.platform,
            "rainfall": live_data['precip_mm'],
            "aqi": live_data['air_quality_PM2.5']
        }
        
        result = get_expected_earnings(event, request.worker_avg)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {
            "expected_earnings": result["expected_earnings"],
            "base_prediction": result["base_prediction"],
            "deviation_factor": result["deviation_factor"],
            "message": f"Real-time Windy.com signals active for {request.city_name} (mapped to ID {city_id})"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
