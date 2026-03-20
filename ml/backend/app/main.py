import sys
import os
# Add root to path for imports to work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import FastAPI
from pydantic import BaseModel
from backend.app.services.pipeline_service import run_full_pipeline
from backend.app.services.payout_service import get_all_payouts
from backend.app.routers import predictions
from backend.app.services.pipeline_service import run_pipeline_with_live_weather

app = FastAPI(
    title="Kavach-ML Model API",
    description="API for Parametric Insurance Workflow",
    version="1.1.0"
)

# -------------------------
# Request Schemas
# -------------------------

class Event(BaseModel):
    rainfall: float
    aqi: float
    temperature: float
    day_of_week: int
    hour_bucket: int
    city: int
    platform: int

class FraudFeatures(BaseModel):
    active_hours: float
    gps_variance: float
    earnings_drop: float
    claim_frequency: float

class Worker(BaseModel):
    worker_id: int
    avg_earnings: float
    actual_earnings: float
    fraud_features: FraudFeatures

class PipelineRequest(BaseModel):
    event: Event
    worker: Worker

# -------------------------
# Routes
# -------------------------

@app.get("/")
def root():
    return {"message": "Kavach-ML Model API running 🚀"}

@app.post("/run-pipeline")
def run_pipeline(req: PipelineRequest):
    result = run_full_pipeline(
        event=req.event.dict(),
        worker={
            "worker_id": req.worker.worker_id,
            "avg_earnings": req.worker.avg_earnings,
            "actual_earnings": req.worker.actual_earnings,
            "fraud_features": req.worker.fraud_features.dict()
        }
    )
    return result

@app.get("/payouts")
def get_payouts():
    return get_all_payouts()

@app.get("/run-live/{city}")
def run_live(city: str):
    worker = {
        "worker_id": 999,
        "avg_earnings": 300,
        "actual_earnings": 120,
        "fraud_features": {
            "active_hours": 5,
            "gps_variance": 1.5,
            "earnings_drop": 0.6,
            "claim_frequency": 1
        }
    }
    return run_pipeline_with_live_weather(city, worker)

# Include other detailed prediction endpoints for full Swagger reference
app.include_router(predictions.router)
