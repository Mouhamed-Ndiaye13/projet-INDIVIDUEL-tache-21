from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User
from django.contrib.auth.hashers import make_password, check_password
import jwt
import datetime
import os
from functools import wraps

# ---------------------------
# Config
# ---------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "changeme123")  # ⚠️ à changer en prod
TOKEN_EXPIRATION_DAYS = 1
RESET_TOKEN_EXPIRATION_HOURS = 1

# ---------------------------
# Helper : vérifier token JWT
# ---------------------------
def token_required(view_func):
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Token missing"}, status=401)
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapped

# ---------------------------
# Register
# ---------------------------
@csrf_exempt
def register(request):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON or empty body"}, status=400)

        if not all(k in data for k in ("name", "email", "password")):
            return JsonResponse({"error": "Missing fields"}, status=400)

        if User.objects.filter(email=data["email"]).first():
            return JsonResponse({"error": "Email already registered"}, status=400)

        hashed_password = make_password(data["password"])
        user = User(name=data["name"], email=data["email"], password=hashed_password)
        user.save()

        token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=TOKEN_EXPIRATION_DAYS)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return JsonResponse({
            "status": "success",
            "user": {"name": user.name, "email": user.email},
            "token": token
        })
    return JsonResponse({"error": "Only POST allowed"}, status=405)

# ---------------------------
# Login
# ---------------------------
@csrf_exempt
def login(request):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON or empty body"}, status=400)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"error": "Email and password required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user or not check_password(password, user.password):
            return JsonResponse({"error": "Invalid email or password"}, status=401)

        token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=TOKEN_EXPIRATION_DAYS)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return JsonResponse({
            "status": "success",
            "user": {"name": user.name, "email": user.email},
            "token": token
        })
    return JsonResponse({"error": "Method not allowed"}, status=405)

# ---------------------------
# Forgot password
# ---------------------------
@csrf_exempt
def forgot_password(request):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON or empty body"}, status=400)

        email = data.get("email")
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "Email not found"}, status=404)

        reset_token = jwt.encode(
            {
                "user_id": str(user.id),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=RESET_TOKEN_EXPIRATION_HOURS)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        # TODO : envoyer un email réel avec ce lien
        print(f"Reset link (à envoyer par email): http://localhost:3000/reset-password/{reset_token}")

        return JsonResponse({"status": "success", "message": "Reset link sent to email"})
    return JsonResponse({"error": "Only POST allowed"}, status=405)

# ---------------------------
# Reset password
# ---------------------------
@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON or empty body"}, status=400)

        token = data.get("token")
        new_password = data.get("new_password")
        if not token or not new_password:
            return JsonResponse({"error": "Token and new password required"}, status=400)

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=400)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=400)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        user.password = make_password(new_password)
        user.save()

        return JsonResponse({"status": "success", "message": "Password updated successfully"})
    return JsonResponse({"error": "Only POST allowed"}, status=405)
