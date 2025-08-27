import os
from typing import Optional

class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 20 * 1024 * 1024
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True, "pool_recycle": 1800}
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-jwt")
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 4  # 4 hours


class DevConfig(BaseConfig):
    DEBUG = True

class ProdConfig(BaseConfig):
    DEBUG = False

class TestConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql+psycopg://timetravel:password@localhost:5432/timetravel_test",
    )

def get_config(env: Optional[str]):
    env = env or os.getenv("FLASK_ENV", "development")
    return {"production": ProdConfig, "testing": TestConfig}.get(env, DevConfig)
