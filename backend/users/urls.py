from django.urls import path, include
from .views import SignupPendingView, ActivatePendingUserView, LoginJWTView

urlpatterns = [
    # -------------------------
    # Custom endpoints
    # -------------------------

    # Pré-inscription : crée un PendingUser et envoie email
    path("signup/", SignupPendingView.as_view(), name="signup-pending"),

    # Activation via token (lien envoyé par email)
    path("activate/<uuid:token>/", ActivatePendingUserView.as_view(), name="activate-pending"),

    # Login JWT personnalisé
    path("login/", LoginJWTView.as_view(), name="login-jwt"),

    # -------------------------
    # Djoser endpoints (optionnels, pour reset password/email confirmation)
    # -------------------------

    # Signup / reset / activation
    path("auth/", include("djoser.urls")),          

    # JWT login / refresh / verify
    path("auth/", include("djoser.urls.jwt")),      
]
