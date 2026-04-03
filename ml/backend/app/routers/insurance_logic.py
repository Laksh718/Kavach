from fastapi import APIRouter, HTTPException
from backend.app.schemas.pricing_schema import DynamicPricingResponse, ClaimRequest, ClaimResponse
from backend.app.services.external_api_service import get_live_weather_and_aqi, get_disruption_news
from backend.app.services.local_risk_service import get_hyperlocal_risk
from ml.utils.actuarial_logic import (
    calculate_final_premium, 
    adjust_premium_for_local_risk, 
    calculate_coverage_adjustment,
    check_exclusion_clauses
)
import joblib
import os

router = APIRouter(prefix="/insurance", tags=["Insurance Logic"])

# Load models (relative to root)
RISK_MODEL_PATH = "ml/models/risk_model.joblib"
if os.path.exists(RISK_MODEL_PATH):
    RISK_MODEL = joblib.load(RISK_MODEL_PATH)
else:
    RISK_MODEL = None

@router.get("/dynamic-pricing/{city}", response_model=DynamicPricingResponse)
async def get_dynamic_pricing(city: str):
    """
    Adjusts Weekly premium based on hyper-local risk factors and predictive weather.
    """
    # 1. Fetch Real-time Signals
    weather_data = get_live_weather_and_aqi(city)
    if not weather_data:
        raise HTTPException(status_code=404, detail="Weather data not found for city")
    
    # 2. Base Risk Calculation
    X_risk = [[
        weather_data['precip_mm'], 
        weather_data['air_quality_PM2.5'], 
        weather_data['temperature_celsius'], 
        weather_data['uv_index']
    ]]
    
    risk_score = 0.1 # Default
    if RISK_MODEL:
        risk_score = float(RISK_MODEL.predict(X_risk)[0])
    
    base_premium = calculate_final_premium(risk_score)
    
    # 3. Hyper-local Adjustment
    local_risk = get_hyperlocal_risk(city)
    is_safe = local_risk["is_safe_from_water_logging"]
    
    final_premium, adjustment_reason = adjust_premium_for_local_risk(base_premium, is_safe)
    
    # 4. Coverage Adjustment (Predictive)
    # If rain > 10mm, increase coverage hours
    coverage_hours = calculate_coverage_adjustment(weather_data['precip_mm'])
    
    return DynamicPricingResponse(
        city=city,
        weekly_premium=final_premium,
        coverage_hours=coverage_hours,
        risk_score=round(risk_score, 4),
        is_safe_zone=is_safe,
        adjustment_applied=adjustment_reason
    )

@router.post("/insurance-claim", response_model=ClaimResponse)
async def process_insurance_claim(request: ClaimRequest):
    """
    Checks eligibility for insurance claim based on location signals and worker data.
    """
    # 1. Fetch Environment Data
    weather_data = get_live_weather_and_aqi(request.location)
    news_data = get_disruption_news(request.location)
    
    if not weather_data:
        raise HTTPException(status_code=404, detail="Environment data not found for location")
        
    # 2. Check Triggers
    triggers = []
    if weather_data['is_heavy_rain']: triggers.append("Heavy Rain (>50mm)")
    if weather_data['is_toxic_aqi']: triggers.append("Toxic AQI (>200)")
    if news_data['news_trigger']: triggers.append(f"News Disruption: {news_data['news_title']}")
    
    # 3. Check Exclusions
    is_excluded, exclusion_reason = check_exclusion_clauses(news_data['news_description'])
    
    # 4. Eligibility Logic
    is_eligible = len(triggers) > 0 and not is_excluded
    status = "ELIGIBLE" if is_eligible else "INELIGIBLE"
    
    if is_excluded:
        status = "EXCLUDED"
        reason = f"Claim excluded due to: {exclusion_reason}"
    elif not triggers:
        reason = "No environmental triggers detected in the current zone."
    else:
        reason = "Automated triggers met. Payout authorized."
        
    # 5. Business Logic: Suggested Premium Check
    # (Simple logic: if premium is < 5% of income, suggest an upgrade)
    suggested_premium = None
    if request.premium_amt_per_month < (request.income * 0.05):
        suggested_premium = round(request.income * 0.07, 2)
        
    return ClaimResponse(
        is_eligible=is_eligible,
        status=status,
        reason=reason,
        triggers_found=triggers,
        environment_data={
            "rain_mm": weather_data['precip_mm'],
            "aqi_pm25": weather_data['air_quality_PM2.5'],
            "news": news_data['news_title']
        },
        suggested_premium=suggested_premium
    )
