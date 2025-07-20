
Built by https://www.blackbox.ai

---

# Sonar AI Chat

## Project Overview
Sonar AI Chat is a web-based application that serves as an intelligent chatbot powered by advanced language models. It allows users to engage in conversations with AI in an interactive and user-friendly interface. The application is integrated with Firebase for user authentication and supports multiple AI models to enhance the conversation experience.

## Installation
To set up the Sonar AI Chat application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sonar-ai-chat.git
   cd sonar-ai-chat
   ```

2. **Open the `index.html` file in your web browser:**  
   The application has no external dependencies beyond standard HTML, CSS, and JavaScript, so it runs directly from the browser.

## Usage
Once you open `index.html`, you will be greeted with the welcome message. Use the following features to engage with the AI:

- **Sign in:** Use the "Login" button to either login via Google or create an account via email.
- **Start a New Chat:** Click the "New Chat" button to initiate a fresh conversation.
- **Interact with AI:** Type your message in the input box and press the send button (or hit Enter) to send your message to the AI.
- **Select AI Models:** Choose from the available AI models using the dropdown menu below the chat history.

## Features
- User authentication through Firebase (Google Sign-In or Email).
- Multiple AI models to customize conversations.
- Chat history management: save and retrieve chat sessions.
- Responsive design for both desktop and mobile devices.

## Dependencies
The application relies on the following external libraries:
- **Firebase SDK** for authentication and real-time features
  - Loaded via CDN in `index.html`:
    ```html
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    ```
- **Font Awesome** for icons:
  - Loaded via CDN in `index.html`:
    ```html
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    ```

## Project Structure
The Sonar AI Chat project is structured as follows:

```plaintext
sonar-ai-chat/
│
├── index.html         # Main HTML file for the chat application
├── settings.html      # Settings page for user profile and AI models
├── styles.css         # CSS styles for the application layout and design
├── config.js          # API configuration settings (including Firebase setup)
├── auth.js            # User authentication logic
└── script.js          # Main application logic and chat management
```

### File Descriptions:
- **index.html**: The entry point of the application that brings together all components.
- **settings.html**: A separate page for adjusting user settings and preferences.
- **styles.css**: Contains the styles for the entire application, enhancing UI/UX.
- **config.js**: Holds configuration details for Firebase and API endpoints.
- **auth.js**: Implements authentication logic and manages user sessions.
- **script.js**: Handles the core functionality of the chat, including message sending and receiving logic.

## Notes
- Please ensure that the API key and project configurations in `config.js` are set up properly to utilize features such as messaging and user authentication.
- To deploy the application, consider using a hosting provider that supports static sites.