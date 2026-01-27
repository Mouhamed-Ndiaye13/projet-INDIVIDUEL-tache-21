from django.contrib import admin
from .models import Hotel, HotelImage


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1
    fields = ['image']


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'location', 'description']
    inlines = [HotelImageInline]
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'location')
        }),
        ('Détails', {
            'fields': ('description', 'price')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HotelImage)
class HotelImageAdmin(admin.ModelAdmin):
    list_display = ['hotel', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['hotel__name']
