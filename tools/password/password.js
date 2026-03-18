/**
 * Генератор паролей - логика работы
 */

// Наборы символов
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// DOM элементы
const passwordOutput = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// Обновление длины пароля
lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
});

// Генерация пароля
function generatePassword() {
    let charset = '';
    let password = '';
    
    // Собираем набор символов
    if (uppercaseCheck.checked) charset += uppercaseChars;
    if (lowercaseCheck.checked) charset += lowercaseChars;
    if (numbersCheck.checked) charset += numberChars;
    if (symbolsCheck.checked) charset += symbolChars;
    
    // Проверка, что выбран хотя бы один тип
    if (charset.length === 0) {
        alert('Выберите хотя бы один тип символов!');
        return;
    }
    
    const length = parseInt(lengthSlider.value);
    
    // Генерация пароля
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    passwordOutput.value = password;
    updateStrength(password);
}

// Оценка надёжности пароля
function updateStrength(password) {
    let strength = 0;
    
    // Длина
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    
    // Разнообразие символов
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Обновление UI
    strengthFill.className = 'strength-fill';
    
    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Надёжность: Слабый';
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Надёжность: Средний';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Надёжность: Надёжный';
        strengthText.style.color = 'var(--success)';
    }
}

// Копирование пароля
copyBtn.addEventListener('click', function() {
    const password = passwordOutput.value;
    
    if (!password) return;
    
    navigator.clipboard.writeText(password).then(function() {
        copyBtn.textContent = '✓';
        copyBtn.classList.add('copied');
        
        setTimeout(function() {
            copyBtn.textContent = '📋';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

// События
generateBtn.addEventListener('click', generatePassword);

// Генерация пароля при загрузке
generatePassword();
