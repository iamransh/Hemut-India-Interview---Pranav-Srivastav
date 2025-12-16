import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")


def create_engine_with_retry(url, retries=10, delay=2):
    for i in range(retries):
        try:
            engine = create_engine(url)
            engine.connect()
            return engine
        except Exception:
            print(f"Waiting for DB... ({i+1}/{retries})")
            time.sleep(delay)
    raise Exception("Database not available")


engine = create_engine_with_retry(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
