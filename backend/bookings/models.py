from mongoengine import Document, ReferenceField, DateTimeField, StringField
from users.models import User
from hotels.models import Hotel

class Booking(Document):
    user = ReferenceField(User, required=True)
    hotel = ReferenceField(Hotel, required=True)
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    status = StringField(default="booked")  # booked / cancelled
