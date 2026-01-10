
# AI Animal Face Classifier

## Overview

This web application uses a pre-trained Teachable Machine model to classify a user's face from a live webcam feed, determining whether they resemble a "dog person" or a "cat person" in real-time. The project is built with plain HTML, CSS, and JavaScript, leveraging TensorFlow.js for in-browser machine learning.

## Core Features

*   **Real-time Webcam Classification:** Uses the webcam to capture video feed continuously.
*   **Teachable Machine Integration:** Loads a custom image classification model trained to distinguish between "dog-like" and "cat-like" faces.
*   **Live Predictions:** Displays the probability scores for each class (Dog vs. Cat) dynamically on the screen.
*   **Simple User Interface:** A clean, modern, and user-friendly interface that is easy to understand and operate. The user clicks a single "Start" button to begin the experience.

## Technical Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Machine Learning:**
    *   **TensorFlow.js:** For running the model in the browser.
    *   **Teachable Machine Image Library:** A high-level library that simplifies the process of using image classification models created on the Teachable Machine platform.
*   **Model URL:** `https://teachablemachine.withgoogle.com/models/xQ-P0uqTP/`

## Project Structure

*   `index.html`: The main entry point of the application. Contains the structure for the webcam view, label container, and start button.
*   `style.css`: Provides the styling for the application, creating a modern and responsive layout.
*   `main.js`: Contains the core JavaScript logic for loading the model, setting up the webcam, and running the prediction loop.
*   `blueprint.md`: This file, serving as the project's single source of truth.
