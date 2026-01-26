# from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/hotels/", include("hotels.urls")),  # <-- ajouter cette ligne
    path("api/bookings/", include("bookings.urls")),
]
# Servir les médias en local seulement si DEBUG=True
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
