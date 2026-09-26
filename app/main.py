from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db

from app.api.v1.router import router as v1_router
from app.api.v1.verify import router as verify_router
from app.api.v1.graph import router as graph_router
from app.api.v1.admin import router as admin_router
from app.api.v1.signal import router as signal_router

from app.api.v1.p2p import router as p2p_router
from app.api.v1.protocol import router as protocol_router


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug
)


# Static ZKP assets
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)



# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://10.97.129.109:3000",
    "https://trace4magnet.vercel.app",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Existing routes
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

app.include_router(
    admin_router,
    prefix=settings.api_v1_prefix
)



# ZKP routes
app.include_router(
    p2p_router,
    prefix=settings.api_v1_prefix
)

app.include_router(
    protocol_router,
    prefix=settings.api_v1_prefix
)

app.include_router(signal_router)

from app.api.v1 import zkp
app.include_router(
    zkp.router,
    prefix=settings.api_v1_prefix
)

@app.on_event("startup")
def startup():

    try:
        init_db()

    except Exception as error:

        print(
            f"Database initialisation skipped: {error}"
        )



@app.get("/")
def root():

    return {
        "message":
        "Digital Magnet Passport API with ZKP services"
    }