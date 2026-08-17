from app.repositories.note_repository import NoteRepository
from app.schemas.note import NoteCreate, NoteResponse

class NoteService:
    def __init__(self, repository: NoteRepository):
        self.repository = repository

    def get_all_notes(self) -> list[NoteResponse]:
        notes = self.repository.get_all()
        return [NoteResponse.model_validate(note) for note in notes]

    def get_note(self, note_id: int) -> NoteResponse | None:
        note = self.repository.get_by_id(note_id)
        return NoteResponse.model_validate(note) if note else None

    def create_note(self, note_data: NoteCreate) -> NoteResponse:
        note = self.repository.create(note_data)
        return NoteResponse.model_validate(note)

    def update_note(self, note_id: int, note_data: NoteCreate) -> NoteResponse | None:
        note = self.repository.update(note_id, note_data)
        return NoteResponse.model_validate(note) if note else None