const cartKey = "cartItems";
let allProducts = []; // To store fetched products

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();
});

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/groceries"
    );
    const data = await response.json();
    allProducts = data.products;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    const grid = document.querySelector(".products-grid");
    if (grid)
      grid.innerHTML =
        '<p class="text-center text-danger">Failed to load products. Please check your internet connection.</p>';
  }
}

// Render products to the grid
function renderProducts(products) {
  const productsGrid = document.querySelector(".products-grid");
  if (!productsGrid) return;

  let productsHTML = "";
  products.forEach((product) => {
    // Simulate Naira price (approx conversion or nice looking number)
    const price = Math.floor(product.price * 1400);
    // Use weight from API or default
    const weight = product.weight ? `${product.weight}kg` : "1kg";

    productsHTML += `
            <div class="col-md-6 col-lg-3">
                <div class="product-card">
                    <img src="${product.thumbnail}" alt="${
      product.title
    }" class="product-img">
                    <div class="product-details">
                        <h4 class="product-title">${product.title}</h4>
                        <div class="d-flex justify-content-between">
                            <div class="product-price">₦${price.toLocaleString()}</div>
                            <div class="product-weight text-muted">${weight}</div>
                        </div>
                        <button class="btn-add-cart js-add-to-cart" data-id="${
                          product.id
                        }">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        `;
  });

  productsGrid.innerHTML = productsHTML;
  attachAddToCartListeners();
}

// Attach listeners to dynamically created buttons
function attachAddToCartListeners() {
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    });
  });
}

// Add item to cart
function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const existingItem = cart.find((item) => item.id === productId);

  const price = Math.floor(product.price * 1400);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      productName: product.title,
      price: price,
      image: product.thumbnail,
      quantity: 1,
      kilo: product.weight ? `${product.weight}kg` : "1kg",
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();

  // Optional feedback
  // alert(`${product.title} added to cart!`);

  // Button feedback
  const btn = document.querySelector(`.js-add-to-cart[data-id="${productId}"]`);
  if (btn) {
    const originalText = btn.innerText;
    btn.innerText = "ADDED!";
    btn.style.background = "#4C956C";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = ""; // Reset to CSS default
    }, 1000);
  }
}

// Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountEls = document.querySelectorAll(".js-cart-quantity");
  cartCountEls.forEach((el) => {
    el.textContent = totalCount;
    el.parentElement.classList.add("bounce"); // Add animation class if defined
  });
}

// Navigation to checkout
function toggleCartPopup() {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  if (cart.length > 0) {
    window.location.href = "checkout.html";
  } else {
    alert("Your cart is empty. Add items first!");
  }
}
