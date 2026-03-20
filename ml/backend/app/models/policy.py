from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.app.database.session import Base
import datetime

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"))
    weekly_premium = Column(Float)
    daily_coverage = Column(Float) # Money sent per day of disruption
    
    # Parametric Triggers
    rain_threshold_mm = Column(Float, default=50.0) # > 50mm rainfall
    aqi_threshold = Column(Float, default=200.0)    # > 200 AQI
    
    status = Column(String, default="ACTIVE") # "ACTIVE", "EXPIRED", "CANCELLED"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship
    worker = relationship("Worker")
