// ============================================================
// NAV — active link on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// ============================================================
// NAV — scroll shadow
// ============================================================
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.boxShadow =
    window.scrollY > 20 ? '0 4px 40px rgba(0,0,0,0.4)' : '';
});

// ============================================================
// MOBILE MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ============================================================
// SCROLL REVEAL — fade-up on enter
// .service-card added here so the Services section animates
// identically to existing project cards / skill categories.
// ============================================================
const revealEls = document.querySelectorAll('.project-card, .skill-category, .highlight, .social-link, .service-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeUp 0.6s ${i * 0.06}s ease both`;
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});

// ============================================================
// SKILL BARS — animate on scroll
// ============================================================
const skillBars = document.querySelectorAll('.skill-bar__fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  skillObserver.observe(bar);
});

// ============================================================
// CONTACT FORM
// FIXED: previously this only faked success via setTimeout and
// never actually sent the message anywhere. Now opens a mailto:
// draft pre-filled with the visitor's details, addressed to you.
// Same UX as before (button text change, success message, auto-hide).
// ============================================================
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  const form = this;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Pull values defensively — adjust these field names if your
  // contact form's inputs use different `name` attributes.
  const getVal = (selector) => {
    const el = form.querySelector(selector);
    return el ? el.value : '';
  };

  const name = getVal('[name="name"]');
  const email = getVal('[name="email"]');
  const message = getVal('[name="message"]');

  const subject = encodeURIComponent('New message from your portfolio site');
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  setTimeout(() => {
    window.location.href = `mailto:destine.dike234@gmail.com?subject=${subject}&body=${body}`;

    btn.textContent = 'Send Message →';
    btn.disabled = false;
    success.classList.add('visible');
    form.reset();
    setTimeout(() => success.classList.remove('visible'), 4000);
  }, 600);
});

// ============================================================
// SMOOTH ANCHOR SCROLL (for older browsers)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// SERVICES SECTION — modal open/close + form submission
// Same mailto pattern as the contact form above, for consistency.
// ============================================================
const svcServiceLabels = {
  audit: "Data Audit & Roadmap",
  dashboard: "Custom Dashboard Build",
  retainer: "Monthly Analytics Retainer",
  general: "General Inquiry"
};

function openServiceModal(serviceKey) {
  const overlay = document.getElementById('svcModalOverlay');
  const title = document.getElementById('svcModalTitle');
  const serviceInput = document.getElementById('svcServiceType');
  const form = document.getElementById('svcModalForm');
  const success = document.getElementById('svcModalSuccess');

  title.textContent = svcServiceLabels[serviceKey]
    ? `Get a quote: ${svcServiceLabels[serviceKey]}`
    : "Tell me about your project";

  form.classList.remove('svc-hide');
  success.classList.remove('svc-show');
  form.reset();
  serviceInput.value = svcServiceLabels[serviceKey] || "General Inquiry";

  overlay.classList.add('svc-open');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal(event) {
  if (event && event.target !== document.getElementById('svcModalOverlay')) return;
  document.getElementById('svcModalOverlay').classList.remove('svc-open');
  document.body.style.overflow = '';
}

document.getElementById('svcModalForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;
  const success = document.getElementById('svcModalSuccess');

  const name = form.name.value;
  const email = form.email.value;
  const service = form.service.value;
  const message = form.message.value;

  const subject = encodeURIComponent(`New inquiry: ${service}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:destine.dike234@gmail.com?subject=${subject}&body=${body}`;

  form.classList.add('svc-hide');
  success.classList.add('svc-show');
});

// Close services modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeServiceModal({ target: document.getElementById('svcModalOverlay') });
});
