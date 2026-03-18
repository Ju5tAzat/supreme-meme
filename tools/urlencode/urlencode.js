/**
 * URL Encoder/Decoder - Main Logic
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
            outputText.value = '';
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
                outputText.value = encodeURIComponent(input);
                showNotification('Закодировано!');
            } else {
                outputText.value = decodeURIComponent(input);
                showNotification('Раскодировано!');
            }
        } catch (e) {
            showNotification('Ошибка декодирования', true);
        }
    }

    // Copy
    function copy() {
        if (!outputText.value) return;
        navigator.clipboard.writeText(outputText.value);
        showNotification('Скопировано!');
    }

    // Event listeners
    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copy);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') convert();
    });
});
