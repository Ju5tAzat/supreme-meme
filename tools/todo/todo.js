/**
 * To-Do список - логика работы с LocalStorage
 */

// Ключ для LocalStorage
const STORAGE_KEY = 'todo_items';

// DOM элементы
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const clearAllBtn = document.getElementById('clearAll');

// Массив задач
let todos = [];

/**
 * Загрузка задач из LocalStorage
 */
function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            todos = [];
        }
    }
    renderTodos();
}

/**
 * Сохранение задач в LocalStorage
 */
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * Добавление новой задачи
 */
function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
}

/**
 * Переключение статуса задачи
 */
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

/**
 * Удаление задачи
 */
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

/**
 * Очистка выполненных задач
 */
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

/**
 * Очистка всех задач
 */
function clearAll() {
    if (confirm('Вы уверены, что хотите удалить все задачи?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

/**
 * Обновление счётчиков
 */
function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter(t => t.completed).length;
}

/**
 * Отрисовка списка задач
 */
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">Нет задач. Добавьте новую!</li>';
        updateStats();
        return;
    }
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete" onclick="deleteTodo(${todo.id})" title="Удалить">✕</button>
        `;
        
        todoList.appendChild(li);
    });
    
    updateStats();
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
addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// Глобальные функции для inline обработчиков
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// Экспорт/импорт задач
const exportTodosBtn = document.getElementById('exportTodos');
const importTodosBtn = document.getElementById('importTodos');
const importTodosFile = document.getElementById('importTodosFile');

exportTodosBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Задачи экспортированы!');
});

importTodosBtn.addEventListener('click', () => {
    importTodosFile.click();
});

importTodosFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                if (confirm(`Загрузить ${imported.length} задач? Это заменит текущие.`)) {
                    todos = imported;
                    saveTodos();
                    renderTodos();
                    alert('Задачи импортированы!');
                }
            } else {
                alert('Неверный формат файла');
            }
        } catch (err) {
            alert('Ошибка чтения файла');
        }
    };
    reader.readAsText(file);
    importTodosFile.value = '';
});

// Загрузка при старте
loadTodos();
