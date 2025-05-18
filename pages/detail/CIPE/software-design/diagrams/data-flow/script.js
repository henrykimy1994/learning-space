// 자료 흐름도(DFD) 이해하기 페이지를 위한 JavaScript

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
    
    // Initialize DFD interactive builder
    setupDFDBuilder();
    
    // Create DFD examples
    createDFDExamples();
    
    // Initialize mermaid diagrams
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {
                primaryColor: '#6366f1',
                primaryTextColor: '#f3f4f6',
                primaryBorderColor: '#4b5563',
                lineColor: '#9ca3af',
                secondaryColor: '#10b981',
                tertiaryColor: '#374151'
            }
        });
    }
    
    // Initialize code highlighting if not already done
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Calculate reading time
    calculateReadingTime();
    
    // Initialize Table of Contents
    initTableOfContents();
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
 * Sets up the interactive DFD builder
 */
function setupDFDBuilder() {
    const componentType = document.getElementById('component-type');
    const componentName = document.getElementById('component-name');
    const processNumber = document.getElementById('process-number');
    const datastoreNumber = document.getElementById('datastore-number');
    const addComponentBtn = document.getElementById('add-component');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const dfdComponents = document.getElementById('dfd-components');
    
    if (!componentType || !addComponentBtn || !dfdComponents) return;
    
    const canvasPlaceholder = document.querySelector('.canvas-placeholder');
    if (!canvasPlaceholder) return;
    
    // Show/hide relevant fields based on component type
    componentType.addEventListener('change', () => {
        const selectedType = componentType.value;
        
        // Process number field
        const processNumberField = document.querySelector('.process-number');
        if (processNumberField) {
            processNumberField.style.display = selectedType === 'process' ? 'flex' : 'none';
        }
        
        // Data store number field
        const datastoreNumberField = document.querySelector('.datastore-number');
        if (datastoreNumberField) {
            datastoreNumberField.style.display = selectedType === 'datastore' ? 'flex' : 'none';
        }
    });
    
    // Trigger change event to set initial state
    if (componentType) {
        componentType.dispatchEvent(new Event('change'));
    }
    
    // Add component button click handler
    if (addComponentBtn && componentName && processNumber && datastoreNumber) {
        addComponentBtn.addEventListener('click', () => {
            const type = componentType.value;
            const name = componentName.value.trim() || 'Unnamed Component';
            
            // Create component element
            const component = document.createElement('div');
            component.className = `dfd-component ${type}-component`;
            
            // Create component content based on type
            let componentContent = '';
            let numberText = '';
            
            if (type === 'process') {
                const number = processNumber.value.trim() || '1';
                numberText = `Process ${number}`;
                component.style.borderRadius = '50%';
            } else if (type === 'datastore') {
                const number = datastoreNumber.value.trim() || 'D1';
                numberText = `${number}`;
                component.style.borderRadius = '0';
            } else if (type === 'terminator') {
                numberText = 'External Entity';
                component.style.borderRadius = '8px';
            }
            
            componentContent = `
                <div class="component-header">
                    <span class="component-number">${numberText}</span>
                    <button class="component-remove" title="Remove Component">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="component-name">${name}</div>
            `;
            
            component.innerHTML = componentContent;
            
            // Add remove button functionality
            const removeBtn = component.querySelector('.component-remove');
            removeBtn.addEventListener('click', () => {
                component.remove();
                
                // Show placeholder if no components left
                if (dfdComponents.children.length === 0) {
                    canvasPlaceholder.style.display = 'flex';
                }
            });
            
            // Add to canvas
            dfdComponents.appendChild(component);
            
            // Hide placeholder
            canvasPlaceholder.style.display = 'none';
            
            // Reset input fields
            componentName.value = '';
            processNumber.value = '';
            datastoreNumber.value = '';
        });
    }
    
    // Clear canvas button
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', () => {
            dfdComponents.innerHTML = '';
            canvasPlaceholder.style.display = 'flex';
        });
    }
}

/**
 * Creates DFD examples using SVG graphics
 */
function createDFDExamples() {
    // Level 0 DFD example for pizza ordering system
    const level0Container = document.getElementById('pizza-dfd-example');
    if (level0Container) {
        const level0Svg = document.createElement('div');
        level0Svg.innerHTML = `
            <svg width="700" height="400" viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
                <!-- External Entities -->
                <rect x="50" y="150" width="120" height="60" fill="#374151" stroke="#f59e0b" stroke-width="2" />
                <text x="110" y="185" font-family="Arial" font-size="16" text-anchor="middle" fill="#f3f4f6">고객</text>
                
                <rect x="530" y="150" width="120" height="60" fill="#374151" stroke="#f59e0b" stroke-width="2" />
                <text x="590" y="185" font-family="Arial" font-size="16" text-anchor="middle" fill="#f3f4f6">배달원</text>
                
                <!-- Central Process -->
                <circle cx="350" cy="180" r="100" fill="#1f2937" stroke="#6366f1" stroke-width="2" />
                <text x="350" y="170" font-family="Arial" font-size="16" text-anchor="middle" fill="#f3f4f6">0</text>
                <text x="350" y="190" font-family="Arial" font-size="16" text-anchor="middle" fill="#f3f4f6">피자 주문</text>
                <text x="350" y="210" font-family="Arial" font-size="16" text-anchor="middle" fill="#f3f4f6">시스템</text>
                
                <!-- Data Flows -->
                <!-- Customer to System -->
                <line x1="170" y1="160" x2="250" y2="160" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead)" />
                <text x="210" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#9ca3af">주문 요청</text>
                
                <!-- System to Customer -->
                <line x1="250" y1="200" x2="170" y2="200" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead)" />
                <text x="210" y="220" font-family="Arial" font-size="14" text-anchor="middle" fill="#9ca3af">영수증</text>
                
                <!-- System to Delivery -->
                <line x1="450" y1="160" x2="530" y2="160" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead)" />
                <text x="490" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#9ca3af">배달 정보</text>
                
                <!-- Delivery to System -->
                <line x1="530" y1="200" x2="450" y2="200" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead)" />
                <text x="490" y="220" font-family="Arial" font-size="14" text-anchor="middle" fill="#9ca3af">배달 확인</text>
                
                <!-- Arrow Marker -->
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                    </marker>
                </defs>
            </svg>
        `;
        level0Container.appendChild(level0Svg);
    }
    
    // Level 1 DFD example for pizza ordering system
    const level1Container = document.getElementById('pizza-dfd-level1');
    if (level1Container) {
        const level1Svg = document.createElement('div');
        level1Svg.innerHTML = `
            <svg width="700" height="550" viewBox="0 0 700 550" xmlns="http://www.w3.org/2000/svg">
                <!-- External Entities -->
                <rect x="20" y="100" width="100" height="50" fill="#374151" stroke="#f59e0b" stroke-width="2" />
                <text x="70" y="130" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">고객</text>
                
                <rect x="580" y="100" width="100" height="50" fill="#374151" stroke="#f59e0b" stroke-width="2" />
                <text x="630" y="130" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">배달원</text>
                
                <!-- Processes -->
                <circle cx="200" cy="125" r="50" fill="#1f2937" stroke="#6366f1" stroke-width="2" />
                <text x="200" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">1</text>
                <text x="200" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">주문 접수</text>
                
                <circle cx="350" cy="125" r="50" fill="#1f2937" stroke="#6366f1" stroke-width="2" />
                <text x="350" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">2</text>
                <text x="350" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">피자 제작</text>
                
                <circle cx="500" cy="125" r="50" fill="#1f2937" stroke="#6366f1" stroke-width="2" />
                <text x="500" y="120" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">3</text>
                <text x="500" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#f3f4f6">배달 준비</text>
                
                <!-- Data Stores -->
                <g transform="translate(0, 250)">
                    <line x1="150" y1="30" x2="400" y2="30" stroke="#10b981" stroke-width="2" />
                    <line x1="150" y1="60" x2="400" y2="60" stroke="#10b981" stroke-width="2" />
                    <text x="170" y="50" font-family="Arial" font-size="14" fill="#f3f4f6">D1 주문 데이터베이스</text>
                    
                    <line x1="150" y1="100" x2="400" y2="100" stroke="#10b981" stroke-width="2" />
                    <line x1="150" y1="130" x2="400" y2="130" stroke="#10b981" stroke-width="2" />
                    <text x="170" y="120" font-family="Arial" font-size="14" fill="#f3f4f6">D2 고객 정보 데이터베이스</text>
                </g>
                
                <!-- Data Flows -->
                <!-- Customer <-> Order Process -->
                <line x1="120" y1="110" x2="150" y2="110" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="135" y="100" font-family="Arial" font-size="12" text-anchor="middle" fill="#9ca3af">주문 요청</text>
                
                <line x1="150" y1="140" x2="120" y2="140" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="135" y="160" font-family="Arial" font-size="12" text-anchor="middle" fill="#9ca3af">영수증</text>
                
                <!-- Order Process <-> Pizza Making -->
                <line x1="250" y1="125" x2="300" y2="125" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="275" y="115" font-family="Arial" font-size="12" text-anchor="middle" fill="#9ca3af">제작 지시</text>
                
                <!-- Pizza Making <-> Delivery Prep -->
                <line x1="400" y1="125" x2="450" y2="125" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="425" y="115" font-family="Arial" font-size="12" text-anchor="middle" fill="#9ca3af">완성된 피자</text>
                
                <!-- Delivery Prep <-> Delivery Person -->
                <line x1="550" y1="125" x2="580" y2="125" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="565" y="115" font-family="Arial" font-size="12" text-anchor="middle" fill="#9ca3af">배달 정보</text>
                
                <!-- Order Process <-> Order DB -->
                <line x1="200" y1="175" x2="200" y2="280" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="220" y="230" font-family="Arial" font-size="12" fill="#9ca3af">저장</text>
                
                <line x1="220" y1="280" x2="220" y2="175" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="240" y="230" font-family="Arial" font-size="12" fill="#9ca3af">조회</text>
                
                <!-- Order Process <-> Customer DB -->
                <line x1="180" y1="175" x2="180" y2="350" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="160" y="260" font-family="Arial" font-size="12" fill="#9ca3af">조회</text>
                
                <!-- Delivery Prep <-> Order DB -->
                <line x1="500" y1="175" x2="375" y2="280" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrowhead1)" />
                <text x="450" y="230" font-family="Arial" font-size="12" fill="#9ca3af">조회</text>
                
                <!-- Arrow Marker -->
                <defs>
                    <marker id="arrowhead1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                    </marker>
                </defs>
            </svg>
        `;
        level1Container.appendChild(level1Svg);
    }
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
    const readingTimeElement = document.querySelector('.hero-meta .far.fa-clock');
    if (readingTimeElement && readingTimeElement.parentNode) {
        const spanElement = readingTimeElement.parentNode.querySelector('span');
        if (spanElement) {
            spanElement.textContent = `${readingTime} min read`;
        }
    }
}

/**
 * Initialize table of contents
 * This is a more advanced feature that detects headings in the article
 * and builds a dynamic table of contents
 */
function initTableOfContents() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    const headings = article.querySelectorAll('h2');
    
    // If there are not enough headings, don't create a TOC
    if (headings.length < 3) return;
    
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h4>목차</h4>';
    
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
    if (firstSection) {
        article.insertBefore(tocContainer, firstSection);
    }
}

/**
 * Add theme switcher functionality
 */
function addThemeSwitcher() {
    // Create the theme switch button
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>테마 변경</span>';
    
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
            
            // Change mermaid theme if available
            if (typeof mermaid !== 'undefined') {
                mermaid.initialize({
                    theme: 'default',
                    themeVariables: {
                        primaryColor: '#6366f1',
                        primaryTextColor: '#0f172a',
                        primaryBorderColor: '#cbd5e1',
                        lineColor: '#64748b',
                        secondaryColor: '#10b981',
                        tertiaryColor: '#e2e8f0'
                    }
                });
                
                // Reinitialize all diagrams
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }
            
            themeSwitch.querySelector('span').textContent = '다크 모드로 전환';
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
            
            // Change mermaid theme if available
            if (typeof mermaid !== 'undefined') {
                mermaid.initialize({
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#6366f1',
                        primaryTextColor: '#f3f4f6',
                        primaryBorderColor: '#4b5563',
                        lineColor: '#9ca3af',
                        secondaryColor: '#10b981',
                        tertiaryColor: '#374151'
                    }
                });
                
                // Reinitialize all diagrams
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }
            
            themeSwitch.querySelector('span').textContent = '라이트 모드로 전환';
        }
        
        isDarkTheme = !isDarkTheme;
    });
}

/**
 * Setup interactive elements to highlight DFD components on hover
 */
function setupDFDHighlighting() {
    // Find all headings related to DFD components
    const componentHeadings = document.querySelectorAll('h2, h3');
    
    // Define components to highlight
    const components = [
        { term: '프로세스', selector: '.process-component, .mermaid circle' },
        { term: '데이터 흐름', selector: '.mermaid line, .mermaid path' },
        { term: '데이터 저장소', selector: '.datastore-component, .mermaid .datastore' },
        { term: '터미네이터', selector: '.terminator-component, .mermaid rect' }
    ];
    
    // Add event listeners to headings
    componentHeadings.forEach(heading => {
        components.forEach(component => {
            if (heading.textContent.toLowerCase().includes(component.term.toLowerCase())) {
                heading.addEventListener('mouseenter', () => {
                    // Highlight matching components
                    document.querySelectorAll(component.selector).forEach(el => {
                        el.style.filter = 'brightness(1.5)';
                        el.style.transition = 'all 0.3s';
                    });
                });
                
                heading.addEventListener('mouseleave', () => {
                    // Reset highlighting
                    document.querySelectorAll(component.selector).forEach(el => {
                        el.style.filter = '';
                    });
                });
            }
        });
    });
}

// Add interactive elements when the content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add theme switcher
    addThemeSwitcher();
    
    // Setup DFD component highlighting
    setupDFDHighlighting();
});

// Handle code snippet highlighting when page loads
window.addEventListener('load', function() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Re-render mermaid diagrams after page is fully loaded
    if (typeof mermaid !== 'undefined') {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
});