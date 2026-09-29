from django.contrib import admin
from django.utils.html import format_html

from .models import DeliveryAddress, Order, OrderItem

STATUS_COLORS = {
    Order.STATUS_PENDING: "#b9860f",
    Order.STATUS_PAID: "#2f5233",
    Order.STATUS_FAILED: "#a3312a",
    Order.STATUS_SHIPPED: "#2f5233",
    Order.STATUS_DELIVERED: "#1d3620",
    Order.STATUS_CANCELLED: "#5c3a21",
}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status_badge", "total_amount", "item_count", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["user__email", "user__full_name", "id"]
    date_hierarchy = "created_at"
    inlines = [OrderItemInline]

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        color = STATUS_COLORS.get(obj.status, "#5c3a21")
        return format_html(
            '<span style="background:{}; color:#fdf6e8; padding:2px 10px; '
            'border-radius:999px; font-size:11px; font-weight:700; text-transform:uppercase;">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description="Items")
    def item_count(self, obj):
        return obj.items.count()


admin.site.register(DeliveryAddress)
