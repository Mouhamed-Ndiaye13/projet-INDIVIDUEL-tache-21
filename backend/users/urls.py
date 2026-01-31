from django.urls import path, include
from .views import SignupPendingView, ActivatePendingUserView, LoginJWTView

urlpatterns = [
    # Custom signup & activation
    path("signup/", SignupPendingView.as_view(), name="signup-pending"),
    path("activate/<uuid:token>/", ActivatePendingUserView.as_view(), name="activate-pending"),

    # Custom login JWT (optionnel)
    path("login/", LoginJWTView.as_view(), name="login-jwt"),

    # Djoser endpoints (signup/reset/activation/jwt)
    path("auth/", include("djoser.urls")),           # signup, reset password, activation
    path("auth/", include("djoser.urls.jwt")),       # JWT login/refresh
]
