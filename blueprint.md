
# Lotto Number Generator & Partnership Inquiry

## Overview

This project is a multi-functional web application. It features a visually appealing lottery number generator, a detailed partnership inquiry form, and a Disqus-powered comment section. The application is built with a focus on modern web technologies, a clean UI, and a component-based architecture using Web Components.

## Design and Features

*   **UI/UX:** A clean, modern design with a "glassmorphism" effect. The application is responsive and includes interactive elements with subtle animations.
*   **Dark/Light Mode:** A theme switcher allows users to toggle between light and dark themes, with the preference saved locally.
*   **Lottery Number Generation:** Generates 6 unique random numbers between 1 and 45.
*   **Web Components:** The `lotto-ball` custom element is used for displaying lottery numbers in a modular way.
*   **Partnership Inquiry Form:** A Formspree-powered form for partnership inquiries. It includes fields for name, company name, email, inquiry type (dropdown), and a message.
*   **Disqus Comments:** A comment section powered by Disqus is integrated at the bottom of the page, allowing for community interaction. The implementation includes configuration variables for the page URL and a unique identifier to ensure comments are correctly associated with the page.

## Current Plan

*   **Objective:** Implement a Disqus comment section below the partnership inquiry form.
*   **Steps:**
    1.  **Update `index.html`:** Add a new container with the `id="disqus_thread"` below the form. Embed the Disqus universal embed code, using the user-provided shortname `product-builder-1`.
    2.  **Configure `disqus_config`:**
        *   Set `this.page.url` to the current page's URL (`window.location.href`).
        *   Set `this.page.identifier` to a unique string for this page (`lotto-generator-page-1`).
    3.  **Update `style.css`:** Add a `margin-top` to the `#disqus_thread` container to ensure consistent spacing with the other elements on the page.
