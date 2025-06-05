window.pageInfo = {
    menulist: null,
    articlesData: null,
    latestArticles: null,
    featuredArticles: null,
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded',async function() {
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
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Set up newsletter form
    setupNewsletterForm();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScroll();
    
    // Add code highlight animation
    setupCodeHighlight();

    // Set up menu list
    await getMenuList();

    await generateMenuList();

    await getArticlesData();

    await generateHomeContents();
});

const generateMenuList = async () => {
    const navList = document.getElementById('nav-list');
    const navLustMobile = document.getElementById('nav-list-mobile');

    window.pageInfo.menulist.forEach(menuItem => {
        navList.insertAdjacentHTML('beforeend', `<li><a href="${menuItem.href}" class="${menuItem.active ? 'active' : ''}">${menuItem.label}</a></li>`)
        navLustMobile.insertAdjacentHTML('beforeend', `<li><a href="${menuItem.href}" class="${menuItem.active ? 'active' : ''}">${menuItem.label}</a></li>`)
    })
}

/**
 * Set up menu list
 */
const getMenuList = async () => {
    try {
        const menulist = await fetch('/assets/data/menu.json');
        window.pageInfo.menulist = await menulist.json();
    } catch (error) {
        log.error(error);
    }
}

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

function closeMenu() {
    // Add closing class for animation
    mobileMenu.classList.add('closing');
    menuButton.classList.remove('active');
    backdrop.classList.remove('active');
    
    // Change X back to hamburger
    const icon = menuButton.querySelector('.fas');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    
    // Wait for animation to complete before removing active class
    setTimeout(() => {
        mobileMenu.classList.remove('active');
        mobileMenu.classList.remove('closing');
        document.body.style.overflow = '';
        isOpen = false;
    }, 400); // Match the CSS transition duration
}

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const nav = document.querySelector('nav ul');
    
    if (!menuButton || !mobileMenu) return;
    
    let isOpen = false;
    
    // Toggle menu function
    function toggleMobileMenu() {
        isOpen = !isOpen;
        
        if (isOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }
    
    // Open menu
    function openMenu() {
        mobileMenu.classList.add('active');
        menuButton.classList.add('active');
        backdrop.classList.add('active');
        
        // Change hamburger to X
        const icon = menuButton.querySelector('.fas');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        isOpen = true;
    }
    
    // Close menu
    function closeMenu() {
        mobileMenu.classList.remove('active');
        menuButton.classList.remove('active');
        backdrop.classList.remove('active');
        
        // Change X back to hamburger
        const icon = menuButton.querySelector('.fas');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        isOpen = false;
    }
    
    // Event listeners
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (isOpen) closeMenu();
        });
    }
    
    // Backdrop click to close
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            if (isOpen) closeMenu();
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isOpen) {
            closeMenu();
        }
    });
    
    // Close menu when clicking on menu links
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });
}

async function getArticlesData() {
    const response = await fetch('/assets/data/articles.json');
    window.pageInfo.articlesData = await response.json();
}

async function setFeaturedArticles() {
    window.pageInfo.featuredArticles = Object.values(window.pageInfo.articlesData).flat().sort((a, b) => b.views - a.views).slice(0,4);
}

async function generateFeaturedArticles() {
    const featuredArticlesContainer = document.getElementById('featured-grid');
    window.pageInfo.featuredArticles.forEach(articleItem => {
        const articleElement = `
        <div class="featured-card" data-aos="fade-up">
            <div class="card-image">
                <img src="${articleItem.image}" alt="${articleItem.alt}">
                <div class="card-category">
                    ${articleItem.categoryDisplay}
                </div>
            </div>
            <div class="card-content">
                <h3>${articleItem.title}</h3>
                <p>${articleItem.description}</p>
                <div class="card-meta">
                    <span><i class="far fa-calendar"></i> ${articleItem.date}</span>
                    <span><i class="far fa-clock"></i> ${articleItem.readTime}</span>
                </div>
                <a href="${articleItem.link}" class="read-more">Read Article
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
        `

        featuredArticlesContainer.insertAdjacentHTML('beforeend', articleElement)
    });
}

async function setLatestArticles() {
    window.pageInfo.latestArticles = Object.values(window.pageInfo.articlesData).flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,3)
}

async function generateLatestArticles() {
    const featuredArticlesContainer = document.querySelector('.articles-grid');
    window.pageInfo.latestArticles.forEach(articleItem => {
        const articleElement = `
        <div class="article-card" data-aos="fade-up">
            <div class="article-image">
                <img src="${articleItem.image}" alt="${articleItem.alt}">
            </div>
            <div class="article-content">
                <div class="article-category">${articleItem.category}</div>
                <h3>${articleItem.title}</h3>
                <p>${articleItem.description}</p>
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i>${articleItem.date}</span
                    >
                    <span><i class="far fa-clock"></i>${articleItem.readTime} min read</span
                    >
                </div>
            </div>
        </div>
        `

        featuredArticlesContainer.insertAdjacentHTML('beforeend', articleElement)
    });
}

async function generateCategorySection() {
    const categoryGridContainer = document.querySelector('.category-grid');
    Object.keys(window.pageInfo.articlesData).forEach(category => {
        const categoryElement = `
        <a href="#" class="category-card">
            <div class="category-icon">
                <i class="fas fa-code"></i>
            </div>
            <h3>${category.replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</h3>
            <p>${window.pageInfo.articlesData[category].length} articles</p>
        </a>
        `
        categoryGridContainer.insertAdjacentHTML('beforeend', categoryElement);
    });
}

async function generateHomeContents() {
    await setFeaturedArticles();

    await generateFeaturedArticles();

    await setLatestArticles();

    await generateLatestArticles();

    await generateCategorySection();
}

/**
 * Initialize the testimonial slider
 */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.control-dots');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.control-prev');
    const nextButton = document.querySelector('.control-next');
    
    if (!track || !slides.length) return;
    
    let currentSlide = 0;
    const slideWidth = 100; // 100% of container width
    
    // Set initial position
    updateSliderPosition();
    
    // Set up dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSliderPosition();
        });
    });
    
    // Set up prev button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Set up next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderPosition();
        });
    }
    
    // Set up auto-slide
    const autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSliderPosition();
    }, 5000);
    
    // Pause auto-slide on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // Function to update slider position
    function updateSliderPosition() {
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
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
 * Set up code highlighting animation in the hero section
 */
function setupCodeHighlight() {
    const codeElement = document.querySelector('.code-snippet code');
    
    if (!codeElement) return;
    
    // Define keywords to highlight
    const keywords = ['function', 'const', 'return'];
    const specialWords = ['explore', 'concepts', 'learn'];
    
    // Get the code text
    let codeText = codeElement.textContent;
    
    // Highlight keywords
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        codeText = codeText.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Highlight special words
    specialWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        codeText = codeText.replace(regex, `<span class="special">${word}</span>`);
    });
    
    // Highlight strings
    codeText = codeText.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    
    // Apply the highlighted code
    codeElement.innerHTML = codeText;
    
    // Add CSS for the highlights
    const style = document.createElement('style');
    style.textContent = `
        .code-snippet .keyword {
            color: #818cf8; /* Primary light color */
        }
        
        .code-snippet .special {
            color: #10b981; /* Secondary color */
        }
        
        .code-snippet .string {
            color: #f59e0b; /* Accent color */
        }
    `;
    document.head.appendChild(style);
    
    // Add typing animation effect
    setTimeout(() => {
        animateTyping(codeElement);
    }, 1000);
    
    function animateTyping(element) {
        const content = element.innerHTML;
        element.innerHTML = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < content.length) {
                element.innerHTML += content.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                element.style.borderRight = 'none';
            }
        }, 30);
    }
}

/**
 * Add parallax effect to the hero section
 * This is commented out by default, uncomment to enable
 */
function setupParallax() {
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    const codeSnippet = document.querySelector('.code-snippet');
    
    if (!heroSection || !heroImage || !codeSnippet) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrollY <= heroHeight) {
            // Move the hero image slightly up as you scroll down
            heroImage.style.transform = `translateY(${scrollY * 0.2}px)`;
            
            // Move the code snippet in the opposite direction
            codeSnippet.style.transform = `rotate(3deg) translateY(-${scrollY * 0.1}px)`;
        }
    });
}

/**
 * Preload images for smoother experience
 */
function preloadImages() {
    // Get all image elements
    const images = document.querySelectorAll('img');
    
    // Create an array to store promises
    const imagePromises = [];
    
    // Create a promise for each image
    images.forEach(img => {
        if (img.src) {
            const promise = new Promise((resolve, reject) => {
                const newImg = new Image();
                newImg.src = img.src;
                newImg.onload = resolve;
                newImg.onerror = reject;
            });
            
            imagePromises.push(promise);
        }
    });
    
    // When all images are loaded
    Promise.all(imagePromises).then(() => {
        console.log('All images preloaded successfully');
    }).catch(error => {
        console.error('Error preloading images:', error);
    });
}

// Call preload images after the page has loaded
window.addEventListener('load', preloadImages);

/**
 * Create a loading animation
 * This would typically be used if the site has heavy content that needs loading time
 */
function createLoadingAnimation() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'var(--dark-bg)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.style.transition = 'opacity 0.5s ease';
    
    // Create loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '3px solid transparent';
    spinner.style.borderTop = '3px solid var(--primary-color)';
    spinner.style.borderRight = '3px solid var(--secondary-color)';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // Add the animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Add the spinner to the overlay
    loadingOverlay.appendChild(spinner);
    
    // Add the overlay to the body
    document.body.appendChild(loadingOverlay);
    
    // Remove the overlay when the page is fully loaded
    window.addEventListener('load', () => {
        loadingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
        }, 500);
    });
}

// Call loading animation function before the page loads
// Uncomment the line below to enable the loading animation
// createLoadingAnimation();