// Get cart items from localStorage
let carts = JSON.parse(localStorage.getItem('cartItems')) || [];

// Product database for fixing incomplete items
const productsDatabase = [{
    image: '../images/fresh.jpg',
    name: 'Fresh Catfish ',
    price: '₦1,500',
    kilo: '1Kg'
}, {
    image: '../images/fresh 3.jpg',
    name: 'Fresh Catfish ',
    price: '₦3,000',
    kilo: '2kg'
}, {
    image: '../images/smokeeeeed.jpeg',
    name: 'smoked Catfish',
    price: '₦25,500',
    kilo: '1kg'
}, {
    image: '../images/grilled.jpeg',
    name: 'Grilled rabbit meat',
    price: '₦9,000',
    kilo: '1kg'
}, {
    image: '../images/new zealand.jpg',
    name: 'New zealand',
    price: '₦8,200',
    kilo: '1kg'
}];

// Fix incomplete cart items (items missing price/kilo data)
carts = carts.map(item => {
    if (!item.price || !item.kilo || !item.image) {
        const matchingProduct = productsDatabase.find(p => p.name === item.productName);
        if (matchingProduct) {
            return {
                ...item,
                price: matchingProduct.price,
                kilo: matchingProduct.kilo,
                image: matchingProduct.image
            };
        }
    }
    return item;
});

// Function to remove commas from price and convert to number
function parsePrice(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') {
        console.warn('Invalid price:', priceStr);
        return 0;
    }
    return parseInt(priceStr.replace(/[₦,]/g, ''));
}

// Function to format currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString();
}

// Function to render cart items
function renderCartItems() {
    // Get all cart sections and select the first one (left column)
    const allCartSections = document.querySelectorAll('.cart-section');
    const cartItemsContainer = allCartSections[0]; // First cart-section is for items

    if (!cartItemsContainer) {
        console.error('Cart container not found');
        return;
    }

    let cartHTML = `
        <h2 class="section-title">
            <i class="fas fa-box"></i> Your Items
        </h2>
    `;

    if (carts.length === 0) {
        cartHTML += '<p style="text-align: center; color: #666;">Your cart is empty. <a href="product.html">Continue shopping</a></p>';
    } else {
        carts.forEach((item, index) => {
            // Handle items that might be missing price/kilo data
            let itemPrice = item.price;
            let itemKilo = item.kilo;
            let itemImage = item.image;

            if (!itemPrice || !itemKilo) {
                console.log('Item missing data, will show as is');
            }

            const parsedPrice = itemPrice ? parsePrice(itemPrice) : 0;
            const totalPrice = parsedPrice * item.quantity;

            cartHTML += `
                <div class="cart-item">
                    <div class="item-image">
                        ${itemImage ? `<img src="${itemImage}" alt="${item.productName}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="fas fa-fish" style="font-size: 2rem; color: #006D5B;"></i>`}
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.productName}</div>
                        <div class="item-price">${itemPrice ? itemPrice : 'Price N/A'}</div>
                        <div class="item-meta">Weight: ${itemKilo ? itemKilo : 'N/A'}</div>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-selector">
                            <button class="qty-decrease" data-index="${index}">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="qty-increase" data-index="${index}">+</button>
                        </div>
                        <button class="delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        });
    }

    cartItemsContainer.innerHTML = cartHTML;

    // Add event listeners for quantity changes and delete buttons
    addCartEventListeners();
    updateOrderSummary();
}

// Function to add event listeners to quantity and delete buttons
function addCartEventListeners() {
    // Increase quantity
    document.querySelectorAll('.qty-increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            carts[index].quantity += 1;
            updateCart();
        });
    });

    // Decrease quantity
    document.querySelectorAll('.qty-decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (carts[index].quantity > 1) {
                carts[index].quantity -= 1;
            }
            updateCart();
        });
    });

    // Delete item
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.delete-btn').dataset.index;
            carts.splice(index, 1);
            updateCart();
        });
    });

    // Update quantity via input
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            let qty = parseInt(e.target.value);
            if (qty < 1) qty = 1;
            carts[index].quantity = qty;
            updateCart();
        });
    });
}

// Function to update order summary
function updateOrderSummary() {
    let subtotal = 0;
    let totalItems = 0;

    carts.forEach(item => {
        const itemPrice = parsePrice(item.price);
        subtotal += itemPrice * item.quantity;
        totalItems += item.quantity;
    });

    // Get all cart sections and select the second one (right column - order summary)
    const allCartSections = document.querySelectorAll('.cart-section');
    const orderSummaryContainer = allCartSections[1]; // Second cart-section is for order summary

    if (!orderSummaryContainer) {
        console.error('Order summary container not found');
        return;
    }

    // Update summary
    const orderSummaryItem = orderSummaryContainer.querySelector('.order-summary-item');
    if (orderSummaryItem) {
        orderSummaryItem.innerHTML = `
            <span>Subtotal (${totalItems} items)</span>
            <span>${formatCurrency(subtotal)}</span>
        `;
    }

    const priceRows = orderSummaryContainer.querySelectorAll('.price-row');
    if (priceRows.length >= 1) {
        priceRows[0].innerHTML = `
            <span>Shipping:</span>
            <span>TBD</span>
        `;
    }
    if (priceRows.length >= 2) {
        priceRows[1].innerHTML = `
            <span>Discount:</span>
            <span>-₦0</span>
        `;
    }
    if (priceRows.length >= 3) {
        priceRows[2].innerHTML = `
            <span>Total:</span>
            <span>${formatCurrency(subtotal)}</span>
        `;
    }
}

// Function to update cart
function updateCart() {
    localStorage.setItem('cartItems', JSON.stringify(carts));
    renderCartItems();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Checkout page loaded, cart items:', carts);
    renderCartItems();

    // Handle Proceed to Checkout button
    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (carts.length > 0) {
                // Navigate to checkout form page (to be created)
                window.location.href = 'checkout-form.html';
            } else {
                alert('Your cart is empty!');
            }
        });
    }

    // Handle Continue Shopping button
    const continueButton = document.querySelector('.btn-continue');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            window.location.href = 'product.html';
        });
    }
});

// Function to proceed to checkout form
function proceedToCheckout() {
    if (carts.length === 0) {
        alert('Your cart is empty! Please add items before checkout.');
        return;
    }

    // Disable button and show loading state
    const proceedBtn = document.getElementById('proceedCheckout');
    proceedBtn.disabled = true;
    proceedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

    // Simulate processing (1 second delay for UX)
    setTimeout(() => {
        window.location.href = 'checkout-form.html';
    }, 800);
}