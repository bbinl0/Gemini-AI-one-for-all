# 🎨 Gemini AI One for All - API Documentation

A comprehensive AI Image Platform that provides image generation, editing, analysis, and chat functionality using Gemini AI and Pollinations AI.

## 🚀 Features Overview

- **Image Generation** - Generate high-quality images using multiple AI providers
- **Image Editing** - Edit existing images with AI-powered modifications  
- **Image Analysis** - Analyze and describe images with detailed AI insights
- **Chat Interface** - Conversational AI with multi-modal support (text + images)
- **Multiple Providers** - Support for Pollinations AI (free) and Gemini AI
- **Responsive Design** - Works on desktop and mobile devices

## 📋 Table of Contents

- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Frontend Interface](#frontend-interface)
- [Environment Variables](#environment-variables)
- [AI Models & Providers](#ai-models--providers)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## 🔧 Installation & Setup

### Prerequisites
- Python 3.11+
- Flask 2.3.0+
- Required dependencies (see requirements.txt)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-image-platform
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**
   ```bash
   export GEMINI_API_KEY="your_gemini_api_key_here"
   export SECRET_KEY="your_secret_key_here"  # Optional
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   - Main Interface: http://localhost:5000/
   - Advanced Chat: http://localhost:5000/chat

## 🌐 API Endpoints

### Health Check
**GET** `/api/health`

Returns the status of all AI services and their availability.

**Response:**
```json
{
  "status": "healthy",
  "message": "AI Image Platform Demo API is running",
  "services": {
    "pollinations": {
      "status": "healthy",
      "message": "Free image generation service"
    },
    "gemini": {
      "status": "healthy|unavailable",
      "message": "Requires GEMINI_API_KEY environment variable"
    }
  }
}
```

### Image Generation
**POST** `/api/generate`

Generate images using AI providers.

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "style": "photorealistic",
  "provider": "pollinations",
  "aspect_ratio": "16:9"
}
```

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `style` (optional): Art style for the image
  - `photorealistic`, `cartoon`, `abstract`, `impressionistic`, `cyberpunk`, `anime`, `oil_painting`, `watercolor`, `sketch`, `digital_art`
- `provider` (optional): AI provider to use
  - `pollinations` (default, free)
  - `gemini` (requires API key)
- `aspect_ratio` (optional): Image dimensions
  - `1:1` (1024x1024) - default
  - `16:9` (1152x648)
  - `9:16` (648x1152)
  - `4:3` (1024x768)
  - `3:4` (768x1024)

**Response:**
```json
{
  "status": "success",
  "image_base64": "base64_encoded_image_data",
  "provider": "pollinations",
  "prompt": "A beautiful sunset over mountains"
}
```

### Image Editing
**POST** `/api/edit`

Edit existing images with AI-powered modifications.

**Request Body:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "edit_prompt": "Change the color of the car to red",
  "style": "photorealistic",
  "aspect_ratio": "1:1"
}
```

**Parameters:**
- `image` (required): Base64 encoded image data
- `edit_prompt` (required): Description of the desired changes
- `style` (optional): Art style for the edited image
- `aspect_ratio` (optional): Output image aspect ratio

**Response:**
```json
{
  "status": "success",
  "image_base64": "base64_encoded_edited_image",
  "message": "Image edited successfully using Gemini AI"
}
```

### Image Analysis
**POST** `/api/analyze`

Analyze images and get detailed descriptions.

**Request Body (Base64):**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Request Body (URL):**
```json
{
  "image_url": "https://example.com/image.jpg"
}
```

**Parameters:**
- `image` (optional): Base64 encoded image data
- `image_url` (optional): Direct URL to the image
- One of `image` or `image_url` is required

**Response:**
```json
{
  "status": "success",
  "analysis": "This image shows a beautiful landscape with mountains in the background, a clear blue sky, and a winding river in the foreground. The scene appears to be taken during golden hour with warm lighting..."
}
```

### Chat with AI
**POST** `/api/chat`

Engage in conversational AI with text-only input.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "model": "gemini-2.0-flash",
  "history": [
    {
      "role": "user",
      "parts": [{"text": "Previous message"}]
    },
    {
      "role": "model", 
      "parts": [{"text": "Previous response"}]
    }
  ]
}
```

**Parameters:**
- `message` (required): User's text message
- `model` (optional): Gemini model to use
  - `gemini-2.0-flash` (default)
  - `gemini-2.5-flash`
  - `gemini-2.5-flash-lite`
  - `gemini-1.5-flash`
  - `gemini-2.5-pro`
- `history` (optional): Previous conversation context

**Response:**
```json
{
  "status": "success",
  "answer": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "model_used": "gemini-2.0-flash"
}
```

### Chat with Image
**POST** `/api/chat-with-image`

Multi-modal chat supporting both text and image inputs.

**Request (Form Data):**
- `message`: Text message (optional if image provided)
- `model`: Gemini model to use (optional)
- `history`: JSON string of conversation history (optional)
- `image`: Image file upload (optional)

**Response:**
```json
{
  "status": "success",
  "answer": "I can see this is an image of a cat sitting on a windowsill. The cat appears to be orange and white, and it's looking outside...",
  "model_used": "gemini-2.5-flash"
}
```

## 🖥️ Frontend Interface

### Main Interface (`/`)

The main interface provides a tabbed layout with the following sections:

#### 🎨 Generate Images Tab
- **Image Description**: Textarea for entering the image prompt
- **AI Provider**: Dropdown to select between Pollinations AI and Gemini AI
- **Art Style**: Dropdown with 10 different art styles
- **Aspect Ratio**: Dropdown with 5 different aspect ratios
- **Generate Button**: Triggers image generation

#### ✏️ Edit Images Tab  
- **File Upload**: Input to upload images for editing
- **Edit Instructions**: Textarea for describing desired changes
- **Edit Strength**: Dropdown with 4 intensity levels (Light, Medium, Strong, Very Strong)
- **Edit Button**: Triggers image editing

#### 🔍 Analyze Images Tab
- **Analysis Method**: Toggle between file upload and URL input
- **File Upload/URL Input**: Based on selected method
- **Extract Masks**: Checkbox for object mask extraction
- **Analyze Button**: Triggers image analysis

#### 💬 Chat Tab
- **Model Selection**: Dropdown for Gemini model selection
- **Chat Container**: Scrollable chat history display
- **Image Upload**: Optional file input for multi-modal chat
- **Message Input**: Textarea for typing messages
- **Send Button**: Submits the chat message

### Advanced Chat Interface (`/chat`)

A dedicated chat interface with enhanced features:

#### Header Components
- **Theme Toggle**: Switch between light and dark modes
- **Model Selector**: Dropdown showing available Gemini models
- **Home Button**: Navigation back to main interface

#### Chat Features
- **Real-time Chat**: Instant messaging with AI
- **Image Upload**: Multi-modal conversations
- **Message History**: Persistent chat storage
- **Code Highlighting**: Syntax highlighting for code blocks
- **Copy Functionality**: Copy code blocks with one click
- **Markdown Support**: Rich text formatting

#### Available Gemini Models
- **Gemini 2.0 Flash**: Default, balanced performance
- **Gemini 2.5 Flash**: Enhanced capabilities
- **Gemini 2.5 Flash Lite**: Fastest response times
- **Gemini 1.5 Flash**: Legacy fast model
- **Gemini 2.5 Pro**: Most capable model

## 🔑 Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | No* | Google Gemini API key for AI features | None |
| `SECRET_KEY` | No | Flask secret key for sessions | `demo-secret-key-2024` |

*Required for Gemini AI features (image editing, analysis, advanced chat)

## 🤖 AI Models & Providers

### Pollinations AI (Free)
- **Model**: `flux-pro`
- **Features**: High-quality image generation
- **Cost**: Free
- **Limitations**: Image generation only
- **Supported Formats**: PNG, JPEG

### Gemini AI (API Key Required)
- **Models**: Multiple Gemini variants
- **Features**: Image generation, editing, analysis, chat
- **Cost**: Paid API (Google Cloud)
- **Capabilities**: 
  - Multi-modal understanding
  - Image-to-image editing
  - Detailed image analysis
  - Conversational AI

## 📊 Response Formats

### Success Response
```json
{
  "status": "success",
  "data": "...",
  "additional_fields": "..."
}
```

### Error Response
```json
{
  "status": "error",
  "error": "Error description message"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (missing parameters, invalid input)
- `500`: Internal Server Error
- `503`: Service Unavailable (AI provider unavailable)

## ⚠️ Error Handling

### Common Error Messages

#### Authentication Errors
- `"Gemini service unavailable - GEMINI_API_KEY required"`
- `"Image analysis unavailable - GEMINI_API_KEY required"`

#### Input Validation Errors
- `"Prompt is required"`
- `"Message is required"`
- `"Image data and edit prompt are required"`
- `"Either image data or image URL is required"`

#### Service Errors
- `"Pollinations service unavailable"`
- `"Chat service error: [details]"`
- `"Image editing service error: [details]"`

#### File Handling Errors
- `"Could not fetch image from URL"`
- `"No valid image provided"`

## 💡 Usage Examples

### Generate an Image with Pollinations AI
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city at sunset with flying cars",
    "style": "cyberpunk",
    "provider": "pollinations",
    "aspect_ratio": "16:9"
  }'
```

### Edit an Image
```bash
curl -X POST http://localhost:5000/api/edit \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "edit_prompt": "Add a rainbow in the sky",
    "style": "photorealistic"
  }'
```

### Analyze an Image via URL
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/sample-image.jpg"
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in simple terms",
    "model": "gemini-2.5-pro"
  }'
```

### Multi-modal Chat with Image
```bash
curl -X POST http://localhost:5000/api/chat-with-image \
  -F "message=What do you see in this image?" \
  -F "model=gemini-2.5-flash" \
  -F "image=@path/to/your/image.jpg"
```

## 🎨 Supported Art Styles

1. **Photorealistic** 📷 - Realistic, photo-like quality
2. **Cartoon** 🎭 - Animated, cartoon-style artwork
3. **Abstract** 🎨 - Non-representational, artistic interpretation
4. **Impressionistic** 🖼️ - Painterly, impressionist style
5. **Cyberpunk** 🌃 - Futuristic, neon-lit aesthetic
6. **Anime** 👾 - Japanese animation style
7. **Oil Painting** 🎨 - Traditional oil painting texture
8. **Watercolor** 💧 - Soft, watercolor painting effect
9. **Sketch** ✏️ - Hand-drawn, sketchy appearance
10. **Digital Art** 💻 - Modern digital artwork style

## 📱 Aspect Ratios

| Ratio | Dimensions | Use Case |
|-------|------------|----------|
| `1:1` | 1024×1024 | Square, social media |
| `16:9` | 1152×648 | Landscape, widescreen |
| `9:16` | 648×1152 | Portrait, mobile vertical |
| `4:3` | 1024×768 | Standard landscape |
| `3:4` | 768×1024 | Standard portrait |

## 🚀 Deployment

### Development
```bash
python app.py
# Runs on http://0.0.0.0:5000
```

### Production (Gunicorn)
```bash
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

### Vercel Deployment
The application includes `vercel.json` configuration for serverless deployment on Vercel platform.

## 📝 License

This project is part of the Gemini AI One for All platform demo.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and support, please check the Flask application logs and ensure all environment variables are properly configured.

---

**Built with ❤️ using Flask, Gemini AI, and Pollinations AI**
