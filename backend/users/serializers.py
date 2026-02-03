from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer utilisé par Djoser pour l'inscription
    """
    class Meta:
        model = User
        fields = ("id", "email", "name", "password")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer pour récupérer les infos utilisateur
    (me, users/{id})
    """
    class Meta:
        model = User
        fields = ("id", "email", "name", "email_verified")
