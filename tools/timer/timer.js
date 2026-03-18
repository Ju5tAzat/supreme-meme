/**
 * Таймер и секундомер - логика работы
 */

// Переключение режимов
const timerModeBtn = document.getElementById('timerMode');
const stopwatchModeBtn = document.getElementById('stopwatchMode');
const timerPanel = document.getElementById('timerPanel');
const stopwatchPanel = document.getElementById('stopwatchPanel');

timerModeBtn.addEventListener('click', () => {
    timerModeBtn.classList.add('active');
    stopwatchModeBtn.classList.remove('active');
    timerPanel.style.display = 'block';
    stopwatchPanel.style.display = 'none';
});

stopwatchModeBtn.addEventListener('click', () => {
    stopwatchModeBtn.classList.add('active');
    timerModeBtn.classList.remove('active');
    stopwatchPanel.style.display = 'block';
    timerPanel.style.display = 'none';
});

// ==================== ТАЙМЕР ====================
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 0;

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const timerAlert = document.getElementById('timerAlert');

/**
 * Получение времени из полей ввода
 */
function getTimerInput() {
    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    return h * 3600 + m * 60 + s;
}

/**
 * Установка времени в поля ввода
 */
function setTimerInput(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    hoursInput.value = h;
    minutesInput.value = m;
    secondsInput.value = s;
}

/**
 * Форматирование времени для отображения
 */
function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Запуск таймера
 */
function startTimer() {
    if (!timerRunning) {
        if (timerSeconds === 0) {
            timerSeconds = getTimerInput();
        }
        
        if (timerSeconds <= 0) return;
        
        timerRunning = true;
        startTimerBtn.style.display = 'none';
        pauseTimerBtn.style.display = 'inline-block';
        timerAlert.style.display = 'none';
        
        // Блокируем ввод
        hoursInput.disabled = true;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        
        timerInterval = setInterval(() => {
            timerSeconds--;
            
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                timerSeconds = 0;
                
                startTimerBtn.style.display = 'inline-block';
                startTimerBtn.textContent = 'Старт';
                pauseTimerBtn.style.display = 'none';
                
                // Звуковое оповещение
                playAlarm();
                
                // Показываем оповещение
                timerAlert.style.display = 'block';
                
                // Разблокируем ввод
                hoursInput.disabled = false;
                minutesInput.disabled = false;
                secondsInput.disabled = false;
            }
            
            setTimerInput(timerSeconds);
        }, 1000);
    }
}

/**
 * Пауза таймера
 */
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        
        startTimerBtn.style.display = 'inline-block';
        startTimerBtn.textContent = 'Продолжить';
        pauseTimerBtn.style.display = 'none';
    }
}

/**
 * Сброс таймера
 */
function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 0;
    
    setTimerInput(0);
    
    startTimerBtn.style.display = 'inline-block';
    startTimerBtn.textContent = 'Старт';
    pauseTimerBtn.style.display = 'none';
    timerAlert.style.display = 'none';
    
    // Разблокируем ввод
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

/**
 * Звуковое оповещение
 */
function playAlarm() {
    // Создаём простой звук
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// ==================== СЕКУНДОМЕР ====================
let stopwatchInterval = null;
let stopwatchRunning = false;
let stopwatchTime = 0;
let laps = [];

const stopwatchTimeDisplay = document.getElementById('stopwatchTime');
const lapsList = document.getElementById('lapsList');
const startStopwatchBtn = document.getElementById('startStopwatch');
const pauseStopwatchBtn = document.getElementById('pauseStopwatch');
const lapStopwatchBtn = document.getElementById('lapStopwatch');
const resetStopwatchBtn = document.getElementById('resetStopwatch');

/**
 * Запуск секундомера
 */
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        startStopwatchBtn.style.display = 'none';
        pauseStopwatchBtn.style.display = 'inline-block';
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            stopwatchTimeDisplay.textContent = formatTime(stopwatchTime);
        }, 1000);
    }
}

/**
 * Остановка секундомера
 */
function pauseStopwatch() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        
        startStopwatchBtn.style.display = 'inline-block';
        startStopwatchBtn.textContent = 'Продолжить';
        pauseStopwatchBtn.style.display = 'none';
    }
}

/**
 * Добавление круга
 */
function lapStopwatch() {
    if (stopwatchRunning || stopwatchTime > 0) {
        const lapTime = stopwatchTime;
        laps.push(lapTime);
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="lap-number">Круг ${laps.length}</span>
            <span class="lap-time">${formatTime(lapTime)}</span>
        `;
        
        lapsList.insertBefore(li, lapsList.firstChild);
    }
}

/**
 * Сброс секундомера
 */
function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
    stopwatchTime = 0;
    laps = [];
    
    stopwatchTimeDisplay.textContent = '00:00:00';
    lapsList.innerHTML = '';
    
    startStopwatchBtn.style.display = 'inline-block';
    startStopwatchBtn.textContent = 'Старт';
    pauseStopwatchBtn.style.display = 'none';
}

startStopwatchBtn.addEventListener('click', startStopwatch);
pauseStopwatchBtn.addEventListener('click', pauseStopwatch);
lapStopwatchBtn.addEventListener('click', lapStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);
