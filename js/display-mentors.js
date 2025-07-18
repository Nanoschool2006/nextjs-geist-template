const mentorsKey = 'quantumMentors';

function getMentors() {
  const mentorsJSON = localStorage.getItem(mentorsKey);
  return mentorsJSON ? JSON.parse(mentorsJSON) : [];
}

function saveMentors(mentors) {
  localStorage.setItem(mentorsKey, JSON.stringify(mentors));
}

function displayMentors(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const mentors = getMentors();

  container.innerHTML = '';

  if (mentors.length === 0) {
    container.innerHTML = '<p>No mentors available yet.</p>';
    return;
  }

  mentors.forEach(mentor => {
    const card = document.createElement('div');
    card.className = 'border border-gray-300 rounded p-4 bg-gray-50 mb-4';

    const name = document.createElement('h3');
    name.textContent = mentor.name;
    name.className = 'text-lg font-semibold mb-1';

    const expertise = document.createElement('p');
    expertise.textContent = `Expertise: ${mentor.expertise}`;
    expertise.className = 'italic mb-2';

    const bio = document.createElement('p');
    bio.textContent = mentor.bio;

    card.appendChild(name);
    card.appendChild(expertise);
    card.appendChild(bio);

    container.appendChild(card);
  });
}

function addMentor(mentor) {
  const mentors = getMentors();
  mentors.push(mentor);
  saveMentors(mentors);
  displayMentors('mentors-list');
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', () => {
  displayMentors('mentors-list');
});
