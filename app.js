// Product Data
const products = [
    {
        id: 1,
        name: "Sony WH-1000XM5",
        price: 349.99,
        category: "Headphones",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "Apple AirPods Max",
        price: 549.00,
        category: "Headphones",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Marshall Major IV",
        price: 149.99,
        category: "Headphones",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800" // Placeholder, reusing for demo if needed or use different
    },
    {
        id: 4,
        name: "JBL Flip 6",
        price: 129.95,
        category: "Speakers",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        name: "Apple Watch Series 9",
        price: 399.00,
        category: "Wearables",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        name: "Samsung Galaxy Watch 6",
        price: 299.99,
        category: "Wearables",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        name: "GoPro Hero 12",
        price: 399.99,
        category: "Cameras",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1564466021183-1e4b9613d983?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 8,
        name: "Canon EOS R50",
        price: 679.99,
        category: "Cameras",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 9,
        name: "iPad Air 5",
        price: 599.00,
        category: "Tablets",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 10,
        name: "Logitech MX Master 3S",
        price: 99.99,
        category: "Accessories",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 11,
        name: "Keychron K2 Pro",
        price: 119.00,
        category: "Accessories",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a051?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 12,
        name: "Google Nest Audio",
        price: 99.99,
        category: "Speakers",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('shopCart')) || [];

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const featuredGrid = document.getElementById('featured-products');
const productModal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

// --- Functions --- //


// 1. Initialize
function init() {
    updateCartCount();

    // Check page context
    if (featuredGrid) {
        renderFeaturedProducts();
    }

    // Products Page Logic
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        renderProductsPage(products); // Render all initially
        setupFilterListeners();
    }

    // Global Search Listener
    const searchInput = document.getElementById('nav-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Example of persisting search across pages would require URL params, 
    // for now we'll do instant search if on products page, or redirect if on home (simple version: just alert or simple search on current page if elements exist)

    // Setup Modal Listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProductModal);
    }
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
}

// 2. Render Featured Products
function renderFeaturedProducts() {
    featuredGrid.innerHTML = products.slice(0, 8).map(product => createProductCard(product)).join('');
}

// 2.5 Render Products Page
function renderProductsPage(productsToRender) {
    const container = document.getElementById('products-container');
    const resultCount = document.getElementById('showing-results');

    if (productsToRender.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No products found.</p>';
        if (resultCount) resultCount.textContent = 'Showing 0 products';
        return;
    }

    container.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
    if (resultCount) resultCount.textContent = `Showing ${productsToRender.length} products`;
}

// --- Filter & Sort Logic --- //

function handleSearch(query) {
    // If we are on products page, filter locally
    const container = document.getElementById('products-container');
    if (container) {
        applyFilters();
        // Note: applyFilters calls render, so we should integrate search into applyFilters 
        // or just apply search on top. Let's make applyFilters the source of truth.
    } else {
        // If on home page, maybe redirect? For this simple non-SPA, strict requirement is "Search products".
        // Let's just log or optional: redirect to products.html?q=...
        // For simplicity in this vanilla setup, let's assume search works best on products page.
        // We can make the Navbar search redirect to products.html.
        if (query.length > 2) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }
}

function applyFilters() {
    let filtered = [...products];

    // 1. Search Query (from URL or Input)
    const navSearch = document.getElementById('nav-search');
    const query = navSearch ? navSearch.value.toLowerCase() : '';
    // Also check URL params if input is empty
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    const finalQuery = query || (searchParam ? searchParam.toLowerCase() : '');

    if (finalQuery) {
        // Pre-fill input if empty and param exists
        if (navSearch && !navSearch.value && searchParam) navSearch.value = searchParam;

        filtered = filtered.filter(p => p.name.toLowerCase().includes(finalQuery));
    }

    // 2. Categories
    const checkedCats = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    if (checkedCats.length > 0) {
        filtered = filtered.filter(p => checkedCats.includes(p.category));
    }

    // 3. Price Range
    const minPrice = parseFloat(document.getElementById('min-price')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price')?.value) || Infinity;
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 4. Rating
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    if (selectedRating) {
        const ratingVal = parseFloat(selectedRating.value);
        filtered = filtered.filter(p => p.rating >= ratingVal);
    }

    sortAndRender(filtered);
}

function sortProducts() {
    applyFilters(); // Re-trigger filter which calls sortAndRender
}

function sortAndRender(items) {
    const sortValue = document.getElementById('sort-select')?.value || 'default';

    if (sortValue === 'price-low') {
        items.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        items.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
    }

    renderProductsPage(items);
}

function setupFilterListeners() {
    // Categories
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    // Rating
    document.querySelectorAll('.rating-filter').forEach(r => {
        r.addEventListener('change', applyFilters);
    });



    // Check for URL search param on load (moved here from setupFilterListeners to ensure it runs)
    if (productsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('search')) {
            applyFilters();
        }
    }

    // Call Cart Page Render if applicable
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }

    // Call Checkout Summary Render if applicable
    if (document.getElementById('checkout-items')) {
        renderCheckoutSummary();
    }
}

// --- Cart Page Logic --- //

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal-price');
    const totalEl = document.getElementById('total-price');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 1rem;">Your cart is empty.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }

    let subtotal = 0;

    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;

        return `
            <div class="flex items-center" style="background: white; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color);">
                <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.25rem;">
                
                <div style="flex: 1; margin-left: 1rem;">
                    <h3 style="font-size: 1rem; font-weight: 600;">${product.name}</h3>
                    <p style="color: var(--text-light); font-size: 0.875rem;">$${product.price.toFixed(2)}</p>
                </div>

                <div class="flex items-center" style="margin-right: 1.5rem;">
                    <button class="qty-btn" style="width: 24px; height: 24px; font-size: 1rem;" onclick="updateCartItem(${product.id}, -1)">-</button>
                    <span style="margin: 0 0.75rem; min-width: 20px; text-align: center;">${item.qty}</span>
                    <button class="qty-btn" style="width: 24px; height: 24px; font-size: 1rem;" onclick="updateCartItem(${product.id}, 1)">+</button>
                </div>

                <div style="font-weight: 600; margin-right: 1.5rem; min-width: 80px; text-align: right;">
                    $${itemTotal.toFixed(2)}
                </div>

                <button style="color: var(--danger); background: none; font-size: 1.1rem;" onclick="removeCartItem(${product.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function updateCartItem(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        const newQty = item.qty + change;
        if (newQty > 0) {
            item.qty = newQty;
        } else {
            // Remove if qty becomes 0 (optional, or just stop at 1. User wants Remove button separately)
            // Let's stop at 1 here, use trash icon for remove
            item.qty = 1;
        }
        saveCart();
        renderCartPage();
        updateCartCount();
    }
}

function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage();
    updateCartCount();
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (cart.length === 0) {
        container.innerHTML = '<p>Cart is empty</p>';
        return;
    }

    let subtotal = 0;

    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        subtotal += product.price * item.qty;

        return `
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <img src="${product.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover; margin-right: 0.5rem;">
                    <span style="font-size: 0.9rem;">${product.name} <span style="color: var(--text-light);">x${item.qty}</span></span>
                </div>
                <span style="font-size: 0.9rem; font-weight: 500;">$${(product.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    }).join('');

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// 3. Create Product Card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="openProductModal(${product.id})">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer">${product.name}</h3>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span style="color:var(--text-light); margin-left:0.5rem; font-size:0.75rem">(${product.rating})</span>
                </div>
                <div class="product-price-row">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 4. Star Rating Helper
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    return starsHtml;
}

// 5. Cart Logic
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }

    saveCart();
    updateCartCount();

    // Optional: Show toast notification (can implement later)
    alert('Added to cart!');
}

function saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalQty;
}

// 6. Modal Logic
let currentModalQty = 1;
let currentModalProductId = null;

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentModalProductId = productId;
    currentModalQty = 1;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-rating').innerHTML = getStarRating(product.rating);
    document.getElementById('modal-qty').value = 1;

    // Setup add button
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
        addToCartFromModal(product.id, currentModalQty);
        closeProductModal();
    };

    productModal.classList.add('open');
}

function closeProductModal() {
    productModal.classList.remove('open');
}

function updateModalQty(change) {
    const newQty = currentModalQty + change;
    if (newQty >= 1) {
        currentModalQty = newQty;
        document.getElementById('modal-qty').value = currentModalQty;
    }
}

function addToCartFromModal(productId, qty) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ id: productId, qty: qty });
    }

    saveCart();
    updateCartCount();
    alert('Added to cart!');
}

// Run Init
document.addEventListener('DOMContentLoaded', init);
