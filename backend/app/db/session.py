from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Получаем URL базы данных из переменных окружения
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://user:password@db:5432/omniscribe")

# Создаем engine
engine = create_engine(DATABASE_URL)

# Создаем фабрику сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Функция для получения сессии в роутерах
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()