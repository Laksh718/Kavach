import kagglehub
import shutil
import os

# Download latest version
path = kagglehub.dataset_download("pratikjadhav05/indian-weather-data")

print("Path to dataset files:", path)

# Target
target_path = os.path.join("data", "raw", "indian_weather")

# Move 
if os.path.exists(target_path):
    shutil.rmtree(target_path)

shutil.copytree(path, target_path)
print(f"✅ Data moved to: {target_path}")
