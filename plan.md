# Plan for Image Generation Playground App

## Goal
Create a no-code, mobile-optimized web application that allows users to generate images using the OpenAI Image Generation API (DALL·E). The application will be purely frontend (HTML, CSS, JavaScript) and deployable on GitHub Pages. Users will provide their own OpenAI API key, which will be stored locally in their browser and used for direct API calls from their machine.

## Features
-   Input field for OpenAI API key.
-   Input field for image generation prompt.
-   UI controls for API parameters (e.g., image size, quality, style).
-   Button to trigger image generation.
-   Display area for the generated image.
-   Error handling and user feedback.
-   Mobile-responsive design.
-   No backend server required.
-   Deployment via GitHub Pages.

## Steps

1.  **Project Setup:**
    *   Create the basic file structure:
        *   `index.html`: Main HTML file.
        *   `style.css`: CSS file for styling.
        *   `script.js`: JavaScript file for application logic.
        *   `README.md`: Project description.
        *   `plan.md`: This file.
    *   Initialize a Git repository if not already done (already present).

2.  **HTML Structure (`index.html`):**
    *   Set up the basic HTML document structure.
    *   Add a title and link the CSS file.
    *   Create input field for the OpenAI API key (type="password").
    *   Add a button or mechanism to save/use the API key.
    *   Create a text area for the image prompt.
    *   Add UI elements (select dropdowns, sliders, radio buttons) for controlling API parameters:
        *   Image size (e.g., 1024x1024, 1792x1024, 1024x1792 for DALL·E 3).
        *   Quality (e.g., standard, hd).
        *   Style (e.g., vivid, natural).
        *   Number of images (n=1 for DALL·E 3).
    *   Add a "Generate Image" button.
    *   Create a container (`div`) to display the generated image.
    *   Add an area for displaying status messages or errors.
    *   Link the JavaScript file at the end of the body.

3.  **CSS Styling (`style.css`):**
    *   Apply basic reset/normalize styles.
    *   Style the main layout (consider using Flexbox or Grid).
    *   Style input fields, buttons, and other UI elements for a clean look.
    *   Implement mobile-first responsive design using media queries to ensure usability on different screen sizes.
    *   Style the image display area and loading/error states.

4.  **JavaScript Logic (`script.js`):**
    *   **API Key Handling:**
        *   Get the API key input element.
        *   Add an event listener (e.g., on button click or input change) to store the API key in `localStorage`. Ensure the user understands the key is stored locally.
        *   Retrieve the API key from `localStorage` when needed. Provide feedback if no key is found.
    *   **Get User Inputs:**
        *   Get references to the prompt input, parameter controls, and generate button.
        *   Read the values from these inputs when the "Generate Image" button is clicked.
    *   **API Call:**
        *   Add an event listener to the "Generate Image" button.
        *   Inside the event handler:
            *   Retrieve the API key and prompt.
            *   Retrieve selected API parameters.
            *   Validate inputs (e.g., check if API key and prompt are provided).
            *   Construct the request payload according to the OpenAI Images API documentation (https://platform.openai.com/docs/api-reference/images/create).
            *   Use the `fetch` API to make a POST request directly to the OpenAI API endpoint (`https://api.openai.com/v1/images/generations`).
            *   Include the `Authorization: Bearer YOUR_API_KEY` header using the user's stored key.
            *   Include the `Content-Type: application/json` header.
            *   Handle the fetch promise (`.then()` for success, `.catch()` for network errors).
    *   **Response Handling:**
        *   Parse the JSON response from OpenAI.
        *   Check for errors in the response body. Display meaningful error messages to the user (e.g., invalid API key, billing issues, content policy violation).
        *   If successful, extract the image URL(s) from the response data.
    *   **Image Display:**
        *   Get the image display container element.
        *   Create an `<img>` element.
        *   Set the `src` attribute to the received image URL.
        *   Append the image element to the display container.
        *   Handle loading states (e.g., show a spinner while waiting for the API response).
    *   **UI Feedback:**
        *   Disable the "Generate Image" button during the API call to prevent multiple requests.
        *   Display status messages (e.g., "Generating...", "Success!", "Error: ...").

5.  **Deployment:**
    *   Ensure all code (HTML, CSS, JS) is committed to the Git repository.
    *   Configure the repository settings on GitHub to enable GitHub Pages, deploying from the appropriate branch (e.g., `main` or `gh-pages`).
    *   Test the deployed application.

6.  **Testing:**
    *   Test API key input and storage.
    *   Test image generation with various prompts and parameters.
    *   Test error handling (invalid key, empty prompt, network errors, OpenAI API errors).
    *   Test responsiveness on different screen sizes (desktop, tablet, mobile) using browser developer tools.
    *   Test in different browsers (Chrome, Firefox, Safari).

## Considerations
-   **API Costs:** Clearly inform users that generating images incurs costs on their OpenAI account.
-   **Security:** Emphasize that the API key is stored *only* in their browser's `localStorage` and is *not* sent to any backend server associated with this app. However, `localStorage` is not highly secure; advise users accordingly.
-   **Rate Limits:** Be mindful of OpenAI API rate limits. The app doesn't manage this, but users might encounter limits.
-   **OpenAI API Changes:** The OpenAI API might change. The app may need updates to remain compatible.