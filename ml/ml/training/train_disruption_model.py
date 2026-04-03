import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Paths
WEATHER_DATA = "data/raw/indian_weather/Weather data.xlsx"
AQI_DATA = "data/raw/indian_weather/Air quality information.xlsx"
LOCATION_DATA = "data/raw/indian_weather/Location information.xlsx"
MODEL_PATH = "ml/models/disruption_model.pkl"

def train_disruption_model():
    print("🚀 Starting Disruption Model Training...")

    # Load Data
    print("Loading datasets...")
    df_weather = pd.read_excel(WEATHER_DATA)
    df_aqi = pd.read_excel(AQI_DATA)
    df_loc = pd.read_excel(LOCATION_DATA)

    # Merge Data
    print("Merging datasets...")
    # Map epochs to cities
    df_merged = df_weather.merge(df_aqi, on="last_updated_epoch")
    df_merged = df_merged.merge(df_loc[['last_updated_epoch', 'name']], on="last_updated_epoch")
    
    # Rename 'name' to 'city' for clarity
    df_merged.rename(columns={'name': 'city'}, inplace=True)

    # Features: rainfall_mm, temperature, humidity, wind_speed, aqi, pm25, pm10
    # Mapping based on columns found: 
    # precip_mm, temp_c, humidity, wind_kph, air_quality_pm2_5, air_quality_pm10
    
    # Preprocessing
    df_merged['rainfall_mm'] = df_merged['precip_mm'].fillna(0)
    df_merged['temperature'] = df_merged['temp_c'].fillna(25)
    df_merged['humidity'] = df_merged['humidity'].fillna(50)
    df_merged['wind_speed'] = df_merged['wind_kph'].fillna(10)
    df_merged['pm25'] = df_merged['air_quality_pm2_5'].fillna(20)
    df_merged['pm10'] = df_merged['air_quality_pm10'].fillna(40)
    df_merged['aqi'] = df_merged['air_quality_us-epa-index'].fillna(1) # Using index as a proxy if raw AQI not found

    # User Logic: disruption = risk > 0.6
    # risk = 0.4*rain_norm + 0.3*aqi_norm + 0.3*temp_norm
    
    # Normalization (Approximate max values for scaling)
    rain_norm = df_merged['rainfall_mm'] / 100.0
    aqi_norm = df_merged['pm25'] / 500.0 # Using PM2.5 as AQI proxy for normalization
    temp_norm = df_merged['temperature'] / 50.0
    
    risk = (0.4 * rain_norm + 0.3 * aqi_norm + 0.3 * temp_norm).clip(0, 1)
    df_merged['disruption'] = (risk > 0.6).astype(int)

    print(f"Disruption distribution:\n{df_merged['disruption'].value_counts()}")

    # Prepare features for model
    features = ['rainfall_mm', 'temperature', 'humidity', 'wind_speed', 'pm25', 'pm10']
    X = df_merged[features]
    y = df_merged['disruption']

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print("\n📊 Model Performance:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))

    # Save
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\n✅ Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_disruption_model()
