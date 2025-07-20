// API Configuration
const API_CONFIG = {
    BASE_URL: "https://samuraiapi.in/v1/chat/completions",
    API_KEY: "sk-3uojvVgjgi1BMJXTRPy7J3e28HwrTat0jgncVNjcKwFdUi18",
    MODELS: {
        "sonar(clinesp)": "Sonar (Clinesp)",
        "groq/moonshotai/kimi-k2-instruct": "Kimi K2 Instruct", 
        "sonar-reasoning-pro(clinesp)": "Sonar Reasoning Pro",
        "sonar-reasoning(clinesp)": "Sonar Reasoning"
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
