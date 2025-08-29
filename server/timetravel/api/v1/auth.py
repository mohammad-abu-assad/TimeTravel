from datetime import datetime, timedelta, timezone
import secrets, bcrypt
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from email_validator import validate_email, EmailNotValidError

from timetravel.extensions import db
from timetravel.models.user import User
from timetravel.utils.mailer import send_email  # dev fallback prints to console

bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

# ---------- helpers ----------

def bad(message, code=400, **extra):
    payload = {"message": message}
    if extra:
        payload.update(extra)
    return jsonify(payload), code

def now_utc():
    return datetime.now(timezone.utc)

def gen_code(n_digits: int = 6) -> str:
    return str(secrets.randbelow(10**n_digits)).zfill(n_digits)

def hash_code(code: str) -> str:
    return bcrypt.hashpw(code.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_code(code: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(code.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def send_email_verification_code(email: str, code: str) -> None:
    send_email(
        to=email,
        subject="Verify your TimeTravel email",
        text=f"Your verification code is {code}. It expires in 15 minutes."
    )

# ---------- routes ----------

@bp.post("/register")
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    try:
        v = validate_email(email, check_deliverability=False)
        email = v.normalized
    except EmailNotValidError:
        return bad("valid email required")

    if len(password) < 6:
        return bad("password must be at least 6 characters")

    u = User(email=email)
    u.set_password(password)

    # generate 6-digit code valid for 15 minutes
    code = gen_code(6)
    u.set_verify_code(hash_code(code), now_utc() + timedelta(minutes=15))
    u.email_verified = False
    u.email_verified_at = None

    db.session.add(u)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return bad("email already registered", 409)

    send_email_verification_code(u.email, code)

    # optional: issue access token so UI can hit /me or just navigate to /verify
    token = create_access_token(identity=str(u.id), additional_claims={"email": u.email})
    return jsonify(
        user={"id": u.id, "email": u.email, "email_verified": u.email_verified},
        access_token=token,
        pending_verification=True
    ), 201


@bp.post("/verify-email")
def verify_email():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    code = (data.get("code") or "").strip()

    if not email or not code:
        return bad("email and code required")

    u = User.query.filter_by(email=email).first()
    if not u:
        return bad("user not found", 404)

    if u.email_verified:
        token = create_access_token(identity=str(u.id), additional_claims={"email": u.email})
        return jsonify(
            message="already verified",
            user={"id": u.id, "email": u.email, "email_verified": True},
            access_token=token
        ), 200

    if not u.verify_code_hash or not u.verify_code_expires_at:
        return bad("no active verification code, please resend", 400)

    expiry = u.verify_code_expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if now_utc() > expiry:
        return bad("verification code expired, please resend", 400)

    if not check_code(code, u.verify_code_hash):
        return bad("invalid verification code", 400)

    u.mark_email_verified()
    u.clear_verify_code()
    db.session.commit()

    token = create_access_token(identity=str(u.id), additional_claims={"email": u.email})
    return jsonify(
        message="email verified",
        user={"id": u.id, "email": u.email, "email_verified": True},
        access_token=token
    ), 200


@bp.post("/resend-code")
def resend_code():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return bad("email required")

    u = User.query.filter_by(email=email).first()
    if not u:
        return bad("user not found", 404)

    if u.email_verified:
        return bad("email already verified", 400)

    # simple cooldown: require previous code to expire first
    if u.verify_code_expires_at:
        expiry = u.verify_code_expires_at
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)
        if now_utc() < expiry:
            return bad("a valid code already exists; please wait or use that code", 429)

    code = gen_code(6)
    u.set_verify_code(hash_code(code), now_utc() + timedelta(minutes=15))
    db.session.commit()

    send_email_verification_code(u.email, code)
    return jsonify(message="verification code resent"), 200


@bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return bad("email and password required")

    u = User.query.filter_by(email=email).first()
    if not u or not u.check_password(password):
        return bad("invalid credentials", 401)

    if not u.email_verified:
        return bad("email not verified", 403, email_not_verified=True)

    token = create_access_token(identity=str(u.id), additional_claims={"email": u.email})
    return jsonify(
        user={"id": u.id, "email": u.email, "email_verified": u.email_verified},
        access_token=token
    ), 200


@bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()  # string
    claims = get_jwt()
    return jsonify(me={"id": int(user_id), "email": claims.get("email")})
