/**
 * aiEngine.js
 * Simulated Multi-Stage Clinical AI Scanning Engine
 * Emulates Convolutional Neural Network (CNN) analysis of meals.
 * Includes multiple pre-configured food signatures and a manual-override generator.
 */

const FOOD_SIGNATURES = {
    'avocado toast': {
        foodName: 'Avocado Toast',
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
    'grilled salmon salad': {
        foodName: 'Grilled Salmon Salad',
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
    'pepperoni pizza': {
        foodName: 'Pepperoni Pizza (2 Slices)',
        calories: 580,
        nutrients: {
            protein: 24,
            carbs: 68,
            fats: 22,
            sodium: 1320,
            fiber: 3,
            sugar: 6,
            saturatedFat: 11,
            monounsaturatedFat: 8
        },
        verdict: 'Moderate',
        verdictDescription: 'Contains high sodium levels and saturated fats. Refined crust carbohydrates may trigger rapid glucose spikes. Provides high calcium and protein.',
        alternative: 'Thin-crust vegetable pizza with goat cheese',
        alternativeIcon: 'local_pizza',
        tags: ['High-Sodium', 'High-Saturated-Fat'],
        insights: [
            {
                title: 'Saturated Fat Warning',
                description: '11g of saturated fat is ~50% of your daily limit. Excess intake raises LDL levels.',
                icon: 'warning'
            },
            {
                title: 'Somatic Recovery',
                description: 'Rich in dairy calcium (35% DV) and phosphorus, essential for bone maintenance.',
                icon: 'sports_gymnastics'
            }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
    },
    'chocolate donut': {
        foodName: 'Chocolate Frosted Donut',
        calories: 320,
        nutrients: {
            protein: 3,
            carbs: 42,
            fats: 16,
            sodium: 310,
            fiber: 1,
            sugar: 26,
            saturatedFat: 8,
            monounsaturatedFat: 6
        },
        verdict: 'Avoid',
        verdictDescription: 'Extremely high in refined sugar (26g) and empty calories with negligible fiber. Promotes vascular inflammation and rapid energy crashes.',
        alternative: 'Oatmeal with dark cocoa nibs and raspberries',
        alternativeIcon: 'eco',
        tags: ['High-Sugar', 'Ultra-Processed', 'Low-Nutrient'],
        insights: [
            {
                title: 'Glucose Shock',
                description: 'Refined flour and sugars trigger immediate insulin spikes, encouraging lipid storage.',
                icon: 'trending_up'
            },
            {
                title: 'Cardiovascular Risk',
                description: 'Trans-fat and hydrogenated lipid residues inside fried dough trigger systemic vascular stress.',
                icon: 'heart_broken'
            }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800'
    },
    'greek yogurt bowl': {
        foodName: 'Greek Yogurt & Berries Bowl',
        calories: 210,
        nutrients: {
            protein: 18,
            carbs: 18,
            fats: 6,
            sodium: 70,
            fiber: 3,
            sugar: 12,
            saturatedFat: 3,
            monounsaturatedFat: 2
        },
        verdict: 'Excellent',
        verdictDescription: 'Outstanding protein-to-calorie ratio. Live probiotic cultures benefit gut microbiota. Berries supply rich organic antioxidants.',
        alternative: 'Plain Kefir with chia seeds',
        alternativeIcon: 'eco',
        tags: ['High-Protein', 'Probiotic-Rich', 'Antioxidant-Boost'],
        insights: [
            {
                title: 'Microbiome Health',
                description: 'Active strains of Lactobacillus bulgaricus improve digestion and immunological defense.',
                icon: 'coronavirus' // Looks like a bacteria cell
            },
            {
                title: 'Cellular Defense',
                description: 'Anthocyanins in blueberries neutralize free radicals that damage DNA structure.',
                icon: 'shield_with_heart'
            }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
    }
};

const aiEngine = {
    /**
     * Simulates scanning a food item using step-by-step clinical pipeline.
     * @param {string|File} target - Either a known food name string, or a File object from upload.
     * @param {string} customName - Optional name typed by the user for custom simulations.
     * @param {function} onProgress - Callback triggered with (percent, logMessage) at each stage.
     * @returns {Promise<Object>} The resolved complete clinical Scan object.
     */
    async analyze(target, customName = '', onProgress = () => {}) {
        return new Promise((resolve) => {
            const stages = [
                {
                    percent: 15,
                    log: 'Ingesting raster frames. Normalizing luminosity and isolating chroma bands...',
                    duration: 900
                },
                {
                    percent: 45,
                    log: 'Executing Convolutional Neural Network. Activating convolutional kernel nodes...',
                    duration: 1200
                },
                {
                    percent: 75,
                    log: 'Matching image vector structures against global USDA & Clinical Food Ontologies...',
                    duration: 1000
                },
                {
                    percent: 90,
                    log: 'Applying nutrition safety verdict thresholds and computing healthy alternatives...',
                    duration: 800
                }
            ];

            let stageIdx = 0;

            const runNextStage = () => {
                if (stageIdx < stages.length) {
                    const current = stages[stageIdx];
                    onProgress(current.percent, current.log);
                    stageIdx++;
                    setTimeout(runNextStage, current.duration);
                } else {
                    // Complete state
                    onProgress(100, 'Analysis complete. Compiling clinical-grade biomarker sheet.');
                    
                    setTimeout(() => {
                        let finalResult = null;
                        
                        // Parse target
                        if (typeof target === 'string') {
                            const key = target.toLowerCase();
                            if (FOOD_SIGNATURES[key]) {
                                finalResult = { ...FOOD_SIGNATURES[key] };
                            }
                        }

                        // Fallback/Custom image upload logic
                        if (!finalResult) {
                            const name = customName || (target instanceof File ? target.name.split('.')[0] : 'Gourmet Meal');
                            finalResult = this.generateCustomSignature(name);
                        }

                        // Add dynamic metadata
                        finalResult.id = 'scan-' + Date.now();
                        finalResult.timestamp = new Date().toISOString();

                        // Resolve
                        resolve(finalResult);
                    }, 500);
                }
            };

            // Start the sequence
            onProgress(0, 'Initializing imaging module. Accessing camera data feed...');
            setTimeout(runNextStage, 600);
        });
    },

    /**
     * Generates a realistic, logically-sound nutritional report for custom meals.
     * @param {string} rawName - The name entered by the user or extracted from the file name.
     */
    generateCustomSignature(rawName) {
        // Clean name
        const cleanName = rawName.trim().replace(/[-_]/g, ' ');
        const nameLower = cleanName.toLowerCase();
        
        // Default templates based on keywords
        let verdict = 'Good';
        let cal = 350;
        let protein = 12;
        let carbs = 35;
        let fats = 12;
        let sodium = 300;
        let fiber = 3;
        let sugar = 8;
        let satFat = 3;
        let monoFat = 6;
        let alt = 'Sautéed broccoli and baked lean breast chicken';
        let altIcon = 'eco';
        let tags = ['Balanced-Diet'];
        let description = `This custom meal, ${cleanName}, offers moderate macronutrient ratios. The clinical profile indicates standard density suitable for a daily caloric layout.`;

        // Pattern matching for custom food names
        if (nameLower.includes('salad') || nameLower.includes('vegetable') || nameLower.includes('green')) {
            verdict = 'Excellent';
            cal = Math.floor(Math.random() * 150) + 100;
            protein = Math.floor(Math.random() * 8) + 4;
            carbs = Math.floor(Math.random() * 15) + 10;
            fats = Math.floor(Math.random() * 10) + 5;
            sodium = Math.floor(Math.random() * 250) + 100;
            fiber = Math.floor(Math.random() * 5) + 4;
            sugar = Math.floor(Math.random() * 5) + 2;
            satFat = 1;
            monoFat = fats - 2;
            alt = 'Kale salad with lemon-tahini squeeze';
            tags = ['Vegan', 'Low-Calorie', 'High-Fiber'];
            description = `Outstanding health properties detected in this leafy meal. High density of mineral ions and dietary fibers helps maintain strong insulin and arterial health.`;
        } else if (nameLower.includes('burger') || nameLower.includes('fry') || nameLower.includes('cake') || nameLower.includes('cookie') || nameLower.includes('sweet') || nameLower.includes('candy') || nameLower.includes('soda')) {
            verdict = 'Avoid';
            cal = Math.floor(Math.random() * 300) + 450;
            protein = Math.floor(Math.random() * 15) + 5;
            carbs = Math.floor(Math.random() * 40) + 50;
            fats = Math.floor(Math.random() * 15) + 20;
            sodium = Math.floor(Math.random() * 700) + 500;
            fiber = Math.floor(Math.random() * 2);
            sugar = Math.floor(Math.random() * 30) + 15;
            satFat = Math.floor(fats * 0.45);
            monoFat = fats - satFat - 2;
            alt = 'Grilled portobello mushroom bun or fresh organic fruit slices';
            altIcon = 'eco';
            tags = ['High-Sodium', 'High-Saturated-Fat', 'Processed-Sugar'];
            description = `Warning: Nutrition scanner identifies high density of simple carbohydrates, lipid compounds, and heavy sodium. Increases stress load on the liver and circulatory vessels.`;
        } else if (nameLower.includes('chicken') || nameLower.includes('fish') || nameLower.includes('meat') || nameLower.includes('egg') || nameLower.includes('tofu') || nameLower.includes('steak')) {
            verdict = 'Good';
            cal = Math.floor(Math.random() * 250) + 250;
            protein = Math.floor(Math.random() * 15) + 20;
            carbs = Math.floor(Math.random() * 20);
            fats = Math.floor(Math.random() * 10) + 10;
            sodium = Math.floor(Math.random() * 400) + 300;
            fiber = Math.floor(Math.random() * 2);
            sugar = Math.floor(Math.random() * 3);
            satFat = Math.floor(fats * 0.3);
            monoFat = fats - satFat - 1;
            alt = 'Boiled eggs with steamed spinach leaves';
            tags = ['High-Protein', 'Low-Carb'];
            description = `Strong protein foundation. Highly recommended for muscular recovery and maintaining body cell integrity. Monitor sodium and oil seasonings used during cooking.`;
        }

        // Return compiled signature
        return {
            foodName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            calories: cal,
            nutrients: {
                protein,
                carbs,
                fats,
                sodium,
                fiber,
                sugar,
                saturatedFat: satFat,
                monounsaturatedFat: monoFat
            },
            verdict,
            verdictDescription: description,
            alternative: alt,
            alternativeIcon: altIcon,
            tags,
            insights: [
                {
                    title: 'Biomarker Extraction',
                    description: `Macronutrient density checks reveal ${protein}g protein and ${caloriesToJoules(cal)} kJ energy profile.`,
                    icon: 'query_stats'
                },
                {
                    title: 'Clinician Summary',
                    description: `Recommended to balance this dish with raw leafy microgreens to supply organic enzymes.`,
                    icon: 'medical_services'
                }
            ],
            imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800'
        };
    }
};

function caloriesToJoules(cal) {
    return Math.floor(cal * 4.184);
}

// Bind to window object
window.ai = aiEngine;
