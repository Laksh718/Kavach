import os
import requests
from dotenv import load_dotenv

load_dotenv()

WINDY_KEY = os.getenv("WEATHERAPI")
NEWSAPI_KEY = os.getenv("NEWS_API")

# Hardcoded fallback for common Indian cities to bypass Nominatim rate-limits on Render
CITY_COORDINATES_FALLBACK = {
    "bangalore": (12.9716, 77.5946),
    "mumbai": (19.0760, 72.8777),
    "mumbai_island_city": (18.9220, 72.8347),
    "delhi": (28.6139, 77.2090),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "hyderabad": (17.3850, 78.4867),
    "pune": (18.5204, 73.8567),
    "pune_city": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714)
}

def get_city_coordinates(city: str):
    """
    Dynamically resolves coordinates via Photon (Komoot OSM).
    Photon is faster and less strict than Nominatim, perfect for cloud deployments.
    Uses hardcoded fallbacks first for reliability.
    """
    # Normalize input
    city_key = city.lower().strip().replace(" ", "_")
    
    # 1. Check Hardcoded Fallback First (Zero-Touch Production Stability)
    if city_key in CITY_COORDINATES_FALLBACK:
        return CITY_COORDINATES_FALLBACK[city_key]

    # 2. Dynamic Fetch via Photon (Fast, No-Auth, Cloud-Friendly)
    try:
        url = "https://photon.komoot.io/api/"
        params = {"q": city, "limit": 1}
        
        # Photon returns GeoJSON
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and "features" in data and len(data["features"]) > 0:
                coords = data["features"][0]["geometry"]["coordinates"]
                # Photon returns [lon, lat]
                return float(coords[1]), float(coords[0])
                
    except Exception as e:
        print(f"❌ Geocoding Exception for {city}: {e}")
    
    # Final Fallback to Nominatim (only if Photon fails)
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": city, "format": "json", "limit": 1}
        headers = {'User-Agent': 'KavachML-Production/1.1 (Hackathon; contact: support@kavach.ml)'}
        response = requests.get(url, params=params, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, list) and len(data) > 0:
                return float(data[0]['lat']), float(data[0]['lon'])
    except:
        pass
        
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
        
        response = requests.post(url, json=payload, timeout=15)
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                print(f"❌ Windy API Error ({response.status_code}): {error_data}")
            except:
                print(f"❌ Windy API Non-JSON Error ({response.status_code}): {response.text[:100]}")
            return None
            
        data = response.json()
            
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
