from django.db import models
from cloudinary.models import CloudinaryField


class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Prix par nuit en euros"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['price']),
        ]

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
        folder="hotels",
        blank=True,
        null=True
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']
        verbose_name = "Hotel Image"
        verbose_name_plural = "Hotel Images"

    def __str__(self):
        return f"{self.hotel.name} - Image {self.id}"
