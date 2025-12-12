// let allProduct = JSON.parse(localStorage.getItem('amalProduct')) || []


// const addToCart = (fresh1, price, kilo) =>{
//     const productObj = {
//         name : fresh1,
//         prices: price,
//         kilos: kilo
//     }
//     allProduct.push(productObj)
//     console.log(allProduct);
//     cartCount.innerHTML = allProduct.length

//     // localStorage.setItem('amalProduct', JSON.stringify(allProduct))
// }

// console.log(allProduct);

const carts = JSON.parse(localStorage.getItem('cartItems')) || []

const products = [{
    image: '../images/fresh.jpg',
    name: 'Fresh Catfish ',
    price: '₦1,500',
    kilo: '1Kg'
}, {
    image: '../images/fresh 3.jpg',
    name: 'Fresh Catfish ',
    price: '₦3,000',
    kilo: '2kg'
},

{
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
}]

let productsHTML = '';

products.forEach((products) => {
    productsHTML += `
    <div class="col-md-6 col-lg-3">
                    <div class="product-card">
                        <img src="${products.image}" alt="Fresh Catfish" class="product-img">
                        <div class="product-details">
                            ${products.name}
                            <div class="d-flex justify-content-between">
                                ${products.price}
                                ${products.kilo}
                            </div>
                            <button class="btn-add-cart js-add-to-cart" data-product-name="${products.name}">ADD TO
                                CART</button>
                        </div>
                    </div>
                </div>
    `;
})
// console.log(productsHTML);
document.querySelector('.products-grid').
    innerHTML = productsHTML;

// Attach event listeners to add to cart buttons
function attachAddToCartListeners() {
    document.querySelectorAll('.js-add-to-cart')
        .forEach((button) => {
            button.addEventListener('click', () => {
                const productName = button.dataset.productName;
                console.log('Add to cart clicked for:', productName);

                // Find matching product first
                let matchingProduct;
                products.forEach((product) => {
                    if (productName === product.name) {
                        matchingProduct = product;
                    }
                });

                if (!matchingProduct) {
                    console.error('Product not found:', productName);
                    return;
                }

                console.log('Found product:', matchingProduct);

                // Then check if item already in cart
                let matchingItem;
                carts.forEach((item) => {
                    if (productName === item.productName) {
                        matchingItem = item;
                    }
                });

                if (matchingItem) {
                    matchingItem.quantity += 1;
                    console.log('Increased quantity of existing item');
                } else {
                    carts.push({
                        productName: productName,
                        quantity: 1,
                        price: matchingProduct.price,
                        kilo: matchingProduct.kilo,
                        image: matchingProduct.image
                    })
                    console.log('Added new item to cart');
                }

                let cartQuantity = 0
                carts.forEach((item) => {
                    cartQuantity += item.quantity;
                })

                document.querySelector('.js-cart-quantity')
                    .innerHTML = cartQuantity;

                // Store cart data in localStorage
                localStorage.setItem('cartItems', JSON.stringify(carts));
                console.log('Cart saved to localStorage:', carts);

            });
        })
}

// Attach listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    attachAddToCartListeners();
});

// Function to navigate to checkout page when cart icon is clicked
function toggleCartPopup() {
    if (carts.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Your cart is empty. Add items first!');
    }
}

// Initialize cart count on page load
let initialCartQuantity = 0;
carts.forEach((item) => {
    initialCartQuantity += item.quantity;
})
document.querySelector('.js-cart-quantity').innerHTML = initialCartQuantity;



