from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL configuration (use environment variables in production)
SQLALCHEMY_DATABASE_URL = "sqlite:///./techdigest.db"

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Only needed for SQLite
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    """
    Generator function that yields database sessions
    Use with FastAPI's Depends() system
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()