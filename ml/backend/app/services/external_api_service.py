import os
import requests
from dotenv import load_dotenv

load_dotenv()

WEATHERAPI_KEY = os.getenv("WEATHERAPI")
NEWSAPI_KEY = os.getenv("NEWS_API")

import os
import requests
from dotenv import load_dotenv

load_dotenv()

WINDY_KEY = os.getenv("WEATHERAPI")
NEWSAPI_KEY = os.getenv("NEWS_API")

def get_city_coordinates(city: str):
    """
    Dynamically resolves coordinates via OpenStreetMap (No hardcoding)
    """
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1"
        headers = {'User-Agent': 'KavachML-Production/1.0'}
        response = requests.get(url, headers=headers).json()
        if response:
            return float(response[0]['lat']), float(response[0]['lon'])
    except Exception as e:
        print(f"❌ Geocoding Error for {city}: {e}")
    return None, None

def get_live_weather_and_aqi(city: str):
    """
    Fetches real-time weather from Windy.com (v2 Point Forecast)
    """
    lat, lon = get_city_coordinates(city)
    if not lat or not lon:
        return None
        
    try:
        # Windy Point Forecast API v2
        url = "https://api.windy.com/api/point-forecast/v2"
        payload = {
            "lat": lat,
            "lon": lon,
            "model": "gfs",
            "parameters": ["temp", "precip", "wind", "rh"],
            "levels": ["surface"],
            "key": WINDY_KEY
        }
        
        response = requests.post(url, json=payload)
        data = response.json()
        
        if response.status_code != 200:
            print(f"❌ Windy API Error: {data}")
            return None
            
        # Extract the latest surface data (average over the first few hours)
        # Windy returns arrays for each timestamp
        precip = data.get('precip-surface', [0])[0]
        temp = data.get('temp-surface', [293])[0] - 273.15 # Convert Kelvin to Celsius
        wind = data.get('wind_u-surface', [0])[0] # u-component of wind
        
        # AQI Mock: Windy Point Forecast doesn't expose PM2.5 in v2, 
        # so we maintain a safe mock for hackathon stability if not available.
        aqi_pm25 = 45.0 
        
        return {
            "precip_mm": float(precip),
            "air_quality_PM2.5": aqi_pm25,
            "temperature_celsius": float(temp),
            "uv_index": 5.0, # Baseline fallback
            "is_heavy_rain": 1 if precip > 50 else 0,
            "is_toxic_aqi": 1 if aqi_pm25 > 200 else 0
        }
    except Exception as e:
        print(f"❌ Failed to fetch Windy data: {e}")
        return None

def get_disruption_news(city: str):
    """
    Fetches real-time news about strikes, protests, or floods for a given city.
    """
    try:
        url = f"https://newsapi.org/v2/everything?q={city} strike OR flood OR lockdown&apiKey={NEWSAPI_KEY}&pageSize=1"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'ok' and data['totalResults'] > 0:
            article = data['articles'][0]
            return {
                "news_trigger": 1,
                "news_title": article['title'],
                "news_description": article['description']
            }
        return {"news_trigger": 0, "news_title": "None", "news_description": "Normal"}
    except Exception as e:
        print(f"❌ Failed to fetch news data: {e}")
        return {"news_trigger": 0, "news_title": "Error", "news_description": "Normal"}

if __name__ == "__main__":
    test_city = "Mumbai"
    w = get_live_weather_and_aqi(test_city)
    n = get_disruption_news(test_city)
    print(f"Weather in {test_city}: {w}")
    print(f"News Trigger: {n}")
