// Contact Page JavaScript - Enhanced with modern functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart and wishlist with error handling
    let cart = [];
    let wishlist = [];
    
    try {
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        cart = [];
    }
    
    try {
        const savedWishlist = localStorage.getItem('wishlist');
        wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        wishlist = [];
    }
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Initialize all features
    initContactForm();
    initFAQs();
    initTheme();
    initSidebars();
    initAnimations();
    
    // Cart Side Bar Navigation
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueShopping = document.querySelector('.continue-shopping');
    const overlay = document.getElementById('overlay');
    
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
    
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }
    
    // Wishlist Sidebar Navigation
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    
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
    
    // Close sidebars when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            cartSidebar.style.right = '-400px';
            wishlistSidebar.style.right = '-400px';
            
            // Close the success modal if it's open
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'none';
            }
            
            overlay.style.display = 'none';
        });
    }
    
    // Mobile menu functionality
    const menuIcon = document.getElementById('menuIcon');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    
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
    
    // Search functionality
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Helper Functions
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Add pulse animation
            cartCount.style.animation = 'cartCountPulse 0.5s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
    }
    
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
            
            // Add pulse animation
            wishlistCount.style.animation = 'cartCountPulse 0.5s ease';
            setTimeout(() => {
                wishlistCount.style.animation = '';
            }, 500);
        }
    }
    
    function updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartShipping = document.querySelector('.cart-shipping');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (!cartItems || !cartTotal || !cartSubtotal || !cartShipping) return;
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn secondary-btn">Start Shopping</a>
                </div>
            `;
            
            cartSubtotal.textContent = '৳0.00';
            cartShipping.textContent = '৳0.00';
            cartTotal.textContent = '৳0.00';
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }
        } else {
            // Clear cart items
            cartItems.innerHTML = '';
            
            // Add each cart item
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
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners
                setupCartItemEventListeners(cartItem, item.id);
            });
            
            // Calculate totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal > 5000 ? 0 : 150;
            const total = subtotal + shipping;
            
            cartSubtotal.textContent = `৳${subtotal.toLocaleString('en-IN')}`;
            cartShipping.textContent = shipping === 0 ? 'Free' : `৳${shipping.toLocaleString('en-IN')}`;
            cartTotal.textContent = `৳${total.toLocaleString('en-IN')}`;
            
            if (checkoutBtn) {
                checkoutBtn.style.display = 'block';
            }
        }
    }
    
    function setupCartItemEventListeners(cartItem, productId) {
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const removeBtn = cartItem.querySelector('.remove-item');
        const quantityInput = cartItem.querySelector('input');
        
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateCartItemQuantity(productId, currentValue - 1);
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
                updateCartItemQuantity(productId, currentValue + 1);
            }
        });
        
        removeBtn.addEventListener('click', () => {
            removeFromCart(productId);
        });
        
        quantityInput.addEventListener('change', () => {
            let newValue = parseInt(quantityInput.value);
            if (isNaN(newValue) || newValue < 1) newValue = 1;
            if (newValue > 10) newValue = 10;
            
            quantityInput.value = newValue;
            updateCartItemQuantity(productId, newValue);
        });
    }
    
    function updateCartItemQuantity(productId, quantity) {
        // Find item in cart
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity = quantity;
            
            // Update UI
            const cartItemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            const priceElement = cartItemElement.querySelector('.cart-item-price');
            
            // Format with ৳ symbol
            priceElement.textContent = `৳${(cartItem.price * quantity).toLocaleString('en-IN')}`;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart total and count
            updateCartUI();
            updateCartCount();
        }
    }
    
    function removeFromCart(productId) {
        // Find item index in cart
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            // Remove from cart array
            cart.splice(itemIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartUI();
            
            // Show notification
            showNotification(`Removed ${removedItem.name} from cart`, 'info');
        }
    }
    
    function updateWishlistUI() {
        const wishlistItems = document.querySelector('.wishlist-items');
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        
        if (!wishlistItems || !clearWishlistBtn) return;
        
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
            
            clearWishlistBtn.style.display = 'none';
        } else {
            // Clear wishlist items
            wishlistItems.innerHTML = '';
            
            // Add each wishlist item
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
                        <button class="move-to-cart"><i class="fas fa-shopping-cart"></i></button>
                        <button class="remove-from-wishlist"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                wishlistItems.appendChild(wishlistItem);
                
                // Add event listeners
                setupWishlistItemEventListeners(wishlistItem, item);
            });
            
            clearWishlistBtn.style.display = 'block';
        }
    }
    
    function setupWishlistItemEventListeners(wishlistItem, item) {
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
        });
        
        removeBtn.addEventListener('click', () => {
            removeFromWishlist(item.id);
        });
    }
    
    function addItemToCart(product) {
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartUI();
        
        // Show cart sidebar
        cartSidebar.style.right = '0';
        wishlistSidebar.style.right = '-400px';
        overlay.style.display = 'block';
        
        // Show notification
        showNotification(`Added ${product.name} to cart`, 'success');
    }
    
    function removeFromWishlist(productId) {
        // Find item index in wishlist
        const itemIndex = wishlist.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = wishlist[itemIndex];
            // Remove from wishlist array
            wishlist.splice(itemIndex, 1);
            
            // Save to localStorage
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
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount();
        updateWishlistUI();
        
        // Show notification
        showNotification('Wishlist cleared', 'info');
    }
    
    // Initialize Theme Toggle
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            // Check for saved theme preference or default to light mode
            const savedTheme = localStorage.getItem('technest-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
            
            // Theme toggle click handler
            themeToggle.addEventListener('click', toggleTheme);
            
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
        const themeToggle = document.getElementById('themeToggle');
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
    }
    
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
    }
    
    function updateThemeToggleIcon(isDarkMode) {
        const themeToggle = document.getElementById('themeToggle');
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
    
    // Initialize Sidebars
    function initSidebars() {
        // Clear wishlist button functionality
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', clearWishlist);
        }
    }
    
    // Initialize Contact Form
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const successModal = document.getElementById('successModal');
        const closeSuccessBtn = document.querySelector('.close-success-btn');
        const sendAnotherBtn = document.querySelector('.send-another-btn');
        const closeModal = document.querySelector('.close-modal');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmit();
            });
            
            // Reset button functionality
            const resetBtn = contactForm.querySelector('.reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    contactForm.reset();
                    clearFormErrors();
                    showNotification('Form has been reset', 'info');
                });
            }
        }
        
        // Success modal event listeners
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', closeSuccessModal);
        }
        
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', () => {
                closeSuccessModal();
                contactForm.reset();
                clearFormErrors();
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', closeSuccessModal);
        }
        
        // Setup form validation using FormUtils
        if (window.FormUtils) {
            const validationRules = {
                name: [
                    { type: 'required', message: 'Full name is required' },
                    { type: 'name', message: 'Please enter a valid name (letters only)' }
                ],
                email: [
                    { type: 'required', message: 'Email address is required' },
                    { type: 'email', message: 'Please enter a valid email address' }
                ],
                phone: [
                    { type: 'phone', message: 'Please enter a valid phone number (optional)' }
                ],
                subject: [
                    { type: 'required', message: 'Please select a subject' }
                ],
                message: [
                    { type: 'required', message: 'Message is required' },
                    { type: 'minLength', value: 10, message: 'Message must be at least 10 characters long' },
                    { type: 'maxLength', value: 500, message: 'Message cannot exceed 500 characters' }
                ]
            };
            
            // Setup real-time validation
            window.FormUtils.setupRealTimeValidation(contactForm, validationRules);
        } else {
            // Fallback to existing validation
            const formInputs = contactForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
        }
        
        function handleFormSubmit() {
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            showLoadingState(submitBtn, true);
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            // Simulate form submission (in real app, this would be an API call)
            setTimeout(() => {
                // Hide loading state
                showLoadingState(submitBtn, false);
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                
                // Log form data (in real app, send to server)
                console.log('Form submitted:', formData);
                
                // Show success modal
                if (successModal) {
                    successModal.style.display = 'block';
                    overlay.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    clearFormErrors();
                }
                
                // Show success notification
                showNotification('Message sent successfully!', 'success');
            }, 2000);
        }
        
        function validateForm(formData) {
            if (window.FormUtils) {
                // Use new validation utilities
                const validationRules = {
                    name: [
                        { type: 'required', message: 'Full name is required' },
                        { type: 'name', message: 'Please enter a valid name (letters only)' }
                    ],
                    email: [
                        { type: 'required', message: 'Email address is required' },
                        { type: 'email', message: 'Please enter a valid email address' }
                    ],
                    phone: [
                        { type: 'phone', message: 'Please enter a valid phone number (optional)' }
                    ],
                    subject: [
                        { type: 'required', message: 'Please select a subject' }
                    ],
                    message: [
                        { type: 'required', message: 'Message is required' },
                        { type: 'minLength', value: 10, message: 'Message must be at least 10 characters long' },
                        { type: 'maxLength', value: 500, message: 'Message cannot exceed 500 characters' }
                    ]
                };
                
                const validation = window.FormUtils.validateForm(contactForm, validationRules);
                return validation.isValid;
            } else {
                // Fallback to existing validation
                return validateFormFallback(formData);
            }
        }
        
        function validateFormFallback(formData) {
            let isValid = true;
            
            // Clear previous errors
            clearFormErrors();
            
            // Required field validation
            if (!formData.name) {
                showFieldError('name', 'Full name is required');
                isValid = false;
            }
            
            if (!formData.email) {
                showFieldError('email', 'Email address is required');
                isValid = false;
            } else if (!isValidEmail(formData.email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!formData.subject) {
                showFieldError('subject', 'Please select a subject');
                isValid = false;
            }
            
            if (!formData.message) {
                showFieldError('message', 'Message is required');
                isValid = false;
            } else if (formData.message.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
                isValid = false;
            }
            
            // Phone validation (optional but if provided, should be valid)
            if (formData.phone && !isValidPhone(formData.phone)) {
                showFieldError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            return isValid;
        }
        
        function validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            
            switch (fieldName) {
                case 'name':
                    if (!value) {
                        showFieldError('name', 'Full name is required');
                        return false;
                    }
                    break;
                    
                case 'email':
                    if (!value) {
                        showFieldError('email', 'Email address is required');
                        return false;
                    } else if (!isValidEmail(value)) {
                        showFieldError('email', 'Please enter a valid email address');
                        return false;
                    }
                    break;
                    
                case 'phone':
                    if (value && !isValidPhone(value)) {
                        showFieldError('phone', 'Please enter a valid phone number');
                        return false;
                    }
                    break;
                    
                case 'subject':
                    if (!value) {
                        showFieldError('subject', 'Please select a subject');
                        return false;
                    }
                    break;
                    
                case 'message':
                    if (!value) {
                        showFieldError('message', 'Message is required');
                        return false;
                    } else if (value.length < 10) {
                        showFieldError('message', 'Message must be at least 10 characters long');
                        return false;
                    }
                    break;
            }
            
            clearFieldError(field);
            return true;
        }
        
        function showFieldError(fieldName, message) {
            const field = document.getElementById(fieldName);
            const inputWrapper = field.closest('.input-wrapper');
            
            // Add error class
            inputWrapper.classList.add('error');
            
            // Remove existing error message
            const existingError = inputWrapper.nextElementSibling?.classList.contains('error-message') 
                ? inputWrapper.nextElementSibling 
                : null;
            if (existingError) {
                existingError.remove();
            }
            
            // Add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            inputWrapper.insertAdjacentElement('afterend', errorElement);
        }
        
        function clearFieldError(field) {
            const inputWrapper = field.closest('.input-wrapper');
            inputWrapper.classList.remove('error');
            
            const errorMessage = inputWrapper.nextElementSibling?.classList.contains('error-message') 
                ? inputWrapper.nextElementSibling 
                : null;
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        function clearFormErrors() {
            const errorMessages = contactForm.querySelectorAll('.error-message');
            const errorInputs = contactForm.querySelectorAll('.input-wrapper.error');
            
            errorMessages.forEach(msg => msg.remove());
            errorInputs.forEach(input => input.classList.remove('error'));
        }
        
        function showLoadingState(button, isLoading) {
            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        }
        
        function closeSuccessModal() {
            if (successModal) {
                successModal.style.display = 'none';
                overlay.style.display = 'none';
            }
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidPhone(phone) {
            // Supports various phone formats including Bangladeshi numbers
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            return phoneRegex.test(phone);
        }
    }
    
    // Initialize FAQs
    function initFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
        const faqCategories = document.querySelectorAll('.faq-category-content');
        
        // FAQ item toggle functionality
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items in the same category
                const currentCategory = item.closest('.faq-category-content');
                const siblingItems = currentCategory.querySelectorAll('.faq-item');
                
                siblingItems.forEach(siblingItem => {
                    if (siblingItem !== item) {
                        siblingItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
                
                // Smooth scroll to item if opening
                if (!isActive) {
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 100);
                }
            });
        });
        
        // FAQ category switching
        faqCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                faqCategoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding category content
                faqCategories.forEach(cat => {
                    cat.classList.remove('active');
                    if (cat.dataset.category === category) {
                        cat.classList.add('active');
                    }
                });
                
                // Close all open FAQ items in the new category
                const newCategoryItems = document.querySelectorAll(`.faq-category-content[data-category="${category}"] .faq-item`);
                newCategoryItems.forEach(item => {
                    item.classList.remove('active');
                });
            });
        });
    }
    
    // Initialize Animations
    function initAnimations() {
        // Simple animation observer for elements with data-aos attributes
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
        
        // Observe elements with animation attributes
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            
            // Add delay if specified
            const delay = el.dataset.aosDelay;
            if (delay) {
                el.style.transitionDelay = delay + 'ms';
            }
            
            observer.observe(el);
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        // Close mobile menu if open
                        if (window.innerWidth <= 768 && navLinks) {
                            navLinks.style.right = '-300px';
                            overlay.style.display = 'none';
                        }
                        
                        // Close sidebars
                        if (cartSidebar) cartSidebar.style.right = '-400px';
                        if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
                        
                        // Smooth scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Show notification function
    function showNotification(message, type = 'success') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon = 'fa-check-circle';
        if (type === 'info') icon = 'fa-info-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Position notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.backgroundColor = 'var(--card-color)';
        notification.style.color = 'var(--text-color)';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        notification.style.maxWidth = '350px';
        notification.style.border = `1px solid var(--border-color)`;
        notification.style.borderLeft = `4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}-color)`;
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Trigger slide in animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Style notification content
        const content = notification.querySelector('.notification-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.gap = '10px';
        
        const notificationIcon = notification.querySelector('.notification-content i');
        notificationIcon.style.fontSize = '18px';
        notificationIcon.style.color = `var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}-color)`;
        
        // Style close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'var(--text-light)';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginLeft = '15px';
        closeButton.style.transition = 'color 0.3s ease';
        
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.color = 'var(--text-color)';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.color = 'var(--text-light)';
        });
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Add error styles for form validation
    const style = document.createElement('style');
    style.textContent = `
        .input-wrapper.error input,
        .input-wrapper.error select,
        .input-wrapper.error textarea {
            border-color: var(--danger-color);
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }
        
        .input-wrapper.error i {
            color: var(--danger-color);
        }
        
        .error-message {
            color: var(--danger-color);
            font-size: 13px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
            animation: slideInError 0.3s ease;
        }
        
        .error-message::before {
            content: "⚠";
            font-size: 14px;
        }
        
        @keyframes slideInError {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes cartCountPulse {
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
    
    console.log('Contact page initialized successfully');
});