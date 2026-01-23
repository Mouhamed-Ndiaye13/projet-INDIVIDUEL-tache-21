from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Booking
from users.models import User
from hotels.models import Hotel

@csrf_exempt
def create_booking(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        user_id = data.get("user_id")
        hotel_id = data.get("hotel_id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not all([user_id, hotel_id, start_date, end_date]):
            return JsonResponse({"error": "Missing fields"}, status=400)

        user = User.objects(id=user_id).first()
        hotel = Hotel.objects(id=hotel_id).first()

        if not user or not hotel:
            return JsonResponse({"error": "User or Hotel not found"}, status=404)

        booking = Booking(user=user, hotel=hotel, start_date=start_date, end_date=end_date)
        booking.save()

        return JsonResponse({"status": "success", "booking": {
            "user": user.name,
            "hotel": hotel.name,
            "start_date": start_date,
            "end_date": end_date
        }})
