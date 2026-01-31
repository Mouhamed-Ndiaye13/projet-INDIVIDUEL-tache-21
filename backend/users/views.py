from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import PendingUser
from rest_framework_simplejwt.tokens import RefreshToken
from djoser.conf import settings as djoser_settings
from djoser.utils import encode_uid, decode_uid
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string


# -------------------------
# Pré-inscription : crée un PendingUser et envoie mail
# -------------------------
class SignupPendingView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email et mot de passe requis."}, status=400)

        if PendingUser.objects.filter(email=email).exists():
            return Response({"error": "Un email est déjà en attente de confirmation."}, status=400)

        pending_user = PendingUser(email=email, password=password)
        pending_user.save()

        activation_link = request.build_absolute_uri(
            reverse("activate-pending", args=[pending_user.token])
        )

        send_mail(
            subject="Confirme ton inscription sur Fessel Market",
            message=f"Clique sur ce lien pour activer ton compte : {activation_link}",
            from_email=djoser_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"detail": "Email envoyé pour confirmation"}, status=201)


# -------------------------
# Activation : crée le User réel à partir du PendingUser
# -------------------------
class ActivatePendingUserView(generics.GenericAPIView):
    def get(self, request, token):
        try:
            pending = PendingUser.objects.get(token=token)
        except PendingUser.DoesNotExist:
            return Response({"error": "Lien invalide ou expiré"}, status=400)

        User = get_user_model()
        if User.objects.filter(email=pending.email).exists():
            pending.delete()
            return Response({"detail": "Compte déjà activé"}, status=200)

        user = User.objects.create_user(
            email=pending.email,
            password=pending.password,
            is_active=True  # ✅ Compte activé automatiquement
        )
        pending.delete()
        return Response({"detail": "Compte activé, tu peux maintenant te connecter"})


# -------------------------
# Login JWT custom (connexion sans activation obligatoire)
# -------------------------
class LoginJWTView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        User = get_user_model()
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email et mot de passe requis."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=404)

        if not user.check_password(password):
            return Response({"error": "Mot de passe incorrect"}, status=400)

        # ⚡ On permet la connexion même si le compte n’est pas activé
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "email": user.email,
                "id": user.id,
            }
        })


# -------------------------
# Reset Password via Djoser
# (envoie email automatiquement via Djoser)
# -------------------------
# Tu n'as rien à coder ici, juste les URLs Djoser :
# POST /auth/users/reset_password/  -> envoie email
# POST /auth/users/reset_password_confirm/ -> confirme le reset
