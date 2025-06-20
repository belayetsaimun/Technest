// Enhanced Main Script with Fixed Quick View Modal and Dark Mode
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

    // Cart Sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
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
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelectorAll('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view');

    // Buy Now Modal
    const buyNowModal = document.getElementById('buyNowModal');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartFromBuyNowBtn = document.querySelector('.add-to-cart-from-buynow');

    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const addToCartModalBtn = document.querySelector('.add-to-cart-btn');
    
    // Add to Wishlist Buttons
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    
    // Quantity Selectors
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // Notification Container
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Testimonial Carousel
    const dots = document.querySelectorAll('.dot');
    
    // Initialize Shopping Cart and Wishlist from localStorage
    let cart = [];
    let wishlist = [];
    let currentQuickViewProduct = null;
    
    // Enhanced Theme Management with Smooth Transitions
    function initTheme() {
        // Check for saved theme preference or system preference
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
        
        // Init theme toggle button
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
        
        // Add animation to the toggle button
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
        
        // Add smooth transition for the first load
        if (!document.body.style.transition) {
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        }
    }
    
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
        
        // Add smooth transition for the first load
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
    
    // Enhanced Quick View Modal Functions
    function openQuickView(productCard) {
        if (!productCard || !quickViewModal) {
            console.error('Missing product card or quick view modal');
            return;
        }
        
        // Get product data
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        // Store current product data
        currentQuickViewProduct = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            baseImage: productImage
        };
        
        // Get product category
        let productCategory = '';
        const categoryElement = productCard.querySelector('.product-category');
        if (categoryElement) {
            productCategory = categoryElement.textContent;
        } else {
            productCategory = determineProductCategory(productName);
        }
        
        // Get optional old price
        let productOldPrice = '';
        const oldPriceElement = productCard.querySelector('.old-price');
        if (oldPriceElement) {
            productOldPrice = oldPriceElement.textContent;
        }
        
        // Get rating from the product card
        const ratingElement = productCard.querySelector('.product-rating');
        const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
        
        // Populate modal with product details
        populateModalContent(productName, productCategory, productPrice, productImage, productOldPrice, ratingHTML);
        
        // Setup color variants
        setupColorVariants(productName, productImage);
        
        // Reset quantity input
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        // Store product data in the modal
        quickViewModal.dataset.id = productId;
        quickViewModal.dataset.name = productName;
        quickViewModal.dataset.price = productPrice;
        quickViewModal.dataset.image = productImage;
        
        // Show modal with animation
        showModal(quickViewModal);
        
        // Setup event listeners for the modal
        setupQuickViewEventListeners();
    }
    
    function determineProductCategory(productName) {
        const name = productName.toLowerCase();
        if (name.includes('iphone') || name.includes('phone')) return 'Smartphones';
        if (name.includes('airpods') || name.includes('earbud')) return 'Audio';
        if (name.includes('watch') || name.includes('smartfit')) return 'Wearables';
        if (name.includes('macbook') || name.includes('laptop')) return 'Laptops';
        if (name.includes('bass') || name.includes('headphone')) return 'Audio';
        if (name.includes('pad') || name.includes('tablet')) return 'Tablets';
        return 'Electronics';
    }
    
    function populateModalContent(productName, productCategory, productPrice, productImage, productOldPrice, ratingHTML) {
        // Update modal elements
        const modalTitle = quickViewModal.querySelector('h2');
        const modalCategory = quickViewModal.querySelector('.product-category');
        const modalPrice = quickViewModal.querySelector('.current-price');
        const modalImage = quickViewModal.querySelector('.main-product-image');
        const modalRating = quickViewModal.querySelector('.product-rating');
        const modalOldPrice = quickViewModal.querySelector('.old-price');
        const modalDiscount = quickViewModal.querySelector('.discount');
        const modalBadge = quickViewModal.querySelector('.product-badge');
        
        if (modalTitle) modalTitle.textContent = productName;
        if (modalCategory) modalCategory.textContent = productCategory;
        if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        
        // Update image with fade transition
        if (modalImage) {
            modalImage.style.opacity = '0.5';
            setTimeout(() => {
                modalImage.src = productImage;
                modalImage.alt = productName;
                modalImage.style.opacity = '1';
            }, 200);
        }
        
        if (modalRating && ratingHTML) {
            modalRating.innerHTML = ratingHTML;
        }
        
        // Handle old price and discount
        if (productOldPrice && modalOldPrice && modalDiscount) {
            const oldPriceValue = parseFloat(productOldPrice.replace(/[৳,]/g, ''));
            modalOldPrice.textContent = productOldPrice;
            modalOldPrice.style.display = 'inline';
            
            if (oldPriceValue > 0) {
                const discountPercent = Math.round((oldPriceValue - productPrice) / oldPriceValue * 100);
                modalDiscount.textContent = `-${discountPercent}%`;
                modalDiscount.style.display = 'inline';
            }
        } else {
            if (modalOldPrice) modalOldPrice.style.display = 'none';
            if (modalDiscount) modalDiscount.style.display = 'none';
        }
        
        // Update description and specifications
        updateProductDescription(productName);
        updateProductSpecifications(productName);
    }
    
    function updateProductDescription(productName) {
        const descriptionElement = quickViewModal.querySelector('.product-description p');
        if (!descriptionElement) return;
        
        let description = getProductDescription(productName);
        descriptionElement.textContent = description;
    }
    
    function updateProductSpecifications(productName) {
        const specsGrid = quickViewModal.querySelector('.specs-grid');
        if (!specsGrid) return;
        
        const specifications = getProductSpecifications(productName);
        let specsHTML = '';
        
        for (const [key, value] of Object.entries(specifications)) {
            const iconClass = getSpecIconClass(key);
            
            specsHTML += `
                <div class="spec-item">
                    <div class="spec-icon"><i class="fas ${iconClass}"></i></div>
                    <div class="spec-details">
                        <span class="spec-title">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span class="spec-value">${value}</span>
                    </div>
                </div>
            `;
        }
        
        specsGrid.innerHTML = specsHTML;
    }
    
    function getProductDescription(productName) {
        const name = productName.toLowerCase();
        
        if (name.includes('iphone')) {
            return `Experience the next level of smartphone technology with the ${productName}. Featuring a stunning Super Retina XDR display, advanced camera system with 48MP main sensor, and the powerful A17 Pro chip for lightning-fast performance. With all-day battery life and iOS 17, it delivers a seamless user experience whether for photography, gaming, or productivity.`;
        } else if (name.includes('airpods')) {
            return `Immerse yourself in exceptional audio with the ${productName}. These premium wireless earbuds feature active noise cancellation, spatial audio with dynamic head tracking, and a comfortable design for all-day wear. With up to 6 hours of listening time and a wireless charging case providing multiple additional charges, stay connected to your music all day long.`;
        } else if (name.includes('watch') || name.includes('smartfit')) {
            return `The ${productName} helps you stay connected, active, and healthy. Monitor your health with advanced sensors including ECG, blood oxygen, and heart rate monitoring. Track your workouts with precision, receive notifications, and use apps right from your wrist. With an always-on Retina display and water resistance, it's designed for all aspects of your active lifestyle.`;
        } else if (name.includes('macbook')) {
            return `Powerful and portable, the ${productName} features a stunning Retina display, all-day battery life, and high-performance processors. With the M2 Pro chip, it delivers exceptional speed and efficiency for demanding tasks like video editing, coding, and 3D rendering. The Magic Keyboard provides a comfortable typing experience, while Thunderbolt ports offer versatile connectivity options.`;
        } else if (name.includes('bass') || name.includes('headphone')) {
            return `Immerse yourself in rich, detailed sound with the ${productName}. These premium wireless headphones feature advanced noise cancellation technology, comfortable over-ear design, and exceptional audio clarity. With up to 40 hours of battery life, multipoint connection, and intuitive touch controls, they're perfect for music lovers who demand the best listening experience.`;
        } else if (name.includes('pad') || name.includes('tablet')) {
            return `The versatile ${productName} combines power and portability for work and play. Featuring a beautiful Retina display, powerful A13 Bionic chip, and support for Apple Pencil, it's perfect for drawing, note-taking, and productivity. With all-day battery life and iPadOS, multitasking has never been smoother or more intuitive.`;
        }
        
        return `The ${productName} offers premium quality, exceptional performance, and innovative features at a great value. Experience the perfect blend of technology and design with this premium product from TechNest.`;
    }
    
    function getProductSpecifications(productName) {
        const name = productName.toLowerCase();
        
        if (name.includes('iphone')) {
            return {
                processor: 'A17 Pro',
                storage: '256GB',
                display: '6.7" Super Retina XDR',
                camera: '48MP Triple Camera',
                battery: '4,400 mAh',
                connectivity: '5G, Wi-Fi 6E'
            };
        } else if (name.includes('airpods')) {
            return {
                driver: '11mm Custom Driver',
                battery: 'Up to 6 hours',
                connectivity: 'Bluetooth 5.2',
                features: 'Active Noise Cancellation',
                controls: 'Touch Controls',
                compatibility: 'iOS, Android'
            };
        } else if (name.includes('watch')) {
            return {
                display: 'Always-On Retina',
                sensors: 'ECG, Blood Oxygen, Heart Rate',
                battery: 'Up to 18 hours',
                connectivity: 'GPS + Cellular',
                water: 'Water Resistant 50m',
                features: 'Sleep Tracking, Workout Detection'
            };
        } else if (name.includes('macbook')) {
            return {
                processor: 'M2 Pro',
                memory: '16GB Unified Memory',
                storage: '512GB SSD',
                display: '14.2" Liquid Retina XDR',
                battery: 'Up to 18 hours',
                ports: '3x Thunderbolt 4, HDMI, SD Card'
            };
        } else if (name.includes('bass') || name.includes('headphone')) {
            return {
                driver: '40mm Dynamic Driver',
                battery: 'Up to 40 hours',
                connectivity: 'Bluetooth 5.2, 3.5mm',
                features: 'Active Noise Cancellation',
                controls: 'Touch Controls',
                compatibility: 'Universal'
            };
        } else if (name.includes('pad')) {
            return {
                processor: 'A13 Bionic',
                storage: '64GB',
                display: '10.2" Retina',
                camera: '8MP Rear, 12MP Ultra Wide Front',
                battery: 'Up to 10 hours',
                features: 'Apple Pencil Support'
            };
        }
        
        return {
            quality: 'Premium Build',
            performance: 'High Performance',
            design: 'Modern Design',
            value: 'Excellent Value',
            warranty: '2-Year Warranty',
            support: '24/7 Customer Support'
        };
    }
    
    function getSpecIconClass(key) {
        const iconMap = {
            processor: 'fa-microchip',
            storage: 'fa-hdd',
            memory: 'fa-memory',
            display: 'fa-mobile-alt',
            camera: 'fa-camera',
            battery: 'fa-battery-full',
            connectivity: 'fa-wifi',
            features: 'fa-star',
            controls: 'fa-sliders-h',
            compatibility: 'fa-universal-access',
            driver: 'fa-headphones',
            water: 'fa-tint',
            ports: 'fa-plug',
            sensors: 'fa-heartbeat',
            quality: 'fa-medal',
            performance: 'fa-tachometer-alt',
            design: 'fa-pencil-ruler',
            value: 'fa-tags',
            warranty: 'fa-shield-alt',
            support: 'fa-headset'
        };
        
        return iconMap[key] || 'fa-info-circle';
    }
    
    function setupColorVariants(productName, baseImage) {
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        const imageNameParts = baseImage.split('.');
        const extension = imageNameParts.pop();
        let baseName = imageNameParts.join('.');
        
        // Remove color indicators from base name
        baseName = baseName.replace(/[WBL]+$/i, '');
        
        // Create variant paths
        const variants = {
            white: `${baseName}W.${extension}`,
            black: `${baseName}B.${extension}`,
            blue: `${baseName}BL.${extension}`
        };
        
        // Store variants in current product
        if (currentQuickViewProduct) {
            currentQuickViewProduct.variants = variants;
        }
        
        // Reset color options
        colorOptions.forEach((option, index) => {
            option.classList.remove('active');
            if (index === 0) option.classList.add('active');
        });
    }
    
    function changeProductColor(color) {
        if (!currentQuickViewProduct || !currentQuickViewProduct.variants) return;
        
        const modalImage = quickViewModal.querySelector('.main-product-image');
        if (!modalImage) return;
        
        const newImagePath = currentQuickViewProduct.variants[color];
        if (!newImagePath) return;
        
        // Apply fade transition
        modalImage.style.opacity = '0.5';
        
        setTimeout(() => {
            modalImage.src = newImagePath;
            modalImage.style.opacity = '1';
            
            // Update current product image
            currentQuickViewProduct.image = newImagePath;
            quickViewModal.dataset.image = newImagePath;
        }, 200);
    }
    
    function setupQuickViewEventListeners() {
        // Color option listeners
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                if (this.classList.contains('active')) return;
                
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const selectedColor = this.dataset.color;
                changeProductColor(selectedColor);
            });
        });
        
        // Quantity button listeners
        const quantityBtns = quickViewModal.querySelectorAll('.quantity-btn');
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!quantityInput) return;
                
                let currentValue = parseInt(quantityInput.value);
                
                if (this.classList.contains('minus') && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                } else if (this.classList.contains('plus') && currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
            });
        });
        
        // Add to cart button
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', addToCartFromModal);
        }
        
        // Buy now button
        const buyNowBtn = quickViewModal.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', showBuyNowModal);
        }
        
        // Wishlist button
        const wishlistBtn = quickViewModal.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', toggleWishlistFromModal);
            updateWishlistButtonState();
        }
    }
    
    function updateWishlistButtonState() {
        const wishlistBtn = quickViewModal.querySelector('.wishlist-btn');
        if (!wishlistBtn || !currentQuickViewProduct) return;
        
        const isInWishlist = wishlist.some(item => item.id === currentQuickViewProduct.id);
        
        if (isInWishlist) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
            wishlistBtn.style.backgroundColor = 'rgba(233, 30, 99, 0.1)';
            wishlistBtn.style.color = '#e91e63';
            wishlistBtn.style.borderColor = '#e91e63';
        } else {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            wishlistBtn.style.backgroundColor = '';
            wishlistBtn.style.color = '';
            wishlistBtn.style.borderColor = '';
        }
    }
    
    function showModal(modal) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
    }
    
    function hideModal(modal) {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }
    
    // Cart Functions
    function initializeCart() {
        try {
            const savedCart = localStorage.getItem('cart');
            cart = savedCart ? JSON.parse(savedCart) : [];
            updateCartCount();
            updateCartUI();
        } catch (error) {
            console.error('Error initializing cart:', error);
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    
    function addToCartFromModal() {
        if (!currentQuickViewProduct) return;
        
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const product = {
            id: currentQuickViewProduct.id,
            name: currentQuickViewProduct.name,
            price: currentQuickViewProduct.price,
            image: currentQuickViewProduct.image,
            quantity: quantity
        };
        
        addItemToCart(product);
        hideModal(quickViewModal);
        
        // Show cart sidebar
        setTimeout(() => {
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        }, 100);
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
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" max="10">
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
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(productId, currentValue - 1);
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateCartItemQuantity(productId, currentValue + 1);
                }
            });
        }
        
        if (input) {
            input.addEventListener('change', () => {
                let newValue = parseInt(input.value);
                if (isNaN(newValue) || newValue < 1) newValue = 1;
                if (newValue > 10) newValue = 10;
                
                input.value = newValue;
                updateCartItemQuantity(productId, newValue);
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
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
        const shipping = subtotal > 50000 ? 0 : 150;
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
            initializeWishlistIcons();
        } catch (error) {
            console.error('Error initializing wishlist:', error);
            wishlist = [];
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }
    
    function toggleWishlistFromModal() {
        if (!currentQuickViewProduct) return;
        
        const productId = currentQuickViewProduct.id;
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            wishlist.splice(existingItemIndex, 1);
            showNotification(`Removed ${currentQuickViewProduct.name} from wishlist`, 'info');
        } else {
            wishlist.push({
                id: currentQuickViewProduct.id,
                name: currentQuickViewProduct.name,
                price: currentQuickViewProduct.price,
                image: currentQuickViewProduct.image
            });
            showNotification(`Added ${currentQuickViewProduct.name} to wishlist`, 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        updateWishlistUI();
        updateWishlistButtonState();
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
            <img src="${item.image}" alt="${item.name}">
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
            moveToCartBtn.addEventListener('click', () => {
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
                    
                    wishlistSidebar.style.right = '-400px';
                    cartSidebar.style.right = '0';
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                removeFromWishlist(productId);
            });
        }
    }
    
    function removeFromWishlist(productId) {
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            wishlist.splice(itemIndex, 1);
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            updateWishlistUI();
            
            // Update product card heart icon
            const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (productCard) {
                const heartIcon = productCard.querySelector('.add-to-wishlist i');
                if (heartIcon) {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                }
            }
            
            showNotification(`Removed ${removedItem.name} from wishlist`, 'info');
        }
    }
    
    function initializeWishlistIcons() {
        const wishlistIds = wishlist.map(item => item.id);
        
        document.querySelectorAll('.add-to-wishlist').forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.id;
            const heartIcon = btn.querySelector('i');
            
            if (!heartIcon) return;
            
            if (wishlistIds.includes(productId)) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
        });
    }
    
    // Buy Now Modal Functions
    function showBuyNowModal() {
        if (!currentQuickViewProduct || !buyNowModal) return;
        
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const buyNowItem = {
            id: currentQuickViewProduct.id,
            name: currentQuickViewProduct.name,
            price: currentQuickViewProduct.price,
            image: currentQuickViewProduct.image,
            quantity: quantity
        };
        
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        
        hideModal(quickViewModal);
        
        setTimeout(() => {
            populateBuyNowModal(buyNowItem);
            showModal(buyNowModal);
            setupBuyNowEventListeners();
        }, 100);
    }
    
    function populateBuyNowModal(item) {
        const imageElement = buyNowModal.querySelector('.buy-now-product-image img');
        const nameElement = buyNowModal.querySelector('.buy-now-product-info h3');
        const priceElement = buyNowModal.querySelector('.price');
        const quantityInput = buyNowModal.querySelector('.quantity-selector input');
        
        if (imageElement) {
            imageElement.src = item.image;
            imageElement.alt = item.name;
        }
        
        if (nameElement) nameElement.textContent = item.name;
        if (priceElement) priceElement.textContent = `৳${item.price.toLocaleString('en-IN')}`;
        if (quantityInput) quantityInput.value = item.quantity;
        
        updateBuyNowSummary(item);
        
        buyNowModal.dataset.id = item.id;
        buyNowModal.dataset.name = item.name;
        buyNowModal.dataset.price = item.price;
        buyNowModal.dataset.image = item.image;
    }
    
    function updateBuyNowSummary(item) {
        const productNameElement = buyNowModal.querySelector('.product-name');
        const productQuantityElement = buyNowModal.querySelector('.product-quantity');
        const productPriceElement = buyNowModal.querySelector('.product-price');
        const productTotalElement = buyNowModal.querySelector('.product-total');
        
        if (productNameElement) productNameElement.textContent = item.name;
        if (productQuantityElement) productQuantityElement.textContent = item.quantity;
        if (productPriceElement) productPriceElement.textContent = `৳${item.price.toLocaleString('en-IN')}`;
        if (productTotalElement) {
            productTotalElement.textContent = `৳${(item.price * item.quantity).toLocaleString('en-IN')}`;
        }
    }
    
    function setupBuyNowEventListeners() {
        const quantityBtns = buyNowModal.querySelectorAll('.quantity-btn');
        const quantityInput = buyNowModal.querySelector('.quantity-selector input');
        const addToCartBtn = buyNowModal.querySelector('.add-to-cart-from-buynow');
        const checkoutBtn = buyNowModal.querySelector('.btn.primary-btn');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!quantityInput) return;
                
                let currentValue = parseInt(quantityInput.value);
                
                if (btn.classList.contains('minus') && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                } else if (btn.classList.contains('plus') && currentValue < 10) {
                    quantityInput.value = currentValue + 1;
                }
                
                updateBuyNowModalTotal();
            });
        });
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const product = {
                    id: buyNowModal.dataset.id,
                    name: buyNowModal.dataset.name,
                    price: parseFloat(buyNowModal.dataset.price),
                    image: buyNowModal.dataset.image,
                    quantity: parseInt(quantityInput.value)
                };
                
                addItemToCart(product);
                hideModal(buyNowModal);
                
                setTimeout(() => {
                    cartSidebar.style.right = '0';
                    overlay.style.display = 'block';
                }, 100);
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const tempCart = [{
                    id: buyNowModal.dataset.id,
                    name: buyNowModal.dataset.name,
                    price: parseFloat(buyNowModal.dataset.price),
                    image: buyNowModal.dataset.image,
                    quantity: parseInt(quantityInput.value)
                }];
                
                localStorage.setItem('cart', JSON.stringify(tempCart));
                window.location.href = 'checkout.html';
            });
        }
    }
    
    function updateBuyNowModalTotal() {
        const quantityInput = buyNowModal.querySelector('.quantity-selector input');
        const price = parseFloat(buyNowModal.dataset.price);
        const quantity = parseInt(quantityInput.value);
        const total = price * quantity;
        
        const quantityElement = buyNowModal.querySelector('.product-quantity');
        const totalElement = buyNowModal.querySelector('.product-total');
        
        if (quantityElement) quantityElement.textContent = quantity;
        if (totalElement) totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        
        const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
        if (buyNowItem) {
            buyNowItem.quantity = quantity;
            localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        }
    }
    
    // Notification System
    function showNotification(message, type = 'success') {
        if (!notificationContainer) return;
        
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
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Testimonial Carousel
    function initTestimonialCarousel() {
        const testimonialCarousel = document.getElementById('testimonialCarousel');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        
        if (!testimonialCarousel || dots.length === 0) return;
        
        let currentSlide = 0;
        const maxSlides = dots.length;
        
        function goToSlide(slideIndex) {
            if (slideIndex >= maxSlides) slideIndex = 0;
            if (slideIndex < 0) slideIndex = maxSlides - 1;
            
            currentSlide = slideIndex;
            testimonialCarousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });
        
        let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        }
        
        testimonialCarousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialCarousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });
        
        // Touch support
        let touchStartX = 0;
        
        testimonialCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        testimonialCarousel.addEventListener('touchend', (e) => {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) < 50) return;
            
            if (difference > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
            
            resetInterval();
        }, { passive: true });
        
        goToSlide(0);
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
    
    // Event Listeners Setup
    function setupEventListeners() {
        // Mobile menu
        if (menuIcon) {
            menuIcon.addEventListener('click', () => {
                navLinks.style.right = '0';
                overlay.style.display = 'block';
            });
        }
        
        if (closeMenu) {
            closeMenu.addEventListener('click', () => {
                navLinks.style.right = '-300px';
                overlay.style.display = 'none';
            });
        }
        
        // Search
        const searchForm = document.getElementById('searchForm');
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
                cartSidebar.style.right = '0';
                overlay.style.display = 'block';
                updateCartUI();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        // Wishlist sidebar
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                wishlistSidebar.style.right = '0';
                overlay.style.display = 'block';
                updateWishlistUI();
            });
        }
        
        if (closeWishlist) {
            closeWishlist.addEventListener('click', () => {
                wishlistSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
        
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                wishlist = [];
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                updateWishlistUI();
                initializeWishlistIcons();
                showNotification('Wishlist cleared', 'info');
            });
        }
        
        // Quick view buttons
        if (quickViewBtns && quickViewBtns.length > 0) {
            quickViewBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productCard = btn.closest('.product-card');
                    if (productCard) {
                        openQuickView(productCard);
                    }
                });
            });
        }
        
        // Modal close buttons
        closeModal.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    hideModal(modal);
                }
            });
        });
        
        // Add to cart buttons on product cards
        if (addToCartBtns && addToCartBtns.length > 0) {
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productCard = btn.closest('.product-card');
                    if (productCard) {
                        const product = {
                            id: productCard.dataset.id,
                            name: productCard.dataset.name,
                            price: parseFloat(productCard.dataset.price),
                            image: productCard.dataset.image,
                            quantity: 1
                        };
                        addItemToCart(product);
                    }
                });
            });
        }
        
        // Add to wishlist buttons on product cards
        if (addToWishlistBtns && addToWishlistBtns.length > 0) {
            addToWishlistBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productCard = btn.closest('.product-card');
                    if (productCard) {
                        toggleWishlistFromProductCard(productCard, btn);
                    }
                });
            });
        }
        
        // Overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                const openModal = document.querySelector('.modal[style*="display: block"]');
                if (openModal) {
                    hideModal(openModal);
                    return;
                }
                
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
                        if (window.innerWidth <= 768 && navLinks) {
                            navLinks.style.right = '-300px';
                            if (overlay) overlay.style.display = 'none';
                        }
                        
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
    }
    
    function toggleWishlistFromProductCard(productCard, wishlistBtn) {
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        
        const existingItemIndex = wishlist.findIndex(item => item.id === productId);
        const heartIcon = wishlistBtn.querySelector('i');
        
        if (existingItemIndex !== -1) {
            wishlist.splice(existingItemIndex, 1);
            
            if (heartIcon) {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
            
            showNotification(`Removed ${productName} from wishlist`, 'info');
        } else {
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            if (heartIcon) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            }
            
            showNotification(`Added ${productName} to wishlist`, 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        updateWishlistUI();
    }
    
    // Initialize everything
    function init() {
        initTheme();
        initializeCart();
        initializeWishlist();
        initCountdown();
        initTestimonialCarousel();
        setupEventListeners();
        
        console.log('TechNest initialized successfully');
    }
    
    // Start the application
    init();
});