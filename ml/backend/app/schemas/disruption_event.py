from pydantic import BaseModel
from datetime import datetime

class DisruptionEventBase(BaseModel):
    event_type: str # "Rain", "AQI"
    severity_value: float
    location: str
    event_description: str = "Standard disruption" # For Eligibility Rules
    city_status: str = "open" # "open", "lockdown", "emergency"

class DisruptionEventCreate(DisruptionEventBase):
    pass

class DisruptionEventResponse(DisruptionEventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
