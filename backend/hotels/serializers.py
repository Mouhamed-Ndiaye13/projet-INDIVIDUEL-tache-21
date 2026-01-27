from rest_framework import serializers
from .models import Hotel, Category, HotelImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class HotelImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HotelImage
        fields = ["image"]

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


class HotelSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "location",
            "description",
            "price",
            "category",
            "category_id",
            "images"
        ]
