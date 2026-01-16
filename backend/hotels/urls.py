from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_hotel, name="create_hotel"),
    path("", views.list_hotels, name="list_hotels"),
    path("update/<str:hotel_id>/", views.update_hotel, name="update_hotel"),
    path("delete/<str:hotel_id>/", views.delete_hotel, name="delete_hotel"),
]
