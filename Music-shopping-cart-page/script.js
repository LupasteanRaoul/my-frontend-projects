document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const productsGrid = document.getElementById('productsGrid');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const headerTotal = document.getElementById('headerTotal');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const continueBtn = document.getElementById('continueBtn');
    const genreFilter = document.getElementById('genreFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const productModal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const debouncedRender = debounce(renderProducts, 300);
    searchInput.addEventListener('input', debouncedRender);
    
    // Products Data
const products = [
    {
        id: 1,
        title: "Days of Thunder",
        artist: "The Midnight",
        price: 24.99,
        genre: "synthwave",
        year: 2014,
        tracks: 10,
        rating: 4.8,
        duration: "48:22",
        description: "A synthwave masterpiece blending 80s nostalgia with modern production.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Random Access Memories",
        artist: "Daft Punk",
        price: 29.99,
        genre: "electronic",
        year: 2013,
        tracks: 13,
        rating: 4.9,
        duration: "74:28",
        description: "Grammy-winning electronic album that revolutionized modern dance music.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "AM",
        artist: "Arctic Monkeys",
        price: 22.99,
        genre: "rock",
        year: 2013,
        tracks: 12,
        rating: 4.7,
        duration: "41:43",
        description: "Critically acclaimed rock album with infectious riffs and clever lyrics.",
        image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Future Nostalgia",
        artist: "Dua Lipa",
        price: 26.99,
        genre: "pop",
        year: 2020,
        tracks: 11,
        rating: 4.6,
        duration: "43:11",
        description: "Disco-infused pop perfection with chart-topping hits.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Kind of Blue",
        artist: "Miles Davis",
        price: 19.99,
        genre: "jazz",
        year: 1959,
        tracks: 5,
        rating: 5.0,
        duration: "45:44",
        description: "The best-selling jazz album of all time, a timeless classic.",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "After Hours",
        artist: "The Weeknd",
        price: 27.99,
        genre: "pop",
        year: 2020,
        tracks: 14,
        rating: 4.5,
        duration: "56:19",
        description: "A dark synth-pop journey through heartbreak and redemption.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Discovery",
        artist: "Daft Punk",
        price: 28.99,
        genre: "electronic",
        year: 2001,
        tracks: 14,
        rating: 4.8,
        duration: "61:00",
        description: "Influential electronic album that defined a generation of dance music.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 8,
        title: "Synthwave Essentials",
        artist: "Various Artists",
        price: 34.99,
        genre: "synthwave",
        year: 2022,
        tracks: 20,
        rating: 4.7,
        duration: "78:15",
        description: "A comprehensive collection of modern synthwave classics.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        title: "Chill Vibes",
        artist: "Various Artists",
        price: 19.99,
        genre: "electronic",
        year: 2021,
        tracks: 12,
        rating: 4.5,
        duration: "45:22",
        description: "A collection of relaxing electronic tunes for your chill moments.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 10,
        title: "80s Retro",
        artist: "Synth Legends",
        price: 24.99,
        genre: "synthwave",
        year: 2020,
        tracks: 10,
        rating: 4.7,
        duration: "48:15",
        description: "Bring back the 80s with this retro synthwave collection.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
        id: 11,
        title: "Electric Dreams",
        artist: "FM-84",
        price: 26.99,
        genre: "synthwave",
        year: 2016,
        tracks: 12,
        rating: 4.8,
        duration: "52:30",
        description: "Dreamy synthwave with nostalgic 80s vibes and modern production.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 12,
        title: "Jazz Classics",
        artist: "Various Artists",
        price: 32.99,
        genre: "jazz",
        year: 2019,
        tracks: 15,
        rating: 4.9,
        duration: "68:45",
        description: "Essential jazz recordings from the golden era of jazz music.",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];
    
    // Cart State
    let cart = JSON.parse(localStorage.getItem('musicCart')) || [];
    const SHIPPING_COST = 4.99;
    const TAX_RATE = 0.10;
    
    // Initialize
    function init() {
        renderProducts();
        renderCart();
        updateCartSummary();
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filters
        genreFilter.addEventListener('change', renderProducts);
        sortFilter.addEventListener('change', renderProducts);
        searchInput.addEventListener('input', () => {
            debouncedRender();
        });        
        // Cart buttons
        clearCartBtn.addEventListener('click', clearCart);
        checkoutBtn.addEventListener('click', checkout);
        continueBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            productModal.classList.remove('active');
        });
        
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModal.classList.contains('active')) {
                productModal.classList.remove('active');
            }
        });
    };

// Debounce function pentru search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

    // Render products
    function renderProducts() {
        const genre = genreFilter.value;
        const sortBy = sortFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        // Filter products
        let filteredProducts = products.filter(product => {
            if (genre !== 'all' && product.genre !== genre) return false;
            if (searchTerm && !product.title.toLowerCase().includes(searchTerm) && 
                !product.artist.toLowerCase().includes(searchTerm)) return false;
            return true;
        });
        
        // Sort products
        filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                default: // 'name'
                    return a.title.localeCompare(b.title);
            }
        });
        
        // Clear and render
        productsGrid.innerHTML = '';
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Get cart quantity for this product
            const cartItem = cart.find(item => item.id === product.id);
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            
            productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div>
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-artist">${product.artist}</p>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                
                <div class="product-details">
                    <div class="product-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${product.year}</span>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-list-ol"></i>
                        <span>${product.tracks} tracks • ${product.duration}</span>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-star"></i>
                        <div class="rating">
                            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                            <span>${product.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div class="product-detail">
                        <i class="fas fa-tag"></i>
                        <span>${product.genre.charAt(0).toUpperCase() + product.genre.slice(1)}</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    ${cartQuantity > 0 ? `
                        <button class="btn btn-secondary" onclick="showProductDetails(${product.id})">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="btn btn-primary" onclick="updateCart(${product.id}, 1)">
                            <i class="fas fa-plus"></i> Add More (${cartQuantity})
                        </button>
                    ` : `
                        <button class="btn btn-secondary" onclick="showProductDetails(${product.id})">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    `}
                </div>
            </div>
        `;
            
            productsGrid.appendChild(productCard);
        });
        
        // If no products found
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--gray);">
                    <i class="fas fa-search" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px;">No products found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            `;
        }
    }
    
    // Add to cart
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        renderCart();
        renderProducts();
        updateCartSummary();
        showNotification(`${product.title} added to cart!`);
    };
    
    // Update cart quantity
    window.updateCart = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            
            saveCart();
            renderCart();
            renderProducts();
            updateCartSummary();
            
            if (change > 0) {
                showNotification(`${item.title} quantity updated!`);
            }
        }
    };
    
    // Remove from cart
    window.removeFromCart = function(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            cart = cart.filter(item => item.id !== productId);
            saveCart();
            renderCart();
            renderProducts();
            updateCartSummary();
            showNotification(`${item.title} removed from cart!`);
        }
    };
    
    // Clear cart
    function clearCart() {
        if (cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCart();
            renderCart();
            renderProducts();
            updateCartSummary();
            showNotification('Cart cleared!');
        }
    }
    
    // Checkout
    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some items before checkout.');
            return;
        }
        
        const total = calculateTotal();
        const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const orderDetails = cart.map(item => 
            `${item.quantity}x ${item.title} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        alert(`Thank you for your order!\n\nItems:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo. In a real store, you would proceed to payment.`);
        
        cart = [];
        saveCart();
        renderCart();
        renderProducts();
        updateCartSummary();
    }
    
    // Render cart
    function renderCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <p class="small">Add some music to get started!</p>
                </div>
            `;
            cartCount.textContent = '0';
            headerTotal.textContent = '$0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let totalItems = 0;
        
        cart.forEach(item => {
            totalItems += item.quantity;
            const itemTotal = item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-content">
                <div class="cart-item-header">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-details">
                    <div>${item.artist} • $${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCart(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCart(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartCount.textContent = totalItems;
        
        // Update header total
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        headerTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update cart summary
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + SHIPPING_COST + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Calculate total
    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * TAX_RATE;
        return subtotal + SHIPPING_COST + tax;
    }
    
    // Show product details in modal
    window.showProductDetails = function(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        
        modalTitle.textContent = product.title;
        modalBody.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem;">
                        <i class="fas fa-compact-disc"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 1.8rem; margin-bottom: 5px;">${product.title}</h4>
                        <p style="color: var(--gray); font-size: 1.2rem; margin-bottom: 10px;">${product.artist}</p>
                        <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">$${product.price.toFixed(2)}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="background: var(--light); padding: 15px; border-radius: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Genre</div>
                        <div>${product.genre.charAt(0).toUpperCase() + product.genre.slice(1)}</div>
                    </div>
                    <div style="background: var(--light); padding: 15px; border-radius: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Year</div>
                        <div>${product.year}</div>
                    </div>
                    <div style="background: var(--light); padding: 15px; border-radius: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Tracks</div>
                        <div>${product.tracks} tracks</div>
                    </div>
                    <div style="background: var(--light); padding: 15px; border-radius: 10px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Duration</div>
                        <div>${product.duration}</div>
                    </div>
                </div>
                
                <div>
                    <h5 style="font-size: 1.2rem; margin-bottom: 10px;">Description</h5>
                    <p style="color: var(--gray); line-height: 1.6;">${product.description}</p>
                </div>
                
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Rating</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #ffd700; font-size: 1.2rem;">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                            <span>${product.rating.toFixed(1)}/5.0</span>
                        </div>
                    </div>
                    ${cartItem ? `
                        <div style="flex: 1; text-align: right;">
                            <div style="font-weight: 600; margin-bottom: 5px;">In Your Cart</div>
                            <div style="font-size: 1.3rem; color: var(--primary);">${cartItem.quantity} × $${product.price.toFixed(2)} = $${(cartItem.quantity * product.price).toFixed(2)}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button onclick="addToCart(${product.id}); productModal.classList.remove('active');" 
                            style="flex: 1; padding: 15px; background: var(--primary); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i class="fas fa-cart-plus"></i> ${cartItem ? 'Add More' : 'Add to Cart'}
                    </button>
                    <button onclick="productModal.classList.remove('active')"
                            style="flex: 1; padding: 15px; background: var(--gray-light); color: var(--dark); border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        productModal.classList.add('active');
    };
    
    // Show notification
    function showNotification(message) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('musicCart', JSON.stringify(cart));
    }
    
    // Initialize the app
    init();
});