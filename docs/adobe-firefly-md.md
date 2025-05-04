# Adobe Firefly API - Image Generation (V3 Async)

This document summarizes the key aspects of Adobe Firefly's V3 Asynchronous Image Generation API.

## Overview

The Adobe Firefly Image Generation API enables you to create images using text prompts. The asynchronous version is designed for production environments and is recommended over the synchronous API.

## Base URL

```
https://firefly-api.adobe.io/v3/images
```

## Authentication

Authentication requires:
- API Key (Client ID)
- Access Token (Bearer token)

## Models Available

| Model Display Name | API Name | Description |
|---|---|---|
| Firefly Image 3 | firefly-image-3 | Latest general-purpose image generation model |
| Firefly Image 2 | firefly-image-2 | Previous generation model for general-purpose image generation |
| Generative Match | generative-match | Specialized model for brand-consistent image generation |
| Generative Expand | generative-expand | Specialized model for image expansion |
| Generative Fill | generative-fill | Specialized model for filling in parts of an image |
| Generative Remove | generative-remove | Specialized model for removing objects from images |
| Generative Recolor | generative-recolor | Specialized model for recoloring objects in images |

## Endpoint: Create Image Generation Job

```
POST /v3/images
```

### Request Body

```json
{
  "input": {
    "prompt": "string",
    "negativePrompt": "string",
    "contentClass": "string",
    "seed": integer,
    "contentTags": ["string"],
    "referenceImage": {
      "content": "base64-encoded-image",
      "transformationType": "string"
    }
  },
  "output": {
    "width": integer,
    "height": integer,
    "n": integer,
    "format": "string",
    "quality": integer,
    "seed": boolean
  },
  "model": "string",
  "engine": "string",
  "webhook": {
    "url": "string",
    "data": {}
  }
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prompt` | string | Yes | Text description of the desired image |
| `negativePrompt` | string | No | Text describing what to avoid in the generated image |
| `contentClass` | string | No | Category of the generated content (e.g., "photograph", "art") |
| `seed` | integer | No | Random seed for reproducibility (0-2147483647) |
| `contentTags` | array | No | Tags to categorize the content |
| `referenceImage.content` | string | No | Base64-encoded image for reference |
| `referenceImage.transformationType` | string | No | Type of transformation to apply |

### Output Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `width` | integer | No | Width of output image (256-8192 pixels) |
| `height` | integer | No | Height of output image (256-8192 pixels) |
| `n` | integer | No | Number of images to generate (1-4) |
| `format` | string | No | Output format ("jpeg", "png", "webp") |
| `quality` | integer | No | Image quality (0-100) |
| `seed` | boolean | No | Whether to return the seed with results |

### Other Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `model` | string | Yes | Model to use (see Models table) |
| `engine` | string | No | Engine version |
| `webhook.url` | string | No | URL for callback when job completes |
| `webhook.data` | object | No | Custom data to include in webhook |

## Endpoint: Get Job Status

```
GET /v3/images/{job_id}
```

## Endpoint: Cancel Job

```
DELETE /v3/images/{job_id}
```

## Response Format

```json
{
  "id": "string",
  "status": "string",
  "created": "ISO-8601 timestamp",
  "input": {
    "prompt": "string",
    "negativePrompt": "string",
    "contentClass": "string",
    "seed": integer,
    "contentTags": ["string"]
  },
  "output": {
    "width": integer,
    "height": integer,
    "n": integer,
    "format": "string",
    "quality": integer,
    "seed": boolean
  },
  "model": "string",
  "outputs": [
    {
      "seed": integer,
      "image": "string",
      "metadata": {}
    }
  ],
  "webhook": {
    "url": "string",
    "data": {}
  }
}
```

## Status Codes

- `202 Accepted`: Job submitted successfully
- `200 OK`: Job details retrieved successfully
- `404 Not Found`: Job not found
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Authentication failure
- `403 Forbidden`: Insufficient permissions
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Limitations

- Image dimensions: 256-8192 pixels
- Aspect ratio: Between 1:4 and 4:1
- Maximum number of images per request: 4
- Maximum prompt length: 1000 characters
- Maximum negative prompt length: 1000 characters

## Best Practices

1. Use descriptive prompts for better results
2. Specify image dimensions that match your use case
3. Set up webhooks for efficient handling of asynchronous responses
4. Consider storing generated images for reuse
5. Use seed values for reproducibility when needed
