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


7.  **Refine 'N' Input:**
    *   Modify the HTML for the 'Number of Images (n)' input (`<input type="number" id="n">`) to be a `<select>` dropdown element.
    *   Update the JavaScript (`updateOptionsUI` function in `script.js`) to dynamically populate this dropdown with options from 1 to the `maxN` allowed by the selected model (1 for DALL-E 3, 10 for others).
    *   Ensure the dropdown styling matches the other dropdowns for visual consistency (check `style.css`).

8.  **Improve Option Layout and Descriptions:**
    *   Adjust the CSS (`style.css`) for the `.options` container and its children.
    *   Use CSS (e.g., Flexbox or Grid) to align the dropdown labels and controls to the left side of their respective grid cells.
    *   Add descriptive text elements (e.g., `<p class="option-description">` or similar) next to or below each control (Size, Quality, N, Style, Background, etc.) in `index.html`.
    *   Populate these descriptions with brief explanations of what each parameter does, based on `docs.md`.
    *   Style these descriptions appropriately in `style.css` (e.g., smaller font size, muted color).
    *   Ensure the layout remains responsive on mobile devices.

9.  **Add API Key Tooltip:**
    *   In `index.html`, add a small element (e.g., a `<span>` or `<a>` containing a question mark icon '❓' or '(?)') next to the "Enter your API Key:" label or the `<h2>OpenAI API Key</h2>` heading.
    *   Add an `id` to this element (e.g., `api-key-tooltip-trigger`).
    *   Add a hidden `div` element nearby to contain the tooltip text (e.g., `<div id="api-key-tooltip" class="tooltip" style="display: none;">...</div>`).
    *   Populate the tooltip `div` with text explaining how to get an API key, including the link: `"You need an OpenAI API key. You can create one at https://platform.openai.com/api-keys"`.
    *   Add CSS in `style.css` to style the trigger element (cursor, appearance) and the tooltip itself (positioning, background, border, padding, z-index).
    *   Add JavaScript in `script.js` to add event listeners (e.g., `mouseover`/`mouseout` or `click`) to the trigger element to show/hide the tooltip `div` by changing its `display` style.

10. **Implement Camera Roll:**
    *   Add a new section in `index.html` below the results section, e.g., `<section id="camera-roll-section"><h2>Camera Roll</h2><div id="camera-roll-images"></div></section>`.
    *   Add CSS in `style.css` to style the camera roll section and the images within it (e.g., display as a grid or row, set max-width/height for thumbnails, add spacing).
    *   Modify the image generation success logic in `script.js`:
        *   Before displaying the *new* image(s) in the `#image-result` div, check if there are existing images in `#image-result`.
        *   If existing images are found, move them (or copies of them) from `#image-result` to the `#camera-roll-images` div.
        *   Ensure that when moving/copying, the images retain their `src` (URL or base64 data URI).
        *   Consider adding functionality to clear the camera roll or limit the number of stored images if `localStorage` usage becomes a concern (optional enhancement).

11. **Add Multi-Provider Support & Advanced Imagen Features:**
    *   Add radio buttons at the top of the UI for different image generation providers:
        *   OpenAI models (DALL-E 2, DALL-E 3, GPT-Image-1)
        *   Google Imagen (via Gemini API)
        *   Google Vertex AI (Disabled Placeholder)
        *   Adobe Firefly models (Disabled Placeholder)
    *   Implement the UI changes:
        *   Create a new section in `index.html` above the model selection dropdown for provider selection.
        *   Style the provider selection section with radio buttons in `style.css`.
        *   Grey out Adobe Firefly and Google Vertex AI options, making them unclickable.
        *   Add tooltips to disabled providers explaining their status (e.g., Vertex AI requires different setup/SaaS version).
        *   Update the model dropdown to dynamically show only models from the selected *functional* provider (OpenAI, Google Imagen).
    *   Implement Google Imagen API integration (Gemini Endpoint):
        *   Use the Gemini API endpoint (`generativelanguage.googleapis.com`) for the "Google Imagen" provider.
        *   Define the `imagen-3.0-generate-002` model and its supported parameters (`aspectRatio`, `personGeneration`, `numberOfImages`) in `modelOptions`.
        *   Implement the API call function using the user's Google API Key.
        *   (Note: Parameters like Negative Prompt, Seed, etc., are *not* supported by this endpoint for Imagen 3).
    *   Implement API key management for multiple providers:
        *   Modify the API key section to support OpenAI and Google API keys.
        *   Show the relevant API key input based on the selected functional provider.
        *   Hide API key inputs when a disabled provider (Vertex AI, Adobe) is selected.
    *   Update the image generation logic:
        *   Modify the generate button event listener to check which provider is selected.
        *   Route the API call to the appropriate provider's API endpoint (OpenAI, Google Imagen).
        *   Disable generation button when a disabled provider is selected.
        *   Handle provider-specific response formats and error messages.
    *   Add provider-specific UI elements and options:
        *   Create container divs for Google Imagen (Gemini API) specific options (`aspectRatio`, `personGeneration`).
        *   Update the `updateProviderUI` and `updateOptionsUI` functions to show/hide provider-specific options and API key sections correctly.
        *   Remove any non-functional UI elements previously added for Vertex AI.
    *   **Future Enhancements (Deferred):**
        *   **Vertex AI Implementation:** Fully implement Vertex AI generation. This likely requires a backend proxy server to handle Google Cloud authentication securely and make API calls to the `aiplatform.googleapis.com` endpoint. Define Vertex AI models (`imagegeneration@001`, `@002`, `@003`, etc.) and their parameters (`negativePrompt`, `seed`, etc.) in `modelOptions` and add corresponding UI controls.
        *   **Imagen Editing Modes (Vertex AI):** Implement advanced Imagen capabilities like Image-to-Image, Inpainting, Outpainting via the Vertex AI API (requires backend and UI changes).
        *   **Adobe Firefly Implementation:** Add support when feasible.

## Considerations
-   **API Costs:** Clearly inform users that generating images incurs costs on their OpenAI account.
-   **Security:** Emphasize that the API key is stored *only* in their browser's `localStorage` and is *not* sent to any backend server associated with this app. However, `localStorage` is not highly secure; advise users accordingly.
-   **Rate Limits:** Be mindful of OpenAI API rate limits. The app doesn't manage this, but users might encounter limits.
-   **OpenAI API Changes:** The OpenAI API might change. The app may need updates to remain compatible.