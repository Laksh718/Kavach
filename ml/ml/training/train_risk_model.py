import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# Setup paths relative to script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def train_risk_model():
    print("Training RandomForest Risk Model on REAL data...")
    dataset_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\processed\weather_data_cleaned.csv"
    
    # Auto-run data pipeline if dataset is missing
    if not os.path.exists(dataset_path):
        print("❌ Dataset not found! Running pipeline first...")
        import sys
        sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        from ml.preprocessing.data_pipeline import load_and_merge_weather_data
        base_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\raw\indian_weather"
        df = load_and_merge_weather_data(base_path)
    else:
        df = pd.read_csv(dataset_path)

    # Features: precip_mm, air_quality_PM2.5, temperature_celsius, uv_index
    # We use these real Kaggle columns as our "hyper-local risks"
    features = ['precip_mm', 'air_quality_PM2.5', 'temperature_celsius', 'uv_index']
    
    # Drop rows with NaN in features
    df_train = df.dropna(subset=features + ['risk_score'])
    
    X = df_train[features]
    y = df_train['risk_score']
    
    print(f"Training on {len(df_train)} samples...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X, y)
    
    # Save the production model binary
    model_path = os.path.join(MODEL_DIR, 'risk_model.joblib')
    joblib.dump(model, model_path)
    print(f"✅ Saved production risk_model.joblib to: {model_path}")

if __name__ == "__main__":
    train_risk_model()
