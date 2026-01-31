// Main Portfolio Script
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentYear = document.getElementById('currentYear');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Initialize
    initTheme();
    setupEventListeners();
    updateCurrentYear();
    updateAllStats();
    updateFooterName();
    setupAnimations();
    animateProgressBars(); // Adaugă această linie
    
    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Event Listeners
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').className = 
                navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    // Smooth Scrolling
    function smoothScroll(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#home') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Smooth scroll
            const headerOffset = 80;
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Update active nav link on scroll
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Animations
    function setupAnimations() {
        // Animate numbers - asteapta putin pentru a se incarca DOM-ul
        setTimeout(() => {
            const numberElements = document.querySelectorAll('.stat-number[data-target], .stat-value[data-target]');
            numberElements.forEach(element => {
                const target = parseInt(element.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateNumber(element, target);
                }
            });
        }, 300);
        
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.project-card, .skill-item, .tool-item, .featured-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.level-progress');
        
        // Use requestAnimationFrame to ensure the initial 0% is rendered
        requestAnimationFrame(() => {
            progressBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width'); // Get target from data attribute
                if (targetWidth) {
                    // Set the width to the target value, triggering the transition
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 300); // Small delay to ensure the initial state is rendered
                }
            });
        });
    }
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.level-progress');
    progressBars.forEach(bar => {
        // Forțează afișarea corectă
        bar.style.opacity = '1';
        bar.style.visibility = 'visible';
    });
}


     initializeProgressBars();
    
    function animateNumber(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, stepTime);
    }
    
    // Update Current Year
    function updateCurrentYear() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // Update All Stats
    function updateAllStats() {
        const projectCount = document.querySelectorAll('.project-card').length;
        
        // 1. Actualizează în hero stats
        const heroProjectElement = document.querySelector('.hero-stats .stat-number[data-target]');
        if (heroProjectElement) {
            heroProjectElement.setAttribute('data-target', projectCount);
            // Nu anima aici, va fi animat în setupAnimations
        }
        
        // 2. Actualizează în about stats
        const aboutStatBoxes = document.querySelectorAll('.about-stats .stat-box');
        aboutStatBoxes.forEach(box => {
            const statValue = box.querySelector('.stat-value');
            const statLabel = box.querySelector('.stat-label');
            
            if (statLabel.textContent === 'Projects') {
                statValue.setAttribute('data-target', projectCount);
            } else if (statLabel.textContent === 'Technologies') {
                // Setează numărul de tehnologii utilizate
                // HTML, CSS, JS, Git, Responsive Design, Clean Code = 6
                statValue.setAttribute('data-target', 6);
            }
        });
        
        // 3. Actualizează codul JavaScript afișat
        const codeElement = document.querySelector('.code-content code');
        if (codeElement) {
            const codeText = codeElement.textContent;
            const updatedText = codeText.replace(
                /projects: \d+,/,
                `projects: ${projectCount},`
            );
            codeElement.textContent = updatedText;
        }
    }
    
    // Update Footer Name
    function updateFooterName() {
        const footerName = document.querySelector('.footer-brand h3');
        if (footerName) {
            footerName.textContent = 'Lupastean Raoul';
        }
        
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) {
            copyright.innerHTML = copyright.innerHTML.replace('Raoul Lupastean', 'Lupastean Raoul');
        }
    }
    
    // Keyboard Shortcuts
    function handleKeyboardShortcuts(e) {
        // Toggle theme with Ctrl+T
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            themeToggle.click();
        }
        
        // Toggle menu with Escape
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }
        
        // Scroll to top with Home key
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});