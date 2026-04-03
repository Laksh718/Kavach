import kagglehub
import shutil
import os

# Download latest version
path = kagglehub.dataset_download("maslab/bharatbench")

print("Path to dataset files:", path)

# Target
target_path = os.path.join("data", "raw", "bharatbench")

# Move 
if os.path.exists(target_path):
    shutil.rmtree(target_path)

shutil.copytree(path, target_path)
print(f"✅ Data moved to: {target_path}")
