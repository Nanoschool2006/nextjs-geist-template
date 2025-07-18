// Advanced Analytics and User Tracking System
class AdvancedAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getCurrentUserId();
    this.startTime = Date.now();
    this.events = [];
    this.userProperties = {};
    this.pageViews = [];
    this.conversionFunnel = new Map();
    
    this.initializeAnalytics();
    this.setupEventListeners();
    this.startSessionTracking();
  }

  initializeAnalytics() {
    // Initialize analytics with user context
    this.userProperties = {
      sessionId: this.sessionId,
      userId: this.userId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    // Load existing analytics data
    this.loadStoredAnalytics();
    
    console.log('Advanced Analytics initialized:', this.userProperties);
  }

  setupEventListeners() {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        hidden: document.hidden,
        timestamp: Date.now()
      });
    });

    // Scroll tracking
    let scrollDepth = 0;
    window.addEventListener('scroll', this.throttle(() => {
      const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (currentScroll > scrollDepth && currentScroll % 25 === 0) {
        scrollDepth = currentScroll;
        this.trackEvent('scroll_depth', {
          depth: scrollDepth,
          page: window.location.pathname
        });
      }
    }, 1000));

    // Click tracking
    document.addEventListener('click', (e) => {
      this.trackClick(e);
    });

    // Form interactions
    document.addEventListener('focus', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        this.trackEvent('form_field_focus', {
          fieldName: e.target.name || e.target.id,
          fieldType: e.target.type,
          formId: e.target.form?.id
        });
      }
    }, true);

    // Page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Error tracking
    window.addEventListener('error', (e) => {
      this.trackError(e);
    });
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      id: this.generateEventId(),
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        page: window.location.pathname,
        url: window.location.href
      }
    };

    this.events.push(event);
    this.storeEvent(event);
    
    // Real-time processing
    this.processEventRealTime(event);
    
    return event;
  }

  trackPageView(pageName, properties = {}) {
    const pageView = {
      id: this.generateEventId(),
      page: pageName,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...properties
    };

    this.pageViews.push(pageView);
    this.storePageView(pageView);
    
    // Update session data
    this.updateSessionData();
    
    return pageView;
  }

  trackClick(event) {
    const element = event.target;
    const clickData = {
      elementType: element.tagName.toLowerCase(),
      elementId: element.id,
      elementClass: element.className,
      elementText: element.textContent?.substring(0, 100),
      href: element.href,
      coordinates: {
        x: event.clientX,
        y: event.clientY
      }
    };

    this.trackEvent('click', clickData);
  }

  trackError(error) {
    const errorData = {
      message: error.message,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
      stack: error.error?.stack
    };

    this.trackEvent('javascript_error', errorData);
  }

  trackConversion(funnelStep, properties = {}) {
    const conversion = {
      step: funnelStep,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...properties
    };

    if (!this.conversionFunnel.has(this.sessionId)) {
      this.conversionFunnel.set(this.sessionId, []);
    }
    
    this.conversionFunnel.get(this.sessionId).push(conversion);
    this.storeConversion(conversion);
    
    this.trackEvent('conversion_step', conversion);
  }

  trackUserEngagement() {
    const engagement = {
      timeOnPage: Date.now() - this.startTime,
      scrollDepth: this.getMaxScrollDepth(),
      clickCount: this.getClickCount(),
      formInteractions: this.getFormInteractionCount(),
      pageViews: this.pageViews.length
    };

    this.trackEvent('user_engagement', engagement);
    return engagement;
  }

  // Advanced Analytics Methods
  calculateEngagementScore() {
    const timeWeight = Math.min((Date.now() - this.startTime) / 60000, 10) * 10; // Max 10 points for 10+ minutes
    const scrollWeight = this.getMaxScrollDepth() / 10; // Max 10 points for 100% scroll
    const clickWeight = Math.min(this.getClickCount(), 20) * 0.5; // Max 10 points for 20+ clicks
    const pageViewWeight = Math.min(this.pageViews.length, 10) * 2; // Max 20 points for 10+ pages
    
    return Math.round(timeWeight + scrollWeight + clickWeight + pageViewWeight);
  }

  getUserJourney() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      currentTime: Date.now(),
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      events: this.events,
      conversionFunnel: Array.from(this.conversionFunnel.get(this.sessionId) || []),
      engagementScore: this.calculateEngagementScore()
    };
  }

  getConversionFunnelAnalysis() {
    const allConversions = this.getAllStoredConversions();
    const funnelSteps = ['landing', 'signup', 'personalization', 'course_view', 'enrollment', 'payment'];
    
    const analysis = funnelSteps.map((step, index) => {
      const stepConversions = allConversions.filter(c => c.step === step);
      const previousStep = index > 0 ? funnelSteps[index - 1] : null;
      const previousStepConversions = previousStep ? allConversions.filter(c => c.step === previousStep) : [];
      
      return {
        step,
        count: stepConversions.length,
        conversionRate: previousStepConversions.length > 0 ? 
          (stepConversions.length / previousStepConversions.length * 100).toFixed(2) : 100,
        dropoffRate: previousStepConversions.length > 0 ? 
          ((previousStepConversions.length - stepConversions.length) / previousStepConversions.length * 100).toFixed(2) : 0
      };
    });

    return analysis;
  }

  getCohortAnalysis(timeframe = 'weekly') {
    const users = this.getAllUsers();
    const cohorts = new Map();
    
    users.forEach(user => {
      const cohortKey = this.getCohortKey(user.createdAt, timeframe);
      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, {
          cohort: cohortKey,
          users: [],
          retention: new Map()
        });
      }
      cohorts.get(cohortKey).users.push(user);
    });

    // Calculate retention for each cohort
    cohorts.forEach((cohortData, cohortKey) => {
      for (let period = 0; period <= 12; period++) {
        const retainedUsers = this.getRetainedUsers(cohortData.users, period, timeframe);
        const retentionRate = (retainedUsers / cohortData.users.length * 100).toFixed(2);
        cohortData.retention.set(period, {
          users: retainedUsers,
          rate: retentionRate
        });
      }
    });

    return Array.from(cohorts.values());
  }

  getABTestResults(testName) {
    const events = this.getAllStoredEvents();
    const testEvents = events.filter(e => e.properties.abTest === testName);
    
    const variants = new Map();
    testEvents.forEach(event => {
      const variant = event.properties.variant;
      if (!variants.has(variant)) {
        variants.set(variant, {
          variant,
          users: new Set(),
          conversions: 0,
          events: []
        });
      }
      
      variants.get(variant).users.add(event.properties.userId);
      variants.get(variant).events.push(event);
      
      if (event.name === 'conversion_step') {
        variants.get(variant).conversions++;
      }
    });

    // Calculate conversion rates
    const results = Array.from(variants.values()).map(variant => ({
      ...variant,
      users: variant.users.size,
      conversionRate: (variant.conversions / variant.users.size * 100).toFixed(2)
    }));

    return results;
  }

  // Remarketing Segments
  getHighValueUsers() {
    const users = this.getAllUsers();
    return users.filter(user => {
      const engagement = this.getUserEngagementScore(user.id);
      const revenue = this.getUserRevenue(user.id);
      return engagement > 80 || revenue > 10000;
    });
  }

  getChurnRiskUsers() {
    const users = this.getAllUsers();
    const now = Date.now();
    
    return users.filter(user => {
      const lastActivity = this.getUserLastActivity(user.id);
      const daysSinceActivity = (now - lastActivity) / (1000 * 60 * 60 * 24);
      const engagementScore = this.getUserEngagementScore(user.id);
      
      return daysSinceActivity > 7 && engagementScore < 30;
    });
  }

  getReEngagementCandidates() {
    const users = this.getAllUsers();
    const now = Date.now();
    
    return users.filter(user => {
      const lastActivity = this.getUserLastActivity(user.id);
      const daysSinceActivity = (now - lastActivity) / (1000 * 60 * 60 * 24);
      const courseProgress = this.getUserCourseProgress(user.id);
      
      return daysSinceActivity > 14 && courseProgress > 0 && courseProgress < 50;
    });
  }

  // Predictive Analytics
  predictChurnProbability(userId) {
    const user = this.getUser(userId);
    if (!user) return 0;

    const factors = {
      daysSinceLastActivity: this.getDaysSinceLastActivity(userId),
      engagementScore: this.getUserEngagementScore(userId),
      courseCompletionRate: this.getUserCourseCompletionRate(userId),
      supportTickets: this.getUserSupportTickets(userId),
      loginFrequency: this.getUserLoginFrequency(userId)
    };

    // Simple churn prediction algorithm
    let churnScore = 0;
    
    if (factors.daysSinceLastActivity > 30) churnScore += 40;
    else if (factors.daysSinceLastActivity > 14) churnScore += 20;
    else if (factors.daysSinceLastActivity > 7) churnScore += 10;
    
    if (factors.engagementScore < 20) churnScore += 30;
    else if (factors.engagementScore < 50) churnScore += 15;
    
    if (factors.courseCompletionRate < 10) churnScore += 20;
    else if (factors.courseCompletionRate < 30) churnScore += 10;
    
    if (factors.supportTickets > 3) churnScore += 10;
    if (factors.loginFrequency < 0.1) churnScore += 15; // Less than once per 10 days

    return Math.min(churnScore, 100);
  }

  predictLifetimeValue(userId) {
    const user = this.getUser(userId);
    if (!user) return 0;

    const factors = {
      currentRevenue: this.getUserRevenue(userId),
      engagementScore: this.getUserEngagementScore(userId),
      courseCompletionRate: this.getUserCourseCompletionRate(userId),
      referrals: this.getUserReferrals(userId),
      tenure: this.getUserTenure(userId)
    };

    // Simple LTV prediction
    const baseValue = factors.currentRevenue;
    const engagementMultiplier = 1 + (factors.engagementScore / 100);
    const completionMultiplier = 1 + (factors.courseCompletionRate / 100);
    const referralBonus = factors.referrals * 500;
    const tenureMultiplier = 1 + (factors.tenure / 365); // Years

    return Math.round(baseValue * engagementMultiplier * completionMultiplier * tenureMultiplier + referralBonus);
  }

  // Utility Methods
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUserId() {
    const session = JSON.parse(localStorage.getItem('quantumUserSession') || 
                              sessionStorage.getItem('quantumUserSession') || '{}');
    return session.user?.id || 'anonymous_' + Date.now();
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Storage Methods
  storeEvent(event) {
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push(event);
    
    // Keep only last 1000 events to prevent storage overflow
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
  }

  storePageView(pageView) {
    const pageViews = JSON.parse(localStorage.getItem('analyticsPageViews') || '[]');
    pageViews.push(pageView);
    
    if (pageViews.length > 500) {
      pageViews.splice(0, pageViews.length - 500);
    }
    
    localStorage.setItem('analyticsPageViews', JSON.stringify(pageViews));
  }

  storeConversion(conversion) {
    const conversions = JSON.parse(localStorage.getItem('analyticsConversions') || '[]');
    conversions.push(conversion);
    localStorage.setItem('analyticsConversions', JSON.stringify(conversions));
  }

  loadStoredAnalytics() {
    this.events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    this.pageViews = JSON.parse(localStorage.getItem('analyticsPageViews') || '[]');
  }

  getAllStoredEvents() {
    return JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  }

  getAllStoredConversions() {
    return JSON.parse(localStorage.getItem('analyticsConversions') || '[]');
  }

  // Helper methods for analytics calculations
  getMaxScrollDepth() {
    const scrollEvents = this.events.filter(e => e.name === 'scroll_depth');
    return scrollEvents.length > 0 ? Math.max(...scrollEvents.map(e => e.properties.depth)) : 0;
  }

  getClickCount() {
    return this.events.filter(e => e.name === 'click').length;
  }

  getFormInteractionCount() {
    return this.events.filter(e => e.name === 'form_field_focus').length;
  }

  startSessionTracking() {
    // Send periodic engagement updates
    setInterval(() => {
      this.trackUserEngagement();
    }, 30000); // Every 30 seconds
  }

  updateSessionData() {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      lastActivity: Date.now(),
      pageViews: this.pageViews.length,
      events: this.events.length,
      engagementScore: this.calculateEngagementScore()
    };

    localStorage.setItem('currentSession', JSON.stringify(sessionData));
  }

  endSession() {
    const sessionSummary = {
      sessionId: this.sessionId,
      userId: this.userId,
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews.length,
      events: this.events.length,
      engagementScore: this.calculateEngagementScore(),
      endTime: Date.now()
    };

    this.trackEvent('session_end', sessionSummary);
    
    // Store session summary
    const sessions = JSON.parse(localStorage.getItem('analyticsSessions') || '[]');
    sessions.push(sessionSummary);
    localStorage.setItem('analyticsSessions', JSON.stringify(sessions));
  }

  // Placeholder methods for user data (would be replaced with real API calls)
  getAllUsers() {
    return JSON.parse(localStorage.getItem('allUsers') || '[]');
  }

  getUser(userId) {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId);
  }

  getUserEngagementScore(userId) {
    return Math.floor(Math.random() * 100); // Placeholder
  }

  getUserRevenue(userId) {
    return Math.floor(Math.random() * 50000); // Placeholder
  }

  getUserLastActivity(userId) {
    return Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Placeholder
  }

  getUserCourseProgress(userId) {
    return Math.floor(Math.random() * 100); // Placeholder
  }

  getUserCourseCompletionRate(userId) {
    return Math.floor(Math.random() * 100); // Placeholder
  }

  getUserSupportTickets(userId) {
    return Math.floor(Math.random() * 5); // Placeholder
  }

  getUserLoginFrequency(userId) {
    return Math.random(); // Placeholder
  }

  getUserReferrals(userId) {
    return Math.floor(Math.random() * 10); // Placeholder
  }

  getUserTenure(userId) {
    return Math.floor(Math.random() * 365); // Placeholder
  }

  getDaysSinceLastActivity(userId) {
    return Math.floor(Math.random() * 60); // Placeholder
  }

  getCohortKey(date, timeframe) {
    const d = new Date(date);
    if (timeframe === 'weekly') {
      const week = Math.floor(d.getTime() / (7 * 24 * 60 * 60 * 1000));
      return `Week ${week}`;
    } else {
      return `${d.getFullYear()}-${d.getMonth() + 1}`;
    }
  }

  getRetainedUsers(users, period, timeframe) {
    // Placeholder implementation
    return Math.floor(users.length * Math.pow(0.8, period));
  }
}

// Initialize Advanced Analytics
const advancedAnalytics = new AdvancedAnalytics();

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedAnalytics;
} else {
  window.AdvancedAnalytics = AdvancedAnalytics;
  window.advancedAnalytics = advancedAnalytics;
}

// Enhanced tracking functions for global use
window.trackEvent = (eventName, properties) => advancedAnalytics.trackEvent(eventName, properties);
window.trackPageView = (pageName, properties) => advancedAnalytics.trackPageView(pageName, properties);
window.trackConversion = (step, properties) => advancedAnalytics.trackConversion(step, properties);
window.getUserJourney = () => advancedAnalytics.getUserJourney();
window.getEngagementScore = () => advancedAnalytics.calculateEngagementScore();
