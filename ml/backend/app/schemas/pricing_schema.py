from pydantic import BaseModel
from typing import Optional, List

class DynamicPricingResponse(BaseModel):
    city: str
    weekly_premium: float
    coverage_hours: int
    risk_score: float
    is_safe_zone: bool
    adjustment_applied: str

class ClaimRequest(BaseModel):
    premium_amt_per_month: float
    location: str
    avg_hours: float
    income: float

class ClaimResponse(BaseModel):
    is_eligible: bool
    status: str
    reason: Optional[str] = None
    triggers_found: List[str]
    environment_data: dict
    suggested_premium: Optional[float] = None
