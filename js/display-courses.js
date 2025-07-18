const coursesKey = 'quantumCourses';

function getCourses() {
  const coursesJSON = localStorage.getItem(coursesKey);
  return coursesJSON ? JSON.parse(coursesJSON) : [];
}

function saveCourses(courses) {
  localStorage.setItem(coursesKey, JSON.stringify(courses));
}

function displayCourses(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const courses = getCourses();

  container.innerHTML = '';

  if (courses.length === 0) {
    container.innerHTML = '<p>No courses available yet.</p>';
    return;
  }

  courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'border border-gray-300 rounded p-4 bg-gray-50 mb-4';

    const title = document.createElement('h3');
    title.textContent = course.title;
    title.className = 'text-lg font-semibold mb-1';

    const description = document.createElement('p');
    description.textContent = course.description;
    description.className = 'mb-2';

    const mentor = document.createElement('p');
    mentor.textContent = `Mentor: ${course.mentor}`;
    mentor.className = 'italic';

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(mentor);

    container.appendChild(card);
  });
}

function addCourse(course) {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
  displayCourses('courses-list');
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', () => {
  displayCourses('courses-list');
});
