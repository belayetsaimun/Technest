/**
 * Form Validation Utilities
 * Common validation functions for forms across the website
 */

window.FormUtils = {
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Phone validation (Bangladesh format)
    isValidPhone(phone) {
        const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Name validation (no numbers or special characters)
    isValidName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    },

    // Generic required field validation
    isRequired(value) {
        return value && value.trim().length > 0;
    },

    // Quantity validation
    isValidQuantity(quantity, min = 1, max = 10) {
        const qty = parseInt(quantity);
        return !isNaN(qty) && qty >= min && qty <= max;
    },

    // Show validation error
    showFieldError(field, message) {
        const inputGroup = field.closest('.input-group') || field.parentElement;
        const existingError = inputGroup.querySelector('.validation-message');
        
        // Remove existing error
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class
        inputGroup.classList.add('error');
        field.classList.add('error');
        
        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'validation-message';
        errorMessage.textContent = message;
        
        // Insert after input group or field
        inputGroup.insertAdjacentElement('afterend', errorMessage);
    },

    // Clear field error
    clearFieldError(field) {
        const inputGroup = field.closest('.input-group') || field.parentElement;
        const errorMessage = inputGroup.nextElementSibling;
        
        // Remove error class
        inputGroup.classList.remove('error');
        field.classList.remove('error');
        
        // Remove error message
        if (errorMessage && errorMessage.classList.contains('validation-message')) {
            errorMessage.remove();
        }
    },

    // Validate form
    validateForm(form, rules) {
        let isValid = true;
        const errors = [];

        for (const fieldName in rules) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;

            const value = field.value;
            const fieldRules = rules[fieldName];

            // Clear previous errors
            this.clearFieldError(field);

            // Check each rule
            for (const rule of fieldRules) {
                if (rule.type === 'required' && !this.isRequired(value)) {
                    this.showFieldError(field, rule.message || 'This field is required');
                    isValid = false;
                    errors.push(rule.message || 'This field is required');
                    break;
                } else if (rule.type === 'email' && value && !this.isValidEmail(value)) {
                    this.showFieldError(field, rule.message || 'Please enter a valid email address');
                    isValid = false;
                    errors.push(rule.message || 'Please enter a valid email address');
                    break;
                } else if (rule.type === 'phone' && value && !this.isValidPhone(value)) {
                    this.showFieldError(field, rule.message || 'Please enter a valid phone number');
                    isValid = false;
                    errors.push(rule.message || 'Please enter a valid phone number');
                    break;
                } else if (rule.type === 'name' && value && !this.isValidName(value)) {
                    this.showFieldError(field, rule.message || 'Please enter a valid name');
                    isValid = false;
                    errors.push(rule.message || 'Please enter a valid name');
                    break;
                } else if (rule.type === 'minLength' && value && value.length < rule.value) {
                    this.showFieldError(field, rule.message || `Minimum ${rule.value} characters required`);
                    isValid = false;
                    errors.push(rule.message || `Minimum ${rule.value} characters required`);
                    break;
                } else if (rule.type === 'maxLength' && value && value.length > rule.value) {
                    this.showFieldError(field, rule.message || `Maximum ${rule.value} characters allowed`);
                    isValid = false;
                    errors.push(rule.message || `Maximum ${rule.value} characters allowed`);
                    break;
                }
            }
        }

        return {
            isValid,
            errors
        };
    },

    // Real-time validation setup
    setupRealTimeValidation(form, rules) {
        for (const fieldName in rules) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;

            field.addEventListener('blur', () => {
                const fieldRules = rules[fieldName];
                const value = field.value;

                this.clearFieldError(field);

                for (const rule of fieldRules) {
                    if (rule.type === 'required' && !this.isRequired(value)) {
                        this.showFieldError(field, rule.message || 'This field is required');
                        break;
                    } else if (rule.type === 'email' && value && !this.isValidEmail(value)) {
                        this.showFieldError(field, rule.message || 'Please enter a valid email address');
                        break;
                    } else if (rule.type === 'phone' && value && !this.isValidPhone(value)) {
                        this.showFieldError(field, rule.message || 'Please enter a valid phone number');
                        break;
                    } else if (rule.type === 'name' && value && !this.isValidName(value)) {
                        this.showFieldError(field, rule.message || 'Please enter a valid name');
                        break;
                    }
                }
            });

            // Clear error on input
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.clearFieldError(field);
                }
            });
        }
    }
};