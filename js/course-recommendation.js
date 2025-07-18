// Course recommendation engine
document.addEventListener('DOMContentLoaded', () => {
  const skillLevelSelect = document.getElementById('skill-level');
  const interestAreaSelect = document.getElementById('interest-area');
  const getRecommendationsBtn = document.getElementById('get-recommendations');
  const recommendationsSection = document.getElementById('recommendations-section');
  const recommendedCoursesDiv = document.getElementById('recommended-courses');
  const allCoursesDiv = document.getElementById('all-courses');

  // Course database with detailed information
  const courseDatabase = [
    {
      id: 'qc-fundamentals',
      title: 'Quantum Computing Fundamentals',
      description: 'Learn the basics of quantum computing, qubits, and quantum gates',
      level: 'beginner',
      category: 'computing',
      duration: '8 weeks',
      price: '₹12,999',
      rating: 4.8,
      students: 1250,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/54acc4e8-141b-461a-8759-87d17d78a866.png',
      tags: ['beginner', 'qubits', 'quantum-gates', 'fundamentals']
    },
    {
      id: 'quantum-algorithms',
      title: 'Quantum Algorithms & Applications',
      description: 'Master Shor\'s, Grover\'s, and other quantum algorithms',
      level: 'intermediate',
      category: 'computing',
      duration: '12 weeks',
      price: '₹18,999',
      rating: 4.9,
      students: 890,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8ede1053-84ff-4bd0-a777-7ad8d6ab480d.png',
      tags: ['intermediate', 'algorithms', 'shor', 'grover']
    },
    {
      id: 'quantum-ml',
      title: 'Quantum Machine Learning',
      description: 'Combine quantum computing with AI and machine learning',
      level: 'advanced',
      category: 'machine-learning',
      duration: '10 weeks',
      price: '₹22,999',
      rating: 4.7,
      students: 650,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fefacfb5-2be4-4ca0-80c7-747867b486d1.png',
      tags: ['advanced', 'machine-learning', 'ai', 'neural-networks']
    },
    {
      id: 'quantum-cryptography',
      title: 'Quantum Cryptography & Security',
      description: 'Learn quantum key distribution and post-quantum cryptography',
      level: 'intermediate',
      category: 'cryptography',
      duration: '9 weeks',
      price: '₹16,999',
      rating: 4.6,
      students: 720,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fc47e37a-c744-4a23-9d91-af4ac90cc2e2.png',
      tags: ['intermediate', 'cryptography', 'security', 'quantum-key']
    },
    {
      id: 'quantum-physics',
      title: 'Quantum Physics for Computing',
      description: 'Deep dive into the physics behind quantum computing',
      level: 'advanced',
      category: 'physics',
      duration: '14 weeks',
      price: '₹24,999',
      rating: 4.8,
      students: 480,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/702abff5-8f44-4514-bd54-bf7197c9ae84.png',
      tags: ['advanced', 'physics', 'quantum-mechanics', 'theory']
    },
    {
      id: 'qiskit-programming',
      title: 'Quantum Programming with Qiskit',
      description: 'Hands-on programming with IBM\'s Qiskit framework',
      level: 'intermediate',
      category: 'computing',
      duration: '8 weeks',
      price: '₹14,999',
      rating: 4.7,
      students: 950,
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b75dd051-8cbc-401d-b20b-8a80ba999cd7.png',
      tags: ['intermediate', 'programming', 'qiskit', 'hands-on']
    }
  ];

  // Initialize page
  displayAllCourses();

  getRecommendationsBtn.addEventListener('click', () => {
    const skillLevel = skillLevelSelect.value;
    const interestArea = interestAreaSelect.value;

    if (!skillLevel || !interestArea) {
      alert('Please select both skill level and interest area');
      return;
    }

    const recommendations = getRecommendations(skillLevel, interestArea);
    displayRecommendations(recommendations);
    recommendationsSection.classList.remove('hidden');
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
  });

  function getRecommendations(skillLevel, interestArea) {
    // AI-like recommendation algorithm
    let recommendations = [];
    
    // Primary matches (exact level and category)
    const primaryMatches = courseDatabase.filter(course => 
      course.level === skillLevel && course.category === interestArea
    );
    
    // Secondary matches (same level, different category)
    const secondaryMatches = courseDatabase.filter(course => 
      course.level === skillLevel && course.category !== interestArea
    );
    
    // Tertiary matches (different level, same category)
    const tertiaryMatches = courseDatabase.filter(course => 
      course.level !== skillLevel && course.category === interestArea
    );

    // Combine and score recommendations
    recommendations = [
      ...primaryMatches.map(course => ({ ...course, score: 100 })),
      ...secondaryMatches.map(course => ({ ...course, score: 70 })),
      ...tertiaryMatches.map(course => ({ ...course, score: 50 }))
    ];

    // Sort by score and rating
    recommendations.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.rating - a.rating;
    });

    return recommendations.slice(0, 3); // Top 3 recommendations
  }

  function displayRecommendations(recommendations) {
    recommendedCoursesDiv.innerHTML = '';
    
    recommendations.forEach(course => {
      const courseCard = createCourseCard(course, true);
      recommendedCoursesDiv.appendChild(courseCard);
    });
  }

  function displayAllCourses() {
    allCoursesDiv.innerHTML = '';
    
    courseDatabase.forEach(course => {
      const courseCard = createCourseCard(course, false);
      allCoursesDiv.appendChild(courseCard);
    });
  }

  function createCourseCard(course, isRecommended = false) {
    const card = document.createElement('div');
    card.className = `bg-white rounded-xl shadow-md overflow-hidden course-card ${isRecommended ? 'border-2 border-yellow-400' : ''}`;
    
    card.innerHTML = `
      <div class="relative">
        <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover" />
        <div class="absolute top-2 right-2 bg-${getLevelColor(course.level)}-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          ${course.level.toUpperCase()}
        </div>
        ${isRecommended ? '<div class="absolute top-2 left-2 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-full">RECOMMENDED</div>' : ''}
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">${course.title}</h3>
        <p class="text-gray-600 mb-4">${course.description}</p>
        <div class="flex items-center mb-3">
          <div class="flex text-yellow-400 mr-2">
            ${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5 - Math.floor(course.rating))}
          </div>
          <span class="text-sm text-gray-600">${course.rating} (${course.students} students)</span>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center text-gray-500">
            <i class="fas fa-clock mr-1"></i>
            <span class="text-sm">${course.duration}</span>
          </div>
          <span class="text-blue-700 font-bold">${course.price}</span>
        </div>
        <button class="w-full mt-4 gradient-bg text-white py-2 rounded-lg font-semibold hover:opacity-90 transition" 
                onclick="enrollCourse('${course.id}')">
          Enroll Now
        </button>
      </div>
    `;
    
    return card;
  }

  function getLevelColor(level) {
    switch(level) {
      case 'beginner': return 'yellow';
      case 'intermediate': return 'green';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  }

  // Global function for enrollment
  window.enrollCourse = function(courseId) {
    const course = courseDatabase.find(c => c.id === courseId);
    if (course) {
      // Store selected course and redirect to lead capture
      localStorage.setItem('selectedCourse', JSON.stringify(course));
      window.location.href = '/forms/lead-capture/lead-capture-form.html';
    }
  };
});
