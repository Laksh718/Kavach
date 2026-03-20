import requests
import os

# Manual .env loader for environment variables (safeguard)
def load_env_manual():
    # .env is in the root, /backend/app/utils/weather_api.py is 3 levels deep
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    os.environ[key.strip()] = value.strip()

load_env_manual()

API_KEY = os.environ.get("WEATHERAPI", "YOUR_API_KEY_HERE")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather_data(city="Chennai"):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code != 200:
            print(f"❌ Weather API error ({response.status_code}):", response.text)
            return None

        data = response.json()
        rainfall = 0

        # Rain data (if present)
        if "rain" in data:
            rainfall = data["rain"].get("1h", 0)

        result = {
            "temperature": data["main"]["temp"],
            "aqi": 200,  # placeholder (we’ll add real AQI later)
            "rainfall": rainfall * 10  # scale (API gives mm/hour)
        }

        return result
        
    except Exception as e:
        print(f"❌ Weather API Exception: {e}")
        return None
