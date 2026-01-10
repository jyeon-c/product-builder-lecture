
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Anchor Links --- //
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .footer-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Contact Form Submission Handling --- //
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (formStatus) {
                formStatus.textContent = 'Sending message...';
                formStatus.style.color = '#333';
            }
            
            const formData = new FormData(contactForm);
            
            try {
                // NOTE: This uses Formspree. You need to set your own Formspree endpoint.
                const response = await fetch('https://formspree.io/f/meeejzwo', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                        formStatus.style.color = 'green';
                    }
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (formStatus) {
                        formStatus.textContent = data.error || 'Oops! There was a problem submitting your form.';
                        formStatus.style.color = 'red';
                    }
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = 'Oops! There was a network error. Please try again later.';
                    formStatus.style.color = 'red';
                }
            }
        });
    }
});
