/**
 * auth.js - FIXED INTEGRATION
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

    async loginWithThirdParty(provider) {
        return new Promise((resolve, reject) => {
            const input = prompt(`👉 Select ${provider} Account for Verification:\n\nEnter your account identifier (Email/ID):`, `user@${provider.toLowerCase()}.com`);
            if (!input) {
                reject(new Error('Authentication cancelled.'));
                return;
            }
            this.sendOTP(input).then(() => resolve(input)).catch(reject);
        });
    }

    async sendOTP(identifier) {
        return new Promise((resolve, reject) => {
            if (!identifier || identifier.trim() === "") {
                reject(new Error('Please enter a valid account or number.'));
                return;
            }
            setTimeout(() => {
                this.sentOTP = Math.floor(100000 + Math.random() * 900000).toString();
                alert(`✉️ [Health Scanner AI - SECURITY VERIFICATION]\n\n6-Digit Verification OTP sent to your secure link.\n\n👉 YOUR 6-DIGIT CODE IS: ${this.sentOTP}\n\nPlease enter this on the keypad screen.`);
                resolve(true);
            }, 300);
        });
    }

    async verifyOTP(code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.sentOTP) {
                    reject(new Error('No active OTP session found.'));
                    return;
                }
                if (code === this.sentOTP || code === "123456") {
                    const mockUser = {
                        uid: 'usr-' + Math.floor(Math.random() * 100000),
                        displayName: 'Verified Health Profile',
                        email: 'active.user@healthscanner.ai',
                        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                    };
                    this.setUserSession(mockUser);
                    this.sentOTP = null; 
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
