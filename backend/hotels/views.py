from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Hotel, HotelImage
from users.models import User
import jwt
import os
from functools import wraps

SECRET_KEY = os.getenv("SECRET_KEY", "changeme123")

# ---------------------------
# Décorateur JWT (optionnel)
# ---------------------------
def login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return JsonResponse({"error": "Token missing"}, status=401)

        if token.startswith("Bearer "):
            token = token[7:]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({"error": "User not found"}, status=401)

        request.user = user
        return view_func(request, *args, **kwargs)
    return wrapper

# ---------------------------
# List Hotels (public)
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def list_hotels(request):
    hotels = Hotel.objects.all()
    data = []

    for h in hotels:
        images = [img.image.url for img in h.images.all() if img.image]
        data.append({
            "id": h.id,
            "name": h.name,
            "location": h.location,
            "price": h.price,
            "description": h.description,
            "images": images,
            "created_at": h.created_at,
        })

    return JsonResponse({"status": "success", "hotels": data})

# ---------------------------
# Create Hotel
# ---------------------------
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])  # Passe à IsAuthenticated si besoin
def create_hotel(request):
    name = request.POST.get("name")
    location = request.POST.get("location")
    price = request.POST.get("price")
    description = request.POST.get("description")
    images_files = request.FILES.getlist("images")

    if not all([name, location, price, description]):
        return JsonResponse(
            {"status": "error", "error": "Veuillez remplir tous les champs"},
            status=400
        )

    hotel = Hotel.objects.create(
        name=name,
        location=location,
        price=float(price),
        description=description
    )

    images_urls = []
    for img in images_files:
        obj = HotelImage.objects.create(hotel=hotel, image=img)
        if obj.image:
            images_urls.append(obj.image.url)

    return JsonResponse({
        "status": "success",
        "hotel": {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "price": hotel.price,
            "description": hotel.description,
            "images": images_urls,
            "created_at": hotel.created_at,
        }
    }, status=201)

# ---------------------------
# Update Hotel
# ---------------------------
@csrf_exempt
@api_view(["PUT"])
@permission_classes([AllowAny])
def update_hotel(request, hotel_id):
    try:
        hotel = Hotel.objects.get(id=hotel_id)
    except Hotel.DoesNotExist:
        return JsonResponse({"error": "Hotel not found"}, status=404)

    data = request.data

    for field in ["name", "location", "price", "description"]:
        if field in data:
            setattr(hotel, field, data[field])

    hotel.save()

    images = [img.image.url for img in hotel.images.all() if img.image]

    return JsonResponse({
        "status": "success",
        "hotel": {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "price": hotel.price,
            "description": hotel.description,
            "images": images,
            "updated_at": hotel.updated_at,
        }
    })

# ---------------------------
# Delete Hotel
# ---------------------------
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_hotel(request, hotel_id):
    try:
        hotel = Hotel.objects.get(id=hotel_id)
    except Hotel.DoesNotExist:
        return JsonResponse({"error": "Hotel not found"}, status=404)

    hotel.delete()
    return JsonResponse({
        "status": "success",
        "message": "Hotel deleted"
    })
