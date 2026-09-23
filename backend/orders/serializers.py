from rest_framework import serializers

from .models import DeliveryAddress, Order, OrderItem


class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        fields = [
            "id", "full_name", "phone", "line1", "line2", "city", "state",
            "pincode", "latitude", "longitude", "is_default", "created_at",
        ]
        read_only_fields = ["created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "unit_price", "quantity", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = DeliveryAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "status", "total_amount", "address", "items",
            "razorpay_order_id", "created_at",
        ]
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    new_address = DeliveryAddressSerializer(required=False)

    def validate(self, attrs):
        if not attrs.get("address_id") and not attrs.get("new_address"):
            raise serializers.ValidationError("Provide an address_id or new_address.")
        return attrs
