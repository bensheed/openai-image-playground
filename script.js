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
    const nDescription = document.getElementById('n-description');
    const imageResultDiv = document.getElementById('image-result');
    const galleryDiv = document.getElementById('gallery');
    const downloadCurrentButton = document.getElementById('download-current-button');
    const downloadAllButton = document.getElementById('download-all-button');
    const exportGalleryButton = document.getElementById('export-gallery-button');
    const clearGalleryButton = document.getElementById('clear-gallery-button');

    // Model Specific Option Containers & Controls
    const dalle3OptionsDiv = document.getElementById('dalle3-options');
    const styleSelect = document.getElementById('style');

    // GPT-Image-1 Specific Options
    const gptImage1Options = document.querySelectorAll('.gpt-image-1-option');
    const backgroundSelect = document.getElementById('background');
    const moderationSelect = document.getElementById('moderation');
    const outputFormatSelect = document.getElementById('output_format');
    const outputCompressionInput = document.getElementById('output_compression');
    
    // Legacy Google image options; hidden for the free SVG mode.
    const googleImagenOptions = document.querySelectorAll('.google-imagen-option');
    const aspectRatioSelect = document.getElementById('aspect_ratio');
    const personGenerationSelect = document.getElementById('person_generation');



    // API Constants
    const OPENAI_API_KEY_NAME = 'openai_api_key';
    const GOOGLE_API_KEY_NAME = 'google_api_key';
    const GALLERY_KEY_NAME = 'ai_image_gallery';
    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
    const GOOGLE_GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

    let generatedImageGallery = JSON.parse(localStorage.getItem(GALLERY_KEY_NAME) || '[]');

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
        
        // Free Google Gemini mode: Gemini creates an SVG illustration as text.
        "gemini-3.5-flash-lite (Free SVG)": {
            provider: "google", // Corresponds to the Google free-tier radio button
            sizes: [],
            qualities: [], // Not applicable
            maxN: 1,
            supportsStyle: false,
            supportsBackground: false,
            supportsModeration: false,
            supportsOutputFormat: false,
            supportsOutputCompression: false,
            supportsAspectRatio: false,
            supportsPersonGeneration: false,
            responseFormat: 'svg',
            apiEndpoint: GOOGLE_GEMINI_API_ENDPOINT
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
        
        // The free SVG mode does not use Imagen-only controls.
        googleImagenOptions.forEach(el => {
            el.style.display = isGoogleModel && options.supportsAspectRatio ? 'block' : 'none';
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

        // Update N description
        if (nDescription) {
            let descriptionText = `How many images to generate (1-${options.maxN}).`;
            if (selectedModel === 'dall-e-3') {
                descriptionText += " DALL-E 3 only supports 1.";
            } else if (options.provider === 'google') {
                descriptionText += ' Free Google mode returns one SVG illustration.';
            } else if (selectedModel === 'gpt-image-1') {
                 descriptionText += ` Max ${options.maxN}.`;
            } else if (selectedModel === 'dall-e-2') {
                 descriptionText += ` Max ${options.maxN}.`;
            }
            nDescription.textContent = descriptionText;
        }

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
    renderGallery();

    // Initialize the playground in the free Google mode.
    updateProviderUI('google');
    updateOptionsUI(modelSelect.value);

    function saveGallery() {
        localStorage.setItem(GALLERY_KEY_NAME, JSON.stringify(generatedImageGallery));
    }

    function renderGallery() {
        galleryDiv.innerHTML = '';

        if (!generatedImageGallery.length) {
            galleryDiv.innerHTML = '<p class="empty-state">No saved images yet. Generate an image to start your gallery.</p>';
            return;
        }

        generatedImageGallery.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.prompt || 'Saved generated image';

            const info = document.createElement('div');
            info.className = 'gallery-card-info';

            const promptText = document.createElement('p');
            promptText.textContent = item.prompt ? item.prompt.slice(0, 60) + (item.prompt.length > 60 ? '...' : '') : 'Untitled generation';

            const actions = document.createElement('div');
            actions.className = 'gallery-actions';

            const downloadButton = document.createElement('button');
            downloadButton.type = 'button';
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', () => downloadImage(item.src, `generated-${item.id}.png`));

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => applySimpleEdit(item.id));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.classList.add('secondary-button');
            removeButton.addEventListener('click', () => {
                generatedImageGallery = generatedImageGallery.filter((galleryItem) => galleryItem.id !== item.id);
                saveGallery();
                renderGallery();
            });

            actions.appendChild(downloadButton);
            actions.appendChild(editButton);
            actions.appendChild(removeButton);
            info.appendChild(promptText);
            info.appendChild(actions);
            card.appendChild(image);
            card.appendChild(info);
            galleryDiv.appendChild(card);
        });
    }

    function downloadImage(src, filename = 'ai-image.png') {
        const anchor = document.createElement('a');
        anchor.href = src;
        anchor.download = filename;
        anchor.target = '_blank';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    function downloadCurrentImage() {
        const currentImage = imageResultDiv.querySelector('img');
        if (!currentImage) {
            statusMessage.textContent = 'No generated image available to download.';
            statusMessage.style.color = 'orange';
            return;
        }

        downloadImage(currentImage.src, 'current-generated-image.png');
        statusMessage.textContent = 'Current image download started.';
        statusMessage.style.color = 'green';
    }

    function downloadAllGeneratedImages() {
        const images = [...imageResultDiv.querySelectorAll('img')];

        if (!images.length) {
            statusMessage.textContent = 'No generated images currently available to download.';
            statusMessage.style.color = 'orange';
            return;
        }

        images.forEach((image, index) => {
            setTimeout(() => {
                downloadImage(image.src, `generated-image-${index + 1}.png`);
            }, index * 250);
        });

        statusMessage.textContent = 'Download started for all generated images.';
        statusMessage.style.color = 'green';
    }

    function exportGallery() {
        if (!generatedImageGallery.length) {
            statusMessage.textContent = 'Your gallery is empty. Nothing to export yet.';
            statusMessage.style.color = 'orange';
            return;
        }

        const jsonBlob = new Blob([JSON.stringify(generatedImageGallery, null, 2)], { type: 'application/json' });
        const objectUrl = URL.createObjectURL(jsonBlob);
        downloadImage(objectUrl, 'image-gallery-export.json');
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

        statusMessage.textContent = 'Gallery metadata exported successfully.';
        statusMessage.style.color = 'green';
    }

    function clearGallery() {
        generatedImageGallery = [];
        saveGallery();
        renderGallery();
        statusMessage.textContent = 'Gallery cleared.';
        statusMessage.style.color = 'green';
    }

    function applySimpleEdit(itemId) {
        const targetItem = generatedImageGallery.find((item) => item.id === itemId);
        if (!targetItem) {
            return;
        }

        const image = new Image();
        // Data URLs are local and can fail to load when crossOrigin is set.
        if (/^https?:\/\//i.test(targetItem.src)) {
            image.crossOrigin = 'anonymous';
        }

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = image.width;
            canvas.height = image.height;
            context.filter = 'brightness(1.12) contrast(1.2) saturate(1.2)';
            context.drawImage(image, 0, 0);

            const editedImageData = canvas.toDataURL('image/png');
            targetItem.src = editedImageData;
            targetItem.edited = true;
            saveGallery();
            renderGallery();

            statusMessage.textContent = 'Basic enhancement applied to the selected gallery image.';
            statusMessage.style.color = 'green';
        };

        image.onerror = () => {
            statusMessage.textContent = 'This image could not be edited in the browser.';
            statusMessage.style.color = 'red';
        };

        image.src = targetItem.src;
    }

    downloadCurrentButton.addEventListener('click', downloadCurrentImage);
    downloadAllButton.addEventListener('click', downloadAllGeneratedImages);
    exportGalleryButton.addEventListener('click', exportGallery);
    clearGalleryButton.addEventListener('click', clearGallery);

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
                await generateGoogleFreeSvg(apiKey, selectedModel, modelConfig, prompt);
            }
        } catch (error) {
            console.error(`Error generating image with ${selectedProvider}:`, error);
            let displayErrorMessage = `Error: ${error.message}`;
            
            // Provider-specific error handling
            if (selectedProvider === 'openai' && (error.message.includes('Error in request') || error.message.includes('check your input') || error.message.includes('400'))) {
                displayErrorMessage += '\n\n(This might be due to insufficient credits or account limits. Check your balance: https://platform.openai.com/settings/organization/billing/overview)';
            } else if (selectedProvider === 'google') {
                displayErrorMessage += '\n\n(Make sure your Google API key has access to the Gemini API free tier and check your quota limits)';
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
            const items = [];

            data.data.forEach((item, index) => {
                const imgElement = document.createElement('img');
                imgElement.alt = `Generated image ${index + 1} for: ${prompt}`;

                let imageSource = '';
                if (modelConfig.responseFormat === 'url' && item.url) {
                    imageSource = item.url;
                } else if (modelConfig.responseFormat === 'b64_json' && item.b64_json) {
                    const imageType = requestBody.output_format || 'png';
                    imageSource = `data:image/${imageType};base64,${item.b64_json}`;
                }

                if (!imageSource) {
                    console.warn(`Item ${index} in response did not contain expected data format (${modelConfig.responseFormat})`);
                    return;
                }

                imgElement.src = imageSource;
                imageResultDiv.appendChild(imgElement);
                items.push({
                    id: Date.now() + Math.random() + index,
                    src: imageSource,
                    prompt: prompt,
                    provider: selectedModel.startsWith('dall') || selectedModel === 'gpt-image-1' ? 'openai' : 'google',
                    model: selectedModel,
                    createdAt: new Date().toISOString()
                });
            });

            items.forEach((item) => {
                generatedImageGallery.unshift(item);
            });

            if (generatedImageGallery.length > 20) {
                generatedImageGallery = generatedImageGallery.slice(0, 20);
            }
            saveGallery();
            renderGallery();

            statusMessage.textContent = `Image(s) generated successfully! (${data.data.length} image${data.data.length > 1 ? 's' : ''})`;
            statusMessage.style.color = 'green';
        } else {
             throw new Error('API response did not contain image data.');
        }
    }
    
    // --- Free Google image-like generation using an SVG returned by Gemini ---
    async function generateGoogleFreeSvg(apiKey, selectedModel, modelConfig, prompt) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: `Create one polished SVG illustration based on this request: ${prompt}.\n\nReturn only valid, self-contained SVG markup. Do not use markdown fences, HTML, scripts, external images, or external fonts. Use a viewBox, a tasteful color palette, and enough detail to make the result visually useful. The SVG must begin with <svg and end with </svg>.`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
                responseMimeType: 'text/plain'
            }
        };

        console.log('Sending request to free Google Gemini:', JSON.stringify(requestBody, null, 2));

        // --- Make API Call ---
        const apiEndpoint = `${GOOGLE_GEMINI_API_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Received response from free Google Gemini:', data);

        if (!response.ok) {
            const errorMessage = data.error?.message || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const responseText = (data.candidates || [])
            .flatMap(candidate => candidate.content?.parts || [])
            .map(part => part.text || '')
            .join('\n')
            .trim();
        const svgStart = responseText.indexOf('<svg');
        const svgEnd = responseText.lastIndexOf('</svg>');
        const selfClosingSvgEnd = responseText.indexOf('/>', svgStart);
        const hasCompleteSvg = svgStart !== -1 && svgEnd !== -1;
        const hasSelfClosingSvg = svgStart !== -1 && selfClosingSvgEnd !== -1 && (!hasCompleteSvg || selfClosingSvgEnd < svgEnd);
        let svg = hasCompleteSvg
            ? responseText.slice(svgStart, svgEnd + '</svg>'.length)
            : hasSelfClosingSvg
                ? responseText.slice(svgStart, selfClosingSvgEnd + 2)
                : '';

        let svgDocument = new DOMParser().parseFromString(svg, 'image/svg+xml');
        if (svgDocument.querySelector('parsererror')) {
            // Gemini sometimes emits a bare ampersand in SVG text or URLs.
            const repairedSvg = svg.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;');
            svgDocument = new DOMParser().parseFromString(repairedSvg, 'image/svg+xml');
        }

        const svgRoot = svgDocument.documentElement;
        let usedFallback = false;
        if (!svgRoot || svgRoot.nodeName !== 'svg' || svgDocument.querySelector('parsererror')) {
            const safePrompt = prompt.slice(0, 180).replace(/[&<>"']/g, (character) => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
            }[character]));
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs><linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#fef3c7"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#background)"/><circle cx="512" cy="420" r="190" fill="#ffffff" opacity="0.75"/><path d="M180 820 Q512 560 844 820" fill="none" stroke="#334155" stroke-width="28" stroke-linecap="round"/><text x="512" y="930" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#334155">${safePrompt}</text></svg>`;
            usedFallback = true;
        } else {
            svgRoot.setAttribute('width', svgRoot.getAttribute('width') || '1024');
            svgRoot.setAttribute('height', svgRoot.getAttribute('height') || '1024');
            svgRoot.setAttribute('viewBox', svgRoot.getAttribute('viewBox') || '0 0 1024 1024');
            svgDocument.querySelectorAll('script, foreignObject, iframe, object, embed').forEach((element) => element.remove());

            const background = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'rect');
            background.setAttribute('width', '100%');
            background.setAttribute('height', '100%');
            background.setAttribute('fill', '#f3f6fb');
            svgRoot.insertBefore(background, svgRoot.firstChild);
            svg = new XMLSerializer().serializeToString(svgRoot);
        }
        const imageSource = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        const imgElement = document.createElement('img');
        imgElement.alt = `Generated illustration for: ${prompt}`;
        imgElement.src = imageSource;
        imageResultDiv.appendChild(imgElement);

        generatedImageGallery.unshift({
            id: Date.now() + Math.random(),
            src: imageSource,
            prompt: prompt,
            provider: 'google',
            model: selectedModel,
            createdAt: new Date().toISOString()
        });
        if (generatedImageGallery.length > 20) {
            generatedImageGallery = generatedImageGallery.slice(0, 20);
        }
        saveGallery();
        renderGallery();

        statusMessage.textContent = usedFallback
            ? 'Google returned invalid SVG, so a local fallback illustration was created.'
            : 'Free Google SVG illustration generated successfully!';
        statusMessage.style.color = 'green';
    }

}); // End DOMContentLoaded
