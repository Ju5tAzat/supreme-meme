/**
 * Калькулятор - логика работы
 */

let display = document.getElementById('display');
let currentExpression = '';

// Добавление числа
function appendNumber(num) {
    if (display.value === '0' || display.value === 'Error') {
        display.value = num;
    } else {
        display.value += num;
    }
    currentExpression = display.value;
}

// Добавление оператора
function appendOperator(operator) {
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/', '%'];
    
    if (operators.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + operator;
    } else {
        display.value += operator;
    }
    currentExpression = display.value;
}

// Очистка дисплея
function clearDisplay() {
    display.value = '0';
    currentExpression = '';
}

// Удаление последнего символа
function deleteChar() {
    if (display.value.length === 1 || display.value === 'Error') {
        display.value = '0';
    } else {
        display.value = display.value.slice(0, -1);
    }
    currentExpression = display.value;
}

// Вычисление результата
function calculate() {
    try {
        // Заменяем визуальные символы на математические
        let expression = display.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        // Проверка на допустимые символы
        if (!/^[0-9+\-*/.()% ]+$/.test(expression)) {
            display.value = 'Error';
            return;
        }
        
        const result = eval(expression);
        
        // Проверка на бесконечность
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        
        // Округление до разумного количества знаков
        display.value = Math.round(result * 100000000) / 100000000;
        currentExpression = display.value;
    } catch (e) {
        display.value = 'Error';
    }
}

// Обработка клавиатуры
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === '%') {
        appendOperator('%');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteChar();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

// Инициализация
display.value = '0';
