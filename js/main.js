/**
 * NorthFort Engineering Limited - Main JavaScript
 * Handles navigation scroll, mobile menu, stats animation, project filtering, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initStatsCounter();
  initProjectFilters();
  initContactForm();
  initSearch();
  initHeroSlider();
  initFloatingBackButton();
  initScrollReveal();
});

/**
 * Adds shadow/bg change to header on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once at load
}

/**
 * Mobile navigation menu interactions
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-trigger');
  const overlay = document.getElementById('overlay-menu');
  const closeBtn = document.getElementById('close-overlay');

  if (hamburger && overlay && closeBtn) {
    // Open overlay
    hamburger.addEventListener('click', () => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Close overlay
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Handle dropdown toggle in overlay
    const overlayDropdowns = document.querySelectorAll('.overlay-dropdown');
    overlayDropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.overlay-nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });

    // Inject copyright text dynamically under overlay navigation menu list
    const overlayNav = document.querySelector('.overlay-nav');
    if (overlayNav && !document.querySelector('.overlay-copyright')) {
      const copyrightDiv = document.createElement('div');
      copyrightDiv.className = 'overlay-copyright';
      copyrightDiv.innerHTML = '© NorthFort E.L.T.D.<br>All right reserved.';
      overlayNav.parentNode.insertBefore(copyrightDiv, overlayNav.nextSibling);
    }
  }
}

/**
 * Animates key metrics numbers when section scrolled into view
 */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-banner');
  const numbers = document.querySelectorAll('.stat-number');
  if (!statsSection || numbers.length === 0) return;

  let animated = false;

  // Ensure all numbers show 0 on load (no premature display)
  numbers.forEach(num => {
    num.innerText = '0';
  });

  const animate = () => {
    numbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      const suffix = num.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 2000; // 2 seconds
      const stepTime = Math.max(Math.floor(duration / target), 30);

      const timer = setInterval(() => {
        current += Math.ceil(target / (duration / stepTime));
        if (current >= target) {
          num.innerText = target + suffix;
          clearInterval(timer);
        } else {
          num.innerText = current + suffix;
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animate();
        animated = true;
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -50px 0px' });

  observer.observe(statsSection);
}

/**
 * Handles project filter grid on Home and Project sections
 */
function initProjectFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Toggle active filter button
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const filterValue = filter.getAttribute('data-filter');

      // Filter project cards
      cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        if (filterValue === 'all' || cardStatus === filterValue) {
          card.style.display = 'block';
          // Force fade-in animation trigger
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Validates and handles contact form submission
 */
function initContactForm() {
  const forms = document.querySelectorAll('#contact-form');
  if (forms.length === 0) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check validity
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Mock form sending delay
      setTimeout(() => {
        // Create and show custom alerts matching premium style
        alertSuccess();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  });
}

function alertSuccess() {
  // Create toast notification
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.right = '1rem';
  toast.style.left = '1rem';
  toast.style.maxWidth = '380px';
  toast.style.marginLeft = 'auto';
  toast.style.backgroundColor = '#0f172a';
  toast.style.color = '#ffffff';
  toast.style.padding = '1.25rem 1.5rem';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
  toast.style.borderLeft = '4px solid #00f0ff';
  toast.style.zIndex = '9999';
  toast.style.fontFamily = "'Space Grotesk', sans-serif";
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '0.75rem';
  toast.style.animation = 'fadeInUp 0.3s ease';
  toast.style.boxSizing = 'border-box';

  toast.innerHTML = `
    <i class="fas fa-check-circle" style="color: #00f0ff;"></i>
    <div>
      <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600;">Message Sent!</h4>
      <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">Thank you, we will contact you shortly.</p>
    </div>
  `;

  document.body.appendChild(toast);

  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOutDown 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Client-side Search Engine (Oviswift Style)
 */
function initSearch() {
  const searchBtn = document.getElementById('floating-search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearchBtn = document.getElementById('close-search');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchBtn || !searchOverlay || !closeSearchBtn || !searchInput || !searchResults) return;

  // Simplify input placeholder to match screenshot
  searchInput.placeholder = 'Search...';

  const searchIndex = [
    { title: "Home Page", url: "index.html", desc: "Welcome to NorthFort Engineering Limited. MEP, Procurement & Supply, Oil & Gas Services." },
    { title: "About Us", url: "about.html", desc: "Learn about NorthFort profile, vision, mission, auditors, bankers, and medical retainer clinic." },
    { title: "Our Services Overview", url: "services.html", desc: "Explore our complete range of technical, procurement, and engineering solutions." },
    { title: "Procurement & Supply", url: "procurement.html", desc: "Sourcing and supply of industrial fittings, tubulars, valves (ball, butterfly, relief, check, gate), compressors, power generators, chemicals, paint, and environmental remediation equipment." },
    { title: "Engineering & MEP Solutions", url: "mep-solutions.html", desc: "Air conditioning installations (CAC, RAC, VRF), chilled water systems, maintenance, plumbing, electrical, and BMS." },
    { title: "Oil & Gas Services", url: "oil-gas.html", desc: "Process piping, design, piping stress analysis, API valve procurement, flow station operations, and west african supply." },
    { title: "Corporate Governance & Organogram", url: "management.html", desc: "Meet our board of directors, management staff, technical engineers, and view organizational hierarchy." },
    { title: "Corporate Policies & Compliance", url: "corporate-policies.html", desc: "HSE guidelines, community relations, ISO 9001:2015 Quality Management System (QMS), and Nigerian Local Content development." },
    { title: "Capacities & Logistical Equipment", url: "capacities.html", desc: "Testing instruments (pressure manifolds, FLIR thermal camera, clamp meters) and logistical fleet details." },
    { title: "News & Insights", url: "news.html", desc: "Read latest company happenings, industrial insights, and project updates." },
    { title: "Careers at NorthFort", url: "career.html", desc: "Join our team, explore open roles (Project Manager, HVAC Engineer, Facility Tech), and submit your CV." },
    { title: "Downloads Resource Center", url: "downloads.html", desc: "Download brochures, HSE guidelines, QMS manuals, and capability profiles." },
    { title: "Contact Us", url: "contact.html", desc: "Get in touch, find office location, Lekky County Homes, and links for active support." }
  ];

  // Open Search
  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
  });

  // Close Search
  closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  // Search Input Event
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (query.length < 2) return;

    const filtered = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found for "' + e.target.value + '"</div>';
      return;
    }

    filtered.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'search-result-item';
      itemEl.innerHTML = `
        <h3><a href="${item.url}">${item.title}</a></h3>
        <p>${item.desc}</p>
      `;
      searchResults.appendChild(itemEl);
    });
  });

  // Handle mobile search click on white panel bottom-left pseudo-element
  const navCol = document.querySelector('.overlay-nav-col');
  if (navCol) {
    navCol.addEventListener('click', (e) => {
      if (window.innerWidth > 991) return;
      const rect = navCol.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      if (clickX >= 20 && clickX <= 68 && clickY >= (rect.height - 73) && clickY <= (rect.height - 25)) {
        const mobileMenu = document.getElementById('overlay-menu');
        if (mobileMenu) {
          mobileMenu.classList.remove('active');
        }
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 300);
      }
    });
  }
}

/**
 * Interactive slideshow for split hero section
 */
function initHeroSlider() {
  const heroSection = document.querySelector('.hero-split');
  const subtitleEl = document.querySelector('.hero-right-subtitle');
  const titleEl = document.querySelector('.hero-title-split');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const featureCols = document.querySelectorAll('.hero-features-grid .hero-feature-col');
  const wrapper = document.querySelector('.hero-right-wrap');

  if (!heroSection || !subtitleEl || !titleEl) return;

  const slides = [
    {
      subtitle: "We provide bespoke technical solutions tailored to your particular engineering and facility needs.",
      title: "Welcome to<br>NorthFort E.L.T.D."
    },
    {
      subtitle: "MEP, HVAC, VRF, BMS, and general MEP services with expatriate and local labor provision.",
      title: "Think. Innovate.<br>Design. Engineer."
    },
    {
      subtitle: "Conceptual design, FEED, detailed engineering, project management and consultancy of oil & gas facilities.",
      title: "Envision. FEED.<br>Design. Manage."
    },
    {
      subtitle: "Procurement of fittings, valves, tubulars, instrumentation panels, compressors, and metering systems.",
      title: "Procure. Supply.<br>Distribute. Support."
    }
  ];

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000; // 6 seconds per slide

  const updateSlide = (index) => {
    if (index === currentSlide) return;

    // Add transition class to trigger fade out
    wrapper.classList.add('hero-slide-transitioning');

    const bgLayer = document.querySelector('.hero-bg-layer');
    if (bgLayer) {
      bgLayer.classList.add('hero-bg-transition');
    }

    setTimeout(() => {
      // Update contents
      subtitleEl.textContent = slides[index].subtitle;
      titleEl.innerHTML = slides[index].title;

      // Update dots active class
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });

      // Update bottom quick columns active class
      featureCols.forEach((col) => {
        const slideIdx = parseInt(col.getAttribute('data-slide'), 10);
        col.classList.toggle('active', slideIdx === index);
      });

      currentSlide = index;

      // Trigger fade in
      wrapper.classList.remove('hero-slide-transitioning');

      if (bgLayer) {
        bgLayer.classList.remove('hero-bg-transition');
      }
    }, 400); // match transition speed
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      let nextIndex = (currentSlide + 1) % slides.length;
      updateSlide(nextIndex);
    }, slideDuration);
  };

  const stopAutoSlide = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  };

  // Click dot event listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlide(index);
      startAutoSlide(); // reset timer
    });
  });

  // Bottom quick feature cols click event listeners (each maps to its slide!)
  featureCols.forEach((col) => {
    const slideIdx = parseInt(col.getAttribute('data-slide'), 10);
    col.addEventListener('click', () => {
      updateSlide(slideIdx);
      startAutoSlide();
    });
  });

  // Prev/Next buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      updateSlide(prevIndex);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentSlide + 1) % slides.length;
      updateSlide(nextIndex);
      startAutoSlide();
    });
  }

  // Initialize first active states
  dots[0].classList.add('active');
  featureCols.forEach((col) => {
    const slideIdx = parseInt(col.getAttribute('data-slide'), 10);
    col.classList.toggle('active', slideIdx === 0);
  });

  startAutoSlide();
}

/**
 * Floating Back Button interaction logic (on subpages)
 */
function initFloatingBackButton() {
  const backContainer = document.getElementById('floating-back-trigger');
  if (!backContainer) return;

  // On hover in
  backContainer.addEventListener('mouseenter', () => {
    backContainer.classList.add('revealed');
    backContainer.classList.add('hovered');
  });

  // On hover out
  backContainer.addEventListener('mouseleave', () => {
    backContainer.classList.remove('hovered');
  });

  // On click
  backContainer.addEventListener('click', () => {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  });
}

/**
 * Scroll Reveal animation using Intersection Observer
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}
