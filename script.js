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
