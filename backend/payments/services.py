import hmac
import hashlib

from django.conf import settings
from django.db import transaction
from rest_framework.exceptions import ValidationError

from cart.models import Cart
from orders.models import Order


def verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify the HMAC-SHA256 signature Razorpay returns after a successful checkout."""
    payload = f"{order_id}|{payment_id}".encode()
    expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    expected = hmac.new(settings.RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


@transaction.atomic
def mark_order_paid(order: Order, razorpay_payment_id: str):
    """Idempotently decrement stock and mark the order paid.

    Row-locks products with select_for_update so two concurrent payments can
    never both succeed against the last unit of stock.
    """
    order = Order.objects.select_for_update().get(pk=order.pk)
    if order.status == Order.STATUS_PAID:
        return order  # already processed (e.g. webhook arrived after verify call)

    items = list(order.items.select_related("product"))
    for item in items:
        product = item.product.__class__.objects.select_for_update().get(pk=item.product_id)
        if product.stock < item.quantity:
            order.status = Order.STATUS_FAILED
            order.save(update_fields=["status"])
            raise ValidationError(f"Insufficient stock for {product.name}; payment cannot be completed.")

    for item in items:
        product = item.product.__class__.objects.select_for_update().get(pk=item.product_id)
        product.stock -= item.quantity
        product.save(update_fields=["stock"])

    order.status = Order.STATUS_PAID
    order.razorpay_payment_id = razorpay_payment_id
    order.save(update_fields=["status", "razorpay_payment_id"])

    cart = Cart.objects.filter(user=order.user).first()
    if cart:
        cart.items.all().delete()

    return order
