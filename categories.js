// Categories Page JavaScript - Matching Homepage Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuIcon = document.getElementById('menuIcon');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');
    const themeToggle = document.getElementById('themeToggle');

    // Search Functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.getElementById('searchForm');

    // Cart Sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartShipping = document.querySelector('.cart-shipping');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Wishlist Sidebar
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistItems = document.querySelector('.wishlist-items');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Notification Container
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Initialize Shopping Cart and Wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Initialize everything
    initTheme();
    initializeCart();
    initializeWishlist();
    initCountdown();
    setupEventListeners();
    initScrollAnimations();
    initParallaxEffects();
    
    console.log('Categories page initialized successfully');
    
    // Enhanced Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('technest-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('technest-theme')) {
                if (e.matches) {
                    enableDarkMode();
                } else {
                    enableLightMode();
                }
            }
        });
        
        // Theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }
    
    function toggleTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            enableLightMode();
            localStorage.setItem('technest-theme', 'light');
        } else {
            enableDarkMode();
            localStorage.setItem('technest-theme', 'dark');
        }
        
        // Animation effect
        if (themeToggle) {
            themeToggle.classList.add('theme-toggle-animation');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-animation');
            }, 500);
        }
    }
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon(true);
        
        if (!document.body.style.transition) {
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }
    }
    
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
        
        if (!document.body.style.transition) {
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }
    }
    
    function updateThemeToggleIcon(isDarkMode) {
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        const tooltip = themeToggle.querySelector('.toggle-tooltip');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            if (tooltip) tooltip.textContent = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            if (tooltip) tooltip.textContent = 'Switch to Dark Mode';
        }
    }
    
    // Cart Functions
    function initializeCart() {
        try {
            const savedCart = localStorage.getItem('cart');
            cart = savedCart ? JSON.parse(savedCart) : [];
            updateCartCount();
            updateCartUI();
            console.log('Cart initialized with', cart.length, 'items');
        } catch (error) {
            console.error('Error initializing cart:', error);
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(countElement => {
            countElement.textContent = totalItems;
            countElement.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateCartUI() {
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            updateCartTotal();
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            cart.forEach(item => {
                const cartItem = createCartItemElement(item);
                cartItems.appendChild(cartItem);
            });
            
            updateCartTotal();
            if (checkoutBtn) checkoutBtn.style.display = 'block';
        }
    }
    
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default-product.png'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" max="10" readonly>
                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        
        setupCartItemEventListeners(cartItem);
        return cartItem;
    }
    
    function setupCartItemEventListeners(cartItem) {
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const input = cartItem.querySelector('input');
        const removeBtn = cartItem.querySelector('.remove-item');
        const productId = cartItem.dataset.id;
        
        if (minusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    const newValue = currentValue - 1;
                    input.value = newValue;
                    updateCartItemQuantity(productId, newValue);
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    const newValue = currentValue + 1;
                    input.value = newValue;
                    updateCartItemQuantity(productId, newValue);
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                removeFromCart(productId);
            });
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            
            const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector('.cart-item-price');
                const itemPrice = cart[itemIndex].price * quantity;
                priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTotal();
            updateCartCount();
        }
    }
    
    function updateCartTotal() {
        if (!cartTotal || !cartSubtotal || !cartShipping) return;
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 150;
        const total = subtotal + shipping;
        
        cartSubtotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
        cartShipping.textContent = shipping === 0 ? 'Free' : `৳${shipping.toLocaleString('en-IN')}`;
        cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
    }
    
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartUI();
            showNotification(`Removed ${removedItem.name} from cart`, 'info');
        }
    }
    
    // Wishlist Functions
    function initializeWishlist() {
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
            updateWishlistCount();
            updateWishlistUI();
            console.log('Wishlist initialized with', wishlist.length, 'items');
        } catch (error) {
            console.error('Error initializing wishlist:', error);
            wishlist = [];
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }
    
    function updateWishlistCount() {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        
        wishlistCountElements.forEach(countElement => {
            countElement.textContent = wishlist.length;
            countElement.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateWishlistUI() {
        if (!wishlistItems) return;
        
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="products.html" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            if (clearWishlistBtn) clearWishlistBtn.style.display = 'none';
        } else {
            wishlist.forEach(item => {
                const wishlistItem = createWishlistItemElement(item);
                wishlistItems.appendChild(wishlistItem);
            });
            
            if (clearWishlistBtn) clearWishlistBtn.style.display = 'block';
        }
    }
    
    function createWishlistItemElement(item) {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.dataset.id = item.id;
        
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default-product.png'">
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <p class="wishlist-item-price">৳${item.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="wishlist-item-actions">
                <button class="move-to-cart" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
                <button class="remove-from-wishlist" title="Remove"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        setupWishlistItemEventListeners(wishlistItem);
        return wishlistItem;
    }
    
    function setupWishlistItemEventListeners(wishlistItem) {
        const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
        const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
        const productId = wishlistItem.dataset.id;
        
        if (moveToCartBtn) {
            moveToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const item = wishlist.find(item => item.id === productId);
                
                if (item) {
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                    });
                    
                    removeFromWishlist(productId);
                    
                    if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                    if (cartSidebar) cartSidebar.style.right = '0';
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                removeFromWishlist(productId);
            });
        }
    }
    
    function addItemToCart(product) {
        if (!product || !product.id) return;
        
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartUI();
        showNotification(`Added ${product.name} to cart`, 'success');
    }
    
    function removeFromWishlist(productId) {
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            wishlist.splice(itemIndex, 1);
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            updateWishlistUI();
            
            showNotification(`Removed ${removedItem.name} from wishlist`, 'info');
        }
    }
    
    // Countdown Timer
    function initCountdown() {
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 7);
        
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement && hoursElement && minutesElement && secondsElement) {
                daysElement.textContent = days.toString().padStart(2, '0');
                hoursElement.textContent = hours.toString().padStart(2, '0');
                minutesElement.textContent = minutes.toString().padStart(2, '0');
                secondsElement.textContent = seconds.toString().padStart(2, '0');
            }
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                if (daysElement && hoursElement && minutesElement && secondsElement) {
                    daysElement.textContent = '00';
                    hoursElement.textContent = '00';
                    minutesElement.textContent = '00';
                    secondsElement.textContent = '00';
                }
            }
        }, 1000);
    }
    
    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe category cards
        document.querySelectorAll('.category-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe brand boxes
        document.querySelectorAll('.brand-box').forEach(box => {
            observer.observe(box);
        });
        
        // Observe other animated elements
        document.querySelectorAll('.section-header').forEach(header => {
            observer.observe(header);
        });
    }
    
    // Parallax Effects
    function initParallaxEffects() {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-backdrop, .showcase-item');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Event Listeners Setup
    function setupEventListeners() {
        // Mobile menu
        if (menuIcon) {
            menuIcon.addEventListener('click', () => {
                if (navLinks) {
                    navLinks.style.right = '0';
                    overlay.style.display = 'block';
                }
            });
        }
        
        if (closeMenu) {
            closeMenu.addEventListener('click', () => {
                if (navLinks) {
                    navLinks.style.right = '-300px';
                    overlay.style.display = 'none';
                }
            });
        }
        
        // Search functionality
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
        
        // Cart sidebar
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (cartSidebar) {
                    cartSidebar.style.right = '0';
                    overlay.style.display = 'block';
                    updateCartUI();
                }
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                if (cartSidebar) {
                    cartSidebar.style.right = '-400px';
                    overlay.style.display = 'none';
                }
            });
        }
        
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                if (cartSidebar) {
                    cartSidebar.style.right = '-400px';
                    overlay.style.display = 'none';
                }
            });
        }
        
        // Wishlist sidebar
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (wishlistSidebar) {
                    wishlistSidebar.style.right = '0';
                    overlay.style.display = 'block';
                    updateWishlistUI();
                }
            });
        }
        
        if (closeWishlist) {
            closeWishlist.addEventListener('click', () => {
                if (wishlistSidebar) {
                    wishlistSidebar.style.right = '-400px';
                    overlay.style.display = 'none';
                }
            });
        }
        
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your wishlist?')) {
                    wishlist = [];
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateWishlistCount();
                    updateWishlistUI();
                    showNotification('Wishlist cleared', 'info');
                }
            });
        }
        
        // Newsletter form
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email) {
                    // Simulate API call
                    setTimeout(() => {
                        showNotification('Thank you for subscribing to our newsletter!', 'success');
                        emailInput.value = '';
                    }, 1000);
                }
            });
        }
        
        // Overlay click to close modals and sidebars
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (navLinks && window.innerWidth <= 768) {
                    navLinks.style.right = '-300px';
                }
                if (cartSidebar) {
                    cartSidebar.style.right = '-400px';
                }
                if (wishlistSidebar) {
                    wishlistSidebar.style.right = '-400px';
                }
                overlay.style.display = 'none';
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Close mobile menu if open
                        if (window.innerWidth <= 768 && navLinks) {
                            navLinks.style.right = '-300px';
                            if (overlay) overlay.style.display = 'none';
                        }
                        
                        // Close sidebars
                        if (cartSidebar) cartSidebar.style.right = '-400px';
                        if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                        
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close sidebars
                if (cartSidebar && cartSidebar.style.right === '0px') {
                    cartSidebar.style.right = '-400px';
                    overlay.style.display = 'none';
                }
                if (wishlistSidebar && wishlistSidebar.style.right === '0px') {
                    wishlistSidebar.style.right = '-400px';
                    overlay.style.display = 'none';
                }
            }
        });
    }
    
    // Enhanced Notification System
    function showNotification(message, type = 'success') {
        if (!notificationContainer) {
            console.warn('Notification container not found');
            return;
        }
        
        // Prevent duplicate notifications
        const existingNotifications = notificationContainer.querySelectorAll('.notification');
        const duplicateExists = Array.from(existingNotifications).some(notif => {
            const span = notif.querySelector('span');
            return span && span.textContent === message;
        });
        
        if (duplicateExists) {
            console.log('Duplicate notification prevented:', message);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'fa-check-circle';
        if (type === 'info') icon = 'fa-info-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notificationContainer.appendChild(notification);
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 4000);
        
        console.log('Notification shown:', message, type);
    }
    
    function removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    // Add notification styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            .notification {
                background-color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 10000;
                min-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                animation: slideIn 0.3s forwards;
                border-left: 4px solid;
            }
            
            @keyframes slideIn {
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 18px;
            }
            
            .notification.success {
                border-left-color: #2ecc71;
            }
            
            .notification.info {
                border-left-color: #3498db;
            }
            
            .notification.error {
                border-left-color: #e74c3c;
            }
            
            .notification.success .notification-content i {
                color: #2ecc71;
            }
            
            .notification.info .notification-content i {
                color: #3498db;
            }
            
            .notification.error .notification-content i {
                color: #e74c3c;
            }
            
            .notification-content span {
                color: var(--text-color, #333);
                font-weight: 500;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                transition: color 0.3s;
                padding: 4px;
                border-radius: 4px;
                margin-left: 10px;
            }
            
            .notification-close:hover {
                color: #333;
                background: rgba(0, 0, 0, 0.1);
            }
            
            @media (max-width: 576px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
                
                .notification {
                    min-width: auto;
                }
            }
            
            .cart-count.pulse,
            .wishlist-count.pulse {
                animation: countPulse 0.5s ease;
            }
            
            @keyframes countPulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.3);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show welcome message after initialization
    //setTimeout(() => {
       // showNotification('Welcome to TechNest Categories! 🛍️', 'info');
   // }, 1500);
});