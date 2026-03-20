from pydantic import BaseModel
from datetime import datetime

class DisruptionEventBase(BaseModel):
    event_type: str # "Rain", "AQI"
    severity_value: float
    location: str

class DisruptionEventCreate(DisruptionEventBase):
    pass

class DisruptionEventResponse(DisruptionEventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
