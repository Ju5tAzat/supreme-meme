/**
 * JSON Formatter - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const validateBtn = document.getElementById('validateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Syntax highlight
    function highlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }
        
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Format JSON
    function format() {
        const input = jsonInput.value.trim();
        if (!input) {
            showNotification('Введите JSON', true);
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            jsonOutput.innerHTML = highlight(formatted);
            showNotification('Отформатировано!');
        } catch (e) {
            jsonOutput.innerHTML = '<span class="error">Ошибка: ' + e.message + '</span>';
            showNotification('Ошибка валидации', true);
        }
    }

    // Minify JSON
    function minify() {
        const input = jsonInput.value.trim();
        if (!input) {
            showNotification('Введите JSON', true);
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            jsonOutput.textContent = minified;
            showNotification('Минифицировано!');
        } catch (e) {
            jsonOutput.innerHTML = '<span class="error">Ошибка: ' + e.message + '</span>';
            showNotification('Ошибка валидации', true);
        }
    }

    // Validate JSON
    function validate() {
        const input = jsonInput.value.trim();
        if (!input) {
            showNotification('Введите JSON', true);
            return;
        }
        
        try {
            JSON.parse(input);
            jsonOutput.textContent = '✓ Валидный JSON';
            showNotification('JSON валиден!');
        } catch (e) {
            jsonOutput.innerHTML = '<span class="error">✗ Ошибка: ' + e.message + '</span>';
            showNotification('Невалидный JSON', true);
        }
    }

    // Clear
    function clear() {
        jsonInput.value = '';
        jsonOutput.textContent = '';
    }

    // Copy
    function copy() {
        const text = jsonOutput.textContent;
        if (!text || text.includes('Ошибка')) {
            showNotification('Нечего копировать', true);
            return;
        }
        navigator.clipboard.writeText(text);
        showNotification('Скопировано!');
    }

    // Event listeners
    formatBtn.addEventListener('click', format);
    minifyBtn.addEventListener('click', minify);
    validateBtn.addEventListener('click', validate);
    clearBtn.addEventListener('click', clear);
    copyBtn.addEventListener('click', copy);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            format();
        }
    });
});
