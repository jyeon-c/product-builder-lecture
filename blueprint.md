
# Lotto Number Generator

## Overview

This project is a simple, visually appealing lottery number generator. It allows users to generate a set of random lottery numbers with the click of a button. The application is built using modern web technologies, including HTML, CSS, and JavaScript, with a focus on a clean, component-based architecture using Web Components.

## Design and Features

*   **UI/UX:** The application features a clean and modern design with a "glassmorphism" effect for the main container. It's responsive and includes interactive elements like a button with a subtle glow effect.
*   **Dark/Light Mode:** A theme switcher allows users to toggle between a light and dark theme. The application also respects the user's operating system preference for the initial theme.
*   **Lottery Number Generation:** The core feature is the ability to generate 6 unique random numbers between 1 and 45.
*   **Web Components:** The lottery number display is encapsulated in a custom element (`lotto-ball`) for reusability and maintainability.
*   **Animation:** The generated numbers fade in for a smoother user experience.

## Current Plan

*   **Objective:** Add a dark/light mode theme switcher to the application.
*   **Steps:**
    1.  **Update `index.html`:** Add a toggle switch for the theme switcher.
    2.  **Update `style.css`:** Add styles for the theme switcher and define the color scheme for the dark mode.
    3.  **Update `main.js`:** Implement the logic to toggle the `dark-mode` class on the body, save the user's preference in local storage, and check for the system's preferred color scheme.
