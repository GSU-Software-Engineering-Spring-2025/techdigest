from fastapi import APIRouter, Depends
from app.db.session import get_db
from app.db.repositories.item_repo import ItemRepository

router = APIRouter(prefix="/api/items", tags=["items"])

@router.get("/")
def read_items(db=Depends(get_db)):
    return ItemRepository(db).get_all()