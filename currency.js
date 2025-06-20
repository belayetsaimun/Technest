/**
 * Currency Formatting Helper Functions
 * 
 * This file contains functions to work with currency values in the TechNest website.
 * All currency values are displayed in Bangladeshi Taka (BDT).
 */

// Format a number as Taka with proper thousands separator
function formatTaka(amount) {
    // Convert to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[৳,]/g, '')) : amount;
    
    // Add thousands separator and Taka symbol
    return `৳${numericAmount.toLocaleString('en-IN')}`;
}

// Convert any price displayed in $ to ৳ when the page loads
function convertPricesToTaka() {
    // Get all elements with price values
    const priceElements = document.querySelectorAll('.current-price, .old-price, .cart-item-price, .cart-total span:last-child');
    
    priceElements.forEach(element => {
        let text = element.textContent.trim();
        
        // Check if the price is in $ and convert to ৳
        if (text.includes('$')) {
            // Extract the numeric value
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            
            // Convert $ to ৳ (using an approximate conversion rate of 110)
            const takaValue = numericValue * 110;
            
            // Update the element text
            element.textContent = formatTaka(takaValue);
        }
        
        // If the price is already in Taka but needs formatting
        if (text.includes('৳')) {
            // Extract the numeric value
            const numericValue = parseFloat(text.replace(/[৳,]/g, ''));
            
            // Format with proper thousands separator
            element.textContent = formatTaka(numericValue);
        }
    });
}

// Update cart and wishlist calculations
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    if (!cartItems.length) return;
    
    let total = 0;
    
    cartItems.forEach(item => {
        const priceText = item.querySelector('.cart-item-price').textContent;
        const price = parseFloat(priceText.replace(/[৳,]/g, ''));
        total += price;
    });
    
    const cartTotal = document.querySelector('.cart-total span:last-child');
    if (cartTotal) {
        cartTotal.textContent = formatTaka(total);
    }
}

// Update quick view and buy now modals
function updateModalPrices() {
    // Quick view modal prices
    const quickViewCurrentPrice = document.querySelector('#quickViewModal .current-price');
    const quickViewOldPrice = document.querySelector('#quickViewModal .old-price');
    
    if (quickViewCurrentPrice) {
        const text = quickViewCurrentPrice.textContent;
        if (text.includes('$')) {
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            const takaValue = numericValue * 110;
            quickViewCurrentPrice.textContent = formatTaka(takaValue);
        }
    }
    
    if (quickViewOldPrice && quickViewOldPrice.style.display !== 'none') {
        const text = quickViewOldPrice.textContent;
        if (text.includes('$')) {
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            const takaValue = numericValue * 110;
            quickViewOldPrice.textContent = formatTaka(takaValue);
        }
    }
    
    // Buy now modal prices
    const buyNowPrice = document.querySelector('#buyNowModal .price');
    const buyNowProductPrice = document.querySelector('#buyNowModal .product-price');
    const buyNowProductTotal = document.querySelector('#buyNowModal .product-total');
    
    if (buyNowPrice) {
        const text = buyNowPrice.textContent;
        if (text.includes('$')) {
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            const takaValue = numericValue * 110;
            buyNowPrice.textContent = formatTaka(takaValue);
        }
    }
    
    if (buyNowProductPrice) {
        const text = buyNowProductPrice.textContent;
        if (text.includes('$')) {
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            const takaValue = numericValue * 110;
            buyNowProductPrice.textContent = formatTaka(takaValue);
        }
    }
    
    if (buyNowProductTotal) {
        const text = buyNowProductTotal.textContent;
        if (text.includes('$')) {
            const numericValue = parseFloat(text.replace(/[$,]/g, ''));
            const takaValue = numericValue * 110;
            buyNowProductTotal.textContent = formatTaka(takaValue);
        }
    }
}

// Execute on page load
document.addEventListener('DOMContentLoaded', function() {
    // Convert all prices to Taka format
    convertPricesToTaka();
    
    // Update totals
    updateCartTotal();
    
    // Check for modals that might be opened later
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-view') || e.target.closest('.buy-now-btn')) {
            // Wait for modal to populate
            setTimeout(updateModalPrices, 100);
        }
    });
});

// Add event listeners for cart updates
document.addEventListener('cart:updated', updateCartTotal);

// Export functions for use in other scripts
window.formatTaka = formatTaka;
window.convertPricesToTaka = convertPricesToTaka;
window.updateCartTotal = updateCartTotal;