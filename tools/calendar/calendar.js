/**
 * Calendar - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const monthYear = document.getElementById('monthYear');
    const daysEl = document.getElementById('days');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const eventDate = document.getElementById('eventDate');
    const eventText = document.getElementById('eventText');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventsList = document.getElementById('eventsList');

    const EVENTS_KEY = 'calendarEvents';

    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Get events
    function getEvents() {
        return loadFromLocalStorage(EVENTS_KEY) || {};
    }

    // Save event
    function saveEvent(date, text) {
        const events = getEvents();
        if (!events[date]) events[date] = [];
        events[date].push(text);
        saveToLocalStorage(EVENTS_KEY, events);
    }

    // Delete event
    function deleteEvent(date, index) {
        const events = getEvents();
        events[date].splice(index, 1);
        if (events[date].length === 0) delete events[date];
        saveToLocalStorage(EVENTS_KEY, events);
        renderEvents();
    }

    // Render calendar
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        monthYear.textContent = `${months[currentMonth]} ${currentYear}`;

        let html = '';
        const events = getEvents();
        const today = new Date();

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            html += `<div class="day other-month">${day}</div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
            const hasEvent = events[date] && events[date].length > 0;
            
            html += `<div class="day${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}" data-date="${date}">${day}</div>`;
        }

        // Next month days
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        for (let i = 1; i <= totalCells - firstDay - daysInMonth; i++) {
            html += `<div class="day other-month">${i}</div>`;
        }

        daysEl.innerHTML = html;
    }

    // Render events
    function renderEvents() {
        const events = getEvents();
        const eventList = [];
        
        Object.entries(events).forEach(([date, texts]) => {
            texts.forEach((text, index) => {
                eventList.push({ date, text, index });
            });
        });

        // Sort by date
        eventList.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (eventList.length === 0) {
            eventsList.innerHTML = '<li style="color: var(--text-secondary)">Нет событий</li>';
            return;
        }

        eventsList.innerHTML = eventList.map(e => `
            <li class="event-item">
                <div>
                    <span class="event-date">${e.date}</span>
                    <span>${e.text}</span>
                </div>
                <button class="event-delete" onclick="deleteEvent('${e.date}', ${e.index})">×</button>
            </li>
        `).join('');
    }

    // Add event
    function addEvent() {
        const date = eventDate.value;
        const text = eventText.value.trim();
        
        if (!date || !text) {
            showNotification('Заполните дату и событие', true);
            return;
        }

        saveEvent(date, text);
        eventText.value = '';
        renderCalendar();
        renderEvents();
        showNotification('Событие добавлено!');
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    addEventBtn.addEventListener('click', addEvent);

    // Make deleteEvent available globally
    window.deleteEvent = deleteEvent;

    // Initial render
    renderCalendar();
    renderEvents();
});
