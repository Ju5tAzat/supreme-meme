/**
 * Text Tools - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const lineCount = document.getElementById('lineCount');
    const readTime = document.getElementById('readTime');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    
    // Tool buttons
    const removeSpacesBtn = document.getElementById('removeSpaces');
    const trimLinesBtn = document.getElementById('trimLines');
    const sortLinesBtn = document.getElementById('sortLines');
    const reverseLinesBtn = document.getElementById('reverseLines');
    const removeDuplicatesBtn = document.getElementById('removeDuplicates');
    const addNumbersBtn = document.getElementById('addNumbers');

    // Update stats
    function updateStats() {
        const text = textInput.value;
        
        // Characters
        charCount.textContent = text.length;
        
        // Words
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount.textContent = text.trim() ? words.length : 0;
        
        // Lines
        const lines = text.split('\n').filter(l => l.length > 0);
        lineCount.textContent = text ? lines.length : 0;
        
        // Reading time (average 200 words per minute)
        const avgWordsPerMin = 200;
        const minutes = Math.ceil(words.length / avgWordsPerMin);
        readTime.textContent = minutes;
    }

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(textInput.value);
            showNotification('Текст скопирован!');
        } catch (err) {
            showNotification('Не удалось скопировать', true);
        }
    });

    // Clear text
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateStats();
    });

    // Paste from clipboard
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            textInput.value = text;
            updateStats();
        } catch (err) {
            showNotification('Не удалось вставить', true);
        }
    });

    // Remove extra spaces
    removeSpacesBtn.addEventListener('click', () => {
        const text = textInput.value;
        // Replace multiple spaces with single space
        const result = text.replace(/[ \t]+/g, ' ');
        textInput.value = result;
        updateStats();
        showNotification('Лишние пробелы удалены');
    });

    // Trim lines
    trimLinesBtn.addEventListener('click', () => {
        const text = textInput.value;
        const lines = text.split('\n').map(line => line.trim());
        textInput.value = lines.join('\n');
        updateStats();
        showNotification('Пробелы обрезаны');
    });

    // Sort lines
    sortLinesBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;
        
        const lines = text.split('\n').filter(l => l.trim());
        lines.sort((a, b) => a.localeCompare(b, 'ru'));
        textInput.value = lines.join('\n');
        updateStats();
        showNotification('Строки отсортированы');
    });

    // Reverse lines
    reverseLinesBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;
        
        const lines = text.split('\n');
        lines.reverse();
        textInput.value = lines.join('\n');
        updateStats();
        showNotification('Строки перевернуты');
    });

    // Remove duplicates
    removeDuplicatesBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;
        
        const lines = text.split('\n').filter(l => l.trim());
        const unique = [...new Set(lines)];
        textInput.value = unique.join('\n');
        updateStats();
        showNotification(`Удалено ${lines.length - unique.length} дубликатов`);
    });

    // Add numbers
    addNumbersBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!text) return;
        
        const lines = text.split('\n').filter(l => l.trim());
        const numbered = lines.map((line, i) => `${i + 1}. ${line}`);
        textInput.value = numbered.join('\n');
        updateStats();
        showNotification('Номера добавлены');
    });

    // Input event
    textInput.addEventListener('input', updateStats);

    // Initialize
    updateStats();
});
