def user_serializer(user):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at
    }
