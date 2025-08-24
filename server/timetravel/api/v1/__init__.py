from flask import Blueprint
from .health import bp as health_bp

def register_v1(app):
    api = Blueprint("api_v1", __name__, url_prefix="/api/v1")
    api.register_blueprint(health_bp)
    app.register_blueprint(api)
