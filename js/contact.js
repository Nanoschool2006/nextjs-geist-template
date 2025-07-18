// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const errorDiv = document.getElementById('form-errors');
  const errorList = document.getElementById('error-list');

  // Track page view
  trackPageView('contact');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    errorDiv.classList.add('hidden');
    errorList.innerHTML = '';

    // Validate form
    const errors = validateContactForm(form);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('#submit-text');
    const submitSpinner = submitBtn.querySelector('#submit-spinner');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitSpinner.classList.remove('hidden');

    try {
      // Track form interaction
      trackFormInteraction('contact', 'submitted');
      
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save contact submission
      saveContactSubmission(data);
      
      // Show success message
      showSuccessMessage();
      
      // Reset form
      form.reset();
      
      // Track success
      trackFormInteraction('contact', 'completed');
      
    } catch (error) {
      console.error('Error:', error);
      showErrors(['Something went wrong. Please try again.']);
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      submitSpinner.classList.add('hidden');
    }
  });

  function validateContactForm(form) {
    const errors = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];

    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!input.value.trim()) {
        errors.push(`Please provide your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });

    // Validate email format
    const email = form.querySelector('[name="email"]').value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone number if provided
    const phone = form.querySelector('[name="phone"]').value;
    if (phone && !/^[\d\s\+\-\(\)]{10,15}$/.test(phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Validate message length
    const message = form.querySelector('[name="message"]').value;
    if (message && message.length < 10) {
      errors.push('Please provide a more detailed message (at least 10 characters)');
    }

    return errors;
  }

  function showErrors(errors) {
    errorDiv.classList.remove('hidden');
    errors.forEach(error => {
      const li = document.createElement('li');
      li.textContent = error;
      errorList.appendChild(li);
    });
    errorDiv.scrollIntoView({ behavior: 'smooth' });
  }

  function saveContactSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  }

  function showSuccessMessage() {
    const successHTML = `
      <div id="success-message" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div class="text-green-600 mb-4">
            <i class="fas fa-check-circle fa-3x"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Message Sent Successfully!</h2>
          <p class="mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button onclick="closeSuccessMessage()" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Continue
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
  }

  // Global function to close success message
  window.closeSuccessMessage = function() {
    const modal = document.getElementById('success-message');
    if (modal) {
      modal.remove();
    }
  };

  // Close modal on outside click
  document.addEventListener('click', (e) => {
    if (e.target.id === 'success-message') {
      e.target.remove();
    }
  });
});
