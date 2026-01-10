
# Lotto Number Generator

## Overview

This project is a visually appealing lottery number generator that also includes a contact form. Users can generate random lottery numbers and send messages via the contact form. The application is built with a focus on modern web technologies, a clean UI, and a component-based architecture using Web Components.

## Design and Features

*   **UI/UX:** The application features a clean and modern design with a "glassmorphism" effect. It is responsive and includes interactive elements.
*   **Dark/Light Mode:** A theme switcher allows users to toggle between a light and dark theme, with the user's preference saved in local storage.
*   **Lottery Number Generation:** Generates 6 unique random numbers between 1 and 45 with a button click.
*   **Web Components:** A custom element (`lotto-ball`) is used for displaying lottery numbers.
*   **Contact Form:** A Formspree-powered contact form allows users to send messages. The form is styled to match the application's theme.
*   **Animation:** Generated numbers and UI elements have subtle animations for a better user experience.

## Current Plan

*   **Objective:** Add a Formspree-powered contact form to the application.
*   **Steps:**
    1.  **Update `index.html`:** Add the HTML structure for the contact form below the lottery generator.
    2.  **Update `style.css`:** Add CSS styles for the contact form to ensure it matches the overall design, including styles for input fields, labels, and the submit button. Adjust the main layout to accommodate the new section.
