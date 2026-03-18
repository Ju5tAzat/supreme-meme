/**
 * Конвертер единиц - логика работы
 */

// Переключение категорий
const categoryBtns = document.querySelectorAll('.category-btn');
const converterPanels = document.querySelectorAll('.converter-panel');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        btn.classList.add('active');
        
        // Скрываем все панели
        converterPanels.forEach(panel => panel.style.display = 'none');
        // Показываем выбранную панель
        document.getElementById(btn.dataset.category).style.display = 'flex';
    });
});

// ==================== КОНВЕРТЕР ДЛИНЫ ====================
const lengthInput = document.getElementById('lengthInput');
const lengthFrom = document.getElementById('lengthFrom');
const lengthTo = document.getElementById('lengthTo');
const lengthOutput = document.getElementById('lengthOutput');

// Коэффициенты перевода в метры
const lengthToMeter = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
};

function convertLength() {
    const value = parseFloat(lengthInput.value);
    if (isNaN(value)) {
        lengthOutput.value = '';
        return;
    }
    
    // Переводим в метры, затем в нужную единицу
    const meters = value * lengthToMeter[lengthFrom.value];
    const result = meters / lengthToMeter[lengthTo.value];
    
    lengthOutput.value = result.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
    });
}

lengthInput.addEventListener('input', convertLength);
lengthFrom.addEventListener('change', convertLength);
lengthTo.addEventListener('change', convertLength);

// ==================== КОНВЕРТЕР ВЕСА ====================
const weightInput = document.getElementById('weightInput');
const weightFrom = document.getElementById('weightFrom');
const weightTo = document.getElementById('weightTo');
const weightOutput = document.getElementById('weightOutput');

// Коэффициенты перевода в килограммы
const weightToKilogram = {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
    ton: 1000
};

function convertWeight() {
    const value = parseFloat(weightInput.value);
    if (isNaN(value)) {
        weightOutput.value = '';
        return;
    }
    
    // Переводим в килограммы, затем в нужную единицу
    const kilograms = value * weightToKilogram[weightFrom.value];
    const result = kilograms / weightToKilogram[weightTo.value];
    
    weightOutput.value = result.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
    });
}

weightInput.addEventListener('input', convertWeight);
weightFrom.addEventListener('change', convertWeight);
weightTo.addEventListener('change', convertWeight);

// ==================== КОНВЕРТЕР ТЕМПЕРАТУРЫ ====================
const tempInput = document.getElementById('tempInput');
const tempFrom = document.getElementById('tempFrom');
const tempTo = document.getElementById('tempTo');
const tempOutput = document.getElementById('tempOutput');

function convertTemperature() {
    const value = parseFloat(tempInput.value);
    if (isNaN(value)) {
        tempOutput.value = '';
        return;
    }
    
    let celsius;
    
    // Переводим в Цельсий
    switch (tempFrom.value) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }
    
    let result;
    
    // Переводим из Цельсия в нужную единицу
    switch (tempTo.value) {
        case 'celsius':
            result = celsius;
            break;
        case 'fahrenheit':
            result = celsius * 9 / 5 + 32;
            break;
        case 'kelvin':
            result = celsius + 273.15;
            break;
    }
    
    tempOutput.value = result.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

tempInput.addEventListener('input', convertTemperature);
tempFrom.addEventListener('change', convertTemperature);
tempTo.addEventListener('change', convertTemperature);

// ==================== ОБМЕН ЕДИНИЦ ====================
function swapUnits(category) {
    if (category === 'length') {
        const fromValue = lengthFrom.value;
        const toValue = lengthTo.value;
        lengthFrom.value = toValue;
        lengthTo.value = fromValue;
        convertLength();
    } else if (category === 'weight') {
        const fromValue = weightFrom.value;
        const toValue = weightTo.value;
        weightFrom.value = toValue;
        weightTo.value = fromValue;
        convertWeight();
    } else if (category === 'temperature') {
        const fromValue = tempFrom.value;
        const toValue = tempTo.value;
        tempFrom.value = toValue;
        tempTo.value = fromValue;
        convertTemperature();
    }
}

// Глобальная функция для inline обработчика
window.swapUnits = swapUnits;
