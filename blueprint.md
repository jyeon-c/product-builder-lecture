
# Blueprint: All-in-One Fun Page - Modernization with Web Components

## 1. Project Overview

This project is an "All-in-One Fun Page" providing users with a variety of interactive tools. The goal is to create a high-quality, user-friendly, and performant website that is well-optimized for search engines and built with modern web standards.

---

## 2. Implemented Features & Design

### Core Functionality
*   **Animal Classifier:** Uses a pre-trained machine learning model to classify images.
*   **Lotto Number Generator:** Generates a set of random lottery numbers.
*   **Essential Pages:** Includes About, Contact, and Privacy Policy pages for user trust.

### Design & Structure
*   **Modern UI/UX:** A professional design with a consistent header, footer, and responsive layout.
*   **Single Page Application Feel:** Core tools are integrated into the main page (`index.html`) for a seamless user experience.

### Technical Optimizations
*   **Performance:** Minified and deferred JavaScript, leading to faster page loads.
*   **SEO:** Comprehensive keyword optimization, canonical tags, structured data, `robots.txt`, and a `sitemap.xml` for enhanced search engine visibility.
*   **GEO Targeting:** `hreflang` tags implemented to target Korean-speaking users.
*   **Security:** Enforced HTTPS with the `Strict-Transport-Security` header.

---

## 3. Current Task: Refactor Tools into Web Components

This task focuses on modernizing the codebase by refactoring the primary tools ("AI Animal Classifier" and "Lotto Number Generator") into reusable, encapsulated Web Components. This will improve code modularity, maintainability, and readability.

### Plan & Action Steps

1.  **Create a `components` Directory:**
    *   `[ ]` Create a new `/components` directory to store the Web Component source files.

2.  **Develop `LottoGenerator` Component:**
    *   `[ ]` Create `lotto-generator.js` inside the `components` directory.
    *   `[ ]` Implement the `LottoGenerator` class, extending `HTMLElement`.
    *   `[ ]` Move the relevant HTML structure into a `<template>` within the component.
    *   `[ ]` Encapsulate the component's styles within the Shadow DOM to prevent CSS conflicts.
    *   `[ ]` Move the number generation logic into the component's class methods.
    *   `[ ]` Define the custom element: `customElements.define('lotto-generator', LottoGenerator);`

3.  **Develop `AnimalClassifier` Component:**
    *   `[ ]` Create `animal-classifier.js` inside the `components` directory.
    *   `[ ]` Implement the `AnimalClassifier` class, extending `HTMLElement`.
    *   `[ ]` Move the HTML structure for the classifier into a `<template>`.
    *   `[ ]` Encapsulate styles within the Shadow DOM.
    *   `[ ]` Adapt the existing image classification logic (including model loading and prediction) to work within the component's lifecycle methods.
    *   `[ ]` Define the custom element: `customElements.define('animal-classifier', AnimalClassifier);`

4.  **Integrate Components into the Application:**
    *   `[ ]` Update `index.html` to remove the old hardcoded HTML for the tools.
    *   `[ ]` Add the new custom element tags (`<lotto-generator>` and `<animal-classifier>`) to `index.html`.
    *   `[ ]` In `main.js`, import the new component modules (`lotto-generator.js`, `animal-classifier.js`) so they are registered and available to the browser.
    *   `[ ]` Test thoroughly to ensure all functionality remains intact.

---

## 4. Completion Summary

The project is being updated to use a modern, component-based architecture. This will result in a more robust, scalable, and maintainable codebase, fully aligned with modern web development best practices.
