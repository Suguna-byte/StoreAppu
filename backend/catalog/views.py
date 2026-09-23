from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, parsers, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product, ProductImage
from .permissions import IsSellerOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductImageSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.annotate(product_count=Count("products")).all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    pagination_class = None


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSellerOrReadOnly]
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category__slug"]
    search_fields = ["name", "description"]

    def get_queryset(self):
        qs = Product.objects.select_related("category", "seller").prefetch_related("images")
        if self.request.user.is_authenticated and self.request.user.is_seller and self.request.query_params.get("mine"):
            return qs.filter(seller=self.request.user)
        return qs.filter(is_active=True)

    def get_serializer_class(self):
        return ProductListSerializer if self.action == "list" else ProductDetailSerializer

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=["post"], parser_classes=[parsers.MultiPartParser], permission_classes=[IsSellerOrReadOnly])
    def upload_image(self, request, slug=None):
        product = self.get_object()
        self.check_object_permissions(request, product)
        image = request.FILES.get("image")
        if not image:
            return Response({"detail": "No image file provided."}, status=400)
        is_primary = not product.images.exists()
        img = ProductImage.objects.create(product=product, image=image, is_primary=is_primary)
        return Response(ProductImageSerializer(img, context={"request": request}).data, status=201)
