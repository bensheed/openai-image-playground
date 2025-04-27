document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyButton = document.getElementById('save-key-button');
    const keyStatus = document.getElementById('key-status');
    const modelSelect = document.getElementById('model'); // New
    const promptInput = document.getElementById('prompt');
    const sizeSelect = document.getElementById('size');
    const qualitySelect = document.getElementById('quality');
    const nInput = document.getElementById('n'); // New
    const generateButton = document.getElementById('generate-button');
    const statusMessage = document.getElementById('status-message');
    const imageResultDiv = document.getElementById('image-result');

    // Model Specific Option Containers & Controls
    const dalle3OptionsDiv = document.getElementById('dalle3-options'); // New
    const styleSelect = document.getElementById('style'); // Moved inside dalle3OptionsDiv in HTML, but reference is fine

    const gptImage1OptionsDiv = document.getElementById('gpt-image-1-options'); // New
    const backgroundSelect = document.getElementById('background'); // New
    const moderationSelect = document.getElementById('moderation'); // New
    const outputFormatSelect = document.getElementById('output_format'); // New
    const outputCompressionInput = document.getElementById('output_compression'); // New

    const OPENAI_API_KEY_NAME = 'openai_api_key';
    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';

    // --- Model Parameter Definitions ---
    const modelOptions = {
        "gpt-image-1": {
            sizes: ["auto", "1024x1024", "1536x1024", "1024x1536"],
            qualities: ["auto", "high", "medium", "low"],
            maxN: 10,
            supportsStyle: false,
            supportsBackground: true,
            supportsModeration: true,
            supportsOutputFormat: true,
            supportsOutputCompression: true, // Depends on output_format
            responseFormat: 'b64_json' // Implicitly b64
        },
        "dall-e-3": {
            sizes: ["1024x1024", "1792x1024", "1024x1792"],
            qualities: ["standard", "hd"],
            maxN: 1,
            supportsStyle: true,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            responseFormat: 'url'
        },
        "dall-e-2": {
            sizes: ["256x256", "512x512", "1024x1024"],
            qualities: ["standard"],
            maxN: 10,
            supportsStyle: false,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            responseFormat: 'url'
        }
    };

    // --- UI Update Function ---
    function updateOptionsUI(selectedModel) {
        console.log(`Updating UI for model: ${selectedModel}`);
        const options = modelOptions[selectedModel];
        if (!options) {
            console.error("Invalid model selected");
            return;
        }

        // Populate Size Dropdown
        sizeSelect.innerHTML = ''; // Clear existing options
        options.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size === 'auto' ? 'Auto' : size;
            sizeSelect.appendChild(option);
        });
        // Set default or preserve selection if possible
        sizeSelect.value = options.sizes.includes(sizeSelect.value) ? sizeSelect.value : options.sizes[0];


        // Populate Quality Dropdown
        qualitySelect.innerHTML = ''; // Clear existing options
        options.qualities.forEach(quality => {
            const option = document.createElement('option');
            option.value = quality;
            option.textContent = quality.charAt(0).toUpperCase() + quality.slice(1); // Capitalize
            qualitySelect.appendChild(option);
        });
         // Set default or preserve selection if possible
        qualitySelect.value = options.qualities.includes(qualitySelect.value) ? qualitySelect.value : options.qualities[0];


        // Update N Input Max and Value
        nInput.max = options.maxN;
        if (parseInt(nInput.value) > options.maxN) {
            nInput.value = options.maxN; // Adjust value if current value exceeds new max
        }
        nInput.disabled = options.maxN === 1; // Disable if only 1 allowed


        // Show/Hide Model Specific Sections
        dalle3OptionsDiv.style.display = options.supportsStyle ? 'block' : 'none';
        gptImage1OptionsDiv.style.display = (options.supportsBackground || options.supportsModeration || options.supportsOutputFormat || options.supportsOutputCompression) ? 'block' : 'none';

        // Enable/Disable gpt-image-1 specific controls within the section
        backgroundSelect.closest('div').style.display = options.supportsBackground ? 'block' : 'none';
        moderationSelect.closest('div').style.display = options.supportsModeration ? 'block' : 'none';
        outputFormatSelect.closest('div').style.display = options.supportsOutputFormat ? 'block' : 'none';
        outputCompressionInput.closest('div').style.display = options.supportsOutputFormat ? 'block' : 'none'; // Compression shown if format is shown

        // Handle output_compression enable/disable based on output_format
        const compressionEnabled = options.supportsOutputCompression && ['jpeg', 'webp'].includes(outputFormatSelect.value);
        outputCompressionInput.disabled = !compressionEnabled;
        outputCompressionInput.closest('div').querySelector('small').style.display = options.supportsOutputFormat ? 'inline' : 'none'; // Show/hide the note
    }

    // --- Event Listeners ---
    // Update UI when model changes
    modelSelect.addEventListener('change', (e) => {
        updateOptionsUI(e.target.value);
    });

    // Update compression enable/disable when output format changes (only if gpt-image-1 is active)
    outputFormatSelect.addEventListener('change', (e) => {
        if (modelSelect.value === 'gpt-image-1') {
             const compressionEnabled = ['jpeg', 'webp'].includes(e.target.value);
             outputCompressionInput.disabled = !compressionEnabled;
        }
    });

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

    // Initialize UI based on default model selection
    updateOptionsUI(modelSelect.value);

    // --- Image Generation Logic (to be added next) ---
    generateButton.addEventListener('click', async () => {
        const apiKey = localStorage.getItem(OPENAI_API_KEY_NAME);
        const selectedModel = modelSelect.value;
        const modelConfig = modelOptions[selectedModel];
        const prompt = promptInput.value.trim();

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
        if (!modelConfig) {
             statusMessage.textContent = 'Error: Invalid model selected.';
             statusMessage.style.color = 'red';
             return;
        }

        // --- Prepare for API Call ---
        statusMessage.textContent = 'Generating image(s)... Please wait.';
        statusMessage.style.color = 'blue';
        imageResultDiv.innerHTML = ''; // Clear previous images
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';

        // --- Construct API Request Body Dynamically ---
        const requestBody = {
            model: selectedModel,
            prompt: prompt,
            n: parseInt(nInput.value) || 1, // Ensure n is an integer
        };

        // Add parameters based on model capabilities and user selections
        if (sizeSelect.value !== 'auto' || selectedModel !== 'gpt-image-1') {
             requestBody.size = sizeSelect.value;
        }
        if (qualitySelect.value !== 'auto' || selectedModel !== 'gpt-image-1') {
             requestBody.quality = qualitySelect.value;
        }

        // Add response_format only for DALL-E models (as per decision)
        if (selectedModel === 'dall-e-2' || selectedModel === 'dall-e-3') {
            requestBody.response_format = 'url';
        }
        // Note: gpt-image-1 implicitly returns b64_json, no need to set response_format

        // Add model-specific parameters
        if (modelConfig.supportsStyle) {
            requestBody.style = styleSelect.value;
        }
        if (modelConfig.supportsBackground && backgroundSelect.value !== 'auto') {
            requestBody.background = backgroundSelect.value;
        }
        if (modelConfig.supportsModeration && moderationSelect.value !== 'auto') {
            requestBody.moderation = moderationSelect.value;
        }
        if (modelConfig.supportsOutputFormat && outputFormatSelect.value !== 'png') { // Only include if not default
             requestBody.output_format = outputFormatSelect.value;
             // Include compression only if format is jpeg/webp
             if (modelConfig.supportsOutputCompression && ['jpeg', 'webp'].includes(requestBody.output_format)) {
                 requestBody.output_compression = parseInt(outputCompressionInput.value);
             }
        }

        console.log('Sending request to OpenAI:', JSON.stringify(requestBody, null, 2));

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
                const errorMessage = data.error?.message || `HTTP error! Status: ${response.status}`;
                throw new Error(errorMessage);
            }

            if (data.data && data.data.length > 0) {
                // Determine expected format for processing
                const expectedFormat = modelConfig.responseFormat; // 'url' or 'b64_json'

                data.data.forEach((item, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.alt = `Generated image ${index + 1} for: ${prompt}`;

                    if (expectedFormat === 'url' && item.url) {
                        imgElement.src = item.url;
                    } else if (expectedFormat === 'b64_json' && item.b64_json) {
                        // For b64, determine the image type from the user's selection (or default)
                        const imageType = requestBody.output_format || 'png'; // Use selected format, default to png
                        imgElement.src = `data:image/${imageType};base64,${item.b64_json}`;
                    } else {
                        console.warn(`Item ${index} in response did not contain expected data format (${expectedFormat})`);
                        return; // Skip this item
                    }
                    imageResultDiv.appendChild(imgElement);
                });

                statusMessage.textContent = `Image(s) generated successfully! (${data.data.length} image${data.data.length > 1 ? 's' : ''})`;
                statusMessage.style.color = 'green';

            } else {
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
