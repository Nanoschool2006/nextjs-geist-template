// Workshop registration and management
document.addEventListener('DOMContentLoaded', () => {
  // Track page view
  trackPageView('workshops');
  
  // Initialize workshop data
  const workshopData = {
    'qiskit-intro': {
      id: 'qiskit-intro',
      title: 'Introduction to Qiskit',
      date: 'August 12-13',
      price: '₹4,999',
      instructor: 'Dr. Priya Sharma',
      duration: '2 days',
      level: 'Beginner to Intermediate',
      prerequisites: 'Basic Python knowledge',
      maxParticipants: 15
    },
    'quantum-chemistry': {
      id: 'quantum-chemistry',
      title: 'Quantum Chemistry Applications',
      date: 'September 5-6',
      price: '₹5,999',
      instructor: 'Prof. Raj Patel',
      duration: '2 days',
      level: 'Intermediate to Advanced',
      prerequisites: 'Chemistry background preferred',
      maxParticipants: 12
    },
    'quantum-crypto': {
      id: 'quantum-crypto',
      title: 'Quantum Cryptography in Practice',
      date: 'October 18',
      price: '₹3,499',
      instructor: 'Dr. Ananya Gupta',
      duration: '1 day',
      level: 'Intermediate',
      prerequisites: 'Basic cryptography knowledge',
      maxParticipants: 20
    },
    'quantum-circuits': {
      id: 'quantum-circuits',
      title: 'Building Quantum Circuits',
      date: 'November 10-11',
      price: '₹6,999',
      instructor: 'Dr. Amit Joshi',
      duration: '2 days',
      level: 'Advanced',
      prerequisites: 'Quantum computing fundamentals',
      maxParticipants: 10
    }
  };

  // Global function for workshop registration
  window.registerWorkshop = function(workshopId) {
    const workshop = workshopData[workshopId];
    if (!workshop) {
      alert('Workshop not found');
      return;
    }

    // Store workshop selection
    localStorage.setItem('selectedWorkshop', JSON.stringify(workshop));
    
    // Track interaction
    trackFormInteraction('workshop-registration', 'initiated');
    
    // Show registration modal or redirect
    showRegistrationModal(workshop);
  };

  function showRegistrationModal(workshop) {
    // Create modal HTML
    const modalHTML = `
      <div id="workshop-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Register for Workshop</h2>
            <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times fa-lg"></i>
            </button>
          </div>
          
          <div class="mb-6">
            <h3 class="font-bold text-lg mb-2">${workshop.title}</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Date:</strong> ${workshop.date}</p>
              <p><strong>Duration:</strong> ${workshop.duration}</p>
              <p><strong>Instructor:</strong> ${workshop.instructor}</p>
              <p><strong>Level:</strong> ${workshop.level}</p>
              <p><strong>Prerequisites:</strong> ${workshop.prerequisites}</p>
              <p><strong>Max Participants:</strong> ${workshop.maxParticipants}</p>
              <p><strong>Price:</strong> ${workshop.price}</p>
            </div>
          </div>

          <form id="workshop-registration-form" class="space-y-4">
            <div>
              <label class="block font-semibold mb-1">Full Name</label>
              <input type="text" name="name" required class="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block font-semibold mb-1">Email</label>
              <input type="email" name="email" required class="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block font-semibold mb-1">Phone</label>
              <input type="tel" name="phone" required class="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block font-semibold mb-1">Experience Level</label>
              <select name="experience" required class="w-full p-3 border border-gray-300 rounded-lg">
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Register Now
            </button>
          </form>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submission handler
    const form = document.getElementById('workshop-registration-form');
    form.addEventListener('submit', handleWorkshopRegistration);
  }

  function handleWorkshopRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const registrationData = Object.fromEntries(formData.entries());
    const workshop = JSON.parse(localStorage.getItem('selectedWorkshop'));
    
    // Combine data
    const completeRegistration = {
      ...registrationData,
      workshop: workshop,
      timestamp: new Date().toISOString()
    };
    
    // Save registration
    const registrations = JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
    registrations.push(completeRegistration);
    localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));
    
    // Track completion
    trackFormInteraction('workshop-registration', 'completed');
    
    // Show success message
    showSuccessMessage(workshop.title);
    
    // Close modal
    closeModal();
  }

  function showSuccessMessage(workshopTitle) {
    const successHTML = `
      <div id="success-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div class="text-green-600 mb-4">
            <i class="fas fa-check-circle fa-3x"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p class="mb-6">You've successfully registered for <strong>${workshopTitle}</strong>. We'll send you confirmation details via email.</p>
          <button onclick="closeSuccessModal()" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Continue
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
  }

  // Global functions for modal management
  window.closeModal = function() {
    const modal = document.getElementById('workshop-modal');
    if (modal) {
      modal.remove();
    }
  };

  window.closeSuccessModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.remove();
    }
  };

  // Add click outside to close modal
  document.addEventListener('click', (e) => {
    if (e.target.id === 'workshop-modal' || e.target.id === 'success-modal') {
      e.target.remove();
    }
  });
});
