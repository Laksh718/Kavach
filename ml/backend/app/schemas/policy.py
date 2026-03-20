from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PolicyBase(BaseModel):
    worker_id: int
    weekly_premium: Optional[float] = None # Calculated by AI Risk Engine
    daily_coverage: float
    rain_threshold_mm: Optional[float] = 50.0
    aqi_threshold: Optional[float] = 200.0

class PolicyCreate(PolicyBase):
    pass

class PolicyResponse(PolicyBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
