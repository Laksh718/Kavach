import pandas as pd
import os

def check_file(path):
    print(f"Checking Columns for: {os.path.basename(path)}")
    try:
        df = pd.read_excel(path, engine='openpyxl', nrows=1)
        print(f"Columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error checking {path}: {e}")
    print("-" * 30)

base_path = r"C:\Users\Krish D Shah\Desktop\krishdocs\projects\hackathons\guidewire\GigGuard\data\raw\indian_weather"
files = [
    "Air quality information.xlsx",
    "Astronomical.xlsx",
    "Location information.xlsx",
    "Weather data.xlsx"
]

for f in files:
    check_file(os.path.join(base_path, f))
