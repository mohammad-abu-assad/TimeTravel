# timetravel/models/user.py
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from timetravel.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(320), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)

    # email verification
    email_verified = db.Column(db.Boolean, nullable=False, default=False)
    email_verified_at = db.Column(db.DateTime(timezone=True), nullable=True)
    verify_code_hash = db.Column(db.String(255), nullable=True)
    verify_code_expires_at = db.Column(db.DateTime(timezone=True), nullable=True)

    # audit
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # ---- password helpers
    def set_password(self, raw: str) -> None:
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw: str) -> bool:
        return bool(self.password_hash) and check_password_hash(self.password_hash, raw)

    # ---- verification helpers
    def set_verify_code(self, code_hash: str, expires_at) -> None:
        self.verify_code_hash = code_hash
        self.verify_code_expires_at = expires_at

    def clear_verify_code(self) -> None:
        self.verify_code_hash = None
        self.verify_code_expires_at = None

    def mark_email_verified(self) -> None:
        self.email_verified = True
        self.email_verified_at = datetime.now(timezone.utc)
