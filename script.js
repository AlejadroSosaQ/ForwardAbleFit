// ForwardAble – Site Script

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

// ---- Contact form → Formspree ----
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xykojboq', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.background = '#4a7c59';
      formNote.textContent = "We'll be in touch within 24 hours.";
      form.reset();

      setTimeout(() => {
        submitBtn.textContent = 'Send Message →';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        formNote.textContent = 'We typically respond within 24 hours.';
      }, 4000);
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    submitBtn.textContent = 'Something went wrong — try again';
    submitBtn.style.background = '#c0392b';
    submitBtn.disabled = false;

    setTimeout(() => {
      submitBtn.textContent = 'Send Message →';
      submitBtn.style.background = '';
    }, 4000);
  }
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

// ---- Kiosk auto-scroll + autoplay mode ----
// Activate by visiting: https://forwardablefit.com/?kiosk
if (window.location.search.indexOf('kiosk') !== -1) {

  const TICK_MS         = 33;    // fire ~30 times per second
  const PX_PER_TICK     = 1.27;  // 38 px/s ÷ 30 ticks = 1.27 px each tick
  const PAUSE_AT_TOP    = 3000;  // ms to wait before each loop starts
  const PAUSE_AT_BOTTOM = 2500;  // ms to pause at the bottom before resetting

  // Enable autoplay + mute on all YouTube iframes — staggered to avoid CPU spike
  document.querySelectorAll('iframe[src*="youtube.com"]').forEach((iframe, i) => {
    setTimeout(() => {
      try {
        const url = new URL(iframe.src);
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('mute', '1');
        url.searchParams.set('loop', '1');
        const videoId = url.pathname.split('/').pop();
        if (videoId) url.searchParams.set('playlist', videoId);
        iframe.src = url.toString();
      } catch (e) { /* skip if URL parse fails */ }
    }, i * 1200); // stagger each iframe by 1.2 seconds
  });

  // setInterval-based scroll — each tick moves a fixed number of pixels.
  // Unlike requestAnimationFrame, missed ticks don't cause catch-up jumps,
  // so heavy YouTube load can't make the scroll erratic.
  let kioskTimer = null;

  function startKioskScroll() {
    kioskTimer = setInterval(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 2) {
        // Reached the bottom — pause, reset, then restart
        clearInterval(kioskTimer);
        kioskTimer = null;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(startKioskScroll, PAUSE_AT_TOP);
        }, PAUSE_AT_BOTTOM);
      } else {
        window.scrollBy(0, PX_PER_TICK);
      }
    }, TICK_MS);
  }

  // Wait before starting so the page can settle after load
  setTimeout(startKioskScroll, PAUSE_AT_TOP);
}
