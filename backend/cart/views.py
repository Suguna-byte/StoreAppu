from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    def list(self, request):
        cart = self.get_cart(request)
        return Response(CartSerializer(cart).data)

    def create(self, request):
        """Add an item, or bump quantity if it's already in the cart."""
        cart = self.get_cart(request)
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        existing = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if existing:
            data = {"quantity": existing.quantity + quantity}
            serializer = CartItemSerializer(existing, data=data, partial=True)
        else:
            serializer = CartItemSerializer(data={"product_id": product_id, "quantity": quantity})
        serializer.is_valid(raise_exception=True)
        serializer.save(cart=cart)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk=None):
        cart = self.get_cart(request)
        item = cart.items.filter(pk=pk).first()
        if not item:
            return Response({"detail": "Item not found."}, status=404)
        serializer = CartItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CartSerializer(cart).data)

    def destroy(self, request, pk=None):
        cart = self.get_cart(request)
        cart.items.filter(pk=pk).delete()
        return Response(CartSerializer(cart).data)
