from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # 🔐 AUTHENTIFICATION (DJOSER + JWT)
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),

    # 📦 Autres apps métier
    path("api/", include("hotels.urls")),
    path("api/", include("bookings.urls")),
]
