from flask import request, jsonify
from config import app, db
from models import User
from passlib.hash import pbkdf2_sha256
import random

from reset import send_email


@app.route("/sign_up", methods=["POST"])
def sign_up():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    user_name = request.json.get("userName")
    password = request.json.get("password")
    email = request.json.get("email")
    phone = request.json.get("phone")

    invalid_chars_FLname = "{}[]()<>@,;:."
    invalid_chars_Username = "{}[]()<>,;:"
    # Check both first and last name for invalid characters in one if statement
    if not first_name or any(char in first_name for char in invalid_chars_FLname) or not last_name or any(char in last_name for char in invalid_chars_FLname):
        return jsonify({"message": "The provided first or last name contained invalid character/s: {}[]()<>@,;:."}), 400
       
    # Check if the username contains invalid characters
    if not user_name or any(char in user_name for char in invalid_chars_Username):
        return jsonify({"message": "The provided username contained invalid character/s: {}[]()<>:,; "}), 400
    
    # Check if the email is valid
    if not email and "@" not in email:
        return jsonify({"message": "Please enter a valid email"}), 400
    
    # Check if the phone number is only numbers and starts with 04:
    if not phone or not phone.startswith("04") or not phone.isdigit():
        return jsonify({"message": "Please enter a valid phone number"}), 400
    
    # Check if the password has a minimum length of 8 and contains captial, small, and number
    if not password or len(password) < 8 or not any(char.islower() for char in password) or not any(char.isupper() for char in password) or not any(char.isdigit() for char in password):
        return jsonify({"message": "Please enter a valid password"}), 400
    
    hashed_password = pbkdf2_sha256.hash(password)

    reset_code = ""

    user = User(first_name=first_name, last_name=last_name, username=user_name, password=hashed_password, email=email, phone=phone, reset_code=reset_code)
    return jsonify({"message": "Welcome to DUX"}), 201

@app.route("/login", methods=["POST"])
def log_in():
    user_name = request.json.get("userName")
    password = request.json.get("password")

    user = User.query.filter_by(user_name=user_name).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not pbkdf2_sha256.verify(password, user.password):
        return jsonify({"message": "Incorrect password"}), 400

    return jsonify({"message": "Welcome back"}), 200


@app.route("/forgot_password", methods=["POST"])
def forgot_password():
    username = request.json.get("userName")
    email = request.json.get("email")
    reset_code = random.randint(10000000, 99999999)

    user.reset_code = reset_code
    db.session.commit()

    user = User.query.filter_by(user_name=username).first()
    email = User.query.filter_by(email=email).first()
    if not user or not email:
        return jsonify({"message": "User not found"}), 404
    
    send_email(username, email, reset_code)
    return jsonify({"message": "Reset email sent, please check your inbox."}), 200

@app.route("/reset_password", methods=["PATCH"])
def reset_password():
    username = request.json.get("userName")
    reset_code = request.json.get("resetCode")
    new_password = request.json.get("newPassword")

    user = User.query.filter_by(user_name=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if user.reset_code != reset_code:
        return jsonify({"message": "Incorrect reset code"}), 400
    
    hashed_password = pbkdf2_sha256.hash(new_password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password reset successfully"}), 200