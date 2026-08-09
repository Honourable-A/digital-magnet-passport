from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import init_db
from app.api.v1.router import router as v1_router
from app.api.v1.p2p import router as p2p_router
from app.api.v1.signal_test import router as signal_router

app = FastAPI(title=settings.app_name, debug=settings.debug)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(v1_router, prefix=settings.api_v1_prefix)
app.include_router(p2p_router, prefix=settings.api_v1_prefix)
app.include_router(signal_router)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "TRACE4MAGNET FastAPI — ZKP / P2P services"}
