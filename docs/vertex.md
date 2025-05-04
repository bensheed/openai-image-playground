# Vertex AI Imagen API Reference (Image Generation)

This document summarizes key details for generating images using the Vertex AI Imagen API endpoint (`https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:predict`).

**Note:** This API typically requires Google Cloud authentication (gcloud, service accounts) and is distinct from the Gemini API endpoint (`generativelanguage.googleapis.com`) which uses API keys.

## Supported Models (Examples)

*   `imagen-3.0-generate-002`
*   `imagen-3.0-generate-001`
*   `imagen-3.0-fast-generate-001`
*   `imagegeneration@006`
*   `imagegeneration@005`
*   `imagegeneration@002`

*(Refer to official Vertex AI documentation for the complete and latest list)*

## Key Request Parameters (`parameters` object)

Based on the REST API reference for `imagegeneration` models (as of May 2025):

| Parameter         | Type    | Description                                                                                                                               | Supported Models (Examples)                                                                                                |
|-------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `prompt`          | string  | **Required.** Text description of the desired image. Max token length varies by model (e.g., 480 for Imagen 3, 128 for @006, 64 for @002). | All                                                                                                                        |
| `sampleCount`     | integer | **Required.** Number of images to generate (Default: 4). Max varies by model (e.g., 4 for Imagen 3 & @006, 8 for @002).                     | All                                                                                                                        |
| `negativePrompt`  | string  | Optional. A description of what to discourage in the generated images. Max token length varies by model.                                  | Most (e.g., `imagen-3.0-generate-001`, `@006`, `@005`, `@002`). *Note: Docs state `imagen-3.0-generate-002` doesn't support.* |
| `seed`            | integer | Optional. Random seed (positive integer) for reproducibility. Not usable if `addWatermark` is true.                                       | All                                                                                                                        |
| `aspectRatio`     | string  | Optional. Aspect ratio (e.g., "1:1", "16:9", "9:16", "4:3", "3:4"). Default: "1:1". Support varies by model.                               | Most (e.g., Imagen 3, @006 support all common ratios; @005 supports "1:1", "9:16"; @002 supports "1:1")                   |
| `personGeneration`| string  | Optional. Control generation of people ("dont_allow", "allow_adult", "allow_all"). Default: "allow_adult".                                | Newer models (e.g., Imagen 3, @006)                                                                                        |
| `addWatermark`    | boolean | Optional. Add SynthID watermark. Default varies (true for Imagen 3/@006, false for @005/@002). Cannot use `seed` if true.                   | All                                                                                                                        |
| `enhancePrompt`   | boolean | Optional. Use LLM to rewrite prompt for better quality. Default: true.                                                                      | `imagen-3.0-generate-002`                                                                                                  |
| `language`        | string  | Optional. Language code of the prompt (e.g., "en", "es", "ja", "auto"). Default: "auto".                                                  | Newer models (e.g., Imagen 3, @006)                                                                                        |
| `safetySetting`   | string  | Optional. Safety filter level ("block_none", "block_only_high", "block_medium_and_above", "block_low_and_above"). Default: "block_medium_and_above". | Newer models (e.g., Imagen 3, @006)                                                                                        |
| `outputOptions`   | object  | Optional. Contains `mimeType` ("image/png", "image/jpeg") and `compressionQuality` (0-100 for JPEG).                                      | All                                                                                                                        |
| `storageUri`      | string  | Optional. Cloud Storage URI to store images instead of returning base64 bytes.                                                            | All                                                                                                                        |
| `sampleImageStyle`| string  | Optional. Predefined style ("photograph", "digital_art", "sketch", etc.).                                                                 | `imagegeneration@002` only                                                                                                 |

**Note:** Parameters like `guidanceScale` and `stylePreset` (as a general list) were not explicitly listed in the REST API reference table consulted, although they might be available via SDKs or specific model versions not detailed on that page.

## Response Body (`predictions` array)

Each object in the `predictions` array typically contains:

*   `bytesBase64Encoded`: The base64 encoded image data (if not filtered and `storageUri` not used).
*   `mimeType`: The image MIME type (e.g., "image/png").
*   `raiFilteredReason`: Reason if the image was filtered by safety settings.
*   `safetyAttributes`: Scores for different safety categories (if requested).
*   `prompt`: The enhanced prompt used by the model (if `enhancePrompt` was enabled).

*(Refer to the official Vertex AI PredictResponse documentation for full details)*
