
# Lotto Number Generator & Partnership Inquiry

## Overview

This project is a multi-functional web application. It features a visually appealing lottery number generator and a detailed partnership inquiry form. The application is built with a focus on modern web technologies, a clean UI, and a component-based architecture using Web Components.

## Design and Features

*   **UI/UX:** A clean, modern design with a "glassmorphism" effect. The application is responsive and includes interactive elements with subtle animations.
*   **Dark/Light Mode:** A theme switcher allows users to toggle between light and dark themes, with the preference saved locally.
*   **Lottery Number Generation:** Generates 6 unique random numbers between 1 and 45.
*   **Web Components:** The `lotto-ball` custom element is used for displaying lottery numbers in a modular way.
*   **Partnership Inquiry Form:** A Formspree-powered form for partnership inquiries. It includes fields for name, company name, email, inquiry type (dropdown), and a message.

## Current Plan

*   **Objective:** Modify the existing contact form into a more detailed "Partnership Inquiry" form.
*   **Steps:**
    1.  **Update `index.html`:** Change the form title to "Partnership Inquiry." Add new fields for "Company Name" and a dropdown for "Inquiry Type." Update the submit button text.
    2.  **Update `style.css`:** Add styling for the new `select` (dropdown) element to ensure it is consistent with the other input fields in both light and dark modes.
