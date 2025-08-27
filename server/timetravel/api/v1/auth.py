from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity, get_jwt
)
from email_validator import validate_email, EmailNotValidError
from timetravel.extensions import db
from timetravel.models.user import User

bp = Blueprint("auth", __name__, url_prefix="/auth")

def bad(message, code=400): 
    return jsonify({"message": message}), code

@bp.post("/register")
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    try:
        v = validate_email(email, check_deliverability=False)  # ✅ only syntax check
        email = v.normalized
    except EmailNotValidError:
        return bad("valid email required")

    if len(password) < 6:
        return bad("password must be at least 6 characters")

    u = User(email=email)
    u.set_password(password)
    db.session.add(u)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return bad("email already registered", 409)

    # ✅ identity must be a string, extra claims hold email
    token = create_access_token(
        identity=str(u.id),
        additional_claims={"email": u.email}
    )

    return jsonify(
        user={"id": u.id, "email": u.email, "email_verified": u.email_verified},
        access_token=token
    ), 201

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

    token = create_access_token(
        identity=str(u.id),
        additional_claims={"email": u.email}
    )

    return jsonify(
        user={"id": u.id, "email": u.email, "email_verified": u.email_verified},
        access_token=token
    )

@bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()  # ✅ now a string
    claims = get_jwt()
    return jsonify(me={"id": int(user_id), "email": claims.get("email")})
