from django.urls import path, include
from .views import SignupPendingView, ActivatePendingUserView, LoginJWTView

urlpatterns = [
    path("signup/", SignupPendingView.as_view(), name="signup-pending"),
    path("activate/<uuid:token>/", ActivatePendingUserView.as_view(), name="activate-pending"),
    path("login/", LoginJWTView.as_view(), name="login-jwt"),

    # Djoser pour reset password uniquement
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
]
