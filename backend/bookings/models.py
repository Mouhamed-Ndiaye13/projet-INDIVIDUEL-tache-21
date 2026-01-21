from django.db import models
from users.models import User
from hotels.models import Hotel

class Booking(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, default="booked")  # booked / cancelled

    def __str__(self):
        return f"{self.hotel.name} booking for {self.user.name}"
