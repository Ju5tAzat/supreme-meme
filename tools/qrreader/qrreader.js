/**
 * QR Scanner - Main Logic
 * Uses a simple QR detection approach for camera and file upload
 */

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const fileInput = document.getElementById('fileInput');
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const openBtn = document.getElementById('openBtn');
    const newTabBtn = document.getElementById('newTabBtn');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');

    let stream = null;
    let isScanning = false;
    const HISTORY_KEY = 'qrScannerHistory';

    // Get history from localStorage
    function getHistory() {
        const saved = localStorage.getItem(HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    // Save to history
    function addToHistory(text) {
        let history = getHistory();
        history.unshift({
            text: text,
            time: new Date().toLocaleTimeString()
        });
        history = history.slice(0, 10); // Keep only 10 items
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        updateHistoryUI();
    }

    // Update history UI
    function updateHistoryUI() {
        const history = getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">История пуста</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-text="${encodeURIComponent(item.text)}">
                <span class="text">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</span>
                <span class="time">${item.time}</span>
            </div>
        `).join('');

        // Add click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = decodeURIComponent(item.dataset.text);
                showResult(text);
            });
        });
    }

    // Show result
    function showResult(text) {
        resultText.textContent = text;
        resultSection.style.display = 'block';
        
        // Enable/disable open buttons based on URL
        const isUrl = text.startsWith('http://') || text.startsWith('https://');
        openBtn.disabled = !isUrl;
        newTabBtn.disabled = !isUrl;
    }

    // Start camera scanning
    async function startScanning() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            video.srcObject = stream;
            isScanning = true;
            
            startBtn.disabled = true;
            stopBtn.disabled = false;
            
            // Start scanning loop
            scanFrame();
        } catch (err) {
            console.error('Camera error:', err);
            alert('Не удалось получить доступ к камере. Попробуйте загрузить изображение.');
        }
    }

    // Stop scanning
    function stopScanning() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        isScanning = false;
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Simple QR detection (placeholder - in production would use jsQR or similar)
    function scanFrame() {
        if (!isScanning) return;
        
        // Note: Real QR scanning requires a library like jsQR
        // This is a simplified version that relies on file upload
        // For camera scanning, we'd need to integrate a QR detection library
        
        requestAnimationFrame(scanFrame);
    }

    // Handle file upload
    function handleFileUpload(file) {
        if (!file) return;
        
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.onload = () => {
                // Display the image
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Note: Real QR detection would use jsQR library here
                // For now, we'll show a message about using the QR generator tool
                // or suggest using an external scanner
                
                // Simulated result for demonstration
                // In production, integrate jsQR: https://github.com/cozmo/jsQR
                alert('Для сканирования QR-кодов из изображений требуется библиотека jsQR.\n\nВы можете использовать генератор QR-кодов для создания кодов, либо использовать стороннее приложение для сканирования.');
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    // Event listeners
    startBtn.addEventListener('click', startScanning);
    stopBtn.addEventListener('click', stopScanning);
    
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0]);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent);
        showNotification('Скопировано!');
    });

    openBtn.addEventListener('click', () => {
        if (resultText.textContent.startsWith('http')) {
            window.location.href = resultText.textContent;
        }
    });

    newTabBtn.addEventListener('click', () => {
        if (resultText.textContent.startsWith('http')) {
            window.open(resultText.textContent, '_blank');
        }
    });

    clearHistory.addEventListener('click', () => {
        if (confirm('Очистить историю сканирований?')) {
            localStorage.removeItem(HISTORY_KEY);
            updateHistoryUI();
        }
    });

    // Initialize
    updateHistoryUI();
});
