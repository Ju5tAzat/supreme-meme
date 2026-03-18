/**
 * Habit Tracker - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addBtn = document.getElementById('addBtn');
    const habitsList = document.getElementById('habitsList');
    const totalHabits = document.getElementById('totalHabits');
    const completedToday = document.getElementById('completedToday');
    const streakEl = document.getElementById('streak');

    const HABITS_KEY = 'habitTracker';
    const DAYS = 7;

    // Get today date string
    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // Get week dates
    function getWeekDates() {
        const dates = [];
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        
        for (let i = 1; i <= DAYS; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - dayOfWeek + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    // Get habits
    function getHabits() {
        return loadFromLocalStorage(HABITS_KEY) || [];
    }

    // Save habits
    function saveHabits(habits) {
        saveToLocalStorage(HABITS_KEY, habits);
    }

    // Add habit
    function addHabit() {
        const name = habitInput.value.trim();
        if (!name) return;

        const habits = getHabits();
        habits.push({
            id: Date.now(),
            name: name,
            completed: {}
        });
        saveHabits(habits);
        habitInput.value = '';
        renderHabits();
        showNotification('Привычка добавлена!');
    }

    // Toggle completion
    function toggleHabit(habitId, date) {
        const habits = getHabits();
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        if (habit.completed[date]) {
            delete habit.completed[date];
        } else {
            habit.completed[date] = true;
        }

        saveHabits(habits);
        renderHabits();
    }

    // Delete habit
    function deleteHabit(habitId) {
        if (!confirm('Удалить привычку?')) return;
        
        const habits = getHabits().filter(h => h.id !== habitId);
        saveHabits(habits);
        renderHabits();
    }

    // Calculate stats
    function calculateStats() {
        const habits = getHabits();
        const today = getToday();
        const weekDates = getWeekDates();

        totalHabits.textContent = habits.length;

        let completed = 0;
        let maxStreak = 0;

        habits.forEach(habit => {
            if (habit.completed[today]) completed++;
            
            // Calculate streak
            let streak = 0;
            let checkDate = new Date();
            while (true) {
                const dateStr = checkDate.toISOString().split('T')[0];
                if (habit.completed[dateStr]) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            if (streak > maxStreak) maxStreak = streak;
        });

        completedToday.textContent = completed;
        streakEl.textContent = maxStreak;
    }

    // Render habits
    function renderHabits() {
        const habits = getHabits();
        const weekDates = getWeekDates();
        const today = getToday();

        if (habits.length === 0) {
            habitsList.innerHTML = '<li style="text-align: center; color: var(--text-secondary); padding: 2rem;">Нет привычек. Добавьте первую!</li>';
            calculateStats();
            return;
        }

        habitsList.innerHTML = habits.map(habit => `
            <li class="habit-item">
                <div class="habit-header">
                    <span class="habit-name">${habit.name}</span>
                    <button class="habit-delete" onclick="deleteHabit(${habit.id})">×</button>
                </div>
                <div class="habit-days">
                    ${weekDates.map(date => `
                        <div class="habit-day ${habit.completed[date] ? 'completed' : ''} ${date === today ? 'today' : ''}" 
                            onclick="toggleHabit(${habit.id}, '${date}')"></div>
                    `).join('')}
                </div>
            </li>
        `).join('');

        calculateStats();
    }

    // Event listeners
    addBtn.addEventListener('click', addHabit);
    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addHabit();
    });

    // Expose functions globally
    window.toggleHabit = toggleHabit;
    window.deleteHabit = deleteHabit;

    // Initial render
    renderHabits();
});
