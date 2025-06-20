// New Arrivals Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all products are visible on load
    ensureProductsVisible();
    
    // Initialize cart count from localStorage
    initializeCartCount();
    
    // Initialize wishlist count from localStorage
    initializeWishlistCount();
    
    // Initialize product filtering
    initProductFilter();
    
    // Initialize product sorting
    initProductSorting();
    
    // Initialize color selection in featured product
    initColorSelection();
    
    // Initialize coming soon slider
    initComingSoonSlider();
    
    // Initialize notify buttons
    initNotifyButtons();
    
    // Initialize quick view functionality
    initQuickView();
    
    // Initialize add to cart functionality
    initAddToCart();
    
    // Initialize add to wishlist functionality
    initAddToWishlist();
    
    // Set animation delay for product cards
    setProductCardAnimationDelay();
    
    // Initialize pagination
    initPagination();
    
    // Initialize buy now buttons
    initBuyNowButtons();
    
    // Initialize cart and wishlist sidebars
    initSidebars();
});

// Ensure all products are visible on page load
function ensureProductsVisible() {
    const productCards = document.querySelectorAll('.product-card.new-product');
    console.log('Ensuring visibility for', productCards.length, 'products');
    
    productCards.forEach((card, index) => {
        // Remove any hidden classes
        card.classList.remove('hidden', 'force-hidden', 'load-more-hidden');
        
        // Ensure proper display
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'translateY(0)';
        
        // Set animation delay
        card.style.setProperty('--card-index', index);
    });
    
    // Show only the first 6 products initially, hide the rest
    const hiddenProducts = document.querySelectorAll('.product-card.new-product');
    hiddenProducts.forEach((product, index) => {
        if (index >= 6) {
            product.classList.add('load-more-hidden');
            product.style.display = 'none';
        }
    });
}

// Initialize cart count from localStorage
function initializeCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCountDisplay(totalItems);
}

// Initialize wishlist count from localStorage
function initializeWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCountDisplay(wishlist.length);
}

// Update cart count display
function updateCartCountDisplay(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.classList.add('updated');
        setTimeout(() => {
            cartCountElement.classList.remove('updated');
        }, 500);
    }
}

// Update wishlist count display
function updateWishlistCountDisplay(count) {
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = count;
        wishlistCountElement.classList.add('updated');
        setTimeout(() => {
            wishlistCountElement.classList.remove('updated');
        }, 500);
    }
}

// Set animation delay for product cards based on their position
function setProductCardAnimationDelay() {
    const productCards = document.querySelectorAll('.product-card.new-product');
    
    productCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
}

// Product Filter Functionality - FINAL FIX
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card.new-product:not(.load-more-hidden)');
    
    console.log('Filter buttons found:', filterButtons.length);
    console.log('Product cards found:', productCards.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Filter clicked:', button.getAttribute('data-filter'));
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-filter');
            
            // Filter products
            productCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                // Remove all filter classes first
                card.classList.remove('hidden', 'filtered-out', 'force-hidden');
                
                if (category === 'all' || cardCategory === category) {
                    // Show the card
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.style.transform = 'translateY(0)';
                    
                    // Add entrance animation
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
                    }, 50);
                } else {
                    // Hide the card
                    card.classList.add('filtered-out');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                        card.style.visibility = 'hidden';
                    }, 300);
                }
            });
            
            // Update active filters display
            updateActiveFilters(category);
            
            // Scroll to products section
            setTimeout(() => {
                const productsSection = document.getElementById('latest-products');
                if (productsSection) {
                    const rect = productsSection.getBoundingClientRect();
                    const offset = window.pageYOffset + rect.top - 100; // 100px offset from top
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    });
}

// Update active filters display
function updateActiveFilters(category) {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    if (category !== 'all') {
        const filterTag = document.createElement('div');
        filterTag.className = 'active-filter-tag';
        filterTag.innerHTML = `
            <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            <span class="remove-filter" onclick="clearFilter()">&times;</span>
        `;
        activeFiltersContainer.appendChild(filterTag);
    }
}

// Clear filter function - Updated
function clearFilter() {
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    const productCards = document.querySelectorAll('.product-card.new-product');
    
    if (allFilterBtn) {
        // Reset all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        allFilterBtn.classList.add('active');
        
        // Show all products
        productCards.forEach((card, index) => {
            card.classList.remove('hidden', 'force-hidden');
            card.classList.add('ensure-visibility');
            card.style.animation = `fadeInUp 0.8s ease ${index * 0.05}s both`;
        });
        
        // Clear active filters
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (activeFiltersContainer) {
            activeFiltersContainer.innerHTML = '';
        }
    }
}

// Make clearFilter available globally
window.clearFilter = clearFilter;

// Product Sorting Functionality - FIXED
function initProductSorting() {
    const sortSelect = document.getElementById('sort-select');
    const productsGrid = document.querySelector('.products-grid');
    
    if (!sortSelect || !productsGrid) return;
    
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const productCards = Array.from(document.querySelectorAll('.product-card.new-product:not(.hidden)'));
        
        // Sort product cards based on selected option
        productCards.sort((a, b) => {
            switch (sortValue) {
                case 'newest':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                
                case 'price-low':
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                
                case 'price-high':
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                
                case 'popular':
                    const aRating = a.querySelector('.rating-count');
                    const bRating = b.querySelector('.rating-count');
                    const aReviews = aRating ? parseInt(aRating.textContent.replace(/[()]/g, '')) : 0;
                    const bReviews = bRating ? parseInt(bRating.textContent.replace(/[()]/g, '')) : 0;
                    return bReviews - aReviews;
                
                case 'rating':
                    const aRatingValue = parseFloat(a.getAttribute('data-rating')) || 0;
                    const bRatingValue = parseFloat(b.getAttribute('data-rating')) || 0;
                    return bRatingValue - aRatingValue;
                
                default:
                    return 0;
            }
        });
        
        // Get all product cards (including hidden ones) to preserve order
        const allCards = Array.from(document.querySelectorAll('.product-card.new-product'));
        
        // Remove all product cards from grid
        allCards.forEach(card => card.remove());
        
        // Add sorted visible cards first
        productCards.forEach((card, index) => {
            card.style.setProperty('--card-index', index);
            card.style.animation = 'fadeInUp 0.8s ease';
            card.style.animationDelay = `${index * 0.05}s`;
            card.style.animationFillMode = 'both';
            productsGrid.appendChild(card);
        });
        
        // Add hidden cards back (they won't be visible)
        const hiddenCards = allCards.filter(card => !productCards.includes(card));
        hiddenCards.forEach(card => {
            productsGrid.appendChild(card);
        });
    });
}

// Color Selection in Featured Product - FIXED
function initColorSelection() {
    const colorOptions = document.querySelectorAll('.colors .color');
    const selectedColorText = document.querySelector('.selected-color strong');
    const featuredProductImage = document.querySelector('.featured-image img');
    
    if (!colorOptions.length || !selectedColorText || !featuredProductImage) {
        console.error('Missing elements for color selection functionality');
        return;
    }
    
    // Store the original image path to use as base
    const baseImagePath = featuredProductImage.src;
    const pathParts = baseImagePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const basePath = featuredProductImage.src.substring(0, featuredProductImage.src.lastIndexOf('/') + 1);
    
    // Extract the base filename (remove color suffix and extension)
    const fileNameBase = fileName.substring(0, fileName.length - 5); // Remove last letter (color) and extension (.png)
    const fileExtension = '.png';
    
    colorOptions.forEach(color => {
        color.addEventListener('click', () => {
            // Update active color
            colorOptions.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            
            // Update selected color text
            const colorName = color.getAttribute('data-color');
            selectedColorText.textContent = colorName;
            
            // Change product image based on color
            let colorSuffix = '';
            if (color.classList.contains('black')) colorSuffix = 'B';
            else if (color.classList.contains('titanium')) colorSuffix = 'T';
            else if (color.classList.contains('blue')) colorSuffix = 'BL';
            else if (color.classList.contains('gold')) colorSuffix = 'G';
            else colorSuffix = 'W'; // Default to white
            
            // Create new image path with color suffix
            const newImagePath = basePath + fileNameBase + colorSuffix + fileExtension;
            
            // Apply fade effect and change image
            featuredProductImage.style.opacity = '0';
            setTimeout(() => {
                featuredProductImage.src = newImagePath;
                featuredProductImage.style.opacity = '1';
            }, 300);
        });
    });
}

// Coming Soon Slider Functionality
function initComingSoonSlider() {
    const slides = document.querySelectorAll('.coming-soon-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-controls .prev-btn');
    const nextBtn = document.querySelector('.slider-controls .next-btn');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    
    // Initialize slider position
    updateSliderPosition();
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSliderPosition();
        });
    });
    
    // Helper function to update slider position
    function updateSliderPosition() {
        // Update slider position
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
                slide.style.display = 'block';
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
        
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Auto rotate slides
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSliderPosition();
    }, 5000);
    
    // Pause auto rotation on hover
    const sliderContainer = document.querySelector('.coming-soon-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume auto rotation on mouse leave
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSliderPosition();
            }, 5000);
        });
    }
}

// Initialize Pagination (Load More)
function initPagination() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const hiddenProducts = document.querySelectorAll('.product-card.load-more-hidden');
    
    if (!loadMoreBtn || !hiddenProducts.length) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Simulate loading delay
        setTimeout(() => {
            // Show hidden products
            hiddenProducts.forEach((product, index) => {
                product.classList.remove('load-more-hidden');
                product.style.animation = 'fadeInUp 0.8s ease';
                product.style.animationDelay = `${index * 0.1}s`;
                product.style.animationFillMode = 'both';
            });
            
            // Hide load more button
            loadMoreBtn.style.display = 'none';
            
            // Hide loading overlay
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            // Show success notification
            showNotification('Loaded 3 more products!', 'success');
        }, 1500);
    });
}

// Notify Buttons Functionality
function initNotifyButtons() {
    const notifyBtns = document.querySelectorAll('.notify-btn');
    const notifyModal = document.getElementById('notifyModal');
    const closeModal = notifyModal ? notifyModal.querySelector('.close-modal') : null;
    const overlay = document.getElementById('overlay');
    const notifyForm = notifyModal ? notifyModal.querySelector('.notify-form') : null;
    
    if (!notifyBtns.length || !notifyModal || !overlay) return;
    
    // Open notify modal when clicking notify button
    notifyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product name from closest card
            const card = btn.closest('.coming-soon-card');
            const productName = card ? card.querySelector('h3').textContent : 'this product';
            
            // Update modal title
            const modalTitle = notifyModal.querySelector('h3');
            if (modalTitle) {
                modalTitle.textContent = `Get Notified about ${productName}`;
            }
            
            // Update modal description
            const modalDesc = notifyModal.querySelector('p');
            if (modalDesc) {
                modalDesc.textContent = `We'll send you an email when ${productName} becomes available.`;
            }
            
            // Show modal
            notifyModal.style.display = 'block';
            overlay.style.display = 'block';
        });
    });
    
    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            notifyModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', () => {
        notifyModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    // Handle notify form submission
    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = notifyForm.querySelector('#notify-email');
            const checkbox = notifyForm.querySelector('#notify-checkbox');
            
            if (emailInput && emailInput.value) {
                // Show success message
                showNotification('You will be notified when this product is available!', 'success');
                
                // Close modal
                notifyModal.style.display = 'none';
                overlay.style.display = 'none';
                
                // Reset form
                notifyForm.reset();
            }
        });
    }
}

// Quick View Functionality - FIXED with Buy Now
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModal = quickViewModal ? quickViewModal.querySelector('.close-modal') : null;
    const overlay = document.getElementById('overlay');
    
    if (!quickViewBtns.length || !quickViewModal || !overlay) return;
    
    // Open quick view modal when clicking quick view button
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product data from closest product card
            const card = btn.closest('.product-card');
            
            if (card) {
                const productId = card.getAttribute('data-id');
                const productName = card.getAttribute('data-name');
                const productPrice = card.getAttribute('data-price');
                const productImage = card.getAttribute('data-image');
                
                // Get rating from the product card
                const ratingElement = card.querySelector('.product-rating');
                const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
                
                // Update modal content
                updateQuickViewModal(productId, productName, productPrice, productImage, ratingHTML);
                
                // Show modal
                quickViewModal.style.display = 'block';
                overlay.style.display = 'block';
            }
        });
    });
    
    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            quickViewModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', () => {
        if (quickViewModal.style.display === 'block') {
            quickViewModal.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
    
    // Helper function to update quick view modal content
    function updateQuickViewModal(id, name, price, image, ratingHTML) {
        // Update product name
        const nameElement = quickViewModal.querySelector('h2');
        if (nameElement) nameElement.textContent = name;
        
        // Update product price
        const priceElement = quickViewModal.querySelector('.current-price');
        if (priceElement) priceElement.textContent = `৳${parseInt(price).toLocaleString('en-IN')}`;
        
        // Update product image
        const imageElement = quickViewModal.querySelector('img');
        if (imageElement) {
            imageElement.src = image;
            imageElement.alt = name;
        }
        
        // Update product rating
        const ratingElement = quickViewModal.querySelector('.product-rating');
        if (ratingElement && ratingHTML) ratingElement.innerHTML = ratingHTML;
        
        // Store product data in modal for add to cart functionality
        quickViewModal.setAttribute('data-id', id);
        quickViewModal.setAttribute('data-name', name);
        quickViewModal.setAttribute('data-price', price);
        quickViewModal.setAttribute('data-image', image);
        
        // Reset quantity input
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        if (quantityInput) quantityInput.value = 1;
        
        // Setup quantity buttons
        setupQuantityButtons();
        
        // Setup quick view modal buttons
        setupQuickViewButtons();
    }
    
    // Setup quantity buttons
    function setupQuantityButtons() {
        const minusBtn = quickViewModal.querySelector('.minus');
        const plusBtn = quickViewModal.querySelector('.plus');
        const input = quickViewModal.querySelector('.quantity-selector input');
        
        if (!minusBtn || !plusBtn || !input) return;
        
        // Remove existing event listeners
        minusBtn.replaceWith(minusBtn.cloneNode(true));
        plusBtn.replaceWith(plusBtn.cloneNode(true));
        
        // Get new references
        const newMinusBtn = quickViewModal.querySelector('.minus');
        const newPlusBtn = quickViewModal.querySelector('.plus');
        
        // Minus button click
        newMinusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
        
        // Plus button click
        newPlusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
            }
        });
    }
    
    // Setup quick view modal buttons
    function setupQuickViewButtons() {
        const addToCartBtn = quickViewModal.querySelector('.add-to-cart-btn');
        const buyNowBtn = quickViewModal.querySelector('.buy-now-btn');
        const wishlistBtn = quickViewModal.querySelector('.wishlist-btn');
        
        // Remove existing event listeners by cloning
        if (addToCartBtn) {
            const newAddToCartBtn = addToCartBtn.cloneNode(true);
            addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
            
            newAddToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleQuickViewAddToCart();
            });
        }
        
        if (buyNowBtn) {
            const newBuyNowBtn = buyNowBtn.cloneNode(true);
            buyNowBtn.parentNode.replaceChild(newBuyNowBtn, buyNowBtn);
            
            newBuyNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleQuickViewBuyNow();
            });
        }
        
        if (wishlistBtn) {
            const newWishlistBtn = wishlistBtn.cloneNode(true);
            wishlistBtn.parentNode.replaceChild(newWishlistBtn, wishlistBtn);
            
            newWishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleQuickViewWishlist();
            });
        }
    }
    
    // Handle add to cart from quick view
    function handleQuickViewAddToCart() {
        const productId = quickViewModal.getAttribute('data-id');
        const productName = quickViewModal.getAttribute('data-name');
        const productPrice = parseFloat(quickViewModal.getAttribute('data-price'));
        const productImage = quickViewModal.getAttribute('data-image');
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        addToCartHandler(product);
        
        // Close modal
        quickViewModal.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
    
    // Handle buy now from quick view
    function handleQuickViewBuyNow() {
        const productId = quickViewModal.getAttribute('data-id');
        const productName = quickViewModal.getAttribute('data-name');
        const productPrice = parseFloat(quickViewModal.getAttribute('data-price'));
        const productImage = quickViewModal.getAttribute('data-image');
        const quantityInput = quickViewModal.querySelector('.quantity-selector input');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        };
        
        // Add to cart first
        addToCartHandler(product);
        
        // Close modal
        quickViewModal.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        
        // Redirect to checkout
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    }
    
    // Handle wishlist from quick view
    function handleQuickViewWishlist() {
        const productId = quickViewModal.getAttribute('data-id');
        const productName = quickViewModal.getAttribute('data-name');
        const productPrice = parseFloat(quickViewModal.getAttribute('data-price'));
        const productImage = quickViewModal.getAttribute('data-image');
        
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        };
        
        addToWishlistHandler(product);
    }
}

// Add to Cart Functionality - FIXED
function initAddToCart() {
    // Add to cart buttons in product cards and featured section
    const addToCartBtns = document.querySelectorAll('.product-btn, .featured-add-cart, .add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from closest product card or featured container
            const card = this.closest('.product-card') || this.closest('.featured-container');
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
                // Check if it's a product card or featured product
                if (card.classList.contains('product-card')) {
                    productId = card.getAttribute('data-id');
                    productName = card.getAttribute('data-name');
                    productPrice = parseFloat(card.getAttribute('data-price'));
                    productImage = card.getAttribute('data-image');
                } else {
                    // It's the featured product
                    const nameElement = card.querySelector('h3');
                    const priceElement = card.querySelector('.price-main');
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    color: productColor || 'Default'
                };
                
                // Add to cart
                addToCartHandler(product);
                
                // Add highlight effect to the card
                if (card.classList.contains('product-card')) {
                    card.classList.add('highlight');
                    setTimeout(() => {
                        card.classList.remove('highlight');
                    }, 1000);
                }
                
                // Change button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
}

// Add to cart handler - FIXED
function addToCartHandler(product) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if item already exists
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new item to cart
        cart.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCountDisplay(totalItems);
    
    // Show cart sidebar
    showCartSidebar(cart);
    
    // Show notification
    showNotification(`Added ${product.name} to cart!`, 'success');
}

// Initialize Buy Now buttons - FIXED
function initBuyNowButtons() {
    const buyNowBtns = document.querySelectorAll('.buy-now, .featured-buy-now');
    
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from closest product card or featured container
            const card = this.closest('.product-card') || this.closest('.featured-container');
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
                // Check if it's a product card or featured product
                if (card.classList.contains('product-card')) {
                    productId = card.getAttribute('data-id');
                    productName = card.getAttribute('data-name');
                    productPrice = parseFloat(card.getAttribute('data-price'));
                    productImage = card.getAttribute('data-image');
                } else {
                    // It's the featured product
                    const nameElement = card.querySelector('h3');
                    const priceElement = card.querySelector('.price-main');
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    color: productColor || 'Default'
                };
                
                // Add to cart first
                addToCartHandler(product);
                
                // Redirect to checkout page
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 1000);
            }
        });
    });
}

// Add to Wishlist Functionality - FIXED
function initAddToWishlist() {
    const wishlistBtns = document.querySelectorAll('.add-to-wishlist, .featured-wishlist');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from closest product card or featured container
            const card = this.closest('.product-card') || this.closest('.featured-container');
            
            if (card) {
                let productId, productName, productPrice, productImage, productColor;
                
                // Check if it's a product card or featured product
                if (card.classList.contains('product-card')) {
                    productId = card.getAttribute('data-id');
                    productName = card.getAttribute('data-name');
                    productPrice = parseFloat(card.getAttribute('data-price'));
                    productImage = card.getAttribute('data-image');
                } else {
                    // It's the featured product
                    const nameElement = card.querySelector('h3');
                    const priceElement = card.querySelector('.price-main');
                    const imageElement = card.querySelector('.featured-image img');
                    
                    productId = 'featured-1';
                    productName = nameElement ? nameElement.textContent : 'Featured Product';
                    productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[৳,]/g, '')) : 0;
                    productImage = imageElement ? imageElement.src : '';
                    
                    // Get selected color if available
                    const selectedColorElement = card.querySelector('.color.active');
                    if (selectedColorElement) {
                        productColor = selectedColorElement.getAttribute('data-color');
                    }
                }
                
                // Create product object
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    color: productColor || 'Default'
                };
                
                // Add to wishlist
                addToWishlistHandler(product, this);
            }
        });
    });
    
    // Initialize wishlist UI on page load
    updateWishlistButtonStates();
}

// Add to wishlist handler
function addToWishlistHandler(product, button) {
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product is already in wishlist
    const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Remove from wishlist if already there
        wishlist = wishlist.filter(item => item.id !== product.id);
        if (button) button.classList.remove('active');
        showNotification(`Removed ${product.name} from wishlist!`, 'info');
    } else {
        // Add to wishlist
        wishlist.push(product);
        if (button) button.classList.add('active');
        showNotification(`Added ${product.name} to wishlist!`, 'success');
    }
    
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCountDisplay(wishlist.length);
    
    // Update button states
    updateWishlistButtonStates();
    
    // Add heart animation
    if (button) addHeartAnimation(button);
}

// Update wishlist button states
function updateWishlistButtonStates() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBtns = document.querySelectorAll('.add-to-wishlist, .featured-wishlist');
    
    wishlistBtns.forEach(btn => {
        const card = btn.closest('.product-card') || btn.closest('.featured-container');
        if (!card) return;
        
        let productId;
        if (card.classList.contains('product-card')) {
            productId = card.getAttribute('data-id');
        } else {
            productId = 'featured-1';
        }
        
        // Check if this product is in the wishlist
        const inWishlist = wishlist.some(item => item.id === productId);
        
        // Update button state
        if (inWishlist) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add heart animation
function addHeartAnimation(button) {
    const heart = document.createElement('div');
    heart.className = 'heart-animation';
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    
    button.style.position = 'relative';
    button.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Initialize sidebars
function initSidebars() {
    const cartBtn = document.getElementById('cartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    const closeCart = document.querySelector('.close-cart');
    const closeWishlist = document.querySelector('.close-wishlist');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    // Open cart sidebar
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            showCartSidebar(cart);
        });
    }
    
    // Open wishlist sidebar
    if (wishlistBtn && wishlistSidebar) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showWishlistSidebar();
        });
    }
    
    // Close cart sidebar
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Close wishlist sidebar
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Continue shopping
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Close sidebars when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.style.right = '-400px';
            if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
}

// Show cart sidebar with updated content
function showCartSidebar(cart) {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const cartItems = cartSidebar.querySelector('.cart-items');
    
    if (!cartSidebar || !overlay || !cartItems) return;
    
    // Update cart content
    updateCartSidebarContent(cart);
    
    // Show sidebar
    cartSidebar.style.right = '0';
    overlay.style.display = 'block';
}

// Show wishlist sidebar
function showWishlistSidebar() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    const wishlistItems = wishlistSidebar.querySelector('.wishlist-items');
    
    if (!wishlistSidebar || !overlay || !wishlistItems) return;
    
    // Update wishlist content
    updateWishlistSidebarContent(wishlist);
    
    // Show sidebar
    wishlistSidebar.style.right = '0';
    overlay.style.display = 'block';
}

// Update cart sidebar content
function updateCartSidebarContent(cart) {
    const cartItems = document.querySelector('.cart-items');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartTotal = document.querySelector('.cart-total');
    
    if (!cartItems) return;
    
    // Clear current items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <a href="#latest-products" class="btn secondary-btn">Start Shopping</a>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners for cart controls
        setupCartControls();
    }
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
    if (cartTotal) cartTotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
}

// Update wishlist sidebar content
function updateWishlistSidebarContent(wishlist) {
    const wishlistItems = document.querySelector('.wishlist-items');
    
    if (!wishlistItems) return;
    
    // Clear current items
    wishlistItems.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-wishlist-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <p>Your wishlist is empty</p>
                <a href="#latest-products" class="btn secondary-btn">Discover Products</a>
            </div>
        `;
    } else {
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p class="wishlist-item-price">৳${item.price.toLocaleString('en-IN')}</p>
                    <button class="btn primary-btn add-to-cart-from-wishlist" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
                <button class="remove-wishlist-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            wishlistItems.appendChild(wishlistItem);
        });
        
        // Add event listeners for wishlist controls
        setupWishlistControls();
    }
}

// Setup cart controls
function setupCartControls() {
    const minusBtns = document.querySelectorAll('.cart-item .minus');
    const plusBtns = document.querySelectorAll('.cart-item .plus');
    const removeBtns = document.querySelectorAll('.remove-item');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateCartItemQuantity(btn.dataset.id, -1);
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateCartItemQuantity(btn.dataset.id, 1);
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            removeCartItem(btn.dataset.id);
        });
    });
}

// Setup wishlist controls
function setupWishlistControls() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-from-wishlist');
    const removeBtns = document.querySelectorAll('.remove-wishlist-item');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const item = wishlist.find(item => item.id === btn.dataset.id);
            if (item) {
                addToCartHandler(item);
            }
        });
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            removeWishlistItem(btn.dataset.id);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartCountDisplay(totalItems);
        
        updateCartSidebarContent(cart);
    }
}

// Remove cart item
function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartCountDisplay(totalItems);
    
    updateCartSidebarContent(cart);
    showNotification('Item removed from cart!', 'info');
}

// Remove wishlist item
function removeWishlistItem(itemId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== itemId);
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    updateWishlistCountDisplay(wishlist.length);
    updateWishlistSidebarContent(wishlist);
    updateWishlistButtonStates();
    
    showNotification('Item removed from wishlist!', 'info');
}

// Show notification - FIXED
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
              type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
              '<i class="fas fa-info-circle"></i>'}
        </div>
        <div class="notification-message">${message}</div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto close after 3 seconds
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 3000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
    }
    
    // Helper function to close notification
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.remove();
        }, 300);
    }
}