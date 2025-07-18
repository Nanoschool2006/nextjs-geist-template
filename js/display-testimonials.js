const testimonialsKey = 'quantumTestimonials';

function getTestimonials() {
  const testimonialsJSON = localStorage.getItem(testimonialsKey);
  return testimonialsJSON ? JSON.parse(testimonialsJSON) : [];
}

function saveTestimonials(testimonials) {
  localStorage.setItem(testimonialsKey, JSON.stringify(testimonials));
}

function displayTestimonials(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const testimonials = getTestimonials();

  container.innerHTML = '';

  if (testimonials.length === 0) {
    container.innerHTML = '<p>No testimonials available yet.</p>';
    return;
  }

  testimonials.forEach(testimonial => {
    const card = document.createElement('div');
    card.className = 'border border-gray-300 rounded p-4 bg-gray-50 mb-4';

    const text = document.createElement('p');
    text.textContent = testimonial.text;
    text.className = 'mb-2';

    const author = document.createElement('p');
    author.textContent = `- ${testimonial.author}`;
    author.className = 'italic text-right';

    card.appendChild(text);
    card.appendChild(author);

    container.appendChild(card);
  });
}

function addTestimonial(testimonial) {
  const testimonials = getTestimonials();
  testimonials.push(testimonial);
  saveTestimonials(testimonials);
  displayTestimonials('testimonials-list');
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', () => {
  displayTestimonials('testimonials-list');
});
