document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const couponToggle = document.getElementById('coupon-toggle');
    const couponForm = document.querySelector('.coupon-form');
    const returnToCartBtn = document.getElementById('return-to-cart');
    const proceedPaymentBtn = document.getElementById('proceed-payment');
    const cartLink = document.getElementById('cartLink');
    const themeToggle = document.getElementById('themeToggle');
    
    // Cart and Wishlist Elements
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.getElementById('header-cart-count');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    const wishlistCount = document.querySelector('.wishlist-count');
    
    // Payment Modal Elements
    const paymentModal = document.getElementById('paymentModal');
    const backToShippingBtn = document.getElementById('back-to-shipping');
    const placeOrderBtn = document.getElementById('place-order');
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const mobilePaymentForm = document.getElementById('mobile-payment-form');
    const codPaymentForm = document.getElementById('cod-payment-form');
    
    // Success Modal Elements
    const successModal = document.getElementById('successModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const overlay = document.getElementById('overlay');
    
    // Notification Container
    const notificationContainer = document.getElementById('notificationContainer');
    
    // Delivery Location Radio Buttons
    const deliveryLocationRadios = document.querySelectorAll('input[name="delivery-location"]');
    
    // Progress Steps
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    // Initialize Theme
    initTheme();
    
    // Initialize Cart and Wishlist from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // ADDED: Check for any buyNowItem in localStorage
    const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
    if (buyNowItem) {
        // If a buyNowItem exists and the cart is empty, use the buyNowItem
        if (cart.length === 0) {
            cart.push(buyNowItem);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        // Clear the buyNowItem from localStorage
        localStorage.removeItem('buyNowItem');
    }
    
    // Set default delivery location and fee
    let deliveryLocation = 'inside-dhaka';
    let deliveryFee = 60; // Default: Inside Dhaka
    
    // Update counts based on localStorage
    updateCartCount();
    updateWishlistCount();
    
    // Load cart data into checkout summary
    loadCartToCheckout();
    
    // Theme Management Functions
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
    
    // Handle Coupon Toggle
    if (couponToggle) {
        couponToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (couponForm.style.display === 'block') {
                couponForm.style.display = 'none';
            } else {
                couponForm.style.display = 'block';
            }
        });
    }
    
    // Handle Return to Cart
    if (returnToCartBtn) {
        returnToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show cart sidebar
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
    }
    
    // Handle Cart Link
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Show cart sidebar
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
    }
    
    // Handle delivery location change
    if (deliveryLocationRadios.length > 0) {
        deliveryLocationRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                deliveryLocation = this.value;
                deliveryFee = deliveryLocation === 'inside-dhaka' ? 60 : 150;
                
                // Update checkout summary
                updateDeliveryFee();
                updateOrderTotal();
                
                // Show notification for delivery change
                const deliveryText = deliveryLocation === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka';
                showNotification(`Delivery option changed to ${deliveryText}`, 'info');
            });
        });
    }
    
    // Handle Proceed to Payment
    if (proceedPaymentBtn) {
        proceedPaymentBtn.addEventListener('click', function() {
            // Validate form before proceeding
            if (validateShippingForm()) {
                // Show payment modal with animation
                showModal(paymentModal);
                
                // Update step progress
                updateCheckoutProgress(3);
            }
        });
    }
    
    // Handle Back to Shipping
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function() {
            hideModal(paymentModal);
            
            // Update step progress
            updateCheckoutProgress(2);
        });
    }
    
    // Handle Payment Method Change
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePaymentForm(this.value);
            
            // Show notification for payment method change
            let methodName = "Credit Card";
            switch(this.value) {
                case 'bkash': methodName = "bKash"; break;
                case 'nagad': methodName = "Nagad"; break;
                case 'rocket': methodName = "Rocket"; break;
                case 'cod': methodName = "Cash on Delivery"; break;
            }
            
            showNotification(`Payment method changed to ${methodName}`, 'info');
        });
    });
    
    // Handle Place Order
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            // Validate payment form before proceeding
            if (validatePaymentForm()) {
                // Hide payment modal
                hideModal(paymentModal);
                
                // Update step progress
                updateCheckoutProgress(4);
                
                // Update confirmation email in success modal
                const emailInput = document.getElementById('email');
                const confirmationEmail = document.getElementById('confirmation-email');
                if (emailInput && confirmationEmail) {
                    confirmationEmail.textContent = emailInput.value;
                }
                
                // Update payment method in success modal
                const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
                const paymentMethodDisplay = document.getElementById('payment-method-display');
                if (selectedPayment && paymentMethodDisplay) {
                    let paymentMethodText = "Credit Card";
                    
                    switch (selectedPayment.value) {
                        case 'bkash':
                            paymentMethodText = "bKash";
                            break;
                        case 'nagad':
                            paymentMethodText = "Nagad";
                            break;
                        case 'rocket':
                            paymentMethodText = "Rocket";
                            break;
                        case 'cod':
                            paymentMethodText = "Cash on Delivery";
                            break;
                    }
                    
                    paymentMethodDisplay.textContent = paymentMethodText;
                }
                
                // Update order date
                const orderDate = document.getElementById('order-date');
                if (orderDate) {
                    const today = new Date();
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    orderDate.textContent = today.toLocaleDateString('en-US', options);
                }
                
                // Update order total
                const orderTotal = document.getElementById('checkout-total');
                const successTotal = document.getElementById('success-order-total');
                if (orderTotal && successTotal) {
                    successTotal.textContent = orderTotal.textContent;
                }
                
                // Show success modal with animation
                setTimeout(() => {
                    showModal(successModal);
                    
                    // Show success notification
                    showNotification('Order placed successfully!', 'success');
                }, 300);
                
                // Clear the cart after successful order
                localStorage.setItem('cart', JSON.stringify([]));
                cart = [];
                
                // Update cart count
                updateCartCount();
            }
        });
    }
    
    // Cart Functions
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update cart UI with latest data
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
    
    // Wishlist Functions
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
            
            // Update wishlist UI with latest data
            updateWishlistUI();
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Close Modal Events
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });
    
    // Close modals when clicking overlay
    overlay.addEventListener('click', function() {
        if (paymentModal) paymentModal.style.display = 'none';
        if (successModal) successModal.style.display = 'none';
        if (cartSidebar) cartSidebar.style.right = '-400px';
        if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
        overlay.style.display = 'none';
        
        // Reset checkout progress if payment modal was open
        if (paymentModal && paymentModal.style.display === 'block') {
            updateCheckoutProgress(2);
        }
    });
    
    // Helper Functions
    function validateShippingForm() {
        // Get form elements
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const firstname = document.getElementById('firstname');
        const lastname = document.getElementById('lastname');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zipcode = document.getElementById('zipcode');
        
        // Simple validation - check if required fields are filled
        if (!email.value || !phone.value || !firstname.value || !lastname.value || 
            !address.value || !city.value || !state.value || !zipcode.value) {
            showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showNotification('Please enter a valid email address.', 'error');
            email.focus();
            return false;
        }
        
        // Phone validation - basic format check
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            showNotification('Please enter a valid phone number.', 'error');
            phone.focus();
            return false;
        }
        
        return true;
    }
    
    function validatePaymentForm() {
        const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
        
        if (!selectedPayment) {
            showNotification('Please select a payment method.', 'error');
            return false;
        }
        
        if (selectedPayment.value === 'card') {
            // Card payment validation
            const cardNumber = document.getElementById('card-number');
            const cardExpiry = document.getElementById('card-expiry');
            const cardCvv = document.getElementById('card-cvv');
            const cardName = document.getElementById('card-name');
            
            if (!cardNumber.value || !cardExpiry.value || !cardCvv.value || !cardName.value) {
                showNotification('Please fill in all card details.', 'error');
                return false;
            }
            
            // Basic card number validation (should be more robust in production)
            if (cardNumber.value.replace(/\D/g, '').length < 13) {
                showNotification('Please enter a valid card number.', 'error');
                cardNumber.focus();
                return false;
            }
            
            // Basic expiry validation (MM/YY format)
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(cardExpiry.value)) {
                showNotification('Please enter a valid expiry date (MM/YY).', 'error');
                cardExpiry.focus();
                return false;
            }
            
            // Basic CVV validation (3-4 digits)
            const cvvRegex = /^[0-9]{3,4}$/;
            if (!cvvRegex.test(cardCvv.value)) {
                showNotification('Please enter a valid CVV.', 'error');
                cardCvv.focus();
                return false;
            }
            
        } else if (selectedPayment.value === 'bkash' || selectedPayment.value === 'nagad' || selectedPayment.value === 'rocket') {
            // Mobile banking validation
            const mobileNumber = document.getElementById('mobile-number');
            
            if (!mobileNumber.value) {
                showNotification('Please enter your mobile number.', 'error');
                mobileNumber.focus();
                return false;
            }
            
            // Bangladesh mobile number validation (should start with 01)
            const mobileRegex = /^01[3-9][0-9]{8}$/;
            if (!mobileRegex.test(mobileNumber.value)) {
                showNotification('Please enter a valid mobile number (e.g., 01700000000).', 'error');
                mobileNumber.focus();
                return false;
            }
        }
        
        return true;
    }
    
    function updatePaymentForm(paymentMethod) {
        // Hide all payment forms
        cardPaymentForm.style.display = 'none';
        mobilePaymentForm.style.display = 'none';
        codPaymentForm.style.display = 'none';
        
        // Show the selected payment form
        switch (paymentMethod) {
            case 'bkash':
            case 'nagad':
            case 'rocket':
                mobilePaymentForm.style.display = 'block';
                break;
            case 'card':
                cardPaymentForm.style.display = 'block';
                break;
            case 'cod':
                codPaymentForm.style.display = 'block';
                break;
        }
    }
    
    function updateCartCount() {
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update all cart count badges
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateWishlistCount() {
        // Update wishlist count badge
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        wishlistCountElements.forEach(element => {
            element.textContent = wishlist.length;
            element.style.animation = 'cartCountPulse 0.5s ease';
        });
    }
    
    function updateCartUI() {
        // Get cart items container
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('sidebar-cart-total');
        
        if (!cartItems || !cartTotal) return;
        
        // Clear cart items container
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="index.html#featured" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            // Update cart total
            cartTotal.textContent = '৳0.00';
            
        } else {
            // Create cart items
            cart.forEach(item => {
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
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners to new elements
                const minusBtn = cartItem.querySelector('.minus');
                const plusBtn = cartItem.querySelector('.plus');
                const removeBtn = cartItem.querySelector('.remove-item');
                const input = cartItem.querySelector('input');
                
                minusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(input.value);
                    if (currentValue > 1) {
                        input.value = currentValue - 1;
                        updateCartItemQuantity(item.id, currentValue - 1);
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    const currentValue = parseInt(input.value);
                    if (currentValue < 10) {
                        input.value = currentValue + 1;
                        updateCartItemQuantity(item.id, currentValue + 1);
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                });
            });
            
            // Calculate cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update cart total display
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
    }
    
    function updateWishlistUI() {
        // Get wishlist items container
        const wishlistItems = document.querySelector('.wishlist-items');
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        
        if (!wishlistItems || !clearWishlistBtn) return;
        
        // Clear wishlist items container
        wishlistItems.innerHTML = '';
        
        if (wishlist.length === 0) {
            // Show empty wishlist message
            wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <a href="index.html#featured" class="btn secondary-btn">Discover Products</a>
                </div>
            `;
            
            // Hide clear wishlist button
            clearWishlistBtn.style.display = 'none';
        } else {
            // Create wishlist items
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
                
                // Add event listeners to new buttons
                const moveToCartBtn = wishlistItem.querySelector('.move-to-cart');
                const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
                
                moveToCartBtn.addEventListener('click', () => {
                    // Add to cart
                    addItemToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                    });
                    
                    // Remove from wishlist
                    removeFromWishlist(item.id);
                    
                    // Switch from wishlist to cart sidebar
                    wishlistSidebar.style.right = '-400px';
                    cartSidebar.style.right = '0';
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromWishlist(item.id);
                });
            });
            
            // Show clear wishlist button
            clearWishlistBtn.style.display = 'block';
            
            // Add event listener to clear wishlist button
            clearWishlistBtn.addEventListener('click', () => {
                clearWishlist();
            });
        }
    }
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity if item already exists
            existingItem.quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Reload checkout summary if on checkout page
        loadCartToCheckout();
        
        // Show notification
        showNotification(`Added ${product.name} to cart`, 'success');
    }
    
    function removeFromCart(productId) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            
            // Remove the item from the cart
            cart.splice(itemIndex, 1);
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Reload checkout summary if on checkout page
            loadCartToCheckout();
            
            // Show notification
            showNotification(`Removed ${removedItem.name} from cart`, 'info');
        }
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Update the quantity
            cart[itemIndex].quantity = quantity;
            
            // Update the UI
            const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
            if (cartItem) {
                const priceElement = cartItem.querySelector('.cart-item-price');
                const itemPrice = cart[itemIndex].price * quantity;
                priceElement.textContent = `৳${itemPrice.toLocaleString('en-IN')}`;
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartTotal = document.getElementById('sidebar-cart-total');
            if (cartTotal) {
                cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            }
            
            // Reload checkout summary if on checkout page
            loadCartToCheckout();
            
            // Show notification
            showNotification(`Updated ${cart[itemIndex].name} quantity to ${quantity}`, 'info');
        }
    }
    
    function removeFromWishlist(productId) {
        // Find the item in the wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            
            // Remove the item from the wishlist
            wishlist.splice(itemIndex, 1);
            
            // Save wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update UI
            updateWishlistCount();
            updateWishlistUI();
            
            // Show notification
            showNotification(`Removed ${removedItem.name} from wishlist`, 'info');
        }
    }
    
    function clearWishlist() {
        // Clear wishlist array
        wishlist = [];
        
        // Save empty wishlist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
        
        // Show notification
        showNotification('Wishlist cleared', 'info');
    }
    
    // Function to update delivery fee
    function updateDeliveryFee() {
        const deliveryFeeElement = document.getElementById('checkout-delivery');
        if (deliveryFeeElement) {
            deliveryFeeElement.textContent = `৳${deliveryFee.toLocaleString('en-IN')}`;
        }
    }
    
    // Function to update order total
    function updateOrderTotal() {
        const subtotalElement = document.getElementById('checkout-subtotal');
        const totalElement = document.getElementById('checkout-total');
        
        if (subtotalElement && totalElement) {
            const subtotalText = subtotalElement.textContent;
            const subtotal = parseFloat(subtotalText.replace(/[৳,]/g, '')) || 0;
            const total = subtotal + deliveryFee;
            
            totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
        }
    }
    
    // Function to load cart data and display in checkout summary
    function loadCartToCheckout() {
        // Get order summary elements
        const orderItems = document.getElementById('checkout-order-items');
        const orderCount = document.getElementById('order-count');
        const subtotalElement = document.getElementById('checkout-subtotal');
        const deliveryFeeElement = document.getElementById('checkout-delivery');
        const totalElement = document.getElementById('checkout-total');
        
        // If not on checkout page, exit function
        if (!orderItems || !orderCount || !subtotalElement || !deliveryFeeElement || !totalElement) {
            return;
        }
        
        // Clear order items
        orderItems.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            orderItems.innerHTML = `
                <div class="empty-order-items">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>No items in cart. Please add products first.</p>
                    <a href="index.html" class="btn secondary-btn">Return to Shop</a>
                </div>
            `;
            
            // Update counts and totals
            orderCount.textContent = '(0 items)';
            subtotalElement.textContent = '৳0.00';
            deliveryFeeElement.textContent = `৳${deliveryFee.toLocaleString('en-IN')}`;
            totalElement.textContent = `৳${deliveryFee.toLocaleString('en-IN')}`;
            
            // Disable proceed button
            const proceedPaymentBtn = document.getElementById('proceed-payment');
            if (proceedPaymentBtn) {
                proceedPaymentBtn.disabled = true;
                proceedPaymentBtn.classList.add('disabled-btn');
            }
        } else {
            // Calculate subtotal
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Calculate total (subtotal + delivery fee)
            const total = subtotal + deliveryFee;
            
            // Update count text
            const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
            orderCount.textContent = `(${itemCount} item${itemCount > 1 ? 's' : ''})`;
            
            // Display each item in the order summary
            cart.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="item-quantity">${item.quantity}</span>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-variant">Quantity: ${item.quantity}</p>
                        <p class="item-price">৳${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                `;
                
                orderItems.appendChild(orderItem);
            });
            
            // Update totals
            subtotalElement.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
            deliveryFeeElement.textContent = `৳${deliveryFee.toLocaleString('en-IN')}`;
            totalElement.textContent = `৳${total.toLocaleString('en-IN')}`;
            
            // Enable proceed button
            const proceedPaymentBtn = document.getElementById('proceed-payment');
            if (proceedPaymentBtn) {
                proceedPaymentBtn.disabled = false;
                proceedPaymentBtn.classList.remove('disabled-btn');
            }
        }
    }
    
    // Update Checkout Progress
    function updateCheckoutProgress(step) {
        if (!progressSteps || !progressLines) return;
        
        progressSteps.forEach((progressStep, index) => {
            const stepNum = parseInt(progressStep.dataset.step);
            
            if (stepNum <= step) {
                progressStep.classList.add('active');
                if (stepNum < step) {
                    progressStep.classList.add('completed');
                } else {
                    progressStep.classList.remove('completed');
                }
            } else {
                progressStep.classList.remove('active', 'completed');
            }
        });
        
        progressLines.forEach((line, index) => {
            if (index < step - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }
    
    // Show Modal with Animation
    function showModal(modal) {
        if (!modal) return;
        
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
    }
    
    // Hide Modal with Animation
    function hideModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('modal-open');
        
        setTimeout(() => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Show Notification Toast
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
    
    // Input Formatting
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Format card number: XXXX XXXX XXXX XXXX
            let value = this.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            this.value = formattedValue;
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            // Format expiry date: MM/YY
            let value = this.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            
            if (value.length > 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                this.value = value;
            }
        });
    }
    
    // Initialize page
    // Set default payment method
    updatePaymentForm('card');
    
    // Initialize delivery fee in the summary
    updateDeliveryFee();
    updateOrderTotal();
    
    // Initialize checkout progress
    updateCheckoutProgress(2);
});