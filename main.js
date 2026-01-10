
document.addEventListener('DOMContentLoaded', () => {

    // --- Modern Tab Navigation --- //
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Deactivate all tabs and content panels
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            // 2. Activate the clicked tab
            tab.classList.add('active');

            // 3. Activate the corresponding content panel
            const target = document.getElementById(tab.dataset.tab);
            if (target) {
                target.classList.add('active');
            }
            
            // 4. Special handling for Lotto tab to generate numbers on view
            if (tab.dataset.tab === 'lotto') {
                // Ensure the lotto number generation function exists and call it
                if (typeof generateLottoNumbers === 'function') {
                    generateLottoNumbers();
                }
            }
        });
    });

    // --- Contact Form Submission Handling (from previous step) --- //
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
                const response = await fetch('https://formspree.io/f/meeejzwo', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
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
