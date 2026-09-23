from django.db import models

from orders.models import Order


class PaymentEvent(models.Model):
    """Audit log of every Razorpay webhook/verification event received, for debugging and idempotency."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment_events")
    event_type = models.CharField(max_length=50)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    raw_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type} for order #{self.order_id}"
