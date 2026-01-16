from pathlib import Path
import os
from dotenv import load_dotenv
from mongoengine import connect

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
DEBUG = os.getenv("DEBUG", "True") == "True"

ALLOWED_HOSTS = ["*"]

# -------------------------
# APPS
# -------------------------
INSTALLED_APPS = [
    "corsheaders",  # ✅ AJOUTÉ
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "users",
    "hotels",
]

# -------------------------
# MIDDLEWARE
# ⚠️ CORS DOIT ÊTRE EN PREMIER
# -------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

# -------------------------
# CORS CONFIG
# -------------------------
CORS_ALLOW_ALL_ORIGINS = True  # ✅ DEV ONLY

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "accept",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]

# -------------------------
# URL / WSGI
# -------------------------
ROOT_URLCONF = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"

# -------------------------
# MongoDB
# -------------------------
connect(
    db="hotel_db",
    host=os.getenv("MONGO_URI"),
    alias="default"
)

# -------------------------
# STATIC FILES
# -------------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

# -------------------------
# MEDIA FILES
# -------------------------
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

