document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Provider Selection
    const providerRadios = document.querySelectorAll('input[name="provider"]');
    const openaiKeySection = document.getElementById('openai-key-section');
    const googleKeySection = document.getElementById('google-key-section');
    const adobeTooltipTrigger = document.getElementById('adobe-tooltip-trigger');
    const adobeTooltip = document.getElementById('adobe-tooltip');
    const vertexTooltipTrigger = document.getElementById('vertex-tooltip-trigger');
    const vertexTooltip = document.getElementById('vertex-tooltip');
    

    // API Keys
    // API Key Tooltips
    const openaiKeyTooltipTrigger = document.getElementById('openai-key-tooltip-trigger');
    const openaiKeyTooltip = document.getElementById('openai-key-tooltip');
    const googleKeyTooltipTrigger = document.getElementById('google-key-tooltip-trigger');
    const googleKeyTooltip = document.getElementById('google-key-tooltip');
    const openaiApiKeyInput = document.getElementById('openai-api-key');
    const saveOpenaiKeyButton = document.getElementById('save-openai-key-button');
    const openaiKeyStatus = document.getElementById('openai-key-status');
    const googleApiKeyInput = document.getElementById('google-api-key');
    const saveGoogleKeyButton = document.getElementById('save-google-key-button');
    const googleKeyStatus = document.getElementById('google-key-status');
    
    // Generation Controls
    const modelSelect = document.getElementById('model');
    const promptInput = document.getElementById('prompt');
    const sizeSelect = document.getElementById('size');
    const qualitySelect = document.getElementById('quality');
    const nInput = document.getElementById('n');
    const generateButton = document.getElementById('generate-button');
    const statusMessage = document.getElementById('status-message');
    const imageResultDiv = document.getElementById('image-result');

    // Model Specific Option Containers & Controls
    const dalle3OptionsDiv = document.getElementById('dalle3-options');
    const styleSelect = document.getElementById('style');

    // GPT-Image-1 Specific Options
    const gptImage1Options = document.querySelectorAll('.gpt-image-1-option');
    const backgroundSelect = document.getElementById('background');
    const moderationSelect = document.getElementById('moderation');
    const outputFormatSelect = document.getElementById('output_format');
    const outputCompressionInput = document.getElementById('output_compression');
    
    // Google Imagen Specific Options
    const googleImagenOptions = document.querySelectorAll('.google-imagen-option');
    const aspectRatioSelect = document.getElementById('aspect_ratio');
    const personGenerationSelect = document.getElementById('person_generation');



    // API Constants
    const OPENAI_API_KEY_NAME = 'openai_api_key';
    const GOOGLE_API_KEY_NAME = 'google_api_key';
    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
    const GOOGLE_IMAGEN_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';

    // --- Model Parameter Definitions ---
    const modelOptions = {
        // OpenAI Models
        "gpt-image-1": {
            provider: "openai",
            sizes: ["auto", "1024x1024", "1536x1024", "1024x1536"],
            qualities: ["auto", "high", "medium", "low"],
            maxN: 10,
            supportsStyle: false,
            supportsBackground: true,
            supportsModeration: true,
            supportsOutputFormat: true,
            supportsOutputCompression: true, // Depends on output_format
            responseFormat: 'b64_json', // Implicitly b64
            apiEndpoint: OPENAI_API_ENDPOINT
        },
        "dall-e-3": {
            provider: "openai",
            sizes: ["1024x1024", "1792x1024", "1024x1792"],
            qualities: ["standard", "hd"],
            maxN: 1,
            supportsStyle: true,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            responseFormat: 'url',
            apiEndpoint: OPENAI_API_ENDPOINT
        },
        "dall-e-2": {
            provider: "openai",
            sizes: ["256x256", "512x512", "1024x1024"],
            qualities: ["standard"],
            maxN: 10,
            supportsStyle: false,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            responseFormat: 'url',
            apiEndpoint: OPENAI_API_ENDPOINT
        },
        
        // Google Imagen (Gemini API) Model
        "imagen-3.0-generate-002": {
            provider: "google", // Corresponds to the "Google Imagen" radio button
            sizes: [], // Controlled by aspect ratio instead
            qualities: [], // Not applicable
            maxN: 4, // Google Imagen supports 1-4 images
            supportsStyle: false,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            supportsAspectRatio: true,
            supportsPersonGeneration: true,
            responseFormat: 'b64_json',
            apiEndpoint: GOOGLE_IMAGEN_API_ENDPOINT // Gemini API endpoint
        }
    };

    // --- Provider Selection Function ---
    function updateProviderUI(selectedProvider) {
        console.log(`Updating UI for provider: ${selectedProvider}`);
        
        // Show/hide API key sections based on provider
        openaiKeySection.style.display = selectedProvider === 'openai' ? 'block' : 'none';
        googleKeySection.style.display = selectedProvider === 'google' ? 'block' : 'none';
        // Note: Vertex AI is disabled, so no specific key section handling needed here.

        // Enable/disable generate button
        // The button should be enabled unless a disabled provider is somehow selected
        const selectedProviderInput = document.querySelector(`input[name="provider"][value="${selectedProvider}"]`);
        generateButton.disabled = selectedProviderInput?.disabled || false;
        generateButton.textContent = 'Generate Image';
        if (generateButton.disabled) {
             generateButton.textContent = 'Generate Image (Provider N/A)';
        }
        
        // Clear status message
        statusMessage.textContent = ''; 
        modelSelect.disabled = false;

        // Filter and show only models for the selected provider
        let firstVisibleOption = null;
        modelSelect.innerHTML = ''; // Clear previous options before adding new ones

        Object.keys(modelOptions).forEach(modelName => {
            const modelConfig = modelOptions[modelName];
            if (modelConfig.provider === selectedProvider) {
                const option = document.createElement('option');
                option.value = modelName;
                option.textContent = modelName;
                // Add class for Google models if needed (for potential future styling)
                if (selectedProvider === 'google') {
                     option.classList.add('google-model');
                }
                modelSelect.appendChild(option);
                if (!firstVisibleOption) {
                    firstVisibleOption = option;
                }
            }
        });

        // Select the first visible option and update UI
        if (firstVisibleOption) {
            modelSelect.value = firstVisibleOption.value;
            updateOptionsUI(firstVisibleOption.value);
        } else {
             // This case should only happen if a provider has no models defined
             // or if the disabled Vertex provider is somehow selected.
             modelSelect.innerHTML = '<option value="">-- No models available --</option>';
             modelSelect.disabled = true;
             // Hide all standard model options
             document.querySelectorAll('.options .option-item').forEach(el => el.style.display = 'none');
        }
    }

    // --- UI Update Function ---
    function updateOptionsUI(selectedModel) {
        console.log(`Updating UI for model: ${selectedModel}`);
        const options = modelOptions[selectedModel];
        if (!options) {
            console.error("Invalid model selected");
            return;
        }

        // Show/Hide Provider-Specific Options
        const isGoogleModel = options.provider === 'google';
        
        // Show/hide Google Imagen specific options
        googleImagenOptions.forEach(el => {
            el.style.display = isGoogleModel ? 'block' : 'none';
        });
        
        // For OpenAI models, handle size dropdown
        const sizeContainer = sizeSelect.closest('div');
        if (isGoogleModel) {
            // For Google models, hide size dropdown as it uses aspect ratio instead
            sizeContainer.style.display = 'none';
        } else {
            // For OpenAI models, show and populate size dropdown
            sizeContainer.style.display = 'block';
            
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
        }

        // Populate Quality Dropdown
        const qualityContainer = qualitySelect.closest('div'); // Get the parent div
        if (isGoogleModel || selectedModel === 'dall-e-2') {
            qualityContainer.style.display = 'none'; // Hide for Google models and DALL-E 2
        } else {
            qualityContainer.style.display = 'block'; // Show for others
            qualitySelect.innerHTML = ''; // Clear existing options
            options.qualities.forEach(quality => {
                const option = document.createElement('option');
                option.value = quality;
                option.textContent = quality.charAt(0).toUpperCase() + quality.slice(1); // Capitalize
                qualitySelect.appendChild(option);
            });
            // Set default or preserve selection if possible
            qualitySelect.value = options.qualities.includes(qualitySelect.value) ? qualitySelect.value : options.qualities[0];
        }

        // Populate N Dropdown
        const nSelect = nInput; // Re-using the variable name, but it's the select element now
        const currentNValue = parseInt(nSelect.value); // Store current value before clearing
        nSelect.innerHTML = ''; // Clear existing options
        for (let i = 1; i <= options.maxN; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            nSelect.appendChild(option);
        }
        // Try to restore previous selection if valid, otherwise default to 1
        if (currentNValue >= 1 && currentNValue <= options.maxN) {
            nSelect.value = currentNValue;
        } else {
            nSelect.value = 1;
        }
        nSelect.disabled = options.maxN === 1; // Disable dropdown if only 1 option

        // Show/Hide OpenAI Model Specific Sections
        dalle3OptionsDiv.style.display = options.supportsStyle ? 'block' : 'none';
        
        // Show/Hide GPT-Image-1 specific options individually
        const showGpt1Options = selectedModel === 'gpt-image-1';
        gptImage1Options.forEach(el => {
            el.style.display = showGpt1Options ? 'block' : 'none';
        });

        // If showing GPT-1 options, handle compression input visibility/disable state
        if (showGpt1Options) {
            const compressionEnabled = options.supportsOutputCompression && ['jpeg', 'webp'].includes(outputFormatSelect.value);
            outputCompressionInput.disabled = !compressionEnabled;
        }
    }

    // --- Event Listeners ---
    // Provider selection change
    providerRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                updateProviderUI(e.target.value);
            }
        });
    });
    


    // --- Tooltip Hide Delay Logic ---
    let hideTimeout;

    function showTooltip(tooltipElement) {
        clearTimeout(hideTimeout);
        tooltipElement.style.display = 'block';
    }

    function hideTooltip(tooltipElement) {
        hideTimeout = setTimeout(() => {
            tooltipElement.style.display = 'none';
        }, 100); // Delay hiding slightly
    }

    // Helper to add listeners
    function addTooltipListeners(triggerElement, tooltipElement) {
        if (triggerElement && tooltipElement) {
            console.log(`Attaching tooltip listeners for: ${tooltipElement.id}`);
            triggerElement.addEventListener('mouseover', () => {
                console.log(`${tooltipElement.id} - trigger mouseover`);
                showTooltip(tooltipElement);
            });
            triggerElement.addEventListener('mouseout', () => {
                console.log(`${tooltipElement.id} - trigger mouseout`);
                hideTooltip(tooltipElement);
            });
            tooltipElement.addEventListener('mouseover', () => {
                console.log(`${tooltipElement.id} - tooltip mouseover`);
                clearTimeout(hideTimeout); // Cancel hide if mouse enters tooltip
            });
            tooltipElement.addEventListener('mouseout', () => {
                console.log(`${tooltipElement.id} - tooltip mouseout`);
                hideTooltip(tooltipElement); // Hide when mouse leaves tooltip too
            });
        } else {
            console.warn(`Tooltip elements not found for trigger/tooltip pair.`);
        }
    }

    // Add listeners for specific tooltips
    addTooltipListeners(openaiKeyTooltipTrigger, openaiKeyTooltip);
    addTooltipListeners(googleKeyTooltipTrigger, googleKeyTooltip);
    addTooltipListeners(adobeTooltipTrigger, adobeTooltip); // Apply to Adobe too for consistency
    addTooltipListeners(vertexTooltipTrigger, vertexTooltip);


    
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
    function loadApiKeys() {
        // Load OpenAI API Key
        const savedOpenaiKey = localStorage.getItem(OPENAI_API_KEY_NAME);
        if (savedOpenaiKey) {
            openaiApiKeyInput.value = savedOpenaiKey;
            openaiKeyStatus.textContent = 'Status: Key loaded from localStorage.';
            openaiKeyStatus.style.color = 'green';
        } else {
            openaiKeyStatus.textContent = 'Status: No key saved. Please enter your key.';
            openaiKeyStatus.style.color = 'red';
        }
        
        // Load Google API Key
        const savedGoogleKey = localStorage.getItem(GOOGLE_API_KEY_NAME);
        if (savedGoogleKey) {
            googleApiKeyInput.value = savedGoogleKey;
            googleKeyStatus.textContent = 'Status: Key loaded from localStorage.';
            googleKeyStatus.style.color = 'green';
        } else {
            googleKeyStatus.textContent = 'Status: No key saved. Please enter your key.';
            googleKeyStatus.style.color = 'red';
        }
    }

    function saveOpenaiApiKey() {
        const apiKey = openaiApiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem(OPENAI_API_KEY_NAME, apiKey);
            openaiKeyStatus.textContent = 'Status: Key saved successfully!';
            openaiKeyStatus.style.color = 'green';
            console.log('OpenAI API Key saved to localStorage.');
        } else {
            localStorage.removeItem(OPENAI_API_KEY_NAME); // Remove if empty
            openaiKeyStatus.textContent = 'Status: API Key field is empty. Key removed.';
            openaiKeyStatus.style.color = 'orange';
            console.log('OpenAI API Key removed from localStorage.');
        }
    }
    
    function saveGoogleApiKey() {
        const apiKey = googleApiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem(GOOGLE_API_KEY_NAME, apiKey);
            googleKeyStatus.textContent = 'Status: Key saved successfully!';
            googleKeyStatus.style.color = 'green';
            console.log('Google API Key saved to localStorage.');
        } else {
            localStorage.removeItem(GOOGLE_API_KEY_NAME); // Remove if empty
            googleKeyStatus.textContent = 'Status: API Key field is empty. Key removed.';
            googleKeyStatus.style.color = 'orange';
            console.log('Google API Key removed from localStorage.');
        }
    }

    // Event listeners for the save buttons
    saveOpenaiKeyButton.addEventListener('click', saveOpenaiApiKey);
    saveGoogleKeyButton.addEventListener('click', saveGoogleApiKey);

    // Load the API keys when the page loads
    loadApiKeys();

    // Initialize UI based on default provider and model selection
    updateProviderUI('openai');
    updateOptionsUI(modelSelect.value);

    // --- Image Generation Logic ---
    generateButton.addEventListener('click', async () => {
        const selectedModel = modelSelect.value;
        const modelConfig = modelOptions[selectedModel];
        const prompt = promptInput.value.trim();
        const selectedProvider = modelConfig.provider;
        
        // Get the appropriate API key based on the provider
        let apiKey;
        if (selectedProvider === 'openai') {
            apiKey = localStorage.getItem(OPENAI_API_KEY_NAME);
        } else if (selectedProvider === 'google') {
            apiKey = localStorage.getItem(GOOGLE_API_KEY_NAME);
        }

        // --- Input Validation ---
        if (!apiKey) {
            statusMessage.textContent = `Error: ${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} API Key not found. Please save your key first.`;
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

        try {
            if (selectedProvider === 'openai') {
                await generateOpenAIImage(apiKey, selectedModel, modelConfig, prompt);
            } else if (selectedProvider === 'google') {
                await generateGoogleImage(apiKey, selectedModel, modelConfig, prompt);
            }
        } catch (error) {
            console.error(`Error generating image with ${selectedProvider}:`, error);
            let displayErrorMessage = `Error: ${error.message}`;
            
            // Provider-specific error handling
            if (selectedProvider === 'openai' && (error.message.includes('Error in request') || error.message.includes('check your input') || error.message.includes('400'))) {
                displayErrorMessage += '\n\n(This might be due to insufficient credits or account limits. Check your balance: https://platform.openai.com/settings/organization/billing/overview)';
            } else if (selectedProvider === 'google') {
                displayErrorMessage += '\n\n(Make sure your Google API key has access to the Gemini API and check your quota limits)';
            }
            
            statusMessage.textContent = displayErrorMessage;
            statusMessage.style.color = 'red';
        } finally {
            // --- Reset UI State ---
            generateButton.disabled = false;
            generateButton.textContent = 'Generate Image';
        }
    });
    
    // --- OpenAI Image Generation Function ---
    async function generateOpenAIImage(apiKey, selectedModel, modelConfig, prompt) {
        // --- Construct API Request Body Dynamically ---
        const requestBody = {
            model: selectedModel,
            prompt: prompt,
            n: parseInt(nInput.value) || 1, // Common parameter
        };

        // --- Add Model-Specific Parameters ---
        if (selectedModel === 'dall-e-3') {
            // DALL-E 3 requires size, quality, style. n is always 1 (handled by UI).
            requestBody.size = sizeSelect.value;
            requestBody.quality = qualitySelect.value;
            requestBody.style = styleSelect.value;
            // response_format defaults to 'url', which is fine.
        } else if (selectedModel === 'dall-e-2') {
            // DALL-E 2 requires size. n can be > 1.
            requestBody.size = sizeSelect.value;
            // quality is not applicable. response_format defaults to 'url'.
        } else if (selectedModel === 'gpt-image-1') {
            // gpt-image-1 has many optional parameters.
            // Size is optional (defaults to auto)
            if (sizeSelect.value !== 'auto') {
                requestBody.size = sizeSelect.value;
            }
            // Quality is optional (defaults to auto)
            if (qualitySelect.value !== 'auto') {
                requestBody.quality = qualitySelect.value;
            }
            // Background is optional (defaults to auto)
            if (backgroundSelect.value !== 'auto') {
                requestBody.background = backgroundSelect.value;
            }
            // Moderation is optional (defaults to auto)
            if (moderationSelect.value !== 'auto') {
                requestBody.moderation = moderationSelect.value;
            }
            // Output format is optional (defaults to png)
            if (outputFormatSelect.value !== 'png') {
                requestBody.output_format = outputFormatSelect.value;
                // Compression only applies if format is jpeg/webp
                if (['jpeg', 'webp'].includes(requestBody.output_format)) {
                    requestBody.output_compression = parseInt(outputCompressionInput.value);
                }
            }
            // response_format is implicitly b64_json.
        }

        console.log('Sending request to OpenAI:', JSON.stringify(requestBody, null, 2));

        // --- Make API Call ---
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
    }
    
    // --- Google Imagen Image Generation Function ---
    async function generateGoogleImage(apiKey, selectedModel, modelConfig, prompt) {
        // --- Construct API Request Body for Google Imagen ---
        const requestBody = {
            instances: [
                {
                    prompt: prompt
                }
            ],
            parameters: {
                sampleCount: parseInt(nInput.value) || 1
            }
        };
        
        // Add aspect ratio if selected
        if (aspectRatioSelect.value !== '1:1') {
            requestBody.parameters.aspectRatio = aspectRatioSelect.value;
        }
        
        // Add person generation parameter if not default
        if (personGenerationSelect.value !== 'ALLOW_ADULT') {
            requestBody.parameters.personGeneration = personGenerationSelect.value;
        }


        console.log('Sending request to Google Imagen:', JSON.stringify(requestBody, null, 2));

        // --- Make API Call ---
        const apiEndpoint = `${GOOGLE_IMAGEN_API_ENDPOINT}?key=${apiKey}`;
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Received response from Google Imagen:', data);

        if (!response.ok) {
            const errorMessage = data.error?.message || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Process the response from Google Imagen
        if (data.predictions && data.predictions.length > 0) {
            data.predictions.forEach((prediction, index) => {
                if (prediction.bytesBase64Encoded) {
                    const imgElement = document.createElement('img');
                    imgElement.alt = `Generated image ${index + 1} for: ${prompt}`;
                    imgElement.src = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
                    imageResultDiv.appendChild(imgElement);
                }
            });

            statusMessage.textContent = `Image(s) generated successfully! (${data.predictions.length} image${data.predictions.length > 1 ? 's' : ''})`;
            statusMessage.style.color = 'green';
        } else {
            throw new Error('API response did not contain image data.');
        }
    }

}); // End DOMContentLoaded
