// User Dashboard with Advanced Analytics
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/pages/quantum/login.html';
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.user.role !== 'student') {
    window.location.href = '/pages/quantum/login.html';
    return;
  }

  // Initialize dashboard
  initializeDashboard(currentUser.user);
  loadUserStats(currentUser.user);
  loadCourseProgress(currentUser.user);
  loadRecommendations(currentUser.user);
  loadUpcomingEvents(currentUser.user);
  loadRecentActivity(currentUser.user);
  initializeCharts(currentUser.user);
  setupEventListeners();

  function initializeDashboard(user) {
    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('welcomeName').textContent = user.name.split(' ')[0];
    
    // Update avatar
    const avatar = document.getElementById('userAvatar');
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c4dff&color=fff`;
    
    // Track dashboard view
    trackUserActivity('dashboard_view', { userId: user.id });
  }

  function loadUserStats(user) {
    // Simulate user statistics
    const stats = getUserStats(user);
    
    document.getElementById('enrolledCourses').textContent = stats.enrolledCourses;
    document.getElementById('avgProgress').textContent = stats.avgProgress + '%';
    document.getElementById('studyTime').textContent = stats.studyTime + 'h';
    document.getElementById('achievements').textContent = stats.achievements;
  }

  function getUserStats(user) {
    const enrolledCourses = user.enrolledCourses ? user.enrolledCourses.length : 2;
    const progress = user.progress || { 'qc-fundamentals': 65, 'quantum-algorithms': 30 };
    const avgProgress = Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / Object.keys(progress).length);
    
    return {
      enrolledCourses: enrolledCourses,
      avgProgress: avgProgress || 48,
      studyTime: Math.floor(Math.random() * 50) + 20,
      achievements: Math.floor(Math.random() * 10) + 3
    };
  }

  function loadCourseProgress(user) {
    const container = document.getElementById('courseProgressList');
    const courses = [
      {
        id: 'qc-fundamentals',
        title: 'Quantum Computing Fundamentals',
        progress: user.progress?.['qc-fundamentals'] || 65,
        nextLesson: 'Quantum Gates and Circuits',
        timeLeft: '2 weeks'
      },
      {
        id: 'quantum-algorithms',
        title: 'Quantum Algorithms & Applications',
        progress: user.progress?.['quantum-algorithms'] || 30,
        nextLesson: 'Shor\'s Algorithm Implementation',
        timeLeft: '4 weeks'
      }
    ];

    container.innerHTML = courses.map(course => `
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold">${course.title}</h3>
          <span class="text-sm text-gray-500">${course.progress}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div class="bg-blue-600 h-2 rounded-full" style="width: ${course.progress}%"></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600">
          <span>Next: ${course.nextLesson}</span>
          <span>${course.timeLeft} left</span>
        </div>
        <button class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium" onclick="continueCourse('${course.id}')">
          Continue Learning →
        </button>
      </div>
    `).join('');
  }

  function loadRecommendations(user) {
    const container = document.getElementById('recommendationsList');
    const recommendations = [
      {
        type: 'course',
        title: 'Quantum Machine Learning',
        reason: 'Based on your progress in algorithms',
        action: 'Enroll Now'
      },
      {
        type: 'workshop',
        title: 'Quantum Cryptography Workshop',
        reason: 'Trending in your field',
        action: 'Register'
      },
      {
        type: 'mentor',
        title: 'Dr. Sarah Wilson',
        reason: 'Expert in your learning areas',
        action: 'Book Session'
      }
    ];

    container.innerHTML = recommendations.map(rec => `
      <div class="border border-gray-200 rounded-lg p-3">
        <h4 class="font-medium text-sm">${rec.title}</h4>
        <p class="text-xs text-gray-600 mb-2">${rec.reason}</p>
        <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">${rec.action}</button>
      </div>
    `).join('');
  }

  function loadUpcomingEvents(user) {
    const container = document.getElementById('upcomingEvents');
    const events = [
      {
        title: 'Quantum Computing Webinar',
        date: 'Tomorrow, 3:00 PM',
        type: 'webinar'
      },
      {
        title: 'Study Group: Quantum Algorithms',
        date: 'Friday, 7:00 PM',
        type: 'study-group'
      },
      {
        title: 'Assignment Due: QC Fundamentals',
        date: 'Next Monday',
        type: 'assignment'
      }
    ];

    container.innerHTML = events.map(event => `
      <div class="border border-gray-200 rounded-lg p-3">
        <h4 class="font-medium text-sm">${event.title}</h4>
        <p class="text-xs text-gray-600">${event.date}</p>
        <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full ${getEventTypeClass(event.type)}">
          ${event.type.replace('-', ' ')}
        </span>
      </div>
    `).join('');
  }

  function loadRecentActivity(user) {
    const container = document.getElementById('recentActivity');
    const activities = [
      {
        action: 'Completed lesson',
        subject: 'Quantum Superposition',
        time: '2 hours ago'
      },
      {
        action: 'Submitted assignment',
        subject: 'Quantum Gates Exercise',
        time: '1 day ago'
      },
      {
        action: 'Joined workshop',
        subject: 'Introduction to Qiskit',
        time: '3 days ago'
      }
    ];

    container.innerHTML = activities.map(activity => `
      <div class="border border-gray-200 rounded-lg p-3">
        <p class="text-sm"><strong>${activity.action}</strong></p>
        <p class="text-sm text-gray-600">${activity.subject}</p>
        <p class="text-xs text-gray-500">${activity.time}</p>
      </div>
    `).join('');
  }

  function initializeCharts(user) {
    // Weekly Progress Chart
    const weeklyCtx = document.getElementById('weeklyProgressChart').getContext('2d');
    new Chart(weeklyCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Study Hours',
          data: [2, 3, 1, 4, 2, 5, 3],
          borderColor: '#5e35b1',
          backgroundColor: 'rgba(94, 53, 177, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 6
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Study Time Distribution Chart
    const studyCtx = document.getElementById('studyTimeChart').getContext('2d');
    new Chart(studyCtx, {
      type: 'doughnut',
      data: {
        labels: ['Theory', 'Practice', 'Assignments', 'Projects'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#5e35b1', '#3949ab', '#7c4dff', '#9c27b0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              fontSize: 12
            }
          }
        }
      }
    });
  }

  function setupEventListeners() {
    // Study session scheduling
    const scheduleButtons = document.querySelectorAll('button');
    scheduleButtons.forEach(btn => {
      if (btn.textContent.includes('Schedule Study Session')) {
        btn.addEventListener('click', openStudyModal);
      }
    });

    // Study session form
    const studyForm = document.getElementById('studySessionForm');
    if (studyForm) {
      studyForm.addEventListener('submit', handleStudySessionSchedule);
    }
  }

  function openStudyModal() {
    const modal = document.getElementById('studySessionModal');
    const courseSelect = modal.querySelector('select[name="course"]');
    
    // Populate courses
    const user = getCurrentUser().user;
    const courses = user.enrolledCourses || ['qc-fundamentals', 'quantum-algorithms'];
    courseSelect.innerHTML = '<option value="">Select a course</option>' +
      courses.map(courseId => `<option value="${courseId}">${getCourseTitle(courseId)}</option>`).join('');
    
    modal.classList.remove('hidden');
  }

  function handleStudySessionSchedule(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const sessionData = Object.fromEntries(formData.entries());
    
    // Save study session
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    sessions.push({
      ...sessionData,
      id: Date.now().toString(),
      userId: getCurrentUser().user.id,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    
    // Track activity
    trackUserActivity('study_session_scheduled', sessionData);
    
    // Close modal and show success
    closeStudyModal();
    showNotification('Study session scheduled successfully!', 'success');
    
    // Refresh upcoming events
    loadUpcomingEvents(getCurrentUser().user);
  }

  function getEventTypeClass(type) {
    const classes = {
      'webinar': 'bg-blue-100 text-blue-800',
      'study-group': 'bg-green-100 text-green-800',
      'assignment': 'bg-red-100 text-red-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  function getCourseTitle(courseId) {
    const titles = {
      'qc-fundamentals': 'Quantum Computing Fundamentals',
      'quantum-algorithms': 'Quantum Algorithms & Applications',
      'quantum-ml': 'Quantum Machine Learning'
    };
    return titles[courseId] || courseId;
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Global functions
  window.continueCourse = function(courseId) {
    trackUserActivity('course_continued', { courseId });
    // Simulate course continuation
    showNotification(`Continuing ${getCourseTitle(courseId)}...`, 'success');
  };

  window.closeStudyModal = function() {
    document.getElementById('studySessionModal').classList.add('hidden');
  };

  // Advanced Analytics Functions
  function generateLearningInsights(user) {
    const insights = {
      learningStreak: Math.floor(Math.random() * 15) + 5,
      weeklyGoalProgress: Math.floor(Math.random() * 100),
      strongestSubject: 'Quantum Gates',
      improvementArea: 'Quantum Algorithms',
      recommendedStudyTime: '2-3 hours/day',
      nextMilestone: 'Complete Quantum Fundamentals'
    };
    
    return insights;
  }

  function trackLearningPattern(user) {
    const patterns = {
      preferredStudyTime: 'Evening (6-9 PM)',
      averageSessionLength: '45 minutes',
      mostActiveDay: 'Wednesday',
      learningStyle: 'Visual + Hands-on',
      completionRate: '78%'
    };
    
    return patterns;
  }

  // Remarketing data collection
  function collectRemarketingData(user) {
    const remarketingData = {
      userId: user.id,
      lastActive: new Date().toISOString(),
      coursesInProgress: user.enrolledCourses || [],
      averageProgress: getUserStats(user).avgProgress,
      engagementLevel: calculateEngagementLevel(user),
      interests: extractUserInterests(user),
      nextRecommendedAction: getNextRecommendedAction(user)
    };
    
    // Store for SES integration
    localStorage.setItem('remarketingData_' + user.id, JSON.stringify(remarketingData));
    
    return remarketingData;
  }

  function calculateEngagementLevel(user) {
    // Simple engagement calculation
    const stats = getUserStats(user);
    const score = (stats.avgProgress + stats.studyTime * 2 + stats.achievements * 5) / 3;
    
    if (score > 80) return 'high';
    if (score > 50) return 'medium';
    return 'low';
  }

  function extractUserInterests(user) {
    // Extract interests based on course progress and activity
    const interests = [];
    if (user.progress?.['qc-fundamentals'] > 50) interests.push('quantum-computing');
    if (user.progress?.['quantum-algorithms'] > 30) interests.push('algorithms');
    return interests;
  }

  function getNextRecommendedAction(user) {
    const stats = getUserStats(user);
    if (stats.avgProgress < 30) return 'continue_current_course';
    if (stats.enrolledCourses < 3) return 'enroll_new_course';
    return 'join_advanced_workshop';
  }

  // Initialize remarketing data collection
  collectRemarketingData(getCurrentUser().user);
});
