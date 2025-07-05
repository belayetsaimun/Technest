/**
 * Performance and Event Management Utilities
 * Helps prevent memory leaks and optimize DOM operations
 */

window.PerformanceUtils = {
    // Store event listeners for cleanup
    eventListeners: new Map(),
    
    // Optimized DOM query cache
    domCache: new Map(),
    
    // Add event listener with cleanup tracking
    addEventListener(element, event, handler, options = {}) {
        if (!element) return;
        
        // Create unique key for this listener
        const key = `${element.tagName}-${element.className}-${event}-${Date.now()}`;
        
        // Add event listener
        element.addEventListener(event, handler, options);
        
        // Store for cleanup
        this.eventListeners.set(key, {
            element,
            event,
            handler,
            options
        });
        
        return key;
    },
    
    // Remove specific event listener
    removeEventListener(key) {
        const listener = this.eventListeners.get(key);
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
            this.eventListeners.delete(key);
        }
    },
    
    // Clean up all event listeners for a specific element
    cleanupElementListeners(element) {
        for (const [key, listener] of this.eventListeners.entries()) {
            if (listener.element === element) {
                this.removeEventListener(key);
            }
        }
    },
    
    // Clean up all tracked event listeners
    cleanupAllListeners() {
        for (const [key] of this.eventListeners.entries()) {
            this.removeEventListener(key);
        }
    },
    
    // Cached DOM query
    querySelector(selector, forceRefresh = false) {
        if (!forceRefresh && this.domCache.has(selector)) {
            return this.domCache.get(selector);
        }
        
        const element = document.querySelector(selector);
        this.domCache.set(selector, element);
        return element;
    },
    
    // Cached DOM query all
    querySelectorAll(selector, forceRefresh = false) {
        if (!forceRefresh && this.domCache.has(selector)) {
            return this.domCache.get(selector);
        }
        
        const elements = document.querySelectorAll(selector);
        this.domCache.set(selector, elements);
        return elements;
    },
    
    // Clear DOM cache
    clearDOMCache() {
        this.domCache.clear();
    },
    
    // Debounce function to limit rapid function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function to limit function calls
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    // Optimize scroll performance
    optimizeScrollEvents(callback, delay = 16) {
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    callback();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        return this.addEventListener(window, 'scroll', scrollHandler, { passive: true });
    },
    
    // Preload critical resources
    preloadResource(url, type = 'fetch') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        
        switch (type) {
            case 'script':
                link.as = 'script';
                break;
            case 'style':
                link.as = 'style';
                break;
            case 'image':
                link.as = 'image';
                break;
            default:
                link.as = 'fetch';
                link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
    },
    
    // Monitor performance
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
        return result;
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Cleanup on page unload
    init() {
        // Clean up when page unloads
        this.addEventListener(window, 'beforeunload', () => {
            this.cleanupAllListeners();
            this.clearDOMCache();
        });
        
        // Initialize lazy loading
        if ('IntersectionObserver' in window) {
            this.lazyLoadImages();
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PerformanceUtils.init();
    });
} else {
    window.PerformanceUtils.init();
}