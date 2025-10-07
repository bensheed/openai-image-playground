// AI Studio - Modular Architecture for Images and Videos
// Built with future camera roll support in mind

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = new AIStudio();
    app.init();
});

class AIStudio {
    constructor() {
        // Core modules
        this.tabManager = new TabManager();
        this.apiKeyManager = new APIKeyManager();
        this.imageGenerator = new ImageGenerator();
        this.videoGenerator = new VideoGenerator();
        this.mediaLibrary = new MediaLibrary(); // Foundation for future camera roll
        
        // Shared state
        this.currentTab = 'images';
    }

    init() {
        this.tabManager.init();
        this.apiKeyManager.init();
        this.imageGenerator.init();
        this.videoGenerator.init();
        this.mediaLibrary.init();
        
        // Set up tab switching
        this.tabManager.onTabChange((tabName) => {
            this.currentTab = tabName;
            this.handleTabChange(tabName);
        });
    }

    handleTabChange(tabName) {
        // Update provider visibility based on tab
        if (tabName === 'images') {
            this.apiKeyManager.showProviderOptions(['openai', 'google']);
        } else if (tabName === 'videos') {
            this.apiKeyManager.showProviderOptions(['openai']);
        }
    }
}

// Tab Management Module
class TabManager {
    constructor() {
        this.activeTab = 'images';
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.onTabChangeCallback = null;
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update button states
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        // Update content visibility
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        this.activeTab = tabName;
        
        if (this.onTabChangeCallback) {
            this.onTabChangeCallback(tabName);
        }
    }

    onTabChange(callback) {
        this.onTabChangeCallback = callback;
    }
}

// API Key Management Module
class APIKeyManager {
    constructor() {
        this.keys = {
            openai: null,
            google: null
        };
        
        // DOM elements
        this.openaiKeyInput = document.getElementById('openai-api-key');
        this.googleKeyInput = document.getElementById('google-api-key');
        this.saveOpenaiButton = document.getElementById('save-openai-key-button');
        this.saveGoogleButton = document.getElementById('save-google-key-button');
        this.openaiKeyStatus = document.getElementById('openai-key-status');
        this.googleKeyStatus = document.getElementById('google-key-status');
        this.openaiKeySection = document.getElementById('openai-key-section');
        this.googleKeySection = document.getElementById('google-key-section');
        
        // Constants
        this.OPENAI_KEY_NAME = 'openai_api_key';
        this.GOOGLE_KEY_NAME = 'google_api_key';
    }

    init() {
        this.loadKeys();
        this.setupEventListeners();
        this.setupTooltips();
    }

    setupEventListeners() {
        this.saveOpenaiButton.addEventListener('click', () => this.saveKey('openai'));
        this.saveGoogleButton.addEventListener('click', () => this.saveKey('google'));
    }

    setupTooltips() {
        // Tooltip functionality for API key help
        const tooltips = [
            { trigger: 'openai-key-tooltip-trigger', tooltip: 'openai-key-tooltip' },
            { trigger: 'google-key-tooltip-trigger', tooltip: 'google-key-tooltip' }
        ];

        tooltips.forEach(({ trigger, tooltip }) => {
            const triggerEl = document.getElementById(trigger);
            const tooltipEl = document.getElementById(tooltip);
            
            if (triggerEl && tooltipEl) {
                triggerEl.addEventListener('mouseenter', () => {
                    tooltipEl.style.display = 'block';
                });
                triggerEl.addEventListener('mouseleave', () => {
                    tooltipEl.style.display = 'none';
                });
            }
        });
    }

    loadKeys() {
        this.keys.openai = localStorage.getItem(this.OPENAI_KEY_NAME);
        this.keys.google = localStorage.getItem(this.GOOGLE_KEY_NAME);
        
        if (this.keys.openai) {
            this.openaiKeyInput.value = this.keys.openai;
            this.openaiKeyStatus.textContent = 'Status: Key loaded.';
            this.openaiKeyStatus.style.color = 'green';
        }
        
        if (this.keys.google) {
            this.googleKeyInput.value = this.keys.google;
            this.googleKeyStatus.textContent = 'Status: Key loaded.';
            this.googleKeyStatus.style.color = 'green';
        }
    }

    saveKey(provider) {
        const input = provider === 'openai' ? this.openaiKeyInput : this.googleKeyInput;
        const status = provider === 'openai' ? this.openaiKeyStatus : this.googleKeyStatus;
        const keyName = provider === 'openai' ? this.OPENAI_KEY_NAME : this.GOOGLE_KEY_NAME;
        
        const key = input.value.trim();
        
        if (key) {
            localStorage.setItem(keyName, key);
            this.keys[provider] = key;
            status.textContent = 'Status: Key saved successfully.';
            status.style.color = 'green';
        } else {
            localStorage.removeItem(keyName);
            this.keys[provider] = null;
            status.textContent = 'Status: Key removed.';
            status.style.color = 'orange';
        }
    }

    getKey(provider) {
        return this.keys[provider];
    }

    showProviderOptions(providers) {
        // Show/hide provider-specific key sections
        this.openaiKeySection.style.display = providers.includes('openai') ? 'block' : 'none';
        this.googleKeySection.style.display = providers.includes('google') ? 'block' : 'none';
    }
}

// Image Generation Module
class ImageGenerator {
    constructor() {
        // DOM elements
        this.providerRadios = document.querySelectorAll('input[name="provider"]');
        this.modelSelect = document.getElementById('model');
        this.promptInput = document.getElementById('prompt');
        this.sizeSelect = document.getElementById('size');
        this.qualitySelect = document.getElementById('quality');
        this.nInput = document.getElementById('n');
        this.generateButton = document.getElementById('generate-button');
        this.statusMessage = document.getElementById('status-message');
        this.imageResultDiv = document.getElementById('image-result');
        
        // Model-specific options
        this.dalle3Options = document.getElementById('dalle3-options');
        this.styleSelect = document.getElementById('style');
        this.gptImage1Options = document.querySelectorAll('.gpt-image-1-option');
        this.googleImagenOptions = document.querySelectorAll('.google-imagen-option');
        
        // Model configurations
        this.modelOptions = {
            "gpt-image-1": {
                provider: "openai",
                sizes: ["auto", "1024x1024", "1536x1024", "1024x1536"],
                qualities: ["auto", "high", "medium", "low"],
                maxN: 10,
                supportsStyle: false,
                apiEndpoint: 'https://api.openai.com/v1/images/generations'
            },
            "dall-e-3": {
                provider: "openai",
                sizes: ["1024x1024", "1792x1024", "1024x1792"],
                qualities: ["standard", "hd"],
                maxN: 1,
                supportsStyle: true,
                apiEndpoint: 'https://api.openai.com/v1/images/generations'
            },
            "dall-e-2": {
                provider: "openai",
                sizes: ["256x256", "512x512", "1024x1024"],
                qualities: ["standard"],
                maxN: 10,
                supportsStyle: false,
                apiEndpoint: 'https://api.openai.com/v1/images/generations'
            },
            "imagen-3.0-generate-002": {
                provider: "google",
                sizes: ["1:1", "3:4", "4:3", "9:16", "16:9"],
                qualities: ["standard"],
                maxN: 4,
                supportsStyle: false,
                apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict'
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        this.providerRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateProviderUI());
        });
        
        this.modelSelect.addEventListener('change', () => this.updateModelUI());
        this.generateButton.addEventListener('click', () => this.generateImage());
    }

    updateUI() {
        this.updateProviderUI();
        this.updateModelUI();
    }

    updateProviderUI() {
        const selectedProvider = document.querySelector('input[name="provider"]:checked')?.value;
        
        // Show/hide models based on provider
        Array.from(this.modelSelect.options).forEach(option => {
            const modelConfig = this.modelOptions[option.value];
            if (modelConfig) {
                option.style.display = modelConfig.provider === selectedProvider ? 'block' : 'none';
            }
        });
        
        // Select first visible model
        const firstVisibleOption = Array.from(this.modelSelect.options)
            .find(option => option.style.display !== 'none');
        if (firstVisibleOption) {
            this.modelSelect.value = firstVisibleOption.value;
        }
        
        this.updateModelUI();
    }

    updateModelUI() {
        const selectedModel = this.modelSelect.value;
        const modelConfig = this.modelOptions[selectedModel];
        
        if (!modelConfig) return;
        
        // Update size options
        this.sizeSelect.innerHTML = '';
        modelConfig.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            this.sizeSelect.appendChild(option);
        });
        
        // Update quality options
        this.qualitySelect.innerHTML = '';
        modelConfig.qualities.forEach(quality => {
            const option = document.createElement('option');
            option.value = quality;
            option.textContent = quality.charAt(0).toUpperCase() + quality.slice(1);
            this.qualitySelect.appendChild(option);
        });
        
        // Update n options
        this.nInput.innerHTML = '';
        for (let i = 1; i <= modelConfig.maxN; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            this.nInput.appendChild(option);
        }
        
        // Show/hide model-specific options
        this.dalle3Options.style.display = selectedModel === 'dall-e-3' ? 'block' : 'none';
        
        this.gptImage1Options.forEach(option => {
            option.style.display = selectedModel === 'gpt-image-1' ? 'block' : 'none';
        });
        
        this.googleImagenOptions.forEach(option => {
            option.style.display = modelConfig.provider === 'google' ? 'block' : 'none';
        });
    }

    async generateImage() {
        const selectedModel = this.modelSelect.value;
        const modelConfig = this.modelOptions[selectedModel];
        const prompt = this.promptInput.value.trim();
        
        // Get API key
        const apiKey = window.app?.apiKeyManager?.getKey(modelConfig.provider);
        
        if (!apiKey) {
            this.showStatus(`Error: ${modelConfig.provider.charAt(0).toUpperCase() + modelConfig.provider.slice(1)} API Key not found.`, 'error');
            return;
        }
        
        if (!prompt) {
            this.showStatus('Error: Please enter a prompt.', 'error');
            return;
        }
        
        this.showStatus('Generating image... Please wait.', 'loading');
        this.generateButton.disabled = true;
        this.generateButton.textContent = 'Generating...';
        this.imageResultDiv.innerHTML = '';
        
        try {
            if (modelConfig.provider === 'openai') {
                await this.generateOpenAIImage(apiKey, selectedModel, modelConfig, prompt);
            } else if (modelConfig.provider === 'google') {
                await this.generateGoogleImage(apiKey, selectedModel, modelConfig, prompt);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.generateButton.disabled = false;
            this.generateButton.textContent = 'Generate Image';
        }
    }

    async generateOpenAIImage(apiKey, model, modelConfig, prompt) {
        const requestBody = {
            model: model,
            prompt: prompt,
            n: parseInt(this.nInput.value) || 1
        };
        
        // Add model-specific parameters
        if (model === 'dall-e-3') {
            requestBody.size = this.sizeSelect.value;
            requestBody.quality = this.qualitySelect.value;
            requestBody.style = this.styleSelect.value;
        } else if (model === 'dall-e-2') {
            requestBody.size = this.sizeSelect.value;
        } else if (model === 'gpt-image-1') {
            requestBody.size = this.sizeSelect.value;
            requestBody.quality = this.qualitySelect.value;
            // Add other gpt-image-1 specific parameters
        }
        
        const response = await fetch(modelConfig.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        this.displayImages(data.data);
        this.showStatus('Image generated successfully!', 'success');
    }

    async generateGoogleImage(apiKey, model, modelConfig, prompt) {
        // Google Imagen implementation
        const requestBody = {
            prompt: prompt,
            aspectRatio: this.sizeSelect.value,
            personGeneration: document.getElementById('person_generation')?.value || 'ALLOW_ADULT'
        };
        
        const response = await fetch(`${modelConfig.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        // Process Google response format
        this.displayImages(data.candidates || []);
        this.showStatus('Image generated successfully!', 'success');
    }

    displayImages(images) {
        this.imageResultDiv.innerHTML = '';
        
        images.forEach((imageData, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = imageData.url || `data:image/png;base64,${imageData.b64_json}`;
            img.alt = `Generated image ${index + 1}`;
            img.className = 'generated-image';
            
            // Add to media library for future camera roll
            window.app?.mediaLibrary?.addMedia({
                type: 'image',
                url: img.src,
                timestamp: Date.now(),
                prompt: this.promptInput.value
            });
            
            imageContainer.appendChild(img);
            this.imageResultDiv.appendChild(imageContainer);
        });
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-${type}`;
        
        const colors = {
            loading: 'blue',
            success: 'green',
            error: 'red'
        };
        
        this.statusMessage.style.color = colors[type] || 'black';
    }
}

// Video Generation Module
class VideoGenerator {
    constructor() {
        // DOM elements
        this.videoModelSelect = document.getElementById('video-model');
        this.videoPromptInput = document.getElementById('video-prompt');
        this.videoSizeSelect = document.getElementById('video-size');
        this.videoSecondsSelect = document.getElementById('video-seconds');
        this.inputReferenceInput = document.getElementById('input-reference');
        this.generateVideoButton = document.getElementById('generate-video-button');
        this.videoStatusMessage = document.getElementById('video-status-message');
        this.videoResultDiv = document.getElementById('video-result');
        
        // Video generation state
        this.currentVideoJob = null;
        this.pollingInterval = null;
        
        // API endpoint
        this.SORA_API_ENDPOINT = 'https://api.openai.com/v1/videos';
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateVideoButton.addEventListener('click', () => this.generateVideo());
    }

    async generateVideo() {
        const prompt = this.videoPromptInput.value.trim();
        const apiKey = window.app?.apiKeyManager?.getKey('openai');
        
        if (!apiKey) {
            this.showStatus('Error: OpenAI API Key not found.', 'error');
            return;
        }
        
        if (!prompt) {
            this.showStatus('Error: Please enter a prompt.', 'error');
            return;
        }
        
        this.showStatus('Starting video generation...', 'loading');
        this.generateVideoButton.disabled = true;
        this.generateVideoButton.textContent = 'Generating...';
        this.videoResultDiv.innerHTML = '';
        
        try {
            // Create video generation job
            const jobId = await this.createVideoJob(apiKey, prompt);
            this.currentVideoJob = jobId;
            
            // Start polling for completion
            this.startPolling(apiKey, jobId);
            
        } catch (error) {
            console.error('Error generating video:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
            this.resetUI();
        }
    }

    async createVideoJob(apiKey, prompt) {
        const formData = new FormData();
        formData.append('model', this.videoModelSelect.value);
        formData.append('prompt', prompt);
        formData.append('size', this.videoSizeSelect.value);
        formData.append('seconds', this.videoSecondsSelect.value);
        
        // Add input reference if provided
        if (this.inputReferenceInput.files[0]) {
            formData.append('input_reference', this.inputReferenceInput.files[0]);
        }
        
        const response = await fetch(this.SORA_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.id;
    }

    startPolling(apiKey, jobId) {
        this.pollingInterval = setInterval(async () => {
            try {
                const status = await this.checkVideoStatus(apiKey, jobId);
                
                if (status.status === 'completed') {
                    this.handleVideoCompleted(apiKey, jobId, status);
                } else if (status.status === 'failed') {
                    this.handleVideoFailed(status);
                } else {
                    // Update progress if available
                    const progress = status.progress || 0;
                    this.showStatus(`Generating video... ${progress}% complete`, 'loading');
                    this.updateProgressBar(progress);
                }
            } catch (error) {
                console.error('Error checking video status:', error);
                this.handleVideoFailed({ error: error.message });
            }
        }, 10000); // Poll every 10 seconds
    }

    async checkVideoStatus(apiKey, jobId) {
        const response = await fetch(`${this.SORA_API_ENDPOINT}/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }

    async handleVideoCompleted(apiKey, jobId, status) {
        this.stopPolling();
        
        try {
            // Download the video
            const videoUrl = await this.downloadVideo(apiKey, jobId);
            this.displayVideo(videoUrl, status);
            this.showStatus('Video generated successfully!', 'success');
            
            // Add to media library for future camera roll
            window.app?.mediaLibrary?.addMedia({
                type: 'video',
                url: videoUrl,
                timestamp: Date.now(),
                prompt: this.videoPromptInput.value,
                duration: status.seconds,
                size: status.size,
                model: status.model
            });
            
        } catch (error) {
            console.error('Error downloading video:', error);
            this.showStatus(`Error downloading video: ${error.message}`, 'error');
        } finally {
            this.resetUI();
        }
    }

    handleVideoFailed(status) {
        this.stopPolling();
        this.showStatus(`Video generation failed: ${status.error || 'Unknown error'}`, 'error');
        this.resetUI();
    }

    async downloadVideo(apiKey, jobId) {
        const response = await fetch(`${this.SORA_API_ENDPOINT}/${jobId}/content`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    displayVideo(videoUrl, metadata) {
        this.videoResultDiv.innerHTML = '';
        
        // Create video player container
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-player-container';
        
        // Create video element
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.className = 'video-player';
        video.autoplay = false;
        
        // Create metadata display
        const metadataDiv = document.createElement('div');
        metadataDiv.className = 'video-metadata';
        metadataDiv.innerHTML = `
            <h3>Video Details</h3>
            <p><strong>Model:</strong> ${metadata.model}</p>
            <p><strong>Size:</strong> ${metadata.size}</p>
            <p><strong>Duration:</strong> ${metadata.seconds} seconds</p>
            <p><strong>Created:</strong> ${new Date(metadata.created_at * 1000).toLocaleString()}</p>
        `;
        
        // Create action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'video-actions';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Video';
        downloadBtn.onclick = () => this.downloadVideoFile(videoUrl);
        
        const thumbnailBtn = document.createElement('button');
        thumbnailBtn.textContent = 'Download Thumbnail';
        thumbnailBtn.className = 'secondary';
        thumbnailBtn.onclick = () => this.downloadThumbnail(metadata.id);
        
        actionsDiv.appendChild(downloadBtn);
        actionsDiv.appendChild(thumbnailBtn);
        
        videoContainer.appendChild(video);
        videoContainer.appendChild(metadataDiv);
        videoContainer.appendChild(actionsDiv);
        
        this.videoResultDiv.appendChild(videoContainer);
    }

    downloadVideoFile(videoUrl) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `sora-video-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async downloadThumbnail(jobId) {
        const apiKey = window.app?.apiKeyManager?.getKey('openai');
        if (!apiKey) return;
        
        try {
            const response = await fetch(`${this.SORA_API_ENDPOINT}/${jobId}/content?variant=thumbnail`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sora-thumbnail-${Date.now()}.webp`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading thumbnail:', error);
        }
    }

    updateProgressBar(progress) {
        let progressBar = this.videoResultDiv.querySelector('.progress-bar');
        
        if (!progressBar) {
            const statusDiv = document.createElement('div');
            statusDiv.className = 'generation-status';
            statusDiv.innerHTML = `
                <div class="status-spinner"></div>
                <div>
                    <p>Generating video...</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
            this.videoResultDiv.appendChild(statusDiv);
            progressBar = statusDiv.querySelector('.progress-bar');
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    resetUI() {
        this.generateVideoButton.disabled = false;
        this.generateVideoButton.textContent = 'Generate Video';
        this.currentVideoJob = null;
    }

    showStatus(message, type) {
        this.videoStatusMessage.textContent = message;
        this.videoStatusMessage.className = `status-${type}`;
        
        const colors = {
            loading: 'blue',
            success: 'green',
            error: 'red'
        };
        
        this.videoStatusMessage.style.color = colors[type] || 'black';
    }
}

// Media Library Module (Foundation for Camera Roll)
class MediaLibrary {
    constructor() {
        this.media = [];
        this.STORAGE_KEY = 'ai_studio_media_library';
    }

    init() {
        this.loadFromStorage();
    }

    addMedia(mediaItem) {
        const item = {
            id: this.generateId(),
            ...mediaItem,
            timestamp: mediaItem.timestamp || Date.now()
        };
        
        this.media.unshift(item); // Add to beginning
        this.saveToStorage();
        
        // Limit storage to prevent excessive memory usage
        if (this.media.length > 100) {
            this.media = this.media.slice(0, 100);
            this.saveToStorage();
        }
    }

    getMedia(type = null) {
        if (type) {
            return this.media.filter(item => item.type === type);
        }
        return this.media;
    }

    removeMedia(id) {
        this.media = this.media.filter(item => item.id !== id);
        this.saveToStorage();
    }

    clearAll() {
        this.media = [];
        this.saveToStorage();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.media = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading media library:', error);
            this.media = [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.media));
        } catch (error) {
            console.error('Error saving media library:', error);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Make app globally available for module communication
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AIStudio();
    window.app.init();
});