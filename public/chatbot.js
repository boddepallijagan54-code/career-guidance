document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("chat-send");

    // Add message to chat window
    function addMessage(text, sender = "bot") {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");

        if (sender === "user") {
            messageDiv.classList.add("user-message");
        } else {
            messageDiv.classList.add("bot-message");
        }

        messageDiv.innerHTML = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Send message to backend
    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        // Show user message
        addMessage(question, "user");
        chatInput.value = "";

        // Show loading message
        addMessage("Typing...", "bot");

        try {
            const response = await fetch("/api/ai-guidance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            // Remove "Typing..."
            chatWindow.removeChild(chatWindow.lastChild);

            if (data.answer) {
                addMessage(data.answer.replace(/\n/g, "<br>"), "bot");
            } else {
                addMessage("Sorry, I couldn't understand that.", "bot");
            }
        } catch (error) {
            chatWindow.removeChild(chatWindow.lastChild);
            addMessage("⚠️ Unable to connect to the server.", "bot");
            console.error(error);
        }
    }

    // Button click
    sendButton.addEventListener("click", sendMessage);

    // Enter key support
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
