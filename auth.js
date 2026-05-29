/**
 * auth.js - FIXED FOR ACCOUNT SELECTION & REALISTIC FLOW
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

    // FIXED: Ab click karte hi auto login nahi hoga, pehle account choose karne ko kahega
    async loginWithGoogle() {
        return new Promise((resolve, reject) => {
            // User se account select karne ke liye pucha jayega
            const selectedEmail = prompt(
                "👉 Google Account Choose Karein:\n\n1. user@gmail.com\n2. official.health@gmail.com\n\n(Apna email id type karein ya direct 'OK' dabaein):", 
                "user@gmail.com"
            );

            if (selectedEmail === null) {
                reject(new Error('Google Login Cancelled by User.'));
                return;
            }

            setTimeout(() => {
                const mockUser = {
                    uid: 'google-' + Math.floor(Math.random() * 100000),
                    displayName: selectedEmail.split('@')[0],
                    email: selectedEmail,
                    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                alert(`🎉 Success: Connected via Google Account (${selectedEmail})!`);
                resolve(mockUser);
            }, 600);
        });
    }

    // FIXED: Apple ID account select verification simulation
    async loginWithApple() {
        return new Promise((resolve, reject) => {
            const selectedAppleId = prompt(
                "🍏 Apple ID Sign-In Verification:\n\nApna Apple ID (Email) darj karein:", 
                "user@icloud.com"
            );

            if (selectedAppleId === null || selectedAppleId.trim() === "") {
                reject(new Error('Apple Sign-In Cancelled.'));
                return;
            }

            setTimeout(() => {
                const mockUser = {
                    uid: 'apple-' + Math.floor(Math.random() * 100000),
                    displayName: 'Apple User',
                    email: selectedAppleId,
                    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
                    settings: { theme: 'dark', medicalSharing: false }
                };
                this.setUserSession(mockUser);
                alert(`🎉 Success: Connected Securely via Apple ID!`);
                resolve(mockUser);
            }, 600);
        });
    }

    // FIXED: Mobile OTP Trigger Pop-up Alert
    async sendOTP(identifier) {
        return new Promise((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error('Please enter a valid Mobile Number or Email.'));
                return;
            }
            setTimeout(() => {
                this.sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                alert(`✉️ [Health Scanner AI - SECURITY SYSTEM]\n\nOTP code sent to: ${identifier}\n\n👉 YOUR 6-DIGIT OTP IS: ${this.sentOTP}\n\nPlease enter this code on the screen.`);
                resolve(true);
            }, 400);
        });
    }

    async verifyOTP(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.sentOTP) {
                    reject(new Error('No active OTP session. Click Send OTP again.'));
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
                    reject(new Error(`Invalid Code! Correct OTP is ${this.sentOTP}`));
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
