from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),       # register, login, forgot-password
    path('api/hotels/', include('hotels.urls')),     # hotels list + stats
]
