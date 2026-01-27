from rest_framework import serializers
from .models import Hotel, HotelImage


class HotelImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HotelImage
        fields = ["id", "image", "image_url", "uploaded_at"]
        extra_kwargs = {
            'image': {'write_only': True}
        }

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except Exception:
                return None
        return None


class HotelSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "location",
            "description",
            "price",
            "images",
            "uploaded_images",
            "created_at",
            "updated_at"
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        hotel = Hotel.objects.create(**validated_data)

        for image in uploaded_images:
            HotelImage.objects.create(hotel=hotel, image=image)

        return hotel

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for image in uploaded_images:
            HotelImage.objects.create(hotel=instance, image=image)

        return instance
