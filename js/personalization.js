// Personalization form handling and recommendation engine
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('personalizationForm');
  const resultDiv = document.getElementById('recommendation-result');
  const contentDiv = document.getElementById('recommendation-content');
  const errorDiv = document.getElementById('form-errors');
  const errorList = document.getElementById('error-list');

  // Track page view
  trackPageView('personalization-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    errorDiv.classList.add('hidden');
    errorList.innerHTML = '';

    // Validate form
    const errors = validatePersonalizationForm(form);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('#submit-text');
    const submitSpinner = submitBtn.querySelector('#submit-spinner');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Analyzing your responses...';
    submitSpinner.classList.remove('hidden');

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Track form interaction
      trackFormInteraction('personalization', 'submitted');
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate recommendations
      const recommendations = generateRecommendations(data);
      
      // Display results
      contentDiv.innerHTML = formatRecommendations(recommendations);
      resultDiv.classList.remove('hidden');
      
      // Scroll to results
      resultDiv.scrollIntoView({ behavior: 'smooth' });
      
      // Save to localStorage
      savePersonalizationData(data, recommendations);
      
      // Track success
      trackFormInteraction('personalization', 'completed');
      
    } catch (error) {
      console.error('Error:', error);
      showErrors(['Something went wrong. Please try again.']);
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Get My Personalized Path';
      submitSpinner.classList.add('hidden');
    }
  });

  function validatePersonalizationForm(form) {
    const errors = [];
    const requiredFields = ['background', 'goal', 'experience', 'time-commitment', 'email'];

    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!input.value.trim()) {
        errors.push(`Please select your ${field.replace('-', ' ')}`);
      }
    });

    // Validate email format
    const email = form.querySelector('[name="email"]').value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Check consent checkbox
    const consent = form.querySelector('[name="consent"]');
    if (consent && !consent.checked) {
      errors.push('Please agree to receive educational emails');
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

  // Recommendation engine logic
  function generateRecommendations(data) {
    const courses = {
      beginner: [
        { id: 'qc101', title: 'Quantum Computing Fundamentals', weeks: 8, price: '₹12,999' },
        { id: 'qm101', title: 'Quantum Mathematics Basics', weeks: 6, price: '₹9,999' }
      ],
      intermediate: [
        { id: 'qa201', title: 'Quantum Algorithms', weeks: 10, price: '₹15,999' },
        { id: 'qp201', title: 'Quantum Programming with Qiskit', weeks: 8, price: '₹13,999' }
      ],
      advanced: [
        { id: 'qc301', title: 'Advanced Quantum Computing', weeks: 12, price: '₹19,999' },
        { id: 'qml301', title: 'Quantum Machine Learning', weeks: 10, price: '₹18,999' }
      ]
    };

    let recommendedCourses = [];
    let pathDescription = '';
    let mentorRecommendation = '';

    // Determine course recommendations based on experience
    if (data.experience === 'beginner') {
      recommendedCourses = courses.beginner;
      pathDescription = 'Starting with fundamentals to build your quantum knowledge base';
    } else if (data.experience === 'intermediate') {
      recommendedCourses = courses.intermediate;
      pathDescription = 'Building practical quantum programming skills';
    } else {
      recommendedCourses = courses.advanced;
      pathDescription = 'Advanced topics for quantum researchers and developers';
    }

    // Add goal-specific recommendations
    if (data.goal === 'career-change') {
      recommendedCourses.push(
        { id: 'qc-career', title: 'Quantum Career Transition', weeks: 4, price: '₹7,999' }
      );
      mentorRecommendation = 'Consider booking sessions with our career transition mentors';
    } else if (data.goal === 'research') {
      recommendedCourses.push(
        { id: 'qc-research', title: 'Quantum Research Methods', weeks: 6, price: '₹11,999' }
      );
      mentorRecommendation = 'Our academic research mentors can guide your quantum research';
    }

    return {
      courses: recommendedCourses,
      description: pathDescription,
      mentor: mentorRecommendation,
      timeCommitment: data['time-commitment']
    };
  }

  function formatRecommendations(rec) {
    let html = `
      <p class="mb-4">${rec.description}</p>
      <h4 class="font-semibold mb-2">Recommended Courses:</h4>
      <ul class="space-y-3 mb-6">`;

    rec.courses.forEach(course => {
      html += `
        <li class="flex justify-between items-center p-3 bg-gray-100 rounded">
          <span>${course.title} (${course.weeks} weeks)</span>
          <span class="font-bold">${course.price}</span>
        </li>`;
    });

    html += `</ul>`;

    if (rec.mentor) {
      html += `
        <div class="p-3 bg-blue-50 rounded-lg mb-4">
          <h4 class="font-semibold mb-1">Mentor Recommendation:</h4>
          <p>${rec.mentor}</p>
        </div>`;
    }

    html += `
      <p class="text-sm text-gray-600">Based on your available time: ${rec.timeCommitment} hours/week</p>`;

    return html;
  }

  function savePersonalizationData(data, recommendations) {
    const personalizationData = {
      timestamp: new Date().toISOString(),
      formData: data,
      recommendations: recommendations
    };
    localStorage.setItem('quantumPersonalization', JSON.stringify(personalizationData));
  }
});
