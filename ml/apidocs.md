# Kavach-ML API Documentation

Welcome to the **GigGuard (Kavach-ML)** API documentation. This API provides machine-learning-driven parametric insurance signals, premium calculation, and automated claim processing for gig workers.

---

## 🛰️ 1. Core Endpoints

### `GET /`
**Usecase**: Health check to verify if the Production API is running.
- **Input**: None
- **Response**: `{"message": "Kavach-ML Production API running 🚀"}`

### `GET /run-live/{city}`
**Usecase**: Executes a full parametric insurance check for a given city in one go. Useful for dashboards.
- **Input**: `city` (Path Parameter, e.g., "Mumbai")
- **Internal Logic**:
    - Fetches live weather and news.
    - Calculates dynamic risk and premium.
    - Checks for automated claim triggers.
- **Response**: Detailed JSON containing weather signals, news triggers, actuarial pricing, and claim status.

---

## 🧠 2. Prediction Endpoints

### `POST /predict/disruption`
**Usecase**: Uses the **Disruption ML Model** to predict the probability of service disruption for a city based on real-time environmental signals.
- **Input (JSON)**:
    ```json
    {
      "city_name": "Bangalore"
    }
    ```
- **Response**:
    ```json
    {
      "disruption": 0, // 1 if disruption predicted, 0 otherwise
      "confidence": 0.85,
      "message": "Real-time Windy.com signals active for Bangalore"
    }
    ```

### `POST /predict/earnings`
**Usecase**: Predicts expected earnings for a worker based on time, location, and environmental conditions.
- **Input (JSON)**:
    ```json
    {
      "city_name": "Delhi",
      "day_of_week": 5, // 0-6 (Mon-Sun)
      "hour_bucket": 18, // 0-23
      "platform": 1, // Platform ID
      "worker_avg": 500.0 // Worker's usual hourly average
    }
    ```
- **Response**: Returns `expected_earnings`, `base_prediction`, and `deviation_factor` (impact of rain/AQI).

---

## 🛡️ 3. Insurance Logic (New)

### `GET /insurance/dynamic-pricing/{city}`
**Usecase**: Calculates a customized weekly premium by adjusting the base rate using **Hyper-local Risk Factors** and **Predictive Weather**.
- **Input**: `city` (Path Parameter)
- **Features**:
    - **Safe Zone Discount**: Subtracts ₹2 if the city is marked as "historically safe from water logging" (e.g., Mumbai Island City).
    - **Predictive Coverage**: Automatically increases coverage by +2 hours if the weather model predicts rain > 10mm.
- **Response**:
    ```json
    {
      "city": "Mumbai",
      "weekly_premium": 24.5,
      "coverage_hours": 10,
      "risk_score": 0.12,
      "is_safe_zone": true,
      "adjustment_applied": "Hyper-local Safety Discount (No Water Logging)"
    }
    ```

### `POST /insurance/insurance-claim`
**Usecase**: Fully automated claim eligibility checker. Workers can submit their current status to see if they qualify for a parametric payout.
- **Input (JSON)**:
    ```json
    {
      "premium_amt_per_month": 100,
      "location": "Chennai",
      "avg_hours": 8,
      "income": 15000
    }
    ```
- **Internal Logic**:
    - Fetches **AQI**, **Rainfall**, and **News** for the location.
    - **Triggers**: Heavy Rain (>50mm), Toxic AQI (>200), or news about strikes/floods.
    - **Exclusions**: Checks for War, Pandemic, or Nuclear events in news.
- **Response**:
    ```json
    {
      "is_eligible": true,
      "status": "ELIGIBLE",
      "reason": "Automated triggers met. Payout authorized.",
      "triggers_found": ["Heavy Rain (>50mm)"],
      "environment_data": { 
          "rain_mm": 65, 
          "aqi_pm25": 45, 
          "news": "None" 
      },
      "suggested_premium": 1050.0 // Suggested upgrade based on income
    }
    ```

---

## 🛠️ Data Infrastructure
- **Weather Source**: Windy.com (Point Forecast API v2)
- **News Source**: NewsAPI.org
- **Geocoding**: OpenStreetMap (Nominatim)
- **Mock Signals**: Hyper-local risk factors are currently provided via a mock service for demonstration.
