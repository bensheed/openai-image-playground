# AI Image Generation Playground

A simple, frontend-only web application for generating images using the OpenAI DALL·E 3 API.

## Features

*   Generate images based on text prompts.
*   Control image parameters like size, quality, and style.
*   Uses your own OpenAI API key, stored locally in your browser's `localStorage`.
*   No backend server required - API calls are made directly from your browser to OpenAI.
*   Mobile-friendly design.
*   Deployable on static hosting platforms like GitHub Pages.

## How to Use

1.  Clone or download this repository.
2.  Open the `index.html` file in your web browser.
3.  Enter your OpenAI API key in the designated field and click "Save Key". The key will be stored in your browser's `localStorage`.
4.  Enter a text prompt describing the image you want to generate.
5.  Select the desired image options (size, quality, style).
6.  Click the "Generate Image" button.
7.  Wait for the image to be generated and displayed. Status messages will indicate progress and any errors.

## Important Notes

*   **API Costs:** Generating images using the OpenAI API incurs costs associated with your OpenAI account.
*   **API Key Security:** Your API key is stored *only* in your browser's `localStorage`. It is *not* sent to any external server other than OpenAI's API endpoint during image generation. Be aware that `localStorage` is not encrypted and might be accessible if your computer is compromised. Use a dedicated key with appropriate spending limits if possible.

## Development

This project consists of:
*   `index.html`: The main application page structure.
*   `style.css`: Styles for the application appearance.
*   `script.js`: JavaScript code for handling user interactions, API key storage, and communication with the OpenAI API.
