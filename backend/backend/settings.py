from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# -------------------------
# Chargement des variables d'environnement
# -------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------
# Secret & Debug
# -------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
DEBUG = os.getenv("DEBUG", "False") == "True"

# -------------------------
# Hosts autorisés
# -------------------------
ALLOWED_HOSTS = [
    "*",  # Tu peux mettre tes URLs Render ici pour plus de sécurité
    "https://projet-individuel-tache-21.onrender.com",
]

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
    "rest_framework",
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
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Front local
    "https://projet-individuel-tache-21.onrender.com",  # Front deployé
]

# -------------------------
# URLs et WSGI
# -------------------------
ROOT_URLCONF = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"

# -------------------------
# Base de données PostgreSQL Render
# -------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL")  # Récupère DATABASE_URL de Render
    )
}

# -------------------------
# Static & Media
# -------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# -------------------------
# Autres paramètres
# -------------------------
CORS_ALLOW_CREDENTIALS = True
