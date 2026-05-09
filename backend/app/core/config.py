import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "TaskMind AI")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 11520))
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./taskmind.db")
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")

    class Config:
        case_sensitive = True

settings = Settings()
