from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import PendingUser
from rest_framework_simplejwt.tokens import RefreshToken

# -------------------------
# Pré-inscription : crée un PendingUser et envoie mail
# -------------------------
class SignupPendingView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")

        if not email or not password or not name:
            return Response({"error": "Tous les champs sont obligatoires"}, status=400)

        if PendingUser.objects.filter(email=email).exists():
            return Response({"error": "Un email est déjà en attente de confirmation."}, status=400)

        # Crée un PendingUser
        pending_user = PendingUser(email=email, password=password)
        pending_user.save()

        # Lien d'activation
        activation_link = request.build_absolute_uri(
            reverse("activate-pending", args=[pending_user.token])
        )

        # Envoi du mail
        send_mail(
            subject="Confirme ton inscription sur Fessel Market",
            message=f"Clique sur ce lien pour activer ton compte : {activation_link}",
            from_email="no-reply@fesselmarket.com",
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
        # Crée le vrai utilisateur
        user = User.objects.create_user(email=pending.email, password=pending.password, name=pending.email.split("@")[0])
        user.is_active = True   # activation immédiate
        user.save()

        pending.delete()
        return Response({"detail": "Compte activé, tu peux maintenant te connecter"})

# -------------------------
# Login JWT (connexion directe, is_active toujours True)
# -------------------------
class LoginJWTView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        User = get_user_model()
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Tous les champs sont obligatoires"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=404)

        if not user.check_password(password):
            return Response({"error": "Mot de passe incorrect"}, status=400)

        # is_active est toujours True donc pas de blocage
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "email": user.email,
                "name": user.name
            }
        })

# -------------------------
# Mot de passe oublié (via Djoser)
# -------------------------
# Note: Djoser gère déjà /auth/users/reset_password/ et /auth/users/reset_password_confirm/
# Il suffit que ton frontend appelle ces endpoints avec l'email du user.
