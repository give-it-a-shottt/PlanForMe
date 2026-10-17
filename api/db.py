import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


def _database_url() -> str:
    url = os.getenv("DATABASE_URL") or "sqlite:///./planforme.db"
    # Neon/Vercel이 주는 postgres:// 주소를 psycopg3 드라이버용으로 바꾼다
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]
    return url


DATABASE_URL = _database_url()
_is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if _is_sqlite else {},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
