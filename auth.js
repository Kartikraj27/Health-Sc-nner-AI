/**
 * auth.js - FIXED FOR OTP DISPLAY
 * Multi-Method Authentication Manager (Local & GitHub Pages Simulation)
 */

const AUTH_STORAGE_KEY = 'health_scanner_auth';
const SETTINGS_STORAGE_KEY = 'health_scanner_settings';

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

    async loginWithGoogle() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'google-' + Math.floor(Math.random() * 100000),
                    displayName: 'Google Explorer',
                    email: 'user@google.com',
                    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                resolve(mockUser);
            }, 800);
        });
    }

    async loginWithApple() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'apple-' + Math.floor(Math.random() * 100000),
                    displayName: 'Apple User',
                    email: 'user@apple.com',
                    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                resolve(mockUser);
            }, 800);
        });
    }

    // CRITICAL FIX: Trigger 6-digit OTP via direct Screen Alert Box
    async sendOTP(identifier) {
        return new Promise((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error('Please enter a valid Mobile Number or Email.'));
                return;
            }

            setTimeout(() => {
                // Generate random 6 digit OTP code
                this.sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                
                // FIXED: Yeh alert box screen par OTP show karega takki aap use dekh sakein
                alert(`✉️ [Health Scanner AI - SECURITY SYSTEM]\n\nAn OTP has been triggered for: ${identifier}\n\n👉 YOUR 6-DIGIT OTP IS: ${this.sentOTP}\n\nPlease type this code on the next screen to verify.`);
                
                console.log(`[Local Simulation Test] Active OTP Code: ${this.sentOTP}`);
                resolve(true);
            }, 600);
        });
    }

    async verifyOTP(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.sentOTP) {
                    reject(new Error('No active OTP session found. Please request a new code.'));
                    return;
                }

                // Agar code sahi hai ya test code "123456" hai
                if (code === this.sentOTP || code === "123456") {
                    const mockUser = {
                        uid: 'phone-' + Math.floor(Math.random() * 100000),
                        displayName: 'Verified User',
                        email: 'user@healthscanner.ai',
                        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                        settings: { theme: 'dark', medicalSharing: false }
                    };
                    this.setUserSession(mockUser);
                    this.sentOTP = null; // Clear session code
                    resolve(mockUser);
                } else {
                    reject(new Error(`Invalid OTP! Please look at the alert box and try again. (Hint: Current OTP is ${this.sentOTP})`));
                }
            }, 700);
        });
    }

    async triggerPasswordReset(email) {
        return new Promise((resolve, reject) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                reject(new Error('Please enter a valid email address.'));
                return;
            }
            setTimeout(() => {
                alert(`🔗 Password reset link simulated and sent to: ${email}`);
                resolve(true);
            }, 500);
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

    updateSettings(updatedSettings) {
        if (!this.user) return;
        this.user.settings = { ...this.user.settings, ...updatedSettings };
        this.setUserSession(this.user);
    }
}

// Global instance export
window.auth = new AuthManager();
