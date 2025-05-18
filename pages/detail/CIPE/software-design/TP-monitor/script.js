// TP Monitor 기사를 위한 JavaScript

// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

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
    
    // Set up interactive examples for TP Monitor
    setupInteractiveExamples();
    
    // Initialize Table of Contents
    initTableOfContents();
    
    // Calculate reading time
    calculateReadingTime();
    
    // Add theme switcher
    addThemeSwitcher();
});

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
 * Sets up interactive examples for TP Monitor
 */
function setupInteractiveExamples() {
    // Set up interactive diagram highlighting
    setupDiagramHighlighting();
    
    // Create TP Monitor transaction simulator
    setupTransactionSimulator();
}

/**
 * Sets up highlighting for diagrams when hovering over related text
 */
function setupDiagramHighlighting() {
    // Sample terms to highlight
    const terms = [
        {term: '트랜잭션', highlight: '.mermaid .node'},
        {term: 'ACID', highlight: '.mermaid .messageText'},
        {term: '부하 분산', highlight: '.mermaid .cluster'},
        {term: '메시지 큐', highlight: '.mermaid .node[style*="fill:#f9d"]'},
        {term: '장애 복구', highlight: '.mermaid .note'}
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
 * Creates a simple transaction simulator
 */
function setupTransactionSimulator() {
    // Find a suitable section to add the simulator
    const transactionSection = document.querySelector('.article-section:nth-child(2)');
    
    if (!transactionSection) return;
    
    // Create interactive element
    const interactiveEl = document.createElement('div');
    interactiveEl.className = 'interactive-demo';
    interactiveEl.innerHTML = `
        <h3>체험해보기: 간단한 트랜잭션 시뮬레이터</h3>
        <p>아래 시뮬레이터를 통해 TP Monitor가 트랜잭션을 어떻게 관리하는지 체험해보세요.</p>
        
        <div class="transaction-simulator">
            <div class="simulator-controls">
                <div class="control-group">
                    <label for="txnType">트랜잭션 타입:</label>
                    <select id="txnType">
                        <option value="transfer">계좌 이체</option>
                        <option value="payment">결제 처리</option>
                        <option value="reservation">예약 처리</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label for="errorProb">오류 발생 확률:</label>
                    <input type="range" id="errorProb" min="0" max="100" value="30">
                    <span id="errorProbValue">30%</span>
                </div>
                
                <button id="runTransaction" class="run-btn">트랜잭션 실행</button>
            </div>
            
            <div class="simulator-display">
                <h4>트랜잭션 로그:</h4>
                <div class="transaction-log"></div>
            </div>
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
        
        .transaction-simulator {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-top: 1rem;
        }
        
        .simulator-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: flex-end;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .control-group label {
            font-weight: 600;
            color: var(--text-color);
        }
        
        .control-group select, .control-group input {
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid var(--border-color);
            background-color: var(--medium-bg);
            color: var(--text-color);
        }
        
        .run-btn {
            padding: 0.5rem 1rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .run-btn:hover {
            background-color: var(--primary-dark);
        }
        
        .transaction-log {
            height: 200px;
            overflow-y: auto;
            background-color: var(--code-bg);
            padding: 1rem;
            border-radius: 0.25rem;
            font-family: 'Fira Code', monospace;
            font-size: 0.85rem;
            color: var(--text-muted);
        }
        
        .log-entry {
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }
        
        .log-entry.log-success {
            color: #10b981;
        }
        
        .log-entry.log-error {
            color: #ef4444;
        }
        
        .log-entry.log-info {
            color: #3b82f6;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add interactive element to the page
    transactionSection.appendChild(interactiveEl);
    
    // Set up event listeners
    const runBtn = interactiveEl.querySelector('#runTransaction');
    const errorProbSlider = interactiveEl.querySelector('#errorProb');
    const errorProbValue = interactiveEl.querySelector('#errorProbValue');
    const txnTypeSelect = interactiveEl.querySelector('#txnType');
    const transactionLog = interactiveEl.querySelector('.transaction-log');
    
    // Update error probability value
    errorProbSlider.addEventListener('input', () => {
        errorProbValue.textContent = `${errorProbSlider.value}%`;
    });
    
    // Run transaction simulation
    runBtn.addEventListener('click', () => {
        const txnType = txnTypeSelect.value;
        const errorProb = parseInt(errorProbSlider.value);
        
        // Clear log
        transactionLog.innerHTML = '';
        
        // Start simulation
        simulateTransaction(txnType, errorProb, transactionLog);
    });
}

/**
 * Simulates a transaction process with TP Monitor
 */
function simulateTransaction(txnType, errorProb, logElement) {
    // Define transaction steps based on type
    let steps;
    switch (txnType) {
        case 'transfer':
            steps = [
                { name: '계좌 A 잔액 확인', errorMsg: '계좌 A를 찾을 수 없습니다.' },
                { name: '계좌 B 잔액 확인', errorMsg: '계좌 B를 찾을 수 없습니다.' },
                { name: '계좌 A에서 출금', errorMsg: '잔액이 부족합니다.' },
                { name: '계좌 B에 입금', errorMsg: '입금 처리 중 오류가 발생했습니다.' },
                { name: '거래 내역 기록', errorMsg: '거래 내역 기록 중 오류가 발생했습니다.' }
            ];
            break;
        case 'payment':
            steps = [
                { name: '고객 정보 확인', errorMsg: '고객 정보를 찾을 수 없습니다.' },
                { name: '상품 정보 확인', errorMsg: '상품 정보를 찾을 수 없습니다.' },
                { name: '재고 확인', errorMsg: '재고가 부족합니다.' },
                { name: '결제 처리', errorMsg: '결제가 거부되었습니다.' },
                { name: '주문 생성', errorMsg: '주문 생성 중 오류가 발생했습니다.' }
            ];
            break;
        case 'reservation':
            steps = [
                { name: '예약 가능 확인', errorMsg: '예약 가능한 좌석이 없습니다.' },
                { name: '고객 정보 확인', errorMsg: '고객 정보를 확인할 수 없습니다.' },
                { name: '좌석 임시 할당', errorMsg: '좌석 할당 중 오류가 발생했습니다.' },
                { name: '결제 처리', errorMsg: '결제가 거부되었습니다.' },
                { name: '예약 확정', errorMsg: '예약 확정 중 오류가 발생했습니다.' }
            ];
            break;
    }
    
    // Add initial log entry
    addLogEntry(logElement, `TP Monitor: ${formatTxnType(txnType)} 트랜잭션 시작`, 'log-info');
    
    // Process steps with delay
    processSteps(steps, 0, errorProb, logElement, txnType);
}

/**
 * Process transaction steps recursively
 */
function processSteps(steps, currentStep, errorProb, logElement, txnType) {
    if (currentStep >= steps.length) {
        // All steps completed successfully
        addLogEntry(logElement, `TP Monitor: 트랜잭션 커밋 완료`, 'log-success');
        return;
    }
    
    const step = steps[currentStep];
    
    // Add step log entry
    setTimeout(() => {
        addLogEntry(logElement, `단계 ${currentStep + 1}: ${step.name} 실행 중...`);
        
        // Check for error based on probability
        const error = Math.random() * 100 < errorProb;
        
        setTimeout(() => {
            if (error) {
                // Error occurred, rollback
                addLogEntry(logElement, `오류: ${step.errorMsg}`, 'log-error');
                addLogEntry(logElement, `TP Monitor: 트랜잭션 롤백 시작`, 'log-info');
                
                // Rollback previous steps
                rollbackSteps(steps, currentStep - 1, logElement);
                
                // Final rollback message
                setTimeout(() => {
                    addLogEntry(logElement, `TP Monitor: 롤백 완료. 트랜잭션 취소됨.`, 'log-error');
                }, (currentStep + 1) * 500);
            } else {
                // Step succeeded, continue to next step
                addLogEntry(logElement, `${step.name} 성공`, 'log-success');
                processSteps(steps, currentStep + 1, errorProb, logElement, txnType);
            }
        }, 500);
    }, 800);
}

/**
 * Rollback transaction steps
 */
function rollbackSteps(steps, startStep, logElement) {
    for (let i = startStep; i >= 0; i--) {
        ((step, index) => {
            setTimeout(() => {
                addLogEntry(logElement, `롤백 ${index + 1}: ${step.name} 변경사항 취소`, 'log-info');
            }, (startStep - i) * 500);
        })(steps[i], i);
    }
}

/**
 * Add an entry to the transaction log
 */
function addLogEntry(logElement, message, className = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    logElement.appendChild(entry);
    
    // Scroll to bottom
    logElement.scrollTop = logElement.scrollHeight;
}

/**
 * Format transaction type for display
 */
function formatTxnType(txnType) {
    switch (txnType) {
        case 'transfer': return '계좌이체';
        case 'payment': return '결제처리';
        case 'reservation': return '예약처리';
        default: return txnType;
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
 * Calculate and update estimated reading time
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
 * Add theme switcher for light/dark mode
 */
function addThemeSwitcher() {
    // Create the theme switch button
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>테마 전환</span>';
    
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

// Handle mermaid diagram rendering when page loads
window.addEventListener('load', function() {
    if (typeof mermaid !== 'undefined') {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
});