import dj_database_url
from pathlib import Path
import os
from dotenv import load_dotenv


# -------------------------
# Chargement des variables d'environnement
# -------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
DEBUG = os.getenv("DEBUG", "False") == "True"

# -------------------------
# Hosts
# -------------------------
ALLOWED_HOSTS = ["*"]  # Tu peux préciser les URLs du front et back Render

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
CORS_ALLOW_ALL_ORIGINS = False  # Ne pas laisser True en prod
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Front local
    "https://projet-individuel-tache-21-32hu.vercel.app",  # Front prod
]
CORS_ALLOW_CREDENTIALS = True  # Si tu utilises cookies ou auth
# -------------------------
# URLs et WSGI
# -------------------------
ROOT_URLCONF = "backend.urls"
WSGI_APPLICATION = "backend.wsgi.application"

# -------------------------
# Base de données PostgreSQL Render
# -------------------------

DATABASES = {
    "default": dj_database_url.parse(
        "postgresql://postgres_postgres_fessel2025atlocalhost_user:6spYUX7CdZBuHbsIeRQQIRmAVffsvOCo@dpg-d5oc9fggjchc73a0cihg-a.oregon-postgres.render.com/postgres_postgres_fessel2025atlocalhost",
        conn_max_age=600,
        ssl_require=True
    )
}
# -------------------------
# Static et media
# -------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
