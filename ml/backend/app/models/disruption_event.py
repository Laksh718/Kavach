from sqlalchemy import Column, Integer, String, Float, DateTime
from backend.app.database.session import Base
import datetime

class DisruptionEvent(Base):
    __tablename__ = "disruption_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String) # "Rain", "AQI"
    severity_value = Column(Float) # e.g., mm of rain, or AQI index
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
