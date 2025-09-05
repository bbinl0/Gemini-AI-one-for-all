"""
Simple AI Image Platform Demo
============================

A serverless Flask application using the ai-image-platform library.
Designed for Vercel deployment with serverless functions.
"""

import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from gemini_all_for_one import (
    GeminiChatClient, 
    PollinationsClient, 
    ImageAnalyzer,
    ImageGenerator,
    ImageEditor
)
# Simple Gemini functionality
import google.genai as genai

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'demo-secret-key-2024')

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Initialize AI clients
try:
    pollinations_client = PollinationsClient()
    print("✅ Pollinations client initialized")
except Exception as e:
    print(f"❌ Pollinations client error: {e}")
    pollinations_client = None

# Simple Gemini client using direct API
gemini_client = None

if os.environ.get('GEMINI_API_KEY'):
    try:
        gemini_client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))
        print("✅ Direct Gemini client initialized")
    except Exception as e:
        print(f"❌ Direct Gemini client error: {e}")
else:
    print("⚠️ GEMINI_API_KEY not set - Gemini features disabled")

@app.route('/')
def home():
    """Home page with simple interface."""
    return render_template('index.html')

@app.route('/chat')
def chat_interface():
    """Advanced chat interface."""
    return render_template('chat.html')

@app.route('/api/health')
def health():
    """Health check endpoint."""
    status = {
        "status": "healthy",
        "message": "AI Image Platform Demo API is running",
        "services": {
            "pollinations": {
                "status": "healthy" if pollinations_client else "unavailable",
                "message": "Free image generation service"
            },
            "gemini": {
                "status": "healthy" if gemini_client else "unavailable",
                "message": "Requires GEMINI_API_KEY environment variable"
            }
        }
    }
    return jsonify(status)

@app.route('/api/generate', methods=['POST'])
def generate_image():
    """Generate image using Pollinations AI."""
    try:
        data = request.get_json()
        
        if not pollinations_client:
            return jsonify({
                "status": "error",
                "error": "Pollinations service unavailable"
            }), 503
        
        prompt = data.get('prompt', '')
        style = data.get('style', 'photorealistic')
        
        if not prompt:
            return jsonify({
                "status": "error", 
                "error": "Prompt is required"
            }), 400
        
        # Handle provider and aspect ratio
        provider = data.get('provider', 'pollinations')
        aspect_ratio = data.get('aspect_ratio', '1:1')
        
        # Convert aspect ratio to dimensions
        ratio_map = {
            '1:1': (1024, 1024),
            '16:9': (1152, 648),
            '9:16': (648, 1152),
            '4:3': (1024, 768),
            '3:4': (768, 1024)
        }
        width, height = ratio_map.get(aspect_ratio, (1024, 1024))
        
        if provider == 'pollinations' and pollinations_client:
            # Use Pollinations for image generation
            result = pollinations_client.generate_image(
                prompt=prompt,
                model="flux-pro",
                width=width,
                height=height
            )
        elif provider == 'gemini' and gemini_client:
            # Use Gemini for image generation
            try:
                generator = ImageGenerator()
                result = generator.generate_image(
                    prompt_text=prompt,
                    style=style,
                    aspect_ratio=aspect_ratio
                )
            except Exception as e:
                return jsonify({
                    "status": "error",
                    "error": f"Gemini image generation failed: {str(e)}"
                }), 500
        else:
            return jsonify({
                "status": "error",
                "error": f"{provider} service unavailable"
            }), 503
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Enhanced chat with Gemini AI with history support."""
    try:
        data = request.get_json()
        
        if not gemini_client:
            return jsonify({
                "status": "error",
                "error": "Gemini service unavailable - GEMINI_API_KEY required"
            }), 503
        
        message = data.get('message', '')
        model = data.get('model', 'gemini-2.0-flash')
        history = data.get('history', [])
        
        if not message:
            return jsonify({
                "status": "error",
                "error": "Message is required"  
            }), 400
        
        # Enhanced chat with Gemini using history
        try:
            # Build conversation history for context
            contents = []
            
            # Add previous conversation history if available
            for entry in history[-10:]:  # Keep last 10 messages for context
                if entry.get('role') == 'user':
                    for part in entry.get('parts', []):
                        if 'text' in part:
                            contents.append(f"User: {part['text']}")
                elif entry.get('role') == 'model':
                    for part in entry.get('parts', []):
                        if 'text' in part:
                            contents.append(f"Assistant: {part['text']}")
            
            # Add current message
            contents.append(f"User: {message}")
            
            # Join all contents for context
            full_conversation = "\n".join(contents[-20:])  # Limit context
            
            response = gemini_client.models.generate_content(
                model=model,
                contents=[full_conversation]
            )
            
            if response and response.text:
                result = {
                    'status': 'success',
                    'answer': response.text,
                    'model_used': model
                }
            else:
                result = {
                    'status': 'error',
                    'error': 'No response from AI'
                }
        except Exception as e:
            result = {
                'status': 'error',
                'error': f'Chat failed: {str(e)}'
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error", 
            "error": str(e)
        }), 500

@app.route('/api/chat-with-image', methods=['POST'])
def chat_with_image():
    """Chat with Gemini AI including image support."""
    try:
        if not gemini_client:
            return jsonify({
                "status": "error",
                "error": "Gemini service unavailable - GEMINI_API_KEY required"
            }), 503
        
        message = request.form.get('message', '')
        model = request.form.get('model', 'gemini-2.0-flash')
        history = request.form.get('history', '[]')
        
        try:
            history = eval(history) if history else []
        except:
            history = []
        
        image_file = request.files.get('image')
        
        if not message and not image_file:
            return jsonify({
                "status": "error",
                "error": "Message or image is required"
            }), 400
        
        # Multimodal chat with Gemini
        try:
            contents = []
            
            # Add conversation context
            for entry in history[-5:]:  # Keep last 5 messages for context
                if entry.get('role') == 'user':
                    for part in entry.get('parts', []):
                        if 'text' in part:
                            contents.append(f"User: {part['text']}")
                elif entry.get('role') == 'model':
                    for part in entry.get('parts', []):
                        if 'text' in part:
                            contents.append(f"Assistant: {part['text']}")
            
            # Add current message and image
            if message:
                contents.append(f"User: {message}")
            
            # Process image if provided
            if image_file:
                from PIL import Image
                import io
                
                # Read and process the image
                image_bytes = image_file.read()
                pil_image = Image.open(io.BytesIO(image_bytes))
                
                # Convert to appropriate format if needed
                if pil_image.mode != 'RGB':
                    pil_image = pil_image.convert('RGB')
                
                # Use Gemini with image
                response = gemini_client.models.generate_content(
                    model='gemini-2.5-flash',  # Use model that supports images
                    contents=["\n".join(contents), pil_image]
                )
            else:
                # Text-only conversation
                response = gemini_client.models.generate_content(
                    model=model,
                    contents=["\n".join(contents)]
                )
            
            if response and response.text:
                result = {
                    'status': 'success',
                    'answer': response.text,
                    'model_used': model
                }
            else:
                result = {
                    'status': 'error',
                    'error': 'No response from AI'
                }
                
        except Exception as e:
            result = {
                'status': 'error',
                'error': f'Multimodal chat failed: {str(e)}'
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """Analyze image using Gemini AI."""
    try:
        data = request.get_json()
        
        if not gemini_client:
            return jsonify({
                "status": "error",
                "error": "Image analysis unavailable - GEMINI_API_KEY required"
            }), 503
        
        image_data = data.get('image')  # base64 encoded
        image_url = data.get('image_url')  # URL option
        
        if not image_data and not image_url:
            return jsonify({
                "status": "error",
                "error": "Either image data or image URL is required"
            }), 400
        
        # Simple direct image analysis with Gemini
        try:
            from PIL import Image
            import io
            import base64
            
            if image_data:
                # Handle base64 image data
                if image_data.startswith('data:image'):
                    image_data = image_data.split(',')[1]
                
                image_bytes = base64.b64decode(image_data)
                pil_image = Image.open(io.BytesIO(image_bytes))
                
            elif image_url:
                # Handle URL
                import requests
                response = requests.get(image_url)
                if response.status_code != 200:
                    return jsonify({
                        "status": "error",
                        "error": "Could not fetch image from URL"
                    }), 400
                pil_image = Image.open(io.BytesIO(response.content))
            else:
                return jsonify({
                    "status": "error",
                    "error": "No valid image provided"
                }), 400
            
            # Analyze with Gemini
            prompt = "What is this image? Provide a detailed description including objects, people, scenes, colors, and any notable details."
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt, pil_image]
            )
            
            if response and response.text:
                result = {
                    'status': 'success',
                    'analysis': response.text
                }
            else:
                result = {
                    'status': 'error',
                    'error': 'No analysis result received'
                }
                
        except Exception as e:
            result = {
                'status': 'error',
                'error': f'Analysis failed: {str(e)}'
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e) 
        }), 500

@app.route('/api/edit', methods=['POST'])
def edit_image():
    """Edit image using Gemini AI."""
    try:
        data = request.get_json()
        
        if not gemini_client:
            return jsonify({
                "status": "error",
                "error": "Image editing unavailable - GEMINI_API_KEY required"
            }), 503
        
        image_data = data.get('image')  # base64 encoded
        edit_prompt = data.get('edit_prompt', '')
        style = data.get('style', 'photorealistic')
        
        if not image_data or not edit_prompt:
            return jsonify({
                "status": "error",
                "error": "Image data and edit prompt are required"
            }), 400
        
        # Convert base64 to bytes
        import base64
        if image_data.startswith('data:image'):
            clean_image_data = image_data.split(',')[1]
        else:
            clean_image_data = image_data
            
        image_bytes = base64.b64decode(clean_image_data)
        
        # Use proper Gemini image editing that preserves the same object
        try:
            # Initialize the image editor
            image_editor = ImageEditor()
            
            # Get aspect ratio from request data
            aspect_ratio = data.get('aspect_ratio', '1:1')
            
            # Use proper Gemini image editing 
            result = image_editor.edit_image(
                image_data=image_bytes,
                edit_prompt=edit_prompt,
                style=style,
                aspect_ratio=aspect_ratio
            )
            
            if result.get('status') == 'success':
                result['message'] = 'Image edited successfully using Gemini AI - same object preserved'
            else:
                # If Gemini editing fails, provide helpful error message
                result = {
                    'status': 'error',
                    'error': f"Gemini image editing failed: {result.get('error', 'Unknown error')}"
                }
                
        except Exception as e:
            result = {
                'status': 'error',
                'error': f'Image editing failed: {str(e)}'
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    # For local development
    app.run(host='0.0.0.0', port=5000, debug=True)

# For Vercel deployment
# The Flask app instance is available to import
