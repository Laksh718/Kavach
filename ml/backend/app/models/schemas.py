from pydantic import BaseModel
from typing import Optional

class DisruptionRequest(BaseModel):
    rainfall: float
    aqi: float
    temperature: float

class DisruptionResponse(BaseModel):
    disruption: int
    confidence: float

class EarningsRequest(BaseModel):
    day_of_week: int
    hour_bucket: int
    city: int
    platform: int
    rainfall: float
    aqi: float
    worker_avg: Optional[float] = 250.0

class EarningsResponse(BaseModel):
    expected_earnings: float
    base_prediction: float
    deviation_factor: float

class PipelineEventRequest(BaseModel):
    rainfall: float
    aqi: float
    temperature: float
    day_of_week: int
    hour_bucket: int
    city: int
    platform: int

class WorkerData(BaseModel):
    worker_id: int
    avg_earnings: float
    actual_earnings: float
    fraud_features: dict

class PipelineRequest(BaseModel):
    event: PipelineEventRequest
    worker: WorkerData

class PipelineResponse(BaseModel):
    status: str
    payout: Optional[dict] = None
    loss: Optional[float] = None
