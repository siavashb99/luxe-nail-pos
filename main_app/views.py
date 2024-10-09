from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Service, Order
import json

from django.shortcuts import render
from .models import Service, Order, OrderService, Customer

from django.shortcuts import render
from .models import Service, Order, OrderService, Customer

from django.shortcuts import render
from .models import Order, OrderService, Service, Customer  # Import the necessary models

def home(request):
    # Fetch all services from the database
    services = Service.objects.all()

    # Fetch the selected customer from the session, if available
    selected_customer_id = request.session.get('selected_customer_id')
    selected_customer = None
    if selected_customer_id:
        selected_customer = Customer.objects.get(id=selected_customer_id)

    # Fetch the latest order and related services
    try:
        latest_order = Order.objects.latest('created_at')
        latest_order_services = OrderService.objects.filter(order=latest_order)

        # Fetch related services with quantity, name, and price
        services_data = latest_order_services.values(
            'service__name', 'service__price', 'custom_service_name', 'custom_service_price', 'quantity'
        )

        # Prepare the order data for the template
        order_data = {
            'id': latest_order.id,
            'subtotal': latest_order.subtotal,
            'tax': latest_order.tax,
            'grand_total': latest_order.grand_total,
            'discount': latest_order.discount,
            'tip': latest_order.tip,
            'cash_received': latest_order.cash_received,
            'card_received': latest_order.card_received,
            'change_returned': latest_order.change_returned,
            'services': list(services_data),
            'customer': {
                'first_name': latest_order.customer.first_name,
                'last_name': latest_order.customer.last_name,
                'phone_number': latest_order.customer.phone_number,
                'email': latest_order.customer.email,
            }
        }

    except Order.DoesNotExist:
        latest_order = None
        latest_order_services = []
        order_data = None

    # Prepare context to send to the template
    context = {
        'services': services,  # All available services
        'selected_customer': selected_customer,  # Pass the selected customer to the template
        'latest_order': latest_order,  # Latest order data
        'latest_order_services': latest_order_services,  # Services related to the latest order
        'order_data': order_data  # Order details for latest order (structured version)
    }

    return render(request, 'home.html', context)




# View for saving the order
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
import json
from .models import Service, Order


from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from .models import Order, Service, OrderService
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .models import Order, Service, OrderService, Customer
import json

from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from .models import Order, Service, OrderService, Customer
import json

@csrf_protect
def save_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            services_data = data.get('services', [])
            subtotal = float(data.get('subtotal', 0))
            tax = float(data.get('tax', 0))
            grand_total = float(data.get('grand_total', 0))
            discount = float(data.get('discount', 0))
            tip = float(data.get('tip', 0))
            cash_received = float(data.get('cash_received', 0))
            card_received = float(data.get('card_received', 0))
            change_returned = float(data.get('change_returned', 0))

            # Retrieve the selected customer from the session
            customer_id = request.session.get('selected_customer_id')
            customer = Customer.objects.get(id=customer_id)

            # Create a new order
            order = Order.objects.create(
                customer=customer,
                subtotal=subtotal,
                tax=tax,
                grand_total=grand_total,
                discount=discount,
                tip=tip,
                cash_received=cash_received,
                card_received=card_received,
                change_returned=change_returned
            )

            # Add services to the order
            for service_data in services_data:
                if service_data.get('custom_service'):
                    OrderService.objects.create(
                        order=order,
                        custom_service_name=service_data['name'],
                        custom_service_price=service_data['price'],
                        quantity=service_data.get('quantity', 1)
                    )
                else:
                    service = Service.objects.get(id=service_data['id'])
                    OrderService.objects.create(
                        order=order,
                        service=service,
                        quantity=service_data.get('quantity', 1)
                    )

            # Fetch related services to return full details of the order
            services = OrderService.objects.filter(order=order).values(
                'service__name', 'service__price', 'custom_service_name', 'custom_service_price', 'quantity'
            )

            # Prepare order data to return in response
            order_data = {
                'id': order.id,
                'subtotal': order.subtotal,
                'tax': order.tax,
                'grand_total': order.grand_total,
                'discount': order.discount,
                'tip': order.tip,
                'cash_received': order.cash_received,
                'card_received': order.card_received,
                'change_returned': order.change_returned,
                'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'services': list(services),  # Return services with name, price, and quantity
                'customer': {
                    'first_name': order.customer.first_name,
                    'last_name': order.customer.last_name,
                    'phone_number': order.customer.phone_number,
                    'email': order.customer.email,
                }
            }

            return JsonResponse({'status': 'success', 'order': order_data})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)










from django.utils import timezone
from .models import Order
from django.core import serializers
def order_history(request):
    # Get all orders sorted by created time (most recent first)
    all_orders = Order.objects.all().order_by('-created_at')

    # Serialize the queryset into a JSON format for JavaScript to use
    serialized_orders = serializers.serialize('json', all_orders)

    context = {
        'all_orders_json': serialized_orders,  # Pass the serialized orders to the template
    }

    return render(request, 'order_history.html', context)




from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Order, Service


from django.http import JsonResponse
from .models import Order, OrderService

from django.http import JsonResponse
from .models import Order, OrderService

from django.http import JsonResponse
from .models import Order, OrderService

from django.http import JsonResponse
from .models import Order, OrderService
from django.http import JsonResponse
from .models import Order, OrderService

from django.http import JsonResponse
from .models import Order, OrderService

from django.http import JsonResponse
from .models import Order, OrderService
import traceback

from django.shortcuts import render, get_object_or_404
from .models import Order, OrderService

def order_details(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        services = OrderService.objects.filter(order=order).values(
            'service__name', 'service__price', 'custom_service_name', 'custom_service_price', 'quantity'
        )

        order_data = {
            'id': order.id,
            'subtotal': order.subtotal,
            'tax': order.tax,
            'grand_total': order.grand_total,
            'discount': order.discount,
            'tip': order.tip,
            'cash_received': order.cash_received,
            'card_received': order.card_received,
            'change_returned': order.change_returned,
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'services': list(services),  # Make sure services are added correctly
            'customer': {
                'first_name': order.customer.first_name,
                'last_name': order.customer.last_name,
                'phone_number': order.customer.phone_number,
                'email': order.customer.email,
            }
        }

        return JsonResponse({'status': 'success', 'order': order_data})

    except Order.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)















from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .models import Appointment, Service

@csrf_protect
def add_appointment(request):
    if request.method == 'POST':
        try:
            # Get data from POST request (form data)
            customer_name = request.POST.get('customer_name')
            phone_number = request.POST.get('phone_number')
            service_id = request.POST.get('service')
            appointment_date = request.POST.get('date')
            start_time = request.POST.get('start_time')
            end_time = request.POST.get('end_time')

            # Validate required fields
            if not all([customer_name, phone_number, service_id, appointment_date, start_time, end_time]):
                return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

            # Get the service by ID
            try:
                service = Service.objects.get(id=service_id)
            except Service.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Service not found'}, status=404)

            # Create and save the new appointment
            appointment = Appointment.objects.create(
                customer_name=customer_name,
                phone_number=phone_number,
                service=service,
                date=appointment_date,
                start_time=start_time,
                end_time=end_time
            )

            return JsonResponse({'status': 'success', 'appointment_id': appointment.id})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)









from django.shortcuts import render
from .models import Appointment

def view_appointments(request):
    appointments = Appointment.objects.all().order_by('date', 'start_time')  # Order by date and time
    return render(request, 'appointments.html', {'appointments': appointments})



from django.shortcuts import render, redirect
from .forms import CustomerForm

def create_customer(request):
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')  # Replace 'home' with the actual home view name
    else:
        form = CustomerForm()
    
    return render(request, 'create_customer.html', {'form': form})



from django.shortcuts import render
from django.db.models import Q  # Import Q for complex lookups
from .models import Customer

def search_customer(request):
    search_query = request.GET.get('search_query', '')
    
    # Use Q for complex lookups
    customers = Customer.objects.filter(
        Q(first_name__icontains=search_query) |
        Q(last_name__icontains=search_query) |
        Q(phone_number__icontains=search_query)
    )

    context = {
        'customers': customers,
        'searched': True,
    }
    return render(request, 'search_customers.html', context)






def customer_detail(request, customer_id):
    customer = get_object_or_404(Customer, id=customer_id)
    orders = customer.orders.all()  # Related orders
    return render(request, 'customer_detail.html', {'customer': customer, 'orders': orders})



from django.shortcuts import render, redirect
from .models import Customer
from django.http import HttpResponse

def add_customer(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')
        email = request.POST.get('email')
        date_of_birth = request.POST.get('date_of_birth')

        # Create new customer
        Customer.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            email=email,
            date_of_birth=date_of_birth
        )
        return redirect('search_customer')  # Redirect back to the s

from django.shortcuts import redirect, get_object_or_404
from .models import Customer

def select_customer(request):
    if request.method == 'POST':
        customer_id = request.POST.get('customer_id')
        customer = get_object_or_404(Customer, id=customer_id)
        request.session['selected_customer_id'] = customer.id
        return redirect('home')  # Redirect to the order page after selection




from django.http import JsonResponse
from .models import Order, OrderService  # Adjust according to your models
import logging

logger = logging.getLogger(__name__)

def get_latest_order(request):
    try:
        logger.info('Fetching the latest order...')
        # Fetch the latest order by creation time or ID
        latest_order = Order.objects.latest('created_at')
        logger.info(f'Latest order fetched: {latest_order.id}')

        # Fetch related services with quantity, name, and price
        services = OrderService.objects.filter(order=latest_order).values(
            'service__name', 'service__price', 'custom_service_name', 'custom_service_price', 'quantity'
        )
        logger.info(f'Services fetched for order {latest_order.id}: {list(services)}')

        # Prepare the response data
        order_data = {
            'id': latest_order.id,
            'subtotal': latest_order.subtotal,
            'tax': latest_order.tax,
            'grand_total': latest_order.grand_total,
            'discount': latest_order.discount,
            'tip': latest_order.tip,
            'cash_received': latest_order.cash_received,
            'card_received': latest_order.card_received,
            'change_returned': latest_order.change_returned,
            'services': list(services),  # List of services
            'customer': {
                'first_name': latest_order.customer.first_name,
                'last_name': latest_order.customer.last_name,
                'phone_number': latest_order.customer.phone_number,
                'email': latest_order.customer.email,
            }
        }
        logger.info(f'Order data prepared for response: {order_data}')

        return JsonResponse({'status': 'success', 'order': order_data})
    except Order.DoesNotExist:
        logger.error('No orders found in the system')
        return JsonResponse({'status': 'error', 'message': 'No orders found'}, status=404)
    except Exception as e:
        logger.error(f'Error fetching the latest order: {str(e)}')
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

