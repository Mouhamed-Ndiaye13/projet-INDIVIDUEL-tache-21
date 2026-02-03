from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import PendingUser
from rest_framework_simplejwt.tokens import RefreshToken

# -------------------------
# Signup Pending
# -------------------------
class SignupPendingView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name", "")

        if not email or not password:
            return Response({"error": "Email et mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return Response({"error": "Un compte avec cet email existe déjà"}, status=status.HTTP_400_BAD_REQUEST)
        if PendingUser.objects.filter(email=email).exists():
            return Response({"error": "Email déjà envoyé pour activation"}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(password)
        pending = PendingUser.objects.create(email=email, name=name, password=hashed_password)

        activation_link = request.build_absolute_uri(reverse("activate-pending", args=[pending.token]))
        send_mail(
            subject="Confirme ton inscription",
            message=f"Clique sur ce lien pour activer ton compte : {activation_link}",
            from_email="no-reply@fesselmarket.com",
            recipient_list=[email],
            fail_silently=False
        )

        return Response({"detail": "Email d'activation envoyé."}, status=status.HTTP_201_CREATED)


# -------------------------
# Activation
# -------------------------
class ActivatePendingUserView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            pending = PendingUser.objects.get(token=token)
        except PendingUser.DoesNotExist:
            return Response({"error": "Lien invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        if User.objects.filter(email=pending.email).exists():
            pending.delete()
            return Response({"error": "Compte déjà activé"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=pending.email,
            name=pending.name,
            password=pending.password
        )
        user.is_active = True
        user.save()

        pending.delete()
        return Response({"detail": "Compte activé avec succès !"}, status=status.HTTP_200_OK)


# -------------------------
# Login JWT (simple)
# -------------------------
class LoginJWTView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email et mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"error": "Email ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "Compte non activé"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {"email": user.email, "name": user.name}
        }, status=status.HTTP_200_OK)
