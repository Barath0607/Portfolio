const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .project-card, .testimonial-grid article, .timeline article').forEach((item) => observer.observe(item));

const resumeLink = document.querySelector('a[href="assets/BARATH_Resume.pdf"]');
resumeLink?.addEventListener('click', (event) => {
  event.preventDefault();
  const download = document.createElement('a');
  download.href = resumeLink.href;
  download.download = 'BARATH_Resume.pdf';
  document.body.append(download);
  download.click();
  download.remove();
});

const bookingModal = document.querySelector('.booking-modal');
const bookingForm = document.querySelector('.booking-form');
const bookingStatus = document.querySelector('.form-status');
const bookingDate = bookingForm?.querySelector('input[type="date"]');

const openBooking = () => {
  bookingModal?.classList.add('is-open');
  bookingModal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  bookingForm?.querySelector('input[name="name"]')?.focus();
};

const closeBooking = () => {
  bookingModal?.classList.remove('is-open');
  bookingModal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('[data-booking-trigger], .talk-link').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openBooking();
  });
});

document.querySelectorAll('[data-booking-close]').forEach((trigger) => trigger.addEventListener('click', closeBooking));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeBooking();
});

if (bookingDate) bookingDate.min = new Date().toISOString().split('T')[0];

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  bookingStatus.textContent = 'Sending your request...';
  submitButton.disabled = true;

  try {
    const response = await fetch(bookingForm.action, {
      method: 'POST', body: new FormData(bookingForm), headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Request failed');
    bookingForm.reset();
    bookingStatus.textContent = 'Thank you - your request has been sent. I will be in touch soon.';
  } catch {
    bookingStatus.textContent = 'Something went wrong. Please email barath07fidget@gmail.com directly.';
  } finally {
    submitButton.disabled = false;
  }
});
