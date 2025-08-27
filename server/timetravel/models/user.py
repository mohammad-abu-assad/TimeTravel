from datetime import datetime
from timetravel.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)  # required for password users
    email_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, plain: str):
        self.password_hash = generate_password_hash(plain)

    def check_password(self, plain: str) -> bool:
        return check_password_hash(self.password_hash, plain)
