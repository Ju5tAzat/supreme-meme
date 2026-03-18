/**
 * BMI Calculator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const unitButtons = document.querySelectorAll('.unit-btn');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const calculateBtn = document.getElementById('calculate-btn');
    const recalculateBtn = document.getElementById('recalculate-btn');
    const inputSection = document.querySelector('.input-section');
    const resultSection = document.getElementById('result');

    let currentUnit = 'metric';

    // Unit toggle
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            unitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentUnit = btn.dataset.unit;
            
            // Update unit labels
            document.querySelectorAll('.unit-label').forEach(label => {
                label.style.display = label.dataset.unit === currentUnit ? 'inline' : 'none';
            });

            // Update placeholders
            if (currentUnit === 'metric') {
                heightInput.placeholder = '175';
                weightInput.placeholder = '70';
                heightInput.max = 300;
                heightInput.min = 50;
                weightInput.max = 500;
                weightInput.min = 10;
            } else {
                heightInput.placeholder = '69';
                weightInput.placeholder = '154';
                heightInput.max = 120;
                heightInput.min = 20;
                weightInput.max = 1100;
                weightInput.min = 22;
            }
        });
    });

    // Calculate BMI
    calculateBtn.addEventListener('click', calculateBMI);

    function calculateBMI() {
        let height = parseFloat(heightInput.value);
        let weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value) || 30;
        const gender = genderSelect.value;

        // Validation
        if (!height || !weight) {
            showNotification('Пожалуйста, заполните рост и вес');
            return;
        }

        // Convert to metric if needed
        let heightM, weightKg;
        
        if (currentUnit === 'metric') {
            heightM = height / 100; // cm to m
            weightKg = weight;
        } else {
            // Imperial: height in inches, weight in pounds
            heightM = height * 0.0254; // inches to m
            weightKg = weight * 0.453592; // pounds to kg
        }

        // Calculate BMI
        const bmi = weightKg / (heightM * heightM);
        
        if (bmi < 10 || bmi > 60) {
            showNotification('Проверьте введённые значения');
            return;
        }

        displayResult(bmi, heightM, weightKg, age, gender);
    }

    function displayResult(bmi, heightM, weightKg, age, gender) {
        const bmiNumber = document.getElementById('bmi-number');
        const categoryText = document.getElementById('category-text');
        const categoryDiv = document.getElementById('bmi-category');
        const indicator = document.getElementById('bmi-indicator');
        const idealWeightEl = document.getElementById('ideal-weight');
        const categoryDesc = document.getElementById('category-description');

        // Display BMI value
        bmiNumber.textContent = bmi.toFixed(1);

        // Determine category
        let category, categoryClass, description;
        
        if (bmi < 18.5) {
            category = 'Недовес';
            categoryClass = 'category-underweight';
            description = 'Ваш вес ниже нормы. Рекомендуется набрать вес для здоровья.';
        } else if (bmi < 25) {
            category = 'Нормальный';
            categoryClass = 'category-normal';
            description = 'У вас здоровый вес. Продолжайте поддерживать форму!';
        } else if (bmi < 30) {
            category = 'Избыточный вес';
            categoryClass = 'category-overweight';
            description = 'У вас немного повышенный вес. Физические нагрузки помогут.';
        } else {
            category = 'Ожирение';
            categoryClass = 'category-obese';
            description = 'Рекомендуется консультация специалиста и изменение питания.';
        }

        categoryText.textContent = category;
        categoryDiv.className = 'bmi-category ' + categoryClass;
        categoryDesc.textContent = description;

        // Position indicator on scale (BMI 10-40 mapped to 0-100%)
        const indicatorPos = Math.max(0, Math.min(100, ((bmi - 10) / 30) * 100));
        indicator.style.left = indicatorPos + '%';

        // Calculate ideal weight (Devine formula)
        // For men: 50 + 2.3 * (height in inches - 60)
        // For women: 45.5 + 2.3 * (height in inches - 60)
        const heightInInches = heightM / 0.0254;
        let idealWeight;
        
        if (gender === 'male') {
            idealWeight = 50 + 2.3 * (heightInInches - 60);
        } else {
            idealWeight = 45.5 + 2.3 * (heightInInches - 60);
        }

        if (currentUnit === 'metric') {
            idealWeightEl.textContent = `${idealWeight.toFixed(1)} - ${(idealWeight + 5).toFixed(1)} кг`;
        } else {
            const idealLbs = idealWeight * 2.20462;
            idealWeightEl.textContent = `${idealLbs.toFixed(1)} - ${(idealLbs + 11).toFixed(1)} фунтов`;
        }

        // Show result, hide input
        inputSection.style.display = 'none';
        resultSection.style.display = 'block';
    }

    // Recalculate
    recalculateBtn.addEventListener('click', () => {
        resultSection.style.display = 'none';
        inputSection.style.display = 'block';
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && resultSection.style.display !== 'block') {
            calculateBMI();
        }
        if (e.key === 'Escape' && resultSection.style.display === 'block') {
            recalculateBtn.click();
        }
    });

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-info';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text-primary);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
