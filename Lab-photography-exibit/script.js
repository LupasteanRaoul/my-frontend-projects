// Global Photography Exhibit - Interactive Gallery
// Complete with all functionality for GitHub deployment

// ===== CONFIGURATION & STATE =====
const CONFIG = {
    itemsPerPage: 9,
    initialLikes: 245,
    initialViews: 8921
};

const state = {
    photos: [],
    filteredPhotos: [],
    likedPhotos: JSON.parse(localStorage.getItem('likedPhotos')) || [],
    savedPhotos: JSON.parse(localStorage.getItem('savedPhotos')) || [],
    currentPhoto: null,
    currentPage: 1,
    currentSort: 'featured',
    currentCategory: 'all',
    currentSearch: '',
    currentView: 'grid',
    totalLikes: parseInt(localStorage.getItem('totalLikes')) || 12478,
    totalViews: parseInt(localStorage.getItem('totalViews')) || 156892
};

// ===== PHOTO DATA =====
const photosData = [
    {
        id: 1,
        title: "Roman Colosseum",
        description: "Ancient Roman amphitheater in the center of Rome, Italy. Captured during golden hour with dramatic lighting.",
        image: "https://cdn.freecodecamp.org/curriculum/labs/colosseo.jpg",
        photographer: "Michael Chen",
        photographerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        category: "architecture",
        location: "Rome, Italy",
        date: "2023-06-15",
        likes: 1245,
        views: 8921,
        featured: true,
        tags: ["ancient", "rome", "architecture", "history", "italy"]
    },
    {
        id: 2,
        title: "Swiss Alps",
        description: "Mountain range in Switzerland with beautiful snowy peaks. Taken from a helicopter for a unique perspective.",
        image: "https://cdn.freecodecamp.org/curriculum/labs/alps.jpg",
        photographer: "Sarah Johnson",
        photographerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        category: "landscape",
        location: "Swiss Alps, Switzerland",
        date: "2023-03-22",
        likes: 2156,
        views: 12457,
        featured: true,
        tags: ["mountains", "snow", "alps", "switzerland", "winter"]
    },
    {
        id: 3,
        title: "Mediterranean Coast",
        description: "Coastal view of the Mediterranean Sea with clear blue water. Sunset shot with vibrant colors.",
        image: "https://cdn.freecodecamp.org/curriculum/labs/sea.jpg",
        photographer: "David Rodriguez",
        photographerAvatar: "https://randomuser.me/api/portraits/men/65.jpg",
        category: "seascape",
        location: "Santorini, Greece",
        date: "2023-07-10",
        likes: 1892,
        views: 10543,
        featured: true,
        tags: ["sea", "coast", "mediterranean", "greece", "sunset"]
    },
    {
        id: 4,
        title: "Tokyo Cityscape",
        description: "Modern skyline of Tokyo at night with neon lights reflecting on the river.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Emma Wilson",
        photographerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
        category: "urban",
        location: "Tokyo, Japan",
        date: "2023-05-18",
        likes: 3124,
        views: 18765,
        featured: false,
        tags: ["tokyo", "city", "night", "neon", "japan"]
    },
    {
        id: 5,
        title: "African Safari",
        description: "Elephant family crossing the savanna at sunset in Kenya's Maasai Mara.",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80",
        photographer: "James Thompson",
        photographerAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
        category: "wildlife",
        location: "Maasai Mara, Kenya",
        date: "2023-02-14",
        likes: 2987,
        views: 15642,
        featured: true,
        tags: ["africa", "safari", "elephant", "wildlife", "kenya"]
    },
    {
        id: 6,
        title: "Northern Lights",
        description: "Aurora Borealis dancing over a frozen lake in Icelandic wilderness.",
        image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Lisa Wang",
        photographerAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
        category: "nature",
        location: "Iceland",
        date: "2023-01-30",
        likes: 4123,
        views: 23456,
        featured: false,
        tags: ["aurora", "northern lights", "iceland", "night", "stars"]
    },
    {
        id: 7,
        title: "Desert Dunes",
        description: "Rolling sand dunes in the Sahara desert at sunrise, creating dramatic shadows.",
        image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Ahmed Hassan",
        photographerAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
        category: "landscape",
        location: "Sahara Desert, Morocco",
        date: "2023-04-05",
        likes: 1876,
        views: 9876,
        featured: false,
        tags: ["desert", "sand", "morocco", "sunrise", "dunes"]
    },
    {
        id: 8,
        title: "New York Skyline",
        description: "Manhattan skyline from Brooklyn Bridge with iconic buildings reflecting sunset.",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Robert Kim",
        photographerAvatar: "https://randomuser.me/api/portraits/men/56.jpg",
        category: "urban",
        location: "New York City, USA",
        date: "2023-08-22",
        likes: 2765,
        views: 15432,
        featured: true,
        tags: ["new york", "skyline", "manhattan", "city", "usa"]
    },
    {
        id: 9,
        title: "Tropical Waterfall",
        description: "Lush waterfall in the Costa Rican rainforest surrounded by vibrant greenery.",
        image: "https://images.unsplash.com/photo-1512273222628-4daea6e55abb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Maria Garcia",
        photographerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
        category: "nature",
        location: "Costa Rica",
        date: "2023-09-12",
        likes: 1654,
        views: 8765,
        featured: false,
        tags: ["waterfall", "rainforest", "tropical", "costa rica", "nature"]
    },
    {
        id: 10,
        title: "Venice Canals",
        description: "Traditional gondolas navigating the narrow canals of Venice during golden hour.",
        image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Luca Romano",
        photographerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
        category: "architecture",
        location: "Venice, Italy",
        date: "2023-07-30",
        likes: 2345,
        views: 13456,
        featured: false,
        tags: ["venice", "canals", "italy", "gondola", "architecture"]
    },
    {
        id: 11,
        title: "Mountain Lake",
        description: "Crystal clear alpine lake reflecting surrounding mountains in the Canadian Rockies.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Sophie Martin",
        photographerAvatar: "https://randomuser.me/api/portraits/women/52.jpg",
        category: "landscape",
        location: "Banff, Canada",
        date: "2023-06-08",
        likes: 3210,
        views: 18765,
        featured: true,
        tags: ["lake", "mountains", "canada", "reflection", "nature"]
    },
    {
        id: 12,
        title: "Great Barrier Reef",
        description: "Vibrant coral reef with diverse marine life in Australia's Great Barrier Reef.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        photographer: "Oliver Taylor",
        photographerAvatar: "https://randomuser.me/api/portraits/men/38.jpg",
        category: "nature",
        location: "Queensland, Australia",
        date: "2023-11-05",
        likes: 1987,
        views: 10987,
        featured: false,
        tags: ["reef", "ocean", "australia", "coral", "marine life"]
    }
];

// ===== DOM ELEMENTS =====
const elements = {
    // Header
    totalLikes: document.getElementById('totalLikes'),
    totalViews: document.getElementById('totalViews'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    userBtn: document.getElementById('userBtn'),
    userDropdown: document.getElementById('userDropdown'),
    
    // Hero
    heroImage: document.getElementById('heroImage'),
    exploreBtn: document.getElementById('exploreBtn'),
    uploadBtn: document.getElementById('uploadBtn'),
    
    // Gallery
    galleryGrid: document.getElementById('galleryGrid'),
    galleryList: document.getElementById('galleryList'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortFilter: document.getElementById('sortFilter'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    viewButtons: document.querySelectorAll('.view-btn'),
    pagination: document.getElementById('pagination'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageNumbers: document.getElementById('pageNumbers'),
    
    // Categories
    categoryCards: document.querySelectorAll('.category-card'),
    
    // Follow buttons
    followButtons: document.querySelectorAll('.follow-btn'),
    
    // Newsletter
    subscribeBtn: document.getElementById('subscribeBtn'),
    newsletterEmail: document.getElementById('newsletterEmail'),
    
    // Modals
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxPhotographer: document.getElementById('lightboxPhotographer'),
    lightboxDescription: document.getElementById('lightboxDescription'),
    lightboxLikes: document.getElementById('lightboxLikes'),
    lightboxViews: document.getElementById('lightboxViews'),
    lightboxDate: document.getElementById('lightboxDate'),
    lightboxLocation: document.getElementById('lightboxLocation'),
    lightboxTags: document.getElementById('lightboxTags'),
    lightboxLikeBtn: document.getElementById('lightboxLikeBtn'),
    lightboxSaveBtn: document.getElementById('lightboxSaveBtn'),
    lightboxShareBtn: document.getElementById('lightboxShareBtn'),
    lightboxDownloadBtn: document.getElementById('lightboxDownloadBtn'),
    lightboxPrev: document.querySelector('.lightbox-prev'),
    lightboxNext: document.querySelector('.lightbox-next'),
    closeLightbox: document.querySelector('.close-lightbox'),
    
    uploadModal: document.getElementById('uploadModal'),
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    browseBtn: document.getElementById('browseBtn'),
    uploadForm: document.getElementById('uploadForm'),
    uploadPreview: document.getElementById('uploadPreview'),
    previewImg: document.getElementById('previewImg'),
    photoTitle: document.getElementById('photoTitle'),
    photoDescription: document.getElementById('photoDescription'),
    photoCategory: document.getElementById('photoCategory'),
    photoLocation: document.getElementById('photoLocation'),
    photoTags: document.getElementById('photoTags'),
    cancelUpload: document.getElementById('cancelUpload'),
    submitUpload: document.getElementById('submitUpload'),
    
    // Notification
    notification: document.getElementById('notification'),
    notificationTitle: document.getElementById('notificationTitle'),
    notificationMessage: document.getElementById('notificationMessage'),
    notificationIcon: document.getElementById('notificationIcon'),
    closeNotification: document.querySelector('.close-notification'),
    
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showLoading();
    
    // Initialize state
    state.photos = [...photosData];
    state.filteredPhotos = [...photosData];
    
    // Load from localStorage
    loadFromLocalStorage();
    
    // Set hero image rotation
    startHeroRotation();
    
    // Render initial views
    renderGallery();
    updateStats();
    
    // Hide loading
    setTimeout(() => {
        hideLoading();
        showNotification('Welcome!', 'Explore stunning photographs from around the world', 'info');
    }, 1500);
}

function loadFromLocalStorage() {
    // Load liked photos
    const savedLikes = localStorage.getItem('likedPhotos');
    if (savedLikes) {
        state.likedPhotos = JSON.parse(savedLikes);
    }
    
    // Load saved photos
    const savedSaves = localStorage.getItem('savedPhotos');
    if (savedSaves) {
        state.savedPhotos = JSON.parse(savedSaves);
    }
    
    // Load stats
    const savedLikesCount = localStorage.getItem('totalLikes');
    if (savedLikesCount) {
        state.totalLikes = parseInt(savedLikesCount);
    }
    
    const savedViewsCount = localStorage.getItem('totalViews');
    if (savedViewsCount) {
        state.totalViews = parseInt(savedViewsCount);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('likedPhotos', JSON.stringify(state.likedPhotos));
    localStorage.setItem('savedPhotos', JSON.stringify(state.savedPhotos));
    localStorage.setItem('totalLikes', state.totalLikes.toString());
    localStorage.setItem('totalViews', state.totalViews.toString());
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu
    elements.mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.mobileNav.classList.toggle('active');
        
        // Close user dropdown if open
        elements.userDropdown.classList.remove('show');
    });   // Close upload modal
document.getElementById('closeUploadModal')?.addEventListener('click', () => {
    elements.uploadModal.classList.remove('active');
    document.body.style.overflow = '';
    resetUploadModal();
});

document.addEventListener('click', (e) => {
    if (!elements.mobileMenuBtn.contains(e.target) && !elements.mobileNav.contains(e.target)) {
        elements.mobileNav.classList.remove('active');
    }
});
    // User dropdown
    elements.userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.userDropdown.classList.toggle('show');

    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.userBtn.contains(e.target) && !elements.userDropdown.contains(e.target)) {
            elements.userDropdown.classList.remove('show');
        }
    });
    
    // Hero buttons
    elements.exploreBtn.addEventListener('click', () => {
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
    
    elements.uploadBtn.addEventListener('click', showUploadModal);
    
    // Filters & Search
    elements.categoryFilter.addEventListener('change', handleCategoryFilter);
    elements.sortFilter.addEventListener('change', handleSortFilter);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // View toggle
    elements.viewButtons.forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn.dataset.view));
    });
    
    // Pagination
    elements.prevPage.addEventListener('click', goToPrevPage);
    elements.nextPage.addEventListener('click', goToNextPage);
    
    // Categories
    elements.categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            elements.categoryFilter.value = category;
            handleCategoryFilter();
        });
    });
    
    // Follow buttons
    elements.followButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isFollowing = this.textContent === 'Following';
            this.textContent = isFollowing ? 'Follow' : 'Following';
            this.classList.toggle('following', !isFollowing);
            
            const photographer = this.closest('.photographer-card').querySelector('h3').textContent;
            showNotification(
                isFollowing ? 'Unfollowed' : 'Following',
                `You ${isFollowing ? 'unfollowed' : 'are now following'} ${photographer}`,
                isFollowing ? 'info' : 'success'
            );
        });
    });
    
    // Newsletter
    elements.subscribeBtn.addEventListener('click', handleNewsletterSubscribe);
    elements.newsletterEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNewsletterSubscribe();
    });
    
    // Lightbox
    elements.closeLightbox.addEventListener('click', closeLightbox);
    elements.lightboxPrev.addEventListener('click', showPrevPhoto);
    elements.lightboxNext.addEventListener('click', showNextPhoto);
    elements.lightboxLikeBtn.addEventListener('click', handleLightboxLike);
    elements.lightboxSaveBtn.addEventListener('click', handleLightboxSave);
    elements.lightboxShareBtn.addEventListener('click', handleLightboxShare);
    elements.lightboxDownloadBtn.addEventListener('click', handleLightboxDownload);
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && elements.lightboxModal.classList.contains('active')) showPrevPhoto();
        if (e.key === 'ArrowRight' && elements.lightboxModal.classList.contains('active')) showNextPhoto();
    });
    
    // Upload modal
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.browseBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.cancelUpload.addEventListener('click', resetUploadModal);
    elements.submitUpload.addEventListener('click', handleUploadSubmit);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close buttons
    // Close buttons
document.querySelectorAll('.close-modal').forEach(btn => {
    if (btn.id !== 'closeUploadModal') { // Skip upload modal close button as we handle it separately
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        });
    }
});
    
    // Notification
    elements.closeNotification.addEventListener('click', hideNotification);
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu
                elements.mobileNav.classList.remove('active');
            }
        });
    });
}

// ===== HERO IMAGE ROTATION =====
let heroRotationInterval;
const heroImages = [
    "https://cdn.freecodecamp.org/curriculum/labs/alps.jpg",
    "https://cdn.freecodecamp.org/curriculum/labs/colosseo.jpg",
    "https://cdn.freecodecamp.org/curriculum/labs/sea.jpg",
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

function startHeroRotation() {
    let currentIndex = 0;
    
    heroRotationInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % heroImages.length;
        elements.heroImage.src = heroImages[currentIndex];
        
        // Update overlay info based on image
        const imageInfo = document.querySelector('.image-info');
        if (imageInfo) {
            const titles = ["Swiss Alps", "Roman Colosseum", "Mediterranean Coast", "Sahara Desert", "Tokyo Night"];
            const photographers = ["Alex Johnson", "Michael Chen", "David Rodriguez", "Ahmed Hassan", "Emma Wilson"];
            
            imageInfo.querySelector('h3').textContent = titles[currentIndex];
            imageInfo.querySelector('p').textContent = `Photographer: ${photographers[currentIndex]}`;
        }
    }, 5000);
}

// ===== GALLERY FUNCTIONS =====
function renderGallery() {
    // Filter and sort photos
    filterAndSortPhotos();
    
    // Calculate pagination
    const totalPages = Math.ceil(state.filteredPhotos.length / CONFIG.itemsPerPage);
    const startIndex = (state.currentPage - 1) * CONFIG.itemsPerPage;
    const endIndex = startIndex + CONFIG.itemsPerPage;
    const pagePhotos = state.filteredPhotos.slice(startIndex, endIndex);
    
    // Clear containers
    elements.galleryGrid.innerHTML = '';
    elements.galleryList.innerHTML = '';
    
    if (pagePhotos.length === 0) {
        const emptyMessage = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                <i class="fas fa-images" style="font-size: 4rem; color: var(--light-gray); margin-bottom: 1.5rem;"></i>
                <h3 style="color: var(--dark); margin-bottom: 0.5rem;">No photos found</h3>
                <p style="color: var(--gray); margin-bottom: 1.5rem;">Try adjusting your filters or search terms</p>
                <button class="primary-btn" id="resetFilters" style="margin: 0 auto;">Reset Filters</button>
            </div>
        `;
        elements.galleryGrid.innerHTML = emptyMessage;
        elements.galleryList.innerHTML = emptyMessage;
        
        // Add event listener to reset button
        setTimeout(() => {
            const resetBtn = document.getElementById('resetFilters');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
        }, 100);
        
        elements.pagination.classList.add('hidden');
        return;
    }
    
    // Render grid view
    pagePhotos.forEach(photo => {
        elements.galleryGrid.appendChild(createPhotoCard(photo));
    });
    
    // Render list view
    pagePhotos.forEach(photo => {
        elements.galleryList.appendChild(createPhotoListItem(photo));
    });
    
    // Update pagination
    renderPagination(totalPages);
    
    // Update view
    updateViewDisplay();
}

function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.id = photo.id;
    
    const isLiked = state.likedPhotos.includes(photo.id);
    const isSaved = state.savedPhotos.includes(photo.id);
    
    card.innerHTML = `
        <div class="photo-image">
            <img src="${photo.image}" alt="${photo.title}" loading="lazy">
            ${photo.featured ? '<span class="photo-badge">Featured</span>' : ''}
            <div class="photo-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${photo.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn save-btn ${isSaved ? 'saved' : ''}" data-id="${photo.id}">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button class="action-btn view-btn" data-id="${photo.id}">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="photo-content">
            <h3 class="photo-title">${photo.title}</h3>
            <p class="photo-description">${photo.description}</p>
            <div class="photo-meta">
                <div class="photographer">
                    <div class="photographer-avatar">
                        <img src="${photo.photographerAvatar}" alt="${photo.photographer}">
                    </div>
                    <span class="photographer-name">${photo.photographer}</span>
                </div>
                <div class="photo-stats">
                    <div class="stat">
                        <i class="fas fa-heart"></i>
                        <span>${formatNumber(photo.likes)}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${formatNumber(photo.views)}</span>
                    </div>
                </div>
            </div>
            <div class="photo-tags">
                ${photo.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Add event listeners
    const likeBtn = card.querySelector('.like-btn');
    const saveBtn = card.querySelector('.save-btn');
    const viewBtn = card.querySelector('.view-btn');
    
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(photo.id);
    });
    
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSave(photo.id);
    });
    
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightbox(photo);
    });
    
    // Make entire card clickable for lightbox
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.photo-actions')) {
            showLightbox(photo);
        }
    });
    
    return card;
}

function createPhotoListItem(photo) {
    const item = document.createElement('div');
    item.className = 'photo-list-item';
    item.dataset.id = photo.id;
    
    const isLiked = state.likedPhotos.includes(photo.id);
    const isSaved = state.savedPhotos.includes(photo.id);
    
    item.innerHTML = `
        <div class="list-image">
            <img src="${photo.image}" alt="${photo.title}">
        </div>
        <div class="list-content">
            <h3 class="photo-title">${photo.title}</h3>
            <p class="photo-description">${photo.description}</p>
            <div class="list-details">
                <div class="list-meta">
                    <div class="photographer">
                        <div class="photographer-avatar">
                            <img src="${photo.photographerAvatar}" alt="${photo.photographer}">
                        </div>
                        <span class="photographer-name">${photo.photographer}</span>
                    </div>
                    <div class="photo-stats">
                        <div class="stat">
                            <i class="fas fa-heart"></i>
                            <span>${formatNumber(photo.likes)}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-eye"></i>
                            <span>${formatNumber(photo.views)}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${photo.location}</span>
                        </div>
                    </div>
                </div>
                <div class="photo-actions">
                    <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-id="${photo.id}">
                        <i class="fas fa-heart"></i> ${isLiked ? 'Liked' : 'Like'}
                    </button>
                    <button class="action-btn save-btn ${isSaved ? 'saved' : ''}" data-id="${photo.id}">
                        <i class="fas fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button class="action-btn view-btn" data-id="${photo.id}">
                        <i class="fas fa-expand"></i> View
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const likeBtn = item.querySelector('.like-btn');
    const saveBtn = item.querySelector('.save-btn');
    const viewBtn = item.querySelector('.view-btn');
    
    likeBtn.addEventListener('click', () => toggleLike(photo.id));
    saveBtn.addEventListener('click', () => toggleSave(photo.id));
    viewBtn.addEventListener('click', () => showLightbox(photo));
    
    return item;
}

function filterAndSortPhotos() {
    let filtered = [...state.photos];
    
    // Apply category filter
    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(photo => photo.category === state.currentCategory);
    }
    
    // Apply search filter
    if (state.currentSearch) {
        const searchTerm = state.currentSearch.toLowerCase();
        filtered = filtered.filter(photo => 
            photo.title.toLowerCase().includes(searchTerm) ||
            photo.description.toLowerCase().includes(searchTerm) ||
            photo.photographer.toLowerCase().includes(searchTerm) ||
            photo.location.toLowerCase().includes(searchTerm) ||
            photo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply sorting
    switch (state.currentSort) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'popular':
            filtered.sort((a, b) => b.views - a.views);
            break;
        case 'likes':
            filtered.sort((a, b) => b.likes - a.likes);
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => (b.featured - a.featured) || b.likes - a.likes);
            break;
    }
    
    state.filteredPhotos = filtered;
    state.currentPage = 1;
}

// ===== INTERACTIONS =====
function toggleLike(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const index = state.likedPhotos.indexOf(photoId);
    const isLiking = index === -1;
    
    if (isLiking) {
        state.likedPhotos.push(photoId);
        photo.likes++;
        state.totalLikes++;
        showNotification('Liked!', `You liked "${photo.title}"`, 'success');
    } else {
        state.likedPhotos.splice(index, 1);
        photo.likes--;
        state.totalLikes--;
        showNotification('Unliked', `Removed like from "${photo.title}"`, 'info');
    }
    
    saveToLocalStorage();
    updateStats();
    renderGallery();
    
    // Update lightbox if open
    if (state.currentPhoto && state.currentPhoto.id === photoId) {
        updateLightboxStats(photo);
        elements.lightboxLikeBtn.classList.toggle('active', isLiking);
        elements.lightboxLikeBtn.innerHTML = `<i class="fas fa-heart"></i> ${isLiking ? 'Liked' : 'Like'}`;
    }
}

function toggleSave(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const index = state.savedPhotos.indexOf(photoId);
    const isSaving = index === -1;
    
    if (isSaving) {
        state.savedPhotos.push(photoId);
        showNotification('Saved!', `"${photo.title}" added to your saved photos`, 'success');
    } else {
        state.savedPhotos.splice(index, 1);
        showNotification('Removed', `"${photo.title}" removed from saved photos`, 'info');
    }
    
    saveToLocalStorage();
    renderGallery();
    
    // Update lightbox if open
    if (state.currentPhoto && state.currentPhoto.id === photoId) {
        elements.lightboxSaveBtn.classList.toggle('active', isSaving);
        elements.lightboxSaveBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${isSaving ? 'Saved' : 'Save'}`;
    }
}

// ===== FILTER HANDLERS =====
function handleCategoryFilter() {
    state.currentCategory = elements.categoryFilter.value;
    renderGallery();
}

function handleSortFilter() {
    state.currentSort = elements.sortFilter.value;
    renderGallery();
}

function handleSearch() {
    state.currentSearch = elements.searchInput.value;
    renderGallery();
}

function resetFilters() {
    elements.categoryFilter.value = 'all';
    elements.sortFilter.value = 'featured';
    elements.searchInput.value = '';
    
    state.currentCategory = 'all';
    state.currentSort = 'featured';
    state.currentSearch = '';
    
    renderGallery();
    showNotification('Filters Reset', 'All filters have been reset', 'info');
}

// ===== VIEW TOGGLE =====
function handleViewChange(view) {
    state.currentView = view;
    
    // Update active button
    elements.viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    updateViewDisplay();
}

function updateViewDisplay() {
    const isGridView = state.currentView === 'grid';
    elements.galleryGrid.classList.toggle('hidden', !isGridView);
    elements.galleryList.classList.toggle('hidden', isGridView);
}

// ===== PAGINATION =====
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        elements.pagination.classList.add('hidden');
        return;
    }
    
    elements.pagination.classList.remove('hidden');
    
    // Update button states
    elements.prevPage.disabled = state.currentPage === 1;
    elements.nextPage.disabled = state.currentPage === totalPages;
    
    // Generate page numbers
    elements.pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        elements.pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    if (page < 1 || page > Math.ceil(state.filteredPhotos.length / CONFIG.itemsPerPage)) return;
    
    state.currentPage = page;
    renderGallery();
    
    // Scroll to gallery
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

function goToPrevPage() {
    goToPage(state.currentPage - 1);
}

function goToNextPage() {
    goToPage(state.currentPage + 1);
}

// ===== STATS =====
function updateStats() {
    elements.totalLikes.textContent = formatNumber(state.totalLikes);
    elements.totalViews.textContent = formatNumber(state.totalViews);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===== LIGHTBOX =====
function showLightbox(photo) {
    state.currentPhoto = photo;
    
    // Update lightbox content
    elements.lightboxImage.src = photo.image;
    elements.lightboxTitle.textContent = photo.title;
    elements.lightboxPhotographer.textContent = `By ${photo.photographer}`;
    elements.lightboxDescription.textContent = photo.description;
    elements.lightboxLikes.textContent = formatNumber(photo.likes);
    elements.lightboxViews.textContent = formatNumber(photo.views);
    elements.lightboxDate.textContent = formatDate(photo.date);
    elements.lightboxLocation.textContent = photo.location;
    
    // Update tags
    elements.lightboxTags.innerHTML = '';
    photo.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        elements.lightboxTags.appendChild(tagElement);
    });
    
    // Update like/save buttons
    const isLiked = state.likedPhotos.includes(photo.id);
    const isSaved = state.savedPhotos.includes(photo.id);
    
    elements.lightboxLikeBtn.classList.toggle('active', isLiked);
    elements.lightboxLikeBtn.innerHTML = `<i class="fas fa-heart"></i> ${isLiked ? 'Liked' : 'Like'}`;
    
    elements.lightboxSaveBtn.classList.toggle('active', isSaved);
    elements.lightboxSaveBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}`;
    
    // Increment view count
    photo.views++;
    state.totalViews++;
    saveToLocalStorage();
    updateStats();
    
    // Show lightbox
    elements.lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxStats(photo) {
    elements.lightboxLikes.textContent = formatNumber(photo.likes);
}

function showPrevPhoto() {
    if (!state.currentPhoto) return;
    
    const currentIndex = state.filteredPhotos.findIndex(p => p.id === state.currentPhoto.id);
    const prevIndex = (currentIndex - 1 + state.filteredPhotos.length) % state.filteredPhotos.length;
    
    showLightbox(state.filteredPhotos[prevIndex]);
}

function showNextPhoto() {
    if (!state.currentPhoto) return;
    
    const currentIndex = state.filteredPhotos.findIndex(p => p.id === state.currentPhoto.id);
    const nextIndex = (currentIndex + 1) % state.filteredPhotos.length;
    
    showLightbox(state.filteredPhotos[nextIndex]);
}

function closeLightbox() {
    elements.lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    state.currentPhoto = null;
}

function handleLightboxLike() {
    if (!state.currentPhoto) return;
    toggleLike(state.currentPhoto.id);
}

function handleLightboxSave() {
    if (!state.currentPhoto) return;
    toggleSave(state.currentPhoto.id);
}

function handleLightboxShare() {
    if (!state.currentPhoto) return;
    
    const shareUrl = window.location.href;
    const shareText = `Check out this amazing photo: ${state.currentPhoto.title} by ${state.currentPhoto.photographer}`;
    
    if (navigator.share) {
        navigator.share({
            title: state.currentPhoto.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showNotification('Link Copied!', 'Photo link copied to clipboard', 'success');
    }
}

function handleLightboxDownload() {
    if (!state.currentPhoto) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = state.currentPhoto.image;
    link.download = `${state.currentPhoto.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Download Started', 'Photo download has begun', 'success');
}

// ===== UPLOAD MODAL =====
function showUploadModal() {
    elements.uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetUploadModal();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Invalid File', 'Please upload a JPG, PNG, or WebP image', 'error');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File Too Large', 'Maximum file size is 10MB', 'error');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        elements.previewImg.src = e.target.result;
        elements.uploadArea.classList.add('hidden');
        elements.uploadPreview.classList.remove('hidden');
        elements.uploadForm.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function resetUploadModal() {
    elements.fileInput.value = '';
    elements.photoTitle.value = '';
    elements.photoDescription.value = '';
    elements.photoCategory.value = 'landscape';
    elements.photoLocation.value = '';
    elements.photoTags.value = '';
    
    elements.uploadArea.classList.remove('hidden');
    elements.uploadForm.classList.add('hidden');
    elements.uploadPreview.classList.add('hidden');
}

function handleUploadSubmit() {
    // Validate form
    if (!elements.photoTitle.value.trim()) {
        showNotification('Missing Title', 'Please enter a photo title', 'warning');
        return;
    }
    
    if (!elements.photoDescription.value.trim()) {
        showNotification('Missing Description', 'Please enter a description', 'warning');
        return;
    }
    
    // Simulate upload
    showNotification('Uploading...', 'Your photo is being processed', 'info');
    
    setTimeout(() => {
        // Create new photo object
        const newPhoto = {
            id: state.photos.length + 1,
            title: elements.photoTitle.value,
            description: elements.photoDescription.value,
            image: elements.previewImg.src,
            photographer: "You",
            photographerAvatar: "https://img.icons8.com/color/96/000000/user.png",
            category: elements.photoCategory.value,
            location: elements.photoLocation.value || "Unknown Location",
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            views: 0,
            featured: false,
            tags: elements.photoTags.value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        // Add to photos array
        state.photos.unshift(newPhoto);
        state.filteredPhotos.unshift(newPhoto);
        
        // Reset and close modal
        resetUploadModal();
        elements.uploadModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update gallery
        renderGallery();
        
        showNotification('Upload Successful!', 'Your photo has been added to the gallery', 'success');
    }, 2000);
}

// ===== NEWSLETTER =====
function handleNewsletterSubscribe() {
    const email = elements.newsletterEmail.value.trim();
    
    if (!email) {
        showNotification('Missing Email', 'Please enter your email address', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate subscription
    elements.newsletterEmail.value = '';
    showNotification('Subscribed!', 'Thank you for subscribing to our newsletter', 'success');
    
    // In a real app, you would send this to your backend
    console.log('Newsletter subscription:', email);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(title, message, type = 'success') {
    elements.notificationTitle.textContent = title;
    elements.notificationMessage.textContent = message;
    
    // Set icon based on type
    let icon = 'fa-check-circle';
    let color = 'var(--success)';
    
    switch (type) {
        case 'error':
            icon = 'fa-exclamation-circle';
            color = 'var(--danger)';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            color = 'var(--warning)';
            break;
        case 'info':
            icon = 'fa-info-circle';
            color = 'var(--primary)';
            break;
    }
    
    elements.notificationIcon.className = `fas ${icon}`;
    elements.notification.style.borderLeftColor = color;
    elements.notificationIcon.style.color = color;
    
    // Show notification
    elements.notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

function hideNotification() {
    elements.notification.classList.remove('show');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    elements.mobileNav.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        elements.mobileNav.classList.remove('active');
    });
});

// ===== LOADING STATES =====
function showLoading() {
    elements.loadingOverlay.classList.add('active');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===== INITIAL RENDER =====
// This ensures the gallery renders when the page loads
window.addEventListener('load', () => {
    // Add some initial likes/saves for demo
    if (state.likedPhotos.length === 0) {
        state.likedPhotos = [1, 2, 3, 5];
        state.savedPhotos = [1, 4, 8];
        saveToLocalStorage();
    }
    
    // Trigger initial render
    renderGallery();
});