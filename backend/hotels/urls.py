from django.urls import path
from .views import HotelListView, StatsView

urlpatterns = [
    path('', HotelListView.as_view()),   # GET /api/hotels/
    path('stats/', StatsView.as_view()), # GET /api/hotels/stats/
]
