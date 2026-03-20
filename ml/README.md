# Kavach-ML Model

**Kavach-ML Model** is a parametric insurance platform designed to protect gig workers (delivery riders, drivers, couriers) from income loss caused by external disruptions such as heavy rain, pollution, heatwaves, or strikes.

Instead of manual insurance claims, Kavach-ML Model automatically detects disruption events and triggers payouts based on predefined conditions.

---

# Problem

Gig economy workers rely on daily income.

However, factors like:

* Heavy rainfall
* Extreme heat
* High air pollution
* Traffic shutdowns
* Local strikes
* Government restrictions

can reduce their working hours and cause significant income loss.

Traditional insurance systems do not cover these micro-disruptions.

Kavach-ML Model solves this using **parametric insurance automation**.

---

# Core Idea

Instead of claim submission:

```
event occurs
↓
system detects disruption
↓
worker impact verified
↓
automatic payout triggered
```

No paperwork. No claim processing.

---

# Features

## Worker Protection

Workers receive automated payouts when disruptions affect their work.

Examples:

| Event            | Condition       | Payout |
| ---------------- | --------------- | ------ |
| Heavy Rain       | Rainfall > 50mm | ₹120   |
| Extreme Heat     | Temp > 45°C     | ₹100   |
| Severe Pollution | AQI > 350       | ₹100   |

---

## Risk Prediction

Machine learning models estimate disruption risk for different zones.

Example:

| Zone            | Risk Score | Premium  |
| --------------- | ---------- | -------- |
| Central Chennai | 0.21       | ₹10/week |
| OMR             | 0.33       | ₹15/week |
| North Chennai   | 0.48       | ₹22/week |

---

## Automated Trigger System

Real-time monitoring of:

* Weather APIs
* AQI data
* Traffic data
* Worker GPS activity

Triggers payouts automatically.

---

## Fraud Detection

Prevents misuse through anomaly detection:

* GPS spoofing detection
* Activity pattern validation
* Weather verification
* Device fingerprinting

---

# System Architecture

```
Worker App
     │
API Gateway
     │
 ┌─────────────┬─────────────┬─────────────┐
 │             │             │
Risk Engine   Trigger Engine   Fraud Engine
 │             │             │
 └─────────────┴─────────────┘
          │
      Payout Engine
          │
      Payment APIs
```

---

# Tech Stack

## Backend

* Python
* FastAPI
* PostgreSQL

## Frontend

* React
* Next.js
* TypeScript

## Machine Learning

* Scikit-learn
* XGBoost
* Pandas
* NumPy

## Data Sources

* Weather APIs
* Air Quality APIs
* Traffic APIs
* GPS signals

## Infrastructure

* Docker
* Kubernetes
* Terraform

---

# Project Structure

```
kavach-ml-model/
│
├── backend/
├── frontend/
├── ml/
├── data/
├── pipelines/
├── services/
├── infra/
├── tests/
├── configs/
└── docs/
```

---

# Development Setup

## 1. Clone repository

```
git clone https://github.com/yourusername/kavach-ml-model.git
cd kavach-ml-model
```

---

## 2. Create virtual environment

```
python -m venv venv
source venv/bin/activate
```

Windows:

```
venv\Scripts\activate
```

---

## 3. Install dependencies

```
pip install -r requirements.txt
```

---

## 4. Run backend server

```
uvicorn backend.app.main:app --reload
```

Server will run on:

```
http://localhost:8000
```

API docs:

```
http://localhost:8000/docs
```

---

# Development Roadmap

## Phase 1

* Worker onboarding
* Policy creation
* Weather trigger engine
* Basic payout simulation

## Phase 2

* Risk prediction model
* Fraud detection system
* Automated disruption monitoring

## Phase 3

* Real-time payout automation
* Admin analytics dashboard
* Risk heatmaps

---

# Example Disruption Flow

```
Heavy Rain Detected
↓
Rainfall > 60mm
↓
Workers inactive in affected zone
↓
Fraud check passed
↓
Payout triggered automatically
```

---

# Future Improvements

* Dynamic premium pricing
* Community insurance pools
* Real gig-platform integrations
* Mobile app for workers

---

# License

MIT License
