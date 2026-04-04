import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Setup paths relative to script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def train_trigger_classifier():
    print("Training RandomForest Trigger Classifier on REAL data...")
    dataset_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\processed\weather_data_cleaned.csv"
    
    if not os.path.exists(dataset_path):
        print("❌ Dataset not found! Running pipeline first...")
        from ml.preprocessing.data_pipeline import load_and_merge_weather_data
        base_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\raw\indian_weather"
        load_and_merge_weather_data(base_path)
    
    df = pd.read_csv(dataset_path)

    # Features: precip_mm, air_quality_PM2.5, temperature_celsius, uv_index
    features = ['precip_mm', 'air_quality_PM2.5', 'temperature_celsius', 'uv_index']
    
    # Target: disruption_occurred (Binary: 0 for Normal, 1 for Triggered)
    X = df[features].dropna()
    y = df.loc[X.index, 'disruption_occurred']
    
    print(f"Training on {len(X)} samples for automated claims triggers...")
    model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X, y)
    
    # Save the production model binary
    model_path = os.path.join(MODEL_DIR, 'disruption_model.joblib')
    joblib.dump(model, model_path)
    print(f"✅ Saved production disruption_model.joblib to: {model_path}")

if __name__ == "__main__":
    train_trigger_classifier()
