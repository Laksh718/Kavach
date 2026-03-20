from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.session import get_db
from backend.app.models.policy import Policy
from backend.app.models.worker import Worker
from backend.app.schemas.policy import PolicyCreate, PolicyResponse

from backend.app.services.risk_service import calculate_weekly_premium # AI Risk Service

router = APIRouter()

@router.post("/", response_model=PolicyResponse)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    # Verify worker exists
    worker = db.query(Worker).filter(Worker.id == policy.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    policy_data = policy.model_dump()
    
    # AI Risk Premium calculation
    if policy_data.get("weekly_premium") is None:
        policy_data["weekly_premium"] = calculate_weekly_premium(worker.location, policy.daily_coverage)
        
    db_policy = Policy(**policy_data)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.get("/", response_model=List[PolicyResponse])
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = db.query(Policy).offset(skip).limit(limit).all()
    return policies

@router.get("/worker/{worker_id}", response_model=List[PolicyResponse])
def read_worker_policies(worker_id: int, db: Session = Depends(get_db)):
    policies = db.query(Policy).filter(Policy.worker_id == worker_id).all()
    return policies
