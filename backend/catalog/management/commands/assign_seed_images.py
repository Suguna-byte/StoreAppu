from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductImage

SEED_IMAGES_DIR = Path(settings.BASE_DIR) / "seed_images"

# icon key -> source file in seed_images/
CATEGORY_IMAGES = {
    "cloth": "cloth-saree.webp",
    "grocery": "grocery-coconut.png",
    "home": "home-spinmop.webp",
    "kerala": "kerala-puffs.webp",
    "oil": "oil-coconutoil.webp",
}

# product name -> source file in seed_images/ (mixed & matched from the same set)
PRODUCT_IMAGES = {
    "Cotton Mundu - White": "cloth-saree.webp",
    "Kasavu Mundu - Gold Border": "cloth-saree.webp",
    "Kerala Matta Rice": "grocery-coconut.png",
    "Sharkara Varatti (Jaggery Coated Banana)": "kerala-puffs.webp",
    "Coconut Oil - Marica": "oil-coconutoil.webp",
}


class Command(BaseCommand):
    help = "Assign the provided real product photos to seeded categories and products."

    def handle(self, *args, **options):
        for icon, filename in CATEGORY_IMAGES.items():
            try:
                category = Category.objects.get(icon=icon)
            except Category.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"No category with icon '{icon}', skipping."))
                continue
            if category.image:
                continue
            src = SEED_IMAGES_DIR / filename
            with open(src, "rb") as f:
                category.image.save(filename, File(f), save=True)
            self.stdout.write(self.style.SUCCESS(f"Set image for category '{category.name}'."))

        for product_name, filename in PRODUCT_IMAGES.items():
            try:
                product = Product.objects.get(name=product_name)
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"No product named '{product_name}', skipping."))
                continue
            if product.images.exists():
                continue
            src = SEED_IMAGES_DIR / filename
            with open(src, "rb") as f:
                ProductImage.objects.create(
                    product=product,
                    image=File(f, name=filename),
                    alt_text=product.name,
                    is_primary=True,
                )
            self.stdout.write(self.style.SUCCESS(f"Set image for product '{product.name}'."))

        self.stdout.write(self.style.SUCCESS("Done assigning seed images."))
