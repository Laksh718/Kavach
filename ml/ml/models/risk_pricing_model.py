import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def _init_pricing_model():
    """ 
    Trains a synthetic model to predict weekly premium.
    Inputs: worker_risk_score, zone_risk, historical_claims, season_multiplier
    """
    n_samples = 1000
    np.random.seed(42)
    X = pd.DataFrame({
        'worker_risk_score': np.random.uniform(0.1, 0.9, n_samples),
        'zone_risk': np.random.uniform(0.2, 1.0, n_samples),
        'historical_claims': np.random.poisson(0.5, n_samples),
        'season_multiplier': np.random.choice([1.0, 1.2, 1.5, 0.8], n_samples)
    })
    
    # Base Premium = (Risk * 50) + (Zone * 30) + (Claims * 20) * Season
    y = (X['worker_risk_score'] * 50 + X['zone_risk'] * 30 + X['historical_claims'] * 20) * X['season_multiplier']
    
    model = RandomForestRegressor(n_estimators=15, max_depth=4, random_state=42)
    model.fit(X, y)
    return model

_model = _init_pricing_model()

def calculate_weekly_premium(risk_score: float, zone_risk: float, past_claims: int, season: str = "monsoon") -> float:
    """ Returns suggested weekly premium in ₹ """
    season_map = {"monsoon": 1.5, "summer": 0.8, "winter": 1.2, "normal": 1.0}
    multiplier = season_map.get(season.lower(), 1.0)
    
    X_pred = pd.DataFrame([[risk_score, zone_risk, past_claims, multiplier]], 
                          columns=['worker_risk_score', 'zone_risk', 'historical_claims', 'season_multiplier'])
    
    premium = _model.predict(X_pred)[0]
    return float(round(premium, 2))

if __name__ == "__main__":
    test_premium = calculate_weekly_premium(0.4, 0.8, 2, "monsoon")
    print(f"💰 Suggested Weekly Premium: ₹{test_premium}")
