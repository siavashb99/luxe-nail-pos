from django.contrib import admin
from .models import Service, Order, OrderService

class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')
    search_fields = ('name',)

class OrderServiceInline(admin.TabularInline):
    model = OrderService
    extra = 1  # Number of extra empty forms to display
    readonly_fields = ('service', 'quantity')  # Display service and quantity, but make them read-only

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'subtotal', 'tax', 'grand_total', 'discount', 'tip', 'cash_received', 'card_received', 'change_returned', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('id',)
    inlines = [OrderServiceInline]  # Add inline for services with quantity

admin.site.register(Service, ServiceAdmin)
admin.site.register(Order, OrderAdmin)



