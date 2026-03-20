import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def _init_model():
    """ Trains a synthetic RandomForestRegressor on initialization """
    n_samples = 1000
    np.random.seed(42)
    X = pd.DataFrame({
        'rainfall': np.random.uniform(0, 80, n_samples),
        'aqi': np.random.uniform(20, 250, n_samples),
        'temperature': np.random.uniform(22, 42, n_samples),
        'zone_id': np.random.choice([1, 2, 3, 4], n_samples)
    })
    y = (X['rainfall'] * 0.35 + X['aqi'] * 0.3 + X['temperature'] * 0.1) / 150.0
    y = np.clip(y, 0.05, 0.95)
    
    model = RandomForestRegressor(n_estimators=20, max_depth=5, random_state=42)
    model.fit(X, y)
    return model

_model = _init_model()

def predict_risk_score(rainfall: float, aqi: float, temp: float, zone_id: int) -> float:
    """ Returns 0-1 Risk score based on RandomForest Regressor """
    X_pred = pd.DataFrame([[rainfall, aqi, temp, zone_id]], columns=['rainfall', 'aqi', 'temperature', 'zone_id'])
    score = _model.predict(X_pred)[0]
    return float(round(score, 2))
