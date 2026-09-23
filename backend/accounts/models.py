from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Email-based user. `is_seller` unlocks the seller dashboard (product/stock management)."""

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    is_seller = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
