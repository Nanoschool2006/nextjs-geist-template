// Admin Dashboard with Advanced Analytics and SES Integration
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication and admin role
  if (!isAuthenticated() || !hasRole('admin')) {
    window.location.href = '/pages/quantum/login.html';
    return;
  }

  const currentUser = getCurrentUser();
  initializeAdminDashboard(currentUser.user);
  loadAdminStats();
  loadUserManagement();
  loadRemarketingData();
  initializeAdminCharts();
  setupAdminEventListeners();

  function initializeAdminDashboard(user) {
    document.getElementById('adminName').textContent = user.name;
    const avatar = document.getElementById('adminAvatar');
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b6b&color=fff`;
    
    trackUserActivity('admin_dashboard_view', { userId: user.id });
  }

  function loadAdminStats() {
    // Simulate admin statistics
    const stats = getAdminStats();
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('activeEnrollments').textContent = stats.activeEnrollments;
    document.getElementById('totalRevenue').textContent = '₹' + stats.totalRevenue.toLocaleString();
    document.getElementById('conversionRate').textContent = stats.conversionRate + '%';
    
    // Remarketing stats
    document.getElementById('totalCampaigns').textContent = stats.totalCampaigns;
    document.getElementById('openRate').textContent = stats.openRate + '%';
    document.getElementById('clickRate').textContent = stats.clickRate + '%';
    document.getElementById('emailsSent').textContent = stats.emailsSent;
    document.getElementById('emailBounces').textContent = stats.emailBounces;
    document.getElementById('emailComplaints').textContent = stats.emailComplaints;
  }

  function getAdminStats() {
    // Simulate real-time admin statistics
    return {
      totalUsers: Math.floor(Math.random() * 1000) + 500,
      activeEnrollments: Math.floor(Math.random() * 300) + 150,
      totalRevenue: Math.floor(Math.random() * 500000) + 250000,
      conversionRate: Math.floor(Math.random() * 20) + 15,
      totalCampaigns: Math.floor(Math.random() * 10) + 5,
      openRate: Math.floor(Math.random() * 30) + 25,
      clickRate: Math.floor(Math.random() * 15) + 8,
      emailsSent: Math.floor(Math.random() * 1000) + 500,
      emailBounces: Math.floor(Math.random() * 20) + 5,
      emailComplaints: Math.floor(Math.random() * 5) + 1
    };
  }

  function loadUserManagement() {
    const usersTableBody = document.getElementById('usersTableBody');
    const users = getAllUsers();
    
    usersTableBody.innerHTML = users.map(user => `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <img class="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random" alt="">
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${user.name}</div>
              <div class="text-sm text-gray-500">${user.email}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}">
            ${user.role}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status)}">
            ${user.status || 'active'}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${getRelativeTime(user.lastActive)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button onclick="editUser('${user.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
          <button onclick="suspendUser('${user.id}')" class="text-red-600 hover:text-red-900">Suspend</button>
        </td>
      </tr>
    `).join('');
  }

  function getAllUsers() {
    // Simulate user data from various sources
    const demoUsers = [
      {
        id: 'user_001',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        status: 'active',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'user_002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'mentor',
        status: 'active',
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'user_003',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'student',
        status: 'inactive',
        lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Add users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    return [...demoUsers, ...storedUsers];
  }

  function loadRemarketingData() {
    const campaignsList = document.getElementById('campaignsList');
    const campaigns = getRemarketingCampaigns();
    
    campaignsList.innerHTML = campaigns.map(campaign => `
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-semibold">${campaign.name}</h3>
            <p class="text-sm text-gray-600">${campaign.type} • ${campaign.audience}</p>
          </div>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCampaignStatusClass(campaign.status)}">
            ${campaign.status}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Sent:</span>
            <span class="font-medium">${campaign.sent}</span>
          </div>
          <div>
            <span class="text-gray-500">Opens:</span>
            <span class="font-medium">${campaign.opens} (${campaign.openRate}%)</span>
          </div>
          <div>
            <span class="text-gray-500">Clicks:</span>
            <span class="font-medium">${campaign.clicks} (${campaign.clickRate}%)</span>
          </div>
        </div>
        <div class="mt-3 flex space-x-2">
          <button onclick="viewCampaign('${campaign.id}')" class="text-blue-600 hover:text-blue-800 text-sm">View</button>
          <button onclick="duplicateCampaign('${campaign.id}')" class="text-green-600 hover:text-green-800 text-sm">Duplicate</button>
          <button onclick="pauseCampaign('${campaign.id}')" class="text-yellow-600 hover:text-yellow-800 text-sm">Pause</button>
        </div>
      </div>
    `).join('');
  }

  function getRemarketingCampaigns() {
    return [
      {
        id: 'camp_001',
        name: 'Welcome Series - New Students',
        type: 'welcome',
        audience: 'new-users',
        status: 'active',
        sent: 245,
        opens: 180,
        openRate: 73,
        clicks: 45,
        clickRate: 18
      },
      {
        id: 'camp_002',
        name: 'Course Completion Reminder',
        type: 'course-reminder',
        audience: 'course-incomplete',
        status: 'active',
        sent: 156,
        opens: 89,
        openRate: 57,
        clicks: 23,
        clickRate: 15
      },
      {
        id: 'camp_003',
        name: 'Re-engagement Campaign',
        type: 're-engagement',
        audience: 'inactive-users',
        status: 'paused',
        sent: 89,
        opens: 34,
        openRate: 38,
        clicks: 8,
        clickRate: 9
      }
    ];
  }

  function initializeAdminCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(userGrowthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'New Users',
          data: [65, 89, 120, 151, 189, 234, 287],
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
            beginAtZero: true
          }
        }
      }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [45000, 67000, 89000, 123000, 156000, 189000, 234000],
          backgroundColor: '#3949ab'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  function setupAdminEventListeners() {
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('aside a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        showAdminSection(target);
        
        // Update active state
        sidebarLinks.forEach(l => l.classList.remove('bg-gray-100'));
        e.target.classList.add('bg-gray-100');
      });
    });

    // Campaign form
    const campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
      campaignForm.addEventListener('submit', handleCampaignCreation);
    }
  }

  function showAdminSection(sectionName) {
    // Hide all sections
    const sections = ['overview-section', 'users-section', 'remarketing-section'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) element.classList.add('hidden');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // Load section-specific data
    if (sectionName === 'users') {
      loadUserManagement();
    } else if (sectionName === 'remarketing') {
      loadRemarketingData();
    }
  }

  function handleCampaignCreation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const campaignData = Object.fromEntries(formData.entries());
    
    // Create campaign
    const newCampaign = {
      id: 'camp_' + Date.now(),
      ...campaignData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      sent: 0,
      opens: 0,
      clicks: 0
    };
    
    // Save campaign
    const campaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
    campaigns.push(newCampaign);
    localStorage.setItem('emailCampaigns', JSON.stringify(campaigns));
    
    // Track activity
    trackUserActivity('campaign_created', { campaignId: newCampaign.id, type: campaignData.type });
    
    // Close modal and refresh
    closeCampaignModal();
    loadRemarketingData();
    showNotification('Campaign created successfully!', 'success');
    
    // Simulate SES email sending
    simulateSESCampaign(newCampaign);
  }

  function simulateSESCampaign(campaign) {
    // Simulate AWS SES integration
    const sesData = {
      campaignId: campaign.id,
      source: 'quantum@nanoschool.in',
      destination: getTargetAudience(campaign.audience),
      message: {
        subject: campaign.subject,
        body: campaign.content
      },
      configurationSet: 'quantum-campaigns',
      tags: [
        { name: 'Campaign', value: campaign.name },
        { name: 'Type', value: campaign.type }
      ]
    };
    
    // Store SES simulation data
    const sesLogs = JSON.parse(localStorage.getItem('sesLogs') || '[]');
    sesLogs.push({
      ...sesData,
      timestamp: new Date().toISOString(),
      status: 'sent',
      messageId: 'msg_' + Date.now()
    });
    localStorage.setItem('sesLogs', JSON.stringify(sesLogs));
    
    console.log('SES Campaign Simulated:', sesData);
  }

  function getTargetAudience(audienceType) {
    const audiences = {
      'all-users': ['user1@example.com', 'user2@example.com', 'user3@example.com'],
      'inactive-users': ['inactive1@example.com', 'inactive2@example.com'],
      'course-incomplete': ['incomplete1@example.com', 'incomplete2@example.com'],
      'high-engagement': ['engaged1@example.com', 'engaged2@example.com']
    };
    
    return audiences[audienceType] || [];
  }

  // Utility functions
  function getRoleBadgeClass(role) {
    const classes = {
      'admin': 'bg-red-100 text-red-800',
      'mentor': 'bg-blue-100 text-blue-800',
      'student': 'bg-green-100 text-green-800'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  function getStatusBadgeClass(status) {
    const classes = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-yellow-100 text-yellow-800',
      'suspended': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  function getCampaignStatusClass(status) {
    const classes = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'draft': 'bg-gray-100 text-gray-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  function getRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
  window.createCampaign = function() {
    document.getElementById('campaignModal').classList.remove('hidden');
  };

  window.closeCampaignModal = function() {
    document.getElementById('campaignModal').classList.add('hidden');
  };

  window.editUser = function(userId) {
    showNotification(`Editing user ${userId}`, 'info');
  };

  window.suspendUser = function(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
      showNotification(`User ${userId} suspended`, 'success');
    }
  };

  window.viewCampaign = function(campaignId) {
    showNotification(`Viewing campaign ${campaignId}`, 'info');
  };

  window.duplicateCampaign = function(campaignId) {
    showNotification(`Campaign ${campaignId} duplicated`, 'success');
  };

  window.pauseCampaign = function(campaignId) {
    showNotification(`Campaign ${campaignId} paused`, 'success');
  };

  // Advanced Analytics Functions
  function generateAdvancedAnalytics() {
    return {
      userEngagement: calculateUserEngagement(),
      conversionFunnel: getConversionFunnelData(),
      cohortAnalysis: getCohortAnalysis(),
      revenueAnalytics: getRevenueAnalytics(),
      churnPrediction: getChurnPrediction()
    };
  }

  function calculateUserEngagement() {
    // Calculate engagement metrics
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    const engagementData = {
      dailyActiveUsers: Math.floor(Math.random() * 100) + 50,
      weeklyActiveUsers: Math.floor(Math.random() * 300) + 200,
      monthlyActiveUsers: Math.floor(Math.random() * 800) + 500,
      averageSessionDuration: Math.floor(Math.random() * 30) + 15,
      pageViewsPerSession: Math.floor(Math.random() * 10) + 5
    };
    
    return engagementData;
  }

  function getConversionFunnelData() {
    return {
      visitors: 1000,
      signups: 250,
      courseViews: 180,
      enrollments: 89,
      completions: 34
    };
  }

  function getCohortAnalysis() {
    // Simulate cohort retention data
    return {
      week1: 100,
      week2: 78,
      week3: 65,
      week4: 54,
      week8: 42,
      week12: 38
    };
  }

  function getRevenueAnalytics() {
    return {
      mrr: 45000, // Monthly Recurring Revenue
      arr: 540000, // Annual Recurring Revenue
      ltv: 2500, // Customer Lifetime Value
      cac: 150, // Customer Acquisition Cost
      churnRate: 5.2
    };
  }

  function getChurnPrediction() {
    // AI-based churn prediction simulation
    return {
      highRisk: 23,
      mediumRisk: 45,
      lowRisk: 156,
      totalUsers: 224
    };
  }

  // Initialize advanced analytics
  const analytics = generateAdvancedAnalytics();
  console.log('Advanced Analytics:', analytics);
});
