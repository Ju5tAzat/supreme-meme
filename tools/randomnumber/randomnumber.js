/**
 * Random Number Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const randomNumberEl = document.getElementById('randomNumber');
    const minValue = document.getElementById('minValue');
    const maxValue = document.getElementById('maxValue');
    const count = document.getElementById('count');
    const generateBtn = document.getElementById('generateBtn');
    const historyList = document.getElementById('historyList');

    const HISTORY_KEY = 'randomNumberHistory';
    const MAX_HISTORY = 15;

    // Generate random number
    function generate() {
        const min = parseInt(minValue.value) || 1;
        const max = parseInt(maxValue.value) || 100;
        const numCount = parseInt(count.value) || 1;
        
        // Validate
        if (min > max) {
            showNotification('Минимум не может быть больше максимума', true);
            return;
        }

        const numbers = [];
        for (let i = 0; i < numCount; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.push(num);
        }

        const result = numbers.join(', ');
        randomNumberEl.textContent = result;
        
        // Animate
        randomNumberEl.parentElement.style.animation = 'none';
        setTimeout(() => {
            randomNumberEl.parentElement.style.animation = 'pulse 0.3s ease';
        }, 10);
        
        // Add to history
        addToHistory(result);
    }

    // Get history
    function getHistory() {
        return loadFromLocalStorage(HISTORY_KEY) || [];
    }

    // Add to history
    function addToHistory(number) {
        let history = getHistory();
        history.unshift(number);
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }
        saveToLocalStorage(HISTORY_KEY, history);
        renderHistory();
    }

    // Render history
    function renderHistory() {
        const history = getHistory();
        if (history.length === 0) {
            historyList.innerHTML = '<li>История пуста</li>';
            return;
        }
        
        historyList.innerHTML = history.map(num => `<li>${num}</li>`).join('');
    }

    // Event listeners
    generateBtn.addEventListener('click', generate);
    
    // Generate on Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generate();
        }
    });

    // Initial
    renderHistory();
});
