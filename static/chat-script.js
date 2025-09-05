const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const clearInputButton = document.getElementById('clear-input-button');
const themeToggle = document.getElementById('theme-toggle');
const modelDisplay = document.getElementById('model-display');
const modelDropdown = document.getElementById('model-dropdown');
const selectedModelName = document.getElementById('selected-model-name');
const imageInput = document.getElementById('image-input');
const imageUploadButton = document.getElementById('image-upload-button');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageButton = document.getElementById('remove-image-button');

const BASE_URL = ''; // Use relative path for production

const GEMINI_MODELS = {
    "gemini-2.0-flash": "Gemini 2.0 Flash (Fast)",
    "gemini-2.5-flash": "Gemini 2.5 Flash (Faster)",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite (Fastest)",
    "gemini-2.5-pro": "Gemini 2.5 Pro (Fast)",
    "gemini-1.5-flash": "Gemini 1.5 Flash (Fastest)",
    "gemini-1.5-flash-8b": "Gemini 1.5 Flash 8B (Fast)"
};

let currentModel = "gemini-2.0-flash"; // Default model
let chatHistory = []; // To store chat history for context

// Function to parse code blocks and highlight them
function parseCodeBlocks(message) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let result = '';
    let match;

    while ((match = codeBlockRegex.exec(message)) !== null) {
        const language = match[1] || 'text';
        const code = match[2].trim();
        result += message.slice(lastIndex, match.index);
        result += `<pre><code class="language-${language}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code><button class="copy-button">Copy</button></pre>`;
        lastIndex = match.index + match[0].length;
    }

    result += message.slice(lastIndex);
    return result.trim() || message;
}

// Function to display messages in the chat window
function displayMessage(message, sender, imageSrc = null) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);

    let messageContent = '';
    if (imageSrc) {
        messageContent += `<img src="${imageSrc}" alt="User uploaded image" class="chat-image-preview" style="border-radius: 8px; margin-bottom: 10px;">`;
    }
    if (message) {
        messageContent += marked.parse(parseCodeBlocks(message));
    }

    msgDiv.innerHTML = messageContent;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Highlight code blocks after they are added to the DOM
    const codeBlocks = msgDiv.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        hljs.highlightElement(block);
        const copyButton = block.parentElement.querySelector('.copy-button');
        if (copyButton) {
            copyButton.onclick = () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyButton.innerText = 'Copied!';
                    setTimeout(() => copyButton.innerText = 'Copy', 2000);
                });
            };
        }
    });

    saveChatHistory();
}

// Function to add message to chat history array
function addMessageToHistory(message, sender, imageSrc = null) {
    const messagePart = { text: message };
    const parts = [messagePart];
    if (imageSrc) {
        // For simplicity, we'll just store a placeholder for image in history
        // Actual image data will be sent separately for new image uploads
        parts.push({ image: imageSrc });
    }
    chatHistory.push({
        role: sender === 'user' ? 'user' : 'model',
        parts: parts
    });
}

// Function to display typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing-dots');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to remove typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to send message to API
async function sendMessage(prompt, imageFile = null) {
    showTypingIndicator();
    let response;
    try {
        if (imageFile) {
            const formData = new FormData();
            formData.append('message', prompt);
            formData.append('image', imageFile);
            formData.append('model', currentModel);
            formData.append('history', JSON.stringify(chatHistory)); // Add history to formData
            response = await fetch(`${BASE_URL}/api/chat-with-image`, {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: prompt, history: chatHistory, model: currentModel }) // Send history
            });
        }

        const data = await response.json();
        hideTypingIndicator();
        
        if (data.status === 'error') {
            displayMessage(data.error, 'bot');
            addMessageToHistory(data.error, 'bot'); // Add to history
        } else {
            displayMessage(data.answer || data.response, 'bot');
            addMessageToHistory(data.answer || data.response, 'bot'); // Add to history
        }
    } catch (error) {
        console.error('Error during message generation:', error);
        hideTypingIndicator();
        displayMessage('An error occurred while processing your request.', 'bot');
        addMessageToHistory('An error occurred while processing your request.', 'bot'); // Add to history
    }
    clearInputs();
}

// Event listener for send button
sendButton.addEventListener('click', async () => {
    const prompt = messageInput.value.trim();
    const imageFile = imageInput.files[0];
    
    if (prompt === '' && !imageFile) return;
    
    // Add user message to history
    addMessageToHistory(prompt, 'user');
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            displayMessage(prompt, 'user', e.target.result);
            sendMessage(prompt, imageFile);
        };
        reader.readAsDataURL(imageFile);
    } else {
        displayMessage(prompt, 'user');
        sendMessage(prompt);
    }
});

// Event listener for image upload button
imageUploadButton.addEventListener('click', () => {
    imageInput.click();
});

// Event listener for message input (Enter key)
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Event listener for image input change
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'flex'; // Show the preview
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreviewContainer.style.display = 'none'; // Hide if no file
    }
});

// Event listener for remove image button
removeImageButton.addEventListener('click', () => {
    imageInput.value = ''; // Clear the selected file
    imagePreview.src = '#';
    imagePreviewContainer.style.display = 'none'; // Hide the preview
});

// Event listener for clear input button
clearInputButton.addEventListener('click', () => {
    clearInputs();
});

// Function to clear inputs
function clearInputs() {
    messageInput.value = '';
    imageInput.value = '';
    imagePreview.src = '#';
    imagePreviewContainer.style.display = 'none';
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('dark-mode', isDarkMode);
});

// Load theme preference
function loadThemePreference() {
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    } else {
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Model selection dropdown functionality
modelDisplay.addEventListener('click', () => {
    modelDropdown.classList.toggle('show');
    modelDisplay.querySelector('.dropdown-icon').style.transform = modelDropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
});

// Populate model dropdown
function populateModelDropdown() {
    modelDropdown.innerHTML = '';
    for (const [id, name] of Object.entries(GEMINI_MODELS)) {
        const modelItem = document.createElement('div');
        modelItem.classList.add('model-dropdown-item');
        modelItem.dataset.modelId = id;
        modelItem.textContent = name;
        if (id === currentModel) {
            modelItem.classList.add('selected');
        }
        modelItem.addEventListener('click', () => {
            currentModel = id;
            selectedModelName.textContent = name;
            modelDropdown.classList.remove('show');
            modelDisplay.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
            updateSelectedModelInDropdown();
            saveChatHistory(); // Save chat history after model change
        });
        modelDropdown.appendChild(modelItem);
    }
}

function updateSelectedModelInDropdown() {
    document.querySelectorAll('.model-dropdown-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.modelId === currentModel) {
            item.classList.add('selected');
        }
    });
}

// Close dropdown if clicked outside
document.addEventListener('click', (event) => {
    if (!modelDisplay.contains(event.target) && !modelDropdown.contains(event.target)) {
        modelDropdown.classList.remove('show');
        modelDisplay.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
    }
});

// Chat history functionality
function saveChatHistory() {
    localStorage.setItem('chat-history-html', chatWindow.innerHTML); // Save HTML for display
    localStorage.setItem('chat-history-data', JSON.stringify(chatHistory)); // Save data for API
    localStorage.setItem('selected-model', currentModel);
}

function loadChatHistory() {
    const savedChatHtml = localStorage.getItem('chat-history-html');
    if (savedChatHtml) {
        chatWindow.innerHTML = savedChatHtml;
        // Re-highlight code blocks after loading from local storage
        chatWindow.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
            const copyButton = block.parentElement.querySelector('.copy-button');
            if (copyButton) {
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(block.textContent).then(() => {
                        copyButton.innerText = 'Copied!';
                        setTimeout(() => copyButton.innerText = 'Copy', 2000);
                    });
                };
            }
        });
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    const savedChatData = localStorage.getItem('chat-history-data');
    if (savedChatData) {
        chatHistory = JSON.parse(savedChatData);
    }

    const savedModel = localStorage.getItem('selected-model');
    if (savedModel && GEMINI_MODELS[savedModel]) {
        currentModel = savedModel;
        selectedModelName.textContent = GEMINI_MODELS[savedModel];
    } else {
        selectedModelName.textContent = GEMINI_MODELS[currentModel];
    }
    populateModelDropdown();
}

// Initialize
loadThemePreference();
loadChatHistory();