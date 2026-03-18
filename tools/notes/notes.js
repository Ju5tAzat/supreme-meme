/**
 * Заметки - логика работы с LocalStorage
 */

// Ключ для LocalStorage
const STORAGE_KEY = 'notes_items';

// DOM элементы
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const searchNotes = document.getElementById('searchNotes');
const notesList = document.getElementById('notesList');

// Массив заметок
let notes = [];

/**
 * Загрузка заметок из LocalStorage
 */
function loadNotes() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            notes = JSON.parse(saved);
        } catch (e) {
            notes = [];
        }
    }
    renderNotes();
}

/**
 * Сохранение заметок в LocalStorage
 */
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Сохранение новой заметки
 */
function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (!title && !content) {
        alert('Введите заголовок или текст заметки!');
        return;
    }
    
    const note = {
        id: Date.now(),
        title: title || 'Без названия',
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveNotes();
    renderNotes();
    
    // Очистка полей ввода
    noteTitle.value = '';
    noteContent.value = '';
}

/**
 * Удаление заметки
 */
function deleteNote(id) {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
    }
}

/**
 * Редактирование заметки
 */
function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    noteTitle.value = note.title;
    noteContent.value = note.content;
    
    // Удаляем старую заметку
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes();
    
    // Фокус на поле заголовка
    noteTitle.focus();
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

/**
 * Отрисовка списка заметок
 */
function renderNotes() {
    const searchTerm = searchNotes.value.toLowerCase();
    
    // Фильтрация по поиску
    const filteredNotes = notes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchTerm);
        const contentMatch = note.content.toLowerCase().includes(searchTerm);
        return titleMatch || contentMatch;
    });
    
    notesList.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<div class="empty-notes">Нет заметок. Создайте новую!</div>';
        return;
    }
    
    filteredNotes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        
        card.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <span class="note-date">${formatDate(note.createdAt)}</span>
            </div>
            ${note.content ? `<div class="note-content">${escapeHtml(note.content)}</div>` : ''}
            <div class="note-actions">
                <button class="note-btn" onclick="editNote(${note.id})">✏️ Изменить</button>
                <button class="note-btn delete" onclick="deleteNote(${note.id})">🗑️ Удалить</button>
            </div>
        `;
        
        notesList.appendChild(card);
    });
}

/**
 * Поиск заметок
 */
function searchNotesHandler() {
    renderNotes();
}

// События
saveNoteBtn.addEventListener('click', saveNote);
searchNotes.addEventListener('input', searchNotesHandler);

// Сохранение по Ctrl+Enter
noteContent.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        saveNote();
    }
});

// Глобальные функции для inline обработчиков
window.deleteNote = deleteNote;
window.editNote = editNote;

// Экспорт заметок
const exportNotesBtn = document.getElementById('exportNotes');
const importNotesBtn = document.getElementById('importNotes');
const importNotesFile = document.getElementById('importNotesFile');

exportNotesBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Заметки экспортированы!');
});

importNotesBtn.addEventListener('click', () => {
    importNotesFile.click();
});

importNotesFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                if (confirm(`Загрузить ${imported.length} заметок? Это заменит текущие.`)) {
                    notes = imported;
                    saveNotes();
                    renderNotes();
                    alert('Заметки импортированы!');
                }
            } else {
                alert('Неверный формат файла');
            }
        } catch (err) {
            alert('Ошибка чтения файла');
        }
    };
    reader.readAsText(file);
    importNotesFile.value = '';
});

// Загрузка при старте
loadNotes();
