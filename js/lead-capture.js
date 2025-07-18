// Lead capture form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadCaptureForm');
  const planContent = document.getElementById('plan-content');
  const errorDiv = document.getElementById('form-errors');
  const errorList = document.getElementById('error-list');

  // Load and display the personalized plan from localStorage
  const personalizationData = JSON.parse(localStorage.getItem('quantumPersonalization'));
  if (personalizationData) {
    const plan = personalizationData.recommendations;
    let html = `
      <p class="mb-4">${plan.description}</p>
      <h4 class="font-semibold mb-2">Selected Courses:</h4>
      <ul class="space-y-3 mb-6">`;

    plan.courses.forEach(course => {
      html += `
        <li class="flex justify-between items-center p-3 bg-gray-100 rounded">
          <span>${course.title}</span>
          <span class="font-bold">${course.price}</span>
        </li>`;
    });

    html += `</ul>`;
    planContent.innerHTML = html;
  } else {
    // Redirect back if no personalization data exists
    window.location.href = '/forms/personalization/personalization-form.html';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    errorDiv.classList.add('hidden');
    errorList.innerHTML = '';

    // Validate form
    const errors = validateForm(form);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.querySelector('#submit-text').textContent = 'Processing...';
    submitBtn.querySelector('#submit-spinner').classList.remove('hidden');

    try {
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Combine with personalization data
      const leadData = {
        ...data,
        personalization: personalizationData
      };

      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage
      localStorage.setItem('quantumLead', JSON.stringify(leadData));
      
      // Redirect to thank you page
      window.location.href = '/pages/quantum/thank-you.html';
      
    } catch (error) {
      console.error('Error:', error);
      showErrors(['Something went wrong. Please try again.']);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('#submit-text').textContent = 'Complete Enrollment';
      submitBtn.querySelector('#submit-spinner').classList.add('hidden');
    }
  });

  function validateForm(form) {
    const errors = [];
    const fields = ['fullname', 'phone', 'country', 'payment'];

    fields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!input.value.trim()) {
        errors.push(`Please provide your ${field.replace('-', ' ')}`);
      }
    });

    // Validate phone number format
    const phone = form.querySelector('[name="phone"]').value;
    if (phone && !/^[\d\s\+\-\(\)]{10,15}$/.test(phone)) {
      errors.push('Please enter a valid phone number');
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
});
