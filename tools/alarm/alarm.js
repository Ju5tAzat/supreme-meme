/**
 * Alarm - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const currentTimeEl = document.getElementById('currentTime');
    const alarmTimeInput = document.getElementById('alarmTime');
    const setAlarmBtn = document.getElementById('setAlarmBtn');
    const alarmList = document.getElementById('alarmList');

    const ALARMS_KEY = 'alarms';
    let alarms = [];

    // Update current time
    function updateTime() {
        const now = new Date();
        currentTimeEl.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Check alarms
        const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        alarms.forEach(alarm => {
            if (alarm.active && alarm.time === time) {
                playAlarm();
            }
        });
    }

    // Play alarm sound
    function playAlarm() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleV4dAA==');
        audio.volume = 0.5;
        audio.play();
        showNotification('⏰ Будильник!');
    }

    // Load alarms
    function loadAlarms() {
        alarms = loadFromLocalStorage(ALARMS_KEY) || [];
        renderAlarms();
    }

    // Save alarms
    function saveAlarms() {
        saveToLocalStorage(ALARMS_KEY, alarms);
    }

    // Add alarm
    function addAlarm() {
        const time = alarmTimeInput.value;
        if (!time) return;

        alarms.push({ time, active: true, id: Date.now() });
        saveAlarms();
        renderAlarms();
        alarmTimeInput.value = '';
        showNotification('Будильник установлен!');
    }

    // Toggle alarm
    function toggleAlarm(id) {
        const alarm = alarms.find(a => a.id === id);
        if (alarm) {
            alarm.active = !alarm.active;
            saveAlarms();
            renderAlarms();
        }
    }

    // Delete alarm
    function deleteAlarm(id) {
        alarms = alarms.filter(a => a.id !== id);
        saveAlarms();
        renderAlarms();
    }

    // Render alarms
    function renderAlarms() {
        if (alarms.length === 0) {
            alarmList.innerHTML = '<p style="color: var(--text-secondary)">Нет будильников</p>';
            return;
        }

        alarmList.innerHTML = alarms.map(alarm => `
            <div class="alarm-item ${alarm.active ? 'active' : ''}">
                <span class="alarm-time">${alarm.time}</span>
                <div class="alarm-actions">
                    <button onclick="toggleAlarm(${alarm.id})">${alarm.active ? '⏸️' : '▶️'}</button>
                    <button onclick="deleteAlarm(${alarm.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    setAlarmBtn.addEventListener('click', addAlarm);

    // Expose functions globally
    window.toggleAlarm = toggleAlarm;
    window.deleteAlarm = deleteAlarm;

    // Initial
    setInterval(updateTime, 1000);
    updateTime();
    loadAlarms();
});
