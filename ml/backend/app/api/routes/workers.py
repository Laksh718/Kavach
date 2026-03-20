from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database.session import get_db
from backend.app.models.worker import Worker
from backend.app.schemas.worker import WorkerCreate, WorkerResponse, WorkerUpdate

from backend.app.services.risk_service import get_worker_risk_profile # API Metric

router = APIRouter()

@router.get("/risk/{worker_id}")
def get_worker_risk(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    profile = get_worker_risk_profile(worker.location, worker.base_income_daily)
    return profile

@router.post("/", response_model=WorkerResponse)
def create_worker(worker: WorkerCreate, db: Session = Depends(get_db)):
    db_worker = Worker(**worker.model_dump())
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

@router.get("/", response_model=List[WorkerResponse])
def read_workers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    workers = db.query(Worker).offset(skip).limit(limit).all()
    return workers

@router.get("/{worker_id}", response_model=WorkerResponse)
def read_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if worker is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@router.put("/{worker_id}", response_model=WorkerResponse)
def update_worker(worker_id: int, worker_update: WorkerUpdate, db: Session = Depends(get_db)):
    db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if db_worker is None:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    update_data = worker_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_worker, key, value)
        
    db.commit()
    db.refresh(db_worker)
    return db_worker
