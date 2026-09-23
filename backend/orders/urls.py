from rest_framework.routers import DefaultRouter

from .views import DeliveryAddressViewSet, OrderViewSet

router = DefaultRouter()
router.register("addresses", DeliveryAddressViewSet, basename="address")
router.register("", OrderViewSet, basename="order")

urlpatterns = router.urls
