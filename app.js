/**
 * app.js - FIXED INTEGRATION
 * Primary Controller / UI Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Interactive Jellyfish Canvas
    if (window.initJellyfish) {
        window.initJellyfish('jellyfish-canvas');
    }

    // Cache Core DOM Panels
    const screenLogin = document.getElementById('screen-login');
    const appLayout = document.getElementById('app-layout');
    
    // Auth DOM Buttons
    const btnLoginGoogle = document.getElementById('btn-login-google');
    const btnLoginApple = document.getElementById('btn-login-apple');
    const btnSendOtp = document.getElementById('btn-send-otp') || document.querySelector('#screen-login button[type="submit"]') || document.querySelector('.bg-cyan.text-navy.w-full');
    const inputPhone = document.getElementById('input-phone') || document.querySelector('input[type="tel"]') || document.querySelector('input[placeholder*="Phone"]');
    const otpContainer = document.getElementById('otp-inputs-container') || document.querySelector('.grid.grid-cols-6') || document.querySelector('.flex.justify-between');

    // Navigation and Init Setup
    function showMainDashboard() {
        if (screenLogin) screenLogin.classList.add('hidden');
        if (appLayout) appLayout.classList.remove('hidden');
        // Unfreeze layouts
        const scanScreen = document.getElementById('screen-scan');
        if (scanScreen) scanScreen.classList.remove('hidden');
    }

    // Handle initial state setup
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            showMainDashboard();
        }
    });

    // ==========================================
    // FIXED CLICK LISTENERS FOR AUTH BUTTONS
    // ==========================================

    // 1. Google Button Connection Fix
    if (btnLoginGoogle) {
        btnLoginGoogle.style.cursor = 'pointer';
        btnLoginGoogle.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithGoogle();
                showMainDashboard();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // 2. Apple Button Connection Fix
    if (btnLoginApple) {
        btnLoginApple.style.cursor = 'pointer';
        btnLoginApple.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithApple();
                showMainDashboard();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // 3. Mobile Number OTP Action Fix
    if (btnSendOtp && inputPhone) {
        btnSendOtp.addEventListener('click', async (e) => {
            e.preventDefault();
            const val = inputPhone.value;
            if (!val || val.trim() === "") {
                alert("Please enter your Mobile number or Email address first!");
                return;
            }
            try {
                await window.auth.sendOTP(val);
                if (otpContainer) {
                    otpContainer.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // 4. OTP Inputs Reading Fix
    const otpInputs = document.querySelectorAll('.otp-digit-input') || document.querySelectorAll('input[maxlength="1"]');
    if (otpInputs.length > 0) {
        otpInputs.forEach((input) => {
            input.addEventListener('input', async () => {
                let code = "";
                otpInputs.forEach(i => code += i.value);
                if (code.length === 6) {
                    try {
                        await window.auth.verifyOTP(code);
                        showMainDashboard();
                    } catch (err) {
                        alert(err.message);
                        otpInputs.forEach(i => i.value = ""); // Clear on error
                        otpInputs[0].focus();
                    }
                }
            });
        });
    }

    // Tab Navigation Logic
    const navButtons = document.querySelectorAll('.nav-btn');
    const appScreens = document.querySelectorAll('[id^="screen-"]');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            if (!target) return;
            
            appScreens.forEach(screen => {
                if(screen.id !== 'screen-login') screen.classList.add('hidden');
            });
            
            const targetScreen = document.getElementById(target);
            if (targetScreen) targetScreen.classList.remove('hidden');

            navButtons.forEach(b => b.classList.remove('text-cyan'));
            e.currentTarget.classList.add('text-cyan');
        });
    });
});
