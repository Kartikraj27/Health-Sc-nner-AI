/**
 * app.js - MASTER FIXED
 * Primary Controller & UI Layer with Fruit/Vegetable Strict Validation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas reference initialization
    const canvasContainer = document.querySelector('.jellyfish-bg-container');
    if (window.initJellyfish) {
        window.initJellyfish('jellyfish-canvas');
    }

    // DOM Panel Elements Cache
    const screenLogin = document.getElementById('screen-login');
    const appLayout = document.getElementById('app-layout');
    
    // Auth Interactions Nodes
    const btnLoginGoogle = document.getElementById('btn-login-google');
    const btnLoginApple = document.getElementById('btn-login-apple');
    const btnSendOtp = document.getElementById('btn-send-otp') || document.querySelector('#screen-login button[type="submit"]');
    const inputPhone = document.getElementById('input-phone') || document.querySelector('input[type="tel"]');
    const pinInputs = document.querySelectorAll('.otp-digit-input') || document.querySelectorAll('input[maxlength="1"]');

    // Fruit and Vegetable Valid Whitelist Dictionary
    const ALLOWED_PRODUCE = ['avocado toast', 'salmon salad', 'apple', 'detox smoothie', 'poke bowl', 'broccoli', 'banana', 'mango', 'tomato', 'carrot', 'salad', 'orange'];

    // Function to Request and Lock Live Camera Feed on the UI Screen
    function activateLiveCameraScanner() {
        const videoElement = document.getElementById('camera-stream');
        if (!videoElement) return;

        console.log("Initializing active camera streams...");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                videoElement.srcObject = stream;
                videoElement.setAttribute('playsinline', true); 
                videoElement.play().catch(e => console.log("Stream play error:", e));
                
                // Trigger scanner animation pulse beam
                const pulseBeam = document.querySelector('.scanner-laser-beam') || document.querySelector('.scan-beam');
                if (pulseBeam) pulseBeam.classList.remove('hidden');
            })
            .catch((err) => {
                console.warn("Camera denied:", err);
                alert("📸 Camera Access Required! Please enable browser camera access permissions or use manual typing.");
            });
        }
    }

    // Core Dashboard Transitions & Jellyfish Cleanup System
    function triggerSecureLoginSuccess() {
        if (screenLogin) screenLogin.classList.add('hidden');
        if (appLayout) appLayout.classList.remove('hidden');
        
        // JELLYFISH HATAO SYSTEM: Hide background canvas to keep dashboard clear and high performance
        if (canvasContainer) {
            canvasContainer.style.display = 'none';
        }

        // Auto Open and Boot Up Camera Scanner on the App Screen Layout
        const scanScreen = document.getElementById('screen-scan');
        if (scanScreen) scanScreen.classList.remove('hidden');
        
        setTimeout(() => {
            activateLiveCameraScanner();
        }, 300);
    }

    // Check existing authentication sessions
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            triggerSecureLoginSuccess();
        }
    });

    // ==========================================
    // LOGIN CLICK ACTIONS CONNECTIONS
    // ==========================================

    if (btnLoginGoogle) {
        btnLoginGoogle.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithThirdParty('Google');
            } catch(err) { console.log(err.message); }
        });
    }

    if (btnLoginApple) {
        btnLoginApple.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithThirdParty('Apple');
            } catch(err) { console.log(err.message); }
        });
    }

    if (btnSendOtp && inputPhone) {
        btnSendOtp.addEventListener('click', async (e) => {
            e.preventDefault();
            const val = inputPhone.value;
            if (!val) { alert("Please input your verification identity first!"); return; }
            try {
                await window.auth.sendOTP(val);
            } catch(err) { alert(err.message); }
        });
    }

    // Capture Input PIN elements array string
    if (pinInputs.length > 0) {
        pinInputs.forEach((el) => {
            el.addEventListener('input', async () => {
                let codeCombined = "";
                pinInputs.forEach(i => codeCombined += i.value);
                if (codeCombined.length === 6) {
                    try {
                        await window.auth.verifyOTP(codeCombined);
                        triggerSecureLoginSuccess();
                    } catch (err) {
                        alert(err.message);
                        pinInputs.forEach(i => i.value = "");
                        pinInputs[0].focus();
                    }
                }
            });
        });
    }

    // ==========================================
    // STRICT FRUIT & VEGETABLE SCAN VALIDATION
    // ==========================================
    const inputSearchFood = document.getElementById('input-food-search') || document.querySelector('input[placeholder*="Search"]');
    const btnTriggerScan = document.getElementById('btn-trigger-scan') || document.querySelector('.scan-trigger-btn') || document.getElementById('fallback-scan-btn');

    function executeFoodScannerAnalysis(foodInputName) {
        if (!foodInputName || foodInputName.trim() === "") return;
        
        const cleanFoodName = foodInputName.toLowerCase().trim();

        // VALIDATION CHECK: Agar food list me nahi hai ya junk food hai (Pizza, Burger, Donut etc.)
        if (!ALLOWED_PRODUCE.includes(cleanFoodName)) {
            alert(`⚠️ NOT A VEGETABLE OR FRUIT!\n\nAccess Refused: "${foodInputName}" is not a recognized organic fruit or fresh vegetable.\n\nHealth Scanner AI system only analyzes fresh green produce and biological nutrition logs.`);
            if (inputSearchFood) inputSearchFood.value = "";
            return;
        }

        // If it is a valid vegetable or fruit, call aiEngine and render results card
        console.log("Analyzing valid produce:", cleanFoodName);
        if (window.ai && typeof window.displayAnalysisResults === 'function') {
            const results = window.ai.analyzeMeal(cleanFoodName);
            window.displayAnalysisResults(results);
            
            // Persist scan history inside LocalStorage/IndexedDB via database.js
            if (window.db && typeof window.db.saveScan === 'function') {
                window.db.saveScan(results);
            }
        } else {
            // UI Fallback text update if custom renderers are blocked
            alert(`🥗 Valid Produce Detected!\nFood: ${foodInputName}\nCalories & Verdict details are rendering into your dashboard panel cards.`);
        }
    }

    // Hook listeners up to the scanner submission actions
    if (btnTriggerScan) {
        btnTriggerScan.addEventListener('click', () => {
            if (inputSearchFood) executeFoodScannerAnalysis(inputSearchFood.value);
        });
    }
    if (inputSearchFood) {
        inputSearchFood.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeFoodScannerAnalysis(inputSearchFood.value);
            }
        });
    }

    // Layout Navigation Tabs Controller Router
    const navigationButtons = document.querySelectorAll('.nav-btn');
    const layoutPanels = document.querySelectorAll('[id^="screen-"]');

    navigationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const destination = e.currentTarget.getAttribute('data-target');
            if (!destination) return;
            
            layoutPanels.forEach(panel => {
                if(panel.id !== 'screen-login') panel.classList.add('hidden');
            });
            
            const activeTargetPanel = document.getElementById(destination);
            if (activeTargetPanel) {
                activeTargetPanel.classList.remove('hidden');
                if (destination === 'screen-scan') {
                    activateLiveCameraScanner();
                }
            }
            navigationButtons.forEach(b => b.classList.remove('text-cyan'));
            e.currentTarget.classList.add('text-cyan');
        });
    });
});
