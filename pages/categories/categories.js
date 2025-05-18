// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Set up header scroll effect
    setupHeaderScroll();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up category card hover effects
    setupCategoryCards();
    
    // Set up newsletter form
    setupNewsletterForm();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScroll();
    
    // Set up category filtering
    setupCategoryFiltering();
});

/**
 * Set up header background change on scroll
 */
function setupHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (!menuButton || !nav) return;
    
    menuButton.addEventListener('click', () => {
        // Create mobile menu if it doesn't exist
        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            // Clone the navigation items
            const navClone = nav.cloneNode(true);
            
            // Append to the mobile menu
            mobileMenu.appendChild(navClone);
            
            // Add styles to the mobile menu
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = '60px';
            mobileMenu.style.left = '0';
            mobileMenu.style.right = '0';
            mobileMenu.style.backgroundColor = 'var(--medium-bg)';
            mobileMenu.style.padding = '1rem';
            mobileMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            mobileMenu.style.zIndex = '999';
            mobileMenu.style.display = 'none';
            
            // Add styles to the list
            const list = mobileMenu.querySelector('ul');
            list.style.display = 'flex';
            list.style.flexDirection = 'column';
            list.style.gap = '1rem';
            
            // Append the mobile menu to the header
            document.querySelector('header').appendChild(mobileMenu);
        }
        
        // Toggle the mobile menu
        const mobileMenu = document.querySelector('.mobile-menu');
        const isVisible = mobileMenu.style.display === 'block';
        
        mobileMenu.style.display = isVisible ? 'none' : 'block';
        
        // Animate icon change
        if (isVisible) {
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            menuButton.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu) return;
        
        if (
            event.target !== menuButton && 
            !menuButton.contains(event.target) && 
            event.target !== mobileMenu &&
            !mobileMenu.contains(event.target) &&
            mobileMenu.style.display === 'block'
        ) {
            mobileMenu.style.display = 'none';
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

/**
 * Set up category card hover effects
 */
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        // Add hover class to featured articles on card hover
        card.addEventListener('mouseenter', () => {
            const featuredArticles = card.querySelector('.featured-articles');
            if (featuredArticles) {
                featuredArticles.style.transition = 'all 0.3s ease';
                featuredArticles.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const featuredArticles = card.querySelector('.featured-articles');
            if (featuredArticles) {
                featuredArticles.style.boxShadow = 'none';
            }
        });
        
        // Add animation to category button icon
        const categoryBtn = card.querySelector('.category-btn');
        if (categoryBtn) {
            categoryBtn.addEventListener('mouseenter', () => {
                const icon = categoryBtn.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(5px)';
                }
            });
            
            categoryBtn.addEventListener('mouseleave', () => {
                const icon = categoryBtn.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(0)';
                }
            });
        }
    });
}

/**
 * Set up newsletter form submission
 */
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage(form, 'Thank you for subscribing to our newsletter!', 'success');
            form.reset();
        }, 1000);
    });
    
    function showFormMessage(form, message, type) {
        // Remove any existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.padding = '0.75rem';
        messageElement.style.marginTop = '1rem';
        messageElement.style.borderRadius = '0.5rem';
        
        if (type === 'error') {
            messageElement.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            messageElement.style.color = '#ef4444';
        } else {
            messageElement.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
            messageElement.style.color = '#10b981';
        }
        
        // Add the message to the form
        form.appendChild(messageElement);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    }
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for the sticky header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Set up category filtering functionality
 */
function setupCategoryFiltering() {
    // This would typically be implemented if there were filter controls on the page
    // For now, we'll add a search input dynamically at the top of the categories section
    
    const categoriesGridSection = document.querySelector('.categories-grid-section');
    if (!categoriesGridSection) return;
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'category-search';
    searchContainer.style.marginBottom = '2rem';
    searchContainer.style.display = 'flex';
    searchContainer.style.justifyContent = 'center';
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search categories...';
    searchInput.style.padding = '0.75rem 1rem';
    searchInput.style.width = '100%';
    searchInput.style.maxWidth = '500px';
    searchInput.style.borderRadius = '0.5rem';
    searchInput.style.border = 'none';
    searchInput.style.backgroundColor = 'var(--light-bg)';
    searchInput.style.color = 'var(--text-color)';
    searchInput.style.fontSize = '1rem';
    
    // Add search input to container
    searchContainer.appendChild(searchInput);
    
    // Insert search container at the beginning of the categories section
    categoriesGridSection.querySelector('.container').insertBefore(
        searchContainer,
        categoriesGridSection.querySelector('.category-card')
    );
    
    // Add search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check if card matches search term
            const matchesSearch = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) ||
                tags.some(tag => tag.includes(searchTerm));
            
            // Show/hide card based on search
            card.style.display = matchesSearch ? '' : 'none';
        });
    });
}

/**
 * Track category popularity
 * This function simulates tracking clicks on category links
 */
function trackCategoryPopularity() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Get category name
            const categoryCard = button.closest('.category-card');
            const categoryName = categoryCard.querySelector('h2').textContent;
            
            // In a real implementation, you would send this data to your analytics service
            console.log(`Category clicked: ${categoryName}`);
            
            // You could also increment a counter in localStorage
            const categoryClicks = JSON.parse(localStorage.getItem('categoryClicks') || '{}');
            categoryClicks[categoryName] = (categoryClicks[categoryName] || 0) + 1;
            localStorage.setItem('categoryClicks', JSON.stringify(categoryClicks));
        });
    });
}

/**
 * Add animation to category stats
 */
function animateCategoryStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (!stats.length) return;
    
    // Animate numbers counting up
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent, 10);
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const increment = Math.ceil(finalValue / (duration / 1000 * frameRate));
        
        const animate = () => {
            startValue += increment;
            if (startValue > finalValue) {
                startValue = finalValue;
            }
            
            stat.textContent = startValue;
            
            if (startValue < finalValue) {
                requestAnimationFrame(animate);
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// Call additional functions when the page loads
window.addEventListener('load', function() {
    // Track category popularity
    trackCategoryPopularity();
    
    // Animate category stats
    animateCategoryStats();
    
    // Pre-load path banner images for smoother transitions
    const pathCards = document.querySelectorAll('.path-card');
    pathCards.forEach(card => {
        // Add subtle pulse animation to path icon
        const pathIcon = card.querySelector('.path-icon');
        if (pathIcon) {
            // Add keyframes for pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Apply animation to path icons
            pathIcon.style.animation = 'pulse 2s infinite';
        }
    });
});