import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from app.core.config import settings
from app.db.session import Base
from app.models import *  # Import all models to ensure they are registered with Base

def init_db():
    # 1. Ensure the database file is created by simply connecting and creating tables
    print(f"Initializing SQLite database for {settings.PROJECT_NAME}...")
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
    )
    
    try:
        # Create all tables
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Successfully initialized database and created all tables!")
    except Exception as e:
        print(f"ERROR: Failed to initialize database.")
        print(f"Details: {e}")

if __name__ == "__main__":
    # Add parent directory to sys.path to allow imports from 'app'
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    init_db()
