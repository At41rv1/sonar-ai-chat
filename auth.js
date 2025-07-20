// Firebase Auth instance
const auth = firebase.auth();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUI();
            
            if (user) {
                console.log('User signed in:', user.email);
                this.saveUserData(user);
            } else {
                console.log('User signed out');
                this.clearUserData();
            }
        });
    }

    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const userEmail = document.getElementById('userEmail');
        const loginBtn = document.getElementById('loginBtn');

        if (this.currentUser) {
            userEmail.textContent = this.currentUser.email;
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = () => this.signOut();
        } else {
            userEmail.textContent = 'Not logged in';
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => this.showAuthModal();
        }
    }

    async signInWithGoogle() {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;
            console.log('Google sign-in successful:', user.email);
            this.closeAuthModal();
            return user;
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showError('Google sign-in failed: ' + error.message);
            throw error;
        }
    }

    async signInWithEmail(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            console.log('Email sign-in successful:', result.user.email);
            this.closeAuthModal();
            return result.user;
        } catch (error) {
            console.error('Email sign-in error:', error);
            this.showError('Sign-in failed: ' + this.getErrorMessage(error.code));
            throw error;
        }
    }

    async signUpWithEmail(email, password) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            console.log('Email sign-up successful:', result.user.email);
            this.closeAuthModal();
            return result.user;
        } catch (error) {
            console.error('Email sign-up error:', error);
            this.showError('Sign-up failed: ' + this.getErrorMessage(error.code));
            throw error;
        }
    }

    async signOut() {
        try {
            await auth.signOut();
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }

    saveUserData(user) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('sonar_user', JSON.stringify(userData));
    }

    clearUserData() {
        localStorage.removeItem('sonar_user');
    }

    getUserData() {
        const userData = localStorage.getItem('sonar_user');
        return userData ? JSON.parse(userData) : null;
    }

    showAuthModal() {
        // Create modal if it doesn't exist
        if (!document.getElementById('authModal')) {
            this.createAuthModal();
        }
        document.getElementById('authModal').style.display = 'flex';
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    createAuthModal() {
        const modalHTML = `
            <div id="authModal" class="auth-modal">
                <div class="auth-modal-content">
                    <div class="auth-header">
                        <h2>Welcome to Sonar AI</h2>
                        <button class="close-btn" onclick="authManager.closeAuthModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="authManager.showTab('login')">Login</button>
                        <button class="auth-tab" onclick="authManager.showTab('signup')">Sign Up</button>
                    </div>

                    <div id="loginTab" class="auth-tab-content active">
                        <form id="loginForm" class="auth-form">
                            <div class="form-group">
                                <input type="email" id="loginEmail" placeholder="Email" required>
                            </div>
                            <div class="form-group">
                                <input type="password" id="loginPassword" placeholder="Password" required>
                            </div>
                            <button type="submit" class="auth-btn primary">Sign In</button>
                        </form>
                        
                        <div class="divider">
                            <span>or</span>
                        </div>
                        
                        <button class="auth-btn google" onclick="authManager.signInWithGoogle()">
                            <i class="fab fa-google"></i>
                            Continue with Google
                        </button>
                    </div>

                    <div id="signupTab" class="auth-tab-content">
                        <form id="signupForm" class="auth-form">
                            <div class="form-group">
                                <input type="email" id="signupEmail" placeholder="Email" required>
                            </div>
                            <div class="form-group">
                                <input type="password" id="signupPassword" placeholder="Password" required minlength="6">
                            </div>
                            <div class="form-group">
                                <input type="password" id="confirmPassword" placeholder="Confirm Password" required minlength="6">
                            </div>
                            <button type="submit" class="auth-btn primary">Create Account</button>
                        </form>
                        
                        <div class="divider">
                            <span>or</span>
                        </div>
                        
                        <button class="auth-btn google" onclick="authManager.signInWithGoogle()">
                            <i class="fab fa-google"></i>
                            Continue with Google
                        </button>
                    </div>

                    <div id="authError" class="auth-error" style="display: none;"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupAuthForms();
        this.addAuthStyles();
    }

    setupAuthForms() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await this.signInWithEmail(email, password);
            } catch (error) {
                // Error already handled in signInWithEmail
            }
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                this.showError('Passwords do not match');
                return;
            }

            try {
                await this.signUpWithEmail(email, password);
            } catch (error) {
                // Error already handled in signUpWithEmail
            }
        });
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="authManager.showTab('${tabName}')"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.auth-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');

        // Clear error
        this.hideError();
    }

    showError(message) {
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('authError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'Email is already registered',
            'auth/weak-password': 'Password should be at least 6 characters',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later'
        };
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    addAuthStyles() {
        if (document.getElementById('authStyles')) return;

        const styles = `
            <style id="authStyles">
                .auth-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }

                .auth-modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .auth-header {
                    padding: 24px 24px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .auth-header h2 {
                    font-size: 24px;
                    font-weight: 600;
                    color: #374151;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 4px;
                }

                .auth-tabs {
                    display: flex;
                    padding: 0 24px;
                    margin-top: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .auth-tab {
                    flex: 1;
                    padding: 12px 0;
                    background: none;
                    border: none;
                    font-size: 16px;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }

                .auth-tab.active {
                    color: #10a37f;
                    border-bottom-color: #10a37f;
                }

                .auth-tab-content {
                    display: none;
                    padding: 24px;
                }

                .auth-tab-content.active {
                    display: block;
                }

                .auth-form {
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #10a37f;
                    box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
                }

                .auth-btn {
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .auth-btn.primary {
                    background-color: #10a37f;
                    color: white;
                }

                .auth-btn.primary:hover {
                    background-color: #0d8f6f;
                }

                .auth-btn.google {
                    background-color: white;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    margin-top: 12px;
                }

                .auth-btn.google:hover {
                    background-color: #f9fafb;
                }

                .divider {
                    text-align: center;
                    margin: 20px 0;
                    position: relative;
                    color: #6b7280;
                }

                .divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background-color: #e5e7eb;
                }

                .divider span {
                    background-color: white;
                    padding: 0 16px;
                }

                .auth-error {
                    margin-top: 16px;
                    padding: 12px;
                    background-color: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    color: #dc2626;
                    font-size: 14px;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// Export for global access
window.authManager = authManager;
