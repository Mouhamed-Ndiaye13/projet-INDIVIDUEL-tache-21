# hotels/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Hotel, HotelImage, Category
from users.models import User
import jwt
import os
from functools import wraps

SECRET_KEY = os.getenv("SECRET_KEY", "changeme123")

# ---------------------------
# Décorateur JWT pour sécuriser certaines routes
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
# List Categories (public)
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all()
    data = [{"id": c.id, "name": c.name} for c in categories]
    return JsonResponse({"status": "success", "categories": data})

# ---------------------------
# List Hotels (public)
# ---------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def list_hotels(request):
    hotels = Hotel.objects.all()
    data = []
    for h in hotels:
        images = [img.image.url for img in HotelImage.objects.filter(hotel=h)]
        data.append({
            "id": h.id,
            "name": h.name,
            "location": h.location,
            "price": h.price,
            "description": h.description,
            "category": {"id": h.category.id, "name": h.category.name},
            "images": images
        })
    return JsonResponse({"status": "success", "hotels": data})

# ---------------------------
# Create Hotel (exempt CSRF)
# ---------------------------
@csrf_exempt  # ⚠️ doit être AVANT @api_view
@api_view(["POST"])
@permission_classes([AllowAny])  # Peut passer à IsAuthenticated si JWT est géré correctement
def create_hotel(request):
    name = request.POST.get("name")
    location = request.POST.get("location")
    price = request.POST.get("price")
    description = request.POST.get("description")
    category_id = request.POST.get("category")  # React envoie "category"
    images_files = request.FILES.getlist("images")

    if not all([name, location, price, description, category_id]):
        return JsonResponse({"status": "error", "error": "Veuillez remplir tous les champs"}, status=400)

    try:
        category = Category.objects.get(id=int(category_id))
    except (Category.DoesNotExist, ValueError):
        return JsonResponse({"status": "error", "error": "Catégorie invalide"}, status=400)

    hotel = Hotel.objects.create(
        name=name,
        location=location,
        price=float(price),
        description=description,
        category=category
    )

    images_urls = []
    for img in images_files:
        obj = HotelImage.objects.create(hotel=hotel, image=img)
        images_urls.append(obj.image.url)

    return JsonResponse({
        "status": "success",
        "hotel": {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "price": hotel.price,
            "description": hotel.description,
            "category": {"id": category.id, "name": category.name},
            "images": images_urls
        }
    })

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

    if "category" in data:
        try:
            hotel.category = Category.objects.get(id=int(data["category"]))
        except Category.DoesNotExist:
            pass

    hotel.save()
    images = [img.image.url for img in HotelImage.objects.filter(hotel=hotel)]
    return JsonResponse({"status": "success", "hotel": {
        "id": hotel.id,
        "name": hotel.name,
        "location": hotel.location,
        "price": hotel.price,
        "description": hotel.description,
        "category": {"id": hotel.category.id, "name": hotel.category.name},
        "images": images
    }})

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
    return JsonResponse({"status": "success", "message": "Hotel deleted"})
