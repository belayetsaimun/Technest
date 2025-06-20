// Enhanced Main Script with Full Integration - COMPLETE VERSION
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

    // Quick View Modal
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = document.querySelectorAll('.close-modal');

    // Buy Now Modal
    const buyNowModal = document.getElementById('buyNowModal');

    // Filter Elements
    const sortBySelect = document.getElementById('sort-by');
    const categoryFilter = document.getElementById('category-filter');
    const priceRangeFilter = document.getElementById('price-range');
    const brandFilter = document.getElementById('brand-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const resultsCountElement = document.getElementById('results-count');
    const productGrid = document.querySelector('.enhanced-product-grid');
    
    // Notification Container
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Initialize Shopping Cart and Wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let currentQuickViewProduct = null;
    
    // Flags to prevent duplicate event listeners
    let eventListenersInitialized = false;
    let modalEventListenersSetup = false;
    let notificationQueue = [];
    
    // Store original products data
    let allProducts = [];
    let filteredProducts = [];
    
    // Initialize products data from HTML
    function initializeProductsData() {
        const productCards = document.querySelectorAll('.product-card');
        allProducts = Array.from(productCards).map(card => ({
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image: card.dataset.image,
            category: card.dataset.category,
            brand: card.dataset.brand,
            rating: parseFloat(card.dataset.rating),
            element: card.cloneNode(true) // Store the HTML element
        }));
        filteredProducts = [...allProducts];
        updateResultsCount();
        console.log('Products data initialized:', allProducts.length, 'products');
    }
    
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
    
    // Filter and Sort Functions
    function initializeFilters() {
        if (!sortBySelect || !categoryFilter || !priceRangeFilter || !brandFilter || !resetFiltersBtn) {
            console.warn('Filter elements not found');
            return;
        }
        
        // Add event listeners for filters
        sortBySelect.addEventListener('change', handleFilterChange);
        categoryFilter.addEventListener('change', handleFilterChange);
        priceRangeFilter.addEventListener('change', handleFilterChange);
        brandFilter.addEventListener('change', handleFilterChange);
        resetFiltersBtn.addEventListener('click', resetAllFilters);
        
        console.log('Filters initialized successfully');
    }
    
    function handleFilterChange() {
        applyFilters();
        applySorting();
        renderProducts();
        updateResultsCount();
    }
    
    function applyFilters() {
        let filtered = [...allProducts];
        
        // Category filter
        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Price range filter
        const selectedPriceRange = priceRangeFilter.value;
        if (selectedPriceRange !== 'all') {
            filtered = filtered.filter(product => {
                const price = product.price;
                switch (selectedPriceRange) {
                    case '0-10000':
                        return price < 10000;
                    case '10000-25000':
                        return price >= 10000 && price <= 25000;
                    case '25000-50000':
                        return price >= 25000 && price <= 50000;
                    case '50000-100000':
                        return price >= 50000 && price <= 100000;
                    case '100000+':
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }
        
        // Brand filter
        const selectedBrand = brandFilter.value;
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }
        
        filteredProducts = filtered;
    }
    
    function applySorting() {
        const sortBy = sortBySelect.value;
        
        filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id; // Assuming higher ID means newer
                case 'popularity':
                default:
                    return b.rating - a.rating; // Default to rating
            }
        });
    }
    
    function renderProducts() {
        if (!productGrid) return;
        
        // Clear current products
        productGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            showNoProductsMessage();
            return;
        }
        
        // Add filtered products
        filteredProducts.forEach((product, index) => {
            const productElement = product.element.cloneNode(true);
            productElement.style.animationDelay = `${index * 0.05}s`;
            productGrid.appendChild(productElement);
        });
        
        // Reinitialize wishlist icons for new elements
        initializeWishlistIcons();
    }
    
    function showNoProductsMessage() {
        productGrid.innerHTML = `
            <div class="no-products-message" style="grid-column: 1 / -1;">
                <div class="empty-search-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Products Found</h3>
                <p>Sorry, we couldn't find any products matching your criteria. Try adjusting your filters or search terms.</p>
                <button class="reset-search-btn" onclick="resetAllFilters()">
                    <i class="fas fa-undo"></i> Reset Filters
                </button>
            </div>
        `;
    }
    
    function updateResultsCount() {
        if (resultsCountElement) {
            const count = filteredProducts.length;
            resultsCountElement.textContent = `${count} Product${count !== 1 ? 's' : ''} Found`;
        }
    }
    
    function resetAllFilters() {
        if (sortBySelect) sortBySelect.value = 'popularity';
        if (categoryFilter) categoryFilter.value = 'all';
        if (priceRangeFilter) priceRangeFilter.value = 'all';
        if (brandFilter) brandFilter.value = 'all';
        
        filteredProducts = [...allProducts];
        applySorting();
        renderProducts();
        updateResultsCount();
        
        showNotification('Filters reset successfully', 'info');
    }
    
    // Enhanced Quick View Modal Functions
    function openQuickView(productCard) {
        if (!productCard || !quickViewModal) {
            console.error('Missing product card or quick view modal');
            return;
        }
        
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.dataset.image;
        const productCategory = productCard.dataset.category || '';
        const productBrand = productCard.dataset.brand || '';
        const productRating = parseFloat(productCard.dataset.rating) || 4.5;
        
        // Check if image exists, fallback to a default image if needed
        const imageToUse = productImage && !productImage.includes('/api/placeholder') ? productImage : 'images/default-product.png';
        
        currentQuickViewProduct = {
            id: productId,
            name: productName,
            price: productPrice,
            image: imageToUse,
            category: productCategory,
            brand: productBrand,
            rating: productRating,
            baseImage: imageToUse
        };
        
        const oldPriceElement = productCard.querySelector('.old-price');
        const oldPrice = oldPriceElement ? oldPriceElement.textContent : '';
        
        const ratingElement = productCard.querySelector('.product-rating');
        const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
        
        populateModalContent(productName, productCategory, productPrice, imageToUse, oldPrice, ratingHTML);
        // Initialize color options and setup variants
        initializeColorOptions();
        setupColorVariants(productName, imageToUse);
        checkColorAvailability();
        
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) {
            quantityInput.value = 1;
        }
        
        quickViewModal.dataset.id = productId;
        quickViewModal.dataset.name = productName;
        quickViewModal.dataset.price = productPrice;
        quickViewModal.dataset.image = imageToUse;
        
        showModal(quickViewModal);
        
        // Setup event listeners only once
        if (!modalEventListenersSetup) {
            setupQuickViewEventListeners();
            modalEventListenersSetup = true;
        } else {
            // Just update wishlist button state
            updateWishlistButtonState();
        }
    }
    
    function populateModalContent(productName, productCategory, productPrice, productImage, productOldPrice, ratingHTML) {
        const modalTitle = quickViewModal.querySelector('h2');
        const modalCategory = quickViewModal.querySelector('.product-category');
        const modalPrice = quickViewModal.querySelector('.current-price');
        const modalImage = quickViewModal.querySelector('.main-product-image');
        const modalRating = quickViewModal.querySelector('.product-rating');
        const modalOldPrice = quickViewModal.querySelector('.old-price');
        const modalDiscount = quickViewModal.querySelector('.discount');
        
        if (modalTitle) modalTitle.textContent = productName;
        if (modalCategory) modalCategory.textContent = getCategoryDisplayName(productCategory);
        if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
        
        if (modalImage) {
            modalImage.style.opacity = '0.5';
            setTimeout(() => {
                modalImage.src = productImage;
                modalImage.alt = productName;
                modalImage.style.opacity = '1';
                
                // Handle image load error
                modalImage.onerror = function() {
                    console.warn('Image failed to load:', productImage);
                    this.src = 'images/default-product.png';
                    this.onerror = null;
                };
            }, 200);
        }
        
        if (modalRating && ratingHTML) {
            modalRating.innerHTML = ratingHTML;
        }
        
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
        
        updateProductDescription(productName);
        updateProductSpecifications(productName);
    }
    
    function getCategoryDisplayName(category) {
        const categoryNames = {
            'phones': 'Smartphones',
            'laptops': 'Laptops',
            'tablets': 'Tablets',
            'headphones': 'Audio',
            'earbuds': 'Audio',
            'smartwatches': 'Wearables',
            'cameras': 'Cameras',
            'gaming': 'Gaming',
            'accessories': 'Accessories'
        };
        return categoryNames[category] || 'Electronics';
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
            return `Experience the next level of smartphone technology with the ${productName}. Featuring a stunning Super Retina XDR display, advanced camera system with 48MP main sensor, and the powerful A17 Pro chip for lightning-fast performance.`;
        } else if (name.includes('airpods')) {
            return `Immerse yourself in exceptional audio with the ${productName}. These premium wireless earbuds feature active noise cancellation, spatial audio with dynamic head tracking, and a comfortable design for all-day wear.`;
        } else if (name.includes('watch') || name.includes('smartfit')) {
            return `The ${productName} helps you stay connected, active, and healthy. Monitor your health with advanced sensors including ECG, blood oxygen, and heart rate monitoring.`;
        } else if (name.includes('macbook')) {
            return `Powerful and portable, the ${productName} features a stunning Retina display, all-day battery life, and high-performance processors with the M3 Pro chip for exceptional speed and efficiency.`;
        } else if (name.includes('bass') || name.includes('headphone') || name.includes('sony')) {
            return `Immerse yourself in rich, detailed sound with the ${productName}. These premium wireless headphones feature advanced noise cancellation technology and exceptional audio clarity.`;
        } else if (name.includes('pad') || name.includes('tablet')) {
            return `The versatile ${productName} combines power and portability for work and play. Featuring a beautiful display, powerful processor, and support for accessories.`;
        } else if (name.includes('playstation') || name.includes('ps5')) {
            return `Experience next-generation gaming with the ${productName}. Featuring ultra-fast SSD, ray tracing, 4K gaming, and immersive 3D audio for the ultimate gaming experience.`;
        } else if (name.includes('nintendo')) {
            return `Enjoy gaming anywhere with the ${productName}. Switch seamlessly between TV and handheld modes for gaming at home or on the go.`;
        } else if (name.includes('canon') || name.includes('camera')) {
            return `Capture life's moments with stunning clarity using the ${productName}. Professional-grade features and exceptional image quality for photographers and content creators.`;
        } else if (name.includes('galaxy') && name.includes('buds')) {
            return `Experience premium wireless audio with the ${productName}. Featuring 360 Audio, intelligent active noise cancellation, and seamless connectivity.`;
        } else if (name.includes('pixel')) {
            return `Pure Android experience with the ${productName}. Advanced computational photography, AI features, and guaranteed updates directly from Google.`;
        } else if (name.includes('dell') || name.includes('xps')) {
            return `Premium ultrabook performance with the ${productName}. Stunning display, powerful processors, and sleek design for professionals and creators.`;
        }
        
        return `The ${productName} offers premium quality, exceptional performance, and innovative features. Experience the perfect blend of technology and design with this premium product from TechNest.`;
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
                processor: 'M3 Pro',
                memory: '36GB Unified Memory',
                storage: '512GB SSD',
                display: '16" Liquid Retina XDR',
                battery: 'Up to 18 hours',
                ports: '3x Thunderbolt 4, HDMI, SD Card'
            };
        } else if (name.includes('sony') || name.includes('headphone')) {
            return {
                driver: '40mm Dynamic Driver',
                battery: 'Up to 30 hours',
                connectivity: 'Bluetooth 5.2, 3.5mm',
                features: 'Premium Noise Cancellation',
                controls: 'Touch Controls',
                compatibility: 'Universal'
            };
        } else if (name.includes('pad')) {
            return {
                processor: 'M2 Chip',
                storage: '128GB',
                display: '12.9" Liquid Retina XDR',
                camera: '12MP Ultra Wide',
                battery: 'Up to 10 hours',
                features: 'Apple Pencil Support'
            };
        } else if (name.includes('ps5') || name.includes('playstation')) {
            return {
                processor: 'Custom AMD Zen 2',
                storage: '825GB NVMe SSD',
                graphics: 'Custom RDNA 2 GPU',
                resolution: '4K Gaming, Ray Tracing',
                features: '3D Audio, DualSense Controller',
                compatibility: 'Backward Compatible'
            };
        } else if (name.includes('galaxy') && name.includes('buds')) {
            return {
                driver: '11mm Woofer + 6.5mm Tweeter',
                battery: 'Up to 8 hours',
                features: '360 Audio, ANC',
                connectivity: 'Bluetooth 5.2',
                controls: 'Touch Controls',
                water: 'IPX7 Rating'
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
            support: 'fa-headset',
            graphics: 'fa-desktop',
            resolution: 'fa-tv'
        };
        
        return iconMap[key] || 'fa-info-circle';
    }
    
    function setupColorVariants(productName, baseImage) {
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        
        // Generate color variants based on the base image naming convention
        const imageNameParts = baseImage.split('.');
        const extension = imageNameParts.pop();
        let baseName = imageNameParts.join('.');
        
        // Remove existing color suffixes (W, B, BL) from the end
        baseName = baseName.replace(/[WBL]+$/i, '');
        
        // Generate variants based on naming convention
        const variants = {
            white: `${baseName}W.${extension}`,
            black: `${baseName}B.${extension}`,
            blue: `${baseName}BL.${extension}`
        };
        
        if (currentQuickViewProduct) {
            currentQuickViewProduct.variants = variants;
            currentQuickViewProduct.baseImage = baseImage;
        }
        
        // Set the active color based on current image
        colorOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Determine which color is currently active based on image name
        const currentImageName = baseImage.toLowerCase();
        if (currentImageName.includes('w.')) {
            const whiteOption = quickViewModal.querySelector('.color-option.white');
            if (whiteOption) whiteOption.classList.add('active');
        } else if (currentImageName.includes('bl.')) {
            const blueOption = quickViewModal.querySelector('.color-option.blue');
            if (blueOption) blueOption.classList.add('active');
        } else if (currentImageName.includes('b.')) {
            const blackOption = quickViewModal.querySelector('.color-option.black');
            if (blackOption) blackOption.classList.add('active');
        } else {
            // Default to first option (white) if no specific color detected
            if (colorOptions[0]) colorOptions[0].classList.add('active');
        }
        
        console.log('Color variants generated:', variants);
    }
    
    function changeProductColor(color) {
        if (!currentQuickViewProduct || !currentQuickViewProduct.variants) return;
        
        const modalImage = quickViewModal.querySelector('.main-product-image');
        if (!modalImage) return;
        
        const newImagePath = currentQuickViewProduct.variants[color];
        if (!newImagePath) return;
        
        // Add loading state
        modalImage.style.opacity = '0.5';
        
        // Create a new image to test if the variant exists
        const testImage = new Image();
        
        testImage.onload = function() {
            // Image exists, switch to it
            modalImage.src = newImagePath;
            modalImage.style.opacity = '1';
            currentQuickViewProduct.image = newImagePath;
            quickViewModal.dataset.image = newImagePath;
            console.log('Switched to color variant:', color, newImagePath);
        };
        
        testImage.onerror = function() {
            // Image doesn't exist, fallback to original image
            console.warn('Color variant not found:', newImagePath, 'falling back to base image');
            modalImage.src = currentQuickViewProduct.baseImage;
            modalImage.style.opacity = '1';
            
            // Show notification that this color is not available
            showNotification(`${color.charAt(0).toUpperCase() + color.slice(1)} color variant not available`, 'info');
        };
        
        // Test the image
        testImage.src = newImagePath;
    }
    
    // Setup modal event listeners properly
    function setupQuickViewEventListeners() {
        // Color options
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.classList.contains('active')) return;
                
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const selectedColor = this.dataset.color;
                changeProductColor(selectedColor);
            });
        });
        
        // Quantity buttons
        const quantityBtns = quickViewModal.querySelectorAll('.quantity-btn');
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!quantityInput) return;
                
                let currentValue = parseInt(quantityInput.value) || 1;
                
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
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                addToCartFromModal();
            });
        }
        
        // Buy now button
        const buyNowBtn = quickViewModal.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showBuyNowModal();
            });
        }
        
        // Wishlist button
        const wishlistBtn = quickViewModal.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlistFromModal();
            });
        }
        
        console.log('Quick view event listeners setup complete');
    }
    
    // Auto-generate color options HTML based on available variants
    function generateColorOptionsHTML() {
        return `
            <h4>Select Color:</h4>
            <div class="color-options">
                <span class="color-option white" data-color="white" title="White" style="background: #ffffff; border-color: #ddd;"></span>
                <span class="color-option black" data-color="black" title="Black" style="background: #000000;"></span>
                <span class="color-option blue" data-color="blue" title="Blue" style="background: #007AFF;"></span>
            </div>
        `;
    }
    
    // Initialize color options in the modal if they don't exist
    function initializeColorOptions() {
        const colorContainer = quickViewModal.querySelector('.product-colors');
        if (colorContainer && !colorContainer.querySelector('.color-options')) {
            colorContainer.innerHTML = generateColorOptionsHTML();
        }
    }
    function checkColorAvailability() {
        if (!currentQuickViewProduct || !currentQuickViewProduct.variants) return;
        
        const colorOptions = quickViewModal.querySelectorAll('.color-option');
        const colorContainer = quickViewModal.querySelector('.product-colors');
        
        let availableColors = 0;
        
        // Check each color variant
        Object.keys(currentQuickViewProduct.variants).forEach(color => {
            const imagePath = currentQuickViewProduct.variants[color];
            const colorOption = quickViewModal.querySelector(`.color-option.${color}`);
            
            if (colorOption) {
                const testImage = new Image();
                
                testImage.onload = function() {
                    // Image exists, show the color option
                    colorOption.style.display = 'block';
                    colorOption.style.opacity = '1';
                    availableColors++;
                    updateColorSectionVisibility();
                };
                
                testImage.onerror = function() {
                    // Image doesn't exist, hide the color option
                    colorOption.style.display = 'none';
                    colorOption.style.opacity = '0.3';
                    updateColorSectionVisibility();
                };
                
                testImage.src = imagePath;
            }
        });
        
        function updateColorSectionVisibility() {
            // Hide the entire color section if no variants are available
            const visibleOptions = quickViewModal.querySelectorAll('.color-option[style*="display: block"], .color-option:not([style*="display: none"])');
            if (colorContainer) {
                if (visibleOptions.length <= 1) {
                    colorContainer.style.display = 'none';
                } else {
                    colorContainer.style.display = 'block';
                }
            }
        }
    }
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
            console.log('Cart initialized with', cart.length, 'items');
        } catch (error) {
            console.error('Error initializing cart:', error);
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    
    // Add to cart from modal without double notifications
    function addToCartFromModal() {
        if (!currentQuickViewProduct) {
            console.error('No product selected for adding to cart');
            return;
        }
        
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        const product = {
            id: currentQuickViewProduct.id,
            name: currentQuickViewProduct.name,
            price: currentQuickViewProduct.price,
            image: currentQuickViewProduct.image,
            quantity: quantity
        };
        
        // Add to cart without showing notification (will be shown separately)
        addItemToCart(product, false);
        hideModal(quickViewModal);
        
        // Show notification only once
        showNotification(`Added ${product.name} to cart`, 'success');
        
        setTimeout(() => {
            if (cartSidebar) {
                cartSidebar.style.right = '0';
                overlay.style.display = 'block';
            }
        }, 100);
    }
    
    // Prevent double notifications
    function addItemToCart(product, showNotif = true) {
        if (!product || !product.id) {
            console.error('Invalid product data');
            return;
        }
        
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += product.quantity;
            console.log('Updated existing cart item:', product.name);
        } else {
            cart.push(product);
            console.log('Added new item to cart:', product.name);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartUI();
        
        // Only show notification if requested
        if (showNotif) {
            showNotification(`Added ${product.name} to cart`, 'success');
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
                    <a href="#featured" class="btn secondary-btn">Start Shopping</a>
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
            initializeWishlistIcons();
            console.log('Wishlist initialized with', wishlist.length, 'items');
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
        initializeWishlistIcons(); // Update all wishlist icons
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
                    <a href="#featured" class="btn secondary-btn">Discover Products</a>
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
    
    function removeFromWishlist(productId) {
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            wishlist.splice(itemIndex, 1);
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            updateWishlistUI();
            initializeWishlistIcons(); // Update all wishlist icons
            
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
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
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
            imageElement.onerror = function() {
                this.src = 'images/default-product.png';
                this.onerror = null;
            };
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
            btn.addEventListener('click', (e) => {
                e.preventDefault();
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
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
                    if (cartSidebar) {
                        cartSidebar.style.right = '0';
                        overlay.style.display = 'block';
                    }
                }, 100);
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
    
    // Enhanced Notification System with queue management
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
    
    // Main Event Listeners Setup
    function setupEventListeners() {
        if (eventListenersInitialized) {
            console.log('Event listeners already initialized');
            return;
        }
        eventListenersInitialized = true;
        
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
                    initializeWishlistIcons();
                    showNotification('Wishlist cleared', 'info');
                }
            });
        }
        
        // Product card interactions using event delegation
        document.addEventListener('click', function(e) {
            // Handle clicks within product cards
            if (e.target.closest('.product-card')) {
                // Quick view
                if (e.target.closest('.quick-view')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productCard = e.target.closest('.product-card');
                    if (productCard) {
                        openQuickView(productCard);
                    }
                    return;
                }
                
                // Add to cart - prevent double notifications
                if (e.target.closest('.add-to-cart') && !e.target.closest('.modal')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productCard = e.target.closest('.product-card');
                    if (productCard) {
                        const product = {
                            id: productCard.dataset.id,
                            name: productCard.dataset.name,
                            price: parseFloat(productCard.dataset.price),
                            image: productCard.dataset.image,
                            quantity: 1
                        };
                        addItemToCart(product); // This will show notification once
                    }
                    return;
                }
                
                // Add to wishlist
                if (e.target.closest('.add-to-wishlist') && !e.target.closest('.modal')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productCard = e.target.closest('.product-card');
                    const wishlistBtn = e.target.closest('.add-to-wishlist');
                    if (productCard && wishlistBtn) {
                        toggleWishlistFromProductCard(productCard, wishlistBtn);
                    }
                    return;
                }
            }
        });
        
        // Modal close buttons
        closeModal.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    hideModal(modal);
                }
            });
        });
        
        // Overlay click to close modals and sidebars
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
                // Close any open modals
                const openModal = document.querySelector('.modal[style*="display: block"]');
                if (openModal) {
                    hideModal(openModal);
                    return;
                }
                
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
        
        console.log('All event listeners setup complete');
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
    
    // Search functionality
    function handleSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery && searchInput) {
            searchInput.value = searchQuery;
            // Filter products based on search
            filterProductsBySearch(searchQuery);
        }
    }
    
    function filterProductsBySearch(query) {
        const searchTerm = query.toLowerCase();
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
        
        renderProducts();
        updateResultsCount();
        
        if (filteredProducts.length === 0) {
            showNotification(`No results found for "${query}"`, 'info');
        }
    }
    
    // Performance optimization
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
    
    // Make functions globally available
    window.resetAllFilters = resetAllFilters;
    window.showNotification = showNotification;
    
    // Initialize everything
    function init() {
        console.log('Starting TechNest initialization...');
        
        try {
            initTheme();
            initializeCart();
            initializeWishlist();
            initializeProductsData();
            initializeFilters();
            initCountdown();
            setupEventListeners();
            handleSearch();
            
            console.log('TechNest initialized successfully!');
            
            // Show welcome message after a short delay
            setTimeout(() => {
                showNotification('Welcome to TechNest! 🚀', 'info');
            }, 1000);
            
        } catch (error) {
            console.error('Error during initialization:', error);
            showNotification('Something went wrong. Please refresh the page.', 'error');
        }
    }
    
    // Start the application
    init();
});