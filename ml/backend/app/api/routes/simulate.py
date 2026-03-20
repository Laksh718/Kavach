from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.schemas.disruption_event import DisruptionEventCreate, DisruptionEventResponse
from backend.app.models.disruption_event import DisruptionEvent
from backend.app.services.trigger_service import evaluate_disruption
from backend.app.models.claim import Payout
from typing import List

router = APIRouter()

@router.post("/trigger_event", response_model=DisruptionEventResponse)
def trigger_simulated_event(event_data: DisruptionEventCreate, db: Session = Depends(get_db)):
    """
    Simulate a weather/AQI event leading to automated evaluation of active policies for direct auto-payout issuance.
    """
    db_event = DisruptionEvent(**event_data.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Parametric Action Rule eval
    evaluate_disruption(db, db_event)
    
    return db_event

@router.get("/payouts", response_model=List[dict])
def get_payouts(db: Session = Depends(get_db)):
    payouts = db.query(Payout).all()
    # Simple list mapping
    return [{
        "id": p.id,
        "worker_id": p.worker_id,
        "event_id": p.event_id,
        "amount": p.amount,
        "status": p.status,
        "triggered_at": p.triggered_at
    } for p in payouts]
