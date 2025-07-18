// Component loader for header, navbar, and footer
document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
});

async function loadComponents() {
  try {
    // Load header if container exists
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      const headerResponse = await fetch('/components/header.html');
      const headerHTML = await headerResponse.text();
      headerContainer.innerHTML = headerHTML;
    }

    // Load navbar if container exists
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      const navbarResponse = await fetch('/components/navbar.html');
      const navbarHTML = await navbarResponse.text();
      navbarContainer.innerHTML = navbarHTML;
    }

    // Load footer if container exists
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      const footerResponse = await fetch('/components/footer.html');
      const footerHTML = await footerResponse.text();
      footerContainer.innerHTML = footerHTML;
    }

    // Initialize mobile menu after components are loaded
    initializeMobileMenu();
    
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// SEO and Analytics functions
function initializeSEO() {
  // Add structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "NanoSchool Quantum",
    "description": "Leading quantum computing education platform",
    "url": "https://nanoschool.in/quantum",
    "logo": "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/92bb1cbf-1640-4e65-8441-b0cf46564370.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Initialize SEO on page load
document.addEventListener('DOMContentLoaded', initializeSEO);

// Lead tracking and analytics
function trackPageView(pageName) {
  // Store page view data
  const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
  pageViews.push({
    page: pageName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer
  });
  localStorage.setItem('pageViews', JSON.stringify(pageViews));
}

function trackFormInteraction(formName, action) {
  const interactions = JSON.parse(localStorage.getItem('formInteractions') || '[]');
  interactions.push({
    form: formName,
    action: action,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('formInteractions', JSON.stringify(interactions));
}

// Export functions for global use
window.loadComponents = loadComponents;
window.trackPageView = trackPageView;
window.trackFormInteraction = trackFormInteraction;
