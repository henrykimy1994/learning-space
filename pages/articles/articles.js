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
    
    // Set up filter dropdowns
    setupFilterDropdowns();
    
    // Set up search functionality
    setupSearch();
    
    // Set up filter functionality
    setupFilters();
    
    // Set up pagination
    setupPagination();
    
    // Set up newsletter form
    setupNewsletterForm();
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
 * Set up filter dropdowns
 */
function setupFilterDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-btn');
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Prevent dropdown from closing when clicking inside it
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

/**
 * Set up search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Function to perform search
    const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // If search is empty, remove search filter
            removeFilter('search');
            return;
        }
        
        // Add search filter
        applyFilter('search', searchTerm, `Search: "${searchTerm}"`);
        
        // Apply filters
        filterArticles();
    };
    
    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Search on Enter key press
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

/**
 * Set up filters functionality
 */
function setupFilters() {
    // Store active filters
    window.activeFilters = {
        categories: [],
        date: 'all',
        sort: 'newest'
    };
    
    // Set up category filters
    setupCategoryFilters();
    
    // Set up date filters
    setupDateFilters();
    
    // Set up sort filters
    setupSortFilters();
    
    // Set up clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            clearAllFilters();
        });
    }
}

/**
 * Set up category filters
 */
function setupCategoryFilters() {
    const allCategoriesCheckbox = document.getElementById('cat-all');
    const categoryCheckboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]:not(#cat-all)');
    
    // Handle "All Categories" checkbox
    if (allCategoriesCheckbox) {
        allCategoriesCheckbox.addEventListener('change', () => {
            if (allCategoriesCheckbox.checked) {
                // Uncheck all other category checkboxes
                categoryCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Remove all category filters
                window.activeFilters.categories = [];
                
                // Remove category filter tags
                const categoryFilterTags = document.querySelectorAll('.filter-tag[data-filter-type="category"]');
                categoryFilterTags.forEach(tag => tag.remove());
                
                // Apply filters
                filterArticles();
            }
        });
    }
    
    // Handle individual category checkboxes
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const categoryId = checkbox.id.replace('cat-', '');
            const categoryName = checkbox.nextElementSibling.textContent;
            
            if (checkbox.checked) {
                // Uncheck "All Categories" checkbox
                if (allCategoriesCheckbox) {
                    allCategoriesCheckbox.checked = false;
                }
                
                // Add category to active filters
                if (!window.activeFilters.categories.includes(categoryId)) {
                    window.activeFilters.categories.push(categoryId);
                    
                    // Add category filter tag
                    applyFilter('category', categoryId, categoryName);
                }
            } else {
                // Remove category from active filters
                window.activeFilters.categories = window.activeFilters.categories.filter(cat => cat !== categoryId);
                
                // Remove category filter tag
                removeFilter('category', categoryId);
                
                // If no categories selected, check "All Categories" checkbox
                if (window.activeFilters.categories.length === 0 && allCategoriesCheckbox) {
                    allCategoriesCheckbox.checked = true;
                }
            }
            
            // Apply filters
            filterArticles();
        });
    });
}

/**
 * Set up date filters
 */
function setupDateFilters() {
    const dateRadios = document.querySelectorAll('input[name="date-filter"]');
    
    dateRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const dateFilter = radio.id.replace('date-', '');
                const dateLabel = radio.nextElementSibling.textContent;
                
                // Update active filters
                window.activeFilters.date = dateFilter;
                
                // Remove existing date filter tags
                const dateFilterTags = document.querySelectorAll('.filter-tag[data-filter-type="date"]');
                dateFilterTags.forEach(tag => tag.remove());
                
                // Add new date filter tag if not "all"
                if (dateFilter !== 'all') {
                    applyFilter('date', dateFilter, dateLabel);
                }
                
                // Apply filters
                filterArticles();
            }
        });
    });
}

/**
 * Set up sort filters
 */
function setupSortFilters() {
    const sortRadios = document.querySelectorAll('input[name="sort-filter"]');
    
    sortRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const sortFilter = radio.id.replace('sort-', '');
                
                // Update active filters
                window.activeFilters.sort = sortFilter;
                
                // Apply filters
                filterArticles();
            }
        });
    });
}

/**
 * Apply a filter and create a filter tag
 */
function applyFilter(type, value, label) {
    const activeFiltersContainer = document.getElementById('active-filters');
    
    if (!activeFiltersContainer) return;
    
    // Check if filter already exists
    const existingTag = document.querySelector(`.filter-tag[data-filter-type="${type}"]${value ? `[data-filter-value="${value}"]` : ''}`);
    
    if (existingTag) return;
    
    // Create filter tag
    const filterTag = document.createElement('div');
    filterTag.className = 'filter-tag';
    filterTag.setAttribute('data-filter-type', type);
    if (value) {
        filterTag.setAttribute('data-filter-value', value);
    }
    
    filterTag.innerHTML = `
        <span>${label}</span>
        <button aria-label="Remove filter"><i class="fas fa-times"></i></button>
    `;
    
    // Add click handler to remove button
    const removeButton = filterTag.querySelector('button');
    removeButton.addEventListener('click', () => {
        removeFilterByTag(filterTag);
    });
    
    // Add tag to container
    activeFiltersContainer.appendChild(filterTag);
}

/**
 * Remove a filter by its tag element
 */
function removeFilterByTag(tagElement) {
    const type = tagElement.getAttribute('data-filter-type');
    const value = tagElement.getAttribute('data-filter-value');
    
    removeFilter(type, value);
    
    // Apply filters
    filterArticles();
}

/**
 * Remove a filter
 */
function removeFilter(type, value = null) {
    // Update active filters
    if (type === 'category' && value) {
        window.activeFilters.categories = window.activeFilters.categories.filter(cat => cat !== value);
        
        // Update checkbox
        const checkbox = document.getElementById(`cat-${value}`);
        if (checkbox) {
            checkbox.checked = false;
        }
        
        // If no categories selected, check "All Categories" checkbox
        if (window.activeFilters.categories.length === 0) {
            const allCategoriesCheckbox = document.getElementById('cat-all');
            if (allCategoriesCheckbox) {
                allCategoriesCheckbox.checked = true;
            }
        }
    } else if (type === 'date') {
        window.activeFilters.date = 'all';
        
        // Update radio button
        const allDateRadio = document.getElementById('date-all');
        if (allDateRadio) {
            allDateRadio.checked = true;
        }
    } else if (type === 'search') {
        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    // Remove filter tag
    const selector = `.filter-tag[data-filter-type="${type}"]${value ? `[data-filter-value="${value}"]` : ''}`;
    const filterTag = document.querySelector(selector);
    
    if (filterTag) {
        filterTag.remove();
    }
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    // Reset active filters
    window.activeFilters = {
        categories: [],
        date: 'all',
        sort: 'newest'
    };
    
    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset checkboxes and radio buttons
    const allCategoriesCheckbox = document.getElementById('cat-all');
    if (allCategoriesCheckbox) {
        allCategoriesCheckbox.checked = true;
    }
    
    const categoryCheckboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]:not(#cat-all)');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const allDateRadio = document.getElementById('date-all');
    if (allDateRadio) {
        allDateRadio.checked = true;
    }
    
    const newestSortRadio = document.getElementById('sort-newest');
    if (newestSortRadio) {
        newestSortRadio.checked = true;
    }
    
    // Clear filter tags
    const activeFiltersContainer = document.getElementById('active-filters');
    if (activeFiltersContainer) {
        activeFiltersContainer.innerHTML = '';
    }
    
    // Show all articles
    filterArticles();
}

/**
 * Filter articles based on active filters
 */
function filterArticles() {
    const articlesContainer = document.getElementById('articles-container');
    const articles = document.querySelectorAll('.article-card');
    
    if (!articlesContainer || !articles.length) return;
    
    // Get search term
    const searchTag = document.querySelector('.filter-tag[data-filter-type="search"]');
    const searchTerm = searchTag ? searchTag.getAttribute('data-filter-value').toLowerCase() : '';
    
    // Track visible articles
    let visibleArticles = [];
    
    // Apply filters to each article
    articles.forEach(article => {
        // Get article data
        const category = article.getAttribute('data-category');
        const dateStr = article.getAttribute('data-date');
        const popularity = parseInt(article.getAttribute('data-popularity'), 10);
        const title = article.querySelector('h2').textContent.toLowerCase();
        const description = article.querySelector('p').textContent.toLowerCase();
        
        // Check if article matches search
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm);
        
        // Check if article matches category filter
        const matchesCategory = window.activeFilters.categories.length === 0 || 
            window.activeFilters.categories.includes(category);
        
        // Check if article matches date filter
        let matchesDate = true;
        if (window.activeFilters.date !== 'all') {
            const articleDate = new Date(dateStr);
            const currentDate = new Date();
            
            if (window.activeFilters.date === 'last-week') {
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                matchesDate = articleDate >= lastWeek;
            } else if (window.activeFilters.date === 'last-month') {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                matchesDate = articleDate >= lastMonth;
            } else if (window.activeFilters.date === 'last-year') {
                const lastYear = new Date();
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                matchesDate = articleDate >= lastYear;
            }
        }
        
        // If article matches all filters, show it
        if (matchesSearch && matchesCategory && matchesDate) {
            article.style.display = '';
            visibleArticles.push({
                element: article,
                date: new Date(dateStr),
                popularity: popularity
            });
        } else {
            article.style.display = 'none';
        }
    });
    
    // Sort visible articles
    if (window.activeFilters.sort === 'newest') {
        visibleArticles.sort((a, b) => b.date - a.date);
    } else if (window.activeFilters.sort === 'oldest') {
        visibleArticles.sort((a, b) => a.date - b.date);
    } else if (window.activeFilters.sort === 'popular') {
        visibleArticles.sort((a, b) => b.popularity - a.popularity);
    }
    
    // Reorder articles in DOM
    visibleArticles.forEach(article => {
        articlesContainer.appendChild(article.element);
    });
    
    // Show "no results" message if no articles are visible
    let noResultsMessage = document.querySelector('.no-results');
    
    if (visibleArticles.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results';
            noResultsMessage.innerHTML = `
                <h3>No Matching Articles Found</h3>
                <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                <button class="btn btn-primary">Clear All Filters</button>
            `;
            
            // Add event listener to clear filters button
            noResultsMessage.querySelector('button').addEventListener('click', clearAllFilters);
            
            // Insert after articles container
            articlesContainer.parentNode.insertBefore(noResultsMessage, articlesContainer.nextSibling);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // Reset pagination to first page
    const pageButtons = document.querySelectorAll('.page-number');
    if (pageButtons.length) {
        pageButtons.forEach((button, index) => {
            button.classList.toggle('active', index === 0);
        });
    }
}

/**
 * Set up pagination
 */
function setupPagination() {
    const paginationNumbers = document.querySelector('.pagination-numbers');
    const prevButton = document.querySelector('.pagination-btn.prev');
    const nextButton = document.querySelector('.pagination-btn.next');
    
    if (!paginationNumbers || !prevButton || !nextButton) return;
    
    // Add click handlers to page numbers
    const pageButtons = document.querySelectorAll('.page-number');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active page
            pageButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update prev/next button states
            const currentPage = parseInt(button.textContent, 10);
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === pageButtons.length;
            
            // Scroll to top of articles section
            const articlesSection = document.querySelector('.articles-section');
            if (articlesSection) {
                window.scrollTo({
                    top: articlesSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add click handlers to prev/next buttons
    prevButton.addEventListener('click', () => {
        const activePage = document.querySelector('.page-number.active');
        if (activePage && activePage.previousElementSibling && activePage.previousElementSibling.classList.contains('page-number')) {
            activePage.previousElementSibling.click();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const activePage = document.querySelector('.page-number.active');
        if (activePage && activePage.nextElementSibling && activePage.nextElementSibling.classList.contains('page-number')) {
            activePage.nextElementSibling.click();
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