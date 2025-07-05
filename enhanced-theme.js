// Enhanced Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.currentVariant = 'default';
        this.autoThemeEnabled = false;
        this.themeToggle = null;
        this.themeSelector = null;
        this.autoThemeCheckbox = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }
    
    initializeElements() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeSelector = document.getElementById('themeSelector');
        this.autoThemeCheckbox = document.getElementById('autoTheme');
        
        if (!this.themeToggle) return;
        
        // Load saved preferences
        this.loadSavedPreferences();
        
        // Initialize theme based on saved preference or system preference
        this.initializeTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Initialize auto theme if enabled
        if (this.autoThemeEnabled) {
            this.enableAutoTheme();
        }
    }
    
    loadSavedPreferences() {
        const savedTheme = localStorage.getItem('technest-theme');
        const savedVariant = localStorage.getItem('technest-theme-variant') || 'default';
        const autoTheme = localStorage.getItem('technest-auto-theme') === 'true';
        
        this.currentTheme = savedTheme || (this.getSystemPreference() ? 'dark' : 'light');
        this.currentVariant = savedVariant;
        this.autoThemeEnabled = autoTheme;
        
        if (this.autoThemeCheckbox) {
            this.autoThemeCheckbox.checked = autoTheme;
        }
    }
    
    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        return (hour >= 18 || hour <= 6) ? 'dark' : 'light';
    }
    
    initializeTheme() {
        if (this.autoThemeEnabled) {
            this.currentTheme = this.getTimeBasedTheme();
        }
        
        this.applyTheme(this.currentTheme, this.currentVariant);
        this.updateActiveThemeOption();
    }
    
    setupEventListeners() {
        // Theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            
            // Show/hide theme selector on long press
            let longPressTimer;
            this.themeToggle.addEventListener('mousedown', () => {
                longPressTimer = setTimeout(() => this.showThemeSelector(), 500);
            });
            this.themeToggle.addEventListener('mouseup', () => clearTimeout(longPressTimer));
            this.themeToggle.addEventListener('mouseleave', () => clearTimeout(longPressTimer));
            
            // Right click to show theme selector
            this.themeToggle.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.toggleThemeSelector();
            });
        }
        
        // Theme variant options
        if (this.themeSelector) {
            const themeOptions = this.themeSelector.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const variant = option.dataset.theme;
                    this.setThemeVariant(variant);
                });
            });
            
            // Click outside to hide
            document.addEventListener('click', (e) => {
                if (!this.themeToggle.contains(e.target) && !this.themeSelector.contains(e.target)) {
                    this.hideThemeSelector();
                }
            });
        }
        
        // Auto theme checkbox
        if (this.autoThemeCheckbox) {
            this.autoThemeCheckbox.addEventListener('change', (e) => {
                this.toggleAutoTheme(e.target.checked);
            });
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('technest-theme') && !this.autoThemeEnabled) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+T to toggle theme
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Ctrl+Shift+V to show theme variants
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                this.toggleThemeSelector();
            }
        });
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add animation to the toggle button
        if (this.themeToggle) {
            this.themeToggle.style.animation = 'themeSwitch 0.6s ease';
            setTimeout(() => {
                this.themeToggle.style.animation = '';
            }, 600);
        }
        
        // Show notification
        this.showNotification(`Switched to ${newTheme} mode`, 'success');
    }
    
    setTheme(theme, variant = this.currentVariant) {
        this.currentTheme = theme;
        this.currentVariant = variant;
        
        this.applyTheme(theme, variant);
        this.savePreferences();
    }
    
    setThemeVariant(variant) {
        this.currentVariant = variant;
        
        if (this.currentTheme === 'dark') {
            this.applyTheme('dark', variant);
        }
        
        this.updateActiveThemeOption();
        this.savePreferences();
        this.showNotification(`Applied ${variant} theme variant`, 'info');
    }
    
    applyTheme(theme, variant = 'default') {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('dark-mode', 'blue-theme', 'purple-theme', 'green-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            
            // Add variant class
            if (variant !== 'default') {
                body.classList.add(`${variant}-theme`);
            }
        }
        
        // Update toggle icon and tooltip
        this.updateThemeToggleIcon(theme === 'dark');
        
        // Add smooth transition for the first load
        if (!body.style.transition) {
            body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        }
    }
    
    updateThemeToggleIcon(isDarkMode) {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        const tooltip = this.themeToggle.querySelector('.toggle-tooltip');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            if (tooltip) tooltip.textContent = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            if (tooltip) tooltip.textContent = 'Switch to Dark Mode';
        }
    }
    
    updateActiveThemeOption() {
        if (!this.themeSelector) return;
        
        const options = this.themeSelector.querySelectorAll('.theme-option');
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentVariant);
        });
    }
    
    showThemeSelector() {
        if (this.themeSelector) {
            this.themeSelector.classList.add('show');
        }
    }
    
    hideThemeSelector() {
        if (this.themeSelector) {
            this.themeSelector.classList.remove('show');
        }
    }
    
    toggleThemeSelector() {
        if (this.themeSelector) {
            this.themeSelector.classList.toggle('show');
        }
    }
    
    toggleAutoTheme(enabled) {
        this.autoThemeEnabled = enabled;
        
        if (enabled) {
            this.enableAutoTheme();
            this.showNotification('Auto theme enabled - changes based on time', 'info');
        } else {
            this.disableAutoTheme();
            this.showNotification('Auto theme disabled', 'info');
        }
        
        this.savePreferences();
    }
    
    enableAutoTheme() {
        this.autoThemeEnabled = true;
        
        // Set initial theme based on time
        const timeBasedTheme = this.getTimeBasedTheme();
        this.setTheme(timeBasedTheme);
        
        // Check every hour
        this.autoThemeInterval = setInterval(() => {
            const newTheme = this.getTimeBasedTheme();
            if (newTheme !== this.currentTheme) {
                this.setTheme(newTheme);
                this.showNotification(`Auto-switched to ${newTheme} mode`, 'info');
            }
        }, 60000 * 60); // Check every hour
    }
    
    disableAutoTheme() {
        this.autoThemeEnabled = false;
        
        if (this.autoThemeInterval) {
            clearInterval(this.autoThemeInterval);
        }
    }
    
    savePreferences() {
        localStorage.setItem('technest-theme', this.currentTheme);
        localStorage.setItem('technest-theme-variant', this.currentVariant);
        localStorage.setItem('technest-auto-theme', this.autoThemeEnabled.toString());
    }
    
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }
        
        // Create simple notification
        const notification = document.createElement('div');
        notification.className = `theme-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-color);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--primary-color);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}