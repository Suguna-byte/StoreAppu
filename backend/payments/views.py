import json
import logging

import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.serializers import OrderSerializer

from .models import PaymentEvent
from .services import mark_order_paid, verify_signature, verify_webhook_signature

logger = logging.getLogger(__name__)


def get_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        order = Order.objects.filter(id=order_id, user=request.user, status=Order.STATUS_PENDING).first()
        if not order:
            return Response({"detail": "Order not found or already processed."}, status=status.HTTP_404_NOT_FOUND)

        amount_paise = int(order.total_amount * 100)
        client = get_client()
        rp_order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": f"order-{order.id}",
                "notes": {"order_id": str(order.id)},
            }
        )
        order.razorpay_order_id = rp_order["id"]
        order.save(update_fields=["razorpay_order_id"])

        return Response(
            {
                "razorpay_order_id": rp_order["id"],
                "amount": amount_paise,
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID,
                "order_id": order.id,
                "store_name": settings.STORE_NAME,
            }
        )


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail": "Missing payment verification fields."}, status=400)

        order = Order.objects.filter(razorpay_order_id=razorpay_order_id, user=request.user).first()
        if not order:
            return Response({"detail": "Order not found."}, status=404)

        if not verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            order.status = Order.STATUS_FAILED
            order.save(update_fields=["status"])
            return Response({"detail": "Payment signature verification failed."}, status=400)

        PaymentEvent.objects.create(
            order=order, event_type="client.verify", razorpay_payment_id=razorpay_payment_id,
            raw_payload=request.data,
        )

        try:
            order = mark_order_paid(order, razorpay_payment_id)
        except ValidationError as exc:
            return Response({"detail": str(exc)}, status=409)

        return Response(OrderSerializer(order).data)


@csrf_exempt
def razorpay_webhook(request):
    """Server-to-server webhook: the authoritative fallback in case the browser
    closes before VerifyPaymentView runs. Configure this URL in the Razorpay
    dashboard under Settings > Webhooks with the `payment.captured` event."""
    from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

    if request.method != "POST":
        return HttpResponseBadRequest()

    signature = request.headers.get("X-Razorpay-Signature", "")
    if not verify_webhook_signature(request.body, signature):
        logger.warning("Razorpay webhook signature mismatch")
        return HttpResponse(status=400)

    payload = json.loads(request.body)
    event_type = payload.get("event", "")

    if event_type == "payment.captured":
        payment_entity = payload["payload"]["payment"]["entity"]
        rp_order_id = payment_entity["order_id"]
        rp_payment_id = payment_entity["id"]
        order = Order.objects.filter(razorpay_order_id=rp_order_id).first()
        if order:
            PaymentEvent.objects.create(
                order=order, event_type=event_type, razorpay_payment_id=rp_payment_id, raw_payload=payload
            )
            try:
                mark_order_paid(order, rp_payment_id)
            except ValidationError:
                logger.exception("Stock conflict finalizing order %s via webhook", order.id)

    return JsonResponse({"status": "ok"})
