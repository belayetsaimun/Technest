// Enhanced Deals Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timers
    initCountdowns();
    
    // Initialize Deal of the Day timer
    initDealOfTheDay();
    
    // Initialize Deal Categories Filter
    initDealCategories();
    
    // Initialize FAQ accordions
    initFaqAccordions();
    
    // Initialize Copy Coupon Buttons
    initCouponCopy();
    
    // Initialize Add to Cart Buttons
    initCartActions();
    
    // Initialize Quick View Modal
    initQuickView();
    
    // Initialize Load More Button
    initLoadMore();
    
    // Initialize theme toggle if not already initialized
    if (typeof initTheme !== 'function' && document.getElementById('themeToggle')) {
        initCustomTheme();
    }
    
    // Initialize cart and wishlist globals
    window.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    window.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
});

// Countdown Timer Logic
function initCountdowns() {
    // Main countdown in hero section
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now
    
    // Update hero countdown every second
    setInterval(() => {
        updateCountdown(endDate, 'days', 'hours', 'minutes', 'seconds');
    }, 1000);
    
    // Individual deal countdowns
    const dealTimers = document.querySelectorAll('.deal-timer');
    dealTimers.forEach(timer => {
        const expiryDate = new Date(timer.dataset.expires);
        const countdownElement = timer.querySelector('.deal-countdown');
        
        // Initial update
        updateDealCountdown(expiryDate, countdownElement);
        
        // Update every minute
        setInterval(() => {
            updateDealCountdown(expiryDate, countdownElement);
        }, 60000); // Every minute
    });
}

function updateCountdown(endDate, daysElementId, hoursElementId, minutesElementId, secondsElementId) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM elements
    document.getElementById(daysElementId).textContent = days.toString().padStart(2, '0');
    document.getElementById(hoursElementId).textContent = hours.toString().padStart(2, '0');
    document.getElementById(minutesElementId).textContent = minutes.toString().padStart(2, '0');
    document.getElementById(secondsElementId).textContent = seconds.toString().padStart(2, '0');
}

function updateDealCountdown(endDate, countdownElement) {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance <= 0) {
        countdownElement.textContent = 'Expired';
        countdownElement.parentElement.classList.add('expired');
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format countdown text
    let countdownText = '';
    if (days > 0) {
        countdownText += `${days}d `;
    }
    countdownText += `${hours}h ${minutes}m`;
    
    // Update element
    countdownElement.textContent = countdownText;
}

// Deal of the Day Timer
function initDealOfTheDay() {
    // Set end time to midnight tonight
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Update timer every second
    setInterval(() => {
        const currentTime = new Date();
        const timeLeft = endOfDay - currentTime;
        
        if (timeLeft <= 0) {
            // Reset to next day if passed
            endOfDay.setDate(endOfDay.getDate() + 1);
            return;
        }
        
        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update DOM
        document.getElementById('dotd-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('dotd-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('dotd-seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Deal Categories Filter
function initDealCategories() {
    const categoryButtons = document.querySelectorAll('.deal-category');
    const dealCards = document.querySelectorAll('.deal-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Filter deals
            dealCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                    // Add animation
                    card.classList.add('fade-in');
                    setTimeout(() => {
                        card.classList.remove('fade-in');
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// FAQ Accordions
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on clicked item
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Coupon Copy Functionality
function initCouponCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('couponNotification');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const couponCode = button.dataset.coupon;
            
            // Copy to clipboard
            navigator.clipboard.writeText(couponCode).then(() => {
                // Show notification
                notification.classList.add('show');
                
                // Change button text
                button.innerHTML = '<i class="fas fa-check"></i> Copied';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Could not copy coupon code: ', err);
                // Fallback for clipboard API failure
                showNotification('Failed to copy coupon. Please try again.', 'error');
            });
        });
    });
}

// Quick View Modal
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);
    }
    
    if (!quickViewModal) return;
    
    // Quick View button click handlers
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get product card
            const productCard = button.closest('.deal-card');
            if (!productCard) return;
            
            openQuickView(productCard);
        });
    });
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(button.closest('.modal'));
        });
    });
    
    // Close on overlay click
    overlay.addEventListener('click', () => {
        const openModals = document.querySelectorAll('.modal[style*="display: block"]');
        openModals.forEach(modal => {
            hideModal(modal);
        });
    });
}

function openQuickView(productCard) {
    const quickViewModal = document.getElementById('quickViewModal');
    const overlay = document.getElementById('overlay');
    
    if (!quickViewModal || !productCard) return;
    
    // Get product data
    const productId = productCard.dataset.id;
    const productName = productCard.dataset.name;
    const productPrice = parseFloat(productCard.dataset.price);
    const productImage = productCard.dataset.image;
    const productCategory = productCard.querySelector('.product-category').textContent;
    
    // Store current product data for use in cart/wishlist actions
    window.currentQuickViewProduct = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        category: productCategory
    };
    
    // Get rating from the product card
    const ratingElement = productCard.querySelector('.product-rating');
    const ratingHTML = ratingElement ? ratingElement.innerHTML : '';
    
    // Get product highlights
    const highlightsElement = productCard.querySelector('.product-highlights');
    const highlightsHTML = highlightsElement ? highlightsElement.innerHTML : '';
    
    // Update modal elements
    const modalTitle = quickViewModal.querySelector('h2');
    const modalCategory = quickViewModal.querySelector('.product-category');
    const modalPrice = quickViewModal.querySelector('.current-price');
    const modalImage = quickViewModal.querySelector('.main-product-image');
    const modalRating = quickViewModal.querySelector('.product-rating');
    const modalBadge = quickViewModal.querySelector('.product-badge');
    
    if (modalTitle) modalTitle.textContent = productName;
    if (modalCategory) modalCategory.textContent = productCategory;
    if (modalPrice) modalPrice.textContent = `৳${productPrice.toLocaleString('en-IN')}`;
    
    // Get old price if available
    const oldPriceElement = productCard.querySelector('.old-price');
    if (oldPriceElement) {
        const oldPrice = oldPriceElement.textContent;
        const modalOldPrice = quickViewModal.querySelector('.old-price');
        if (modalOldPrice) modalOldPrice.textContent = oldPrice;
        
        // Calculate discount percentage
        const oldPriceValue = parseFloat(oldPrice.replace(/[৳,]/g, ''));
        const discountPercent = Math.round((oldPriceValue - productPrice) / oldPriceValue * 100);
        
        const modalDiscount = quickViewModal.querySelector('.discount');
        if (modalDiscount) modalDiscount.textContent = `-${discountPercent}%`;
    }
    
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
    
    // Get deal badge if available
    const dealBadge = productCard.querySelector('.deal-badge');
    if (dealBadge && modalBadge) {
        modalBadge.textContent = dealBadge.textContent;
        modalBadge.className = 'product-badge ' + dealBadge.className.split(' ')[1];
    } else if (modalBadge) {
        modalBadge.style.display = 'none';
    }
    
    // Show modal
    quickViewModal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    setTimeout(() => {
        quickViewModal.classList.add('modal-open');
    }, 10);
    
    // Set up color option clicks
    setupColorOptions();
    
    // Set up quantity buttons
    setupQuantityButtons();
    
    // Set up action buttons
    setupModalActionButtons();
}

function hideModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 300);
}

function setupColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, you would change the product image based on color
            const selectedColor = this.dataset.color;
            console.log(`Selected color: ${selectedColor}`);
            // You would update the image here in a real implementation
        });
    });
}

function setupQuantityButtons() {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            if (!input) return;
            
            let currentValue = parseInt(input.value);
            
            if (this.classList.contains('minus') && currentValue > 1) {
                input.value = currentValue - 1;
            } else if (this.classList.contains('plus') && currentValue < 10) {
                input.value = currentValue + 1;
            }
            
            // Update Buy Now modal if open
            updateBuyNowQuantity();
        });
    });
}

function updateBuyNowQuantity() {
    const buyNowModal = document.getElementById('buyNowModal');
    if (!buyNowModal || buyNowModal.style.display !== 'block') return;
    
    const quantityInput = buyNowModal.querySelector('.quantity-selector input');
    const quantityElement = buyNowModal.querySelector('.product-quantity');
    const totalElement = buyNowModal.querySelector('.product-total');
    const priceElement = buyNowModal.querySelector('.product-price');
    
    if (!quantityInput || !quantityElement || !totalElement || !priceElement) return;
    
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceElement.textContent.replace(/[৳,]/g, ''));
    const total = price * quantity;
    
    quantityElement.textContent = quantity;
    totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
}

function setupModalActionButtons() {
    // Add to Cart button
    const addToCartBtn = document.querySelector('.modal .add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCartFromModal);
    }
    
    // Buy Now button
    const buyNowBtn = document.querySelector('.modal .buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', showBuyNowModal);
    }
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.modal .wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', toggleWishlistFromModal);
    }
}

function addToCartFromModal() {
    if (!window.currentQuickViewProduct) return;
    
    const quantityInput = document.querySelector('.product-quantity input, .quantity-selector input');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    const product = {
        ...window.currentQuickViewProduct,
        quantity: quantity
    };
    
    // Add to cart
    addItemToCart(product);
    
    // Close modal
    hideModal(document.getElementById('quickViewModal'));
    
    // Show cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        setTimeout(() => {
            cartSidebar.style.right = '0';
            document.getElementById('overlay').style.display = 'block';
        }, 300);
    }
}

// Main cart function - fixed
function addItemToCart(product) {
    if (!product || !product.id) return;
    
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += product.quantity || 1;
    } else {
        cart.push({
            ...product,
            quantity: product.quantity || 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartUI(cart);
    updateCartCount(cart);
    
    // Show notification
    showNotification(`Added ${product.name} to cart`, 'success');
}

function showBuyNowModal() {
    if (!window.currentQuickViewProduct) return;
    
    // Create a buy now product
    const product = {
        ...window.currentQuickViewProduct,
        quantity: 1
    };
    
    // Add to localStorage for checkout page
    localStorage.setItem('buyNowItem', JSON.stringify(product));
    
    // Redirect to checkout
    window.location.href = 'checkout.html?buynow=true';
}

function toggleWishlistFromModal() {
    if (!window.currentQuickViewProduct) return;
    
    const product = window.currentQuickViewProduct;
    
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    if (isInWishlist) {
        // Remove from wishlist
        const newWishlist = wishlist.filter(item => item.id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        showNotification(`Removed ${product.name} from wishlist`, 'info');
    } else {
        // Add to wishlist
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`Added ${product.name} to wishlist`, 'success');
    }
    
    // Update wishlist button
    updateWishlistButton();
    
    // Update wishlist count
    updateWishlistCount();
}

function updateWishlistButton() {
    if (!window.currentQuickViewProduct) return;
    
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (!wishlistBtn) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some(item => item.id === window.currentQuickViewProduct.id);
    
    if (isInWishlist) {
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
        wishlistBtn.classList.add('in-wishlist');
    } else {
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        wishlistBtn.classList.remove('in-wishlist');
    }
}

function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (!wishlistCount) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlistCount.textContent = wishlist.length;
}

// Cart Actions
function initCartActions() {
    // Deal card "Add to Cart" buttons
    const addToCartBtns = document.querySelectorAll('.deal-card .add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.deal-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                quantity: 1,
                category: productCard.querySelector('.product-category').textContent
            };
            
            // Add to cart
            addItemToCart(product);
        });
    });
    
    // Deal card "Add to Wishlist" buttons
    const addToWishlistBtns = document.querySelectorAll('.deal-card .add-to-wishlist');
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.deal-card');
            if (!productCard) return;
            
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: parseFloat(productCard.dataset.price),
                image: productCard.dataset.image,
                category: productCard.querySelector('.product-category').textContent
            };
            
            // Toggle wishlist
            toggleWishlistItem(product, this);
        });
    });
    
    // Deal of the Day buttons
    const dotdBuyNowBtn = document.querySelector('.dotd-actions .buy-now-btn');
    const dotdAddToCartBtn = document.querySelector('.dotd-actions .add-to-cart-btn');
    
    if (dotdBuyNowBtn) {
        dotdBuyNowBtn.addEventListener('click', function() {
            // Create a product object for the DOTD item
            const product = {
                id: 'macbook-pro-m3',
                name: 'MacBook Pro M3',
                price: 189999,
                image: 'images/macprom3.png',
                quantity: 1,
                category: 'Laptops'
            };
            
            // Store for checkout
            localStorage.setItem('buyNowItem', JSON.stringify(product));
            
            // Redirect to checkout
            window.location.href = 'checkout.html?buynow=true';
        });
    }
    
    if (dotdAddToCartBtn) {
        dotdAddToCartBtn.addEventListener('click', function() {
            // Create a product object for the DOTD item
            const product = {
                id: 'macbook-pro-m3',
                name: 'MacBook Pro M3',
                price: 189999,
                image: 'images/macprom3.png',
                quantity: 1,
                category: 'Laptops'
            };
            
            // Add to cart
            addItemToCart(product);
            
            // Show cart sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                setTimeout(() => {
                    cartSidebar.style.right = '0';
                    document.getElementById('overlay').style.display = 'block';
                }, 300);
            }
        });
    }
    
    // Initialize cart sidebar actions
    initCartSidebar();
    initWishlistSidebar();
}

function toggleWishlistItem(product, button) {
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if product is already in wishlist
    const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Remove from wishlist
        wishlist.splice(existingItemIndex, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update heart icon
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        showNotification(`Removed ${product.name} from wishlist`, 'info');
    } else {
        // Add to wishlist
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update heart icon
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        
        showNotification(`Added ${product.name} to wishlist`, 'success');
    }
    
    // Update wishlist count
    updateWishlistCount();
    
    // Update wishlist sidebar if open
    updateWishlistUI(wishlist);
}

function updateCartUI(cart) {
    // Update cart count using shared utilities
    if (window.CartUtils) {
        window.CartUtils.updateCartCount(cart);
    } else {
        updateCartCount(cart);
    }
    
    // Update cart sidebar if it exists
    const cartItems = document.querySelector('.cart-items');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartShipping = document.querySelector('.cart-shipping');
    const cartTotal = document.querySelector('.cart-total');
    
    if (cartItems) {
        if (cart.length === 0) {
            // Show empty cart message using shared utilities
            cartItems.innerHTML = window.CartUtils ? 
                window.CartUtils.getEmptyCartHTML('products.html', 'Start Shopping') :
                `<div class="empty-cart">
                    <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn secondary-btn">Start Shopping</a>
                </div>`;
        } else {
            // Clear cart items
            cartItems.innerHTML = '';
            
            // Add cart items using shared utilities
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.dataset.id = item.id;
                
                if (window.CartUtils) {
                    cartItem.innerHTML = window.CartUtils.createCartItemHTML(item);
                    cartItems.appendChild(cartItem);
                    // Setup event listeners using shared utilities
                    window.CartUtils.setupCartItemEventListeners(cartItem, cart, () => updateCartUI(cart));
                } else {
                    // Fallback to original implementation
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
                    cartItems.appendChild(cartItem);
                    setupCartItemControls(cartItem);
                }
            });
        }
        
        // Update totals using shared utilities
        if (cartSubtotal && cartShipping && cartTotal) {
            if (window.CartUtils) {
                const totals = window.CartUtils.calculateTotals(cart);
                cartSubtotal.textContent = window.CartUtils.formatCurrency(totals.subtotal);
                cartShipping.textContent = totals.isShippingFree ? 'Free' : window.CartUtils.formatCurrency(totals.shipping);
                cartTotal.textContent = window.CartUtils.formatCurrency(totals.total);
            } else {
                // Fallback to original implementation
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shipping = subtotal > 5000 ? 0 : 150;
                const total = subtotal + shipping;
                
                cartSubtotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
                cartShipping.textContent = shipping === 0 ? 'Free' : `৳${shipping.toLocaleString('en-IN')}`;
                cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            }
        }
        
        // Show/hide checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }
}

function updateCartCount(cart) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(countElement => {
        countElement.textContent = totalItems;
        countElement.style.animation = 'cartCountPulse 0.5s ease';
        setTimeout(() => {
            countElement.style.animation = '';
        }, 500);
    });
}

function setupCartItemControls(cartItem) {
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');
    const input = cartItem.querySelector('input');
    const removeBtn = cartItem.querySelector('.remove-item');
    const productId = cartItem.dataset.id;
    
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (!input) return;
            
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartItemQuantity(productId, currentValue - 1);
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            if (!input) return;
            
            let currentValue = parseInt(input.value);
            if (currentValue < 10) {
                input.value = currentValue + 1;
                updateCartItemQuantity(productId, currentValue + 1);
            }
        });
    }
    
    if (input) {
        input.addEventListener('change', () => {
            let newValue = parseInt(input.value);
            
            // Ensure value is between 1 and 10
            if (isNaN(newValue) || newValue < 1) newValue = 1;
            if (newValue > 10) newValue = 10;
            
            input.value = newValue;
            updateCartItemQuantity(productId, newValue);
        });
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeCartItem(productId);
        });
    }
}

function updateCartItemQuantity(productId, quantity) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update the quantity
        cart[itemIndex].quantity = quantity;
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        updateCartUI(cart);
    }
}

function removeCartItem(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const removedItem = cart[itemIndex];
        
        // Remove the item from the cart
        cart.splice(itemIndex, 1);
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        updateCartUI(cart);
        
        // Show notification
        showNotification(`Removed ${removedItem.name} from cart`, 'info');
    }
}

function updateWishlistUI(wishlist) {
    // Update wishlist sidebar if it exists
    const wishlistItems = document.querySelector('.wishlist-items');
    
    if (wishlistItems) {
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="products.html" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
        } else {
            // Clear wishlist items
            wishlistItems.innerHTML = '';
            
            // Add wishlist items
            wishlist.forEach(item => {
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
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listeners for wishlist item controls
                setupWishlistItemControls(wishlistItem);
            });
        }
        
        // Show/hide clear wishlist button
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.style.display = wishlist.length > 0 ? 'block' : 'none';
        }
    }
    
    // Update wishlist icons on product cards
    updateWishlistIcons(wishlist);
}

function setupWishlistItemControls(wishlistItem) {
    const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
    const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
    const productId = wishlistItem.dataset.id;
    
    if (moveToCartBtn) {
        moveToCartBtn.addEventListener('click', () => {
            moveWishlistItemToCart(productId);
        });
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeWishlistItem(productId);
        });
    }
}

function moveWishlistItemToCart(productId) {
    // Get wishlist and cart from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Find the item in the wishlist
    const itemIndex = wishlist.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const item = wishlist[itemIndex];
        
        // Add to cart
        addItemToCart({
            ...item,
            quantity: 1
        });
        
        // Remove from wishlist
        removeWishlistItem(productId);
        
        // Close wishlist sidebar and open cart sidebar
        const wishlistSidebar = document.getElementById('wishlistSidebar');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (wishlistSidebar && cartSidebar) {
            wishlistSidebar.style.right = '-400px';
            setTimeout(() => {
                cartSidebar.style.right = '0';
            }, 300);
        }
    }
}

function removeWishlistItem(productId) {
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Find the item in the wishlist
    const itemIndex = wishlist.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const removedItem = wishlist[itemIndex];
        
        // Remove the item from the wishlist
        wishlist.splice(itemIndex, 1);
        
        // Update localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist UI
        updateWishlistUI(wishlist);
        
        // Update wishlist count
        updateWishlistCount();
        
        // Show notification
        showNotification(`Removed ${removedItem.name} from wishlist`, 'info');
    }
}

function updateWishlistIcons(wishlist) {
    // Get all wishlist IDs
    const wishlistIds = wishlist.map(item => item.id);
    
    // Update heart icons on product cards
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        const productCard = btn.closest('.deal-card');
        if (!productCard) return;
        
        const productId = productCard.dataset.id;
        const icon = btn.querySelector('i');
        
        if (!icon) return;
        
        if (wishlistIds.includes(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    });
}

function initCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.getElementById('overlay');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    // Initialize cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartUI(cart);
    
    if (cartBtn && cartSidebar && closeCart && overlay) {
        // Cart button click
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
        
        // Close cart
        closeCart.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
        
        // Continue shopping
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                cartSidebar.style.right = '-400px';
                overlay.style.display = 'none';
            });
        }
    }
}

function initWishlistSidebar() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const overlay = document.getElementById('overlay');
    const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
    
    // Initialize wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    updateWishlistUI(wishlist);
    updateWishlistCount();
    
    if (wishlistBtn && wishlistSidebar && closeWishlist && overlay) {
        // Wishlist button click
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
        
        // Close wishlist
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
        
        // Clear wishlist
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                localStorage.setItem('wishlist', '[]');
                updateWishlistUI([]);
                updateWishlistCount();
                showNotification('Wishlist cleared', 'info');
            });
        }
    }
}

// Load More Button
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // For this example, we'll just simulate loading more products
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.innerHTML = 'Loading More <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate delay for demo purposes
        setTimeout(() => {
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.innerHTML = 'No More Deals Available';
            loadMoreBtn.style.opacity = '0.7';
            loadMoreBtn.style.pointerEvents = 'none';
            loadMoreBtn.classList.remove('pulse-animation');
        }, 1500);
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
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
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button event
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-remove after 4 seconds
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

// Dark mode toggle if not in main script
function initCustomTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
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
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            enableLightMode();
            localStorage.setItem('technest-theme', 'light');
        } else {
            enableDarkMode();
            localStorage.setItem('technest-theme', 'dark');
        }
        
        // Add animation to the toggle button
        themeToggle.classList.add('theme-toggle-animation');
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-animation');
        }, 500);
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon(true);
    }
    
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
    }
    
    function updateThemeToggleIcon(isDarkMode) {
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
}