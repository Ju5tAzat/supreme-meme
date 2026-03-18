/**
 * Base64 Encoder/Decoder - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const modeBtns = document.querySelectorAll('.mode-btn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');

    let currentMode = 'encode';

    // Mode switch
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            
            // Clear outputs
            outputText.value = '';
            
            // Update placeholder
            if (currentMode === 'encode') {
                inputText.placeholder = 'Введите текст для кодирования...';
            } else {
                inputText.placeholder = 'Введите Base64 для декодирования...';
            }
        });
    });

    // Convert
    function convert() {
        const input = inputText.value;
        
        if (!input) {
            showNotification('Введите текст', true);
            return;
        }

        try {
            if (currentMode === 'encode') {
                // Encode to Base64
                const encoded = btoa(unescape(encodeURIComponent(input)));
                outputText.value = encoded;
                showNotification('Закодировано!');
            } else {
                // Decode from Base64
                const decoded = decodeURIComponent(escape(atob(input)));
                outputText.value = decoded;
                showNotification('Раскодировано!');
            }
        } catch (e) {
            showNotification('Ошибка: неверный формат Base64', true);
            outputText.value = '';
        }
    }

    // Copy
    function copy() {
        if (!outputText.value) {
            showNotification('Нечего копировать', true);
            return;
        }
        navigator.clipboard.writeText(outputText.value);
        showNotification('Скопировано!');
    }

    // Event listeners
    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copy);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            convert();
        }
    });
});
