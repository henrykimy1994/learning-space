// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Set up code copy functionality
    setupCodeCopy();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Set up smooth scrolling for anchor links
    setupSmoothScroll();
    
    // Initialize code highlighting if not already done
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});

/**
 * Sets up the copy functionality for code blocks
 */
function setupCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the associated code block
            const codeBlock = button.closest('.code-block').querySelector('pre code');
            const codeText = codeBlock.textContent;
            
            // Create a temporary textarea element to copy from
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy the text
            textarea.select();
            document.execCommand('copy');
            
            // Remove the textarea
            document.body.removeChild(textarea);
            
            // Show success message
            const tooltip = document.createElement('span');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            
            // Remove any existing tooltips
            const existingTooltip = button.querySelector('.copy-tooltip');
            if (existingTooltip) {
                button.removeChild(existingTooltip);
            }
            
            // Add the new tooltip
            button.appendChild(tooltip);
            
            // Show the tooltip
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
            
            // Hide and remove the tooltip after 2 seconds
            setTimeout(() => {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    button.removeChild(tooltip);
                }, 300);
            }, 2000);
        });
    });
}

/**
 * Sets up the mobile menu functionality
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
 * Sets up smooth scrolling for anchor links
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
 * Initialize table of contents
 * This is a more advanced feature that detects headings in the article
 * and builds a dynamic table of contents
 */
function initTableOfContents() {
    const article = document.querySelector('.article-content');
    const headings = article.querySelectorAll('h2, h3');
    
    // If there are not enough headings, don't create a TOC
    if (headings.length < 3) return;
    
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h4>Table of Contents</h4>';
    
    // Create list
    const tocList = document.createElement('ul');
    
    // Add each heading to the TOC
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }
        
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = heading.tagName.toLowerCase();
        
        // Create link
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        
        // Append to list item
        listItem.appendChild(link);
        
        // Append to TOC list
        tocList.appendChild(listItem);
    });
    
    // Append list to TOC container
    tocContainer.appendChild(tocList);
    
    // Insert TOC at the beginning of the article
    const firstSection = article.querySelector('.article-section');
    article.insertBefore(tocContainer, firstSection);
    
    // Add TOC styles
    const style = document.createElement('style');
    style.textContent = `
        .table-of-contents {
            background-color: var(--light-bg);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .table-of-contents h4 {
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .table-of-contents ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .table-of-contents li {
            margin-bottom: 0.5rem;
            padding-left: 0;
        }
        
        .table-of-contents li.h3 {
            padding-left: 1.5rem;
            font-size: 0.9rem;
        }
        
        .table-of-contents a {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .table-of-contents a:hover {
            color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Set up estimated reading time
 */
function calculateReadingTime() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    // Get all text content
    const text = article.textContent;
    
    // Count words (rough estimate)
    const words = text.split(/\s+/).length;
    
    // Average reading speed: 200-250 words per minute
    const readingTime = Math.ceil(words / 225);
    
    // Update reading time in the hero section
    const readingTimeElement = document.querySelector('.hero-meta .far.fa-clock').parentNode.querySelector('span');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

/**
 * Add syntax highlighting theme switcher
 * This allows users to toggle between light and dark code themes
 */
function addThemeSwitcher() {
    // Create the theme switch button
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>Switch Theme</span>';
    
    // Style the button
    themeSwitch.style.position = 'fixed';
    themeSwitch.style.bottom = '20px';
    themeSwitch.style.right = '20px';
    themeSwitch.style.backgroundColor = 'var(--primary-color)';
    themeSwitch.style.color = 'white';
    themeSwitch.style.border = 'none';
    themeSwitch.style.borderRadius = '50px';
    themeSwitch.style.padding = '10px 15px';
    themeSwitch.style.display = 'flex';
    themeSwitch.style.alignItems = 'center';
    themeSwitch.style.gap = '8px';
    themeSwitch.style.cursor = 'pointer';
    themeSwitch.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    themeSwitch.style.zIndex = '100';
    
    // Add the button to the body
    document.body.appendChild(themeSwitch);
    
    // Set up click event
    let isDarkTheme = true;
    themeSwitch.addEventListener('click', () => {
        if (isDarkTheme) {
            // Switch to light theme
            document.documentElement.style.setProperty('--dark-bg', '#f8fafc');
            document.documentElement.style.setProperty('--medium-bg', '#f1f5f9');
            document.documentElement.style.setProperty('--light-bg', '#e2e8f0');
            document.documentElement.style.setProperty('--text-color', '#0f172a');
            document.documentElement.style.setProperty('--text-muted', '#64748b');
            document.documentElement.style.setProperty('--border-color', '#cbd5e1');
            document.documentElement.style.setProperty('--code-bg', '#f8fafc');
            
            // Change prism theme
            document.querySelectorAll('link[href*="prism-tomorrow"]').forEach(link => {
                link.href = link.href.replace('prism-tomorrow', 'prism');
            });
            
            themeSwitch.querySelector('span').textContent = 'Dark Mode';
        } else {
            // Switch to dark theme
            document.documentElement.style.setProperty('--dark-bg', '#111827');
            document.documentElement.style.setProperty('--medium-bg', '#1f2937');
            document.documentElement.style.setProperty('--light-bg', '#374151');
            document.documentElement.style.setProperty('--text-color', '#f3f4f6');
            document.documentElement.style.setProperty('--text-muted', '#9ca3af');
            document.documentElement.style.setProperty('--border-color', '#4b5563');
            document.documentElement.style.setProperty('--code-bg', '#0f172a');
            
            // Change prism theme
            document.querySelectorAll('link[href*="prism"]').forEach(link => {
                if (!link.href.includes('prism-tomorrow')) {
                    link.href = link.href.replace('prism', 'prism-tomorrow');
                }
            });
            
            themeSwitch.querySelector('span').textContent = 'Light Mode';
        }
        
        isDarkTheme = !isDarkTheme;
    });
}

/**
 * Add interactions to code examples
 * This includes visualizing recursion through animations
 */
function enhanceCodeExamples() {
    // Find the factorial example
    const factorialCode = document.querySelector('[data-code="factorial"]');
    if (factorialCode) {
        const codeBlock = factorialCode.closest('.code-block');
        
        // Create run button
        const runButton = document.createElement('button');
        runButton.className = 'run-btn';
        runButton.innerHTML = '<i class="fas fa-play"></i> Run';
        runButton.style.marginLeft = '10px';
        runButton.style.background = 'var(--secondary-color)';
        runButton.style.border = 'none';
        runButton.style.borderRadius = '4px';
        runButton.style.padding = '4px 8px';
        runButton.style.color = 'white';
        runButton.style.cursor = 'pointer';
        
        // Add the button to the code header
        const codeHeader = codeBlock.querySelector('.code-header');
        codeHeader.appendChild(runButton);
        
        // Create output display
        const outputDisplay = document.createElement('div');
        outputDisplay.className = 'code-output';
        outputDisplay.style.background = 'var(--dark-bg)';
        outputDisplay.style.padding = '1rem';
        outputDisplay.style.marginTop = '10px';
        outputDisplay.style.borderRadius = '0 0 8px 8px';
        outputDisplay.style.fontFamily = 'monospace';
        outputDisplay.style.display = 'none';
        
        // Add the output display after the code
        codeBlock.appendChild(outputDisplay);
        
        // Add click event to run button
        runButton.addEventListener('click', () => {
            // Extract factorial function from the code
            const code = codeBlock.querySelector('code').textContent;
            
            try {
                // Create a safe execution environment
                const factorialFunc = new Function('return ' + code)();
                
                // Run the function with example input
                const result = factorialFunc(5);
                
                // Show the output display
                outputDisplay.style.display = 'block';
                outputDisplay.innerHTML = `<div style="color: var(--text-muted);">// Output:</div><div style="color: var(--secondary-color);">${result}</div>`;
                
                // Add step-by-step breakdown
                setTimeout(() => {
                    outputDisplay.innerHTML += `
                        <div style="margin-top: 15px; color: var(--text-muted);">// Step-by-step breakdown:</div>
                        <div style="color: var(--text-color);">factorial(5) calls factorial(4) * 5</div>
                        <div style="color: var(--text-color); padding-left: 20px;">factorial(4) calls factorial(3) * 4</div>
                        <div style="color: var(--text-color); padding-left: 40px;">factorial(3) calls factorial(2) * 3</div>
                        <div style="color: var(--text-color); padding-left: 60px;">factorial(2) calls factorial(1) * 2</div>
                        <div style="color: var(--text-color); padding-left: 80px;">factorial(1) returns 1 (base case)</div>
                        <div style="color: var(--text-color); padding-left: 60px;">factorial(2) returns 2 * 1 = 2</div>
                        <div style="color: var(--text-color); padding-left: 40px;">factorial(3) returns 3 * 2 = 6</div>
                        <div style="color: var(--text-color); padding-left: 20px;">factorial(4) returns 4 * 6 = 24</div>
                        <div style="color: var(--text-color);">factorial(5) returns 5 * 24 = 120</div>
                    `;
                }, 500);
            } catch (error) {
                // Show error
                outputDisplay.style.display = 'block';
                outputDisplay.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
            }
        });
    }
}

// Add interactive elements when the content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // These are more advanced features that can be enabled if desired
    // Uncomment to enable them
    
    // initTableOfContents();
    // calculateReadingTime();
    // addThemeSwitcher();
    // enhanceCodeExamples();
});

// Handle code snippet highlighting when page loads
window.addEventListener('load', function() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});