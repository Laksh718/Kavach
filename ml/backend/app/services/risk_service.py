from ml.models.risk_model import predict_risk_score # ML Inference Coefficients

def calculate_weekly_premium(location: str, base_income: float) -> float:
    # Use profile getter for continuous weights
    profile = get_worker_risk_profile(location, base_income)
    return profile['premium']

def get_worker_risk_profile(location: str, base_income: float) -> dict:
    """
    Simulated AI Risk Profile generator tool.
    Returns composite score via RandomForest updates.
    """
    zone_mapping = {"chennai": 1, "mumbai": 2, "delhi": 3, "bangalore": 4}
    zone_id = zone_mapping.get(location.lower(), 1)
    
    # Predict using RandomForest (Using synthetic baseline params for initial setup)
    risk_score = predict_risk_score(rainfall=25.0, aqi=120.0, temp=30.0, zone_id=zone_id)
    
    weekly_income_target = base_income * 7
    # Scale premium driven by model weights
    premium = round(weekly_income_target * 0.015 * (1.0 + risk_score), 2)
    
    # Risk factors lists
    factors = {
        "rain": "high" if location.lower() in ["chennai", "mumbai"] else "medium",
        "aqi": "high" if location.lower() == "delhi" else "medium"
    }
    
    return {
        "risk_score": risk_score,
        "premium": premium,
        "risk_factors": factors
    }
