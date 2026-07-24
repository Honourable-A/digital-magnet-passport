from pydantic import BaseModel

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "PUBLIC"

class LoginRequest(BaseModel):
    email: str
    password: str
