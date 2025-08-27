from flask import Blueprint
from .health import bp as health_bp
from .auth import bp as auth_bp

def register_v1(app):
    api = Blueprint("api_v1", __name__, url_prefix="/api/v1")
    api.register_blueprint(health_bp)
    api.register_blueprint(auth_bp)
    app.register_blueprint(api)
