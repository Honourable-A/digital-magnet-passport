from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import init_db
from app.api.v1.router import router as v1_router
from app.api.v1.verify import router as verify_router
from app.api.v1.p2p import router as p2p_router
from app.api.v1.signal_test import router as signal_router
# from app.api.v1.graph import router as graph_router   # neo4j — not in scope for demonstrator
# from app.api.v1.admin import router as admin_router   # stubs — user management via supabase dashboard

app = FastAPI(title=settings.app_name, debug=settings.debug)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(v1_router, prefix=settings.api_v1_prefix)      # health check only
app.include_router(verify_router, prefix=settings.api_v1_prefix)  # zkp verification
app.include_router(p2p_router, prefix=settings.api_v1_prefix)     # p2p peer discovery
app.include_router(signal_router)                                  # websocket signaling
# app.include_router(graph_router, prefix=settings.api_v1_prefix)
# app.include_router(admin_router, prefix=settings.api_v1_prefix)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "TRACE4MAGNET FastAPI — ZKP / P2P services"}
