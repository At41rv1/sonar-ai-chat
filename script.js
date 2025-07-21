
class At41rvChat {
    constructor() {
        this.currentModel = "chatgpt-4o-latest(clinesp)";
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
        this.populateModelGrid();
        
        // Auto-resize textarea
        this.setupTextareaResize();
    }

    populateModelGrid() {
        const modelGrid = document.getElementById('modelGrid');
        if (!modelGrid) return;
        
        modelGrid.innerHTML = '';

        // Group models by category
        const modelCategories = {
            'GPT Models': [
                'chatgpt-4o-latest(clinesp)',
                'chatgpt-4o-latest(clinesp)',
                'gpt-4(clinesp)',
                'gpt-4-turbo(clinesp)',
                'gpt-4.1(clinesp)',
                'gpt-4.1-mini(clinesp)',
                'gpt-4.1-nano(clinesp)'
            ],
            'Claude Models': [
                'claude-3.5-sonnet(clinesp)',
                'claude-3.5-haiku(clinesp)',
                'claude-3.7-sonnet(clinesp)',
                'claude-opus-4(clinesp)',
                'claude-sonnet-4(clinesp)'
            ],
            'Grok Models': [
                'grok-3(clinesp)',
                'grok-3-beta(clinesp)',
                'grok-3-mini(clinesp)',
                'Paid/xai/grok-4'
            ]
        };

        // Create model cards for each category
        Object.entries(modelCategories).forEach(([category, models]) => {
            models.forEach(modelKey => {
                if (API_CONFIG.MODELS[modelKey]) {
                    const modelCard = document.createElement('div');
                    modelCard.className = 'model-card';
                    modelCard.dataset.model = modelKey;
                    
                    if (modelKey === this.currentModel) {
                        modelCard.classList.add('active');
                    }

                    const modelName = API_CONFIG.MODELS[modelKey];
                    const provider = this.getModelProvider(modelKey);

                    modelCard.innerHTML = `
                        <div class="model-name">${modelName}</div>
                        <div class="model-provider">${provider}</div>
                    `;

                    modelCard.addEventListener('click', () => {
                        this.selectModel(modelKey);
                    });

                    modelGrid.appendChild(modelCard);
                }
            });
        });
    }

    getModelProvider(modelKey) {
        if (modelKey.includes('gpt') || modelKey.includes('chatgpt')) return 'OpenAI';
        if (modelKey.includes('claude')) return 'Anthropic';
        if (modelKey.includes('grok')) return 'xAI';
        return 'AI Provider';
    }

    selectModel(modelKey) {
        this.currentModel = modelKey;
        this.updateModelDisplay();
        this.updateModelGrid();
    }

    updateModelGrid() {
        const modelCards = document.querySelectorAll('.model-card');
        modelCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.model === this.currentModel) {
                card.classList.add('active');
            }
        });
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
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
        }

        // New chat
        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.startNewChat();
            });
        }

        // Settings
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                if (window.authManager) {
                    authManager.showAuthModal();
                }
            });
        }

        // Panel toggle
        const panelToggle = document.getElementById('panelToggle');
        if (panelToggle) {
            panelToggle.addEventListener('click', () => {
                this.togglePanel();
            });
        }

        // Close panel on mobile when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('leftPanel');
            const panelToggle = document.getElementById('panelToggle');
            
            if (window.innerWidth <= 768 && 
                panel && panelToggle &&
                !panel.contains(e.target) && 
                !panelToggle.contains(e.target) &&
                panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
        });
    }

    setupTextareaResize() {
        const textarea = document.getElementById('messageInput');
        if (!textarea) return;
        
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    updateCharCount() {
        const messageInput = document.getElementById('messageInput');
        const charCount = document.getElementById('charCount');
        
        if (!messageInput || !charCount) return;
        
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
        
        if (!messageInput || !sendBtn) return;
        
        sendBtn.disabled = !messageInput.value.trim() || this.isTyping;
    }

    updateModelDisplay() {
        const currentModelSpan = document.getElementById('currentModel');
        if (!currentModelSpan) return;
        
        const modelName = API_CONFIG.MODELS[this.currentModel];
        currentModelSpan.textContent = modelName;
    }

    togglePanel() {
        const panel = document.getElementById('leftPanel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }

    startNewChat() {
        this.messages = [];
        this.currentChatId = this.generateChatId();
        
        // Hide messages container and show welcome message
        const messagesContainer = document.getElementById('messagesContainer');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (messagesContainer) messagesContainer.style.display = 'none';
        if (welcomeMessage) welcomeMessage.style.display = 'flex';
        
        // Clear input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = '';
        }
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
        if (!messageInput) return;
        
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

        // Set typing state
        this.isTyping = true;

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Add AI response instantly without animation
            this.addMessage('assistant', response);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
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
            const welcomeMessage = document.getElementById('welcomeMessage');
            const messagesContainer = document.getElementById('messagesContainer');
            
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            if (messagesContainer) messagesContainer.style.display = 'block';
        }
    }

    async addMessageWithTyping(role, content) {
        // Removed typing animation - messages appear instantly
        this.addMessage(role, content);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return null;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        messageDiv.dataset.messageId = message.id;

        const userAvatar = window.authManager?.currentUser?.displayName?.charAt(0) || 
                          window.authManager?.currentUser?.email?.charAt(0) || 'U';
        const avatar = message.role === 'user' ? userAvatar : 'AI';

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-bubble">
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
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    async getAIResponse(message) {
        const requestBody = {
            model: this.currentModel,
            messages: [
                {
                    role: "system",
                    content: "You are At41rv AI, a helpful and intelligent assistant. Provide clear, accurate, and helpful responses."
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
        localStorage.setItem('at41rv_chat_history', JSON.stringify(this.chatHistory));
        
        // Update UI
        this.updateChatHistoryUI();
    }

    loadChatHistory() {
        const saved = localStorage.getItem('at41rv_chat_history');
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
            let title = firstUserMessage.content.substring(0, 40);
            if (firstUserMessage.content.length > 40) {
                title += '...';
            }
            return title;
        }
        
        return 'New Chat';
    }

    updateChatHistoryUI() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        chatList.innerHTML = '';

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

            chatList.appendChild(chatItem);
        });
    }

    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.messages = [...chat.messages];
        this.currentModel = chat.model || "gpt-4o-search-preview(clinesp)";

        // Update model display and grid
        this.updateModelDisplay();
        this.updateModelGrid();

        // Clear and render messages
        const messagesContainer = document.getElementById('messagesContainer');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            messagesContainer.style.display = 'block';
        }
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        this.messages.forEach(message => {
            this.renderMessage(message);
        });

        this.scrollToBottom();
        this.updateChatHistoryUI();

        // Close panel on mobile
        if (window.innerWidth <= 768) {
            const leftPanel = document.getElementById('leftPanel');
            if (leftPanel) {
                leftPanel.classList.remove('open');
            }
        }
    }
}

// Initialize the chat application
document.addEventListener('DOMContentLoaded', () => {
    window.at41rvChat = new At41rvChat();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const leftPanel = document.getElementById('leftPanel');
        if (leftPanel) {
            leftPanel.classList.remove('open');
        }
    }
});
