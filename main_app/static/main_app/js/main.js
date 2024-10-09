// Get the modal
const historyModal = document.getElementById("history-modal");

// Get the button that opens the modal
const historyButton = document.getElementById("history-button");

// Get the <span> element that closes the modal
const closeButton = document.querySelector(".close-button");

// When the user clicks on the button, open the modal
historyButton.onclick = function() {
    historyModal.style.display = "block";
    // Populate sales history here dynamically if needed
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
    historyModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == historyModal) {
        historyModal.style.display = "none";
    }
}

let addedServices = [];

// Update the current date and time
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date-time').innerText = now.toLocaleString();
}

// Event listeners for service items


// Update the service list with quantity
function updateServiceList() {
    $('#services-container').empty();  // Clear the existing list

    addedServices.forEach((service, index) => {
        const serviceHtml = `
            <div class="calculation-item" id="service-${index}">
                <span>${index + 1}. ${service.name} x${service.quantity}</span>
                <span>$${(service.price * service.quantity).toFixed(2)}</span>
                <span class="remove-icon" onclick="removeService(${index})">&times;</span>
            </div>
        `;
        $('#services-container').append(serviceHtml);
    });
}

// Clear button functionality
$('#clear-button').on('click', function () {
    addedServices = [];
    $('#services-container').empty();

    // Clear discount, tip, and payment inputs
    $('#discount-input').val('');
    $('#tip-input').val('');
    $('#cash-received-input').val('');
    $('#card-received-input').val('');  // Clear card input

    updateCalculation(); // Update calculations after clearing
});

// Append service to the list with row number and remove icon
function appendServiceToList() {
    updateCalculation();
    const index = addedServices.length - 1; // Get index of the newly added service
    const serviceHtml = `
        <div class="calculation-item" id="service-${index}">
            <span>${index + 1}. ${addedServices[index].name}</span>
            <span>$${addedServices[index].price.toFixed(2)}</span>
            <span class="remove-icon" onclick="removeService(${index})">&times;</span>
        </div>
    `;
    $('#services-container').append(serviceHtml);
}

// Function to remove a service and re-index
function removeService(index) {
    // Remove the service from the array
    addedServices.splice(index, 1);

    // Re-render the services list and update the calculations
    renderServices();
    updateCalculation(); // Update calculations after removal
}

// Function to update calculations for subtotal, tax, and grand total
// Update calculations for subtotal, tax, and grand total
// Update calculations for subtotal, tax, and grand total
// Update calculations for subtotal, tax, and grand total
// Function to update calculations for subtotal, tax, and grand total
function updateCalculation() {
    let subtotal = 0;
    const subtotalElement = document.getElementById('subtotal').querySelector('span:last-child');
    const taxElement = document.getElementById('tax').querySelector('span:last-child');
    const grandTotalElement = document.getElementById('grand-total').querySelector('span:last-child');
    const warningElement = document.getElementById('payment-warning');

    // Calculate subtotal
    addedServices.forEach(service => {
        subtotal += service.price * service.quantity;
    });
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Calculate tax
    let taxRate = document.getElementById('tax-option').value;
    if (taxRate === 'manual') {
        const manualTaxInput = parseFloat(document.getElementById('manual-tax').value) || 0;
        taxRate = manualTaxInput / 100;
    } else {
        taxRate = parseFloat(taxRate);
    }
    const tax = subtotal * taxRate;
    taxElement.textContent = `$${tax.toFixed(2)}`;

    // Calculate discount
    const discountType = document.getElementById('discount-type').value;
    let discountValue = parseFloat(document.getElementById('discount-input').value) || 0;
    let discount = 0;
    if (discountType === 'percentage') {
        discount = (discountValue / 100) * subtotal;
    } else {
        discount = discountValue;
    }

    // Calculate tip
    const tipType = document.getElementById('tip-type').value;
    let tipValue = parseFloat(document.getElementById('tip-input').value) || 0;
    let tip = 0;
    if (tipType === 'percentage') {
        tip = (tipValue / 100) * subtotal;
    } else {
        tip = tipValue;
    }

    // Calculate grand total
    const grandTotal = subtotal + tax - discount + tip;
    grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;

    // Handle payment calculations
    const cashReceived = parseFloat(document.getElementById('cash-received-input').value) || 0;
    const cardReceived = parseFloat(document.getElementById('card-received-input').value) || 0;
    const totalReceived = cashReceived + cardReceived;

    // If total received is less than grand total, show remaining amount
    if (totalReceived < grandTotal) {
        const remainingAmount = grandTotal - totalReceived;
        warningElement.style.display = 'block'; // Show warning
        warningElement.textContent = `Insufficient payment. Please enter at least $${remainingAmount.toFixed(2)} more to cover the total.`;
    } else {
        warningElement.style.display = 'none'; // Hide warning
    }

    // Update change to return
    const changeToReturn = totalReceived >= grandTotal ? totalReceived - grandTotal : 0;
    document.getElementById('change-to-return').textContent = `$${changeToReturn.toFixed(2)}`;
}

// Event listeners for payment fields to auto-update the remaining balance
$('#cash-received-input').on('input', function() {
    updateCalculation();
});

$('#card-received-input').on('input', function() {
    updateCalculation();
});


// Event listener for manual tax input
$('#manual-tax').on('input', updateCalculation);

// Event listener to toggle manual tax input
$('#tax-option').on('change', function () {
    if ($(this).val() === 'manual') {
        $('#manual-tax').show();
    } else {
        $('#manual-tax').hide();
    }
    updateCalculation();
});

// Event listeners for other inputs to trigger recalculation when user input changes
$('#cash-received-input, #card-received-input, #discount-input, #tip-input, #discount-type, #tip-type, #tax-option').on('input change', updateCalculation);









// Update date and time every second
setInterval(updateDateTime, 1000);

// Tender button functionality
// Tender button functionality
// Tender button functionality
// Get CSRF token from the meta tag
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Setup AJAX for CSRF token
function setupAjaxCSRF() {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*|^https:.*/.test(settings.url))) {
                // Only send the token for same-origin requests
                xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
            }
        }
    });
}

// Call this function to setup CSRF token handling
setupAjaxCSRF();

// Get CSRF token from the meta tag
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Setup AJAX for CSRF token
function setupAjaxCSRF() {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*|^https:.*/.test(settings.url))) {
                xhr.setRequestHeader("X-CSRFToken", getCsrfToken());
            }
        }
    });
}

// Call this function to setup CSRF token handling
setupAjaxCSRF();


// Function to render the services list (predefined and custom services)
function renderServices() {
    $('#services-container').empty();
    addedServices.forEach((service, index) => {
        $('#services-container').append(`
            <div class="calculation-item" id="service-${index}">
                <span>${index + 1}. ${service.name} x${service.quantity}</span>
                <span>$${(service.price * service.quantity).toFixed(2)}</span>
                <span class="remove-icon" onclick="removeService(${index})">&times;</span>
            </div>
        `);
    });
}


$('#add-custom-service').on('click', function () {
    const customServiceName = $('#custom-service-name').val();
    const customServicePrice = parseFloat($('#custom-service-price').val());

    if (customServiceName && !isNaN(customServicePrice) && customServicePrice > 0) {
        const customServiceId = 'custom';  // Always use 'custom' as the ID for custom services

        // Check if a custom service already exists and update it
        const existingCustomService = addedServices.find(service => service.id === customServiceId);

        if (existingCustomService) {
            existingCustomService.name = customServiceName;
            existingCustomService.price = customServicePrice;
        } else {
            addedServices.push({
                id: customServiceId,
                name: customServiceName,
                price: customServicePrice,
                quantity: 1
            });
        }

        $('#custom-service-name').val('');
        $('#custom-service-price').val('');

        renderServices();
        updateCalculation();
    } else {
        alert('Please enter a valid name and price for the custom service.');
    }
});



// Event listener for adding predefined or custom services to the order list
$(document).off('click', '.service-item').on('click', '.service-item', function () {
    const serviceId = $(this).data('id');
    const serviceName = $(this).data('service');
    const servicePrice = parseFloat($(this).data('price'));

    // Check if the service already exists in the addedServices array
    const existingService = addedServices.find(service => service.id === serviceId);

    if (existingService) {
        // If service exists, increase its quantity
        existingService.quantity += 1;
    } else {
        // If service doesn't exist, add it with a quantity of 1
        addedServices.push({ id: serviceId, name: serviceName, price: servicePrice, quantity: 1 });
    }

    // Update service list and calculation
    renderServices();
    updateCalculation();
});


// Handle quantity change
$('#services-list').on('change', '.quantity-input', function () {
    const index = $(this).data('index');
    const newQuantity = parseInt($(this).val());
    if (newQuantity > 0) {
        addedServices[index].quantity = newQuantity;  // Update the quantity
    } else {
        $(this).val(1);  // Reset invalid quantity to 1
    }
    renderServices();  // Re-render the list to reflect changes
    updateCalculation();  // Update calculations after quantity change
});

// Handle service removal
$('#services-list').on('click', '.remove-service', function () {
    const index = $(this).data('index');
    addedServices.splice(index, 1);  // Remove the service from the array
    renderServices();  // Re-render the list after removal
    updateCalculation();  // Update calculations after removal
});


// Prepare data for saving the order (including custom services)
$('#tender-button').on('click', function () {
    let services = addedServices.map(service => {
        if (service.id === 'custom') {
            return {
                custom_service: true,
                name: service.name,
                price: service.price,
                quantity: service.quantity
            };
        } else {
            return {
                id: service.id,
                name: service.name,
                price: service.price,
                quantity: service.quantity
            };
        }
    });

    const subtotal = parseFloat(document.getElementById('subtotal').querySelector('span:last-child').innerText.replace('$', ''));
    const tax = parseFloat(document.getElementById('tax').querySelector('span:last-child').innerText.replace('$', ''));
    const discount = parseFloat(document.getElementById('discount-input').value) || 0;
    const tip = parseFloat(document.getElementById('tip-input').value) || 0;
    const grandTotal = parseFloat(document.getElementById('grand-total').querySelector('span:last-child').innerText.replace('$', ''));
    const cashReceived = parseFloat(document.getElementById('cash-received-input').value) || 0;
    const cardReceived = parseFloat(document.getElementById('card-received-input').value) || 0;
    const changeToReturn = cashReceived + cardReceived - grandTotal;

    const data = {
        services: services,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        tip: tip,
        grand_total: grandTotal,
        cash_received: cashReceived,
        card_received: cardReceived,
        change_returned: changeToReturn
    };

    // Send the data to the backend
    $.ajax({
        type: 'POST',
        url: '/save_order/',
        data: JSON.stringify(data),
        contentType: "application/json",
        headers: {
            'X-CSRFToken': getCsrfToken()
        },
        success: function (response) {
            if (response.status === 'success') {
                // After successfully saving the order, generate the receipt and show it in the modal
                const savedOrder = response.order;
                generateReceipt(savedOrder);  // Show receipt for the latest order
                $('#receiptModal').modal('show'); // Show the modal with the receipt

                addedServices = [];
                renderServices();  // Clear the services list
            } else {
                alert('Error saving the order: ' + response.message);
            }
        },
        error: function (error) {
            alert('Error in AJAX request: ' + error.responseText);
        }
    });
});

function generateReceipt(order) {
    const {
        customer,
        subtotal,
        tax,
        discount,
        tip,
        grand_total,
        cash_received,
        card_received,
        change_returned,
        services
    } = order;

    let receiptContent = `
        <div style="text-align: center;">
            <img src="/static/main_app/images/Logo-1000px.png" alt="Logo" style="width: 100%; max-width: 150px;"/>
        </div>
        <div style="text-align: center; font-size: 1.5em; margin: 10px 0;">
            <strong>Nail Salon POS Receipt</strong>
        </div>
        <div style="text-align: center;">${new Date().toLocaleString()}</div>
        <hr style="border-top: 1px solid #000;"/>
        <div style="text-align: center; font-size: 1.2em; margin-bottom: 10px;">
            <strong>Customer Information</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Customer:</strong> ${customer.first_name} ${customer.last_name}</span>
            <span><strong>Phone:</strong> ${customer.phone_number}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Email:</strong> ${customer.email}</span>
        </div>
        <hr style="border-top: 1px solid #000;"/>
        <div style="text-align: center; font-size: 1.2em; margin-bottom: 10px;">
            <strong>Services Purchased</strong>
        </div>
    `;

    services.forEach((service, index) => {
        const serviceName = service.custom_service_name || service.service__name || 'Unnamed Service';
        const servicePrice = service.custom_service_price || service.service__price || 0;
        const serviceQuantity = service.quantity || 1;

        receiptContent += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${index + 1}. ${serviceName} x${serviceQuantity}</span>
                <span>$${(servicePrice * serviceQuantity).toFixed(2)}</span>
            </div>
        `;
    });

    receiptContent += `
        <hr style="border-top: 1px solid #000;"/>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Subtotal</strong></span>
            <span><strong>$${subtotal.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Tax</strong></span>
            <span><strong>$${tax.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Discount</strong></span>
            <span><strong>-$${discount.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Tip</strong></span>
            <span><strong>+$${tip.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Grand Total</strong></span>
            <span><strong>$${grand_total.toFixed(2)}</strong></span>
        </div>
        <hr style="border-top: 1px solid #000;"/>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Cash Received</strong></span>
            <span><strong>$${cash_received.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Card Received</strong></span>
            <span><strong>$${card_received.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span><strong>Change Returned</strong></span>
            <span><strong>$${change_returned.toFixed(2)}</strong></span>
        </div>
        <hr style="border-top: 1px solid #000;"/>
        <div style="text-align: center; margin-top: 10px;">
            <strong>Thank you for your visit!</strong>
        </div>
    `;

    // Inject the receipt content into the modal
    $('#receipt-content').html(receiptContent);
    $('#receiptModal').modal('show');  // Show the receipt modal
}

// Print receipt functionality
$('#print-receipt-button').on('click', function () {
    const receiptContent = document.getElementById('receipt-content').innerHTML;

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});
















// Print receipt functionality
$('#print-receipt-button').on('click', function () {
    const receiptContent = document.getElementById('receipt-content').innerHTML;

    // Create a new window for printing
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});

function updateDateTime() {
    const dateTime = new Date().toLocaleString();
    document.getElementById("footer-date-time").innerText = dateTime;
}

// Update the date/time every second
setInterval(updateDateTime, 1000);

// You can also add session info dynamically if needed
document.getElementById("user-session-info").innerText = "Sara | Session Info";



















$(document).on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove();  // Remove any lingering backdrop after modal is hidden
});





// Reprint the latest order receipt
$(document).ready(function() {
    // Function to display receipt for the latest order
    $('#reprint-button').on('click', function() {
        console.log('Reprint button clicked.');

        // Fetch the latest order details via AJAX
        $.ajax({
            type: 'GET',
            url: '/latest_order/',  // Make sure this endpoint returns the latest order
            success: function(response) {
                console.log('Response received from server:', response); // Log the response from the server

                if (response.status === 'success') {
                    const order = response.order;
                    console.log('Generating receipt for order:', order);
                    generateReceipt(order);  // Call the function to generate and display the receipt
                    $('#receiptModal').modal('show');  // Ensure modal is shown after data is loaded
                    console.log('Receipt modal displayed.');
                } else {
                    console.error('Error in response:', response.message);
                    alert('Error: ' + response.message);
                }
            },
            error: function(error) {
                console.error('Error fetching the latest order details:', error);
                alert('Error fetching the latest order details.');
            }
        });
    });

    // Function to generate and display the receipt
    function generateReceipt(order) {
        console.log('Starting to generate receipt...');

        // Ensure the order object is structured properly
        if (!order || !order.customer) {
            console.error('Order data is missing or incomplete.');
            alert('Order data is missing or incomplete.');
            return;
        }

        const {
            customer,
            subtotal,
            tax,
            discount,
            tip,
            grand_total,
            cash_received,
            card_received,
            change_returned,
            services
        } = order;

        // Build the receipt content with proper validation
        let receiptContent = `
            <div style="text-align: center;">
                <img src="/static/main_app/images/Logo-1000px.png" alt="Logo" style="width: 100%; max-width: 150px;"/>
            </div>
            <div style="text-align: center; font-size: 1.5em; margin: 10px 0;">
                <strong>Nail Salon POS Receipt</strong>
            </div>
            <div style="text-align: center;">${new Date().toLocaleString()}</div>
            <hr style="border-top: 1px solid #000;"/>
            <div style="text-align: center; font-size: 1.2em; margin-bottom: 10px;">
                <strong>Customer Information</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Customer:</strong> ${customer.first_name} ${customer.last_name}</span>
                <span><strong>Phone:</strong> ${customer.phone_number}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Email:</strong> ${customer.email}</span>
            </div>
            <hr style="border-top: 1px solid #000;"/>
            <div style="text-align: center; font-size: 1.2em; margin-bottom: 10px;">
                <strong>Services Purchased</strong>
            </div>
        `;

        // Loop through services and add them to the receipt
        services.forEach((service, index) => {
            console.log('Processing service:', service);
            const serviceName = service.custom_service_name || service.service__name || 'Unnamed Service';
            const servicePrice = service.custom_service_price || service.service__price || 0;
            const serviceQuantity = service.quantity || 1;

            receiptContent += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${index + 1}. ${serviceName} x${serviceQuantity}</span>
                    <span>$${(servicePrice * serviceQuantity).toFixed(2)}</span>
                </div>
            `;
        });

        receiptContent += `
            <hr style="border-top: 1px solid #000;"/>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Subtotal</strong></span>
                <span><strong>$${subtotal.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Tax</strong></span>
                <span><strong>$${tax.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Discount</strong></span>
                <span><strong>-$${discount.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Tip</strong></span>
                <span><strong>+$${tip.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Grand Total</strong></span>
                <span><strong>$${grand_total.toFixed(2)}</strong></span>
            </div>
            <hr style="border-top: 1px solid #000;"/>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Cash Received</strong></span>
                <span><strong>$${cash_received.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Card Received</strong></span>
                <span><strong>$${card_received.toFixed(2)}</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Change Returned</strong></span>
                <span><strong>$${change_returned.toFixed(2)}</strong></span>
            </div>
            <hr style="border-top: 1px solid #000;"/>
            <div style="text-align: center; margin-top: 10px;">
                <strong>Thank you for your visit!</strong>
            </div>
        `;

        // Inject the receipt content into the modal
        $('#receipt-content').html(receiptContent);
        console.log('Receipt content injected into modal.');
    }
});


