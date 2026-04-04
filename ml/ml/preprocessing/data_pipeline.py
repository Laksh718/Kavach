import pandas as pd
import os
import glob

def load_and_merge_weather_data(base_path):
    print("Loading weather datasets...")
    
    # Load all 4 Excel files
    df_weather = pd.read_excel(os.path.join(base_path, "Weather data.xlsx"), engine='openpyxl')
    df_aqi = pd.read_excel(os.path.join(base_path, "Air quality information.xlsx"), engine='openpyxl')
    df_loc = pd.read_excel(os.path.join(base_path, "Location information.xlsx"), engine='openpyxl')
    df_astro = pd.read_excel(os.path.join(base_path, "Astronomical.xlsx"), engine='openpyxl')
    
    # Verified merge key: last_updated_epoch
    merge_key = ['last_updated_epoch']
    
    print("Merging on last_updated_epoch...")
    df_merged = pd.merge(df_weather, df_aqi, on=merge_key, how='inner')
    df_merged = pd.merge(df_merged, df_loc, on=merge_key, how='inner', suffixes=('', '_loc'))
    df_merged = pd.merge(df_merged, df_astro, on=merge_key, how='inner', suffixes=('', '_astro'))
    
    print(f"Merged Shape: {df_merged.shape}")
    
    # Feature Engineering for hyper-local risks
    print("Engineering features...")
    
    # Parametric Triggers (3-5 automated triggers)
    # Using real Kaggle column names: temperature_celsius, uv_index, precip_mm, air_quality_PM2.5
    df_merged['is_heavy_rain'] = (df_merged['precip_mm'] > 50).astype(int)
    df_merged['is_toxic_aqi'] = (df_merged['air_quality_PM2.5'] > 200).astype(int)
    df_merged['is_heatwave'] = (df_merged['temperature_celsius'] > 42).astype(int)
    df_merged['is_uv_threat'] = (df_merged['uv_index'] > 8).astype(int)
    
    # Dynamic Pricing multiplier (Simplified pure premium factor)
    # Risk Factor = (Rain * 0.4) + (AQI * 0.4) + (Heat * 0.2)
    df_merged['risk_score'] = (df_merged['is_heavy_rain'] * 0.4 + 
                               df_merged['is_toxic_aqi'] * 0.4 + 
                               df_merged['is_heatwave'] * 0.2).clip(0.1, 0.9)
    
    # Payout Trigger (Loss of Income simulation based on triggers)
    df_merged['disruption_occurred'] = (df_merged['is_heavy_rain'] | df_merged['is_toxic_aqi']).astype(int)

    # Save processed data
    target_dir = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\processed"
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    df_merged.to_csv(os.path.join(target_dir, "weather_data_cleaned.csv"), index=False)
    print(f"✅ Processed data saved for training.")
    return df_merged

if __name__ == "__main__":
    weather_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\raw\indian_weather"
    load_and_merge_weather_data(weather_path)
