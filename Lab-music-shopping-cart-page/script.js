// Music Store Application - Full Stack Implementation
// Complete with all functionality for GitHub deployment

// ===== GLOBAL STATE & CONFIGURATION =====
const CONFIG = {
    taxRate: 0.10,
    shippingCost: 4.99,
    freeShippingThreshold: 50,
    coupons: {
        'MUSIC10': 0.10,
        'SYNTH20': 0.20,
        'WELCOME15': 0.15
    },
    itemsPerPage: 8
};

// Application State
const state = {
    products: [],
    filteredProducts: [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
    currentPage: 1,
    currentSort: 'featured',
    currentGenre: 'all',
    currentSearch: '',
    currentView: 'grid',
    appliedCoupon: null,
    discountAmount: 0
};

// ===== PRODUCT DATA =====
const productsData = [
    {
        id: 1,
        title: "Midnight City",
        artist: "M83",
        genre: "synthwave",
        price: 24.99,
        rating: 4.8,
        stock: 15,
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Iconic synthwave masterpiece with atmospheric soundscapes and driving beats. Limited edition vinyl with neon artwork.",
        featured: true,
        releaseYear: 2011,
        tracks: 12,
        format: "Vinyl + Digital"
    },
    {
        id: 2,
        title: "OutRun",
        artist: "Carpenter Brut",
        genre: "synthwave",
        price: 29.99,
        rating: 4.9,
        stock: 8,
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "High-energy retro wave with aggressive synth lines and cinematic atmosphere. Collector's edition.",
        featured: true,
        releaseYear: 2015,
        tracks: 10,
        format: "Vinyl + CD + Digital"
    },
    {
        id: 3,
        title: "Dragon",
        artist: "Perturbator",
        genre: "synthwave",
        price: 27.99,
        rating: 4.7,
        stock: 12,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Dark synthwave with industrial influences and haunting melodies. Exclusive red vinyl pressing.",
        featured: false,
        releaseYear: 2017,
        tracks: 14,
        format: "Vinyl"
    },
    {
        id: 4,
        title: "Endless Summer",
        artist: "The Midnight",
        genre: "retrowave",
        price: 22.99,
        rating: 4.6,
        stock: 20,
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Sunset-drenched retrowave with saxophone solos and nostalgic 80s vibes.",
        featured: true,
        releaseYear: 2016,
        tracks: 11,
        format: "Vinyl + Digital"
    },
    {
        id: 5,
        title: "Random Access Memories",
        artist: "Daft Punk",
        genre: "electronic",
        price: 34.99,
        rating: 4.9,
        stock: 5,
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Grammy-winning electronic masterpiece. Deluxe edition with bonus tracks.",
        featured: true,
        releaseYear: 2013,
        tracks: 13,
        format: "Vinyl + Digital + Artbook"
    },
    {
        id: 6,
        title: "Discovery",
        artist: "Daft Punk",
        genre: "electronic",
        price: 28.99,
        rating: 4.8,
        stock: 18,
        image: "https://images.unsplash.com/photo-1519281682544-5f37c4b14c47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "French house classic that defined a generation of electronic music.",
        featured: false,
        releaseYear: 2001,
        tracks: 14,
        format: "Vinyl"
    },
    {
        id: 7,
        title: "Back in Black",
        artist: "AC/DC",
        genre: "rock",
        price: 25.99,
        rating: 4.9,
        stock: 25,
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "One of the best-selling rock albums of all time. Remastered edition.",
        featured: false,
        releaseYear: 1980,
        tracks: 10,
        format: "Vinyl"
    },
    {
        id: 8,
        title: "Thriller",
        artist: "Michael Jackson",
        genre: "pop",
        price: 32.99,
        rating: 5.0,
        stock: 7,
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Best-selling album in history. Special anniversary edition.",
        featured: true,
        releaseYear: 1982,
        tracks: 9,
        format: "Vinyl + Poster"
    },
    {
        id: 9,
        title: "Kind of Blue",
        artist: "Miles Davis",
        genre: "jazz",
        price: 26.99,
        rating: 4.9,
        stock: 14,
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "The best-selling jazz record of all time. 180g audiophile pressing.",
        featured: false,
        releaseYear: 1959,
        tracks: 5,
        format: "Vinyl"
    },
    {
        id: 10,
        title: "Music Has the Right to Children",
        artist: "Boards of Canada",
        genre: "ambient",
        price: 31.99,
        rating: 4.7,
        stock: 6,
        image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Psychedelic ambient electronica masterpiece. Limited colored vinyl.",
        featured: true,
        releaseYear: 1998,
        tracks: 18,
        format: "Vinyl"
    },
    {
        id: 11,
        title: "A Moon Shaped Pool",
        artist: "Radiohead",
        genre: "rock",
        price: 29.99,
        rating: 4.8,
        stock: 11,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Atmospheric art-rock with orchestral arrangements. Special edition.",
        featured: false,
        releaseYear: 2016,
        tracks: 11,
        format: "Vinyl + Download"
    },
    {
        id: 12,
        title: "Random Album Title",
        artist: "Deadmau5",
        genre: "electronic",
        price: 23.99,
        rating: 4.5,
        stock: 22,
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Progressive house defining album with iconic tracks.",
        featured: false,
        releaseYear: 2008,
        tracks: 10,
        format: "Vinyl"
    }
];

// ===== DOM ELEMENTS =====
const elements = {
    // Header
    cartCount: document.getElementById('cartCount'),
    headerTotal: document.getElementById('headerTotal'),
    wishlistCount: document.getElementById('wishlistCount'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    
    // Products
    productsGrid: document.getElementById('productsGrid'),
    productsList: document.getElementById('productsList'),
    genreFilter: document.getElementById('genreFilter'),
    sortFilter: document.getElementById('sortFilter'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    viewButtons: document.querySelectorAll('.view-btn'),
    pagination: document.getElementById('pagination'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageNumbers: document.getElementById('pageNumbers'),
    
    // Cart
    cartItems: document.getElementById('cartItems'),
    subtotal: document.getElementById('subtotal'),
    shipping: document.getElementById('shipping'),
    tax: document.getElementById('tax'),
    discount: document.getElementById('discount'),
    total: document.getElementById('total'),
    clearCart: document.getElementById('clearCart'),
    saveCart: document.getElementById('saveCart'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    continueBtn: document.getElementById('continueBtn'),
    couponCode: document.getElementById('couponCode'),
    applyCoupon: document.getElementById('applyCoupon'),
    couponMessage: document.getElementById('couponMessage'),
    discountCode: document.getElementById('discountCode'),
    
    // Featured & Recent
    featuredList: document.getElementById('featuredList'),
    recentList: document.getElementById('recentList'),
    
    // Modals & UI
    productModal: document.getElementById('productModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutSuccess: document.getElementById('checkoutSuccess'),
    orderId: document.getElementById('orderId'),
    continueShopping: document.getElementById('continueShopping'),
    notification: document.getElementById('notification'),
    notificationTitle: document.getElementById('notificationTitle'),
    notificationText: document.getElementById('notificationText'),
    notificationIcon: document.getElementById('notificationIcon'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    
    // Buttons
    exploreBtn: document.getElementById('exploreBtn'),
    userBtn: document.getElementById('userBtn'),
    wishlistBtn: document.getElementById('wishlistBtn'),
    cartIcon: document.getElementById('cartIcon'),
    subscribeBtn: document.getElementById('subscribeBtn')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Simulate loading
    showLoading();
    
    // Initialize state
    state.products = [...productsData];
    state.filteredProducts = [...productsData];
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Render initial views
    renderProducts();
    renderCart();
    renderFeatured();
    renderRecentlyViewed();
    updateCartSummary();
    updateHeaderCart();
    updateWishlistCount();
    
    // Hide loading
    setTimeout(() => {
        hideLoading();
        showNotification('Welcome to SynthWave Music!', 'Ready to explore our vinyl collection?', 'success');
    }, 1500);
}

function loadFromLocalStorage() {
    // Cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
    }
    
    // Wishlist
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        state.wishlist = JSON.parse(savedWishlist);
    }
    
    // Recently Viewed
    const savedRecent = localStorage.getItem('recentlyViewed');
    if (savedRecent) {
        state.recentlyViewed = JSON.parse(savedRecent);
    }
    
    // Applied Coupon
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
        state.appliedCoupon = savedCoupon;
        elements.couponCode.value = savedCoupon;
        applyCouponCode(savedCoupon, false);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
    if (state.appliedCoupon) {
        localStorage.setItem('appliedCoupon', state.appliedCoupon);
    } else {
        localStorage.removeItem('appliedCoupon');
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile Menu
    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    const mobileUserBtn = document.getElementById('mobileUserBtn');
    if (mobileUserBtn) {
        mobileUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.mobileNav.classList.remove('active');
            showNotification('Account', 'User profile feature coming soon!', 'info');
        });
    }
    
    // Smooth scroll for explore button
    if (elements.exploreBtn) {
        elements.exploreBtn.addEventListener('click', () => {
            scrollToSection('products-section');
        });
    }

    // Filters & Search
    elements.genreFilter.addEventListener('change', handleFilterChange);
    elements.sortFilter.addEventListener('change', handleSortChange);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // View Toggle
    elements.viewButtons.forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn.dataset.view));
    });
    
    // Pagination
    elements.prevPage.addEventListener('click', goToPrevPage);
    elements.nextPage.addEventListener('click', goToNextPage);
    
    // Cart Actions
    elements.clearCart.addEventListener('click', clearCart);
    elements.saveCart.addEventListener('click', saveCart);
    elements.checkoutBtn.addEventListener('click', handleCheckout);
    elements.continueBtn.addEventListener('click', continueShopping);
    elements.applyCoupon.addEventListener('click', applyCoupon);
    elements.couponCode.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyCoupon();
    });
    
    // Modal Controls
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });
    
    // Notification
    document.querySelector('.close-notification').addEventListener('click', hideNotification);
    
    // Explore Button
    if (elements.exploreBtn) {
        elements.exploreBtn.addEventListener('click', () => {
            document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // User & Wishlist Buttons
    if (elements.userBtn) {
        elements.userBtn.addEventListener('click', () => {
            showNotification('Account', 'User profile feature coming soon!', 'info');
        });
    }
    
    if (elements.wishlistBtn) {
        elements.wishlistBtn.addEventListener('click', () => {
            showNotification('Wishlist', `You have ${state.wishlist.length} items in your wishlist`, 'info');
        });
    }
    
    // Cart Icon
    if (elements.cartIcon) {
        elements.cartIcon.addEventListener('click', () => {
            document.querySelector('.cart-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Newsletter Subscription
    if (elements.subscribeBtn) {
        elements.subscribeBtn.addEventListener('click', handleNewsletterSubscription);
    }
    
    // Continue Shopping (from checkout)
    if (elements.continueShopping) {
        elements.continueShopping.addEventListener('click', () => {
            closeModal();
            clearCart();
            showNotification('Happy Shopping!', 'Your cart is now empty. Start fresh!', 'success');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.mobileNav.contains(e.target) && !elements.mobileMenuBtn.contains(e.target)) {
            elements.mobileNav.classList.remove('active');
        }
    });
}

// ===== PRODUCT RENDERING =====
function renderProducts() {
    // Filter and sort products
    filterAndSortProducts();
    
    // Calculate pagination
    const totalPages = Math.ceil(state.filteredProducts.length / CONFIG.itemsPerPage);
    const startIndex = (state.currentPage - 1) * CONFIG.itemsPerPage;
    const endIndex = startIndex + CONFIG.itemsPerPage;
    const pageProducts = state.filteredProducts.slice(startIndex, endIndex);
    
    // Clear containers
    elements.productsGrid.innerHTML = '';
    elements.productsList.innerHTML = '';
    
    if (pageProducts.length === 0) {
        const emptyMessage = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <h3>No albums found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="hero-btn" id="resetFilters">Reset Filters</button>
            </div>
        `;
        elements.productsGrid.innerHTML = emptyMessage;
        elements.productsList.innerHTML = emptyMessage;
        
        // Add event listener to reset button
        setTimeout(() => {
            const resetBtn = document.getElementById('resetFilters');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
        }, 100);
        
        elements.pagination.classList.add('hidden');
        return;
    }
    
    // Render grid view
    pageProducts.forEach(product => {
        elements.productsGrid.appendChild(createProductCard(product));
    });
    
    // Render list view
    pageProducts.forEach(product => {
        elements.productsList.appendChild(createProductListItem(product));
    });
    
    // Update pagination
    renderPagination(totalPages);
    
    // Show/hide views based on current view
    updateViewDisplay();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
    const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low Stock (${product.stock})` : 'Out of Stock';
    
    const inWishlist = state.wishlist.includes(product.id);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-content">
            <h4 class="product-title">${product.title}</h4>
            <p class="product-artist">${product.artist}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating}</span>
                </div>
            </div>
            <div class="product-stock ${stockClass}">${stockText}</div>
            <div class="product-actions">
                <button class="btn-add-cart" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button class="btn-wishlist ${inWishlist ? 'active' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart${inWishlist ? '' : ''}"></i>
                </button>
                <button class="btn-view">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = card.querySelector('.btn-add-cart');
    const wishlistBtn = card.querySelector('.btn-wishlist');
    const viewBtn = card.querySelector('.btn-view');
    
    if (product.stock > 0) {
        addToCartBtn.addEventListener('click', () => addToCart(product.id));
    }
    
    wishlistBtn.addEventListener('click', () => toggleWishlist(product.id));
    viewBtn.addEventListener('click', () => showProductModal(product));
    
    return card;
}

function createProductListItem(product) {
    const item = document.createElement('div');
    item.className = 'product-list-item';
    item.dataset.id = product.id;
    
    const inWishlist = state.wishlist.includes(product.id);
    
    item.innerHTML = `
        <div class="list-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="list-content">
            <h4 class="product-title">${product.title}</h4>
            <p class="product-artist">${product.artist} • ${product.genre}</p>
            <p class="product-description">${product.description}</p>
            <div class="list-details">
                <div class="list-meta">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                    </div>
                    <div class="product-stock ${product.stock > 10 ? 'in-stock' : 'low-stock'}">
                        ${product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn-wishlist ${inWishlist ? 'active' : ''}" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-view">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = item.querySelector('.btn-add-cart');
    const wishlistBtn = item.querySelector('.btn-wishlist');
    const viewBtn = item.querySelector('.btn-view');
    
    if (product.stock > 0) {
        addToCartBtn.addEventListener('click', () => addToCart(product.id));
    }
    
    wishlistBtn.addEventListener('click', () => toggleWishlist(product.id));
    viewBtn.addEventListener('click', () => showProductModal(product));
    
    return item;
}

// ===== CART FUNCTIONS =====
function addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock === 0) {
        showNotification('Out of Stock', `${product.title} is currently unavailable`, 'error');
        return;
    }
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            showNotification('Stock Limit', `Only ${product.stock} items available`, 'warning');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: productId,
            quantity: quantity,
            price: product.price,
            title: product.title,
            artist: product.artist,
            image: product.image
        });
    }
    
    saveToLocalStorage();
    renderCart();
    updateCartSummary();
    updateHeaderCart();
    
    showNotification('Added to Cart', `${product.title} added to your cart`, 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    renderCart();
    updateCartSummary();
    updateHeaderCart();
    
    showNotification('Removed', 'Item removed from cart', 'info');
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const product = state.products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
        showNotification('Stock Limit', `Only ${product.stock} items available`, 'warning');
        newQuantity = product.stock;
    }
    
    const cartItem = state.cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveToLocalStorage();
        renderCart();
        updateCartSummary();
        updateHeaderCart();
    }
}

function renderCart() {
    elements.cartItems.innerHTML = '';
    
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p class="small">Add some music to get started!</p>
            </div>
        `;
        return;
    }
    
    state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.id);
        if (!product) return;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="cart-item-details">
                <h5 class="cart-item-title">${product.title}</h5>
                <p class="cart-item-artist">${product.artist}</p>
                <p class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" data-id="${product.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" data-id="${product.id}">
                <button class="quantity-btn plus" data-id="${product.id}">+</button>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        elements.cartItems.appendChild(cartItem);
        
        // Add event listeners
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const quantityInput = cartItem.querySelector('.quantity-input');
        const removeBtn = cartItem.querySelector('.remove-item');
        
        minusBtn.addEventListener('click', () => {
            updateCartItemQuantity(product.id, item.quantity - 1);
        });
        
        plusBtn.addEventListener('click', () => {
            updateCartItemQuantity(product.id, item.quantity + 1);
        });
        
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity)) {
                updateCartItemQuantity(product.id, newQuantity);
            }
        });
        
        removeBtn.addEventListener('click', () => removeFromCart(product.id));
    });
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    const shipping = subtotal >= CONFIG.freeShippingThreshold ? 0 : CONFIG.shippingCost;
    const tax = subtotal * CONFIG.taxRate;
    const discount = state.discountAmount;
    const total = subtotal + shipping + tax - discount;
    
    elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    elements.shipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    elements.tax.textContent = `$${tax.toFixed(2)}`;
    elements.discount.textContent = `-$${discount.toFixed(2)}`;
    elements.total.textContent = `$${total.toFixed(2)}`;
    
    // Update shipping color if free
    if (shipping === 0) {
        elements.shipping.style.color = 'var(--success)';
        elements.shipping.style.fontWeight = '600';
    } else {
        elements.shipping.style.color = '';
        elements.shipping.style.fontWeight = '';
    }
}

function updateHeaderCart() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = state.cart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    elements.cartCount.textContent = totalItems;
    elements.headerTotal.textContent = `$${totalAmount.toFixed(2)}`;
    
    // Add animation if items were just added
    if (totalItems > 0) {
        elements.cartCount.classList.add('pulse');
        setTimeout(() => elements.cartCount.classList.remove('pulse'), 300);
    }
}

function clearCart() {
    if (state.cart.length === 0) {
        showNotification('Cart Empty', 'Your cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        state.cart = [];
        state.discountAmount = 0;
        state.appliedCoupon = null;
        elements.couponCode.value = '';
        elements.couponMessage.textContent = '';
        elements.discountCode.textContent = '';
        
        saveToLocalStorage();
        renderCart();
        updateCartSummary();
        updateHeaderCart();
        
        showNotification('Cart Cleared', 'All items removed from cart', 'info');
    }
}

function saveCart() {
    if (state.cart.length === 0) {
        showNotification('Cannot Save', 'Your cart is empty', 'warning');
        return;
    }
    
    const cartData = {
        items: state.cart,
        savedAt: new Date().toISOString(),
        total: state.cart.reduce((sum, item) => {
            const product = state.products.find(p => p.id === item.id);
            return sum + (product.price * item.quantity);
        }, 0)
    };
    
    localStorage.setItem('savedCart', JSON.stringify(cartData));
    showNotification('Cart Saved', 'Your cart has been saved for later', 'success');
}

// ===== COUPON FUNCTIONS =====
function applyCoupon() {
    const code = elements.couponCode.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Missing Code', 'Please enter a coupon code', 'warning');
        return;
    }
    
    applyCouponCode(code, true);
}

function applyCouponCode(code, showMessage = true) {
    if (!CONFIG.coupons[code]) {
        if (showMessage) {
            elements.couponMessage.textContent = 'Invalid coupon code';
            elements.couponMessage.className = 'coupon-message error';
            showNotification('Invalid Coupon', 'The coupon code is not valid', 'error');
        }
        return false;
    }
    
    const discountRate = CONFIG.coupons[code];
    const subtotal = state.cart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
    
    state.discountAmount = subtotal * discountRate;
    state.appliedCoupon = code;
    
    elements.discountCode.textContent = `(${code})`;
    elements.couponMessage.textContent = `${discountRate * 100}% discount applied!`;
    elements.couponMessage.className = 'coupon-message success';
    
    if (showMessage) {
        showNotification('Coupon Applied', `You saved ${discountRate * 100}% on your order!`, 'success');
    }
    
    saveToLocalStorage();
    updateCartSummary();
    return true;
}

// ===== WISHLIST FUNCTIONS =====
function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    
    if (index === -1) {
        state.wishlist.push(productId);
        showNotification('Added to Wishlist', 'Item added to your wishlist', 'success');
    } else {
        state.wishlist.splice(index, 1);
        showNotification('Removed', 'Item removed from wishlist', 'info');
    }
    
    saveToLocalStorage();
    updateWishlistCount();
    renderProducts(); // Re-render to update wishlist button states
}

function updateWishlistCount() {
    elements.wishlistCount.textContent = state.wishlist.length;
}

// ===== FILTERS & SORTING =====
function filterAndSortProducts() {
    let filtered = [...state.products];
    
    // Apply genre filter
    if (state.currentGenre !== 'all') {
        filtered = filtered.filter(product => product.genre === state.currentGenre);
    }
    
    // Apply search filter
    if (state.currentSearch) {
        const searchTerm = state.currentSearch.toLowerCase();
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.artist.toLowerCase().includes(searchTerm) ||
            product.genre.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply sorting
    switch (state.currentSort) {
        case 'name':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filtered.sort((a, b) => b.releaseYear - a.releaseYear);
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => (b.featured - a.featured) || b.rating - a.rating);
            break;
    }
    
    state.filteredProducts = filtered;
    state.currentPage = 1; // Reset to first page when filtering
}

function handleFilterChange() {
    state.currentGenre = elements.genreFilter.value;
    renderProducts();
}

function handleSortChange() {
    state.currentSort = elements.sortFilter.value;
    renderProducts();
}

function handleSearch() {
    state.currentSearch = elements.searchInput.value;
    renderProducts();
}

function resetFilters() {
    elements.genreFilter.value = 'all';
    elements.sortFilter.value = 'featured';
    elements.searchInput.value = '';
    
    state.currentGenre = 'all';
    state.currentSort = 'featured';
    state.currentSearch = '';
    
    renderProducts();
    showNotification('Filters Reset', 'All filters have been reset', 'info');
}

// ===== VIEW TOGGLE =====
function handleViewChange(view) {
    state.currentView = view;
    
    // Update active button
    elements.viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    updateViewDisplay();
}

function updateViewDisplay() {
    const isGridView = state.currentView === 'grid';
    elements.productsGrid.classList.toggle('active', isGridView);
    elements.productsList.classList.toggle('active', !isGridView);
    elements.productsGrid.classList.toggle('hidden', !isGridView);
    elements.productsList.classList.toggle('hidden', isGridView);
}

// ===== PAGINATION =====
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        elements.pagination.classList.add('hidden');
        return;
    }
    
    elements.pagination.classList.remove('hidden');
    
    // Update button states
    elements.prevPage.disabled = state.currentPage === 1;
    elements.nextPage.disabled = state.currentPage === totalPages;
    
    // Generate page numbers
    elements.pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        elements.pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    if (page < 1 || page > Math.ceil(state.filteredProducts.length / CONFIG.itemsPerPage)) return;
    
    state.currentPage = page;
    renderProducts();
    
    // Scroll to top of products
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}

function goToPrevPage() {
    goToPage(state.currentPage - 1);
}

function goToNextPage() {
    goToPage(state.currentPage + 1);
}

// ===== FEATURED & RECENTLY VIEWED =====
function renderFeatured() {
    elements.featuredList.innerHTML = '';
    
    const featuredProducts = state.products
        .filter(product => product.featured)
        .slice(0, 3);
    
    featuredProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'featured-item';
        item.dataset.id = product.id;
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div>
                <p class="featured-title">${product.title}</p>
                <p class="featured-artist">${product.artist}</p>
            </div>
            <span class="featured-price">$${product.price.toFixed(2)}</span>
        `;
        
        item.addEventListener('click', () => showProductModal(product));
        elements.featuredList.appendChild(item);
    });
}

function renderRecentlyViewed() {
    elements.recentList.innerHTML = '';
    
    if (state.recentlyViewed.length === 0) {
        elements.recentList.innerHTML = '<p class="small">No recently viewed items</p>';
        return;
    }
    
    // Get the actual product objects
    const recentProducts = state.recentlyViewed
        .map(id => state.products.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 3);
    
    recentProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.dataset.id = product.id;
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div>
                <p class="recent-title">${product.title}</p>
                <p class="recent-artist">${product.artist}</p>
            </div>
        `;
        
        item.addEventListener('click', () => showProductModal(product));
        elements.recentList.appendChild(item);
    });
}

function addToRecentlyViewed(productId) {
    // Remove if already exists
    const index = state.recentlyViewed.indexOf(productId);
    if (index !== -1) {
        state.recentlyViewed.splice(index, 1);
    }
    
    // Add to beginning
    state.recentlyViewed.unshift(productId);
    
    // Keep only last 5 items
    if (state.recentlyViewed.length > 5) {
        state.recentlyViewed.pop();
    }
    
    saveToLocalStorage();
    renderRecentlyViewed();
}

// ===== MODAL FUNCTIONS =====
function showProductModal(product) {
    // Add to recently viewed
    addToRecentlyViewed(product.id);
    
    // Update modal content
    elements.modalTitle.textContent = product.title;
    
    const inCart = state.cart.find(item => item.id === product.id);
    const inWishlist = state.wishlist.includes(product.id);
    
    elements.modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="modal-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-details">
                <h4>${product.title}</h4>
                <p class="modal-artist">${product.artist}</p>
                <div class="modal-price">$${product.price.toFixed(2)}</div>
                
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating}</span>
                    <span class="rating-count">(125 reviews)</span>
                </div>
                
                <p class="modal-description">${product.description}</p>
                
                <div class="modal-features">
                    <ul>
                        <li><i class="fas fa-check"></i> Genre: ${product.genre}</li>
                        <li><i class="fas fa-check"></i> Release Year: ${product.releaseYear}</li>
                        <li><i class="fas fa-check"></i> Tracks: ${product.tracks}</li>
                        <li><i class="fas fa-check"></i> Format: ${product.format}</li>
                        <li><i class="fas fa-check"></i> Stock: ${product.stock} units available</li>
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-add-cart" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${inCart ? `In Cart (${inCart.quantity})` : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button class="btn-wishlist ${inWishlist ? 'active' : ''}" data-id="${product.id}">
                        <i class="fas fa-heart"></i> 
                        ${inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = elements.modalBody.querySelector('.btn-add-cart');
    const wishlistBtn = elements.modalBody.querySelector('.btn-wishlist');
    
    if (product.stock > 0) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id);
            closeModal();
        });
    }
    
    wishlistBtn.addEventListener('click', () => {
        toggleWishlist(product.id);
        closeModal();
    });
    
    // Show modal
    elements.productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function handleCheckout() {
    if (state.cart.length === 0) {
        showNotification('Empty Cart', 'Add items to your cart before checkout', 'warning');
        return;
    }
    
    // Generate order ID
    const orderId = 'SWM-' + Date.now().toString().slice(-8);
    elements.orderId.textContent = orderId;
    
    // Show checkout modal
    elements.checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function continueShopping() {
    // Scroll to products section
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(title, message, type = 'success') {
    // Set content
    elements.notificationTitle.textContent = title;
    elements.notificationText.textContent = message;
    
    // Set icon based on type
    let icon = 'fa-check-circle';
    let color = 'var(--success)';
    
    switch (type) {
        case 'error':
            icon = 'fa-exclamation-circle';
            color = 'var(--danger)';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            color = 'var(--warning)';
            break;
        case 'info':
            icon = 'fa-info-circle';
            color = 'var(--accent)';
            break;
    }
    
    elements.notificationIcon.className = `fas ${icon}`;
    elements.notification.style.borderLeftColor = color;
    elements.notificationIcon.style.color = color;
    
    // Show notification
    elements.notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

function hideNotification() {
    elements.notification.classList.remove('show');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    elements.mobileNav.classList.toggle('active');
}

// ===== NEWSLETTER =====
function handleNewsletterSubscription() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Missing Email', 'Please enter your email address', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate subscription
    emailInput.value = '';
    showNotification('Subscribed!', 'Thank you for subscribing to our newsletter', 'success');
    
    // In a real app, you would send this to your backend
    console.log('Newsletter subscription:', email);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== LOADING STATES =====
function showLoading() {
    elements.loadingOverlay.classList.add('active');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===== CSS ANIMATIONS =====
// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 0.3s ease;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        grid-column: 1 / -1;
    }
    
    .empty-state i {
        font-size: 4rem;
        color: var(--light-gray);
        margin-bottom: 1.5rem;
    }
    
    .empty-state h3 {
        margin-bottom: 0.5rem;
        color: var(--dark);
    }
    
    .empty-state p {
        margin-bottom: 1.5rem;
        color: var(--gray);
    }
`;
document.head.appendChild(style);
// ===== NAVIGATION FUNCTIONS =====
function setupNavigation() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            switch(section) {
                case 'hero':
                    scrollToSection('hero');
                    break;
                case 'new-releases':
                    scrollToSection('products-section');
                    setFilterForNewReleases();
                    break;
                case 'trending':
                    scrollToSection('products-section');
                    setFilterForTrending();
                    break;
                case 'deals':
                    scrollToSection('products-section');
                    setFilterForDeals();
                    break;
                default:
                    scrollToSection('products-section');
            }
        });
    });
    
    // Mobile navigation links
    const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            // Close mobile menu
            elements.mobileNav.classList.remove('active');
            
            switch(section) {
                case 'hero':
                    scrollToSection('hero');
                    break;
                case 'new-releases':
                    scrollToSection('products-section');
                    setFilterForNewReleases();
                    break;
                case 'trending':
                    scrollToSection('products-section');
                    setFilterForTrending();
                    break;
                case 'deals':
                    scrollToSection('products-section');
                    setFilterForDeals();
                    break;
                default:
                    scrollToSection('products-section');
            }
        });
    });
    
    // Footer links
    const footerLinks = document.querySelectorAll('.footer-section a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetSection = link.dataset.section;
                
                if (targetId && document.getElementById(targetId)) {
                    scrollToSection(targetId);
                    
                    // Apply filter if specified
                    if (targetSection) {
                        switch(targetSection) {
                            case 'trending':
                                setFilterForTrending();
                                break;
                            case 'deals':
                                setFilterForDeals();
                                break;
                        }
                    }
                }
            }
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function setFilterForNewReleases() {
    elements.sortFilter.value = 'newest';
    state.currentSort = 'newest';
    renderProducts();
    
    // Show notification
    setTimeout(() => {
        showNotification('New Releases', 'Showing the newest albums in our collection', 'info');
    }, 500);
}

function setFilterForTrending() {
    elements.sortFilter.value = 'rating';
    state.currentSort = 'rating';
    renderProducts();
    
    // Show notification
    setTimeout(() => {
        showNotification('Trending Now', 'Showing our highest rated albums', 'info');
    }, 500);
}

function setFilterForDeals() {
    // For deals, we'll show discounted items
    // In a real app, you would filter by discount property
    elements.sortFilter.value = 'price-low';
    state.currentSort = 'price-low';
    renderProducts();
    
    // Show notification
    setTimeout(() => {
        showNotification('Special Deals', 'Showing albums starting from lowest price', 'info');
    }, 500);
}

// ===== ENHANCED CART FUNCTIONALITY =====
function setupEnhancedCart() {
    // Save cart functionality
    elements.saveCart.addEventListener('click', () => {
        if (state.cart.length === 0) {
            showNotification('Cannot Save', 'Your cart is empty', 'warning');
            return;
        }
        
        const cartData = {
            items: state.cart,
            timestamp: new Date().toISOString(),
            total: calculateCartTotal()
        };
        
        // Save to localStorage
        localStorage.setItem('savedCart', JSON.stringify(cartData));
        
        // Create downloadable JSON file
        const dataStr = JSON.stringify(cartData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `synthwave-cart-${Date.now()}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        showNotification('Cart Saved', 'Your cart has been saved and downloaded', 'success');
    });
    
    // Clear cart with confirmation
    elements.clearCart.addEventListener('click', () => {
        if (state.cart.length === 0) {
            showNotification('Cart Empty', 'Your cart is already empty', 'info');
            return;
        }
        
        // Create custom confirmation modal
        const confirmClear = confirm('Are you sure you want to clear your cart? This action cannot be undone.');
        if (confirmClear) {
            state.cart = [];
            state.discountAmount = 0;
            state.appliedCoupon = null;
            elements.couponCode.value = '';
            elements.couponMessage.textContent = '';
            elements.discountCode.textContent = '';
            
            saveToLocalStorage();
            renderCart();
            updateCartSummary();
            updateHeaderCart();
            
            showNotification('Cart Cleared', 'All items removed from cart', 'info');
        }
    });
}

// ===== ENHANCED SCROLLING =====
function setupSmoothScrolling() {
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            scrollToSection(hash);
        }
    });
    
    // Initial hash handling
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                scrollToSection(hash);
            }
        }, 100);
    }
}

// ===== MODIFIED INITIALIZATION =====
// Înlocuiește funcția initializeApp cu aceasta:
function initializeApp() {
    // Simulate loading
    showLoading();
    
    // Initialize state
    state.products = [...productsData];
    state.filteredProducts = [...productsData];
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Render initial views
    renderProducts();
    renderCart();
    renderFeatured();
    renderRecentlyViewed();
    updateCartSummary();
    updateHeaderCart();
    updateWishlistCount();
    
    // Setup enhanced features
    setupNavigation();
    setupEnhancedCart();
    setupSmoothScrolling();
    
    // Hide loading
    setTimeout(() => {
        hideLoading();
        showNotification('Welcome to SynthWave Music!', 'Ready to explore our vinyl collection?', 'success');
    }, 1500);
}

// ===== UTILITY FUNCTIONS =====
function calculateCartTotal() {
    return state.cart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});