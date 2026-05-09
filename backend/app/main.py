from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.middleware.rate_limit import rate_limiter
from app.db.session import engine, Base
from app.models import * # Import models to ensure they are registered

def get_application() -> FastAPI:
    # Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)

    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )

    # Rate limiting
    application.middleware("http")(rate_limiter)

    # Set all CORS enabled origins
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application

app = get_application()

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
