document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Tab switching functionality with animation
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const tabsContainer = document.querySelector('.auth-tabs');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Add class to control indicator animation
            if (target === 'signup-form') {
                tabsContainer.classList.add('signup-active');
            } else {
                tabsContainer.classList.remove('signup-active');
            }
            
            // Show corresponding form with animation
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === target) {
                    // Small delay for smoother transition
                    setTimeout(() => {
                        form.classList.add('active');
                    }, 50);
                }
            });
        });
    });
    
    // Password toggle functionality with enhanced animation
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Add animation for the icon change
            button.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                // Change icon
                button.classList.toggle('fa-eye');
                button.classList.toggle('fa-eye-slash');
                button.style.transform = 'rotate(0)';
            }, 150);
        });
    });
    
    // Enhanced Password strength meter
    const passwordInput = document.getElementById('signup-password');
    const strengthSegments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Reset strength meter
        strengthSegments.forEach(segment => {
            segment.classList.remove('active', 'medium', 'strong');
        });
        
        if (password.length === 0) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ff6b6b';
            return;
        }
        
        // Enhanced password strength checking
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update strength meter with animation
        for (let i = 0; i < strength; i++) {
            setTimeout(() => {
                strengthSegments[i].classList.add('active');
                
                if (strength === 2) {
                    strengthSegments[i].classList.add('medium');
                } else if (strength >= 3) {
                    strengthSegments[i].classList.add('strong');
                }
            }, i * 100); // Staggered animation
        }
        
        // Update strength text with color transition
        setTimeout(() => {
            if (strength < 2) {
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#ff6b6b';
            } else if (strength === 2) {
                strengthText.textContent = 'Medium';
                strengthText.style.color = '#ffbb55';
            } else if (strength === 3) {
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#2ecc71';
            } else {
                strengthText.textContent = 'Very Strong';
                strengthText.style.color = '#2ecc71';
            }
        }, 100);
    }
    
    // Enhanced Form validation and submission
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Login form validation and submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const rememberCheck = document.getElementById('remember');
            
            // Simple validation
            let isValid = true;
            
            if (!validateEmail(emailInput.value)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            if (passwordInput.value.length < 6) {
                showInputError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearInputError(passwordInput);
            }
            
            if (!isValid) return;
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Here you would typically send the login data to your server
            const loginData = {
                email: emailInput.value,
                password: passwordInput.value,
                remember: rememberCheck.checked
            };
            
            console.log('Login attempt:', loginData);
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success notification
                showNotification('Login successful! Redirecting...', 'success');
                
                // Simulate redirect after login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1500);
        });
    }
    
    // Signup form validation and submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');
            const termsCheck = document.getElementById('terms');
            
            // Enhanced validation
            let isValid = true;
            
            if (nameInput.value.trim() === '') {
                showInputError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                clearInputError(nameInput);
            }
            
            if (!validateEmail(emailInput.value)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            if (passwordInput.value.length < 8) {
                showInputError(passwordInput, 'Password must be at least 8 characters');
                isValid = false;
            } else {
                clearInputError(passwordInput);
            }
            
            if (passwordInput.value !== confirmPasswordInput.value) {
                showInputError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            } else if (confirmPasswordInput.value.length > 0) {
                clearInputError(confirmPasswordInput);
            }
            
            if (!termsCheck.checked) {
                showNotification('Please agree to the Terms & Conditions', 'error');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Here you would typically send the signup data to your server
            const signupData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                termsAccepted: termsCheck.checked
            };
            
            console.log('Signup attempt:', signupData);
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success notification
                showNotification('Account created successfully! Redirecting...', 'success');
                
                // Simulate redirect after signup
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1500);
        });
    }
    
    // Helper functions for form validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showInputError(input, message) {
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.add('error');
        
        // Find or create validation message element
        let validationMessage = inputGroup.nextElementSibling;
        if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
            validationMessage = document.createElement('div');
            validationMessage.className = 'validation-message';
            inputGroup.parentNode.insertBefore(validationMessage, inputGroup.nextSibling);
        }
        
        validationMessage.textContent = message;
    }
    
    function clearInputError(input) {
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.remove('error');
        
        const validationMessage = inputGroup.nextElementSibling;
        if (validationMessage && validationMessage.classList.contains('validation-message')) {
            validationMessage.style.display = 'none';
        }
    }
    
    // Enhanced notification system
    function showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) return;
        
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        notificationContainer.appendChild(notification);
        
        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Initialize theme functionality
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('technest-theme');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.querySelector('i').className = 'fas fa-sun';
            themeToggle.querySelector('.toggle-tooltip').textContent = 'Switch to Light Mode';
        }
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('technest-theme', 'light');
                themeToggle.querySelector('i').className = 'fas fa-moon';
                themeToggle.querySelector('.toggle-tooltip').textContent = 'Switch to Dark Mode';
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('technest-theme', 'dark');
                themeToggle.querySelector('i').className = 'fas fa-sun';
                themeToggle.querySelector('.toggle-tooltip').textContent = 'Switch to Light Mode';
            }
            
            // Add animation to the toggle button
            themeToggle.classList.add('theme-toggle-animation');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-animation');
            }, 500);
        });
    }
    
    // Social login buttons functionality
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            
            // Show notification
            showNotification(`Signing in with ${provider}...`, 'info');
            
            // Here you would implement actual social login logic
            console.log(`Attempting to sign in with ${provider}`);
            
            // Simulate social login redirect
            setTimeout(() => {
                showNotification(`${provider} authentication successful! Redirecting...`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1500);
        });
    });

    // Mobile menu and cart/wishlist sidebar functionality
    const menuIcon = document.getElementById('menuIcon');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');

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

    // Cart Sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueShoppingBtn = document.querySelector('.continue-shopping');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.style.right = '0';
            overlay.style.display = 'block';
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

    // Wishlist Sidebar
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const closeWishlist = document.querySelector('.close-wishlist');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wishlistSidebar.style.right = '0';
            overlay.style.display = 'block';
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => {
            wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }

    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (navLinks) navLinks.style.right = '-300px';
            if (cartSidebar) cartSidebar.style.right = '-400px';
            if (wishlistSidebar) wishlistSidebar.style.right = '-400px';
            overlay.style.display = 'none';
        });
    }

    // Input animation
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', () => {
            const icon = input.previousElementSibling;
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // Initialize any cart count/wishlist count from localStorage
    updateCartWishlistCounts();

    function updateCartWishlistCounts() {
        // Update cart count
        try {
            const savedCart = localStorage.getItem('cart');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = cartCount;
            });
        } catch (e) {
            console.error('Error updating cart count:', e);
        }
        
        // Update wishlist count
        try {
            const savedWishlist = localStorage.getItem('wishlist');
            const wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
            
            document.querySelectorAll('.wishlist-count').forEach(el => {
                el.textContent = wishlist.length;
            });
        } catch (e) {
            console.error('Error updating wishlist count:', e);
        }
    }
});