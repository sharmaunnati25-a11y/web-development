// ============================================================
// Portfolio JavaScript - Unnati Sharma
// Form validation, navigation interaction, and micro-UX
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const navCollapse = document.getElementById('navContent');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  // 1. Auto-close mobile navbar on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // 2. Contact Form Submission Handler (Bootstrap form validation)
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      // Read form data
      const name = document.getElementById('nameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const subject = document.getElementById('subjectInput').value.trim();
      const message = document.getElementById('messageInput').value.trim();

      console.log('Portfolio Contact Submission:', { name, email, subject, message });

      // Display success feedback
      formAlert.textContent = `Thank you, ${name}! Your message has been received. I'll get back to you shortly.`;
      formAlert.classList.remove('d-none');

      // Reset form
      contactForm.reset();
      contactForm.classList.remove('was-validated');

      // Auto-hide alert after 6 seconds
      setTimeout(() => {
        formAlert.classList.add('d-none');
      }, 6000);
    });
  }
});
