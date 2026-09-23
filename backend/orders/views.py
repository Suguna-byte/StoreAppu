from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cart.models import Cart

from .models import DeliveryAddress, Order, OrderItem
from .serializers import CheckoutSerializer, DeliveryAddressSerializer, OrderSerializer


class DeliveryAddressViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DeliveryAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items", "address")

    @action(detail=False, methods=["post"])
    def checkout(self, request):
        """Snapshot the cart into an Order (status=pending) ready for payment.

        Stock is only decremented once Razorpay confirms payment (see payments app),
        so two customers can still race for the last unit here — the payment
        verification step re-checks stock atomically before committing.
        """
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = Cart.objects.filter(user=request.user).prefetch_related("items__product").first()
        if not cart or not cart.items.exists():
            return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart.items.all():
            if item.quantity > item.product.stock:
                return Response(
                    {"detail": f"Only {item.product.stock} of {item.product.name} available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if data.get("address_id"):
            address = DeliveryAddress.objects.filter(id=data["address_id"], user=request.user).first()
            if not address:
                return Response({"detail": "Address not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            address = DeliveryAddress.objects.create(user=request.user, **data["new_address"])

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                address=address,
                total_amount=cart.total,
            )
            OrderItem.objects.bulk_create(
                [
                    OrderItem(
                        order=order,
                        product=item.product,
                        product_name=item.product.name,
                        unit_price=item.product.price,
                        quantity=item.quantity,
                    )
                    for item in cart.items.all()
                ]
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
