/**
 * Password Strength Checker - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const toggleBtn = document.getElementById('toggleBtn');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const scoreValue = document.getElementById('scoreValue');

    const criteriaIds = ['length', 'uppercase', 'lowercase', 'numbers', 'special'];

    // Check criteria
    function checkCriteria(password) {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Update UI
        criteriaIds.forEach(id => {
            const el = document.getElementById(id);
            el.classList.toggle('valid', criteria[id]);
        });

        return criteria;
    }

    // Calculate score
    function calculateScore(password, criteria) {
        if (!password) return 0;
        
        let score = 0;
        
        // Base points
        score += password.length * 4;
        
        // Criteria bonuses
        if (criteria.length) score += 10;
        if (criteria.uppercase) score += 10;
        if (criteria.lowercase) score += 10;
        if (criteria.numbers) score += 10;
        if (criteria.special) score += 15;
        
        // Length bonus
        if (password.length > 12) score += 10;
        if (password.length > 16) score += 10;
        
        // Mixed case bonus
        if (criteria.uppercase && criteria.lowercase) score += 5;
        
        // Number and special bonus
        if (criteria.numbers && criteria.special) score += 10;
        
        return Math.min(100, score);
    }

    // Get strength level
    function getStrength(score) {
        if (score < 25) return { level: 'weak', text: 'Слабый' };
        if (score < 50) return { level: 'fair', text: 'Средний' };
        if (score < 75) return { level: 'good', text: 'Хороший' };
        return { level: 'strong', text: 'Надёжный' };
    }

    // Update display
    function updateDisplay() {
        const password = passwordInput.value;
        const criteria = checkCriteria(password);
        const score = calculateScore(password, criteria);
        const strength = getStrength(score);

        // Update score
        scoreValue.textContent = score;

        // Update bar
        strengthFill.className = 'strength-fill';
        if (password) {
            strengthFill.classList.add(strength.level);
        }

        // Update text
        strengthText.textContent = password ? strength.text : 'Введите пароль';
    }

    // Toggle password visibility
    function toggleVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    }

    // Event listeners
    passwordInput.addEventListener('input', updateDisplay);
    toggleBtn.addEventListener('click', toggleVisibility);

    // Initial
    updateDisplay();
});
