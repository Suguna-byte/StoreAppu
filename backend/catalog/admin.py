from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order", "product_count"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]

    @admin.display(description="Products")
    def product_count(self, obj):
        return obj.products.count()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["thumbnail", "name", "category", "seller", "price", "stock", "stock_status", "is_active"]
    list_filter = ["category", "is_active"]
    search_fields = ["name"]
    list_editable = ["price", "stock", "is_active"]
    inlines = [ProductImageInline]

    @admin.display(description="Image")
    def thumbnail(self, obj):
        image = obj.images.first()
        if not image:
            return "—"
        return format_html(
            '<img src="{}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;" />',
            image.image.url,
        )

    @admin.display(description="Stock status")
    def stock_status(self, obj):
        if obj.stock <= 0:
            color, label = "#a3312a", "Out of stock"
        elif obj.stock < 10:
            color, label = "#b9860f", "Low stock"
        else:
            color, label = "#2f5233", "In stock"
        return format_html(
            '<span style="color:{}; font-weight:600;">{}</span>', color, label
        )
