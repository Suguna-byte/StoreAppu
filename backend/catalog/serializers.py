from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "icon", "order", "product_count"]
        read_only_fields = ["slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price", "unit", "stock", "in_stock",
            "category", "category_name", "primary_image",
        ]

    def get_primary_image(self, obj):
        img = next((i for i in obj.images.all() if i.is_primary), None) or next(iter(obj.images.all()), None)
        if not img:
            return None
        request = self.context.get("request")
        url = img.image.url
        return request.build_absolute_uri(url) if request else url


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.SlugRelatedField(slug_field="slug", queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)
    seller_name = serializers.CharField(source="seller.full_name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "unit", "stock", "in_stock",
            "category", "category_name", "seller_name", "images", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value
