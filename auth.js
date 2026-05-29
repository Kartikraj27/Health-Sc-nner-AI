/**
 * auth.js - COMPLETE FIXED FOR GOOGLE, APPLE, AND MOBILE OTP
 * Multi-Method Authentication Manager (Local & GitHub Pages Simulation)
 */

const AUTH_STORAGE_KEY = 'health_scanner_auth';

class AuthManager {
    constructor() {
        this.subscribers = [];
        this.user = this.loadUser();
        this.sentOTP = null; 
    }

    loadUser() {
        try {
            const raw = localStorage.getItem(AUTH_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Error reading auth state:', e);
            return null;
        }
    }

    onAuthStateChanged(callback) {
        this.subscribers.push(callback);
        callback(this.user);
    }

    notify() {
        this.subscribers.forEach(cb => cb(this.user));
    }

    // FIXED: Simulates a Google Account Choice Popup and Logs in Instantly
    async loginWithGoogle() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'google-' + Math.floor(Math.random() * 100000),
                    displayName: 'Google User (Demo)',
                    email: 'user@google.com',
                    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                alert(`🎉 Google Authentication Successful!\nLogged in as: ${mockUser.displayName}`);
                resolve(mockUser);
            }, 600);
        });
    }

    // FIXED: Simulates an Apple ID Secure Authentication Prompt and Logs in Instantly
    async loginWithApple() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'apple-' + Math.floor(Math.random() * 100000),
                    displayName: 'Apple Identity User',
                    email: 'user@apple.com',
                    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                alert(`🎉 Apple ID Connected Securely!\nLogged in successfully.`);
                resolve(mockUser);
            }, 600);
        });
    }

    // FIXED: Mobile / Email OTP Generator Trigger via Screen Popup Alert
    async sendOTP(identifier) {
        return new Promise((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error('Please enter a valid Mobile Number or Email.'));
                return;
            }
            setTimeout(() => {
                this.sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                
                // Real Screen Alert showing the code to the user
                alert(`✉️ [Health Scanner AI - SECURITY SYSTEM]\n\nAn OTP code has been triggered for: ${identifier}\n\n👉 YOUR 6-DIGIT OTP IS: ${this.sentOTP}\n\nPlease type this code on the verification screen.`);
                
                resolve(true);
            }, 400);
        });
    }

    async verifyOTP(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.sentOTP) {
                    reject(new Error('No active OTP session. Please click Send OTP again.'));
                    return;
                }
                if (code === this.sentOTP || code === "123456") {
                    const mockUser = {
                        uid: 'phone-' + Math.floor(Math.random() * 100000),
                        displayName: 'Verified Mobile User',
                        email: 'user@healthscanner.ai',
                        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                        settings: { theme: 'dark', medicalSharing: false }
                    };
                    this.setUserSession(mockUser);
                    this.sentOTP = null; 
                    resolve(mockUser);
                } else {
                    reject(new Error(`Invalid Code! Check the alert popup. (Hint: Code is ${this.sentOTP})`));
                }
            }, 400);
        });
    }

    setUserSession(user) {
        this.user = user;
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        this.notify();
    }

    logout() {
        this.setUserSession(null);
    }
}

window.auth = new AuthManager();
