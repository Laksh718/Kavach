# 🛡️ Kavach-ML API Documentation (v1.1.0)

Welcome to the **Kavach-ML** technical guide. This API is the "intelligence layer" for the Kavach ecosystem, providing machine-learning-driven parametric insurance signals, real-time risk assessments, and automated claim processing.

**Base URL:** `https://kavach-ml-y38n.onrender.com/`

---

## 🛰️ 1. Zero-Touch Parametric Flow
### `GET /run-live/{city}`
This is the core endpoint for the **Kavach Dashboard**. In a single call, it synchronizes real-time environmental data with actuarial models to determine if an insurance payout is warranted.

#### **Request**
- **Method:** `GET`
- **Path Parameter:** `city` (string) - e.g., `Mumbai`, `Delhi`, `Chennai`.

#### **Why use this in the Frontend?**
- **Dashboard State:** Use this to show a user the "Health" of their zone.
- **Automated Payouts:** If `claims_management.status` is `TRIGGERED`, you should immediately show a payout notification or confetti effect.
- **Risk Transparency:** Show the `risk_probability` to explain why premiums might be higher today.

#### **Response Schema (Key Fields)**
```json
{
  "city": "Mumbai",
  "parametric_signals": {
    "weather": { "precip_mm": 55, "is_heavy_rain": true, "is_toxic_aqi": false },
    "news": { "news_trigger": false, "news_description": "Normal traffic..." }
  },
  "actuarial_pricing": {
    "risk_probability": 0.1245,
    "weekly_gross_premium": "₹28.5"
  },
  "claims_management": {
    "status": "TRIGGERED", 
    "payout_inr": 300,
    "recommendation": "Payout Authorized Automatically"
  }
}
```

---

## 🧠 2. Predictive Insights

### `POST /predict/disruption`
Predicts the likelihood of a major logistics disruption in a city within the next hour using the Disruption ML Model.

#### **Request Body**
```json
{ "city_name": "Bangalore" }
```

#### **Frontend Use Case: "Predictive Alerts"**
- **Home Screen:** If `disruption == 1`, show a warning: *"High probability of route-wide disruptions. Stay safe!"*
- **Confidence Badge:** Display the `confidence` score (0-1) to build user trust in the AI's accuracy.

---

### `POST /predict/earnings`
A "What-If" tool for gig workers. It predicts how much they will earn in a specific shift, adjusted for real-time weather and air quality.

#### **Request Body**
```json
{
  "city_name": "Mumbai",
  "day_of_week": 5, // 0 (Mon) to 6 (Sun)
  "hour_bucket": 18, // 24hr format
  "platform": 1, // 0: Swiggy, 1: Zomato, 2: Porter, 3: Uber
  "worker_avg": 250.0 // User's historical hourly average
}
```

#### **Frontend Use Case: "Earnings Planner"**
- **Income Slider:** Let users adjust their `hour_bucket` and `platform` to see where they can maximize earnings despite the weather.
- **Deviation Factor:** Show how rainfall impacts income (e.g., *"Rain is increasing demand, boosting earnings by 15%!"*).

---

## 🛡️ 3. Insurance Logic & Claims

### `GET /insurance/dynamic-pricing/{city}`
Calculates a personalized weekly premium based on **Hyper-local Risk** (e.g., history of water logging in a specific sub-zone).

#### **Request**
- **Method:** `GET`
- **Path Parameter:** `city` (e.g., `Mumbai_Island_City`, `Bangalore_South`)

#### **Frontend Use Case: "Smart Checkout"**
- **Safe Zone Discount:** If `is_safe_zone` is true, highlight the discount in green: *"₹2 Hyper-local Safety Discount Applied!"*
- **Predictive Coverage:** If `coverage_hours` increases (e.g., from 8 to 10), show a message: *"Rain predicted: Automatically extending your protection for +2 hours!"*

---

### `POST /insurance/insurance-claim`
The "Validator" for filing claims. It uses multi-signal verification (Weather + News + Actuarial logic) to instantly approve or deny a claim.

#### **Request Body**
```json
{
  "premium_amt_per_month": 100,
  "location": "Chennai",
  "income": 15000,
  "avg_hours": 8
}
```

#### **Frontend Use Case: "Instant Claims Hub"**
- **Eligibility UI:** If `is_eligible` is false, show the `reason` (e.g., *"No environmental triggers detected"*).
- **Upsell Opportunity:** If `suggested_premium` is present, it means the user is under-insured relative to their income. Show an "Upgrade Coverage" button.
- **Verification Proof:** Display `triggers_found` (e.g., "Heavy Rain", "News Disruption") to show why the claim was approved.

---

## 🗺️ 4. Data Mappings & Constants

### **City Mapping (Internal IDs)**
The ML models use integer IDs for the `city` field. The backend maps them automatically for you, but for training or direct model access, these are the IDs:
- `Bangalore`: 0
- `Chennai`: 1
- `Mumbai`: 2
- `Kolkata`: 3
- `Delhi`: 4

### **Exclusion Clauses**
Claims are automatically **denied** (Status: `EXCLUDED`) if the live News API detects these keywords:
- `war`, `invasion`, `pandemic`, `covid`, `nuclear`, `terrorism`.

---

## 🛠️ Integration Best Practices

1. **Handle "Signal Lost"**: If the API returns a 500 error or `status: error`, it usually means the external Weather/News provider is down. Display: *"Live environmental signals temporarily unavailable. Defaulting to standard processing."*
2. **Polling vs. Fetching**: Do not poll these endpoints every second. Environmental signals (Weather/AQI) update every 15-30 minutes. Fetching once per app session or on dashboard manual refresh is sufficient.
3. **Hyper-local Input**: Use specific keys like `mumbai_island_city` in the `/dynamic-pricing` endpoint to trigger local discounts.
