from django.urls import path, include
from .views import SignupPendingView, ActivatePendingUserView, LoginJWTView

urlpatterns = [
    # -------------------------
    # Custom signup & activation (PendingUser)
    # -------------------------
    path("signup/", SignupPendingView.as_view(), name="signup-pending"),
    path("activate/<uuid:token>/", ActivatePendingUserView.as_view(), name="activate-pending"),

    # -------------------------
    # Custom login JWT (connexion sans activation obligatoire)
    # -------------------------
    path("login/", LoginJWTView.as_view(), name="login-jwt"),

    # -------------------------
    # Djoser endpoints (reset password, activation, JWT)
    # -------------------------
    path("auth/", include("djoser.urls")),       # reset password, account activation, user management
    path("auth/", include("djoser.urls.jwt")),   # JWT endpoints (login, refresh, verify)
]
