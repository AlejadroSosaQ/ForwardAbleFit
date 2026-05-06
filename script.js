// CA Caring Group – Site Script

// ---- Scroll-triggered nav styling ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Animate on scroll (Intersection Observer) ----
const animEls = document.querySelectorAll('.animate');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animEls.forEach(el => observer.observe(el));

// Trigger hero animations immediately
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .animate').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  // Observe all other section elements
  document.querySelectorAll('.about, .services, .why, .contact').forEach(section => {
    const children = section.querySelectorAll('h2, p, .service-card, .why-item, .who-card, .partner-card, .about-card-main, .about-text, .contact-form, .contact-text');
    children.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;

      const secObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            secObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      secObs.observe(el);
    });
  });
});

// ---- Contact form → Google Forms (hidden iframe) ----
const form = document.getElementById('contactForm');
const hiddenFrame = document.getElementById('hidden_iframe');

// The iframe fires 'load' once on page init (blank) and again after submission.
// We use a flag to tell them apart.
form.addEventListener('submit', () => {
  form.dataset.submitted = 'true';
});

hiddenFrame.addEventListener('load', () => {
  if (form.dataset.submitted !== 'true') return;

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#4a7c59';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
    form.dataset.submitted = 'false';
  }, 3000);
});

// ---- Smooth anchor scroll with offset ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
