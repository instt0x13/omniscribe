"""Database models."""

from app.models.note import Note

# Экспортируем все модели для удобного импорта
# Теперь можно писать: from app.models import Note
__all__ = ["Note"]