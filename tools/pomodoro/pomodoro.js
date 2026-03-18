/**
 * Pomodoro Timer - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const progressCircle = document.getElementById('progressCircle');
    const timerMode = document.getElementById('timerMode');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const skipBtn = document.getElementById('skipBtn');
    const sessionCount = document.getElementById('sessionCount');
    const totalTime = document.getElementById('totalTime');
    const focusTimeInput = document.getElementById('focusTime');
    const shortBreakInput = document.getElementById('shortBreak');
    const longBreakInput = document.getElementById('longBreak');
    const soundEnabled = document.getElementById('soundEnabled');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Timer State
    let isRunning = false;
    let timeLeft = 25 * 60; // seconds
    let totalTimeLeft = 25 * 60;
    let timerInterval = null;
    let currentMode = 'focus'; // focus, shortBreak, longBreak
    let sessions = 0;
    let totalSeconds = 0;

    // Settings
    let settings = {
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
        sound: true
    };

    // Load settings
    function loadSettings() {
        const saved = loadFromLocalStorage('pomodoroSettings');
        if (saved) {
            settings = { ...settings, ...saved };
            focusTimeInput.value = settings.focusTime;
            shortBreakInput.value = settings.shortBreak;
            longBreakInput.value = settings.longBreak;
            soundEnabled.checked = settings.sound;
        }
    }

    function saveSettings() {
        saveToLocalStorage('pomodoroSettings', settings);
    }

    // Save/Load Tasks
    function loadTasks() {
        const tasks = loadFromLocalStorage('pomodoroTasks') || [];
        renderTasks(tasks);
    }

    function saveTasks(tasks) {
        saveToLocalStorage('pomodoroTasks', tasks);
    }

    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update display
    function updateDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        minutesEl.textContent = mins.toString().padStart(2, '0');
        secondsEl.textContent = secs.toString().padStart(2, '0');
        
        // Update progress
        const circumference = 2 * Math.PI * 45;
        const progress = ((totalTimeLeft - timeLeft) / totalTimeLeft) * circumference;
        progressCircle.style.strokeDashoffset = progress;
        
        // Update total time
        totalTime.textContent = formatTime(totalSeconds);
    }

    // Play sound
    function playSound() {
        if (!settings.sound) return;
        
        // Simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = currentMode === 'focus' ? 880 : 440;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Start timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            totalSeconds++;
            
            if (timeLeft <= 0) {
                playSound();
                completeSession();
            }
            
            updateDisplay();
        }, 1000);
    }

    // Pause timer
    function pauseTimer() {
        if (!isRunning) return;
        
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }

    // Reset timer
    function resetTimer() {
        pauseTimer();
        
        switch (currentMode) {
            case 'focus':
                timeLeft = settings.focusTime * 60;
                break;
            case 'shortBreak':
                timeLeft = settings.shortBreak * 60;
                break;
            case 'longBreak':
                timeLeft = settings.longBreak * 60;
                break;
        }
        
        totalTimeLeft = timeLeft;
        updateDisplay();
    }

    // Complete session
    function completeSession() {
        pauseTimer();
        
        if (currentMode === 'focus') {
            sessions++;
            sessionCount.textContent = sessions;
            
            if (sessions >= 4) {
                currentMode = 'longBreak';
                timeLeft = settings.longBreak * 60;
                sessions = 0;
            } else {
                currentMode = 'shortBreak';
                timeLeft = settings.shortBreak * 60;
            }
        } else {
            currentMode = 'focus';
            timeLeft = settings.focusTime * 60;
        }
        
        totalTimeLeft = timeLeft;
        
        // Update mode display
        const modeNames = {
            'focus': 'Фокус',
            'shortBreak': 'Короткий перерыв',
            'longBreak': 'Длинный перерыв'
        };
        timerMode.textContent = modeNames[currentMode];
        
        // Update progress color
        progressCircle.classList.toggle('break', currentMode !== 'focus');
        
        updateDisplay();
    }

    // Skip session
    function skipBtnHandler() {
        completeSession();
    }

    // Render tasks
    function renderTasks(tasks) {
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="empty-message">Нет задач. Добавьте задачу!</li>';
            return;
        }
        
        taskList.innerHTML = tasks.map((task, index) => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${index})">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="task-delete" onclick="deleteTask(${index})">×</button>
            </li>
        `).join('');
    }

    // Add task
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        
        const tasks = loadFromLocalStorage('pomodoroTasks') || [];
        tasks.push({ text, completed: false });
        saveTasks(tasks);
        renderTasks(tasks);
        taskInput.value = '';
    }

    // Toggle task
    window.toggleTask = function(index) {
        const tasks = loadFromLocalStorage('pomodoroTasks') || [];
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Delete task
    window.deleteTask = function(index) {
        const tasks = loadFromLocalStorage('pomodoroTasks') || [];
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skipBtnHandler);

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Settings change handlers
    focusTimeInput.addEventListener('change', () => {
        settings.focusTime = parseInt(focusTimeInput.value) || 25;
        saveSettings();
        if (currentMode === 'focus' && !isRunning) {
            resetTimer();
        }
    });

    shortBreakInput.addEventListener('change', () => {
        settings.shortBreak = parseInt(shortBreakInput.value) || 5;
        saveSettings();
    });

    longBreakInput.addEventListener('change', () => {
        settings.longBreak = parseInt(longBreakInput.value) || 15;
        saveSettings();
    });

    soundEnabled.addEventListener('change', () => {
        settings.sound = soundEnabled.checked;
        saveSettings();
    });

    // Initialize
    loadSettings();
    loadTasks();
    timeLeft = settings.focusTime * 60;
    totalTimeLeft = timeLeft;
    updateDisplay();
});
