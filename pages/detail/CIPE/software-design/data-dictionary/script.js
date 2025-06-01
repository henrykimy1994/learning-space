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
    
    // Set up Data Dictionary specific features
    setupDataDictionaryFeatures();
    
    // Calculate reading time
    calculateReadingTime();
    
    // Initialize table of contents
    initTableOfContents();
    
    // Add theme switcher
    addThemeSwitcher();
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
                    if (button.contains(tooltip)) {
                        button.removeChild(tooltip);
                    }
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
 * Sets up Data Dictionary specific interactive features
 */
function setupDataDictionaryFeatures() {
    // Create notation symbol highlighter
    createNotationHighlighter();
    
    // Set up interactive examples
    setupInteractiveExamples();
    
    // Create data dictionary builder
    createDataDictionaryBuilder();
    
    // Set up symbol explanation tooltips
    setupSymbolTooltips();
}

/**
 * Creates notation symbol highlighter
 */
function createNotationHighlighter() {
    const notationSymbols = [
        { symbol: '=', meaning: '구성 (정의)', color: '#6366f1' },
        { symbol: '+', meaning: '연결 (순차)', color: '#10b981' },
        { symbol: '[ ]', meaning: '선택 (옵션)', color: '#f59e0b' },
        { symbol: '{ }', meaning: '반복 (0번 이상)', color: '#ef4444' },
        { symbol: '( )', meaning: '그룹핑', color: '#8b5cf6' },
        { symbol: '|', meaning: '선택 (OR)', color: '#06b6d4' }
    ];
    
    // Find all code blocks and highlight notation symbols
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        let content = block.innerHTML;
        
        notationSymbols.forEach(notation => {
            const regex = new RegExp(`\\${notation.symbol.replace(/[\[\](){}]/g, '\\$&')}`, 'g');
            const replacement = `<span class="notation-highlight" style="color: ${notation.color}; font-weight: bold;" title="${notation.meaning}">${notation.symbol}</span>`;
            content = content.replace(regex, replacement);
        });
        
        block.innerHTML = content;
    });
}

/**
 * Sets up interactive examples for better understanding
 */
function setupInteractiveExamples() {
    // Find the selection examples section
    const selectionSection = document.querySelector('.selection-examples');
    if (!selectionSection) return;
    
    // Create interactive example
    const interactiveExample = document.createElement('div');
    interactiveExample.className = 'interactive-example';
    interactiveExample.innerHTML = `
        <h4>🔧 인터랙티브 예시: 자료사전 표기법 연습</h4>
        <p>아래에서 다양한 표기법을 클릭해보세요:</p>
        
        <div class="notation-buttons">
            <button class="notation-btn" data-symbol="=" data-example="고객정보 = 고객ID + 이름 + 연락처">= (구성)</button>
            <button class="notation-btn" data-symbol="+" data-example="주소 = 우편번호 + 도시 + 상세주소">+ (연결)</button>
            <button class="notation-btn" data-symbol="[]" data-example="연락처 = 전화번호 + [이메일]">[ ] (선택)</button>
            <button class="notation-btn" data-symbol="{}" data-example="주문 = 주문번호 + {주문항목}">{} (반복)</button>
            <button class="notation-btn" data-symbol="()" data-example="이름 = (성 + 이름) | 전체이름">( ) (그룹핑)</button>
            <button class="notation-btn" data-symbol="|" data-example="성별 = '남성' | '여성' | '기타'">| (선택OR)</button>
        </div>
        
        <div class="example-display">
            <h5>예시:</h5>
            <div class="example-text">표기법을 선택해주세요</div>
        </div>
    `;
    
    selectionSection.appendChild(interactiveExample);
    
    // Add event listeners to notation buttons
    const notationButtons = interactiveExample.querySelectorAll('.notation-btn');
    const exampleDisplay = interactiveExample.querySelector('.example-text');
    
    notationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const example = button.dataset.example;
            
            // Remove active class from all buttons
            notationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update example display
            exampleDisplay.textContent = example;
            
            // Add animation
            exampleDisplay.style.opacity = '0';
            setTimeout(() => {
                exampleDisplay.style.opacity = '1';
            }, 100);
        });
    });
}

/**
 * Creates a simple data dictionary builder
 */
function createDataDictionaryBuilder() {
    // Find the case study section
    const caseStudySection = document.querySelector('.case-study');
    if (!caseStudySection) return;
    
    // Create dictionary builder
    const builderElement = document.createElement('div');
    builderElement.className = 'dictionary-builder';
    builderElement.innerHTML = `
        <h4>🛠️ 자료사전 생성기</h4>
        <p>직접 자료사전 항목을 만들어보세요!</p>
        
        <div class="builder-form">
            <div class="form-group">
                <label for="elementName">데이터 요소명:</label>
                <input type="text" id="elementName" placeholder="예: 학생정보">
            </div>
            
            <div class="form-group">
                <label for="requiredElements">필수 요소들 (쉼표로 구분):</label>
                <input type="text" id="requiredElements" placeholder="예: 학번, 이름, 학과">
            </div>
            
            <div class="form-group">
                <label for="optionalElements">선택 요소들 (쉼표로 구분):</label>
                <input type="text" id="optionalElements" placeholder="예: 이메일, 전화번호">
            </div>
            
            <button id="generateDictionary" class="generate-btn">자료사전 생성하기</button>
        </div>
        
        <div class="generated-dictionary" style="display: none;">
            <h5>생성된 자료사전:</h5>
            <div class="dictionary-output"></div>
            <button id="resetBuilder" class="reset-btn">초기화</button>
        </div>
    `;
    
    caseStudySection.appendChild(builderElement);
    
    // Add event listeners
    const generateBtn = builderElement.querySelector('#generateDictionary');
    const resetBtn = builderElement.querySelector('#resetBuilder');
    const elementNameInput = builderElement.querySelector('#elementName');
    const requiredInput = builderElement.querySelector('#requiredElements');
    const optionalInput = builderElement.querySelector('#optionalElements');
    const generatedDiv = builderElement.querySelector('.generated-dictionary');
    const outputDiv = builderElement.querySelector('.dictionary-output');
    
    generateBtn.addEventListener('click', () => {
        const elementName = elementNameInput.value.trim();
        const requiredElements = requiredInput.value.trim().split(',').map(e => e.trim()).filter(e => e);
        const optionalElements = optionalInput.value.trim().split(',').map(e => e.trim()).filter(e => e);
        
        if (!elementName || requiredElements.length === 0) {
            alert('데이터 요소명과 최소 하나의 필수 요소를 입력해주세요.');
            return;
        }
        
        // Generate dictionary notation
        let notation = `${elementName} = `;
        
        // Add required elements
        notation += requiredElements.join(' + ');
        
        // Add optional elements
        if (optionalElements.length > 0) {
            notation += ' + ' + optionalElements.map(e => `[${e}]`).join(' + ');
        }
        
        // Display the result
        outputDiv.innerHTML = `<pre><code>${notation}</code></pre>`;
        generatedDiv.style.display = 'block';
        
        // Scroll to result
        generatedDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    resetBtn.addEventListener('click', () => {
        elementNameInput.value = '';
        requiredInput.value = '';
        optionalInput.value = '';
        generatedDiv.style.display = 'none';
    });
}

/**
 * Sets up symbol explanation tooltips
 */
function setupSymbolTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'symbol-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'var(--light-bg)';
    tooltip.style.color = 'var(--text-color)';
    tooltip.style.padding = '0.5rem 1rem';
    tooltip.style.borderRadius = '0.25rem';
    tooltip.style.fontSize = '0.8rem';
    tooltip.style.zIndex = '1000';
    tooltip.style.display = 'none';
    tooltip.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    tooltip.style.maxWidth = '200px';
    tooltip.style.wordWrap = 'break-word';
    
    document.body.appendChild(tooltip);
    
    // Add event listeners to notation highlights
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('notation-highlight')) {
            const title = e.target.getAttribute('title');
            if (title) {
                tooltip.textContent = title;
                tooltip.style.display = 'block';
                
                // Position tooltip
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
            }
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('notation-highlight')) {
            tooltip.style.display = 'none';
        }
    });
}

/**
 * Calculate and display reading time
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
 * Initialize table of contents
 */
function initTableOfContents() {
    const article = document.querySelector('.article-content');
    const headings = article.querySelectorAll('h2, h3');
    
    // If there are not enough headings, don't create a TOC
    if (headings.length < 3) return;
    
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h4>📚 목차</h4>';
    
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
}

/**
 * Add theme switcher functionality
 */
function addThemeSwitcher() {
    // Create the theme switch button
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>테마 변경</span>';
    
    // Style the button
    Object.assign(themeSwitch.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '100',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease'
    });
    
    // Add hover effect
    themeSwitch.addEventListener('mouseenter', () => {
        themeSwitch.style.transform = 'translateY(-2px)';
        themeSwitch.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });
    
    themeSwitch.addEventListener('mouseleave', () => {
        themeSwitch.style.transform = 'translateY(0)';
        themeSwitch.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
    
    // Add the button to the body
    document.body.appendChild(themeSwitch);
    
    // Set up click event
    let isDarkTheme = true;
    themeSwitch.addEventListener('click', () => {
        const root = document.documentElement;
        
        if (isDarkTheme) {
            // Switch to light theme
            root.style.setProperty('--dark-bg', '#f8fafc');
            root.style.setProperty('--medium-bg', '#f1f5f9');
            root.style.setProperty('--light-bg', '#e2e8f0');
            root.style.setProperty('--text-color', '#0f172a');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--border-color', '#cbd5e1');
            root.style.setProperty('--code-bg', '#f8fafc');
            
            themeSwitch.querySelector('span').textContent = '다크 모드';
        } else {
            // Switch to dark theme
            root.style.setProperty('--dark-bg', '#111827');
            root.style.setProperty('--medium-bg', '#1f2937');
            root.style.setProperty('--light-bg', '#374151');
            root.style.setProperty('--text-color', '#f3f4f6');
            root.style.setProperty('--text-muted', '#9ca3af');
            root.style.setProperty('--border-color', '#4b5563');
            root.style.setProperty('--code-bg', '#0f172a');
            
            themeSwitch.querySelector('span').textContent = '라이트 모드';
        }
        
        isDarkTheme = !isDarkTheme;
    });
}

// Add CSS for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .interactive-example {
            background-color: rgba(16, 185, 129, 0.1);
            border-radius: 0.5rem;
            padding: 2rem;
            margin: 2rem 0;
            border-left: 4px solid var(--secondary-color);
        }
        
        .notation-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .notation-btn {
            background-color: var(--light-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Fira Code', monospace;
        }
        
        .notation-btn:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }
        
        .notation-btn.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .example-display {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: var(--medium-bg);
            border-radius: 0.5rem;
        }
        
        .example-text {
            font-family: 'Fira Code', monospace;
            font-size: 1.1rem;
            color: var(--accent-color);
            transition: opacity 0.3s;
        }
        
        .dictionary-builder {
            background-color: rgba(99, 102, 241, 0.1);
            border-radius: 0.5rem;
            padding: 2rem;
            margin: 2rem 0;
            border-left: 4px solid var(--primary-color);
        }
        
        .builder-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .form-group label {
            font-weight: 600;
            color: var(--text-color);
        }
        
        .form-group input {
            padding: 0.75rem;
            border-radius: 0.25rem;
            border: 1px solid var(--border-color);
            background-color: var(--medium-bg);
            color: var(--text-color);
            font-size: 0.9rem;
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
        
        .generated-dictionary {
            margin-top: 2rem;
        }
        
        .dictionary-output {
            background-color: var(--code-bg);
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
        }
        
        .table-of-contents {
            background-color: var(--light-bg);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-left: 4px solid var(--primary-color);
        }
        
        .table-of-contents h4 {
            margin-bottom: 1rem;
            font-size: 1.2rem;
            color: var(--primary-color);
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
        
        .notation-highlight {
            position: relative;
            cursor: help;
        }
        
        @media (max-width: 768px) {
            .notation-buttons {
                flex-direction: column;
            }
            
            .notation-btn {
                text-align: center;
            }
            
            .builder-form {
                gap: 0.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
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