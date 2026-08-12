from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db

from app.api.v1.router import router as v1_router
from app.api.v1.verify import router as verify_router
from app.api.v1.graph import router as graph_router


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    v1_router,
    prefix=settings.api_v1_prefix
)

app.include_router(
    verify_router,
    prefix=settings.api_v1_prefix
)

app.include_router(
    graph_router,
    prefix=settings.api_v1_prefix
)


@app.on_event("startup")
def startup():
    try:
        init_db()
    except Exception as error:
        print(f"Database initialisation skipped: {error}")


@app.get("/")
def root():
    return {
        "message": "Welcome to Digital Magnet Passport API"
    }