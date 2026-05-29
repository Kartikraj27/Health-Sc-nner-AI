/**
 * app.js - COMPLETELY FIXED
 * Primary Controller / UI Orchestrator with Post-Login Camera Permission Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Interactive Jellyfish Canvas
    if (window.initJellyfish) {
        window.initJellyfish('jellyfish-canvas');
    }

    // Cache Core DOM Panels
    const screenLogin = document.getElementById('screen-login');
    const appLayout = document.getElementById('app-layout');
    
    // Auth DOM Elements
    const btnLoginGoogle = document.getElementById('btn-login-google');
    const btnLoginApple = document.getElementById('btn-login-apple');
    const btnSendOtp = document.getElementById('btn-send-otp') || document.querySelector('#screen-login button[type="submit"]') || document.querySelector('.bg-cyan');
    const inputPhone = document.getElementById('input-phone') || document.querySelector('input[type="tel"]');
    const otpContainer = document.getElementById('otp-inputs-container') || document.querySelector('.flex.justify-between.gap-2');

    // CRITICAL: Function to Request Camera Access right after login
    function askCameraPermissionPostLogin() {
        console.log("Requesting camera access post-login...");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                alert("📸 Camera Permission Granted Successfully! You can now use the scanner.");
                // Stop stream immediately after checking permission to save battery
                stream.getTracks().forEach(track => track.stop());
                
                // If video element exists, attach it
                const videoElement = document.getElementById('camera-stream');
                if (videoElement) {
                    initLiveCameraStream();
                }
            })
            .catch(function(error) {
                console.warn("Camera access denied:", error);
                alert("⚠️ Attention: Camera permission was denied. You will have to type food names manually in the search bar unless enabled in settings.");
            });
        }
    }

    // Helper to fully start live stream inside dashboard
    function initLiveCameraStream() {
        const videoElement = document.getElementById('camera-stream');
        if (!videoElement) return;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            videoElement.srcObject = stream;
            videoElement.play().catch(e => console.log(e));
        }).catch(err => console.log(err));
    }

    // UI View transition management
    function showMainDashboard() {
        if (screenLogin) screenLogin.classList.add('hidden');
        if (appLayout) appLayout.classList.remove('hidden');
        
        // Show scan screen by default
        const scanScreen = document.getElementById('screen-scan');
        if (scanScreen) scanScreen.classList.remove('hidden');

        // TRIGGER CAMERA ACCORDING TO USER REQUIREMENTS
        setTimeout(() => {
            askCameraPermissionPostLogin();
        }, 500);
    }

    // Auto-login tracking check
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            showMainDashboard();
        }
    });

    // ==========================================
    // FIXED CLICK LISTENERS WITH ACCOUNT SELECTION
    // ==========================================

    // Google Button Fix
    if (btnLoginGoogle) {
        btnLoginGoogle.style.cursor = 'pointer';
        btnLoginGoogle.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithGoogle();
                showMainDashboard();
            } catch (err) {
                console.log(err.message);
            }
        });
    }

    // Apple Button Fix
    if (btnLoginApple) {
        btnLoginApple.style.cursor = 'pointer';
        btnLoginApple.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithApple();
                showMainDashboard();
            } catch (err) {
                console.log(err.message);
            }
        });
    }

    // Mobile OTP Fix
    if (btnSendOtp && inputPhone) {
        btnSendOtp.addEventListener('click', async (e) => {
            e.preventDefault();
            const val = inputPhone.value;
            if (!val || val.trim() === "") {
                alert("Please enter your Mobile number first!");
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

    // OTP Verification Digits Reading Fix
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
                        otpInputs.forEach(i => i.value = ""); 
                        otpInputs[0].focus();
                    }
                }
            });
        });
    }

    // Tab Navigation Routing Logic
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
            if (targetScreen) {
                targetScreen.classList.remove('hidden');
                if (target === 'screen-scan') {
                    initLiveCameraStream();
                }
            }

            navButtons.forEach(b => b.classList.remove('text-cyan'));
            e.currentTarget.classList.add('text-cyan');
        });
    });
});
