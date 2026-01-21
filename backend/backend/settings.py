from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "users",
    "hotels",
    "bookings",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "hotel_db",
        "USER": "postgres",
        "PASSWORD": "Fessel2025",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# CORS
CORS_ALLOW_CREDENTIALS = False  # ✅ obligatoire pour inclure les cookies
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # ton frontend React
]
CORS_ALLOW_CREDENTIALS = True  # ✅ autorise l'envoi de cookies ou tokens
