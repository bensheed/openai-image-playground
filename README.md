[▶️ Try it Live!](https://bensheed.github.io/openai-image-playground/)

# AI Studio

A powerful, frontend-only web application for generating both images and videos using OpenAI's latest AI models including DALL·E, GPT-Image-1, and Sora 2.

## ✨ Features

### 🖼️ Image Generation
*   **Multiple Models**: DALL·E 3, DALL·E 2, GPT-Image-1, and Google Imagen
*   **Advanced Controls**: Size, quality, style, background, moderation, and output format options
*   **Provider Support**: OpenAI and Google Imagen with easy provider switching

### 🎬 Video Generation (NEW!)
*   **Sora 2 Integration**: Support for both Sora 2 (fast) and Sora 2 Pro (high quality)
*   **Flexible Options**: Multiple video sizes, durations (3-10 seconds), and quality settings
*   **Image-to-Video**: Upload reference images to guide video generation
*   **Real-time Progress**: Live progress tracking with polling-based status updates
*   **Rich Media Player**: Built-in video player with download and thumbnail options

### 🔧 Technical Features
*   **Tabbed Interface**: Clean separation between image and video generation workflows
*   **Modular Architecture**: Built with extensible, maintainable code structure
*   **Local Storage**: API keys stored securely in browser localStorage
*   **No Backend Required**: Direct API calls to OpenAI and Google services
*   **Mobile-Friendly**: Responsive design that works on all devices
*   **Future-Ready**: Built with foundation for upcoming camera roll feature

## 🚀 Quick Start

### Setup
1.  Clone or download this repository
2.  Open `index.html` in your web browser
3.  Enter your OpenAI API key and click "Save Key" (stored locally in your browser)

### Image Generation
1.  Click the **Images** tab
2.  Select your preferred provider (OpenAI or Google)
3.  Choose a model (DALL·E 3, GPT-Image-1, etc.)
4.  Enter a descriptive text prompt
5.  Adjust size, quality, and style options
6.  Click "Generate Image" and wait for results

### Video Generation
1.  Click the **Videos** tab  
2.  Choose between Sora 2 (fast) or Sora 2 Pro (high quality)
3.  Enter a detailed video description prompt
4.  Select video size and duration
5.  Optionally upload a reference image for image-to-video generation
6.  Click "Generate Video" and monitor progress
7.  Download your video when complete

## ⚠️ Important Notes

### API Costs
*   **Image Generation**: DALL·E and GPT-Image models incur costs per generation
*   **Video Generation**: Sora 2 models are significantly more expensive than image generation
*   **Billing**: All costs are charged directly to your OpenAI account
*   **Recommendation**: Set spending limits on your OpenAI account

### Security & Privacy
*   **Local Storage**: API keys are stored only in your browser's localStorage
*   **No External Servers**: Keys are never sent to any server except OpenAI/Google APIs
*   **Browser Security**: localStorage is not encrypted - use dedicated API keys with spending limits
*   **Media Storage**: Generated content is stored locally for the camera roll feature

## 🛠️ Development

### Architecture
This project uses a modular, class-based architecture:

*   **`AIStudio`**: Main application controller
*   **`TabManager`**: Handles tab switching and UI state
*   **`APIKeyManager`**: Manages API key storage and validation
*   **`ImageGenerator`**: Handles all image generation workflows
*   **`VideoGenerator`**: Manages Sora 2 video generation with async polling
*   **`MediaLibrary`**: Foundation for future camera roll feature

### File Structure
*   `index.html`: Application structure with tabbed interface
*   `style.css`: Responsive styling with video player components
*   `script.js`: Modular JavaScript architecture
*   `README.md`: This documentation

### Future Roadmap
*   📸 **Camera Roll**: Browse and manage generated media history
*   🎨 **Advanced Editing**: In-browser media editing tools
*   🔄 **Remix Support**: Video remixing and iteration features
*   ☁️ **Cloud Sync**: Optional cloud storage integration
