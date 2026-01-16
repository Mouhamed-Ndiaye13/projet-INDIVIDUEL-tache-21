import jwt
from datetime import datetime, timedelta
from django.conf import settings
from functools import wraps
from django.http import JsonResponse
from .models import User

SECRET_KEY = getattr(settings, "SECRET_KEY", "your_secret_key_here")

# Générer un token JWT
def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Décoder un token JWT
def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Décorateur pour sécuriser les routes
def login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return JsonResponse({"error": "Token missing"}, status=401)
        
        if token.startswith("Bearer "):
            token = token[7:]
        
        user_id = decode_token(token)
        if not user_id:
            return JsonResponse({"error": "Invalid or expired token"}, status=401)
        
        try:
            request.user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=401)

        return view_func(request, *args, **kwargs)
    return wrapper
