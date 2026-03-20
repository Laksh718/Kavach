import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
import joblib

# Setup paths relative to script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def train_risk_model():
    print("Training RandomForest Risk Model...")
    # Synthetic Data
    # Features: Rainfall (mm), AQI, Temperature (C), Zone_ID
    np.random.seed(42)
    n_samples = 1000
    
    X = pd.DataFrame({
        'rainfall': np.random.uniform(0, 80, n_samples),
        'aqi': np.random.uniform(20, 250, n_samples),
        'temperature': np.random.uniform(22, 42, n_samples),
        'zone_id': np.random.choice([1, 2, 3, 4], n_samples) # 1: Chennai, 2: Mumbai, etc.
    })
    
    # Target: risk score (approx 0 to 1 scale)
    y = (X['rainfall'] * 0.35 + X['aqi'] * 0.3 + X['temperature'] * 0.1) / 150.0
    y = np.clip(y, 0.05, 0.95) # Bound it boundedly
    
    model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X, y)
    
    joblib.dump(model, os.path.join(MODEL_DIR, 'risk_model.joblib'))
    print("✅ Saved risk_model.joblib")

def train_fraud_model():
    print("Training IsolationForest Fraud Model...")
    # Features: GPS coordinates delta, Request frequency, Amount 
    n_samples = 1000
    np.random.seed(42)
    X = pd.DataFrame({
        'gps_disparity': np.random.uniform(0, 10, n_samples),
        'requests_count': np.random.poisson(2, n_samples),
        'amount': np.random.uniform(200, 1500, n_samples)
    })
    
    # Introduce anomalies (2% fraud simulation outliers)
    X.loc[980:1000, 'gps_disparity'] = np.random.uniform(80, 200, 21)
    X.loc[980:1000, 'requests_count'] = np.random.poisson(15, 21)
    
    model = IsolationForest(contamination=0.03, random_state=42)
    model.fit(X)
    
    joblib.dump(model, os.path.join(MODEL_DIR, 'fraud_model.joblib'))
    print("✅ Saved fraud_model.joblib")

if __name__ == "__main__":
    train_risk_model()
    train_fraud_model()
