from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "full_name", "is_seller", "is_staff", "date_joined"]
    fieldsets = BaseUserAdmin.fieldsets + (("Store role", {"fields": ("full_name", "is_seller", "phone")}),)
