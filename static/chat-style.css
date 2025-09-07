/* Settings Modal Styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
    animation: fadeIn 0.3s;
}

.modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    position: relative;
    animation: slideIn 0.3s;
}

@keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
}

@keyframes slideIn {
    from {transform: translateY(-50px); opacity: 0;}
    to {transform: translateY(0); opacity: 1;}
}

.close-btn {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    right: 20px;
    top: 15px;
    cursor: pointer;
}

.close-btn:hover,
.close-btn:focus {
    color: #4285F4;
    text-decoration: none;
}

.api-key-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 16px;
    margin: 15px 0;
    font-family: monospace;
    box-sizing: border-box;
}

.api-key-input:focus {
    outline: none;
    border-color: #4285F4;
}

.api-status {
    padding: 10px 15px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: 500;
}

.api-status.connected {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.api-status.disconnected {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.btn {
    background: #4285F4;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background: #357ae8;
}

.clear-btn {
    background: #dc3545;
}

.clear-btn:hover {
    background: #c82333;
}

/* Sparkle emoji as settings button */
.sparkle-emoji {
    cursor: pointer;
    display: inline-block;
    transition: all 0.3s ease;
    padding: 4px;
    border-radius: 50%;
    user-select: none;
}

.sparkle-emoji:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(180deg) scale(1.2);
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

/* Generated Image Styles */
.generated-image-container {
    max-width: 100%;
    margin: 10px 0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.generated-image {
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.generated-image:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.generated-image.selected-for-edit {
    border: 3px solid #4a90e2;
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
}

.image-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
    justify-content: flex-start;
}

.download-btn, .edit-btn {
    background: #4a90e2;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.download-btn:hover, .edit-btn:hover {
    background: #357abd;
    transform: translateY(-1px);
}

.edit-btn {
    background: #28a745;
}

.edit-btn:hover {
    background: #218838;
}

/* General Body and Container Styles */
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    height: 100vh;
    overflow: hidden;
    background-color: #f0f2f5; /* Light grey background */
    color: #333;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.chat-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #ffffff; /* White chat background */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: relative;
}

/* Chat Header */
.chat-header {
    /* আগের background-color বাদ দিয়ে গ্রেডিয়েন্ট যোগ করা হয়েছে */
    background: linear-gradient(45deg, #4285F4, #DB4437, #F4B400, #0F9D58, #4285F4, #DB4437);
    background-size: 400% 400%;
    animation: moveAngledGradient 20s linear infinite;
    
    color: white;
    padding: 8px 15px; /* Responsive padding */
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-radius: 8px 8px 0 0;
    min-height: 60px;
    flex-shrink: 0;
}

/* অন্যান্য কোড অপরিবর্তিত থাকবে */
.header-left, .header-right {
    display: flex;
    align-items: center;
}

.icon-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.icon-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.icon-button i {
    font-size: 20px;
}

.model-selection {
    flex-grow: 1;
    text-align: center;
    position: relative;
}

.app-title {
    font-size: 1.5em; /* Increased font size for Gemini AI */
    font-weight: 700; /* Made it bolder */
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.sparkle-emoji {
    color: #FFD700; /* Gold for day mode */
    font-size: 1.2em; /* Maintained original size */
}

.model-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.3s ease;
}

.model-display:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

#selected-model-name {
    font-size: 0.9em;
    font-weight: 500;
}

.dropdown-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
    transition: transform 0.3s ease;
}

.model-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 200px;
    max-height: 300px;
    overflow-y: auto;
    display: none;
    margin-top: 5px;
}

.model-dropdown.show {
    display: block;
}

.model-dropdown-item {
    padding: 10px 15px;
    cursor: pointer;
    color: #333;
    font-size: 0.9em;
    text-align: left;
    transition: background-color 0.2s ease;
}

.model-dropdown-item:hover {
    background-color: #f0f0f0;
}

.model-dropdown-item.selected {
    background-color: #e0e0e0;
    font-weight: 500;
}

/* অ্যাঙ্গেলড গ্রেডিয়েন্ট অ্যানিমেশন - এটি নতুন যোগ করা হয়েছে */
@keyframes moveAngledGradient {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}

/* Chat Window and Messages */
.chat-window {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    max-width: 85%;
    padding: 12px 18px;
    border-radius: 20px;
    line-height: 1.6;
    word-wrap: break-word;
    font-size: 0.95em;
    position: relative;
}

.user-message {
    background-color: #e0f2fe; /* Light blue for user */
    color: #333;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
}

.bot-message {
    background-color: #f1f0f0; /* Light grey for bot */
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
}

/* Typing animation */
.typing-dots {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 18px;
    background-color: #f1f0f0;
    padding: 12px 18px;
    border-radius: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.typing-dots span {
    width: 6px;
    height: 6px;
    background-color: #4a90e2; /* Blue dots */
    border-radius: 50%;
    margin: 0 2px;
    animation: dot-bounce 0.6s infinite alternate;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-8px); }
}

/* Code block styling */
pre {
    background-color: #e8e8e8; /* Light grey for code */
    color: #333;
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    position: relative;
    white-space: pre-wrap;
    word-break: break-all;
    border: 1px solid #dcdcdc;
}

.copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #4a90e2;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8em;
    opacity: 0.8;
    transition: opacity 0.3s;
}

.copy-button:hover {
    opacity: 1;
}

/* Chat Footer */
.chat-footer {
    display: flex;
    align-items: flex-end;
    padding: 8px;
    background-color: #ffffff;
    border-top: 1px solid #e0e0e0;
    border-radius: 0 0 8px 8px;
    gap: 0px; /* Reduced gap */
    flex-wrap: nowrap;
    justify-content: space-between;
    min-height: 60px;
    box-sizing: border-box;
    width: 100%;
    position: relative;
}

.input-area-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: flex-end;
    background-color: #f9f9f9;
    border: 1px solid #cccccc;
    border-radius: 22px; /* Increased border-radius */
    padding-right: 45px; /* Increased space for send button */
    min-height: 40px; /* Increased minimum height for the wrapper */
}

#message-input {
    flex: 1;
    border: none;
    padding: 10px 15px; /* Increased padding */
    border-radius: 22px; /* Match wrapper border-radius */
    background-color: transparent;
    color: #333;
    font-size: 0.95em; /* Increased font size */
    min-width: 0;
    resize: none;
    overflow-y: hidden;
    max-height: 120px; /* Increased max height for input box (e.g., ~5-6 lines) */
    line-height: 1.4; /* Increased line height */
}

.icon-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 6px; /* Smaller padding */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.icon-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.icon-button i {
    font-size: 18px; /* Smaller icon size */
}

.clear-input-button {
    color: #e74c3c;
    font-size: 1em; /* Adjusted icon size */
    padding: 0;
    background: none;
    border-radius: 50%;
    width: 36px; /* Adjusted button size */
    height: 36px; /* Adjusted button size */
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-input-button:hover {
    background-color: rgba(231, 76, 60, 0.1);
}

#image-upload-button {
    width: 36px; /* Adjusted button size */
    height: 36px; /* Adjusted button size */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #2ecc71;
    color: white;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Slightly larger shadow */
    position: relative; /* Ensure positioning context for absolute children */
}

#image-upload-button i {
    font-size: 18px; /* Adjusted icon size */
}

#send-button {
    background-color: #4a90e2;
    border: none;
    border-radius: 50%;
    width: 36px; /* Adjusted button size */
    height: 36px; /* Adjusted button size */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Slightly larger shadow */
    position: absolute;
    right: 5px;
    bottom: 5px;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.2s ease;
}

#send-button.show {
    visibility: visible;
    opacity: 1;
}

.send-icon {
    width: 18px; /* Adjusted icon size */
    height: 18px; /* Adjusted icon size */
    fill: #ffffff;
}

/* Image Previews */
#image-preview-container {
    display: flex;
    align-items: center;
    margin-left: 8px; /* Adjusted margin */
    margin-right: 8px; /* Adjusted margin */
    padding: 4px; /* Added padding */
    border: 1px solid #ddd; /* Added border */
    border-radius: 8px; /* Added border-radius */
    background-color: #f0f0f0; /* Added background color */
    transition: all 0.2s ease;
    position: relative; /* For positioning the remove button */
}

/* Selected image preview style */
#image-preview-container.selected-image-preview {
    border: 2px solid #4a90e2;
    box-shadow: 0 0 8px rgba(74, 144, 226, 0.5);
    transform: scale(1.05);
}

#image-preview {
    max-width: 40px; /* Smaller preview image */
    max-height: 40px; /* Smaller preview image */
    border-radius: 4px;
    margin-right: 5px;
}

#image-preview-container #remove-image-button {
    position: absolute;
    top: -8px; /* Adjust position as needed */
    right: -8px; /* Adjust position as needed */
    background: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 20px; /* Larger for easier tapping */
    height: 20px; /* Larger for easier tapping */
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: none; /* Hidden by default */
}

#image-preview-container.has-image #remove-image-button {
    display: flex; /* Show when image is selected */
}

.chat-image-preview {
    max-width: 150px;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
    display: block;
}

p {
    margin: 0;
}

/* Dark Mode Styles */
body.dark-mode {
    background-color: #1a1a2e; /* Darker background */
    color: #e0e0e0;
}

body.dark-mode .chat-container {
    background-color: #20203a;
}

body.dark-mode .chat-header {
    background-color: #2c2c4a;
    border-bottom-color: #3a3a5a;
}

body.dark-mode .icon-button {
    color: #e0e0e0;
}

body.dark-mode .icon-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .sparkle-emoji {
    color: #E0BBE4; /* Lavender for dark mode */
}

body.dark-mode .model-dropdown {
    background-color: #2c2c4a;
    border-color: #3a3a5a;
}

body.dark-mode .model-dropdown-item {
    color: #e0e0e0;
}

body.dark-mode .model-dropdown-item:hover {
    background-color: #3a3a5a;
}

body.dark-mode .model-dropdown-item.selected {
    background-color: #4a4a6a;
}

body.dark-mode .user-message {
    background-color: #4a4a6a; /* Darker blue for user in dark mode */
    color: #e0e0e0;
}

body.dark-mode .bot-message {
    background-color: #3a3a5a; /* Darker grey for bot in dark mode */
    color: #e0e0e0;
}

body.dark-mode .typing-dots {
    background-color: #3a3a5a;
}

body.dark-mode .typing-dots span {
    background-color: #61afef;
}

body.dark-mode pre {
    background-color: #2a2a4a;
    color: #e0e0e0;
    border-color: #3a3a5a;
}

body.dark-mode .copy-button {
    background-color: #61afef;
}

body.dark-mode .chat-footer {
    background-color: #20203a;
    border-top-color: #3a3a5a;
}

body.dark-mode #message-input {
    background-color: #2c2c4a;
    border-color: #3a3a5a;
    color: #e0e0e0;
}

body.dark-mode .clear-input-button {
    color: #e74c3c;
}

body.dark-mode #image-upload-button {
    background-color: #27ae60;
}

body.dark-mode #send-button {
    background-color: #4a90e2;
}/* Uploaded image container styles */
.uploaded-image-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
}

.uploaded-image-container .image-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-start;
}

.uploaded-image-container .edit-btn {
    background-color: #61afef;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s;
}

.uploaded-image-container .edit-btn:hover {
    background-color: #4a90e2;
}

.chat-image-preview.selected-for-edit,
.chat-image-preview.selected-image-preview,
.generated-image.selected-image-preview {
    border: 2px solid #61afef;
    box-shadow: 0 0 10px rgba(97, 175, 239, 0.3);
    transition: all 0.2s ease;
    transform: scale(1.02);
}

/* Dark mode styles for uploaded image container */
body.dark-mode .uploaded-image-container .edit-btn {
    background-color: #61afef;
}

body.dark-mode .uploaded-image-container .edit-btn:hover {
    background-color: #4a90e2;
}

/* Universal Responsive Footer for All Screen Sizes */
.chat-footer button, .chat-footer #message-input {
    flex-shrink: 0;
}

/* Adjusted min-width/height for all buttons in the footer */
/* Universal Responsive Footer for All Screen Sizes */
.chat-footer .icon-button,
.chat-footer #send-button,
.chat-footer #image-upload-button,
.chat-footer #clear-input-button {
    min-width: 36px; /* Increased button size */
    min-height: 36px; /* Increased button size */
    padding: 0;
}

.chat-footer .icon-button i,
.chat-footer #send-button .send-icon,
.chat-footer #image-upload-button i,
.chat-footer #clear-input-button i {
    font-size: 18px; /* Increased icon size */
}

/* ===== RESPONSIVE DESIGN IMPROVEMENTS ===== */

/* Mobile First - Small screens (up to 480px) */
@media (max-width: 480px) {
    body {
        font-size: 14px;
        /* Prevent scroll when keyboard appears */
        position: fixed;
        width: 100%;
        height: 100%;
    }
    
    .chat-container {
        border-radius: 0;
        height: 100vh;
        height: 100dvh; /* Dynamic viewport height for mobile */
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    
    .chat-header {
        padding: 10px 12px;
        min-height: 55px;
        border-radius: 0;
        flex-shrink: 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    /* Hide desktop image preview container on mobile */
    #image-preview-container {
        display: none !important;
    }

    /* Hide desktop remove image button on mobile */
    #image-preview-container #remove-image-button {
        display: none !important;
    }
    
    .app-title {
        font-size: 1.2em;
        margin-bottom: 1px;
    }
    
    #selected-model-name {
        font-size: 0.8em;
    }
    
    .model-dropdown {
        min-width: 180px;
        left: 10px;
        right: 10px;
        transform: none;
        max-width: calc(100vw - 20px);
        z-index: 1001;
    }
    
    .chat-window {
        padding: 10px 12px;
        gap: 8px;
        flex: 1;
        overflow-y: auto;
        padding-bottom: 80px; /* Adjusted space for fixed footer */
        -webkit-overflow-scrolling: touch;
    }
    
    .message {
        max-width: 90%;
        padding: 10px 14px;
        font-size: 14px;
        border-radius: 16px;
    }
    
    .generated-image {
        max-width: 100%;
    }
    
    .chat-image-preview {
        max-width: 120px;
    }
    
    .chat-footer {
        padding: 8px;
        gap: 5px; /* Reduced gap */
        min-height: 60px;
    }
    
    .input-area-wrapper {
        padding-right: 40px;
        min-height: 40px;
    }

    #message-input {
        font-size: 0.95em;
        padding: 10px 12px;
        min-height: 25px;
        border-radius: 22px;
        flex: 1;
        max-width: calc(100vw - 140px);
    }
    
    .icon-button {
        padding: 6px;
        min-width: 36px;
        min-height: 36px;
    }
    
    .icon-button i {
        font-size: 18px;
    }
    
    #send-button {
        min-width: 36px;
        min-height: 36px;
        padding: 0;
        right: 4px;
        bottom: 4px;
    }
    
    #image-upload-button {
        min-width: 36px;
        min-height: 36px;
        padding: 0;
    }
    
    /* Ensure clear button is visible */
    #clear-input-button {
        min-width: 36px;
        min-height: 36px;
        padding: 0;
        order: 1;
    }
    
    /* Input should be in the middle */
    .input-area-wrapper {
        order: 2;
        margin: 0 2px; /* Reduced margin */
    }
    
    /* Image preview container */
    #image-preview-container {
        order: 3;
        flex-shrink: 0;
        margin-left: 2px; /* Reduced margin */
        margin-right: 2px; /* Reduced margin */
        padding: 3px;
    }
    
    #image-preview {
        max-width: 35px;
        max-height: 35px;
    }

    /* Upload button */
    #image-upload-button {
        order: 4;
    }
    
    /* Send button last */
    #send-button {
        order: 5;
    }
    
    .image-actions {
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .download-btn, .edit-btn {
        padding: 10px 14px;
        font-size: 13px;
        min-height: 40px;
    }
    
    pre {
        font-size: 13px;
        padding: 8px;
        overflow-x: auto;
    }
    
    .copy-button {
        padding: 6px 10px;
        font-size: 12px;
    }
    
    /* Handle mobile keyboard appearance */
    @supports (-webkit-appearance: none) {
        .chat-container {
            height: -webkit-fill-available;
        }
    }
}

/* Mobile keyboard handling */
@media (max-width: 480px) {
    /* When input is focused (keyboard visible) */
    body.keyboard-visible {
        height: auto;
        min-height: 100vh;
    }
    
    body.keyboard-visible .chat-container {
        height: auto;
        min-height: 100vh;
    }
    
    body.keyboard-visible .chat-window {
        max-height: calc(100vh - 130px); /* Adjusted for header + footer */
    }
    
    /* Dark mode mobile footer */
    body.dark-mode .chat-footer {
        background-color: #20203a;
        border-top-color: #3a3a5a;
    }
}

/* Medium screens - Tablets (481px to 768px) */
@media (min-width: 481px) and (max-width: 768px) {
    .chat-container {
        border-radius: 0;
        height: 100vh;
        width: 100vw;
    }
    
    .chat-header {
        padding: 12px 20px;
        border-radius: 0;
    }
    
    .app-title {
        font-size: 1.4em;
    }
    
    .message {
        max-width: 80%;
        padding: 12px 16px;
    }
    
    .generated-image {
        max-width: 350px;
    }
    
    .chat-footer {
        padding: 8px;
        gap: 5px; /* Reduced gap */
        min-height: 60px;
    }

/* Large screens - Desktop (769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
    .chat-container {
        height: 100vh;
        width: 100vw;
        border-radius: 0;
    }
    
    .message {
        max-width: 75%;
    }
    
    .generated-image {
        max-width: 400px;
    }
    
    .chat-footer {
        padding: 10px 15px;
        gap: 5px; /* Reduced gap */
    }
    
    .input-area-wrapper {
        padding-right: 45px;
        min-height: 40px;
    }

    #message-input {
        margin: 0;
        max-width: calc(100% - 45px);
        padding: 10px 15px;
    }
}

}

/* Extra large screens - Wide Desktop (1025px+) */
@media (min-width: 1025px) {
    .chat-container {
        height: 100vh;
        width: 100vw;
        border-radius: 0;
    }
    
    .message {
        max-width: 70%;
    }
    
    .generated-image {
        max-width: 450px;
    }
    
    .chat-window {
        padding: 20px 25px;
    }
    
    .chat-footer {
        padding: 12px 20px;
        gap: 5px; /* Reduced gap */
        align-items: center; /* Ensure vertical centering */
    }
    
    .input-area-wrapper {
        padding-right: 30px; /* Reduced for better spacing */
        min-height: 36px; /* Reduced height */
        border: 1px solid #cccccc; /* Consistent border */
    }

    #message-input {
        margin: 0;
        max-width: calc(100% - 45px);
        padding: 8px 15px; /* Reduced padding */
        font-size: 1.1em; /* Increased font size */
        line-height: 1.4; /* Adjusted line height */
    }

    #send-button {
        bottom: 3px; /* Adjusted positioning */
    }
}

/* Portrait orientation adjustments */
@media (orientation: portrait) and (max-width: 768px) {
    .chat-window {
        padding-bottom: 5px;
    }
    
    .model-dropdown {
        max-height: 200px;
    }
}

/* Landscape orientation adjustments for mobile */
@media (orientation: landscape) and (max-height: 500px) {
    .chat-header {
        min-height: 50px;
        padding: 8px 15px;
    }
    
    .app-title {
        font-size: 1.1em;
        margin-bottom: 0;
    }
    
    #selected-model-name {
        font-size: 0.75em;
    }
    
    .chat-window {
        padding: 8px 15px;
    }
    
    .message {
        padding: 8px 12px;
        font-size: 13px;
    }
    
    .chat-footer {
        padding: 8px 15px;
    }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .generated-image, .chat-image-preview {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
}

/* Touch device improvements */
@media (pointer: coarse) {
    /* Further reduced sizes for touch devices */
    .icon-button, .download-btn, .edit-btn, #send-button, #image-upload-button {
        min-width: 38px; /* Adjusted for touch */
        min-height: 38px; /* Adjusted for touch */
    }
    
    .model-display {
        padding: 6px 10px; /* Adjusted for touch */
    }
    
    .model-dropdown-item {
        padding: 10px 12px; /* Adjusted for touch */
        font-size: 15px; /* Adjusted for touch */
    }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .typing-dots span {
        animation: none;
    }
}

/* Dark mode responsive adjustments */
@media (max-width: 480px) {
    body.dark-mode .chat-container {
        border-radius: 0;
    }
    
    body.dark-mode .chat-header {
        border-radius: 0;
    }

    /* Style for the new mobile remove image button */
    .remove-image-mobile {
        display: none; /* Hidden by default */
        position: absolute;
        top: -8px; /* Adjusted to be on the corner of the button */
        right: -8px; /* Adjusted to be on the corner of the button */
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    #image-upload-button.has-image .remove-image-mobile {
        display: flex; /* Show when image is selected */
    }
}

/* Desktop specific styles for image upload button and remove icon */
@media (min-width: 481px) {
    #image-upload-button .remove-image-mobile {
        display: none !important; /* Hide mobile remove icon on larger screens */
    }
    
    /* Reset desktop image preview container display (hidden by default) */
    #image-preview-container {
        display: none; /* Hidden by default, shown when has-image class is added */
    }
    
    /* Show desktop image preview container when image is selected */
    #image-preview-container.has-image {
        display: flex !important; /* Show when image is selected */
    }
    
    /* Show desktop remove button when image is present */
    #image-preview-container.has-image #remove-image-button {
        display: flex !important;
    }
}
