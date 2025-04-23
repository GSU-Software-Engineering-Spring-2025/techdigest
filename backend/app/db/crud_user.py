from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate

async def create_user(db: Session, email: str, hashed_password: str, full_name: str):
    db_user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()