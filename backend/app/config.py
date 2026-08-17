import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # База данных
    DATABASE_URL: str = "postgresql+psycopg://user:password@db:5432/omniscribe"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:5174"]
    
    # Приложение
    APP_NAME: str = "OmniScribe API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Безопасность
    SECRET_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()