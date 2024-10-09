from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('save_order/', views.save_order, name='save_order'),  # Correct URL
    path('order-history/', views.order_history, name='order_history'),
    path('order_details/<int:order_id>/', views.order_details, name='order_details'),
    path('add_appointment/', views.add_appointment, name='add_appointment'),
    path('appointments/', views.view_appointments, name='view_appointments'),




    path('search-customer/', views.search_customer, name='search_customer'),  # Update this line
    path('customer/<int:customer_id>/', views.customer_detail, name='customer_detail'),
    path('add_customer/', views.add_customer, name='add_customer'),
    path('select-customer/', views.select_customer, name='select_customer'),
    path('latest_order/', views.get_latest_order, name='latest_order'),

]
