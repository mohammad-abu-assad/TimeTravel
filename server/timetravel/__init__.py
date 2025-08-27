from flask import Flask
from .config import get_config
from .extensions import db, migrate, cors, jwt
from .api.v1 import register_v1
from .middleware.errors import register_error_handlers
from dotenv import load_dotenv

def create_app(env=None) -> Flask:
    app = Flask(__name__)
    load_dotenv()
    app.config.from_object(get_config(env))
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    jwt.init_app(app)
    register_v1(app)
    register_error_handlers(app)
    return app
