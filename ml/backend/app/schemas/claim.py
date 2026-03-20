from pydantic import BaseModel
from datetime import datetime

class PayoutBase(BaseModel):
    worker_id: int
    event_id: int
    amount: float
    status: str

class PayoutResponse(PayoutBase):
    id: int
    triggered_at: datetime

    class Config:
        from_attributes = True
