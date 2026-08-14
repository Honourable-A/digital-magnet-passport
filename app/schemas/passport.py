from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class PassportCreate(BaseModel):
    passport_id: str
    magnet_type: str
    application_sector: str
    current_stage: str
    manufacturing_date: date
    country_of_origin: str
    recycled_content: Optional[float] = None
    carbon_footprint: Optional[float] = None
    status: bool = True

class PassportUpdate(BaseModel):
    magnet_type: Optional[str] = None
    application_sector: Optional[str] = None
    current_stage: Optional[str] = None
    manufacturing_date: Optional[date] = None
    country_of_origin: Optional[str] = None
    recycled_content: Optional[float] = None
    carbon_footprint: Optional[float] = None
    status: Optional[bool] = None

class PassportOut(BaseModel):
    id: int
    passport_id: str
    magnet_type: str
    application_sector: str
    current_stage: str
    manufacturing_date: date
    country_of_origin: str
    recycled_content: Optional[float]
    carbon_footprint: Optional[float]
    status: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
