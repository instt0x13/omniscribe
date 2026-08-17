"""API version 1 routes."""

from app.api.v1.notes import router

# Собираем все роутеры v1
routers = [router]

__all__ = ["routers"]