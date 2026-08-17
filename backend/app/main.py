from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import notes
from app.db.base import Base
from app.db.session import engine

app = FastAPI(title="OmniScribe API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

# Подключение роутеров
app.include_router(notes.router)

@app.get("/")
def root():
    return {"message": "Welcome to OmniScribe API", "status": "running"}