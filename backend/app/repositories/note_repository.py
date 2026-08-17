from sqlalchemy.orm import Session
from app.models import Note
from app.schemas import NoteCreate

class NoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Note]:
        return self.db.query(Note).all()

    def get_by_id(self, note_id: int) -> Note | None:
        return self.db.query(Note).filter(Note.id == note_id).first()

    def create(self, note_data: NoteCreate) -> Note:
        db_note = Note(**note_data.model_dump())
        self.db.add(db_note)
        self.db.commit()
        self.db.refresh(db_note)
        return db_note

    def update(self, note_id: int, note_data: NoteCreate) -> Note | None:
        db_note = self.get_by_id(note_id)
        if db_note:
            db_note.title = note_data.title
            db_note.content = note_data.content
            self.db.commit()
            self.db.refresh(db_note)
        return db_note