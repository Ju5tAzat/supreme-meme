/**
 * Planner - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = document.getElementById('currentDate');
    const newTime = document.getElementById('newTime');
    const newTask = document.getElementById('newTask');
    const addBtn = document.getElementById('addBtn');
    const tasksList = document.getElementById('tasksList');

    const TASKS_KEY = 'plannerTasks';

    // Get today's date key
    function getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    // Get tasks
    function getTasks() {
        const all = loadFromLocalStorage(TASKS_KEY) || {};
        return all[getTodayKey()] || [];
    }

    // Save tasks
    function saveTasks(tasks) {
        const all = loadFromLocalStorage(TASKS_KEY) || {};
        all[getTodayKey()] = tasks;
        saveToLocalStorage(TASKS_KEY, all);
    }

    // Format date
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const today = new Date();
    currentDate.textContent = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

    // Add task
    function addTask() {
        const time = newTime.value;
        const task = newTask.value.trim();
        
        if (!time || !task) {
            showNotification('Заполните время и задачу', true);
            return;
        }

        const tasks = getTasks();
        tasks.push({ time, task, completed: false });
        tasks.sort((a, b) => a.time.localeCompare(b.time));
        
        saveTasks(tasks);
        newTask.value = '';
        renderTasks();
        showNotification('Задача добавлена!');
    }

    // Toggle task
    function toggleTask(index) {
        const tasks = getTasks();
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
    }

    // Delete task
    function deleteTask(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }

    // Render tasks
    function renderTasks() {
        const tasks = getTasks();
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Нет задач на сегодня</p>';
            return;
        }

        tasksList.innerHTML = tasks.map((task, index) => `
            <div class="timeline-item">
                <span class="timeline-time">${task.time}</span>
                <div class="timeline-dot"></div>
                <div class="timeline-content ${task.completed ? 'completed' : ''}">
                    <span class="task-text">${task.task}</span>
                    <div class="task-actions">
                        <button onclick="toggleTask(${index})">${task.completed ? '↩️' : '✓'}</button>
                        <button onclick="deleteTask(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    addBtn.addEventListener('click', addTask);
    newTask.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Expose functions globally
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;

    // Initial
    renderTasks();
});
