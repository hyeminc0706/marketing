// Custom cursor
const cursorDot = document.getElementById('cursorDot');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .strip__item, .field-box--link').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .hero__headline, .hero__banner');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Count-up numbers
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Topbar hide on scroll down, show on scroll up
const topbar = document.getElementById('topbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  topbar.classList.toggle('is-scrolled', current > 20);
  if (current > lastScroll && current > 140) {
    topbar.classList.add('is-hidden');
  } else {
    topbar.classList.remove('is-hidden');
  }
  lastScroll = current;
}, { passive: true });

// Contact form submission (Web3Forms — no backend required)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const statusEl = document.getElementById('contact-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const accessKey = contactForm.querySelector('input[name="access_key"]').value;

    if (!accessKey || accessKey === 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY') {
      statusEl.textContent = 'Form isn\'t connected yet — please email directly below.';
      statusEl.className = 'closer__status is-error';
      return;
    }

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';
    statusEl.className = 'closer__status';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formObject)
      });
      const result = await response.json();

      if (result.success) {
        statusEl.textContent = 'Message sent — thank you! I\'ll get back to you soon.';
        statusEl.className = 'closer__status is-success';
        contactForm.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try emailing directly below.';
        statusEl.className = 'closer__status is-error';
      }
    } catch (error) {
      statusEl.textContent = 'Network error. Please try emailing directly below.';
      statusEl.className = 'closer__status is-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send email';
    }
  });
}
