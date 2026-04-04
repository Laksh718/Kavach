from pydantic import BaseModel
from typing import Optional

class DisruptionRequest(BaseModel):
    city_name: str = "Mumbai"

class DisruptionResponse(BaseModel):
    disruption: int
    confidence: float
    message: Optional[str] = None

class EarningsRequest(BaseModel):
    city_name: str = "Mumbai"
    day_of_week: int
    hour_bucket: int
    platform: int
    worker_avg: Optional[float] = 250.0

class EarningsResponse(BaseModel):
    expected_earnings: float
    base_prediction: float
    deviation_factor: float
    message: Optional[str] = None

class PipelineEventRequest(BaseModel):
    city_name: str = "Mumbai"
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
