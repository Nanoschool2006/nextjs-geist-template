// Authentication system with advanced features
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorDiv = document.getElementById('form-errors');
  const errorList = document.getElementById('error-list');

  // Demo users for testing
  const demoUsers = {
    'admin@nanoschool.in': {
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
      id: 'admin_001',
      permissions: ['all']
    },
    'student@example.com': {
      password: 'student123',
      role: 'student',
      name: 'John Doe',
      id: 'student_001',
      enrolledCourses: ['qc-fundamentals', 'quantum-algorithms'],
      progress: { 'qc-fundamentals': 65, 'quantum-algorithms': 30 }
    },
    'mentor@nanoschool.in': {
      password: 'mentor123',
      role: 'mentor',
      name: 'Dr. Sarah Wilson',
      id: 'mentor_001',
      expertise: ['Quantum Computing', 'Quantum Algorithms'],
      students: 25
    }
  };

  // Initialize authentication
  initializeAuth();

  // Login form handler
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = loginForm.querySelector('[name="password"]');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (togglePassword) {
      togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
      });
    }
  }

  // Register form handler
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  async function handleLogin(e) {
    e.preventDefault();
    
    clearErrors();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Validate inputs
    const errors = validateLoginForm(email, password);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Show loading state
    setLoadingState(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check credentials
      const user = authenticateUser(email, password);
      if (!user) {
        showErrors(['Invalid email or password']);
        return;
      }

      // Create session
      createUserSession(user, remember);
      
      // Track login
      trackUserActivity('login', { userId: user.id, role: user.role });
      
      // Redirect based on role
      redirectAfterLogin(user.role);
      
    } catch (error) {
      console.error('Login error:', error);
      showErrors(['Login failed. Please try again.']);
    } finally {
      setLoadingState(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    
    clearErrors();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    // Validate registration
    const errors = validateRegistrationForm(userData);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    setLoadingState(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new user
      const newUser = createNewUser(userData);
      
      // Create session
      createUserSession(newUser, false);
      
      // Track registration
      trackUserActivity('register', { userId: newUser.id, role: newUser.role });
      
      // Send welcome email (simulate)
      await sendWelcomeEmail(newUser);
      
      // Redirect to dashboard
      redirectAfterLogin(newUser.role);
      
    } catch (error) {
      console.error('Registration error:', error);
      showErrors(['Registration failed. Please try again.']);
    } finally {
      setLoadingState(false);
    }
  }

  function authenticateUser(email, password) {
    const user = demoUsers[email];
    if (user && user.password === password) {
      return { ...user, email };
    }
    return null;
  }

  function createNewUser(userData) {
    const userId = 'user_' + Date.now();
    return {
      id: userId,
      email: userData.email,
      name: userData.firstName + ' ' + userData.lastName,
      role: 'student',
      enrolledCourses: [],
      progress: {},
      createdAt: new Date().toISOString()
    };
  }

  function createUserSession(user, remember) {
    const sessionData = {
      user: user,
      loginTime: new Date().toISOString(),
      sessionId: generateSessionId()
    };

    // Store session
    if (remember) {
      localStorage.setItem('quantumUserSession', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('quantumUserSession', JSON.stringify(sessionData));
    }

    // Set auth token
    localStorage.setItem('quantumAuthToken', sessionData.sessionId);
  }

  function redirectAfterLogin(role) {
    const redirectUrls = {
      'admin': '/pages/quantum/admin-dashboard.html',
      'mentor': '/pages/quantum/mentor-dashboard.html',
      'student': '/pages/quantum/user-dashboard.html'
    };
    
    window.location.href = redirectUrls[role] || '/pages/quantum/user-dashboard.html';
  }

  function validateLoginForm(email, password) {
    const errors = [];
    
    if (!email) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format');
    
    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters');
    
    return errors;
  }

  function validateRegistrationForm(data) {
    const errors = [];
    
    if (!data.firstName) errors.push('First name is required');
    if (!data.lastName) errors.push('Last name is required');
    if (!data.email) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
    
    if (!data.password) errors.push('Password is required');
    else if (data.password.length < 8) errors.push('Password must be at least 8 characters');
    
    if (data.password !== data.confirmPassword) errors.push('Passwords do not match');
    
    if (!data.terms) errors.push('You must agree to the terms and conditions');
    
    return errors;
  }

  function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  function trackUserActivity(action, data) {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    activities.push({
      action,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: 'simulated_ip'
    });
    localStorage.setItem('userActivities', JSON.stringify(activities));
  }

  async function sendWelcomeEmail(user) {
    // Simulate SES email sending
    const emailData = {
      to: user.email,
      subject: 'Welcome to Quantum NanoSchool!',
      template: 'welcome',
      data: {
        name: user.name,
        loginUrl: window.location.origin + '/pages/quantum/login.html'
      }
    };
    
    // Store email for admin tracking
    const emails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    emails.push({
      ...emailData,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sentEmails', JSON.stringify(emails));
  }

  function initializeAuth() {
    // Check if user is already logged in
    const session = getCurrentSession();
    if (session && window.location.pathname.includes('login.html')) {
      redirectAfterLogin(session.user.role);
    }
  }

  function getCurrentSession() {
    const sessionData = localStorage.getItem('quantumUserSession') || 
                       sessionStorage.getItem('quantumUserSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  function clearErrors() {
    if (errorDiv) {
      errorDiv.classList.add('hidden');
      errorList.innerHTML = '';
    }
  }

  function showErrors(errors) {
    if (errorDiv && errorList) {
      errorDiv.classList.remove('hidden');
      errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
      });
      errorDiv.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function setLoadingState(loading) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    if (submitBtn && submitText && submitSpinner) {
      submitBtn.disabled = loading;
      submitText.textContent = loading ? 'Signing in...' : 'Sign In';
      submitSpinner.classList.toggle('hidden', !loading);
    }
  }

  // Global auth functions
  window.logout = function() {
    localStorage.removeItem('quantumUserSession');
    sessionStorage.removeItem('quantumUserSession');
    localStorage.removeItem('quantumAuthToken');
    
    trackUserActivity('logout', { timestamp: new Date().toISOString() });
    
    window.location.href = '/pages/quantum/login.html';
  };

  window.getCurrentUser = getCurrentSession;
  window.isAuthenticated = () => !!getCurrentSession();
  window.hasRole = (role) => {
    const session = getCurrentSession();
    return session && session.user.role === role;
  };
});
