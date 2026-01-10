
# All-in-One Fun Page

## Overview

This is a multi-purpose web application that consolidates several mini-apps into a single, tab-based interface. Users can switch between an AI Animal Classifier, a Lotto Number Generator, and a Comments/Inquiry section. The project is built with modern, framework-less web technologies (HTML, CSS, JavaScript) for a lightweight and fast user experience.

## Core Features

### 1. Tabbed Navigation
*   A clean, intuitive navigation bar allows users to switch between the three main features.
*   The active tab is highlighted, and only the content for the active feature is displayed.

### 2. AI Animal Classifier
*   **Dual Input Methods:** Users can choose to either use their live webcam feed or upload an image file (e.g., JPEG, PNG).
*   **Real-time & Static Analysis:** The app provides real-time classification for the webcam stream and a one-time classification for uploaded images.
*   **Teachable Machine Integration:** Utilizes a pre-trained TensorFlow.js model from Teachable Machine to classify faces as "dog-like" or "cat-like".

### 3. Lotto Number Generator
*   **One-Click Generation:** Creates a set of 6 unique lottery numbers (from 1 to 45) with a single button click.
*   **Visual Representation:** Displays the generated numbers inside colorful, styled "lotto ball" components for a visually appealing result.

### 4. Comments & Inquiry
*   **Disqus Integration:** Features a fully functional Disqus comment section for user discussion and feedback.
*   **Partnership Form:** Includes a professional contact form for partnership inquiries, linked to Formspree for backend processing.

## Technical Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Machine Learning:** TensorFlow.js, Teachable Machine Image Library
*   **Comments:** Disqus Platform
*   **Forms:** Formspree.io

## Project Structure

*   `index.html`: The main HTML file containing the tab navigation and content containers for all features.
*   `style.css`: A single stylesheet providing styles for all components, including the tab layout, classifier interface, lotto balls, and forms.
*   `main.js`: The main controller script responsible for tab switching logic and loading the Disqus comments.
*   `animal-classifier.js`: Contains all JavaScript logic specific to the Animal Classifier, including model loading, webcam handling, and image file processing.
*   `lotto.js`: Holds the logic for the Lotto Number Generator and the `lotto-ball` custom element definition.
*   `blueprint.md`: This file, documenting the project's architecture and features.
