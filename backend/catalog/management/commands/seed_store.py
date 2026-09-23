from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from catalog.models import Category, Product

User = get_user_model()

CATEGORIES = [
    ("Groceries", "grocery"),
    ("Oils & Ghee", "oil"),
    ("Snacks & Chips", "snack"),
    ("Spices & Masala", "spice"),
    ("Kerala Specials", "kerala"),
    ("Clothing", "cloth"),
    ("Home Essentials", "home"),
]

PRODUCTS = [
    ("Coconut Oil - Marica", "Oils & Ghee", 320, "l", 40),
    ("Nendran Banana Chips", "Snacks & Chips", 90, "pack", 100),
    ("Jackfruit Chips", "Snacks & Chips", 110, "pack", 60),
    ("Kerala Kappalandi Mixture", "Snacks & Chips", 80, "pack", 75),
    ("Cotton Mundu - White", "Clothing", 450, "pc", 30),
    ("Kasavu Mundu - Gold Border", "Clothing", 850, "pc", 20),
    ("Kerala Matta Rice", "Groceries", 75, "kg", 200),
    ("Kudampuli (Malabar Tamarind)", "Spices & Masala", 60, "pack", 50),
    ("Kerala Garam Masala", "Spices & Masala", 55, "pack", 90),
    ("Sharkara Varatti (Jaggery Coated Banana)", "Kerala Specials", 150, "pack", 40),
]


class Command(BaseCommand):
    help = "Seed demo categories and products for Appu's Kerala Store"

    def handle(self, *args, **options):
        seller, _ = User.objects.get_or_create(
            email="appu@keralastore.test",
            defaults={"username": "appu", "full_name": "Appu", "is_seller": True, "is_active": True},
        )
        if not seller.has_usable_password():
            seller.set_password("ChangeMe123!")
            seller.save()

        slug_map = {}
        for name, icon in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name, defaults={"icon": icon})
            slug_map[name] = cat

        for name, cat_name, price, unit, stock in PRODUCTS:
            Product.objects.get_or_create(
                name=name,
                defaults={
                    "seller": seller,
                    "category": slug_map[cat_name],
                    "price": price,
                    "unit": unit,
                    "stock": stock,
                    "description": f"Authentic {name} sourced for Appu's Kerala Store, Viman Nagar.",
                },
            )

        self.stdout.write(self.style.SUCCESS("Seeded demo categories and products."))
