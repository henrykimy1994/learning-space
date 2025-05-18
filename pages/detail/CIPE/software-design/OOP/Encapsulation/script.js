// 정보 은닉과 캡슐화 예제를 위한 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 코드 복사 기능 설정
    setupCodeCopy();
    
    // 모바일 메뉴 설정
    setupMobileMenu();
    
    // 부드러운 스크롤 설정
    setupSmoothScroll();
    
    // mermaid 다이어그램 초기화
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
    
    // 코드 하이라이팅 초기화
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // 캡슐화 인터랙티브 데모 설정
    setupEncapsulationDemo();
    
    // 목차 초기화
    initTableOfContents();
    
    // 읽기 시간 계산
    calculateReadingTime();
});

/**
 * 코드 복사 기능 설정
 */
function setupCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 관련 코드 블록 찾기
            const codeBlock = button.closest('.code-block').querySelector('pre code');
            const codeText = codeBlock.textContent;
            
            // 복사를 위한 임시 textarea 생성
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // 텍스트 선택 및 복사
            textarea.select();
            document.execCommand('copy');
            
            // textarea 제거
            document.body.removeChild(textarea);
            
            // 성공 메시지 표시
            const tooltip = document.createElement('span');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            
            // 기존 툴팁 제거
            const existingTooltip = button.querySelector('.copy-tooltip');
            if (existingTooltip) {
                button.removeChild(existingTooltip);
            }
            
            // 새 툴팁 추가
            button.appendChild(tooltip);
            
            // 툴팁 표시
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
            
            // 2초 후 툴팁 숨기고 제거
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
 * 모바일 메뉴 기능 설정
 */
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (!menuButton || !nav) return;
    
    menuButton.addEventListener('click', () => {
        // 모바일 메뉴가 없으면 생성
        if (!document.querySelector('.mobile-menu')) {
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            // 내비게이션 항목 복제
            const navClone = nav.cloneNode(true);
            
            // 모바일 메뉴에 추가
            mobileMenu.appendChild(navClone);
            
            // 모바일 메뉴 스타일 추가
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = '60px';
            mobileMenu.style.left = '0';
            mobileMenu.style.right = '0';
            mobileMenu.style.backgroundColor = 'var(--medium-bg)';
            mobileMenu.style.padding = '1rem';
            mobileMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            mobileMenu.style.zIndex = '999';
            mobileMenu.style.display = 'none';
            
            // 리스트 스타일 추가
            const list = mobileMenu.querySelector('ul');
            list.style.display = 'flex';
            list.style.flexDirection = 'column';
            list.style.gap = '1rem';
            
            // 헤더에 모바일 메뉴 추가
            document.querySelector('header').appendChild(mobileMenu);
        }
        
        // 모바일 메뉴 토글
        const mobileMenu = document.querySelector('.mobile-menu');
        const isVisible = mobileMenu.style.display === 'block';
        
        mobileMenu.style.display = isVisible ? 'none' : 'block';
        
        // 아이콘 변경 애니메이션
        if (isVisible) {
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            menuButton.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    // 외부 클릭 시 모바일 메뉴 닫기
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
 * 앵커 링크를 위한 부드러운 스크롤 설정
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
                    top: targetElement.offsetTop - 80, // 고정 헤더를 위한 오프셋
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 캡슐화 인터랙티브 데모 설정
 */
function setupEncapsulationDemo() {
    // BankAccount 클래스 (ES6 클래스 문법 사용)
    class BankAccount {
        // 프라이빗 필드 (ES2022 이상 지원)
        #accountNumber;
        #balance;
        
        constructor(accountNumber, initialBalance = 0) {
            this.#accountNumber = accountNumber;
            this.#balance = initialBalance;
        }
        
        // 퍼블릭 메서드
        getBalance() {
            return this.#balance;
        }
        
        deposit(amount) {
            if (amount > 0) {
                this.#balance += amount;
                return true;
            }
            return false;
        }
        
        withdraw(amount) {
            if (amount > 0 && this.#balance >= amount) {
                this.#balance -= amount;
                return true;
            }
            return false;
        }
        
        // 프라이빗 메서드
        #logTransaction(type, amount) {
            console.log(`Transaction: ${type} $${amount}`);
        }
    }
    
    // DOM 요소 가져오기
    const balanceValue = document.getElementById('balance-value');
    const getBalanceBtn = document.getElementById('get-balance');
    const depositBtn = document.getElementById('deposit');
    const depositAmount = document.getElementById('deposit-amount');
    const withdrawBtn = document.getElementById('withdraw');
    const withdrawAmount = document.getElementById('withdraw-amount');
    const directAccessBtn = document.getElementById('direct-access');
    const directAccessMessage = document.getElementById('direct-access-message');
    const consoleOutput = document.getElementById('console-output');
    const clearConsoleBtn = document.getElementById('clear-console');
    
    // 요소가 없으면 함수 종료 (데모가 페이지에 포함되지 않은 경우)
    if (!balanceValue) return;
    
    // BankAccount 인스턴스 생성
    const account = new BankAccount('AC12345', 0);
    
    // 콘솔 로그 함수
    function logToConsole(message, type = 'info') {
        const logElement = document.createElement('div');
        logElement.className = `log-message log-${type}`;
        logElement.textContent = message;
        consoleOutput.appendChild(logElement);
        
        // 스크롤을 아래로 이동
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // 초기 잔액 표시
    balanceValue.textContent = account.getBalance().toFixed(2);
    
    // 잔액 조회 버튼
    getBalanceBtn.addEventListener('click', () => {
        const balance = account.getBalance();
        logToConsole(`> account.getBalance()`, 'info');
        logToConsole(`< ${balance.toFixed(2)}`, 'success');
    });
    
    // 입금 버튼
    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(depositAmount.value);
        
        if (isNaN(amount)) {
            logToConsole(`오류: 유효한 금액을 입력하세요.`, 'error');
            return;
        }
        
        logToConsole(`> account.deposit(${amount.toFixed(2)})`, 'info');
        
        const success = account.deposit(amount);
        
        if (success) {
            balanceValue.textContent = account.getBalance().toFixed(2);
            logToConsole(`< true - 입금 성공. 새 잔액: ${account.getBalance().toFixed(2)}`, 'success');
        } else {
            logToConsole(`< false - 입금 실패. 잔액: ${account.getBalance().toFixed(2)}`, 'error');
        }
        
        depositAmount.value = '';
    });
    
    // 출금 버튼
    withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(withdrawAmount.value);
        
        if (isNaN(amount)) {
            logToConsole(`오류: 유효한 금액을 입력하세요.`, 'error');
            return;
        }
        
        logToConsole(`> account.withdraw(${amount.toFixed(2)})`, 'info');
        
        const success = account.withdraw(amount);
        
        if (success) {
            balanceValue.textContent = account.getBalance().toFixed(2);
            logToConsole(`< true - 출금 성공. 새 잔액: ${account.getBalance().toFixed(2)}`, 'success');
        } else {
            logToConsole(`< false - 출금 실패. 잔액: ${account.getBalance().toFixed(2)}`, 'error');
        }
        
        withdrawAmount.value = '';
    });
    
    // 직접 접근 시도 버튼
    directAccessBtn.addEventListener('click', () => {
        logToConsole(`> account.balance = 1000000`, 'info');
        
        // 직접 접근 오류 메시지 표시
        directAccessMessage.style.display = 'block';
        
        // 오류 메시지 로그
        logToConsole(`< 오류: Private 필드 'balance'에 직접 접근할 수 없습니다!`, 'error');
        
        // 2초 후 오류 메시지 숨기기
        setTimeout(() => {
            directAccessMessage.style.display = 'none';
        }, 3000);
    });
    
    // 콘솔 지우기 버튼
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });
    
    // 초기 로그 메시지
    logToConsole('계좌가 생성되었습니다. 위의 메서드를 사용하여 상호작용하세요.', 'info');
}

/**
 * 목차 초기화
 */
function initTableOfContents() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    const headings = article.querySelectorAll('h2, h3');
    
    // 헤딩이 충분하지 않으면 목차를 생성하지 않음
    if (headings.length < 3) return;
    
    // 목차 컨테이너 생성
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h4>목차</h4>';
    
    // 리스트 생성
    const tocList = document.createElement('ul');
    
    // 각 헤딩을 목차에 추가
    headings.forEach((heading, index) => {
        // ID가 없으면 헤딩에 ID 추가
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }
        
        // 리스트 항목 생성
        const listItem = document.createElement('li');
        listItem.className = heading.tagName.toLowerCase();
        
        // 링크 생성
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        
        // 리스트 항목에 추가
        listItem.appendChild(link);
        
        // 목차 리스트에 추가
        tocList.appendChild(listItem);
    });
    
    // 목차 컨테이너에 리스트 추가
    tocContainer.appendChild(tocList);
    
    // 첫 번째 섹션 앞에 목차 삽입
    const firstSection = article.querySelector('.article-section');
    article.insertBefore(tocContainer, firstSection);
}

/**
 * 예상 읽기 시간 계산
 */
function calculateReadingTime() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    // 모든 텍스트 콘텐츠 가져오기
    const text = article.textContent;
    
    // 단어 수 계산 (대략적인 추정)
    const words = text.split(/\s+/).length;
    
    // 평균 읽기 속도: 분당 200-250단어
    const readingTime = Math.ceil(words / 225);
    
    // 히어로 섹션의 읽기 시간 업데이트
    const readingTimeElement = document.querySelector('.hero-meta .far.fa-clock').parentNode.querySelector('span');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

// 페이지 로드 시 코드 스니펫 하이라이팅 처리
window.addEventListener('load', function() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // 페이지가 완전히 로드된 후 mermaid 다이어그램 다시 렌더링
    if (typeof mermaid !== 'undefined') {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }
});