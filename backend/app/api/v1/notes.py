from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.services import NoteService
from app.repositories import NoteRepository
from app.schemas import NoteCreate, NoteResponse

router = APIRouter(prefix="/notes", tags=["notes"])

def get_note_service(db: Session = Depends(get_db)) -> NoteService:
    repository = NoteRepository(db)
    return NoteService(repository)

@router.get("/", response_model=list[NoteResponse])
def get_notes(service: NoteService = Depends(get_note_service)):
    return service.get_all_notes()

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(note: NoteCreate, service: NoteService = Depends(get_note_service)):
    return service.create_note(note)

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteCreate, service: NoteService = Depends(get_note_service)):
    updated = service.update_note(note_id, note)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return updated