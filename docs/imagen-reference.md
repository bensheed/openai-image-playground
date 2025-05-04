# Google Vertex AI Imagen API Reference

## Overview
Imagen is Google's text-to-image diffusion technology that generates high-quality images from text prompts. The Imagen API on Vertex AI provides programmatic access to Google's generative image models for creating and editing images based on text descriptions.

### Service Endpoints
- Base URL: `https://{LOCATION}-aiplatform.googleapis.com/`
- API Version: `v1`
- Full endpoint: `https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:predict`
- Available regions: `us-central1`, `europe-west4`, `asia-southeast1`

## Key Features
- Text-to-image generation
- Image editing and inpainting
- Image-to-image transformations
- Multiple model versions with different capabilities
- Control over image properties like dimensions and style

## Available Models

### imagen-1.0
- **API Name**: `imagegeneration@001`
- Base model for text-to-image generation
- Supports standard image generation features

### imagen-2.0
- **API Name**: `imagegeneration@002`
- Enhanced capabilities over 1.0
- Better quality and accuracy in rendering
- Improved adherence to prompts
- Support for complex compositions and contextual understanding

### imagen-3.0
- **API Name**: `imagegeneration@003`
- Latest model version with advanced features
- Superior image quality
- Better handling of detailed text descriptions
- Enhanced resolution and detail preservation

## Core Capabilities

### Text to Image
Generate images from detailed text descriptions.
```python
response = model.generate_images(
  prompt="A serene landscape with mountains reflected in a clear lake at sunset",
  sampleCount=1,
  generationMode="text-to-image"
)
```

### Image to Image
Transform existing images using text prompts.
```python
response = model.generate_images(
  prompt="Transform into a watercolor painting",
  base_image=source_image,
  generationMode="image-to-image"
)
```

### Image Editing (Inpainting)
Edit specific regions of images while preserving the rest.
```python
response = model.generate_images(
  prompt="A golden retriever puppy",
  base_image=source_image,
  mask=mask_image,
  maskPrompt="A puppy",
  generationMode="inpainting"
)
```

### Outpainting
Extend images beyond their original boundaries.
```python
response = model.generate_images(
  prompt="Extend this landscape with mountains and a sunset sky",
  base_image=source_image,
  mask=edge_mask,
  generationMode="outpainting"
)
```

### Conditional Generation
Generate images with specific conditions or constraints.
```python
response = model.generate_images(
  prompt="A red sports car on a coastal road",
  condition_image=reference_image,
  condition_scale=0.8,
  generationMode="conditional"
)
```

## Request Parameters

| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| `prompt` | Text description of desired image | string | Required |
| `negativePrompt` | Elements to exclude from generation | string | None |
| `sampleCount` | Number of images to generate | integer | 1 |
| `baseImage` | Source image for editing/transformation | file | None |
| `mask` | Specifies regions to modify | file | None |
| `maskPrompt` | Text description for masked area | string | None |
| `width` | Output image width (px) | integer | 1024 |
| `height` | Output image height (px) | integer | 1024 |
| `samples` | Number of samples to generate | integer | 1 |
| `seed` | Random seed for reproducibility | integer | Random |
| `guidanceScale` | Adherence to prompt (1-20) | float | 7.0 |
| `stylePreset` | Visual style to apply | string | None |
| `dynamicThreshold` | Enable dynamic thresholding | boolean | false |
| `noiseLevel` | Amount of noise to add (0.0-1.0) | float | 0.0 |
| `stepCount` | Number of diffusion steps | integer | 30 |
| `generationMode` | Generation mode (text-to-image, image-to-image, etc.) | string | "text-to-image" |
| `aspect_ratio` | Predefined aspect ratio (16:9, 4:3, 1:1, etc.) | string | None |
| `quality` | Output quality level (standard, premium) | string | "standard" |

## Style Presets
- `photographic`: Realistic photographic style
- `digital-art`: Digital art aesthetic
- `cinematic`: Movie-like visual quality
- `anime`: Anime/manga inspired style
- `painterly`: Traditional painting appearance
- `pixel-art`: Retro pixel art look
- `fantasy`: Fantasy art style
- `neon`: Bright neon aesthetic
- `isometric`: 3D isometric perspective
- `dystopian`: Post-apocalyptic atmosphere
- `steampunk`: Victorian sci-fi style
- `minimalist`: Clean, simple aesthetic
- `origami`: Paper-folded art style
- `watercolor`: Watercolor painting effect
- `retrowave`: 80s-inspired synthwave aesthetic
- `3d-model`: 3D rendered object appearance

## Usage Limits and Quotas
- Rate limits apply based on project tier
- Default quotas:
  - 60 requests per minute (RPM)
  - 1000 requests per day (RPD)
  - Max 5 images per request
  - Max 2048×2048 resolution (subject to model capability)
  - Max prompt length: 500 characters
  - Max response time: 30 seconds
  - Storage duration for generated images: 24 hours

## Best Practices
1. **Detailed Prompts**: Provide specific details about composition, style, lighting, and mood
2. **Negative Prompts**: Use negative prompts to avoid unwanted elements
3. **Seed Values**: Save seed values to reproduce similar results later
4. **Aspect Ratios**: Use appropriate aspect ratios for intended use cases
5. **Style Guidance**: Explicitly mention artistic styles when relevant

## Error Handling
Common error codes:
- 400: Bad request (invalid parameters)
- 403: Permission denied (insufficient permissions)
- 429: Quota exceeded
- 500: Internal server error

## Example Implementation

### Python SDK
```python
from google.cloud import aiplatform
from vertexai.preview.vision_models import Image, ImageGenerationModel

# Initialize the model
model = ImageGenerationModel.from_pretrained("imagegeneration@003")  # imagen-3.0

# Generate an image
response = model.generate_images(
    prompt="A futuristic cityscape with flying vehicles and neon lights, cyberpunk style",
    sample_count=1,
    guidance_scale=12.0,
    style_preset="digital-art",
    seed=42
)

# Save the generated image
response[0].save("generated_image.png")
```

### REST API
```python
import requests
import json
import base64
import os

PROJECT_ID = "your-project-id"
LOCATION = "us-central1"
MODEL_ID = "imagegeneration@003"
ENDPOINT = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:predict"

# Get authentication token
def get_auth_token():
    return os.popen("gcloud auth print-access-token").read().strip()

headers = {
    "Authorization": f"Bearer {get_auth_token()}",
    "Content-Type": "application/json"
}

request_body = {
    "instances": [
        {
            "prompt": "A futuristic cityscape with flying vehicles and neon lights, cyberpunk style",
            "sampleCount": 1,
            "guidanceScale": 12.0,
            "stylePreset": "digital-art",
            "seed": 42,
            "width": 1024,
            "height": 1024
        }
    ]
}

response = requests.post(ENDPOINT, headers=headers, data=json.dumps(request_body))
images = response.json()["predictions"]

# Save the image
with open("generated_image.png", "wb") as f:
    f.write(base64.b64decode(images[0]["bytesBase64Encoded"]))
```

## Security and Compliance
- Content filtering for harmful or policy-violating content
- GDPR compliant with data processing agreements available
- SOC 2 certified infrastructure
- Support for VPC Service Controls

## API Response Format

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "base64_encoded_image_data",
      "mimeType": "image/png",
      "metadata": {
        "seed": 42,
        "promptFidelity": 0.85,
        "generationTimeMs": 3245,
        "safetyRatings": {
          "adult": "NEGLIGIBLE",
          "medical": "NEGLIGIBLE",
          "violence": "NEGLIGIBLE",
          "racy": "NEGLIGIBLE",
          "dangerous": "NEGLIGIBLE"
        }
      }
    }
  ]
}
```

## Response Parameters

| Parameter | Description | Type |
|-----------|-------------|------|
| `bytesBase64Encoded` | Base64-encoded image data | string |
| `mimeType` | Image format (image/png) | string |
| `seed` | Seed used for generation | integer |
| `promptFidelity` | Score indicating adherence to prompt | float |
| `generationTimeMs` | Time taken to generate in milliseconds | integer |
| `safetyRatings` | Content safety ratings | object |

## Related Resources
- [Imagen Studio](https://cloud.google.com/vertex-ai/generative-ai/docs/imagen-studio)
- [Model Cards](https://cloud.google.com/vertex-ai/generative-ai/docs/model-cards)
- [Sample Applications](https://cloud.google.com/vertex-ai/generative-ai/docs/samples)
- [Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [API Reference](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models)
- [Quotas and Limits](https://cloud.google.com/vertex-ai/quotas)
