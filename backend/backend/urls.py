from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),


    # autres routes
    path("api/", include("users.urls")),
    path("api/", include("hotels.urls")),
    path("api/", include("bookings.urls")),
]
