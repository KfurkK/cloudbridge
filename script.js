// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

// Form validation function
function validateForm() {
    let isValid = true;
    const fields = [
        { id: 'name', name: 'Full Name', type: 'text' },
        { id: 'email', name: 'Email Address', type: 'email' },
        { id: 'company', name: 'Company Name', type: 'text' },
        { id: 'employees', name: 'Number of Employees', type: 'select' },
        { id: 'message', name: 'Message', type: 'textarea' }
    ];

    // Clear all previous errors
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);
        
        element.classList.remove('error', 'success');
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    });

    // Validate each field
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const errorElement = document.getElementById(`${field.id}-error`);
        const value = element.value.trim();

        // Check if field is empty
        if (!value) {
            element.classList.add('error');
            errorElement.textContent = `${field.name} is required`;
            errorElement.classList.add('show');
            isValid = false;
            return;
        }

        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                element.classList.add('error');
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.classList.add('show');
                isValid = false;
                return;
            }
        }

        // Message length validation
        if (field.type === 'textarea' && value.length < 10) {
            element.classList.add('error');
            errorElement.textContent = 'Message must be at least 10 characters long';
            errorElement.classList.add('show');
            isValid = false;
            return;
        }

        // If field is valid, add success class
        element.classList.add('success');
    });

    return isValid;
}

// Real-time validation
function setupRealTimeValidation() {
    const fields = ['name', 'email', 'company', 'employees', 'message'];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        element.addEventListener('blur', function() {
            const value = this.value.trim();
            
            // Clear previous states
            this.classList.remove('error', 'success');
            errorElement.classList.remove('show');
            errorElement.textContent = '';
            
            // Validate on blur
            if (!value) {
                this.classList.add('error');
                errorElement.textContent = `${this.previousElementSibling.textContent.replace(' *', '')} is required`;
                errorElement.classList.add('show');
            } else {
                // Email validation
                if (fieldId === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        this.classList.add('error');
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.classList.add('show');
                    } else {
                        this.classList.add('success');
                    }
                } else if (fieldId === 'message' && value.length < 10) {
                    this.classList.add('error');
                    errorElement.textContent = 'Message must be at least 10 characters long';
                    errorElement.classList.add('show');
                } else {
                    this.classList.add('success');
                }
            }
        });
        
        element.addEventListener('input', function() {
            const value = this.value.trim();
            
            // Clear error on input if field becomes valid
            if (value) {
                if (fieldId === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(value)) {
                        this.classList.remove('error');
                        this.classList.add('success');
                        errorElement.classList.remove('show');
                    }
                } else if (fieldId === 'message' && value.length >= 10) {
                    this.classList.remove('error');
                    this.classList.add('success');
                    errorElement.classList.remove('show');
                } else if (fieldId !== 'email' && fieldId !== 'message') {
                    this.classList.remove('error');
                    this.classList.add('success');
                    errorElement.classList.remove('show');
                }
            }
        });
    });
}

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Get submit button and disable it
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = new FormData(this);
    
    // Submit to Formspree
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            this.reset();
            
            // Clear all validation states after successful submission
            const fields = ['name', 'email', 'company', 'employees', 'message'];
            fields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                const errorElement = document.getElementById(`${fieldId}-error`);
                element.classList.remove('error', 'success');
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            });
        } else {
            throw new Error('Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or contact us directly at kuntindustries@gmail.com', 'error');
    })
    .finally(() => {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
});

// Initialize real-time validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeValidation();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .step, .pricing-card');
    animateElements.forEach(el => observer.observe(el));
});

// Store original button text for form buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.setAttribute('data-original-text', button.innerHTML);
});

// Pricing card hover effects
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('featured')) {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('featured')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Feature card animations
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats panel
const statsPanel = document.querySelector('.stats-panel');
if (statsPanel) {
    statsObserver.observe(statsPanel);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Form validation
document.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        } else {
            this.style.borderColor = '#d1d5db';
            this.style.boxShadow = 'none';
        }
    });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'CloudBridge';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 2rem;
        font-weight: 700;
        z-index: 10000;
        animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(loadingStyle);
