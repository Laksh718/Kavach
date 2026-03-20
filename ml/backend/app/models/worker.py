from sqlalchemy import Column, Integer, String, Float, Boolean
from backend.app.database.session import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    location = Column(String) # E.g., "Chennai", "Mumbai"
    gps_lat = Column(Float, nullable=True)
    gps_lon = Column(Float, nullable=True)
    upi_id = Column(String, nullable=True)
    base_income_daily = Column(Float, default=1000.0) # Base coverage target
    risk_score = Column(Float, default=1.0) # Multiplier based on historical metrics
    is_active = Column(Boolean, default=True)
