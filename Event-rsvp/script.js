document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const rsvpForm = document.getElementById('rsvpForm');
    const guestList = document.getElementById('guestList');
    const totalAttendees = document.getElementById('totalAttendees');
    const confirmedCount = document.getElementById('confirmedCount');
    const maybeCount = document.getElementById('maybeCount');
    const searchInput = document.getElementById('searchGuests');
    const statusFilter = document.getElementById('statusFilter');
    const sortGuests = document.getElementById('sortGuests');
    const exportBtn = document.getElementById('exportBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const deleteModal = document.getElementById('deleteModal');
    const backupModal = document.getElementById('backupModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalX = document.querySelectorAll('.close-modal');
    const currentYear = document.getElementById('currentYear');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const shareBtnFooter = document.getElementById('shareBtnFooter');
    const backupBtn = document.getElementById('backupBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // State
    let guests = JSON.parse(localStorage.getItem('eventGuests')) || [];
    let currentStatus = 'attending';
    let guestToDelete = null;
    
    // Initialize
    function init() {
        // Set current year
        currentYear.textContent = new Date().getFullYear();
        
        // Load guests with loading state
        showLoading();
        setTimeout(() => {
            updateStats();
            renderGuests();
            hideLoading();
        }, 500);
        
        // Event listeners for form
        setupFormListeners();
        
        // Event listeners for controls with debounce
        const debouncedRender = debounce(renderGuests, 300);
        searchInput.addEventListener('input', debouncedRender);
        statusFilter.addEventListener('change', renderGuests);
        sortGuests.addEventListener('change', renderGuests);
        
        // Event listeners for buttons
        exportBtn.addEventListener('click', exportGuestList);
        shareBtnFooter.addEventListener('click', shareEvent);
        backupBtn.addEventListener('click', () => openModal(backupModal));
        clearBtn.addEventListener('click', confirmClearAll);
        
        // Modal event listeners
        closeModalBtn.addEventListener('click', () => closeAllModals());
        cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));
        confirmDeleteBtn.addEventListener('click', deleteConfirmedGuest);
        exportJsonBtn.addEventListener('click', exportJsonData);
        importBtn.addEventListener('click', importJsonData);
        clearAllBtn.addEventListener('click', clearAllData);
        
        // File input change
        importFile.addEventListener('change', function() {
            importBtn.disabled = !this.files.length;
        });
        
        // Close modals with X buttons
        closeModalX.forEach(btn => {
            btn.addEventListener('click', () => closeAllModals());
        });
        
        // Close modals when clicking outside
        [confirmationModal, deleteModal, backupModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllModals();
        });
    }
    
    // Utility Functions
    function sanitizeInput(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove toast after duration
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    function showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
    }
    
    function hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
    
    function openModal(modal) {
        modal.classList.add('active');
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
    }
    
    function closeAllModals() {
        [confirmationModal, deleteModal, backupModal].forEach(closeModal);
    }
    
    // Setup form listeners
    function setupFormListeners() {
        // Number input controls
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = document.getElementById('guests');
                const action = this.dataset.action;
                let value = parseInt(input.value);
                
                if (action === 'increase' && value < 10) {
                    value++;
                } else if (action === 'decrease' && value > 1) {
                    value--;
                }
                
                input.value = value;
            });
        });
        
        // Status buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentStatus = this.dataset.status;
                document.getElementById('status').value = currentStatus;
            });
        });
        
        // Form submission
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            
            // Basic validation
            if (!nameInput.value.trim()) {
                showToast('Please enter your name', 'error');
                nameInput.focus();
                return;
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                showToast('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            const guest = {
                id: Date.now(),
                name: sanitizeInput(nameInput.value.trim()),
                email: sanitizeInput(emailInput.value.trim()),
                guests: parseInt(document.getElementById('guests').value),
                status: currentStatus,
                dietary: sanitizeInput(document.getElementById('dietary').value.trim()),
                message: sanitizeInput(document.getElementById('message').value.trim()),
                newsletter: document.getElementById('newsletter').checked,
                date: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            // Add guest
            guests.push(guest);
            localStorage.setItem('eventGuests', JSON.stringify(guests));
            
            // Update UI
            updateStats();
            renderGuests();
            
            // Show confirmation
            showConfirmation(guest);
            showToast('RSVP submitted successfully!', 'success');
            
            // Reset form
            rsvpForm.reset();
            document.getElementById('guests').value = 1;
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.status-btn[data-status="attending"]').classList.add('active');
            currentStatus = 'attending';
            document.getElementById('status').value = 'attending';
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Update statistics
    function updateStats() {
        const total = guests.reduce((sum, guest) => sum + guest.guests, 0);
        const attending = guests.filter(g => g.status === 'attending').length;
        const maybe = guests.filter(g => g.status === 'maybe').length;
        
        totalAttendees.textContent = total;
        confirmedCount.textContent = attending;
        maybeCount.textContent = maybe;
    }
    
    // Render guest list
    function renderGuests() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterStatus = statusFilter.value;
        const sortBy = sortGuests.value;
        
        let filteredGuests = guests.filter(guest => {
            // Search filter
            if (searchTerm && !guest.name.toLowerCase().includes(searchTerm) && 
                !guest.email.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Status filter
            if (filterStatus !== 'all' && guest.status !== filterStatus) {
                return false;
            }
            
            return true;
        });
        
        // Sort guests
        filteredGuests.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.id - a.id;
                case 'oldest':
                    return a.id - b.id;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return b.id - a.id;
            }
        });
        
        if (filteredGuests.length === 0) {
            guestList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <h3>No guests found</h3>
                    <p>${searchTerm ? 'Try a different search term' : 'Be the first to RSVP!'}</p>
                </div>
            `;
            return;
        }
        
        guestList.innerHTML = filteredGuests.map(guest => `
            <div class="guest-card ${guest.status}" data-id="${guest.id}">
                <div class="guest-header">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-status status-${guest.status}">
                        ${getStatusText(guest.status)}
                    </div>
                </div>
                
                <div class="guest-details">
                    <div class="guest-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${guest.email}</span>
                    </div>
                    
                    <div class="guest-detail">
                        <i class="fas fa-users"></i>
                        <span>${guest.guests} guest${guest.guests > 1 ? 's' : ''}</span>
                    </div>
                    
                    ${guest.dietary ? `
                    <div class="guest-detail">
                        <i class="fas fa-utensils"></i>
                        <span>${guest.dietary}</span>
                    </div>
                    ` : ''}
                    
                    ${guest.message ? `
                    <div class="guest-detail">
                        <i class="fas fa-comment"></i>
                        <span>${guest.message}</span>
                    </div>
                    ` : ''}
                    
                    <div class="guest-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>RSVP'd on ${guest.date}</span>
                    </div>
                    
                    ${guest.newsletter ? `
                    <div class="guest-detail">
                        <i class="fas fa-bell"></i>
                        <span>Subscribed to updates</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="guest-actions">
                    <button class="delete-btn" onclick="openDeleteModal(${guest.id}, '${sanitizeInput(guest.name)}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Get status display text
    function getStatusText(status) {
        const statusMap = {
            'attending': 'Attending',
            'maybe': 'Maybe',
            'not-attending': "Can't Attend"
        };
        return statusMap[status] || status;
    }
    
    // Delete guest functions
    window.openDeleteModal = function(id, name) {
        guestToDelete = id;
        document.getElementById('deleteDetails').innerHTML = `
            <p><strong>Guest:</strong> ${name}</p>
            <p><small>This action cannot be undone.</small></p>
        `;
        openModal(deleteModal);
    };
    
    function deleteConfirmedGuest() {
        if (guestToDelete) {
            guests = guests.filter(guest => guest.id !== guestToDelete);
            localStorage.setItem('eventGuests', JSON.stringify(guests));
            updateStats();
            renderGuests();
            closeModal(deleteModal);
            guestToDelete = null;
            showToast('Guest removed successfully', 'success');
        }
    }
    
    // Export guest list as CSV
    function exportGuestList() {
        if (guests.length === 0) {
            showToast('No guests to export', 'warning');
            return;
        }
        
        // Create CSV content
        let csv = 'Name,Email,Guests,Status,Dietary Preferences,Message,Date\n';
        guests.forEach(guest => {
            csv += `"${guest.name}","${guest.email}",${guest.guests},"${getStatusText(guest.status)}","${guest.dietary || ''}","${guest.message || ''}","${guest.date}"\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-guests-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Guest list exported as CSV', 'success');
    }
    
    // Show confirmation modal
    function showConfirmation(guest) {
        const details = document.getElementById('confirmationDetails');
        details.innerHTML = `
            <div style="display: grid; gap: 10px; margin-top: 15px;">
                <div><strong>Name:</strong> ${guest.name}</div>
                <div><strong>Email:</strong> ${guest.email}</div>
                <div><strong>Guests:</strong> ${guest.guests}</div>
                <div><strong>Status:</strong> ${getStatusText(guest.status)}</div>
                ${guest.dietary ? `<div><strong>Dietary:</strong> ${guest.dietary}</div>` : ''}
                ${guest.message ? `<div><strong>Message:</strong> ${guest.message}</div>` : ''}
            </div>
        `;
        
        openModal(confirmationModal);
    }
    
    // Share event
    function shareEvent() {
        const eventDetails = {
            title: 'Event RSVP Manager',
            text: 'Join me at this event! RSVP now using the Event RSVP Manager.',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(eventDetails)
                .then(() => showToast('Event shared successfully', 'success'))
                .catch(() => copyToClipboard());
        } else {
            copyToClipboard();
        }
    }
    
    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast('Link copied to clipboard', 'success'))
            .catch(() => showToast('Failed to copy link', 'error'));
    }
    
    // Backup/Restore functions
    function exportJsonData() {
        if (guests.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }
        
        const data = {
            guests: guests,
            exportedAt: new Date().toISOString(),
            totalGuests: guests.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-rsvp-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Data exported successfully', 'success');
    }
    
    function importJsonData() {
        const file = importFile.files[0];
        if (!file) {
            showToast('Please select a file first', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.guests || !Array.isArray(data.guests)) {
                    throw new Error('Invalid backup file format');
                }
                
                // Merge with existing data, avoiding duplicates by ID
                const existingIds = new Set(guests.map(g => g.id));
                const newGuests = data.guests.filter(g => !existingIds.has(g.id));
                
                if (newGuests.length === 0) {
                    showToast('No new guests to import', 'warning');
                    return;
                }
                
                guests = [...guests, ...newGuests];
                localStorage.setItem('eventGuests', JSON.stringify(guests));
                updateStats();
                renderGuests();
                
                showToast(`Imported ${newGuests.length} guest(s) successfully`, 'success');
                closeModal(backupModal);
                importFile.value = '';
                importBtn.disabled = true;
            } catch (error) {
                showToast('Error importing file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
    
    function confirmClearAll() {
        if (guests.length === 0) {
            showToast('No data to clear', 'warning');
            return;
        }
        
        if (confirm('Are you sure you want to clear ALL guest data? This cannot be undone!')) {
            clearAllData();
        }
    }
    
    function clearAllData() {
        guests = [];
        localStorage.removeItem('eventGuests');
        updateStats();
        renderGuests();
        showToast('All guest data cleared', 'success');
        closeModal(backupModal);
    }
    
    // Initialize the app
    init();
  });