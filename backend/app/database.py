import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Si no existe DATABASE_URL, usa SQLite para tests
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# connect_args solo es necesario para SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_engine(url=None):
    """
    Permite a los tests crear un engine temporal sin afectar al engine global.
    """
    url = url or DATABASE_URL
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=connect_args)