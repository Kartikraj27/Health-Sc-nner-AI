/**
 * auth.js
 * Multi-Method Authentication Manager
 * Handles OAuth simulations, Phone/Email 6-digit OTP verification, and session state persistence.
 */

const AUTH_STORAGE_KEY = 'health_scanner_auth';
const SETTINGS_STORAGE_KEY = 'health_scanner_settings';

class AuthManager {
    constructor() {
        this.subscribers = [];
        this.user = this.loadUser();
        this.sentOTP = null; // Simulates the generated OTP code in-transit
    }

    /**
     * Loads user from local storage.
     */
    loadUser() {
        try {
            const raw = localStorage.getItem(AUTH_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('Error reading auth state:', e);
            return null;
        }
    }

    /**
     * Subscribes a callback to auth state changes.
     */
    onAuthStateChanged(callback) {
        this.subscribers.push(callback);
        // Immediate trigger with current state
        callback(this.user);
    }

    /**
     * Notifies all subscribers of a change in auth state.
     */
    notify() {
        this.subscribers.forEach(cb => cb(this.user));
    }

    /**
     * Google OAuth flow simulation.
     */
    async loginWithGoogle() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'google-user-' + Math.floor(Math.random() * 100000),
                    displayName: 'Dr. Evelyn Sterling',
                    email: 'evelyn.sterling@clinical.health.ai',
                    phoneNumber: '',
                    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXBfpQ1es3XuSp34nL8vtA-IZxHSHL3ZlG3DZgDK5bnnzdxeftNpyX2IxFgTYgVizQxoi7_JFPQ_OB3AV4oM5TQ0qMIv88OFdM58oGYMQUYJe58BRM6xgDOFm_Fcn1MMObRzi1WifRTolk49vJqnBBSsg9qvDN9k37jXfbtHy7ETH9sm7fITUYQo6TehdFTHyD7eUEV7_UCtv6bPGs1kMCuBtoe6VAVpI6A4fl5r2orRe0JJobrI7UVGhF5qSiqJJ3Evh47v3lT_3k',
                    provider: 'Google',
                    settings: {
                        themeMode: 'dark',
                        notificationsEnabled: true
                    }
                };
                this.setUserSession(mockUser);
                resolve(mockUser);
            }, 800);
        });
    }

    /**
     * Apple ID Auth flow simulation.
     */
    async loginWithApple() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'apple-user-' + Math.floor(Math.random() * 100000),
                    displayName: 'Alistair Vance',
                    email: 'a.vance@clinical.health.ai',
                    phoneNumber: '',
                    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEhUsmlST7sEl1fgUKZ_OC-HQQepu-Ctnyh4UOnglORDkSqz5z6iRJdmE8EKX_uFjx86sK1myo10QbVr7dX_7-TL8ItG7xjQPd2zBzQ5EvlYQBxKyyNRiuvAThMPQ6NwJ8tOgvKLBsI8YyiLWzQwlQIw0zDgRsECsqo2BzgV1NrYSG0lVMCrbjQG76JAJF8jLCBzQnTR0BzXNo6EqG5u0S1tMsR2_ExJQTGc1w6K3IDsfOAnMHVrGF_aLYPquPNdKiMTN6658NuEW8',
                    provider: 'Apple',
                    settings: {
                        themeMode: 'dark',
                        notificationsEnabled: true
                    }
                };
                this.setUserSession(mockUser);
                resolve(mockUser);
            }, 800);
        });
    }

    /**
     * Triggers sending a simulated OTP code to a phone number.
     */
    async sendPhoneOTP(phoneNumber) {
        return new Promise((resolve, reject) => {
            if (!phoneNumber || phoneNumber.trim().length < 8) {
                reject(new Error('Please input a valid phone number.'));
                return;
            }
            setTimeout(() => {
                // Generate a random 6-digit OTP code
                this.sentOTP = '123456'; // Standardized code for simple user demonstration
                console.log(`[SMS-Simulation] Sent OTP Verification Code: ${this.sentOTP} to ${phoneNumber}`);
                resolve(true);
            }, 600);
        });
    }

    /**
     * Verifies the SMS OTP code.
     */
    async verifyPhoneOTP(phoneNumber, code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (code === this.sentOTP || code === '123456' || code === '888888') {
                    const mockUser = {
                        uid: 'phone-user-' + Math.floor(Math.random() * 100000),
                        displayName: 'Verified Patient',
                        email: '',
                        phoneNumber: phoneNumber,
                        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                        provider: 'PhoneOTP',
                        settings: {
                            themeMode: 'dark',
                            notificationsEnabled: true
                        }
                    };
                    this.setUserSession(mockUser);
                    resolve(mockUser);
                } else {
                    reject(new Error('Verification failed. Invalid OTP code. Try "123456".'));
                }
            }, 700);
        });
    }

    /**
     * Triggers sending a simulated OTP code to an email.
     */
    async sendEmailOTP(email) {
        return new Promise((resolve, reject) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                reject(new Error('Please enter a valid email address.'));
                return;
            }
            setTimeout(() => {
                this.sentOTP = '123456'; // Standardized code
                console.log(`[Email-Simulation] Sent OTP Verification Code: ${this.sentOTP} to ${email}`);
                resolve(true);
            }, 600);
        });
    }

    /**
     * Verifies the Email OTP code.
     */
    async verifyEmailOTP(email, code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (code === this.sentOTP || code === '123456' || code === '888888') {
                    const mockUser = {
                        uid: 'email-user-' + Math.floor(Math.random() * 100000),
                        displayName: email.split('@')[0],
                        email: email,
                        phoneNumber: '',
                        photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
                        provider: 'EmailOTP',
                        settings: {
                            themeMode: 'dark',
                            notificationsEnabled: true
                        }
                    };
                    this.setUserSession(mockUser);
                    resolve(mockUser);
                } else {
                    reject(new Error('Verification failed. Invalid OTP code. Try "123456".'));
                }
            }, 700);
        });
    }

    /**
     * Simulates sending a password reset link.
     */
    async triggerPasswordReset(email) {
        return new Promise((resolve, reject) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                reject(new Error('Please enter a valid email address.'));
                return;
            }
            setTimeout(() => {
                console.log(`[Auth-Simulation] Sent password reset link to ${email}`);
                resolve(true);
            }, 500);
        });
    }

    /**
     * Saves user object in session storage and triggers update.
     */
    setUserSession(user) {
        this.user = user;
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
        this.notify();
    }

    /**
     * Logs out the user.
     */
    logout() {
        this.setUserSession(null);
    }

    /**
     * Updates user customization settings.
     */
    updateSettings(updatedSettings) {
        if (!this.user) return;
        this.user.settings = { ...this.user.settings, ...updatedSettings };
        this.setUserSession(this.user);
    }
}

// Bind to window object
window.auth = new AuthManager();
