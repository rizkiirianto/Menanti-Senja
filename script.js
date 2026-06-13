// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Stop observing once animation has triggered
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Select all elements to animate
const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
animatedElements.forEach(el => observer.observe(el));

// Add slight delay for hero elements on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#beranda .fade-in-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);
});
