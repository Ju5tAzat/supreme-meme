/**
 * Часы - логика работы
 */

// DOM элементы для цифровых часов
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const amPmEl = document.getElementById('amPm');

// DOM элементы для аналоговых часов
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');

// DOM элементы для даты
const dateFull = document.getElementById('dateFull');
const dateRelative = document.getElementById('dateRelative');

// DOM элементы для мировых часов
const nyTimeEl = document.getElementById('nyTime');
const londonTimeEl = document.getElementById('londonTime');
const tokyoTimeEl = document.getElementById('tokyoTime');

/**
 * Обновление времени
 */
function updateTime() {
    const now = new Date();
    
    // Цифровые часы
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // AM/PM
    const amPm = hours >= 12 ? 'PM' : 'AM';
    amPmEl.textContent = amPm;
    
    // 12-часовой формат
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Аналоговые часы
    updateAnalogClock(now);
    
    // Дата
    updateDate(now);
    
    // Мировые часы
    updateWorldClocks();
}

/**
 * Обновление аналоговых часов
 */
function updateAnalogClock(now) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Поворот стрелок
    const hourAngle = (hours * 30) + (minutes * 0.5); // 30 градусов за час + плавное движение
    const minuteAngle = minutes * 6 + seconds * 0.1; // 6 градусов за минуту
    const secondAngle = seconds * 6; // 6 градусов за секунду
    
    hourHand.setAttribute('transform', `rotate(${hourAngle} 100 100)`);
    minuteHand.setAttribute('transform', `rotate(${minuteAngle} 100 100)`);
    secondHand.setAttribute('transform', `rotate(${secondAngle} 100 100)`);
}

/**
 * Обновление даты
 */
function updateDate(now) {
    // Полная дата
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateFull.textContent = now.toLocaleDateString('ru-RU', options);
    
    // Относительная дата
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateToCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = today - dateToCheck;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        dateRelative.textContent = 'Сегодня';
    } else if (diffDays === 1) {
        dateRelative.textContent = 'Вчера';
    } else if (diffDays === -1) {
        dateRelative.textContent = 'Завтра';
    } else {
        dateRelative.textContent = `${Math.abs(diffDays)} дней назад`;
    }
}

/**
 * Обновление мировых часов
 */
function updateWorldClocks() {
    const now = new Date();
    
    // Нью-Йорк (UTC-5)
    const nyOptions = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    nyTimeEl.textContent = now.toLocaleTimeString('ru-RU', nyOptions);
    
    // Лондон (UTC+0)
    const londonOptions = { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    londonTimeEl.textContent = now.toLocaleTimeString('ru-RU', londonOptions);
    
    // Токио (UTC+9)
    const tokyoOptions = { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    tokyoTimeEl.textContent = now.toLocaleTimeString('ru-RU', tokyoOptions);
}

// Запуск обновления каждую секунду
setInterval(updateTime, 1000);

// Первоначальное обновление
updateTime();
