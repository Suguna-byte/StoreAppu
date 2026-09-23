import re

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone", "is_seller", "date_joined"]
        read_only_fields = ["id", "is_seller", "date_joined"]


def _generate_username(email: str) -> str:
    """Derives a valid Django `username` from an email address so users never
    have to think about it — they only ever sign in with email + password."""
    base = re.sub(r"[^\w.@+-]", "", email.split("@")[0]) or "user"
    username = base
    suffix = 1
    while User.objects.filter(username=username).exists():
        suffix += 1
        username = f"{base}{suffix}"
    return username


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    full_name = serializers.CharField(max_length=150)

    class Meta:
        model = User
        fields = ["email", "full_name", "phone", "password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data, username=_generate_username(validated_data["email"]))
        user.set_password(password)
        user.save()
        return user
