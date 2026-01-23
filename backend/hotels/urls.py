from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_hotel, name="create_hotel"),
    path("", views.list_hotels, name="list_hotels"),
    path("categories/", views.list_categories, name="list_categories"),
    path("<int:hotel_id>/", views.update_hotel, name="update_hotel"),
    path("<int:hotel_id>/delete/", views.delete_hotel, name="delete_hotel"),
]