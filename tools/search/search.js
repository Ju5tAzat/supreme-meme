/**
 * Быстрый поиск - логика работы
 */

// Ключ для LocalStorage
const STORAGE_KEY = 'search_history';
const MAX_HISTORY = 10;

// DOM элементы
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

// История поиска
let searchHistory = [];

/**
 * Загрузка истории из LocalStorage
 */
function loadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            searchHistory = JSON.parse(saved);
        } catch (e) {
            searchHistory = [];
        }
    }
    renderHistory();
}

/**
 * Сохранение истории в LocalStorage
 */
function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
}

/**
 * Выполнение поиска
 */
function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    // Добавление в историю
    addToHistory(query);
    
    // Открытие Google с запросом
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(googleUrl, '_blank');
    
    // Очистка поля ввода
    searchInput.value = '';
}

/**
 * Добавление в историю
 */
function addToHistory(query) {
    // Удаляем дубликаты
    searchHistory = searchHistory.filter(q => q !== query);
    
    // Добавляем в начало
    searchHistory.unshift(query);
    
    // Ограничиваем количество
    if (searchHistory.length > MAX_HISTORY) {
        searchHistory = searchHistory.slice(0, MAX_HISTORY);
    }
    
    saveHistory();
    renderHistory();
}

/**
 * Удаление элемента из истории
 */
function deleteFromHistory(index) {
    searchHistory.splice(index, 1);
    saveHistory();
    renderHistory();
}

/**
 * Очистка истории
 */
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю поиска?')) {
        searchHistory = [];
        saveHistory();
        renderHistory();
    }
}

/**
 * Поиск из истории
 */
function searchFromHistory(query) {
    searchInput.value = query;
    performSearch();
}

/**
 * Отрисовка истории
 */
function renderHistory() {
    historyList.innerHTML = '';
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<li class="empty-history">История пуста</li>';
        return;
    }
    
    searchHistory.forEach((query, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        li.innerHTML = `
            <span class="history-query" onclick="searchFromHistory('${escapeHtml(query)}')">${escapeHtml(query)}</span>
            <button class="history-delete" onclick="deleteFromHistory(${index})">✕</button>
        `;
        
        historyList.appendChild(li);
    });
}

/**
 * Экранирование HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// События
searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

clearHistoryBtn.addEventListener('click', clearHistory);

// Глобальные функции для inline обработчиков
window.deleteFromHistory = deleteFromHistory;
window.searchFromHistory = searchFromHistory;

// Загрузка при старте
loadHistory();
