from pydantic import BaseModel, EmailStr
from typing import Optional

class WorkerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    gps_lat: Optional[float] = None
    gps_lon: Optional[float] = None
    upi_id: Optional[str] = None
    base_income_daily: float = 1000.0
    exposure_factor: float = 1.0 # 0.5 (low) to 1.5 (high)
    past_claims: int = 0
    risk_score: float = 0.5

class WorkerCreate(WorkerBase):
    pass

class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    gps_lat: Optional[float] = None
    gps_lon: Optional[float] = None
    upi_id: Optional[str] = None
    base_income_daily: Optional[float] = None
    risk_score: Optional[float] = None
    is_active: Optional[bool] = None

class WorkerResponse(WorkerBase):
    id: int
    risk_score: float
    is_active: bool

    class Config:
        from_attributes = True
