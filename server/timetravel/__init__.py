from flask import Flask
from .config import get_config
from .extensions import db, migrate, cors
from .api.v1 import register_v1
from .middleware.errors import register_error_handlers

def create_app(env=None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config(env))
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    register_v1(app)
    register_error_handlers(app)
    return app
