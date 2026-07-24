from pydantic import BaseModel

class RecycledVerifyRequest(BaseModel):
    passport_id: int
    threshold: float

class ElementVerifyRequest(BaseModel):
    passport_id: int
    element: str
    threshold: float

class RecycledZKPRequest(BaseModel):
    passport_id: int
    recycled_threshold: float
