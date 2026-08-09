from pydantic import BaseModel

class CurrentUser(BaseModel):
    supabase_uid: str
    email: str
    role: str
