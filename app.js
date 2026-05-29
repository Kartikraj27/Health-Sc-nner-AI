/**
 * app.js
 * Primary Controller / UI Orchestrator
 * Connects Canvas background, Auth manager, Scan database, and AI engine.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Interactive Jellyfish Canvas
    if (window.initJellyfish) {
        window.initJellyfish('jellyfish-canvas');
    }

    // Camera Stream Reference
    let cameraStream = null;
    let selectedFileForScan = null;
    let activeFilter = 'all';

    // Sample database templates for visual generation
    const SAMPLES = [
        { name: 'Avocado Toast', key: 'avocado toast', icon: 'breakfast_dining' },
        { name: 'Salmon Salad', key: 'grilled salmon salad', icon: 'salad' },
        { name: 'Pepperoni Pizza', key: 'pepperoni pizza', icon: 'local_pizza' },
        { name: 'Chocolate Donut', key: 'chocolate donut', icon: 'donut_large' },
        { name: 'Greek Yogurt Bowl', key: 'greek yogurt bowl', icon: 'egg_alt' }
    ];

    // ==========================================
    // DOM CACHING
    // ==========================================
    const htmlEl = document.documentElement;
    const screenLogin = document.getElementById('screen-login');
    const appLayout = document.getElementById('app-layout');
    
    // Auth DOM
    const btnLoginGoogle = document.getElementById('btn-login-google');
    const btnLoginApple = document.getElementById('btn-login-apple');
    const tabPhoneOtp = document.getElementById('tab-phone-otp');
    const tabEmailOtp = document.getElementById('tab-email-otp');
    const panelPhoneOtp = document.getElementById('panel-phone-otp');
    const panelEmailOtp = document.getElementById('panel-email-otp');
    const inputPhone = document.getElementById('input-phone');
    const inputEmail = document.getElementById('input-email');
    const btnSendPhoneOtp = document.getElementById('btn-send-phone-otp');
    const btnSendEmailOtp = document.getElementById('btn-send-email-otp');
    const panelVerificationCode = document.getElementById('panel-verification-code');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    const btnBackToLogin = document.getElementById('btn-back-to-login');
    const otpInputRow = document.getElementById('otp-input-row');
    const loginErrorCard = document.getElementById('login-error-card');
    const loginErrorText = document.getElementById('login-error-text');
    const loginDivider = document.getElementById('login-divider');
    const oauthArea = document.getElementById('oauth-area');
    const loginMethodTabs = document.getElementById('login-method-tabs');
    const loginTitleArea = document.getElementById('login-title-area');
    const btnForgotPassword = document.getElementById('btn-forgot-password');

    // Header / Settings user profile data binds
    const headerUserAvatar = document.getElementById('header-user-avatar');
    const headerUserName = document.getElementById('header-user-name');
    const settingsAvatar = document.getElementById('settings-avatar');
    const settingsName = document.getElementById('settings-name');
    const settingsEmail = document.getElementById('settings-email');
    const settingsProviderBadge = document.getElementById('settings-provider-badge');
    const selectTheme = document.getElementById('select-theme');
    const btnToggleNotifications = document.getElementById('btn-toggle-notifications');
    const notifToggleDot = document.getElementById('notif-toggle-dot');
    const btnSignOut = document.getElementById('btn-sign-out');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeIconIndicator = document.getElementById('theme-icon-indicator');

    // Navigation and Routing
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');

    // Scanner View DOM
    const webcamVideo = document.getElementById('webcam-video');
    const scannerPlaceholder = document.getElementById('scanner-placeholder');
    const dragDropZone = document.getElementById('drag-drop-zone');
    const inputFileUploader = document.getElementById('input-file-uploader');
    const btnCameraTrigger = document.getElementById('btn-camera-trigger');
    const btnUploadTrigger = document.getElementById('btn-upload-trigger');
    const camPingDot = document.getElementById('cam-ping-dot');
    const camStatusLabel = document.getElementById('cam-status-label');
    const scannerLaser = document.getElementById('scanner-laser');
    
    // Manual Molecular Entry
    const inputManualFood = document.getElementById('input-manual-food');
    const btnManualScan = document.getElementById('btn-manual-scan');

    // Diagnostic Console Logs
    const scanConsole = document.getElementById('scan-console');
    const scanProgressPercentage = document.getElementById('scan-progress-percentage');
    const scanConsoleLogs = document.getElementById('scan-console-logs');
    const scanProgressBar = document.getElementById('scan-progress-bar');
    const sampleFoodsList = document.getElementById('sample-foods-list');
    const totalScansCount = document.getElementById('total-scans-count');

    // Results screen DOM
    const btnBackToScan = document.getElementById('btn-back-to-scan');
    const analysisFoodName = document.getElementById('analysis-food-name');
    const analysisImage = document.getElementById('analysis-image');
    const analysisImageLabel = document.getElementById('analysis-image-label');
    const analysisVerdictCard = document.getElementById('analysis-verdict-card');
    const analysisVerdictPill = document.getElementById('analysis-verdict-pill');
    const analysisVerdictDescription = document.getElementById('analysis-verdict-description');
    const calorieProgressCircle = document.getElementById('calorie-progress-circle');
    const analysisCalories = document.getElementById('analysis-calories');
    const analysisCaloriePercentage = document.getElementById('analysis-calorie-percentage');
    
    const macroProtein = document.getElementById('macro-protein');
    const macroCarbs = document.getElementById('macro-carbs');
    const macroFats = document.getElementById('macro-fats');
    const macroSodium = document.getElementById('macro-sodium');
    
    const detailCarbsTotal = document.getElementById('detail-carbs-total');
    const detailFiber = document.getElementById('detail-fiber');
    const detailSugar = document.getElementById('detail-sugar');
    
    const detailFatsTotal = document.getElementById('detail-fats-total');
    const detailMonofat = document.getElementById('detail-monofat');
    const detailSatfat = document.getElementById('detail-satfat');
    
    const analysisInsightsList = document.getElementById('analysis-insights-list');
    const analysisAlternative = document.getElementById('analysis-alternative');
    const analysisAlternativeIcon = document.getElementById('analysis-alternative-icon');

    // History DOM
    const inputHistorySearch = document.getElementById('input-history-search');
    const btnClearHistory = document.getElementById('btn-clear-history');
    const historyFilterBtns = document.querySelectorAll('.history-filter-btn');
    const historyGrid = document.getElementById('history-grid');
    const historyEmptyState = document.getElementById('history-empty-state');
    const btnHistoryScanNow = document.getElementById('btn-history-scan-now');


    // ==========================================
    // 2. AUTH STATE LISTENERS & NAVIGATION
    // ==========================================
    window.auth.onAuthStateChanged((user) => {
        if (!user) {
            // Unauthenticated state
            appLayout.classList.add('hidden');
            screenLogin.classList.add('active');
            stopCamera();
            resetLoginPortal();
        } else {
            // Authenticated state
            screenLogin.classList.remove('active');
            appLayout.classList.remove('hidden');
            
            // Populate profile bindings
            headerUserAvatar.src = user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
            headerUserName.innerText = user.displayName || 'Authorized User';
            settingsAvatar.src = user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
            settingsName.innerText = user.displayName || 'Authorized User';
            settingsEmail.innerText = user.email || user.phoneNumber || 'Node Link Active';
            settingsProviderBadge.innerText = `${user.provider} credentials`;
            
            // Update preferences
            applyTheme(user.settings.themeMode);
            selectTheme.value = user.settings.themeMode;
            updateNotificationToggleUI(user.settings.notificationsEnabled);
            
            // Navigate to Scanner by default
            navigateToTab('screen-scan');
            renderHistoryGrid();
            updateTotalScansCounter();
        }
    });

    // Handle single-page tab swaps
    function navigateToTab(targetId) {
        screens.forEach(s => {
            s.classList.remove('active');
            if (s.id === targetId) s.classList.add('active');
        });

        // Highlights nav button
        navButtons.forEach(btn => {
            const target = btn.getAttribute('data-target');
            const icon = btn.querySelector('.material-symbols-outlined');
            if (target === targetId) {
                btn.classList.add('text-cyan', 'nav-link-active');
                btn.classList.remove('text-slate-400');
                if (icon) icon.style.fontVariationSettings = "'FILL' 1, 'wght' 600";
            } else {
                btn.classList.remove('text-cyan', 'nav-link-active');
                btn.classList.add('text-slate-400');
                if (icon) icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400";
            }
        });

        // Trigger updates depending on tab opened
        if (targetId === 'screen-history') {
            renderHistoryGrid();
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            navigateToTab(target);
        });
    });


    // ==========================================
    // 3. LOGIN INTERFACE LOGIC
    // ==========================================
    let currentAuthMode = 'phone'; // 'phone' or 'email'
    let otpSessionData = ''; // Holds the target phone/email

    function resetLoginPortal() {
        panelPhoneOtp.classList.remove('hidden');
        panelEmailOtp.classList.add('hidden');
        panelVerificationCode.classList.add('hidden');
        oauthArea.classList.remove('hidden');
        loginDivider.classList.remove('hidden');
        loginMethodTabs.classList.remove('hidden');
        loginTitleArea.classList.remove('hidden');
        loginErrorCard.classList.add('hidden');
        inputPhone.value = '';
        inputEmail.value = '';
        clearOtpDigits();
    }

    // Switch phone/email tabs
    tabPhoneOtp.addEventListener('click', () => {
        currentAuthMode = 'phone';
        tabPhoneOtp.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-cyan text-cyan text-center';
        tabEmailOtp.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 text-center hover:text-slate-200';
        panelPhoneOtp.classList.remove('hidden');
        panelEmailOtp.classList.add('hidden');
        loginErrorCard.classList.add('hidden');
    });

    tabEmailOtp.addEventListener('click', () => {
        currentAuthMode = 'email';
        tabEmailOtp.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-cyan text-cyan text-center';
        tabPhoneOtp.className = 'flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 text-center hover:text-slate-200';
        panelEmailOtp.classList.remove('hidden');
        panelPhoneOtp.classList.add('hidden');
        loginErrorCard.classList.add('hidden');
    });

    // Send SMS OTP
    btnSendPhoneOtp.addEventListener('click', async () => {
        const phoneVal = inputPhone.value.trim();
        loginErrorCard.classList.add('hidden');
        try {
            await window.auth.sendPhoneOTP(phoneVal);
            otpSessionData = phoneVal;
            showOtpInputPanel();
        } catch (e) {
            showLoginError(e.message);
        }
    });

    // Send Email OTP
    btnSendEmailOtp.addEventListener('click', async () => {
        const emailVal = inputEmail.value.trim();
        loginErrorCard.classList.add('hidden');
        try {
            await window.auth.sendEmailOTP(emailVal);
            otpSessionData = emailVal;
            showOtpInputPanel();
        } catch (e) {
            showLoginError(e.message);
        }
    });

    // Forgot password trigger simulation
    btnForgotPassword?.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailVal = inputEmail.value.trim();
        if (!emailVal) {
            showLoginError('Input your email to request reset link.');
            return;
        }
        try {
            await window.auth.triggerPasswordReset(emailVal);
            alert(`Decryption/Password reset link simulated to ${emailVal}`);
        } catch (e) {
            showLoginError(e.message);
        }
    });

    function showOtpInputPanel() {
        panelPhoneOtp.classList.add('hidden');
        panelEmailOtp.classList.add('hidden');
        oauthArea.classList.add('hidden');
        loginDivider.classList.add('hidden');
        loginMethodTabs.classList.add('hidden');
        loginTitleArea.classList.add('hidden');
        
        panelVerificationCode.classList.remove('hidden');
        focusFirstOtpDigit();
    }

    function showLoginError(msg) {
        loginErrorText.innerText = msg;
        loginErrorCard.classList.remove('hidden');
    }

    // Google Apple Login Button Clicks
    btnLoginGoogle.addEventListener('click', async () => {
        loginErrorCard.classList.add('hidden');
        try {
            await window.auth.loginWithGoogle();
        } catch (e) {
            showLoginError('Google Auth connection failed.');
        }
    });

    btnLoginApple.addEventListener('click', async () => {
        loginErrorCard.classList.add('hidden');
        try {
            await window.auth.loginWithApple();
        } catch (e) {
            showLoginError('Apple ID handshake failed.');
        }
    });

    // Decrypt OTP Verification Code
    btnVerifyOtp.addEventListener('click', executeOtpVerification);

    btnBackToLogin.addEventListener('click', () => {
        resetLoginPortal();
    });

    // OTP Inputs Auto-Tabbing
    const otpInputs = otpInputRow.querySelectorAll('input');
    otpInputs.forEach((inp, idx) => {
        inp.addEventListener('input', (e) => {
            // Strip non-numbers
            inp.value = inp.value.replace(/[^0-9]/g, '');
            if (inp.value.length === 1 && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }
        });

        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && inp.value.length === 0 && idx > 0) {
                otpInputs[idx - 1].focus();
            }
            if (e.key === 'Enter') {
                executeOtpVerification();
            }
        });
    });

    function clearOtpDigits() {
        otpInputs.forEach(i => i.value = '');
    }

    function focusFirstOtpDigit() {
        setTimeout(() => otpInputs[0].focus(), 150);
    }

    async function executeOtpVerification() {
        loginErrorCard.classList.add('hidden');
        let code = '';
        otpInputs.forEach(i => code += i.value);

        if (code.length !== 6) {
            showLoginError('Fill in all 6 code inputs (Demo Code: 123456).');
            return;
        }

        try {
            if (currentAuthMode === 'phone') {
                await window.auth.verifyPhoneOTP(otpSessionData, code);
            } else {
                await window.auth.verifyEmailOTP(otpSessionData, code);
            }
        } catch (e) {
            showLoginError(e.message);
            clearOtpDigits();
            focusFirstOtpDigit();
        }
    }


    // ==========================================
    // 4. THEME & NOTIFICATION MANAGEMENT
    // ==========================================
    function applyTheme(mode) {
        if (mode === 'light') {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
            themeIconIndicator.innerText = 'light_mode';
        } else {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
            themeIconIndicator.innerText = 'dark_mode';
        }
    }

    // Toggle button in header
    btnThemeToggle.addEventListener('click', () => {
        const activeTheme = htmlEl.classList.contains('dark') ? 'light' : 'dark';
        window.auth.updateSettings({ themeMode: activeTheme });
        applyTheme(activeTheme);
        selectTheme.value = activeTheme;
    });

    // Theme drop-down in settings
    selectTheme.addEventListener('change', (e) => {
        const theme = e.target.value;
        window.auth.updateSettings({ themeMode: theme });
        applyTheme(theme);
    });

    // Notifications switcher
    function updateNotificationToggleUI(enabled) {
        if (enabled) {
            btnToggleNotifications.className = 'w-12 h-6 rounded-full bg-cyan flex items-center px-1 transition-all duration-300';
            notifToggleDot.className = 'w-4 h-4 rounded-full bg-navy transition-transform duration-300 translate-x-6';
        } else {
            btnToggleNotifications.className = 'w-12 h-6 rounded-full bg-slate-700 flex items-center px-1 transition-all duration-300';
            notifToggleDot.className = 'w-4 h-4 rounded-full bg-slate-300 transition-transform duration-300 translate-x-0';
        }
    }

    btnToggleNotifications.addEventListener('click', () => {
        const currentEnabled = window.auth.user.settings.notificationsEnabled;
        const targetState = !currentEnabled;
        window.auth.updateSettings({ notificationsEnabled: targetState });
        updateNotificationToggleUI(targetState);
    });

    btnSignOut.addEventListener('click', () => {
        window.auth.logout();
    });


    // ==========================================
    // 5. CAMERA & SCAN VIEW LOGIC
    // ==========================================
    async function startCamera() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 640, height: 480 }
            });
            webcamVideo.srcObject = cameraStream;
            webcamVideo.classList.remove('hidden');
            scannerPlaceholder.classList.add('hidden');
            
            // Update sensor ping tags
            camPingDot.className = 'w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse';
            camStatusLabel.innerText = 'Sensor Online';
            btnCameraTrigger.innerHTML = `<span class="material-symbols-outlined text-sm">videocam_off</span> Disable Camera`;
        } catch (e) {
            console.error('Camera stream access failed:', e);
            alert('Sensor stream connection error. Verify permissions in browser headers.');
            stopCamera();
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        webcamVideo.srcObject = null;
        webcamVideo.classList.add('hidden');
        scannerPlaceholder.classList.remove('hidden');
        
        // Reset labels
        camPingDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-500';
        camStatusLabel.innerText = 'Sensor Offline';
        btnCameraTrigger.innerHTML = `<span class="material-symbols-outlined text-sm">photo_camera</span> Enable Camera`;
    }

    btnCameraTrigger.addEventListener('click', () => {
        if (cameraStream) {
            stopCamera();
        } else {
            startCamera();
        }
    });

    // Upload files handlers
    btnUploadTrigger.addEventListener('click', () => {
        inputFileUploader.click();
    });

    inputFileUploader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFileForScan = file;
            triggerScanSimulation(file, file.name.split('.')[0], false);
        }
    });

    // Drag and Drop implementation
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.classList.add('bg-cyan/15', 'border-cyan');
    });

    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.classList.remove('bg-cyan/15', 'border-cyan');
    });

    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.classList.remove('bg-cyan/15', 'border-cyan');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedFileForScan = file;
            triggerScanSimulation(file, file.name.split('.')[0], false);
        }
    });

    // Render sample test triggers
    function renderSampleFoods() {
        sampleFoodsList.innerHTML = '';
        SAMPLES.forEach(sample => {
            const card = document.createElement('button');
            card.className = 'sample-food-card p-4 glass rounded-2xl border border-slate-800/10 flex items-center gap-3 text-left active:scale-[0.98] transition-all hover:border-cyan/30';
            card.innerHTML = `
                <div class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-800/10 text-cyan">
                    <span class="material-symbols-outlined text-base">${sample.icon}</span>
                </div>
                <div>
                    <h4 class="text-xs font-bold font-display text-slate-800 dark:text-slate-100">${sample.name}</h4>
                    <p class="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Test Signature</p>
                </div>
            `;
            card.addEventListener('click', () => {
                triggerScanSimulation(sample.key, sample.name, true);
            });
            sampleFoodsList.appendChild(card);
        });
    }
    renderSampleFoods();

    // Manual Food Search Scanner
    btnManualScan.addEventListener('click', () => {
        const manualQuery = inputManualFood.value.trim();
        if (!manualQuery) return;
        triggerScanSimulation(manualQuery, manualQuery, false);
        inputManualFood.value = '';
    });

    inputManualFood.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btnManualScan.click();
        }
    });


    // ==========================================
    // 6. VOLUMETRIC SCAN SIMULATOR
    // ==========================================
    async function triggerScanSimulation(targetInput, customName, isSample) {
        // Toggle logs layout view
        scanConsole.classList.remove('hidden');
        scanConsoleLogs.innerHTML = '';
        scanProgressPercentage.innerText = '0%';
        scanProgressBar.style.width = '0%';
        
        // Activate scanner lines
        scannerLaser.classList.remove('hidden');

        // Scroll page slightly to focus console on mobile
        scanConsole.scrollIntoView({ behavior: 'smooth', block: 'end' });

        const logMsg = (text, type = 'info') => {
            const row = document.createElement('div');
            row.className = `flex gap-2 font-mono text-[10px] leading-relaxed ${
                type === 'success' ? 'text-green-400' : type === 'warn' ? 'text-red-400' : 'text-slate-400'
            }`;
            row.innerHTML = `<span class="text-slate-600">[${new Date().toLocaleTimeString()}]</span><span>${text}</span>`;
            scanConsoleLogs.appendChild(row);
            scanConsoleLogs.scrollTop = scanConsoleLogs.scrollHeight;
        };

        try {
            // Stop camera if running during scan to stabilize views
            stopCamera();

            const scanResult = await window.ai.analyze(targetInput, customName, (percent, msg) => {
                scanProgressPercentage.innerText = `${percent}%`;
                scanProgressBar.style.width = `${percent}%`;
                
                let type = 'info';
                if (percent === 90) type = 'success';
                logMsg(msg, type);
            });

            // If it succeeded, log and save to local storage DB
            logMsg('Decrypting output vectors. Finalizing scan object write.', 'success');
            
            setTimeout(() => {
                // Save Scan to DB
                const saved = window.db.saveScan(scanResult);
                
                // Hide Laser sweep
                scannerLaser.classList.add('hidden');
                scanConsole.classList.add('hidden');
                
                // Update counter
                updateTotalScansCounter();
                
                // Route to Details Analysis page
                displayAnalysisResults(saved);
            }, 600);

        } catch (error) {
            logMsg(`Process Aborted: ${error.message}`, 'warn');
            scannerLaser.classList.add('hidden');
        }
    }

    function updateTotalScansCounter() {
        const count = window.db.getAllScans().length;
        if (totalScansCount) {
            totalScansCount.innerText = count.toString();
        }
    }


    // ==========================================
    // 7. DETAILED ANALYSIS RESULTS VIEW
    // ==========================================
    function displayAnalysisResults(scan) {
        navigateToTab('screen-analysis');
        
        analysisFoodName.innerText = scan.foodName;
        analysisImageLabel.innerText = scan.foodName;
        analysisImage.src = scan.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800';
        
        // Verdict styling calculations
        analysisVerdictCard.className = `p-5 rounded-2xl text-center shadow-lg border verdict-${scan.verdict.toLowerCase()}`;
        analysisVerdictPill.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white dark:bg-slate-900 border border-current`;
        analysisVerdictPill.innerText = scan.verdict;
        analysisVerdictDescription.innerText = scan.verdictDescription;

        // Caloric Ring updates (Dasharray: 440 circumference)
        analysisCalories.innerText = scan.calories;
        const calPercentage = Math.min(Math.round((scan.calories / 2000) * 100), 100);
        analysisCaloriePercentage.innerText = calPercentage;
        
        const offset = 440 - (440 * (calPercentage / 100));
        calorieProgressCircle.style.strokeDashoffset = offset;

        // Macro sheet
        macroProtein.innerText = scan.nutrients.protein;
        macroCarbs.innerText = scan.nutrients.carbs;
        macroFats.innerText = scan.nutrients.fats;
        macroSodium.innerText = scan.nutrients.sodium;

        detailCarbsTotal.innerText = `${scan.nutrients.carbs}g`;
        detailFiber.innerText = scan.nutrients.fiber || '0';
        detailSugar.innerText = scan.nutrients.sugar || '0';

        detailFatsTotal.innerText = `${scan.nutrients.fats}g`;
        detailMonofat.innerText = scan.nutrients.monounsaturatedFat || '0';
        detailSatfat.innerText = scan.nutrients.saturatedFat || '0';

        // Health Recommendations alternatives
        analysisAlternative.innerText = scan.alternative;
        analysisAlternativeIcon.innerText = scan.alternativeIcon || 'eco';

        // Render AI Insights Lists
        analysisInsightsList.innerHTML = '';
        scan.insights.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'flex gap-4 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors';
            card.innerHTML = `
                <div class="flex-shrink-0 w-9 h-9 rounded-full bg-cyan/15 text-cyan border border-cyan/20 flex items-center justify-center">
                    <span class="material-symbols-outlined text-base">${insight.icon}</span>
                </div>
                <div>
                    <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">${insight.title}</h4>
                    <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">${insight.description}</p>
                </div>
            `;
            analysisInsightsList.appendChild(card);
        });
    }

    btnBackToScan.addEventListener('click', () => {
        navigateToTab('screen-scan');
    });


    // ==========================================
    // 8. ARCHIVES / HISTORY INTERFACE
    // ==========================================
    function renderHistoryGrid() {
        const scans = window.db.getAllScans();
        const searchQuery = inputHistorySearch.value.toLowerCase().trim();
        
        // Filter elements
        const filtered = scans.filter(scan => {
            const matchesSearch = scan.foodName.toLowerCase().includes(searchQuery);
            const matchesCategory = activeFilter === 'all' || scan.verdict === activeFilter;
            return matchesSearch && matchesCategory;
        });

        // Toggle empty page
        if (filtered.length === 0) {
            historyGrid.classList.add('hidden');
            historyEmptyState.classList.remove('hidden');
        } else {
            historyEmptyState.classList.add('hidden');
            historyGrid.classList.remove('hidden');
            
            historyGrid.innerHTML = '';
            filtered.forEach(scan => {
                const dateText = new Date(scan.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const card = document.createElement('div');
                card.className = 'glass rounded-3xl p-4 glass-hover group cursor-pointer border-slate-800/10 flex flex-col justify-between';
                card.innerHTML = `
                    <div>
                        <!-- Image wrapper -->
                        <div class="relative h-40 w-full rounded-2xl overflow-hidden mb-4 border border-slate-800/5 bg-slate-950">
                            <img src="${scan.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${scan.foodName}"/>
                            <div class="absolute top-3 right-3 bg-navy/85 backdrop-blur px-2.5 py-0.5 rounded-full border border-slate-800/85">
                                <span class="text-[9px] uppercase tracking-widest font-extrabold text-${scan.verdict === 'Excellent' || scan.verdict === 'Good' ? 'cyan' : 'red-400'}">${scan.verdict}</span>
                            </div>
                        </div>
                        
                        <!-- Metadata details -->
                        <div class="flex justify-between items-start gap-4 mb-2">
                            <div>
                                <h3 class="text-sm font-bold font-display group-hover:text-cyan transition-colors line-clamp-1 text-slate-800 dark:text-slate-100">${scan.foodName}</h3>
                                <p class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                                    <span class="material-symbols-outlined text-[12px]">calendar_today</span>
                                    ${dateText}
                                </p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-sm font-black text-cyan font-display">${scan.calories}</p>
                                <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">kcal</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick nutritional indicator chips -->
                    <div class="mt-4 pt-3 border-t border-slate-800/10 dark:border-slate-800/40 flex justify-between gap-1 text-[10px] text-slate-400 font-mono font-semibold">
                        <span>P: ${scan.nutrients.protein}g</span>
                        <span>C: ${scan.nutrients.carbs}g</span>
                        <span>F: ${scan.nutrients.fats}g</span>
                    </div>
                `;
                
                // Open Details Scan Page
                card.addEventListener('click', () => {
                    displayAnalysisResults(scan);
                });
                
                historyGrid.appendChild(card);
            });
        }
    }

    // Filter Buttons Clicks
    historyFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            historyFilterBtns.forEach(b => {
                b.className = 'history-filter-btn px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800';
            });
            e.currentTarget.className = 'history-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan text-navy';
            activeFilter = e.currentTarget.getAttribute('data-filter');
            renderHistoryGrid();
        });
    });

    // Search query listener
    inputHistorySearch.addEventListener('input', renderHistoryGrid);

    btnHistoryScanNow.addEventListener('click', () => navigateToTab('screen-scan'));

    // Clear history database
    btnClearHistory.addEventListener('click', () => {
        if (confirm('Decrypt and wipe all nutritional archives from this local node? This action is permanent.')) {
            window.db.clearAll();
            renderHistoryGrid();
            updateTotalScansCounter();
        }
    });

});
