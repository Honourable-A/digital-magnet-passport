from fastapi import FastAPI
from app.config import settings
from app.database import init_db
from app.api.v1.router import router as v1_router
from app.api.v1.verify import router as verify_router
from app.api.v1.graph import router as graph_router

app = FastAPI(title=settings.app_name, debug=settings.debug)
app.include_router(v1_router, prefix=settings.api_v1_prefix)
app.include_router(verify_router, prefix=settings.api_v1_prefix)
app.include_router(graph_router, prefix=settings.api_v1_prefix)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Welcome to Digital Magnet Passport API"}
