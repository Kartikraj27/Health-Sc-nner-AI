/**
 * database.js
 * Persistence Layer for Scan History
 * Utilizes LocalStorage for local data storage and contains pre-seeded, high-fidelity scans.
 */

const STORAGE_KEY = 'health_scanner_scans';

// Seeds for first-time usage
const SEED_SCANS = [
    {
        id: 'scan-1',
        foodName: 'Avocado Toast',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), // 3.5 hours ago
        calories: 250,
        nutrients: {
            protein: 6,
            carbs: 20,
            fats: 18,
            sodium: 150,
            fiber: 8,
            sugar: 3,
            saturatedFat: 3,
            monounsaturatedFat: 15
        },
        verdict: 'Excellent',
        verdictDescription: 'Rich in monounsaturated fats and high fiber content which supports heart health and optimal digestion.',
        alternative: 'Whole grain crackers with hummus',
        alternativeIcon: 'eco',
        tags: ['Vegan', 'Heart-Healthy', 'High-Fiber'],
        insights: [
            {
                title: 'Fitness Impact',
                description: 'High healthy fats for sustained energy and cognitive function.',
                icon: 'fitness_center'
            },
            {
                title: 'Cardiovascular Support',
                description: 'Monounsaturated oleic acid helps maintain healthy cholesterol levels.',
                icon: 'favorite'
            }
        ],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5GAKWxILBx5DM-y5zWOncbAxT02odvPJStQ1mlGk3DaWg_wf2Ad6mdcfbH2lRXh1YLMBHB0t-Sz_yk62r6PAv-yd1fxqT9z4M3ckmcpkRMbarRKKoIIJjBo3Slt_pgkgO7ig2EWSjApmz9ng3y4fxq2kAJGLbfvKd1Lgv9tjah9zw1Ca3oGQArjXJtr-PbZbSb-ljJjT_fMpEHYvkpssC4h3P1Ts3oIZDjbI-F3bnbOG5iqD5cjI6RfBQX7rp50AcoMBApxa56P6J'
    },
    {
        id: 'scan-2',
        foodName: 'Grilled Salmon Salad',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        calories: 410,
        nutrients: {
            protein: 34,
            carbs: 12,
            fats: 22,
            sodium: 480,
            fiber: 4,
            sugar: 2,
            saturatedFat: 4,
            monounsaturatedFat: 12
        },
        verdict: 'Excellent',
        verdictDescription: 'Superb source of lean high-quality protein and Omega-3 fatty acids. Extremely low glycemic index.',
        alternative: 'Baked Cod with Quinoa',
        alternativeIcon: 'eco',
        tags: ['High-Protein', 'Keto-Friendly', 'Omega-3'],
        insights: [
            {
                title: 'Muscle Synthesis',
                description: '34g of highly bioavailable protein triggers optimal muscle recovery.',
                icon: 'exercise'
            },
            {
                title: 'Anti-Inflammatory',
                description: 'Omega-3 EPA/DHA lipids strongly combat chronic joint and vascular inflammation.',
                icon: 'shield'
            }
        ],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmJNTde2VvMsVHNwDRed3PucmhLkPZecZvXG55paFg17VnM3_fYf9aAhZXbMst8uZwz3Z595dVVwIoicz76by62EVNJ2afxF31B3XifyK0hVx8RhL4_Jawwg1hFAm6M_MeGKirQljcT0anoh5SQvU1-n9SKfokAmz6uwa5LNhVArGPBqEp7MnyPHWm-b0bUHBoUbHwFhUarKfa1WstgA1qtp1FsuKkynhjJHTyR4kOKp97cye19wLEeEEk9c_2Ya1epbRHFVbKYecn'
    },
    {
        id: 'scan-3',
        foodName: 'Ahi Tuna Poke Bowl',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        calories: 525,
        nutrients: {
            protein: 28,
            carbs: 64,
            fats: 14,
            sodium: 890,
            fiber: 6,
            sugar: 8,
            saturatedFat: 2,
            monounsaturatedFat: 6
        },
        verdict: 'Good',
        verdictDescription: 'Balanced meal with high protein and vegetables. Moderate carbohydrates from white/brown rice. Soy sauce adds moderate sodium content.',
        alternative: 'Tuna Salad wrap with low-sodium dressing',
        alternativeIcon: 'eco',
        tags: ['High-Protein', 'Balanced-Macros'],
        insights: [
            {
                title: 'Macronutrient Split',
                description: 'A stable blend of slow-burning complex carbs, healthy fats, and lean fish protein.',
                icon: 'insights'
            },
            {
                title: 'Sodium Awareness',
                description: '890mg of Sodium represents ~38% of recommended daily allowance. Drink extra water.',
                icon: 'water_drop'
            }
        ],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bDmS731_9l1036Eezf3AixFtV1k26IDyxzWxyi_0vYcLhn4_glOVfJLcSvkNLpHmxcrdq7nhhKpySk4EBb4X5CNiS-0lpvncqPQPyrulwDz2AximhlYnST9h16vrqpdQm5N5QwKNpdDC0mnqkF-O61Jq-mhGiRoJus3tsLS5MnYPANoSbTqRH9yGSSiCnaIekm13tJlIcXWYrC9gx4_bzfceNqBr9BZ4cM2OzAxSByQkNdpS5l57aPgX4pIOLcNI7bT8rm6aShHa'
    },
    {
        id: 'scan-4',
        foodName: 'Green Detox Smoothie',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        calories: 185,
        nutrients: {
            protein: 4,
            carbs: 38,
            fats: 1,
            sodium: 65,
            fiber: 7,
            sugar: 22,
            saturatedFat: 0,
            monounsaturatedFat: 0
        },
        verdict: 'Excellent',
        verdictDescription: 'Packed with micronutrients, trace minerals, and dietary fibers from raw spinach, green apple, and celery. Very low in saturated fats.',
        alternative: 'Celery & cucumber cold-pressed juice',
        alternativeIcon: 'eco',
        tags: ['Vegan', 'Low-Sodium', 'Antioxidant-Rich'],
        insights: [
            {
                title: 'Micronutrient Boost',
                description: 'Exceedingly rich in Vitamin K, Vitamin C, Iron, and Magnesium to bolster metabolism.',
                icon: 'health_and_safety'
            },
            {
                title: 'Natural Fructose',
                description: '22g of sugars are raw fruit fructose, bound to soluble fibers which slows blood insulin spikes.',
                icon: 'bolt'
            }
        ],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZv6YQNpSy8QcvCtSra8wzjyFgto8Ylp9VhEHdBh0Iy8gPfPlGd1lCz9zYjQ7mtxfcY0kxf_B5aWL7TlIzsFLPY2g0GWdLaWy-7A5q93g5W2nJfPvgj3yYU7KiyRZEjW3Gj_3vzItpft1y75lORx4RsOQLNY-txmHqCREQM_Jdx0vfkfTMN1jD3-6Pa--uX_BL_xJaMW42o6ceTbUxGLdz4KzChL2fgTNCk0clI91YCyG3WCiThWh_3t5m4rdh_ZjyBIjhmxPM6hzV'
    }
];

const database = {
    /**
     * Initializes scans in localStorage with seed data if empty.
     */
    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SCANS));
        }
    },

    /**
     * Retrieves all scans from local storage, sorted newest first.
     * @returns {Array} scans list
     */
    getAllScans() {
        this.init();
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const scans = JSON.parse(raw) || [];
            return scans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (e) {
            console.error('Error reading scan history database:', e);
            return [];
        }
    },

    /**
     * Retrieves a single scan by ID.
     * @param {string} id - scan unique id
     * @returns {Object|null} scan object or null
     */
    getScanById(id) {
        const scans = this.getAllScans();
        return scans.find(s => s.id === id) || null;
    },

    /**
     * Adds a new scan to history.
     * @param {Object} scan - Scan object to store
     */
    saveScan(scan) {
        const scans = this.getAllScans();
        
        // Ensure unique ID
        if (!scan.id) {
            scan.id = 'scan-' + Date.now();
        }
        if (!scan.timestamp) {
            scan.timestamp = new Date().toISOString();
        }

        scans.unshift(scan);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
        return scan;
    },

    /**
     * Deletes a scan by its ID.
     * @param {string} id - unique scan id
     */
    deleteScan(id) {
        const scans = this.getAllScans();
        const filtered = scans.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },

    /**
     * Clears all scans.
     */
    clearAll() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
};

// Bind to window object
window.db = database;
window.db.init();
