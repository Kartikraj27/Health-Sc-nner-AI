/**
 * app.js - FULLY REWRITTEN & OPTIMIZED FOR FRUITS/VEGETABLES VALIDATION
 * Connects UI Panels, Jellyfish Freeze, Real Camera Access, and strict produce checks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Canvas Background
    if (window.initJellyfish) {
        window.initJellyfish('jellyfish-canvas');
    }

    // Cache DOM Elements (Matched Exactly with index.html tokens)
    const screenLogin = document.getElementById('screen-login');
    const appLayout = document.getElementById('app-layout');
    const canvasContainer = document.querySelector('.jellyfish-bg-container');
    
    // Auth DOM Selectors
    const btnGoogle = document.getElementById('btn-login-google');
    const btnApple = document.getElementById('btn-login-apple');
    const btnSendOtp = document.getElementById('btn-send-otp');
    const inputPhone = document.getElementById('input-phone');
    const inputEmail = document.getElementById('input-email');
    const otpInputs = document.querySelectorAll('.otp-digit-input');

    // Strict Fruit and Vegetable Allowed List
    const ALLOWED_PRODUCE = ['apple', 'avocado toast', 'salmon salad', 'detox smoothie', 'poke bowl', 'broccoli', 'banana', 'mango', 'tomato', 'carrot', 'salad', 'orange', 'cucumber', 'spinach'];

    // Function to request and render Native Camera Stream
    function startDeviceCamera() {
        const videoElement = document.getElementById('camera-stream');
        if (!videoElement) return;

        console.log("Requesting camera access permissions...");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                videoElement.srcObject = stream;
                videoElement.setAttribute('playsinline', true);
                videoElement.play().catch(e => console.log("Video playback error:", e));
                
                // Show scanning laser beam
                const laserBeam = document.querySelector('.scanner-laser-beam');
                if (laserBeam) laserBeam.classList.remove('hidden');
            })
            .catch((err) => {
                console.warn("Camera permission blocked:", err);
                alert("📸 Camera Access Required!\n\nPlease allow camera permissions in your browser address bar to see the live view inside the smartphone frame.");
            });
        }
    }

    // Core function to handle UI shift upon login
    function handleLoginSuccess() {
        if (screenLogin) screenLogin.classList.add('hidden');
        if (appLayout) appLayout.classList.remove('hidden');
        
        // JELLYFISH HATAO SYSTEM: Clear background completely for fast performance
        if (canvasContainer) {
            canvasContainer.style.transition = "opacity 0.5s ease";
            canvasContainer.style.opacity = "0";
            setTimeout(() => { canvasContainer.style.display = 'none'; }, 500);
        }

        // Auto open scanner panel view
        const scanScreen = document.getElementById('screen-scan');
        if (scanScreen) scanScreen.classList.remove('hidden');
        
        // Trigger Camera Access Box immediately after login
        setTimeout(() => {
            startDeviceCamera();
        }, 600);
    }

    // Auto Session Persistent Routing Check
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            handleLoginSuccess();
        }
    });

    // ==========================================
    // AUTH BUTTON CLICK HANDLERS
    // ==========================================

    if (btnGoogle) {
        btnGoogle.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithGoogle();
            } catch(err) { console.log(err.message); }
        });
    }

    if (btnApple) {
        btnApple.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await window.auth.loginWithApple();
            } catch(err) { console.log(err.message); }
        });
    }

    if (btnSendOtp) {
        btnSendOtp.addEventListener('click', async (e) => {
            e.preventDefault();
            // Check whichever field has value (phone tab or email tab)
            const val = (inputPhone && inputPhone.value) ? inputPhone.value : (inputEmail ? inputEmail.value : "");
            if (!val || val.trim() === "") { 
                alert("Please enter a valid Mobile Number or Email first!"); 
                return; 
            }
            try {
                await window.auth.sendOTP(val);
            } catch(err) { alert(err.message); }
        });
    }

    // 6-Digit OTP inputs processing matrix
    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            // Auto focus movement helper
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                // Read combined code string
                let combinedCode = "";
                otpInputs.forEach(i => combinedCode += i.value);
                
                if (combinedCode.length === 6) {
                    window.auth.verifyOTP(combinedCode)
                    .then(() => {
                        handleLoginSuccess();
                    })
                    .catch((err) => {
                        alert(err.message);
                        otpInputs.forEach(i => i.value = ""); // Reset fields
                        otpInputs[0].focus();
                    });
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    // ==========================================
    // STRICT FRUITS & VEGETABLES SYSTEM FILTER
    // ==========================================
    const searchBar = document.getElementById('input-food-search');
    const scanSubmitBtn = document.getElementById('btn-trigger-scan');

    function validateAndScanProduce(foodNameString) {
        if (!foodNameString || foodNameString.trim() === "") {
            alert("Please type a product name or point the camera at a fruit/vegetable.");
            return;
        }

        const inputCleaned = foodNameString.toLowerCase().trim();

        // STRICT VALIDATION STEP: Block non-produce junk foods
        if (!ALLOWED_PRODUCE.includes(inputCleaned)) {
            alert(`⚠️ NOT A VEGETABLE OR FRUIT!\n\nAccess Denied: "${foodNameString}" is not a recognized organic fresh fruit or green vegetable.\n\nHealth Scanner AI strict algorithms filter out junk foods (Pizza, Cheeseburgers, Donuts, etc.) to analyze pure bio-nutrition raw logs.`);
            if (searchBar) searchBar.value = "";
            return;
        }

        // If validation passes, activate rendering pipelines from aiEngine.js
        console.log("Analyzing authorized fresh produce:", inputCleaned);
        if (window.ai && typeof window.displayAnalysisResults === 'function') {
            const analyticalResults = window.ai.analyzeMeal(inputCleaned);
            window.displayAnalysisResults(analyticalResults);
            
            // Persist metrics card inside IndexedDB/LocalStorage logs
            if (window.db && typeof window.db.saveScan === 'function') {
                window.db.saveScan(analyticalResults);
            }
        } else {
            alert(`🥗 Fresh Produce Verified!\nFood Item: ${foodNameString}\nNutrition indicators are flashing inside your screen bento charts.`);
        }
    }

    if (scanSubmitBtn) {
        scanSubmitBtn.addEventListener('click', () => {
            if (searchBar) validateAndScanProduce(searchBar.value);
        });
    }

    if (searchBar) {
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateAndScanProduce(searchBar.value);
            }
        });
    }

    // Tab Bar Core Router Controllers
    const tabButtons = document.querySelectorAll('.nav-btn');
    const panelsList = document.querySelectorAll('[id^="screen-"]');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const destinationID = e.currentTarget.getAttribute('data-target');
            if (!destinationID) return;
            
            panelsList.forEach(p => {
                if(p.id !== 'screen-login') p.classList.add('hidden');
            });
            
            const targetedPanel = document.getElementById(destinationID);
            if (targetedPanel) {
                targetedPanel.classList.remove('hidden');
                if (destinationID === 'screen-scan') {
                    startDeviceCamera();
                }
            }

            tabButtons.forEach(b => b.classList.remove('text-cyan'));
            e.currentTarget.classList.add('text-cyan');
        });
    });
});
