import os
import requests
from dotenv import load_dotenv

load_dotenv()

WINDY_KEY = os.getenv("WEATHERAPI")

def test_windy_key():
    # 1. Geocode "Mumbai" dynamically
    print("📍 Geocoding Mumbai...")
    geo_url = "https://nominatim.openstreetmap.org/search?q=Mumbai&format=json&limit=1"
    headers = {'User-Agent': 'KavachParametricInsurance/1.0'}
    geo_resp = requests.get(geo_url, headers=headers).json()
    
    if not geo_resp:
        print("❌ Geocoding failed.")
        return
        
    lat = float(geo_resp[0]['lat'])
    lon = float(geo_resp[0]['lon'])
    print(f"✅ Found coordinates: {lat}, {lon}")

    # 2. Test Windy Point Forecast API v2 (with header-based auth)
    windy_url = "https://api.windy.com/api/point-forecast/v2"
    payload = {
        "lat": lat,
        "lon": lon,
        "model": "ecmwf", # Testing ECMWF model
        "parameters": ["temp", "wind", "precip"]
    }
    
    headers = {
        "x-windy-api-key": WINDY_KEY,
        "Content-Type": "application/json"
    }
    
    print(f"📡 Attempting Header-based Auth (ECMWF)...")
    response = requests.post(windy_url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 400:
        print("📡 Attempting Body-based Auth (GFS)...")
        payload['model'] = "gfs"
        payload['key'] = WINDY_KEY
        response = requests.post(windy_url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

if __name__ == "__main__":
    test_windy_key()
