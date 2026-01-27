# hotels/admin.py
from django.contrib import admin
from .models import Hotel, Category, HotelImage

admin.site.register(Category)
admin.site.register(Hotel)
admin.site.register(HotelImage)
