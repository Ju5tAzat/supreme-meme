/**
 * Case Converter - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const caseBtns = document.querySelectorAll('.case-btn');
    const copyBtn = document.getElementById('copyBtn');

    // Convert functions
    const converters = {
        upper: text => text.toUpperCase(),
        lower: text => text.toLowerCase(),
        title: text => text.replace(/\b\w/g, l => l.toUpperCase()),
        sentence: text => text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
        toggle: text => text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
        inverse: text => text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
    };

    // Convert
    function convert(caseType) {
        const input = inputText.value;
        if (!input) {
            showNotification('Введите текст', true);
            return;
        }

        const converter = converters[caseType];
        outputText.value = converter(input);
        showNotification('Конвертировано!');
    }

    // Copy
    function copy() {
        if (!outputText.value) return;
        navigator.clipboard.writeText(outputText.value);
        showNotification('Скопировано!');
    }

    // Event listeners
    caseBtns.forEach(btn => {
        btn.addEventListener('click', () => convert(btn.dataset.case));
    });

    copyBtn.addEventListener('click', copy);

    // Auto convert on input
    inputText.addEventListener('input', () => {
        if (inputText.value) {
            outputText.value = inputText.value;
        }
    });
});
