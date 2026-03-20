from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.app.database.session import Base
import datetime

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"))
    event_id = Column(Integer, ForeignKey("disruption_events.id"))
    amount = Column(Float)
    status = Column(String, default="APPROVED") # "APPROVED", "FRAUD_SUSPECTED", "PAID"
    triggered_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    worker = relationship("Worker")
    event = relationship("DisruptionEvent")
