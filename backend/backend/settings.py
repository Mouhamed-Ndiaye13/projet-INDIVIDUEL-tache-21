from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# -------------------------
# Chargement des variables d'environnement
# -------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
DEBUG = os.getenv("DEBUG", "True") == "True"

# -------------------------
# Hosts
# -------------------------
ALLOWED_HOSTS = ["*"]  # ou mettre les URLs Render de front et back

# -------------------------
# Applications installées
# -------------------------
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "users",
    "hotels",
    "bookings",
]

# -------------------------
# Middleware
# -------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

# -------------------------
# CORS
# -------------------------
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Front local
    "https://projet-individuel-tache-21.onrender.com",  # Backend Render
]

# -------------------------
# URLs et WSGI
# -------------------------
ROOT_URLCONF = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"

# -------------------------
# Base de données
# -------------------------
DATABASES = {
    "default": dj_database_url.config(
        default="postgres://postgres:Fessel2025@localhost:5432/hotel_db"
    )
}

# -------------------------
# Static et media
# -------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# -------------------------
# Autres paramètres Django
# -------------------------
CORS_ALLOW_CREDENTIALS = True
