# hotels/models.py
from django.db import models
from cloudinary.models import CloudinaryField


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField(default=0)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="hotels"
    )

    def __str__(self):
        return self.name


class HotelImage(models.Model):
    hotel = models.ForeignKey(
        Hotel,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = CloudinaryField(
        "image",
        folder="hotels"
    )

    def __str__(self):
        return f"{self.hotel.name} image"
