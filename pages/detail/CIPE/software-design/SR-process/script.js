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
    
    // Set up interactive examples for requirements analysis
    setupInteractiveExamples();
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
 * Sets up interactive examples for requirements analysis
 */
function setupInteractiveExamples() {
    // Create interactive methodology steps
    createRequirementsSteps();
    
    // Set up interactive diagram highlighting
    setupDiagramHighlighting();
    
    // Create a simple requirements specification builder
    setupRequirementsBuilder();
}

/**
 * Creates interactive requirements analysis steps with progress tracking
 */
function createRequirementsSteps() {
    const articleSections = document.querySelectorAll('.article-section');
    if (articleSections.length < 6) return;
    
    // Create methodology steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'methodology-steps';
    
    // Create step progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'step-progress';
    
    // Step names for requirements analysis
    const stepNames = [
        '문제 분석',
        'SDLC 개요',
        '요구 분석',
        '선택지 분석',
        '실제 사례',
        '베스트 프랙티스'
    ];
    
    // Create steps
    for (let i = 0; i < 6; i++) {
        const step = document.createElement('div');
        step.className = 'step';
        step.textContent = i + 1;
        step.dataset.step = i + 1;
        
        // Add step label
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = stepNames[i];
        
        step.appendChild(label);
        progressBar.appendChild(step);
        
        // Make step clickable
        step.addEventListener('click', () => {
            // Get corresponding heading
            const targetHeading = document.querySelector(`.article-section:nth-child(${i + 1}) h2`);
            if (targetHeading) {
                window.scrollTo({
                    top: targetHeading.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    stepsContainer.appendChild(progressBar);
    document.body.appendChild(stepsContainer);
    
    // Set up scroll tracking to highlight current step
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 600; // Offset for better tracking
        
        // Find current section
        let currentIndex = 0;
        for (let i = 1; i < articleSections.length && i <= 6; i++) {
            if (articleSections[i] && scrollPosition >= articleSections[i].offsetTop) {
                currentIndex = i;
                stepsContainer.classList.add('fade-in');
                stepsContainer.style.display = 'block';
            }
            
            if (articleSections[i] && ((scrollPosition < articleSections[1].offsetTop) || (scrollPosition > articleSections[6].offsetTop))) {
                stepsContainer.classList.remove('fade-in');
            }
        }
        
        // Update steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index < currentIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    });
    
    // Trigger scroll event to initialize
    window.dispatchEvent(new Event('scroll'));
}

/**
 * Sets up highlighting for diagrams when hovering over related text
 */
function setupDiagramHighlighting() {
    // Sample terms to highlight (updated for requirements analysis)
    const terms = [
        {term: '요구 분석', highlight: '.mermaid .node'},
        {term: '구현', highlight: '.mermaid .node'},
        {term: 'DFD', highlight: '.mermaid .edgePath'},
        {term: '비용', highlight: '.mermaid .pieCircle'},
        {term: '단계', highlight: '.mermaid .node'}
    ];
    
    // Find all paragraphs and list items
    const textElements = document.querySelectorAll('p, li');
    
    textElements.forEach(element => {
        terms.forEach(termObj => {
            // Find mentions of the term
            if (element.textContent.toLowerCase().includes(termObj.term.toLowerCase())) {
                // Mark the element for highlighting
                element.dataset.highlightTarget = termObj.highlight;
                
                // Add hover event listener
                element.addEventListener('mouseenter', () => {
                    // Find diagram elements
                    const targetElements = document.querySelectorAll(termObj.highlight);
                    targetElements.forEach(targetEl => {
                        targetEl.classList.add('highlight-element');
                        targetEl.style.transition = 'all 0.3s';
                        targetEl.style.filter = 'brightness(1.5)';
                        targetEl.style.stroke = '#10b981';
                        targetEl.style.strokeWidth = '2px';
                    });
                });
                
                element.addEventListener('mouseleave', () => {
                    // Reset diagram elements
                    const targetElements = document.querySelectorAll(termObj.highlight);
                    targetElements.forEach(targetEl => {
                        targetEl.classList.remove('highlight-element');
                        targetEl.style.filter = '';
                        targetEl.style.stroke = '';
                        targetEl.style.strokeWidth = '';
                    });
                });
            }
        });
    });
}

/**
 * Creates a simple requirements specification builder interface
 */
function setupRequirementsBuilder() {
    // Find sections where we want to add interactive elements
    const requirementsSection = document.querySelector('.article-section:nth-child(3)');
    
    if (!requirementsSection) return;
    
    // Create interactive element
    const interactiveEl = document.createElement('div');
    interactiveEl.className = 'interactive-demo';
    interactiveEl.innerHTML = `
        <h3>체험해보기: 요구사항 명세서 작성</h3>
        <p>간단한 도구를 사용하여 자신만의 요구사항을 작성해보세요.</p>
        
        <div class="requirements-builder">
            <div class="form-group">
                <label for="systemName">시스템 이름:</label>
                <input type="text" id="systemName" placeholder="예: 온라인 쇼핑몰">
            </div>
            
            <div class="form-group">
                <label for="functionalReq">기능 요구사항 (한 줄씩):</label>
                <textarea id="functionalReq" placeholder="FR-001: 사용자는 로그인할 수 있어야 한다
FR-002: 사용자는 상품을 검색할 수 있어야 한다
FR-003: 사용자는 주문을 할 수 있어야 한다"></textarea>
            </div>
            
            <div class="form-group">
                <label for="nonFunctionalReq">비기능 요구사항 (한 줄씩):</label>
                <textarea id="nonFunctionalReq" placeholder="NFR-001: 시스템은 동시 사용자 1000명을 지원해야 한다
NFR-002: 페이지 로딩 시간은 3초 이내여야 한다
NFR-003: 99.9% 가용성을 보장해야 한다"></textarea>
            </div>
            
            <button id="generateSpec" class="generate-btn">명세서 생성</button>
        </div>
        
        <div class="generated-spec-container" style="display: none;">
            <h4>생성된 요구사항 명세서:</h4>
            <div class="generated-spec"></div>
            <button id="resetSpec" class="reset-btn">초기화</button>
        </div>
    `;
    
    // Add styles for the interactive element
    const style = document.createElement('style');
    style.textContent = `
        .interactive-demo {
            background-color: var(--light-bg);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .requirements-builder {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }
        
.form-group label {
            font-weight: 600;
            color: var(--text-color);
        }
        
        .form-group input, .form-group textarea {
            padding: 0.75rem;
            border-radius: 0.25rem;
            border: 1px solid var(--border-color);
            background-color: var(--medium-bg);
            color: var(--text-color);
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
        }
        
        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .generate-btn, .reset-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 1rem;
            align-self: flex-start;
        }
        
        .generate-btn:hover, .reset-btn:hover {
            background-color: var(--primary-dark);
        }
        
        .reset-btn {
            background-color: #ef4444;
        }
        
        .reset-btn:hover {
            background-color: #dc2626;
        }
        
        .generated-spec-container {
            margin-top: 2rem;
        }
        
        .generated-spec {
            font-family: 'Fira Code', monospace;
            white-space: pre-wrap;
            padding: 1.5rem;
            background-color: var(--code-bg);
            border-radius: 0.5rem;
            margin: 1rem 0;
            overflow-x: auto;
            line-height: 1.6;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add interactive element to the page
    requirementsSection.appendChild(interactiveEl);
    
    // Set up event listeners
    const generateBtn = interactiveEl.querySelector('#generateSpec');
    const resetBtn = interactiveEl.querySelector('#resetSpec');
    const systemNameInput = interactiveEl.querySelector('#systemName');
    const functionalReqInput = interactiveEl.querySelector('#functionalReq');
    const nonFunctionalReqInput = interactiveEl.querySelector('#nonFunctionalReq');
    const generatedSpecContainer = interactiveEl.querySelector('.generated-spec-container');
    const generatedSpecDisplay = interactiveEl.querySelector('.generated-spec');
    
    generateBtn.addEventListener('click', () => {
        const systemName = systemNameInput.value.trim() || '시스템';
        const functionalReqs = functionalReqInput.value.trim().split('\n').filter(req => req.trim() !== '');
        const nonFunctionalReqs = nonFunctionalReqInput.value.trim().split('\n').filter(req => req.trim() !== '');
        
        // Generate requirements specification
        let spec = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        spec += `                 ${systemName} 요구사항 명세서\n`;
        spec += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        spec += `📋 1. 개요\n`;
        spec += `시스템명: ${systemName}\n`;
        spec += `작성일: ${new Date().toLocaleDateString('ko-KR')}\n`;
        spec += `버전: 1.0\n\n`;
        
        spec += `🔧 2. 기능 요구사항\n`;
        spec += `────────────────────────────────────────────────\n`;
        if (functionalReqs.length > 0) {
            functionalReqs.forEach((req, index) => {
                spec += `${req}\n`;
            });
        } else {
            spec += `기능 요구사항이 정의되지 않았습니다.\n`;
        }
        spec += `\n`;
        
        spec += `⚡ 3. 비기능 요구사항\n`;
        spec += `────────────────────────────────────────────────\n`;
        if (nonFunctionalReqs.length > 0) {
            nonFunctionalReqs.forEach((req, index) => {
                spec += `${req}\n`;
            });
        } else {
            spec += `비기능 요구사항이 정의되지 않았습니다.\n`;
        }
        spec += `\n`;
        
        spec += `📊 4. 요약\n`;
        spec += `────────────────────────────────────────────────\n`;
        spec += `총 기능 요구사항: ${functionalReqs.length}개\n`;
        spec += `총 비기능 요구사항: ${nonFunctionalReqs.length}개\n`;
        spec += `예상 복잡도: ${functionalReqs.length + nonFunctionalReqs.length > 10 ? '높음' : functionalReqs.length + nonFunctionalReqs.length > 5 ? '중간' : '낮음'}\n\n`;
        
        spec += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        spec += `             문서 끝\n`;
        spec += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        // Display generated specification
        generatedSpecDisplay.textContent = spec;
        generatedSpecContainer.style.display = 'block';
    });
    
    resetBtn.addEventListener('click', () => {
        systemNameInput.value = '';
        functionalReqInput.value = '';
        nonFunctionalReqInput.value = '';
        generatedSpecContainer.style.display = 'none';
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
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>테마 변경</span>';
    
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
            }
            
            themeSwitch.querySelector('span').textContent = '다크 모드';
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
            }
            
            themeSwitch.querySelector('span').textContent = '라이트 모드';
        }
        
        isDarkTheme = !isDarkTheme;
    });
}

// Add interactive elements when the content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Calculate reading time
    calculateReadingTime();
    
    // Initialize Table of Contents
    initTableOfContents();
    
    // Add theme switcher
    addThemeSwitcher();
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