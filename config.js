// API Configuration
const API_CONFIG = {
    BASE_URL: "https://samuraiapi.in/v1/chat/completions",
    API_KEY: "sk-3uojvVgjgi1BMJXTRPy7J3e28HwrTat0jgncVNjcKwFdUi18",
    MODELS: {
        "gpt-4o-search-preview(clinesp)": "GPT-4o Search Preview",
        "chatgpt-4o-latest(clinesp)": "ChatGPT-4o Latest",
        "gpt-4(clinesp)": "GPT-4",
        "gpt-4-0314(clinesp)": "GPT-4 (0314)",
        "gpt-4-1106-preview(clinesp)": "GPT-4 Turbo Preview",
        "gpt-4-turbo(clinesp)": "GPT-4 Turbo",
        "gpt-4-turbo-preview(clinesp)": "GPT-4 Turbo Preview",
        "gpt-4.1(clinesp)": "GPT-4.1",
        "gpt-4.1-mini(clinesp)": "GPT-4.1 Mini",
        "gpt-4.1-nano(clinesp)": "GPT-4.1 Nano",
        "claude-opus-4(clinesp)": "Claude Opus 4",
        "grok-3(clinesp)": "Grok 3",
        "grok-3-beta(clinesp)": "Grok 3 Beta",
        "grok-3-mini(clinesp)": "Grok 3 Mini",
        "grok-3-mini-beta(clinesp)": "Grok 3 Mini Beta",
        "provider9-grok-3-beta": "Grok 3 Beta (Provider9)",
        "Paid/xai/grok-3-beta": "Grok 3 Beta (XAI)",
        "Paid/xai/grok-3-fast-beta": "Grok 3 Fast Beta",
        "Paid/xai/grok-3-mini-beta": "Grok 3 Mini Beta (XAI)",
        "Paid/xai/grok-3-mini-fast-beta": "Grok 3 Mini Fast Beta",
        "Paid/xai/grok-4": "Grok 4",
        "claude-3.5-haiku(clinesp)": "Claude 3.5 Haiku",
        "claude-3.5-haiku-20241022(clinesp)": "Claude 3.5 Haiku (Oct 2024)",
        "claude-3.5-sonnet(clinesp)": "Claude 3.5 Sonnet",
        "claude-3.5-sonnet-20240620(clinesp)": "Claude 3.5 Sonnet (Jun 2024)",
        "claude-3.7-sonnet(clinesp)": "Claude 3.7 Sonnet",
        "claude-sonnet-4(clinesp)": "Claude Sonnet 4",
        "Paid/anthropic/claude-3-5-haiku-20241022": "Claude 3.5 Haiku (Anthropic)",
        "Paid/anthropic/claude-3-5-sonnet-20241022": "Claude 3.5 Sonnet (Anthropic)",
        "Paid/anthropic/claude-3-7-sonnet-20250219": "Claude 3.7 Sonnet (Anthropic)",
        "Paid/anthropic/claude-4-opus-20250514": "Claude 4 Opus (Anthropic)",
        "Paid/anthropic/claude-4-sonnet-20250514": "Claude 4 Sonnet (Anthropic)",
        "Paid/bedrock/us.anthropic.claude-3-5-haiku-20241022-v1:0": "Claude 3.5 Haiku (Bedrock)",
        "Paid/bedrock/us.anthropic.claude-3-5-sonnet-20240620-v1:0": "Claude 3.5 Sonnet (Bedrock)",
        "Paid/bedrock/us.anthropic.claude-3-5-sonnet-20241022-v2:0": "Claude 3.5 Sonnet v2 (Bedrock)",
        "Paid/bedrock/us.anthropic.claude-3-7-sonnet-20250219-v1:0": "Claude 3.7 Sonnet (Bedrock)",
        "Paid/bedrock/us.anthropic.claude-opus-4-20250514-v1:0": "Claude Opus 4 (Bedrock)",
        "Paid/bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0": "Claude Sonnet 4 (Bedrock)",
        "Paid/vertex/claude-3-5-haiku@20241022": "Claude 3.5 Haiku (Vertex)",
        "Paid/vertex/claude-3-5-sonnet-v2@20241022": "Claude 3.5 Sonnet v2 (Vertex)",
        "Paid/vertex/claude-3-5-sonnet@20240620": "Claude 3.5 Sonnet (Vertex)",
        "Paid/vertex/claude-3-7-sonnet@20250219": "Claude 3.7 Sonnet (Vertex)",
        "Paid/vertex/claude-opus-4@20250514": "Claude Opus 4 (Vertex)",
        "Paid/vertex/claude-sonnet-4@20250514": "Claude Sonnet 4 (Vertex)"
    }
};

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQYAfh41gK1ks2h-wE8pHgxa2FFSVIAaI",
    authDomain: "sonar-76527.firebaseapp.com",
    projectId: "sonar-76527",
    storageBucket: "sonar-76527.appspot.com",
    messagingSenderId: "366260028966",
    appId: "1:366260028966:web:cad5672ae9b90fb5e048e7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export configurations
window.API_CONFIG = API_CONFIG;
window.firebaseConfig = firebaseConfig;
