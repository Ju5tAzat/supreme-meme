/**
 * Clipboard Notes - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('noteInput');
    const saveBtn = document.getElementById('saveBtn');
    const notesGrid = document.getElementById('notesGrid');

    const NOTES_KEY = 'clipboardNotes';
    const MAX_NOTES = 20;

    // Get notes
    function getNotes() {
        return loadFromLocalStorage(NOTES_KEY) || [];
    }

    // Save notes
    function saveNotes(notes) {
        saveToLocalStorage(NOTES_KEY, notes);
    }

    // Save note
    function saveNote() {
        const text = noteInput.value.trim();
        if (!text) return;

        let notes = getNotes();
        notes.unshift({
            id: Date.now(),
            text: text,
            created: new Date().toISOString()
        });

        if (notes.length > MAX_NOTES) {
            notes = notes.slice(0, MAX_NOTES);
        }

        saveNotes(notes);
        noteInput.value = '';
        renderNotes();
        showNotification('Сохранено!');
    }

    // Copy note
    function copyNote(id) {
        const notes = getNotes();
        const note = notes.find(n => n.id === id);
        if (!note) return;

        navigator.clipboard.writeText(note.text);
        showNotification('Скопировано!');
    }

    // Delete note
    function deleteNote(id) {
        const notes = getNotes().filter(n => n.id !== id);
        saveNotes(notes);
        renderNotes();
        showNotification('Удалено');
    }

    // Render notes
    function renderNotes() {
        const notes = getNotes();

        if (notes.length === 0) {
            notesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Нет заметок</p>';
            return;
        }

        notesGrid.innerHTML = notes.map(note => `
            <div class="clip-note">
                <p>${escapeHtml(note.text)}</p>
                <div class="clip-note-actions">
                    <button onclick="copyNote(${note.id})">📋 Копировать</button>
                    <button class="delete" onclick="deleteNote(${note.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event listeners
    saveBtn.addEventListener('click', saveNote);
    noteInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') saveNote();
    });

    // Expose functions globally
    window.copyNote = copyNote;
    window.deleteNote = deleteNote;

    // Initial render
    renderNotes();
});
