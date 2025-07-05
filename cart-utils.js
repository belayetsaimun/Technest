/**
 * Shared Cart Utilities
 * Common functions for cart management across all pages
 */

// Configuration
const CART_CONFIG = {
    FREE_SHIPPING_THRESHOLD: 5000,
    SHIPPING_COST: 150,
    MAX_QUANTITY: 10,
    CURRENCY_SYMBOL: '৳'
};

// Common cart functions
window.CartUtils = {
    // Get cart from localStorage
    getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Error reading cart from localStorage:', error);
            return [];
        }
    },

    // Save cart to localStorage
    saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    },

    // Calculate shipping cost
    calculateShipping(subtotal) {
        return subtotal > CART_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CART_CONFIG.SHIPPING_COST;
    },

    // Format currency
    formatCurrency(amount) {
        return `${CART_CONFIG.CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
    },

    // Calculate cart totals
    calculateTotals(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.calculateShipping(subtotal);
        const total = subtotal + shipping;

        return {
            subtotal,
            shipping,
            total,
            isShippingFree: shipping === 0
        };
    },

    // Update cart count display
    updateCartCount(cart) {
        const cartCountElements = document.querySelectorAll('.cart-count, #header-cart-count');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = count;
                element.style.animation = 'cartCountPulse 0.5s ease';
            }
        });
    },

    // Common empty cart HTML
    getEmptyCartHTML(linkUrl = 'products.html', linkText = 'Start Shopping') {
        return `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>Your cart is empty</p>
                <a href="${linkUrl}" class="btn secondary-btn">${linkText}</a>
            </div>
        `;
    },

    // Create cart item HTML
    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${this.formatCurrency(item.price * item.quantity)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <input type="number" value="${item.quantity}" min="1" max="${CART_CONFIG.MAX_QUANTITY}">
                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            </div>
        `;
    },

    // Update cart item quantity
    updateCartItemQuantity(cart, productId, quantity) {
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem && quantity >= 1 && quantity <= CART_CONFIG.MAX_QUANTITY) {
            cartItem.quantity = quantity;
            this.saveCart(cart);
            return true;
        }
        
        return false;
    },

    // Remove item from cart
    removeFromCart(cart, productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            this.saveCart(cart);
            return removedItem;
        }
        
        return null;
    },

    // Add item to cart
    addToCart(cart, item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            if (existingItem.quantity < CART_CONFIG.MAX_QUANTITY) {
                existingItem.quantity += item.quantity || 1;
                this.saveCart(cart);
                return true;
            }
            return false; // Max quantity reached
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity || 1
            });
            this.saveCart(cart);
            return true;
        }
    },

    // Setup cart item event listeners
    setupCartItemEventListeners(cartItemElement, cart, updateUICallback) {
        const productId = cartItemElement.dataset.id;
        const minusBtn = cartItemElement.querySelector('.minus');
        const plusBtn = cartItemElement.querySelector('.plus');
        const removeBtn = cartItemElement.querySelector('.remove-item');
        const input = cartItemElement.querySelector('input');

        // Minus button
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    const newValue = currentValue - 1;
                    input.value = newValue;
                    this.updateCartItemQuantity(cart, productId, newValue);
                    if (updateUICallback) updateUICallback();
                }
            });
        }

        // Plus button
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < CART_CONFIG.MAX_QUANTITY) {
                    const newValue = currentValue + 1;
                    input.value = newValue;
                    this.updateCartItemQuantity(cart, productId, newValue);
                    if (updateUICallback) updateUICallback();
                }
            });
        }

        // Input change
        if (input) {
            input.addEventListener('change', () => {
                let newValue = parseInt(input.value);
                if (isNaN(newValue) || newValue < 1) newValue = 1;
                if (newValue > CART_CONFIG.MAX_QUANTITY) newValue = CART_CONFIG.MAX_QUANTITY;
                
                input.value = newValue;
                this.updateCartItemQuantity(cart, productId, newValue);
                if (updateUICallback) updateUICallback();
            });
        }

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeFromCart(cart, productId);
                if (updateUICallback) updateUICallback();
            });
        }
    }
};