"""OmniScribe Backend Application."""

# Экспортируем основные компоненты для удобного импорта
from app.main import app
from app.config import settings

__all__ = ["app", "settings"]