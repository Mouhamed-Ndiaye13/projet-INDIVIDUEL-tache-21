from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Hotel
import os
from django.conf import settings
import jwt
from functools import wraps
from users.models import User

# Clé secrète pour JWT (mettre dans .env en prod)
SECRET_KEY = os.getenv("SECRET_KEY", "changeme123")


# ---------------------------
# Décorateur pour sécuriser les routes
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
            user_id = payload["user_id"]
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
# Create Hotel with images
# ---------------------------
@csrf_exempt
@login_required
def create_hotel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    name = request.POST.get("name")
    location = request.POST.get("location")
    price = request.POST.get("price")
    description = request.POST.get("description")
    images_files = request.FILES.getlist("images")

    if not all([name, location, price, description]):
        return JsonResponse({"error": "Missing fields"}, status=400)

    images_urls = []
    upload_dir = os.path.join(settings.MEDIA_ROOT, "hotels")
    os.makedirs(upload_dir, exist_ok=True)

    for img in images_files:
        img_path = os.path.join(upload_dir, img.name)
        with open(img_path, "wb+") as f:
            for chunk in img.chunks():
                f.write(chunk)
        images_urls.append(f"/media/hotels/{img.name}")

    hotel = Hotel.objects.create(
        name=name,
        location=location,
        price=float(price),
        description=description,
        images=images_urls
    )

    return JsonResponse({
        "status": "success",
        "hotel": {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "price": hotel.price,
            "description": hotel.description,
            "images": hotel.images
        }
    })


# ---------------------------
# List Hotels (public)
# ---------------------------
@csrf_exempt
def list_hotels(request):
    if request.method == "GET":
        hotels = Hotel.objects.all()  # ✅ corrigé
        hotel_list = []
        for h in hotels:
            hotel_list.append({
                "id": h.id,
                "name": h.name,
                "location": h.location,
                "price": h.price,
                "description": h.description,
                "images": h.images
            })
        return JsonResponse({"status": "success", "hotels": hotel_list})
    return JsonResponse({"error": "Only GET allowed"}, status=405)


# ---------------------------
# Update Hotel
# ---------------------------
@csrf_exempt
@login_required
def update_hotel(request, hotel_id):
    if request.method == "PUT":
        from django.http import QueryDict
        if request.content_type == "application/x-www-form-urlencoded":
            data = QueryDict(request.body)
        else:
            import json
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON or empty body"}, status=400)

        try:
            hotel = Hotel.objects.get(id=hotel_id)
        except Hotel.DoesNotExist:
            return JsonResponse({"error": "Hotel not found"}, status=404)

        for field in ["name", "location", "price", "description"]:
            if field in data:
                setattr(hotel, field, data[field])

        if hasattr(request, 'FILES'):
            images_files = request.FILES.getlist("images")
            images_urls = hotel.images if hotel.images else []
            upload_dir = os.path.join(settings.MEDIA_ROOT, "hotels")
            os.makedirs(upload_dir, exist_ok=True)

            for img in images_files:
                img_path = os.path.join(upload_dir, img.name)
                with open(img_path, "wb+") as f:
                    for chunk in img.chunks():
                        f.write(chunk)
                images_urls.append(f"/media/hotels/{img.name}")
            hotel.images = images_urls

        hotel.save()
        return JsonResponse({"status": "success", "hotel": {
            "id": hotel.id,
            "name": hotel.name,
            "location": hotel.location,
            "price": hotel.price,
            "description": hotel.description,
            "images": hotel.images
        }})
    return JsonResponse({"error": "Only PUT allowed"}, status=405)


# ---------------------------
# Delete Hotel
# ---------------------------
@csrf_exempt
@login_required
def delete_hotel(request, hotel_id):
    if request.method == "DELETE":
        try:
            hotel = Hotel.objects.get(id=hotel_id)
        except Hotel.DoesNotExist:
            return JsonResponse({"error": "Hotel not found"}, status=404)

        hotel.delete()
        return JsonResponse({"status": "success", "message": "Hotel deleted"})
    return JsonResponse({"error": "Only DELETE allowed"}, status=405)
