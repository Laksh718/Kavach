import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import FastAPI
from pydantic import BaseModel
from backend.app.services.pipeline_service import run_full_pipeline
from backend.app.services.payout_service import get_all_payouts
from backend.app.routers import predictions, insurance_logic
from backend.app.services.pipeline_service import run_pipeline_with_live_weather

app = FastAPI(
    title="Kavach-ML Model API",
    description="API for Parametric Insurance Workflow",
    version="1.1.0"
)

# -------------------------
# Request Schemas
# -------------------------

class Event(BaseModel):
    rainfall: float
    aqi: float
    temperature: float
    day_of_week: int
    hour_bucket: int
    city: int
    platform: int

class FraudFeatures(BaseModel):
    active_hours: float
    gps_variance: float
    earnings_drop: float
    claim_frequency: float

class Worker(BaseModel):
    worker_id: int
    avg_earnings: float
    actual_earnings: float
    fraud_features: FraudFeatures

class PipelineRequest(BaseModel):
    event: Event
    worker: Worker

# -------------------------
# Routes
# -------------------------

import joblib
from backend.app.services.external_api_service import get_live_weather_and_aqi, get_disruption_news
from ml.utils.actuarial_logic import calculate_final_premium, check_exclusion_clauses

# Load production models
RISK_MODEL = joblib.load("ml/models/risk_model.joblib")
DISRUPTION_MODEL = joblib.load("ml/models/disruption_model.joblib")

@app.get("/")
def root():
    return {"message": "Kavach-ML Production API running 🚀"}

@app.get("/run-live/{city}")
def run_live(city: str):
    """
    Parametric Insurance Flow for Automated Claims Management
    """
    print(f"Executing parametric check for {city}...")
    
    # 1. Fetch Real-time Signals
    weather_data = get_live_weather_and_aqi(city)
    news_data = get_disruption_news(city)
    
    if not weather_data:
        return {"status": "error", "message": "Weather API signal lost."}
        
    # 2. Dynamic Premium Calculation (Actuarial ML Signal 1)
    X_risk = [[
        weather_data['precip_mm'], 
        weather_data['air_quality_PM2.5'], 
        weather_data['temperature_celsius'], 
        weather_data['uv_index']
    ]]
    dynamic_risk_score = RISK_MODEL.predict(X_risk)[0]
    
    # Quantitative Actuarial Calculation: Gross Premium
    final_premium = calculate_final_premium(dynamic_risk_score)
    
    # 3. Claims Trigger Management (ML Signal 2)
    # 3-5 automated triggers check
    disruption_pred = DISRUPTION_MODEL.predict(X_risk)[0]
    
    # Parametric Triggers Logic
    triggers = {
        "heavy_rain_trigger": weather_data['is_heavy_rain'],
        "toxic_aqi_trigger": weather_data['is_toxic_aqi'],
        "news_disruption_trigger": news_data['news_trigger']
    }
    
    # 4. Standard Exclusion Clauses Check
    is_excluded, exclusion_reason = check_exclusion_clauses(news_data['news_description'])
    
    # Automatic Claim Activation
    claim_status = "STABLE"
    payout_amt = 0
    if not is_excluded:
        if disruption_pred == 1 or any(triggers.values()):
            claim_status = "TRIGGERED"
            payout_amt = 300.0 # Standard Parametric Payout ₹
    else:
        claim_status = f"EXCLUDED: {exclusion_reason.upper()}"
        payout_amt = 0
        
    return {
        "city": city,
        "parametric_signals": {
            "weather": weather_data,
            "news": news_data
        },
        "actuarial_pricing": {
            "risk_probability": round(float(dynamic_risk_score), 4),
            "weekly_gross_premium": f"₹{final_premium}",
            "calculation_basis": "Pure Premium / (1 - ExpenseRatio - ProfitMargin)"
        },
        "claims_management": {
            "status": claim_status,
            "payout_inr": payout_amt,
            "triggers_active": [k for k, v in triggers.items() if v == 1] if not is_excluded else [],
            "exclusions_detected": is_excluded,
            "recommendation": "Payout Authorized Automatically" if claim_status == "TRIGGERED" else "No Payout (Exclusion / Stable)"
        }
    }

# Include other detailed prediction endpoints for full Swagger reference
app.include_router(predictions.router)
app.include_router(insurance_logic.router)
