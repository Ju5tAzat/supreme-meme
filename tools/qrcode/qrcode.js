/**
 * QR Code Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qr-text');
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const qrBg = document.getElementById('qr-bg');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const qrCanvas = document.getElementById('qr-canvas');
    const qrResult = document.getElementById('qr-result');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const notification = document.getElementById('notification');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    let currentQRData = null;

    // Generate QR Code
    generateBtn.addEventListener('click', generateQR);
    qrText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateQR();
        }
    });

    function generateQR() {
        const text = qrText.value.trim();
        
        if (!text) {
            showNotification('Пожалуйста, введите текст или URL', true);
            qrText.focus();
            return;
        }

        const size = parseInt(qrSize.value);
        const color = qrColor.value;
        const bgColor = qrBg.value;

        QRCode.toCanvas(qrCanvas, text, {
            width: size,
            margin: 2,
            color: {
                dark: color,
                light: bgColor
            },
            errorCorrectionLevel: 'M'
        }, (error) => {
            if (error) {
                console.error(error);
                showNotification('Ошибка создания QR-кода', true);
                return;
            }

            currentQRData = { text, size, color, bgColor };
            qrResult.classList.add('has-qr');
            showNotification('QR-код создан!');
            addToHistory(text);
        });
    }

    // Download QR Code as PNG
    downloadBtn.addEventListener('click', () => {
        if (!currentQRData) {
            showNotification('Сначала создайте QR-код', true);
            return;
        }

        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
        showNotification('QR-код скачан!');
    });

    // Copy QR Code as image to clipboard
    copyBtn.addEventListener('click', async () => {
        if (!currentQRData) {
            showNotification('Сначала создайте QR-код', true);
            return;
        }

        try {
            const blob = await new Promise(resolve => 
                qrCanvas.toBlob(resolve, 'image/png')
            );
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            showNotification('QR-код скопирован в буфер!');
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('Не удалось скопировать', true);
        }
    });

    // Show notification
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.classList.toggle('error', isError);
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // History Management
    const HISTORY_KEY = 'qrcodeHistory';
    const MAX_HISTORY = 20;

    function getHistory() {
        const data = loadFromLocalStorage(HISTORY_KEY);
        return data || [];
    }

    function saveHistory(history) {
        saveToLocalStorage(HISTORY_KEY, history);
    }

    function addToHistory(text) {
        let history = getHistory();
        
        // Remove if already exists
        history = history.filter(item => item !== text);
        
        // Add to beginning
        history.unshift(text);
        
        // Limit size
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }
        
        saveHistory(history);
        renderHistory();
    }

    function removeFromHistory(text) {
        let history = getHistory();
        history = history.filter(item => item !== text);
        saveHistory(history);
        renderHistory();
    }

    function clearHistory() {
        saveToLocalStorage(HISTORY_KEY, []);
        renderHistory();
        showNotification('История очищена');
    }

    function renderHistory() {
        const history = getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">История пуста</p>';
            return;
        }

        historyList.innerHTML = history.map(text => `
            <div class="history-item" data-text="${escapeHtml(text)}">
                <span class="history-item-text">${escapeHtml(text)}</span>
                <button class="history-item-delete" data-text="${escapeHtml(text)}">×</button>
            </div>
        `).join('');

        // Add click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('history-item-delete')) {
                    qrText.value = item.dataset.text;
                    generateQR();
                }
            });
        });

        historyList.querySelectorAll('.history-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromHistory(btn.dataset.text);
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initial render
    renderHistory();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to generate
        if (e.ctrlKey && e.key === 'Enter') {
            generateQR();
        }
        // Ctrl+S to download (prevent default save)
        if (e.ctrlKey && e.key === 's') {
            if (currentQRData) {
                e.preventDefault();
                downloadBtn.click();
            }
        }
    });
});
