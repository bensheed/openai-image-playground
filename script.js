document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyButton = document.getElementById('save-key-button');
    const keyStatus = document.getElementById('key-status');
    const promptInput = document.getElementById('prompt');
    const sizeSelect = document.getElementById('size');
    const qualitySelect = document.getElementById('quality');
    const styleSelect = document.getElementById('style');
    const generateButton = document.getElementById('generate-button');
    const statusMessage = document.getElementById('status-message');
    const imageResultDiv = document.getElementById('image-result');

    const OPENAI_API_KEY_NAME = 'openai_api_key';
    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';

    // --- API Key Handling ---
    function loadApiKey() {
        const savedKey = localStorage.getItem(OPENAI_API_KEY_NAME);
        if (savedKey) {
            apiKeyInput.value = savedKey;
            keyStatus.textContent = 'Status: Key loaded from localStorage.';
            keyStatus.style.color = 'green';
        } else {
            keyStatus.textContent = 'Status: No key saved. Please enter your key.';
            keyStatus.style.color = 'red';
        }
    }

    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem(OPENAI_API_KEY_NAME, apiKey);
            keyStatus.textContent = 'Status: Key saved successfully!';
            keyStatus.style.color = 'green';
            console.log('API Key saved to localStorage.');
        } else {
            localStorage.removeItem(OPENAI_API_KEY_NAME); // Remove if empty
            keyStatus.textContent = 'Status: API Key field is empty. Key removed.';
            keyStatus.style.color = 'orange';
            console.log('API Key removed from localStorage.');
        }
    }

    // Event listener for the save button
    saveKeyButton.addEventListener('click', saveApiKey);

    // Load the API key when the page loads
    loadApiKey();

    // --- Image Generation Logic (to be added next) ---
    generateButton.addEventListener('click', async () => {
        const apiKey = localStorage.getItem(OPENAI_API_KEY_NAME);
        const prompt = promptInput.value.trim();
        const size = sizeSelect.value;
        const quality = qualitySelect.value;
        const style = styleSelect.value;

        // --- Input Validation ---
        if (!apiKey) {
            statusMessage.textContent = 'Error: API Key not found. Please save your key first.';
            statusMessage.style.color = 'red';
            return;
        }
        if (!prompt) {
            statusMessage.textContent = 'Error: Please enter a prompt.';
            statusMessage.style.color = 'red';
            return;
        }

        // --- Prepare for API Call ---
        statusMessage.textContent = 'Generating image... Please wait.';
        statusMessage.style.color = 'blue';
        imageResultDiv.innerHTML = ''; // Clear previous image
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';

        // --- Construct API Request Body ---
        // Note: DALL-E 3 currently only supports n=1
        const requestBody = {
            model: "dall-e-3", // Use DALL-E 3 model
            prompt: prompt,
            n: 1,
            size: size,
            quality: quality,
            style: style,
            response_format: "url" // Request image URL
        };

        console.log('Sending request to OpenAI:', requestBody);

        // --- Make API Call ---
        try {
            const response = await fetch(OPENAI_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Received response from OpenAI:', data);

            if (!response.ok) {
                // Handle HTTP errors (e.g., 401 Unauthorized, 429 Rate Limit)
                const errorMessage = data.error?.message || `HTTP error! Status: ${response.status}`;
                throw new Error(errorMessage);
            }

            if (data.data && data.data.length > 0 && data.data[0].url) {
                const imageUrl = data.data[0].url;
                // Display the image
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = `Generated image for: ${prompt}`;
                imageResultDiv.appendChild(imgElement);
                statusMessage.textContent = 'Image generated successfully!';
                statusMessage.style.color = 'green';
            } else {
                // Handle cases where response is ok but no image data is present
                 throw new Error('API response did not contain image data.');
            }

        } catch (error) {
            console.error('Error generating image:', error);
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.style.color = 'red';
        } finally {
            // --- Reset UI State ---
            generateButton.disabled = false;
            generateButton.textContent = 'Generate Image';
        }
    });

}); // End DOMContentLoaded
