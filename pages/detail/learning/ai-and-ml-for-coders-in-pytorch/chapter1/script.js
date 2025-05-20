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
    
    // Set up interactive examples for ML
    setupInteractiveLearning();
    
    // Calculate reading time
    calculateReadingTime();
    
    // Initialize Table of Contents
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
 * Sets up interactive machine learning visualization
 */
function setupInteractiveLearning() {
    // Create an interactive linear regression demo
    createLinearRegressionDemo();
    
    // Create ML vs Traditional Programming visual comparison
    createProgrammingComparison();
    
    // Add interactive code execution for PyTorch example
    setupPyTorchDemo();
}

/**
 * Creates interactive linear regression visualization
 */
function createLinearRegressionDemo() {
    // Find the PyTorch section to add this to
    const pytorchSection = document.querySelector('.article-section:nth-child(6)');
    if (!pytorchSection) return;
    
    // Create demo container
    const demoContainer = document.createElement('div');
    demoContainer.className = 'interactive-demo';
    demoContainer.innerHTML = `
        <h3>Interactive Demo: Linear Regression</h3>
        <p>See how a linear model learns to fit data points over time. Click "Train Model" to see the learning process in action.</p>
        
        <div class="canvas-container">
            <canvas id="regressionCanvas" width="500" height="300"></canvas>
        </div>
        
        <div class="controls">
            <button id="resetDataBtn" class="reset-btn">Reset Data</button>
            <button id="trainModelBtn" class="generate-btn">Train Model</button>
            <div class="training-info">
                <span id="iterationCounter">Iteration: 0</span>
                <span id="lossValue">Loss: N/A</span>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .canvas-container {
            background-color: var(--code-bg);
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        #regressionCanvas {
            width: 100%;
            height: auto;
            max-width: 500px;
            display: block;
            margin: 0 auto;
        }
        
        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
            margin-top: 1rem;
        }
        
        .training-info {
            display: flex;
            gap: 1rem;
            margin-left: auto;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            color: var(--text-muted);
        }
    `;
    
    document.head.appendChild(style);
    
    // Add demo to the page after the PyTorch code example
    const codeBlock = pytorchSection.querySelector('.code-block');
    if (codeBlock) {
        codeBlock.insertAdjacentElement('afterend', demoContainer);
    } else {
        pytorchSection.appendChild(demoContainer);
    }
    
    // Initialize canvas for the demo once DOM is fully loaded
    window.addEventListener('load', () => {
        const canvas = document.getElementById('regressionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Data points for demonstration
        let dataPoints = [
            { x: 50, y: 250 },
            { x: 100, y: 200 },
            { x: 150, y: 160 },
            { x: 200, y: 120 },
            { x: 250, y: 100 },
            { x: 300, y: 70 },
            { x: 350, y: 30 },
            { x: 400, y: 20 }
        ];
        
        // Model parameters
        let weight = 0;
        let bias = 150;
        let iteration = 0;
        let currentLoss = 0;
        
        // Draw functions
        function drawAxes() {
            ctx.strokeStyle = '#4b5563';
            ctx.lineWidth = 1;
            
            // X-axis
            ctx.beginPath();
            ctx.moveTo(50, 250);
            ctx.lineTo(450, 250);
            ctx.stroke();
            
            // Y-axis
            ctx.beginPath();
            ctx.moveTo(50, 250);
            ctx.lineTo(50, 50);
            ctx.stroke();
            
            // Axis labels
            ctx.fillStyle = '#9ca3af';
            ctx.font = '12px sans-serif';
            ctx.fillText('x', 450, 270);
            ctx.fillText('y', 30, 50);
        }
        
        function drawDataPoints() {
            ctx.fillStyle = '#6366f1';
            
            dataPoints.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        function drawLine() {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            
            const startX = 50;
            const endX = 450;
            const startY = -weight * startX + bias;
            const endY = -weight * endX + bias;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawAxes();
            drawDataPoints();
            drawLine();
        }
        
        // Model training functions
        function calculateLoss() {
            let totalLoss = 0;
            dataPoints.forEach(point => {
                const predicted = -weight * point.x + bias;
                const error = predicted - point.y;
                totalLoss += error * error;
            });
            return totalLoss / dataPoints.length;
        }
        
        function trainStep() {
            const learningRate = 0.0001;
            let weightGradient = 0;
            let biasGradient = 0;
            
            dataPoints.forEach(point => {
                const predicted = -weight * point.x + bias;
                const error = predicted - point.y;
                weightGradient += -2 * point.x * error;
                biasGradient += 2 * error;
            });
            
            weightGradient /= dataPoints.length;
            biasGradient /= dataPoints.length;
            
            weight -= learningRate * weightGradient;
            bias -= learningRate * biasGradient;
            
            iteration++;
            currentLoss = calculateLoss();
            
            // Update UI
            document.getElementById('iterationCounter').textContent = `Iteration: ${iteration}`;
            document.getElementById('lossValue').textContent = `Loss: ${currentLoss.toFixed(2)}`;
            
            drawCanvas();
        }
        
        // Initialize demo
        drawCanvas();
        
        // Set up event listeners
        document.getElementById('resetDataBtn').addEventListener('click', () => {
            weight = 0;
            bias = 150;
            iteration = 0;
            currentLoss = calculateLoss();
            
            document.getElementById('iterationCounter').textContent = `Iteration: ${iteration}`;
            document.getElementById('lossValue').textContent = `Loss: ${currentLoss.toFixed(2)}`;
            
            drawCanvas();
        });
        
        document.getElementById('trainModelBtn').addEventListener('click', () => {
            // Train for a number of iterations
            const intervalId = setInterval(() => {
                trainStep();
                
                if (iteration >= 100) {
                    clearInterval(intervalId);
                }
            }, 30);
        });
    });
}

/**
 * Creates visual comparison between ML and traditional programming
 */
function createProgrammingComparison() {
    const comparisonSection = document.querySelector('.article-section:nth-child(3)');
    if (!comparisonSection) return;
    
    const comparisonDiv = document.createElement('div');
    comparisonDiv.className = 'concept-visualization';
    comparisonDiv.innerHTML = `
        <div class="comparison-wrapper">
            <div class="comparison-item">
                <h4>Traditional Programming</h4>
                <div class="comparison-diagram traditional">
                    <div class="box data">Data</div>
                    <div class="arrow">↓</div>
                    <div class="box rules">Rules/Logic<br>(Human Created)</div>
                    <div class="arrow">↓</div>
                    <div class="box output">Answers</div>
                </div>
            </div>
            <div class="comparison-vs">VS</div>
            <div class="comparison-item">
                <h4>Machine Learning</h4>
                <div class="comparison-diagram ml">
                    <div class="box data">Data</div>
                    <div class="arrow">↓</div>
                    <div class="box data">Expected Answers</div>
                    <div class="arrow">↓</div>
                    <div class="box ml-box">Machine Learning<br>(Computer Derives Rules)</div>
                    <div class="arrow">↓</div>
                    <div class="box output">Predictions</div>
                </div>
            </div>
        </div>
        <p class="img-caption">A visual comparison of traditional programming vs. machine learning approaches</p>
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .comparison-wrapper {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .comparison-item {
            flex: 1;
            min-width: 250px;
            max-width: 350px;
        }
        
        .comparison-item h4 {
            text-align: center;
            margin-bottom: 1rem;
            color: var(--text-color);
        }
        
        .comparison-diagram {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background-color: var(--light-bg);
            border-radius: 0.5rem;
        }
        
        .comparison-vs {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--text-muted);
        }
        
        .box {
            padding: 1rem;
            width: 100%;
            text-align: center;
            border-radius: 0.4rem;
            font-weight: 500;
        }
        
        .data {
            background-color: rgba(99, 102, 241, 0.2);
            border: 1px solid var(--primary-color);
        }
        
        .rules {
            background-color: rgba(99, 102, 241, 0.4);
            border: 1px solid var(--primary-color);
        }
        
        .ml-box {
            background-color: rgba(16, 185, 129, 0.4);
            border: 1px solid var(--secondary-color);
        }
        
        .output {
            background-color: rgba(99, 102, 241, 0.2);
            border: 1px solid var(--primary-color);
        }
        
        .arrow {
            font-size: 1.5rem;
            color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
            .comparison-vs {
                transform: rotate(90deg);
                margin: 1rem 0;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Insert after the first paragraph
    const paragraph = comparisonSection.querySelector('p');
    if (paragraph) {
        paragraph.insertAdjacentElement('afterend', comparisonDiv);
    } else {
        comparisonSection.appendChild(comparisonDiv);
    }
}

/**
 * Sets up interactive PyTorch demo
 */
function setupPyTorchDemo() {
    // This would be more complex to implement fully, but we can add a simulated version
    const exampleSection = document.querySelector('.article-section:nth-child(6)');
    if (!exampleSection) return;
    
    // Add a "Run Code" button to the PyTorch code block
    const codeBlock = exampleSection.querySelector('.code-block');
    if (!codeBlock) return;
    
    const codeHeader = codeBlock.querySelector('.code-header');
    const runButton = document.createElement('button');
    runButton.className = 'run-btn';
    runButton.innerHTML = '<i class="fas fa-play"></i> <span>Run Code</span>';
    runButton.style.backgroundColor = 'var(--secondary-color)';
    runButton.style.color = 'white';
    runButton.style.border = 'none';
    runButton.style.borderRadius = '0.25rem';
    runButton.style.padding = '0.3rem 0.6rem';
    runButton.style.fontSize = '0.85rem';
    runButton.style.cursor = 'pointer';
    runButton.style.marginLeft = '0.5rem';
    
    codeHeader.appendChild(runButton);
    
    // Create output area below code block
    const outputArea = document.createElement('div');
    outputArea.className = 'code-output';
    outputArea.style.display = 'none';
    outputArea.style.backgroundColor = 'var(--code-bg)';
    outputArea.style.padding = '1rem';
    outputArea.style.borderRadius = '0 0 0.5rem 0.5rem';
    outputArea.style.fontFamily = "'Fira Code', monospace";
    outputArea.style.fontSize = '0.9rem';
    outputArea.style.color = 'var(--text-muted)';
    outputArea.style.whiteSpace = 'pre-wrap';
    outputArea.style.overflow = 'auto';
    outputArea.style.maxHeight = '300px';
    
    codeBlock.appendChild(outputArea);
    
    // Simulated output for the PyTorch example
    const simulatedOutput = `Epoch   0 → Loss: 7.0000e+00
Epoch  25 → Loss: 3.2589e+00
Epoch  50 → Loss: 1.5218e+00
Epoch  75 → Loss: 7.1091e-01
Epoch 100 → Loss: 3.3207e-01
Epoch 125 → Loss: 1.5512e-01
Epoch 150 → Loss: 7.2469e-02
Epoch 175 → Loss: 3.3865e-02
Epoch 200 → Loss: 1.5822e-02
Epoch 225 → Loss: 7.3930e-03
Epoch 250 → Loss: 3.4555e-03
Epoch 275 → Loss: 1.6150e-03
Epoch 300 → Loss: 7.5487e-04
Epoch 325 → Loss: 3.5279e-04
Epoch 350 → Loss: 1.6486e-04
Epoch 375 → Loss: 7.7043e-05
Epoch 400 → Loss: 3.6003e-05
Epoch 425 → Loss: 1.6832e-05
Epoch 450 → Loss: 7.8650e-06
Epoch 475 → Loss: 3.6764e-06
Epoch 490 → Loss: 2.0778e-06
Epoch 491 → Loss: 2.0150e-06
Epoch 492 → Loss: 1.9540e-06
Epoch 493 → Loss: 1.8947e-06
Epoch 494 → Loss: 1.8370e-06
Epoch 495 → Loss: 1.7809e-06
Epoch 496 → Loss: 1.7264e-06
Epoch 497 → Loss: 1.6733e-06
Epoch 498 → Loss: 1.6217e-06
Epoch 499 → Loss: 1.5715e-06

Prediction for x=10.0: 19.9982

Learned formula: y = 2.0000 * x + 0.9982`;
    
    // Add event listener to the run button
    runButton.addEventListener('click', () => {
        // Toggle output area
        if (outputArea.style.display === 'none') {
            outputArea.style.display = 'block';
            outputArea.innerHTML = '<div class="loading"></div>';
            
            // Simulate computation time
            setTimeout(() => {
                outputArea.innerHTML = simulatedOutput;
            }, 1500);
            
            runButton.innerHTML = '<i class="fas fa-stop"></i> <span>Hide Output</span>';
        } else {
            outputArea.style.display = 'none';
            runButton.innerHTML = '<i class="fas fa-play"></i> <span>Run Code</span>';
        }
    });
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
}

/**
 * Add syntax highlighting theme switcher
 */
function addThemeSwitcher() {
    // Create the theme switch button
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<i class="fas fa-adjust"></i> <span>Switch Theme</span>';
    
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
                
                // Re-render mermaid diagrams
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }
            
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
                
                // Re-render mermaid diagrams
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }
            
            themeSwitch.querySelector('span').textContent = 'Light Mode';
        }
        
        isDarkTheme = !isDarkTheme;
        
        // Highlight code blocks again after theme change
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    });
}

// Handle code snippet highlighting when page loads
window.addEventListener('load', function() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Re-render mermaid diagrams after page is fully loaded
    if (typeof mermaid !== 'undefined') {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
    
    // Highlight active navigation item
    highlightCurrentNav();
});

/**
 * Highlight current navigation item based on URL
 */
function highlightCurrentNav() {
    const currentPath = window.location.pathname;
    
    // Get all nav links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // If the link path matches the current path or if it's index.html and we're at the root
        if (linkPath === currentPath || (linkPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            link.style.color = 'var(--primary-color)';
            link.style.fontWeight = '600';
        }
    });
}

/**
 * Create a progress indicator to show reading progress
 */
function createReadingProgressIndicator() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.backgroundColor = 'var(--primary-color)';
    progressBar.style.zIndex = '1001';
    progressBar.style.transition = 'width 0.1s';
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.article');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        // Calculate reading progress
        const totalToRead = articleHeight - windowHeight;
        const hasRead = scrollTop - articleTop;
        
        // Calculate percentage and cap between 0 and 100
        let percentage = (hasRead / totalToRead) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Update progress bar
        progressBar.style.width = `${percentage}%`;
    });
}

/**
 * Add animations for section transitions
 */
function setupSectionAnimations() {
    const sections = document.querySelectorAll('.article-section');
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animate child elements
                const childElements = entry.target.querySelectorAll('h2, h3, p, .code-block, .mermaid-diagram, ul, ol');
                childElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    });
    
    // Observe each section
    sections.forEach(section => {
        // Set initial styles
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        section.style.transform = 'translateY(20px)';
        
        // Add to observer
        observer.observe(section);
        
        // Set initial styles for child elements
        const childElements = section.querySelectorAll('h2, h3, p, .code-block, .mermaid-diagram, ul, ol');
        childElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            element.style.transform = 'translateY(20px)';
        });
    });
}

/**
 * Set up visualized learning steps for the article
 */
function createLearningSteps() {
    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'methodology-steps';
    
    // Create step progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'step-progress';
    
    // Step names based on our article sections
    const stepNames = [
        'Programming Paradigms',
        'Traditional Programming',
        'Machine Learning',
        'Key ML Concepts',
        'PyTorch Introduction',
        'PyTorch Example'
    ];
    
    // Create steps
    for (let i = 0; i < stepNames.length; i++) {
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
        const scrollPosition = window.scrollY + 300; // Offset for better tracking
        const articleSections = document.querySelectorAll('.article-section');
        
        // Find current section
        let currentIndex = 0;
        for (let i = 0; i < articleSections.length; i++) {
            if (scrollPosition >= articleSections[i].offsetTop) {
                currentIndex = i;
                stepsContainer.classList.add('fade-in');
                stepsContainer.style.display = 'block';
            }
        }
        
        // Hide when not in article content
        const article = document.querySelector('.article');
        if (!article) return;
        
        if (scrollPosition < article.offsetTop || scrollPosition > (article.offsetTop + article.offsetHeight)) {
            stepsContainer.classList.remove('fade-in');
        }
        
        // Update steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index <= currentIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    });
}

/**
 * Add share functionality to the article
 */
function addShareButtons() {
    const authorSection = document.querySelector('.author-section');
    if (!authorSection) return;
    
    // Create share container
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-container';
    shareContainer.innerHTML = `
        <h4>Share this article</h4>
        <div class="share-buttons">
            <button class="share-btn twitter"><i class="fab fa-twitter"></i></button>
            <button class="share-btn facebook"><i class="fab fa-facebook-f"></i></button>
            <button class="share-btn linkedin"><i class="fab fa-linkedin-in"></i></button>
            <button class="share-btn email"><i class="fas fa-envelope"></i></button>
            <button class="share-btn link"><i class="fas fa-link"></i></button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .share-container {
            margin-top: 2rem;
            text-align: center;
        }
        
        .share-container h4 {
            margin-bottom: 1rem;
            font-size: 1.1rem;
            color: var(--text-color);
        }
        
        .share-buttons {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .share-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background-color: var(--light-bg);
            color: var(--text-color);
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .share-btn:hover {
            transform: translateY(-3px);
            background-color: var(--primary-color);
            color: white;
        }
        
        .share-btn.twitter:hover {
            background-color: #1DA1F2;
        }
        
        .share-btn.facebook:hover {
            background-color: #4267B2;
        }
        
        .share-btn.linkedin:hover {
            background-color: #0e76a8;
        }
        
        .share-btn.email:hover {
            background-color: #EA4335;
        }
        
        .share-btn.link:hover {
            background-color: #10b981;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add to the page
    authorSection.appendChild(shareContainer);
    
    // Set up event listeners
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    
    // Twitter
    shareContainer.querySelector('.twitter').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
    });
    
    // Facebook
    shareContainer.querySelector('.facebook').addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    });
    
    // LinkedIn
    shareContainer.querySelector('.linkedin').addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
    });
    
    // Email
    shareContainer.querySelector('.email').addEventListener('click', () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent('Check out this article: ' + pageUrl)}`;
    });
    
    // Copy link
    shareContainer.querySelector('.link').addEventListener('click', () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            // Show copied notification
            const notification = document.createElement('div');
            notification.textContent = 'Link copied!';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'var(--primary-color)';
            notification.style.color = 'white';
            notification.style.padding = '0.5rem 1rem';
            notification.style.borderRadius = '0.25rem';
            notification.style.zIndex = '1000';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        });
    });
}

/**
 * Initialize additional features on document load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set up progress indicator for reading
    createReadingProgressIndicator();
    
    // Add section transition animations
    setupSectionAnimations();
    
    // Create step indicators
    createLearningSteps();
    
    // Add share buttons
    addShareButtons();
    
    // Add service worker registration for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    }
});