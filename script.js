// Datele proiectelor (adaptate după ce ai tu)
const projects = [
    {
        id: 1,
        title: "Currency Converter",
        description: "Convertor de valută cu rate în timp real și istoric grafic.",
        technologies: ["JavaScript", "API", "Chart.js"],
        icon: "fas fa-money-bill-wave",
        link: "Currency-Converter/index.html"
    },
    {
        id: 2,
        title: "Event RSVP System",
        description: "Sistem de gestionare evenimente cu confirmare participare.",
        technologies: ["HTML5", "LocalStorage", "Forms"],
        icon: "fas fa-calendar-check",
        link: "Event-rsvp/index.html"
    },
    {
        id: 3,
        title: "Music Shopping Cart",
        description: "Coș de cumpărături pentru magazin online de muzică.",
        technologies: ["JavaScript", "Cart Logic", "UI/UX"],
        icon: "fas fa-shopping-cart",
        link: "Music-shopping-cart-page/index.html"
    },
    {
        id: 4,
        title: "Photography Exhibit",
        description: "Galerie foto interactivă cu lightbox și filtre.",
        technologies: ["CSS Grid", "Lightbox", "Animations"],
        icon: "fas fa-camera",
        link: "Lab-photography-exibit/index.html"
    },
    {
        id: 5,
        title: "Tic Tac Toe Game",
        description: "Joc clasic X și O cu AI și multiple niveluri de dificultate.",
        technologies: ["Game Logic", "AI", "Animations"],
        icon: "fas fa-gamepad",
        link: "Tic-Tac-Toe-Game/index.html"
    },
    {
        id: 6,
        title: "Lab Music Cart",
        description: "Versiune alternativă a coșului de cumpărături muzical.",
        technologies: ["JavaScript", "Design", "Experiments"],
        icon: "fas fa-music",
        link: "Lab-music-shopping-cart-page/index.html"
    }
];

// Elemente DOM principale
const projectsGrid = document.getElementById('projectsGrid');
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');
const backToTop = document.getElementById('backToTop');
const currentYear = document.getElementById('currentYear');
const messageForm = document.getElementById('messageForm');

// Starea aplicației
const state = {
    theme: localStorage.getItem('theme') || 'light',
    projects: projects
};

// Inițializare aplicație
function initApp() {
    // Setează anul curent
    currentYear.textContent = new Date().getFullYear();
    
    // Aplică tema salvată
    applyTheme();
    
    // Încarcă proiectele
    renderProjects();
    
    // Ascunde loading screen după 1.5 secunde
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
    
    // Adaugă event listeners
    setupEventListeners();
}

// Aplică tema (light/dark)
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    themeIcon.className = state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', state.theme);
}

// Render proiecte în grid
function renderProjects() {
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    state.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.animationDelay = `${project.id * 0.1}s`;
        
        projectCard.innerHTML = `
            <div class="project-icon">
                <i class="${project.icon}"></i>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
            </div>
            <div class="project-links">
                <a href="${project.link}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo Live
                </a>
                <button class="btn btn-secondary" onclick="showProjectDetails(${project.id})">
                    <i class="fas fa-info-circle"></i> Detalii
                </button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Arată detalii proiect
function showProjectDetails(projectId) {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    
    alert(`🚀 ${project.title}\n\n📋 ${project.description}\n\n🛠️ Tehnologii: ${project.technologies.join(', ')}\n\n🔗 Demo: ${project.link}`);
}

// Configurează toate event listeners
function setupEventListeners() {
    // Toggle tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            applyTheme();
        });
    }
    
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scroll pentru link-uri interne
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submit
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || 'Nume';
            
            // Simulează trimiterea
            this.innerHTML = `
                <div class="success-message" style="text-align: center; padding: 40px;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success-color); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--success-color); margin-bottom: 15px;">Mesaj trimis!</h3>
                    <p>Mulțumim, ${name}! Te vom contacta în curând.</p>
                </div>
            `;
            
            // Resetează formularul după 5 secunde
            setTimeout(() => {
                location.reload();
            }, 5000);
        });
    }
    
    // Activează link-urile din nav la scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Efect de tipărire în hero (opțional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
    }
}

// Efect de particule în background (opțional simplu)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero || window.innerWidth < 768) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
    
    // Adaugă animația CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Rulează aplicația când DOM-ul e gata
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    createParticles();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Toggle tema cu Ctrl+T
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme();
    }
    
    // Scroll to top cu Home
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Resize optimizations
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-render particles pe mobile/desktop
        const particles = document.querySelectorAll('.hero > div');
        particles.forEach(p => p.remove());
        if (window.innerWidth >= 768) {
            createParticles();
        }
    }, 250);
});
