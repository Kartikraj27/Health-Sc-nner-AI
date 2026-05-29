/**
 * auth.js - FULLY REWRITTEN & MATCHED WITH INDEX.HTML
 * Multi-Method Authentication Manager (Local & GitHub/Netlify Deployment)
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

    // Google Sign-In Simulation with Account Selection & 6-Digit OTP
    async loginWithGoogle() {
        return new Promise((resolve, reject) => {
            const selectedEmail = prompt(
                "👉 Google Account Choose Karein:\n\n1. user@gmail.com\n2. health.scanner@gmail.com\n\n(Apna email type karein ya direct 'OK' dabaein):", 
                "user@gmail.com"
            );

            if (selectedEmail === null || selectedEmail.trim() === "") {
                reject(new Error('Google Login Cancelled.'));
                return;
            }

            this.sendOTP(selectedEmail).then(() => resolve(selectedEmail)).catch(reject);
        });
    }

    // Apple Sign-In Simulation with Account Selection & 6-Digit OTP
    async loginWithApple() {
        return new Promise((resolve, reject) => {
            const selectedAppleId = prompt(
                "🍏 Apple ID Verification:\n\nApna Apple ID (Email) type karein:", 
                "user@icloud.com"
            );

            if (selectedAppleId === null || selectedAppleId.trim() === "") {
                reject(new Error('Apple Sign-In Cancelled.'));
                return;
            }

            this.sendOTP(selectedAppleId).then(() => resolve(selectedAppleId)).catch(reject);
        });
    }

    // OTP Trigger & Screen Alert Box Box
    async sendOTP(identifier) {
        return new Promise((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error('Please enter a valid Phone Number or Email.'));
                return;
            }
            setTimeout(() => {
                // Generate random 6 digit OTP
                this.sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                
                alert(`✉️ [Health Scanner AI - SECURITY VERIFICATION]\n\n6-Digit Verification OTP sent to: ${identifier}\n\n👉 YOUR 6-DIGIT CODE IS: ${this.sentOTP}\n\nPlease enter this code into the boxes.`);
                resolve(true);
            }, 300);
        });
    }

    async verifyOTP(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.sentOTP) {
                    reject(new Error('No active OTP session found. Please click Send OTP again.'));
                    return;
                }

                // If code matches or master code '123456' is typed
                if (code === this.sentOTP || code === "123456") {
                    const mockUser = {
                        uid: 'usr-' + Math.floor(Math.random() * 100000),
                        displayName: 'Verified Health Profile',
                        email: 'active.user@healthscanner.ai',
                        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                        settings: { theme: 'dark', medicalSharing: false }
                    };
                    this.setUserSession(mockUser);
                    this.sentOTP = null; // session clear
                    resolve(mockUser);
                } else {
                    reject(new Error(`Invalid 6-Digit Code! Correct code is: ${this.sentOTP}`));
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
