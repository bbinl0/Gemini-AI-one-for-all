const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Function to adjust textarea height
function adjustTextareaHeight() {
    messageInput.style.height = 'auto'; // Reset height to auto
    const currentScrollHeight = messageInput.scrollHeight;
    const lineHeight = parseFloat(getComputedStyle(messageInput).lineHeight);
    const maxHeight = parseFloat(getComputedStyle(messageInput).maxHeight);

    // Calculate desired height, ensuring it doesn't exceed maxHeight
    let newHeight = Math.min(currentScrollHeight, maxHeight);

    // Ensure minimum height for one line
    if (newHeight < lineHeight * 1.5) { // 1.5 to account for padding/line-height variations
        newHeight = lineHeight * 1.5;
    }

    messageInput.style.height = newHeight + 'px';

    // Show scrollbar if content exceeds max height
    if (messageInput.scrollHeight > newHeight) {
        messageInput.style.overflowY = 'auto';
    } else {
        messageInput.style.overflowY = 'hidden';
    }
}

// Function to toggle send button visibility
function toggleSendButton() {
    if (messageInput.value.trim() !== "" || imageInput.files[0]) {
        sendButton.classList.add("show");
    } else {
        sendButton.classList.remove("show");
    }
}
const clearInputButton = document.getElementById("clear-input-button");
const themeToggle = document.getElementById("theme-toggle");
const modelDisplay = document.getElementById("model-display");
const modelDropdown = document.getElementById("model-dropdown");
const selectedModelName = document.getElementById("selected-model-name");
const imageInput = document.getElementById("image-input");
const imageUploadButton = document.getElementById("image-upload-button");
const imagePreviewContainer = document.getElementById(
    "image-preview-container",
);
const imagePreview = document.getElementById("image-preview");
const removeImageButton = document.getElementById("remove-image-button");

const BASE_URL = ""; // Use relative path for production

const GEMINI_MODELS = {
    "gemini-2.0-flash": "Gemini 2.0 Flash (Fast)",
    "gemini-2.5-flash": "Gemini 2.5 Flash (Faster)",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite (Fastest)",
    "gemini-2.5-pro": "Gemini 2.5 Pro (Fast)",
    "gemini-1.5-flash": "Gemini 1.5 Flash (Fastest)",
    "gemini-1.5-flash-8b": "Gemini 1.5 Flash 8B (Fast)",
};

let currentModel = "gemini-2.0-flash"; // Default model
let chatHistory = []; // To store chat history for context
let lastGeneratedImage = null; // Store last generated image for editing
let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Auto-detect user timezone

// Storage management constants
const MAX_STORAGE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
let storageCheckInterval = null;

// Function to parse code blocks and highlight them
function parseCodeBlocks(message) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let result = "";
    let match;

    while ((match = codeBlockRegex.exec(message)) !== null) {
        const language = match[1] || "text";
        const code = match[2].trim();
        result += message.slice(lastIndex, match.index);
        result += `<pre><code class="language-${language}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code><button class="copy-button">Copy</button></pre>`;
        lastIndex = match.index + match[0].length;
    }

    result += message.slice(lastIndex);
    return result.trim() || message;
}

// Function to get formatted time for any country/timezone
function getFormattedTime(country, timeZone, prompt) {
    const now = new Date();
    const isBengali = isBengaliInput(prompt);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "long",
        timeZone: timeZone,
    };

    let formattedTime;
    let response;

    if (isBengali) {
        formattedTime = now.toLocaleString("bn-BD", options);
        response = `এখন ${country} এর সময়: ${formattedTime}`;
    } else {
        formattedTime = now.toLocaleString("en-US", options);
        response = `Current time in ${country}: ${formattedTime}`;
    }

    return response;
}

// Function to detect if input is in Bengali
function isBengaliInput(prompt) {
    const bengaliPatterns = [
        "কয়টা বাজে",
        "কত বাজে",
        "সময় কত",
        "সময় কি",
        "এখন কয়টা",
        "বর্তমান সময়",
        "এখনকার সময়",
        "এখন কত বজে",
        "টাইম কত",
        "কত টাইম",
        "সময় বলো",
        "সময় জানতে চাই",
        "সময়",
        "ঘন্টা",
        "মিনিট",
        "বাজে",
        "কয়টা",
        "কত",
        "এখন",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return bengaliPatterns.some((pattern) => lowerPrompt.includes(pattern));
}

// Function to detect time-related queries in Bengali and English only
function isTimeQuery(prompt) {
    const timePatterns = [
        // Bengali patterns
        "কয়টা বাজে",
        "কত বাজে",
        "সময় কত",
        "সময় কি",
        "এখন কয়টা",
        "বর্তমান সময়",
        "এখনকার সময়",
        "এখন কত বজে",
        "টাইম কত",
        "কত টাইম",
        "সময় বলো",
        "সময় জানতে চাই",

        // English patterns
        "what time is it",
        "current time",
        "what's the time",
        "tell me the time",
        "time now",
        "what time",
        "show time",
        "display time",
        "get time",
        "what is the time right now",
        "what is on the clock",
        "tell me time",
        "show me the time",
        "current local time",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return timePatterns.some((pattern) =>
        lowerPrompt.includes(pattern.toLowerCase()),
    );
}

// Function to detect date calculation queries
function isDateCalculationQuery(prompt) {
    const datePatterns = [
        // Bengali patterns
        "দিন পর",
        "মাস পর",
        "বছর পর",
        "দিন আগে",
        "মাস আগে",
        "বছর আগে",
        "তারিখ",
        "বার",
        "কি বার",
        "কোন বার",
        "কোন দিন",
        "কোন মাস",
        "থেকে",
        "পর্যন্ত",
        "কত দিন",
        "কত মাস",
        "কত বছর",

        // English patterns
        "days from now",
        "months from now",
        "years from now",
        "days ago",
        "months ago",
        "years ago",
        "what day",
        "which day",
        "what date",
        "calculate date",
        "from today",
        "after today",
        "before today",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return datePatterns.some((pattern) =>
        lowerPrompt.includes(pattern.toLowerCase()),
    );
}

// Function to detect international time queries
function isInternationalTimeQuery(prompt) {
    const countries = [
        // Countries in Bengali
        "আমেরিকা",
        "যুক্তরাষ্ট্র",
        "ব্রিটেন",
        "ইংল্যান্ড",
        "জার্মানি",
        "ফ্রান্স",
        "ভারত",
        "চীন",
        "জাপান",
        "অস্ট্রেলিয়া",
        "কানাডা",
        "রাশিয়া",
        "সৌদি আরব",
        "দুবাই",
        "সিঙ্গাপুর",
        "মালয়েশিয়া",
        "থাইল্যান্ড",

        // Countries in English
        "america",
        "usa",
        "united states",
        "britain",
        "england",
        "uk",
        "germany",
        "france",
        "india",
        "china",
        "japan",
        "australia",
        "canada",
        "russia",
        "saudi arabia",
        "dubai",
        "singapore",
        "malaysia",
        "thailand",
        "pakistan",
        "turkey",
        "italy",
        "spain",

        // Cities
        "new york",
        "london",
        "paris",
        "tokyo",
        "sydney",
        "toronto",
        "moscow",
        "dubai",
        "singapore",
        "kuala lumpur",
        "bangkok",
        "delhi",
        "mumbai",
        "beijing",
        "shanghai",
        "dhaka",
        "ঢাকা",
        "চট্টগ্রাম",
        "কক্সবাজার",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return (
        countries.some((country) =>
            lowerPrompt.includes(country.toLowerCase()),
        ) &&
        (isTimeQuery(prompt) || lowerPrompt.includes("time"))
    );
}

// Function to calculate future/past dates
function calculateDate(prompt) {
    const now = new Date();
    let resultDate = new Date(now);
    const isBengali = isBengaliInput(prompt);

    // Extract numbers and time units from the prompt
    const numberMatch = prompt.match(/(\d+)/);
    const number = numberMatch ? parseInt(numberMatch[1]) : 0;

    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("দিন") || lowerPrompt.includes("day")) {
        if (
            lowerPrompt.includes("পর") ||
            lowerPrompt.includes("from now") ||
            lowerPrompt.includes("after")
        ) {
            resultDate.setDate(resultDate.getDate() + number);
        } else if (
            lowerPrompt.includes("আগে") ||
            lowerPrompt.includes("ago") ||
            lowerPrompt.includes("before")
        ) {
            resultDate.setDate(resultDate.getDate() - number);
        }
    } else if (lowerPrompt.includes("মাস") || lowerPrompt.includes("month")) {
        if (
            lowerPrompt.includes("পর") ||
            lowerPrompt.includes("from now") ||
            lowerPrompt.includes("after")
        ) {
            resultDate.setMonth(resultDate.getMonth() + number);
        } else if (
            lowerPrompt.includes("আগে") ||
            lowerPrompt.includes("ago") ||
            lowerPrompt.includes("before")
        ) {
            resultDate.setMonth(resultDate.getMonth() - number);
        }
    } else if (lowerPrompt.includes("বছর") || lowerPrompt.includes("year")) {
        if (
            lowerPrompt.includes("পর") ||
            lowerPrompt.includes("from now") ||
            lowerPrompt.includes("after")
        ) {
            resultDate.setFullYear(resultDate.getFullYear() + number);
        } else if (
            lowerPrompt.includes("আগে") ||
            lowerPrompt.includes("ago") ||
            lowerPrompt.includes("before")
        ) {
            resultDate.setFullYear(resultDate.getFullYear() - number);
        }
    }

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: userTimeZone,
    };

    let formattedDate;
    const daysDiff = Math.floor((resultDate - now) / (1000 * 60 * 60 * 24));

    if (isBengali) {
        formattedDate = resultDate.toLocaleString("bn-BD", options);
        if (daysDiff === 0) {
            return `আজ: ${formattedDate}`;
        } else if (daysDiff > 0) {
            return `${number} ${lowerPrompt.includes("দিন") ? "দিন" : lowerPrompt.includes("মাস") ? "মাস" : "বছর"} পর: ${formattedDate} (আজ থেকে ${daysDiff} দিন পর)`;
        } else {
            return `${number} ${lowerPrompt.includes("দিন") ? "দিন" : lowerPrompt.includes("মাস") ? "মাস" : "বছর"} আগে: ${formattedDate} (আজ থেকে ${Math.abs(daysDiff)} দিন আগে)`;
        }
    } else {
        formattedDate = resultDate.toLocaleString("en-US", options);
        if (daysDiff === 0) {
            return `Today: ${formattedDate}`;
        } else if (daysDiff > 0) {
            const unit = lowerPrompt.includes("day")
                ? "day"
                : lowerPrompt.includes("month")
                  ? "month"
                  : "year";
            return `${number} ${unit}${number > 1 ? "s" : ""} from now: ${formattedDate} (${daysDiff} days from today)`;
        } else {
            const unit = lowerPrompt.includes("day")
                ? "day"
                : lowerPrompt.includes("month")
                  ? "month"
                  : "year";
            return `${number} ${unit}${number > 1 ? "s" : ""} ago: ${formattedDate} (${Math.abs(daysDiff)} days ago)`;
        }
    }
}

// Function to get international time based on country/city
function getInternationalTime(prompt) {
    const timeZoneMap = {
        // USA
        america: "America/New_York",
        usa: "America/New_York",
        "united states": "America/New_York",
        আমেরিকা: "America/New_York",
        যুক্তরাষ্ট্র: "America/New_York",
        "new york": "America/New_York",
        california: "America/Los_Angeles",

        // UK
        britain: "Europe/London",
        england: "Europe/London",
        uk: "Europe/London",
        ব্রিটেন: "Europe/London",
        ইংল্যান্ড: "Europe/London",
        london: "Europe/London",

        // Europe
        germany: "Europe/Berlin",
        জার্মানি: "Europe/Berlin",
        france: "Europe/Paris",
        ফ্রান্স: "Europe/Paris",
        paris: "Europe/Paris",
        italy: "Europe/Rome",
        spain: "Europe/Madrid",

        // Asia
        india: "Asia/Kolkata",
        ভারত: "Asia/Kolkata",
        delhi: "Asia/Kolkata",
        mumbai: "Asia/Kolkata",
        china: "Asia/Shanghai",
        চীন: "Asia/Shanghai",
        beijing: "Asia/Shanghai",
        shanghai: "Asia/Shanghai",
        japan: "Asia/Tokyo",
        জাপান: "Asia/Tokyo",
        tokyo: "Asia/Tokyo",
        singapore: "Asia/Singapore",
        সিঙ্গাপুর: "Asia/Singapore",
        malaysia: "Asia/Kuala_Lumpur",
        মালয়েশিয়া: "Asia/Kuala_Lumpur",
        "kuala lumpur": "Asia/Kuala_Lumpur",
        thailand: "Asia/Bangkok",
        থাইল্যান্ড: "Asia/Bangkok",
        bangkok: "Asia/Bangkok",

        // Middle East
        dubai: "Asia/Dubai",
        দুবাই: "Asia/Dubai",
        "saudi arabia": "Asia/Riyadh",
        "সৌদি আরব": "Asia/Riyadh",

        // Others
        australia: "Australia/Sydney",
        অস্ট্রেলিয়া: "Australia/Sydney",
        sydney: "Australia/Sydney",
        canada: "America/Toronto",
        কানাডা: "America/Toronto",
        toronto: "America/Toronto",
        russia: "Europe/Moscow",
        রাশিয়া: "Europe/Moscow",
        moscow: "Europe/Moscow",

        // Bangladesh
        bangladesh: "Asia/Dhaka",
        বাংলাদেশ: "Asia/Dhaka",
        dhaka: "Asia/Dhaka",
        ঢাকা: "Asia/Dhaka",
        chittagong: "Asia/Dhaka",
        চট্টগ্রাম: "Asia/Dhaka",
    };

    const lowerPrompt = prompt.toLowerCase();

    for (const [country, timeZone] of Object.entries(timeZoneMap)) {
        if (lowerPrompt.includes(country.toLowerCase())) {
            return getFormattedTime(country, timeZone, prompt);
        }
    }

    return null;
}

// Function to get current local time with sarcastic responses
function getCurrentTime(prompt) {
    const now = new Date();
    const isBengali = isBengaliInput(prompt);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "long",
        timeZone: userTimeZone,
    };

    let formattedTime;
    let response;

    if (isBengali) {
        formattedTime = now.toLocaleString("bn-BD", options);
        const bengaliSarcasms = [
            `আপনার বর্তমান সময়: ${formattedTime}\n\nকানাচোদা তোর ডিভাইসে দেখ এখন কয়টা বাজে! 😏`,
            `এখন সময়: ${formattedTime}\n\nহাতের ঘড়ি অথবা ফোনের ঘড়ি দেখতে পারো না নাকি? 🙄`,
            `বর্তমান সময়: ${formattedTime}\n\nতোর চোখে কি সমস্যা আছে যে ডিভাইসের সময় দেখতে পাস না? 😒`,
            `আপনার স্থানীয় সময়: ${formattedTime}\n\nএত বড় স্ক্রিনে সময় লেখা থাকতেও আমাকে জিজ্ঞেস করছো? 🤦‍♂️`,
        ];
        response =
            bengaliSarcasms[Math.floor(Math.random() * bengaliSarcasms.length)];
    } else {
        formattedTime = now.toLocaleString("en-US", options);
        const englishSarcasms = [
            `Current time: ${formattedTime}\n\nMother fucker can't you see the time on your device? 😏`,
            `Your current time: ${formattedTime}\n\nSeriously? You have a clock right there on your screen! 🙄`,
            `Local time: ${formattedTime}\n\nDid you forget how to look at your watch or phone? 😒`,
            `The time right now: ${formattedTime}\n\nI'm starting to think you just enjoy bothering me! 🤦‍♂️`,
        ];
        response =
            englishSarcasms[Math.floor(Math.random() * englishSarcasms.length)];
    }

    return response;
}

// Function to handle time-related queries
function handleTimeQuery(prompt) {
    // Check for international time queries first
    if (isInternationalTimeQuery(prompt)) {
        const internationalTime = getInternationalTime(prompt);
        if (internationalTime) {
            return internationalTime;
        }
    }

    // Check for date calculations
    if (isDateCalculationQuery(prompt)) {
        return calculateDate(prompt);
    }

    // Default to current local time
    if (isTimeQuery(prompt)) {
        return getCurrentTime(prompt);
    }

    return null;
}

// Function to display messages in the chat window
function displayMessage(
    message,
    sender,
    imageSrc = null,
    isGeneratedImage = false,
) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", `${sender}-message`);

    let messageContent = "";
    if (imageSrc) {
        if (isGeneratedImage) {
            const imageId = "generated-img-" + Date.now();
            messageContent += `
                <div class="generated-image-container">
                    <img src="${imageSrc}" alt="Generated image" class="generated-image" id="${imageId}" style="max-width: 400px; border-radius: 8px; margin-bottom: 10px;">
                    <div class="image-actions">
                        <button class="download-btn" onclick="downloadImage('${imageSrc}', 'generated-image-${Date.now()}.png')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="edit-btn" onclick="prepareImageForEdit('${imageId}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>`;
        } else {
            // For uploaded images, add edit button if it's from user
            const imageId = "uploaded-img-" + Date.now();
            if (sender === "user") {
                messageContent += `
                    <div class="uploaded-image-container">
                        <img src="${imageSrc}" alt="User uploaded image" class="chat-image-preview" id="${imageId}" style="max-width: 400px; border-radius: 8px; margin-bottom: 10px;">
                        <div class="image-actions">
                            <button class="edit-btn" onclick="prepareUploadedImageForEdit('${imageId}', '${imageSrc}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>`;
            } else {
                messageContent += `<img src="${imageSrc}" alt="Image" class="chat-image-preview" style="border-radius: 8px; margin-bottom: 10px;">`;
            }
        }
    }
    if (message) {
        messageContent += marked.parse(parseCodeBlocks(message));
    }

    msgDiv.innerHTML = messageContent;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Highlight code blocks after they are added to the DOM
    const codeBlocks = msgDiv.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
        const copyButton = block.parentElement.querySelector(".copy-button");
        if (copyButton) {
            copyButton.onclick = () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyButton.innerText = "Copied!";
                    setTimeout(() => (copyButton.innerText = "Copy"), 2000);
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
        role: sender === "user" ? "user" : "model",
        parts: parts,
    });
}

// Function to display typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message", "typing-dots");
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = "<span></span><span></span><span></span>";
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to remove typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to detect if user wants to generate an image
function isImageGenerationRequest(prompt) {
    const imageCommands = [
        "/img",
        "/gen",
        "/generate",
        "/image",
        "generate an image",
        "generate image",
        "create an image",
        "create image",
        "make an image",
        "make image",
        "draw an image",
        "draw image",
        "i want an image",
        "i want image",
        "i need an image",
        "i need image",
        "show me an image",
        "show me image",
        "generate picture",
        "create picture",
        "make picture",
        "draw picture",
        "generate photo",
        "create photo",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return imageCommands.some((command) => lowerPrompt.includes(command));
}

// Function to detect if user wants to edit an image
function isImageEditRequest(prompt, hasUploadedImage = false) {
    const editCommands = [
        "/edit",
        "/modify",
        "/change",
        "edit",
        "edit the image",
        "edit image",
        "modify the image",
        "modify image",
        "change the image",
        "change image",
        "update the image",
        "update image",
        "improve the image",
        "improve image",
        "enhance the image",
        "enhance image",
    ];

    const lowerPrompt = prompt.toLowerCase();
    return (
        editCommands.some((command) => lowerPrompt.includes(command)) &&
        (lastGeneratedImage ||
            hasUploadedImage ||
            window.currentUploadedImageForEdit)
    );
}

// Function to extract edit prompt from edit request
function extractEditPrompt(fullPrompt) {
    const lowerPrompt = fullPrompt.toLowerCase();

    // Remove common edit commands
    let cleanPrompt = fullPrompt;
    const commandsToRemove = [
        "/edit",
        "/modify",
        "/change",
        "edit the image:",
        "edit image:",
        "modify the image:",
        "modify image:",
        "change the image:",
        "change image:",
        "update the image:",
        "update image:",
        "edit the image",
        "edit image",
        "modify the image",
        "modify image",
        "change the image",
        "change image",
        "update the image",
        "update image",
    ];

    for (const command of commandsToRemove) {
        const regex = new RegExp(
            command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "gi",
        );
        cleanPrompt = cleanPrompt.replace(regex, "").trim();
    }

    return cleanPrompt || fullPrompt;
}

// Function to extract prompt from image generation request
function extractImagePrompt(fullPrompt) {
    const lowerPrompt = fullPrompt.toLowerCase();

    // Remove common generation commands
    let cleanPrompt = fullPrompt;
    const commandsToRemove = [
        "/img",
        "/gen",
        "/generate",
        "/image",
        "generate an image of",
        "generate image of",
        "create an image of",
        "create image of",
        "make an image of",
        "make image of",
        "draw an image of",
        "draw image of",
        "generate an image",
        "generate image",
        "create an image",
        "create image",
        "make an image",
        "make image",
        "draw an image",
        "draw image",
        "i want an image of",
        "i want image of",
        "i need an image of",
        "i need image of",
        "show me an image of",
        "show me image of",
        "generate picture of",
        "create picture of",
        "make picture of",
        "draw picture of",
        "generate photo of",
        "create photo of",
        "generate picture",
        "create picture",
        "make picture",
        "draw picture",
        "generate photo",
        "create photo",
    ];

    for (const command of commandsToRemove) {
        const regex = new RegExp(
            command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "gi",
        );
        cleanPrompt = cleanPrompt.replace(regex, "").trim();
    }

    return cleanPrompt || fullPrompt;
}

// Function to edit image using API
async function editImage(editPrompt) {
    if (!lastGeneratedImage) {
        displayMessage(
            "No image available for editing. Please generate an image first.",
            "bot",
        );
        return;
    }

    showTypingIndicator();

    try {
        const response = await fetch(`${BASE_URL}/api/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: lastGeneratedImage.dataUrl,
                edit_prompt: editPrompt,
                style: "photorealistic",
                aspect_ratio: "1:1",
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        hideTypingIndicator();

        if (data.status === "success" && data.image_base64) {
            const imageDataUrl = `data:image/png;base64,${data.image_base64}`;

            // Update the last generated image with the edited version
            lastGeneratedImage = {
                dataUrl: imageDataUrl,
                prompt: `${lastGeneratedImage.prompt} (edited: ${editPrompt})`,
                timestamp: Date.now(),
            };

            displayMessage(
                `Here's your edited image: "${editPrompt}"`,
                "bot",
                imageDataUrl,
                true,
            );
            addMessageToHistory(`Edited image: ${editPrompt}`, "bot");
        } else {
            displayMessage(
                `Sorry, I couldn't edit the image. Error: ${data.error || "Unknown error"}`,
                "bot",
            );
            addMessageToHistory(
                `Image editing failed: ${data.error || "Unknown error"}`,
                "bot",
            );
        }
    } catch (error) {
        console.error("Error editing image:", error);
        hideTypingIndicator();
        displayMessage("An error occurred while editing the image. Please try again.", "bot");
        addMessageToHistory("Image editing failed due to network error", "bot");
        // Don't block the system - continue processing
        return;
    }
}

// Function to generate image using API with Gemini primary, Pollinations fallback
async function generateImage(prompt) {
    showTypingIndicator();

    // PRIMARY: Try Gemini first
    try {
        const geminiResponse = await fetch(`${BASE_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                provider: "gemini",
                aspect_ratio: "1:1",
            }),
        });

        const geminiData = await geminiResponse.json();

        if (geminiData.status === "success" && geminiData.image_base64) {
            const imageDataUrl = `data:image/png;base64,${geminiData.image_base64}`;
            lastGeneratedImage = {
                dataUrl: imageDataUrl,
                prompt: prompt,
                timestamp: Date.now(),
            };

            hideTypingIndicator();
            displayMessage(
                `Here's your generated image for: "${prompt}" ✨ (Generated using Gemini AI)`,
                "bot",
                imageDataUrl,
                true,
            );
            addMessageToHistory(`Generated image: ${prompt}`, "bot");
            return;
        } else {
            console.log(
                "Gemini generation failed, trying fallback:",
                geminiData.error,
            );
        }
    } catch (error) {
        console.log("Gemini generation error, trying fallback:", error);
    }

    // FALLBACK: Use Pollinations if Gemini fails
    try {
        const pollinationsResponse = await fetch(`${BASE_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                provider: "pollinations",
                aspect_ratio: "1:1",
            }),
        });

        const pollinationsData = await pollinationsResponse.json();
        hideTypingIndicator();

        if (
            pollinationsData.status === "success" &&
            pollinationsData.image_base64
        ) {
            const imageDataUrl = `data:image/png;base64,${pollinationsData.image_base64}`;
            lastGeneratedImage = {
                dataUrl: imageDataUrl,
                prompt: prompt,
                timestamp: Date.now(),
            };

            displayMessage(
                `Here's your generated image for: "${prompt}" 🎨 (Generated using Pollinations AI - fallback)`,
                "bot",
                imageDataUrl,
                true,
            );
            addMessageToHistory(`Generated image: ${prompt}`, "bot");
        } else {
            displayMessage(
                `Sorry, I couldn't generate the image. Both Gemini and Pollinations failed. Error: ${pollinationsData.error || "Unknown error"}`,
                "bot",
            );
            addMessageToHistory(
                `Image generation failed: ${pollinationsData.error || "Unknown error"}`,
                "bot",
            );
        }
    } catch (error) {
        console.error("Error generating image with both services:", error);
        hideTypingIndicator();
        displayMessage(
            "An error occurred while generating the image. Both services are unavailable.",
            "bot",
        );
        addMessageToHistory(
            "Image generation failed due to network error",
            "bot",
        );
    }
}

// Function to download generated image
function downloadImage(imageSrc, filename) {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to prepare image for editing (when edit button is clicked)
function prepareImageForEdit(imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement && lastGeneratedImage) {
        messageInput.value = `/edit `;
        messageInput.focus();

        // Add visual indicator that image is selected for editing
        document
            .querySelectorAll(".generated-image")
            .forEach((img) => img.classList.remove("selected-for-edit"));
        imageElement.classList.add("selected-for-edit");
    }
}

// Function to prepare uploaded image for editing
function prepareUploadedImageForEdit(imageId, imageSrc) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
        messageInput.value = `/edit `;
        messageInput.focus();

        // Store the uploaded image data for editing
        window.currentUploadedImageForEdit = {
            id: imageId,
            src: imageSrc,
            element: imageElement,
        };

        // Add visual indicator that image is selected for editing
        document
            .querySelectorAll(".chat-image-preview")
            .forEach((img) => img.classList.remove("selected-for-edit"));
        imageElement.classList.add("selected-for-edit");
    }
}

// Function to edit uploaded image from file
async function editUploadedImage(editPrompt, imageFile) {
    showTypingIndicator();

    try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("edit_prompt", editPrompt);
        formData.append("style", "photorealistic");
        formData.append("aspect_ratio", "1:1");

        // Convert file to base64
        const base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
        
        const response = await fetch(`${BASE_URL}/api/edit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image,
                edit_prompt: editPrompt,
                style: "photorealistic",
                aspect_ratio: "1:1"
            })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (data.status === "success" && data.image_base64) {
            const imageDataUrl = `data:image/png;base64,${data.image_base64}`;

            // Update the last generated image with the edited version
            lastGeneratedImage = {
                dataUrl: imageDataUrl,
                prompt: `Edited uploaded image: ${editPrompt}`,
                timestamp: Date.now(),
            };

            displayMessage(
                `Here's your edited image: "${editPrompt}"`,
                "bot",
                imageDataUrl,
                true,
            );
            addMessageToHistory(`Edited uploaded image: ${editPrompt}`, "bot");
        } else {
            displayMessage(
                `Sorry, I couldn't edit the image. Error: ${data.error || "Unknown error"}`,
                "bot",
            );
            addMessageToHistory(
                `Image editing failed: ${data.error || "Unknown error"}`,
                "bot",
            );
        }
    } catch (error) {
        console.error("Error editing uploaded image:", error);
        hideTypingIndicator();
        displayMessage("An error occurred while editing the image.", "bot");
        addMessageToHistory("Image editing failed due to network error", "bot");
    }
}

// Function to edit uploaded image from chat (base64)
async function editUploadedImageFromChat(editPrompt, imageDataUrl) {
    showTypingIndicator();

    try {
        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("image", blob, "uploaded_image.png");
        formData.append("edit_prompt", editPrompt);
        formData.append("style", "photorealistic");
        formData.append("aspect_ratio", "1:1");

        const apiResponse = await fetch(`${BASE_URL}/api/edit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageDataUrl,
                edit_prompt: editPrompt,
                style: "photorealistic",
                aspect_ratio: "1:1"
            })
        });

        if (!apiResponse.ok) {
            throw new Error(`API error! status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        hideTypingIndicator();

        if (data.status === "success" && data.image_base64) {
            const newImageDataUrl = `data:image/png;base64,${data.image_base64}`;

            // Update the last generated image with the edited version
            lastGeneratedImage = {
                dataUrl: newImageDataUrl,
                prompt: `Edited uploaded image: ${editPrompt}`,
                timestamp: Date.now(),
            };

            displayMessage(
                `Here's your edited image: "${editPrompt}"`,
                "bot",
                newImageDataUrl,
                true,
            );
            addMessageToHistory(`Edited uploaded image: ${editPrompt}`, "bot");

            // Clear the current uploaded image reference
            window.currentUploadedImageForEdit = null;
        } else {
            displayMessage(
                `Sorry, I couldn't edit the image. Error: ${data.error || "Unknown error"}`,
                "bot",
            );
            addMessageToHistory(
                `Image editing failed: ${data.error || "Unknown error"}`,
                "bot",
            );
        }
    } catch (error) {
        console.error("Error editing uploaded image from chat:", error);
        hideTypingIndicator();
        displayMessage("An error occurred while editing the image.", "bot");
        addMessageToHistory("Image editing failed due to network error", "bot");
    }
}

// Function to send message to API
async function sendMessage(prompt, imageFile = null) {
    // Check if this is a time-related query first
    if (!imageFile) {
        const timeResponse = handleTimeQuery(prompt);
        if (timeResponse) {
            displayMessage(timeResponse, "bot");
            addMessageToHistory(timeResponse, "bot");
            clearInputs();
            return;
        }
    }

    // Check if this is an image generation request
    if (!imageFile && isImageGenerationRequest(prompt)) {
        const imagePrompt = extractImagePrompt(prompt);
        await generateImage(imagePrompt);
        clearInputs();
        return;
    }

    // Check if this is an image edit request with uploaded image
    if (imageFile && isImageEditRequest(prompt, true)) {
        const editPrompt = extractEditPrompt(prompt);
        await editUploadedImage(editPrompt, imageFile);
        clearInputs();
        return;
    }

    // Check if this is an edit request for a previously uploaded image
    if (
        !imageFile &&
        isImageEditRequest(prompt) &&
        window.currentUploadedImageForEdit
    ) {
        const editPrompt = extractEditPrompt(prompt);
        await editUploadedImageFromChat(
            editPrompt,
            window.currentUploadedImageForEdit.src,
        );
        clearInputs();
        return;
    }

    // Check if this is an image edit request with generated image
    if (!imageFile && isImageEditRequest(prompt) && lastGeneratedImage) {
        const editPrompt = extractEditPrompt(prompt);
        await editImage(editPrompt);
        clearInputs();
        return;
    }

    // Handle image upload without text or with non-edit text
    if (imageFile && (prompt === "" || prompt.trim() === "")) {
        // If no text provided with image, auto-add "describe this image"
        prompt = "Describe this image in detail.";
    }

    showTypingIndicator();
    let response;
    try {
        if (imageFile) {
            const formData = new FormData();
            formData.append("message", prompt);
            formData.append("image", imageFile);
            formData.append("model", currentModel);
            formData.append("history", JSON.stringify(chatHistory)); // Add history to formData
            response = await fetch(`${BASE_URL}/api/chat-with-image`, {
                method: "POST",
                body: formData,
            });
        } else {
            response = await fetch(`${BASE_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: prompt,
                    history: chatHistory,
                    model: currentModel,
                }), // Send history
            });
        }

        const data = await response.json();
        hideTypingIndicator();

        if (data.status === "error") {
            const errorMsg = data.error || "An unexpected error occurred";
            displayMessage(`Sorry, I encountered an issue: ${errorMsg}`, "bot");
            addMessageToHistory(`Error: ${errorMsg}`, "bot");
        } else {
            const responseText = data.answer || data.response || "I received your message but couldn't generate a proper response.";
            displayMessage(responseText, "bot");
            addMessageToHistory(responseText, "bot");
        }
    } catch (error) {
        console.error("Error during message generation:", error);
        hideTypingIndicator();
        
        // Provide more helpful error messages
        let errorMessage = "I'm having trouble processing your request. ";
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += "Please check your internet connection and try again.";
        } else if (error.message.includes('timeout')) {
            errorMessage += "The request timed out. Please try again.";
        } else {
            errorMessage += "Please try again in a moment.";
        }
        
        displayMessage(errorMessage, "bot");
        addMessageToHistory(`Network error: ${error.message}`, "bot");
        
        // Don't block the interface - continue processing
        return;
    }
    clearInputs();
}

// Event listener for send button
sendButton.addEventListener("click", async () => {
    let prompt = messageInput.value.trim();
    const imageFile = imageInput.files[0];

    if (prompt === "" && !imageFile) return;

    // If image uploaded but no text, auto-add description prompt
    if (imageFile && (prompt === "" || prompt === undefined)) {
        prompt = "Describe this image in detail.";
    }

    // Add user message to history
    addMessageToHistory(prompt, "user");

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Show appropriate message based on whether prompt was auto-generated
            const displayPrompt =
                messageInput.value.trim() === ""
                    ? "Image uploaded (auto-analyzing)"
                    : prompt;
            displayMessage(displayPrompt, "user", e.target.result);
            sendMessage(prompt, imageFile);
        };
        reader.readAsDataURL(imageFile);
    } else {
        displayMessage(prompt, "user");
        sendMessage(prompt);
    }
});

// Event listener for image upload button
imageUploadButton.addEventListener("click", () => {
    imageInput.click();
});

// Event listener for message input (Enter key)
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Allow Shift+Enter for new line
        e.preventDefault(); // Prevent default behavior (new line)
        sendButton.click();
    }
});

// Event listener for message input (input and keyup for resizing and button visibility)
messageInput.addEventListener("input", () => {
    adjustTextareaHeight();
    toggleSendButton();
});

// Initial adjustment on page load
document.addEventListener('DOMContentLoaded', () => {
    adjustTextareaHeight();
    toggleSendButton();
});

// Event listener for image input change (no auto-submit)
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = "flex"; // Show the preview
            adjustTextareaHeight(); // Adjust textarea height when image is added
            toggleSendButton(); // Check send button visibility
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = "#";
        imagePreviewContainer.style.display = "none"; // Hide if no file
        adjustTextareaHeight(); // Adjust textarea height when image is removed
        toggleSendButton(); // Check send button visibility
    }
});

// Event listener for remove image button
removeImageButton.addEventListener("click", () => {
    imageInput.value = ""; // Clear the selected file
    imagePreview.src = "#";
    imagePreviewContainer.style.display = "none"; // Hide the preview
    toggleSendButton(); // Check send button visibility
});

// Event listener for clear input button
clearInputButton.addEventListener("click", () => {
    clearInputs();
});

// Function to clear inputs
function clearInputs() {
    messageInput.value = "";
    imageInput.value = "";
    imagePreview.src = "#";
    imagePreviewContainer.style.display = "none";
    adjustTextareaHeight(); // Reset textarea height
    toggleSendButton(); // Hide send button
}

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.querySelector("i").className = isDarkMode
        ? "fas fa-moon"
        : "fas fa-sun";
    localStorage.setItem("dark-mode", isDarkMode);
});

// Load theme preference
function loadThemePreference() {
    const isDarkMode = localStorage.getItem("dark-mode") === "true";
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        themeToggle.querySelector("i").className = "fas fa-moon";
    } else {
        themeToggle.querySelector("i").className = "fas fa-sun";
    }
}

// Model selection dropdown functionality
modelDisplay.addEventListener("click", () => {
    modelDropdown.classList.toggle("show");
    modelDisplay.querySelector(".dropdown-icon").style.transform =
        modelDropdown.classList.contains("show")
            ? "rotate(180deg)"
            : "rotate(0deg)";
});

// Populate model dropdown
function populateModelDropdown() {
    modelDropdown.innerHTML = "";
    for (const [id, name] of Object.entries(GEMINI_MODELS)) {
        const modelItem = document.createElement("div");
        modelItem.classList.add("model-dropdown-item");
        modelItem.dataset.modelId = id;
        modelItem.textContent = name;
        if (id === currentModel) {
            modelItem.classList.add("selected");
        }
        modelItem.addEventListener("click", () => {
            currentModel = id;
            selectedModelName.textContent = name;
            modelDropdown.classList.remove("show");
            modelDisplay.querySelector(".dropdown-icon").style.transform =
                "rotate(0deg)";
            updateSelectedModelInDropdown();
            saveChatHistory(); // Save chat history after model change
        });
        modelDropdown.appendChild(modelItem);
    }
}

function updateSelectedModelInDropdown() {
    document.querySelectorAll(".model-dropdown-item").forEach((item) => {
        item.classList.remove("selected");
        if (item.dataset.modelId === currentModel) {
            item.classList.add("selected");
        }
    });
}

// Close dropdown if clicked outside
document.addEventListener("click", (event) => {
    if (
        !modelDisplay.contains(event.target) &&
        !modelDropdown.contains(event.target)
    ) {
        modelDropdown.classList.remove("show");
        modelDisplay.querySelector(".dropdown-icon").style.transform =
            "rotate(0deg)";
    }
});

// Storage management functions
// Function to get current localStorage usage in bytes
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
}

// Function to clear all localStorage data
function clearAllStorage() {
    localStorage.clear();
    console.log('All localStorage data cleared due to 20MB size limit');
    
    // Reset chat interface
    chatHistory = [];
    chatWindow.innerHTML = '';
    lastGeneratedImage = null;
    
    // Show notification to user
    displayMessage('Storage limit reached (20MB). All chat history and cache have been automatically cleared to free up space.', 'bot');
    
    // Reset to default model
    currentModel = "gemini-2.0-flash";
    selectedModelName.textContent = GEMINI_MODELS[currentModel];
    
    // Show welcome message again since this is a fresh start
    setTimeout(() => {
        showWelcomeMessage();
    }, 2000); // Show welcome after storage clear notification
}

// Function to monitor storage usage
function checkStorageSize() {
    const currentSize = getStorageSize();
    const sizeMB = (currentSize / (1024 * 1024)).toFixed(2);
    
    if (currentSize >= MAX_STORAGE_SIZE) {
        console.warn(`Storage limit exceeded: ${sizeMB}MB. Clearing all data automatically.`);
        clearAllStorage();
        return true; // Indicates storage was cleared
    }
    return false;
}

// Function to start automatic storage monitoring
function startStorageMonitoring() {
    // Check immediately
    checkStorageSize();
    
    // Check every 10 seconds
    if (storageCheckInterval) {
        clearInterval(storageCheckInterval);
    }
    
    storageCheckInterval = setInterval(() => {
        checkStorageSize();
    }, 10000); // Check every 10 seconds
    
    console.log('Automatic storage monitoring started (20MB limit, checking every 10 seconds)');
}

// Function to show welcome message with features and commands
function showWelcomeMessage() {
    const welcomeMessage = `# Welcome to Advanced AI Chat! ✨

I'm here to help you with **text conversations**, **image generation**, **image analysis**, and **image editing**. Here are all the features and commands available:

## 🎨 **Image Generation Commands**
- \`/img [description]\` - Generate images
- \`/gen [description]\` - Generate images  
- \`/generate [description]\` - Generate images
- \`"generate an image of [description]"\` - Natural language
- \`"create an image of [description]"\` - Natural language
- \`"make an image of [description]"\` - Natural language

## ✏️ **Image Editing Commands**
- \`/edit [instruction]\` - Edit the last generated image
- \`"edit the image [instruction]"\` - Natural language
- Click the **Edit** button on any generated image
- Upload an image and use edit commands

## 💬 **Chat Features**
- **Multi-Model Support**: Switch between Gemini models using the dropdown
- **Image Upload**: Click the upload button to analyze images
- **Chat History**: Your conversations are automatically saved
- **Code Highlighting**: Code blocks are automatically formatted
- **Time Queries**: Ask for time in different countries
- **Date Calculations**: Calculate future/past dates

## 🌍 **Special Commands**
- Ask about time: \`"What time is it in London?"\`
- Date calculations: \`"What day will it be 30 days from now?"\`
- Image analysis: Upload any image and ask questions about it
- Multi-language support: Works in English and Bengali

## 🎯 **Pro Tips**
- **Chain Operations**: Generate an image, then edit it multiple times
- **Detailed Prompts**: More specific descriptions = better results
- **Model Selection**: Try different Gemini models for various tasks
- **Upload + Edit**: Upload your own images and edit them with AI

Ready to start creating? Try any command or just tell me what you'd like to do! 🚀`;

    displayMessage(welcomeMessage, "bot");
    addMessageToHistory("Welcome message with features and commands", "bot");
}

// Function to auto-clear and show welcome on every visit
function autoFreshStart() {
    // Always clear all localStorage data on every visit
    localStorage.clear();
    console.log('Auto-clearing all cache and history for fresh start');
    
    // Reset chat interface
    chatHistory = [];
    chatWindow.innerHTML = '';
    lastGeneratedImage = null;
    
    // Reset to default model
    currentModel = "gemini-2.0-flash";
    selectedModelName.textContent = GEMINI_MODELS[currentModel];
    
    // Repopulate model dropdown to ensure it works
    populateModelDropdown();
    
    // Always show welcome message for fresh start
    showWelcomeMessage();
}

// Chat history functionality
function saveChatHistory() {
    // Check storage size before saving
    if (checkStorageSize()) {
        return; // Storage was cleared, don't try to save
    }
    
    try {
        // Limit chat history HTML to prevent quota exceeded
        const htmlContent = chatWindow.innerHTML;
        if (htmlContent.length > 50000) {
            // If too large, only save last part
            const messages = chatWindow.querySelectorAll('.message');
            if (messages.length > 10) {
                // Keep only last 10 messages
                const recentMessages = Array.from(messages).slice(-10);
                const tempDiv = document.createElement('div');
                recentMessages.forEach(msg => tempDiv.appendChild(msg.cloneNode(true)));
                localStorage.setItem("chat-history-html", tempDiv.innerHTML);
            } else {
                localStorage.setItem("chat-history-html", htmlContent);
            }
        } else {
            localStorage.setItem("chat-history-html", htmlContent);
        }
        
        // Limit chat history data
        const limitedHistory = chatHistory.slice(-20); // Keep only last 20 messages
        localStorage.setItem("chat-history-data", JSON.stringify(limitedHistory));
        localStorage.setItem("selected-model", currentModel);
        
        // Check size after saving
        checkStorageSize();
        
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded during save, clearing all data');
            clearAllStorage();
        } else {
            console.error('Error saving chat history:', error);
        }
    }
}

function loadChatHistory() {
    const savedChatHtml = localStorage.getItem("chat-history-html");
    if (savedChatHtml) {
        chatWindow.innerHTML = savedChatHtml;
        // Re-highlight code blocks after loading from local storage
        chatWindow.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
            const copyButton =
                block.parentElement.querySelector(".copy-button");
            if (copyButton) {
                copyButton.onclick = () => {
                    navigator.clipboard
                        .writeText(block.textContent)
                        .then(() => {
                            copyButton.innerText = "Copied!";
                            setTimeout(
                                () => (copyButton.innerText = "Copy"),
                                2000,
                            );
                        });
                };
            }
        });
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    const savedChatData = localStorage.getItem("chat-history-data");
    if (savedChatData) {
        chatHistory = JSON.parse(savedChatData);
    }

    const savedModel = localStorage.getItem("selected-model");
    if (savedModel && GEMINI_MODELS[savedModel]) {
        currentModel = savedModel;
        selectedModelName.textContent = GEMINI_MODELS[savedModel];
    } else {
        selectedModelName.textContent = GEMINI_MODELS[currentModel];
    }
    populateModelDropdown();
}

// Global error handler to prevent unhandled promise rejections
window.addEventListener("unhandledrejection", function (event) {
    console.warn("Handled unhandled promise rejection:", event.reason);
    event.preventDefault(); // Prevent the default behavior (showing error in console)
    
    // If it's an API error, show a user-friendly message
    if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
        displayMessage("Connection issue detected. Please try your request again.", "bot");
    }
});

// Global error handler for window errors
window.addEventListener("error", function (event) {
    console.warn("Handled global error:", event.error);
    // Don't show error messages for script loading errors or minor issues
    event.preventDefault();
});

// Global error handler for general errors
window.addEventListener("error", function (event) {
    console.warn("Handled global error:", event.error);
    event.preventDefault();
});

// Initialize with storage monitoring
loadThemePreference();
startStorageMonitoring();

// Display current storage usage
const currentSize = getStorageSize();
const sizeMB = (currentSize / (1024 * 1024)).toFixed(2);
console.log(`Initial storage usage: ${sizeMB}MB / 20MB`);

// Don't load chat history since we auto-clear everything
// loadChatHistory(); // Commented out since we always start fresh

// Always auto-clear and show welcome on every visit
setTimeout(() => {
    autoFreshStart();
}, 500); // Small delay to ensure page is ready

// Initial adjustments
adjustTextareaHeight();
toggleSendButton();
