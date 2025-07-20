class SonarChat {
    constructor() {
        this.currentModel = "sonar(clinesp)";
        this.messages = [];
        this.chatHistory = [];
        this.currentChatId = null;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.updateModelDisplay();
        
        // Auto-resize textarea
        this.setupTextareaResize();
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Character count
        messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
        });

        // Model selection
        const modelSelect = document.getElementById('modelSelect');
        modelSelect.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.updateModelDisplay();
        });

        // New chat
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.startNewChat();
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            authManager.showAuthModal();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    setupTextareaResize() {
        const textarea = document.getElementById('messageInput');
        
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    updateCharCount() {
        const messageInput = document.getElementById('messageInput');
        const charCount = document.getElementById('charCount');
        const currentLength = messageInput.value.length;
        
        charCount.textContent = `${currentLength}/4000`;
        
        if (currentLength > 3800) {
            charCount.style.color = '#dc2626';
        } else if (currentLength > 3500) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#6b7280';
        }
    }

    toggleSendButton() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        sendBtn.disabled = !messageInput.value.trim() || this.isTyping;
    }

    updateModelDisplay() {
        const currentModelSpan = document.getElementById('currentModel');
        const modelName = API_CONFIG.MODELS[this.currentModel];
        currentModelSpan.textContent = modelName;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    startNewChat() {
        this.messages = [];
        this.currentChatId = this.generateChatId();
        
        // Hide messages container and show welcome message
        document.getElementById('messagesContainer').style.display = 'none';
        document.getElementById('welcomeMessage').style.display = 'flex';
        
        // Clear input
        document.getElementById('messageInput').value = '';
        this.updateCharCount();
        this.toggleSendButton();
        
        // Update chat history UI
        this.updateChatHistoryUI();
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || this.isTyping) return;

        // Create new chat if needed
        if (!this.currentChatId) {
            this.currentChatId = this.generateChatId();
        }

        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        this.updateCharCount();
        this.toggleSendButton();

        // Show loading
        this.showLoading();
        this.isTyping = true;

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide loading
            this.hideLoading();
            
            // Add AI response with typing animation
            await this.addMessageWithTyping('assistant', response);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideLoading();
            this.addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please try again.');
        }

        this.isTyping = false;
        this.toggleSendButton();
        
        // Save chat
        this.saveChatHistory();
    }

    addMessage(role, content) {
        const message = {
            id: Date.now(),
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();

        // Hide welcome message and show messages container
        if (this.messages.length === 1) {
            document.getElementById('welcomeMessage').style.display = 'none';
            document.getElementById('messagesContainer').style.display = 'block';
        }
    }

    async addMessageWithTyping(role, content) {
        const message = {
            id: Date.now(),
            role: role,
            content: '',
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        const messageElement = this.renderMessage(message);
        const messageText = messageElement.querySelector('.message-text');
        
        // Add typing cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        messageText.appendChild(cursor);

        // Type out the message
        for (let i = 0; i < content.length; i++) {
            message.content += content[i];
            messageText.textContent = message.content;
            messageText.appendChild(cursor);
            
            // Scroll to bottom during typing
            this.scrollToBottom();
            
            // Random delay between characters for realistic typing
            const delay = Math.random() * 30 + 10;
            await this.sleep(delay);
        }

        // Remove cursor
        cursor.remove();
        
        // Final scroll
        this.scrollToBottom();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        messageDiv.dataset.messageId = message.id;

        const avatar = message.role === 'user' ? 
            (authManager.currentUser?.displayName?.charAt(0) || 'U') : 'AI';

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">${avatar}</div>
                <div class="message-text">${this.formatMessage(message.content)}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        return messageDiv;
    }

    formatMessage(content) {
        // Basic markdown-like formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        // Handle code blocks
        formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        return formatted;
    }

    scrollToBottom() {
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    async getAIResponse(message) {
        const requestBody = {
            model: this.currentModel,
            messages: [
                {
                    role: "system",
                    content: "You are Sonar AI, a helpful and intelligent assistant. Provide clear, accurate, and helpful responses."
                },
                ...this.messages.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 2000,
            temperature: 0.7,
            stream: false
        };

        const response = await fetch(API_CONFIG.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from API');
        }
    }

    saveChatHistory() {
        if (!this.currentChatId || this.messages.length === 0) return;

        const chatData = {
            id: this.currentChatId,
            title: this.generateChatTitle(),
            messages: this.messages,
            model: this.currentModel,
            createdAt: this.messages[0]?.timestamp || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Update or add to chat history
        const existingIndex = this.chatHistory.findIndex(chat => chat.id === this.currentChatId);
        if (existingIndex >= 0) {
            this.chatHistory[existingIndex] = chatData;
        } else {
            this.chatHistory.unshift(chatData);
        }

        // Limit chat history to 50 chats
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(0, 50);
        }

        // Save to localStorage
        localStorage.setItem('sonar_chat_history', JSON.stringify(this.chatHistory));
        
        // Update UI
        this.updateChatHistoryUI();
    }

    loadChatHistory() {
        const saved = localStorage.getItem('sonar_chat_history');
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
                this.updateChatHistoryUI();
            } catch (error) {
                console.error('Error loading chat history:', error);
                this.chatHistory = [];
            }
        }
    }

    generateChatTitle() {
        if (this.messages.length === 0) return 'New Chat';
        
        const firstUserMessage = this.messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            let title = firstUserMessage.content.substring(0, 50);
            if (firstUserMessage.content.length > 50) {
                title += '...';
            }
            return title;
        }
        
        return 'New Chat';
    }

    updateChatHistoryUI() {
        const chatHistoryContainer = document.getElementById('chatHistory');
        chatHistoryContainer.innerHTML = '';

        this.chatHistory.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (chat.id === this.currentChatId) {
                chatItem.classList.add('active');
            }
            
            chatItem.textContent = chat.title;
            chatItem.title = chat.title;
            
            chatItem.addEventListener('click', () => {
                this.loadChat(chat.id);
            });

            chatHistoryContainer.appendChild(chatItem);
        });
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.messages = [...chat.messages];
        this.currentModel = chat.model || "sonar(clinesp)";

        // Update model selector
        document.getElementById('modelSelect').value = this.currentModel;
        this.updateModelDisplay();

        // Clear and render messages
        document.getElementById('messagesContainer').innerHTML = '';
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('messagesContainer').style.display = 'block';

        this.messages.forEach(message => {
            this.renderMessage(message);
        });

        this.scrollToBottom();
        this.updateChatHistoryUI();

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }
}

// Initialize the chat application
document.addEventListener('DOMContentLoaded', () => {
    window.sonarChat = new SonarChat();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
});
