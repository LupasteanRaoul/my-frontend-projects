document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const rsvpForm = document.getElementById('rsvpForm');
  const guestList = document.getElementById('guestList');
  const totalAttendees = document.getElementById('totalAttendees');
  const confirmedCount = document.getElementById('confirmedCount');
  const maybeCount = document.getElementById('maybeCount');
  const searchInput = document.getElementById('searchGuests');
  const statusFilter = document.getElementById('statusFilter');
  const exportBtn = document.getElementById('exportBtn');
  const confirmationModal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalX = document.querySelector('.close-modal');
  const currentYear = document.getElementById('currentYear');
  
  // State
  let guests = JSON.parse(localStorage.getItem('eventGuests')) || [];
  let currentStatus = 'attending';
  
  // Initialize
  function init() {
      // Set current year
      currentYear.textContent = new Date().getFullYear();
      
      // Load guests
      updateStats();
      renderGuests();
      
      // Event listeners for form
      setupFormListeners();
      
      // Event listeners for controls
      searchInput.addEventListener('input', renderGuests);
      statusFilter.addEventListener('change', renderGuests);
      exportBtn.addEventListener('click', exportGuestList);
      closeModalBtn.addEventListener('click', () => closeModal());
      closeModalX.addEventListener('click', () => closeModal());
      
      // Close modal when clicking outside
      confirmationModal.addEventListener('click', (e) => {
          if (e.target === confirmationModal) closeModal();
      });
      
      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
              closeModal();
          }
      });
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
          
          const guest = {
              id: Date.now(),
              name: document.getElementById('fullName').value.trim(),
              email: document.getElementById('email').value.trim(),
              guests: parseInt(document.getElementById('guests').value),
              status: currentStatus,
              dietary: document.getElementById('dietary').value.trim(),
              message: document.getElementById('message').value.trim(),
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
          
          // Reset form
          rsvpForm.reset();
          document.getElementById('guests').value = 1;
          document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
          document.querySelector('.status-btn[data-status="attending"]').classList.add('active');
          currentStatus = 'attending';
          document.getElementById('status').value = 'attending';
      });
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
      
      // Sort by date (newest first)
      filteredGuests.sort((a, b) => b.id - a.id);
      
      guestList.innerHTML = filteredGuests.map(guest => `
          <div class="guest-card ${guest.status}">
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
                  <button class="delete-btn" onclick="deleteGuest(${guest.id})">
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
  
  // Delete guest
  window.deleteGuest = function(id) {
      if (confirm('Are you sure you want to remove this guest from the list?')) {
          guests = guests.filter(guest => guest.id !== id);
          localStorage.setItem('eventGuests', JSON.stringify(guests));
          updateStats();
          renderGuests();
      }
  };
  
  // Export guest list
  function exportGuestList() {
      if (guests.length === 0) {
          alert('No guests to export.');
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
      
      confirmationModal.classList.add('active');
  }
  
  // Close modal
  function closeModal() {
      confirmationModal.classList.remove('active');
  }
  
  // Initialize the app
  init();
});