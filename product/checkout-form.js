// Checkout Form Functionality

// Get cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Helper function to parse price
function parsePrice(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') {
        return 0;
    }
    return parseInt(priceStr.replace(/[₦,]/g, ''));
}

// Helper function to format currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString();
}

// Display order items in the summary
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    let html = '';

    if (cartItems.length === 0) {
        html = '<p style="text-align: center; color: var(--text-light);">Your cart is empty</p>';
    } else {
        cartItems.forEach(item => {
            const price = parsePrice(item.price);
            const itemTotal = price * item.quantity;
            html += `
                <div class="order-item">
                    <div>
                        <div style="font-weight: 600;">${item.productName}</div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">
                            ${item.quantity} × ${item.price}
                        </div>
                    </div>
                    <div style="font-weight: 600;">${formatCurrency(itemTotal)}</div>
                </div>
            `;
        });
    }

    orderItemsContainer.innerHTML = html;
    updatePrices();
}

// Update price totals based on shipping selection
function updatePrices() {
    let subtotal = 0;

    // Calculate subtotal
    cartItems.forEach(item => {
        const price = parsePrice(item.price);
        subtotal += price * item.quantity;
    });

    // Get shipping cost
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = parseInt(shippingRadio.value) || 0;

    // Calculate tax (5% of subtotal + shipping)
    const taxableAmount = subtotal + shippingCost;
    const tax = Math.round(taxableAmount * 0.05);

    // Calculate total
    const total = subtotal + shippingCost + tax;

    // Update DOM
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shippingCost').textContent = shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('totalPrice').textContent = formatCurrency(total);
}

// Print receipt function (MUST be outside DOMContentLoaded)
function printReceipt() {
    const receiptContent = document.getElementById('orderDetails').innerHTML;
    const orderNumber = document.getElementById('orderNumber').textContent;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Receipt - ${orderNumber}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background: white;
                }
                .receipt {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 2px solid #006D5B;
                    border-radius: 8px;
                }
                h3 {
                    color: #006D5B;
                    text-align: center;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <h3>📋 PAYMENT RECEIPT</h3>
                <p style="text-align: center;"><strong>${orderNumber}</strong></p>
                ${receiptContent}
            </div>
            <script>
                window.print();
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Initialize the page when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('Checkout form loaded, cart items:', cartItems);

    if (cartItems.length === 0) {
        alert('Your cart is empty! Redirecting to shop...');
        window.location.href = 'product.html';
        return;
    }

    displayOrderItems();

    // Handle shipping method change
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updatePrices);
    });

    // Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Disable button and show processing
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Get all input fields
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const country = document.getElementById('country').value.trim();

        // Validate all fields are filled
        if (!firstName || !lastName || !email || !phone || !address || !city || !state || !postalCode || !country) {
            alert('⚠️ Please fill in all required fields!\n\nMissing:\n' +
                (!firstName ? '✗ First Name\n' : '') +
                (!lastName ? '✗ Last Name\n' : '') +
                (!email ? '✗ Email Address\n' : '') +
                (!phone ? '✗ Phone Number\n' : '') +
                (!address ? '✗ Address\n' : '') +
                (!city ? '✗ City\n' : '') +
                (!state ? '✗ State\n' : '') +
                (!postalCode ? '✗ Postal Code\n' : '') +
                (!country ? '✗ Country\n' : '')
            );
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ Please enter a valid email address');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            return;
        }

        // Validate phone number (basic check)
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(phone) || phone.length < 10) {
            alert('⚠️ Please enter a valid phone number');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            return;
        }

        // Check terms checkbox
        if (!document.getElementById('termsCheck').checked) {
            alert('⚠️ Please agree to the Terms & Conditions');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
            return;
        }

        // Simulate payment processing with delay
        setTimeout(() => {
            // Collect order data
            const orderData = {
                orderId: 'ORD-' + Date.now(),
                orderDate: new Date().toLocaleDateString(),
                billingInfo: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    country: country
                },
                shippingMethod: document.querySelector('input[name="shipping"]:checked').nextElementSibling.textContent,
                paymentMethod: document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent,
                items: JSON.parse(JSON.stringify(cartItems)),
                subtotal: document.getElementById('subtotal').textContent,
                shipping: document.getElementById('shippingCost').textContent,
                tax: document.getElementById('tax').textContent,
                total: document.getElementById('totalPrice').textContent
            };

            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Show success message
            document.getElementById('orderNumber').textContent = `Order ID: ${orderData.orderId}`;

            // Generate receipt with all payment details
            let itemsReceipt = '';
            cartItems.forEach(item => {
                const price = parsePrice(item.price);
                const itemTotal = price * item.quantity;
                itemsReceipt += `
                <tr>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">${item.productName}</td>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
                    <td style="padding: 0.5rem 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${formatCurrency(itemTotal)}</td>
                </tr>
            `;
            });

            const successDetails = `
            <div style="background: white; border: 2px solid var(--primary-color); border-radius: 8px; padding: 2rem; margin: 1.5rem 0; font-size: 0.95rem; text-align: left;">
                <!-- Receipt Header -->
                <div style="text-align: center; margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 1rem;">
                    <h3 style="color: var(--primary-color); margin: 0 0 0.5rem 0; font-size: 1.3rem;">
                        <i class="fas fa-receipt"></i> PAYMENT RECEIPT
                    </h3>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">Amal Farm - Order Confirmation</p>
                </div>

                <!-- Order Info -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <p style="margin: 0.5rem 0; color: #666;"><strong>Order ID:</strong></p>
                        <p style="margin: 0.5rem 0; font-family: monospace; font-weight: bold; color: var(--primary-color);">${orderData.orderId}</p>
                    </div>
                    <div>
                        <p style="margin: 0.5rem 0; color: #666;"><strong>Order Date:</strong></p>
                        <p style="margin: 0.5rem 0;">${orderData.orderDate}</p>
                    </div>
                </div>

                <!-- Customer Details -->
                <div style="background: #f9f9f9; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                    <p style="margin: 0.3rem 0; color: #666;"><strong>Customer Name:</strong> ${orderData.billingInfo.firstName} ${orderData.billingInfo.lastName}</p>
                    <p style="margin: 0.3rem 0; color: #666;"><strong>Email:</strong> ${orderData.billingInfo.email}</p>
                    <p style="margin: 0.3rem 0; color: #666;"><strong>Phone:</strong> ${orderData.billingInfo.phone}</p>
                    <p style="margin: 0.3rem 0; color: #666;"><strong>Delivery Address:</strong> ${orderData.billingInfo.address}, ${orderData.billingInfo.city}, ${orderData.billingInfo.state}</p>
                </div>

                <!-- Items Table -->
                <div style="margin-bottom: 1.5rem;">
                    <table style="width: 100%; margin-bottom: 1rem;">
                        <thead>
                            <tr style="background: #f0f0f0; border-bottom: 2px solid var(--primary-color);">
                                <th style="padding: 0.75rem 0; text-align: left;">Product</th>
                                <th style="padding: 0.75rem 0; text-align: center; width: 60px;">Qty</th>
                                <th style="padding: 0.75rem 0; text-align: right; width: 80px;">Price</th>
                                <th style="padding: 0.75rem 0; text-align: right; width: 100px;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsReceipt}
                        </tbody>
                    </table>
                </div>

                <!-- Payment Summary -->
                <div style="background: #f9f9f9; padding: 1.2rem; border-radius: 6px; margin-bottom: 1.5rem;">
                    <div style="display: grid; grid-template-columns: 1fr 150px; gap: 1rem; margin-bottom: 0.75rem;">
                        <span><strong>Subtotal:</strong></span>
                        <span style="text-align: right;">${orderData.subtotal}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 150px; gap: 1rem; margin-bottom: 0.75rem;">
                        <span><strong>Shipping:</strong></span>
                        <span style="text-align: right;">${orderData.shipping}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 150px; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 0.75rem;">
                        <span><strong>Tax (5%):</strong></span>
                        <span style="text-align: right;">${orderData.tax}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 150px; gap: 1rem;">
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);"><strong>TOTAL:</strong></span>
                        <span style="text-align: right; font-size: 1.3rem; font-weight: 700; color: var(--primary-color);">${orderData.total}</span>
                    </div>
                </div>

                <!-- Payment Method -->
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid var(--secondary-color);">
                    <p style="margin: 0.3rem 0; color: #2e7d32;"><i class="fas fa-check-circle"></i> <strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                    <p style="margin: 0.3rem 0; color: #2e7d32;"><i class="fas fa-check-circle"></i> <strong>Status:</strong> <span style="font-weight: 700;">COMPLETED ✓</span></p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 1rem; color: #666; font-size: 0.85rem;">
                    <p style="margin: 0.5rem 0;">Thank you for your purchase!</p>
                    <p style="margin: 0.5rem 0;">Your order will be processed and delivered within 3-5 business days.</p>
                    <p style="margin: 1rem 0 0 0; font-size: 0.75rem; color: #999;">For inquiries: support@amalfarm.com | Phone: +234-XXX-XXX-XXXX</p>
                </div>
            </div>
        `;
            document.getElementById('orderDetails').innerHTML = successDetails;

            // Show toast notification first
            const successToast = document.getElementById('successToast');
            document.getElementById('toastMessage').textContent = `Order ID: ${orderData.orderId}`;
            successToast.style.display = 'block';

            // Auto-hide toast after 4 seconds
            setTimeout(() => {
                successToast.classList.add('hide');
                setTimeout(() => {
                    successToast.style.display = 'none';
                    successToast.classList.remove('hide');
                }, 500);
            }, 4000);

            // Show modal backdrop and message after a slight delay
            setTimeout(() => {
                document.getElementById('successOverlay').classList.add('show');
                document.getElementById('successMessage').classList.add('show');
            }, 300);

            // Clear the cart after showing success
            localStorage.removeItem('cartItems');

            // Log the order
            console.log('✅ Order placed successfully!', orderData);
            console.log('💾 Order saved to localStorage');
        }, 1500); // Simulate 1.5 second processing time
    });
});
