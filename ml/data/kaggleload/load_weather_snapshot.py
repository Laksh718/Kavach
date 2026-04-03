import kagglehub
import shutil
import os

# Download latest version to cache
path = kagglehub.dataset_download("nelgiriyewithana/indian-weather-repository-daily-snapshot")

print("Path to dataset files:", path)

# Define target path in @data/raw
target_path = os.path.join("data", "raw", "weather_snapshot")

# Move to @data/raw
if os.path.exists(target_path):
    shutil.rmtree(target_path)  # Clear old data if exists

shutil.copytree(path, target_path)
print(f"✅ Data moved to: {target_path}")
