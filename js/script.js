/**
 * NEXUS DIGITAL AGENCY - Main JavaScript
 * Handles all interactive features and animations
 */

// ========== DOM ELEMENTS ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('testimonialDots');
const newsletterForm = document.getElementById('newsletterForm');
const themeToggle = document.getElementById('themeToggle');

// ========== DARK MODE TOGGLE ==========
/**
 * Handles dark/light mode theme toggle
 * - Respects user's system preference on first visit
 * - Saves preference to localStorage
 * - Toggles between sun and moon icons
 */

// Check for saved theme or use system preference
function initTheme() {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme: saved > system preference > default (light)
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
        // Switch to light mode
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark mode
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Listen for theme toggle button clicks
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        if (e.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});

// Initialize theme on page load
initTheme();

// ========== STICKY NAVBAR ==========
/**
 * Adds 'scrolled' class to navbar when user scrolls down
 * Creates a frosted glass effect on the navigation
 */
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// ========== MOBILE NAVIGATION ==========
/**
 * Toggles mobile navigation menu
 * Handles hamburger animation and menu visibility
 */
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

/**
 * Closes mobile menu when a link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/**
 * Closes mobile menu when clicking outside
 */
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== SMOOTH SCROLLING ==========
/**
 * Implements smooth scrolling for all anchor links
 * Accounts for fixed navbar height
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
/**
 * Updates active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ========== SCROLL REVEAL ANIMATION ==========
/**
 * Reveals elements when they enter the viewport
 * Uses Intersection Observer API for performance
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ========== COUNTER ANIMATION ==========
/**
 * Animates counting up numbers for statistics
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ========== TESTIMONIALS SLIDER ==========
let currentSlide = 0;
let slidesPerView = 2; // Number of slides visible at once
let totalSlides = document.querySelectorAll('.testimonial-card').length;

/**
 * Updates slides per view based on screen width
 */
function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else {
        slidesPerView = 2;
    }
    updateSliderPosition();
    createDots();
}

/**
 * Creates navigation dots for the slider
 */
function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(totalSlides / slidesPerView);

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

/**
 * Updates the active dot indicator
 */
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    const activeIndex = Math.floor(currentSlide / slidesPerView);

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

/**
 * Updates slider position based on current slide
 */
function updateSliderPosition() {
    const slideWidth = 100 / slidesPerView;
    const offset = currentSlide * slideWidth;
    testimonialTrack.style.transform = `translateX(-${offset}%)`;
    updateDots();
}

/**
 * Navigates to a specific slide
 */
function goToSlide(index) {
    currentSlide = index * slidesPerView;
    const maxSlide = totalSlides - slidesPerView;
    currentSlide = Math.min(currentSlide, maxSlide);
    currentSlide = Math.max(0, currentSlide);
    updateSliderPosition();
}

/**
 * Moves to the next slide
 */
function nextSlide() {
    const maxSlide = totalSlides - slidesPerView;
    currentSlide = Math.min(currentSlide + slidesPerView, maxSlide);

    // Loop back to start if at end
    if (currentSlide >= maxSlide) {
        setTimeout(() => {
            currentSlide = 0;
            updateSliderPosition();
        }, 500);
    } else {
        updateSliderPosition();
    }
}

/**
 * Moves to the previous slide
 */
function prevSlide() {
    currentSlide = Math.max(currentSlide - slidesPerView, 0);

    // Loop to end if at start
    if (currentSlide === 0 && this.lastDirection === 'prev') {
        const maxSlide = totalSlides - slidesPerView;
        currentSlide = maxSlide;
    }
    updateSliderPosition();
}

// Event listeners for slider navigation
nextBtn.addEventListener('click', () => {
    lastDirection = 'next';
    nextSlide();
});

prevBtn.addEventListener('click', () => {
    lastDirection = 'prev';
    prevSlide();
});

// Auto-play slider
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Pause autoplay on hover
testimonialTrack.addEventListener('mouseenter', stopAutoPlay);
testimonialTrack.addEventListener('mouseleave', startAutoPlay);

// Handle window resize for responsive slider
window.addEventListener('resize', updateSlidesPerView);

// ========== PORTFOLIO FILTER ==========
/**
 * Filters portfolio items based on category
 */
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter portfolio items with animation
        portfolioItems.forEach((item, index) => {
            const category = item.dataset.category;

            // Remove previous animation classes
            item.classList.remove('hidden');

            if (filter === 'all' || category === filter) {
                // Show matching items with staggered animation
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
            } else {
                // Hide non-matching items
                item.classList.add('hidden');
            }
        });
    });
});

// ========== CONTACT FORM ==========
/**
 * Handles contact form submission
 * Shows success message after submission
 */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.email || !data.service || !data.message) {
        alert('Mohon lengkapi semua field yang wajib diisi.');
        return;
    }

    // Simulate form submission (in production, send to server)
    console.log('Form submitted:', data);

    // Show success message
    formSuccess.classList.add('show');

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        formSuccess.classList.remove('show');
    }, 5000);
});

// ========== NEWSLETTER FORM ==========
/**
 * Handles newsletter subscription
 */
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input').value;

    if (email) {
        // Simulate subscription (in production, send to server)
        console.log('Newsletter subscription:', email);

        // Show feedback
        const btn = newsletterForm.querySelector('button');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: white;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; color: white;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
            newsletterForm.reset();
        }, 2000);
    }
});

// ========== PAGE LOAD ANIMATIONS ==========
/**
 * Initializes animations when page loads
 */
function initPageLoadAnimations() {
    // Animate hero section on load
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    if (heroVisual) {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateX(0)';
    }
}

// ========== INITIALIZE ALL FEATURES ==========
/**
 * Main initialization function
 * Called when DOM is fully loaded
 */
function init() {
    // Initialize scroll reveal animations
    initScrollReveal();

    // Initialize counter animation
    animateCounters();

    // Initialize testimonial slider
    updateSlidesPerView();
    startAutoPlay();

    // Initialize page load animations
    initPageLoadAnimations();

    // Check initial scroll position for navbar
    handleScroll();
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init);

// ========== KEYBOARD NAVIGATION ==========
/**
 * Enables keyboard navigation for accessibility
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== PREFERS REDUCED MOTION ==========
/**
 * Respects user preference for reduced motion
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');

    // Stop autoplay slider
    stopAutoPlay();
}
