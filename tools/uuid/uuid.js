/**
 * UUID Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const uuidOutput = document.getElementById('uuidOutput');
    const generateBtn = document.getElementById('generateBtn');
    const generate4Btn = document.getElementById('generate4Btn');
    const generate1Btn = document.getElementById('generate1Btn');
    const copyBtn = document.getElementById('copyBtn');
    const uuidHistory = document.getElementById('uuidHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');

    const HISTORY_KEY = 'uuidHistory';
    const MAX_HISTORY = 20;

    // Generate UUID v4 (random)
    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Generate UUID v1 (timestamp-based)
    function generateUUIDv1() {
        const now = Date.now();
        const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r, v;
            if (c === 'x') {
                r = Math.random() * 16 | 0;
                v = r;
            } else {
                r = Math.random() * 16 | 0;
                v = (r & 0x3 | 0x8);
            }
            
            // Insert timestamp bytes at positions
            const timestampPart = ((now + r) * 16).toString(16).padStart(12, '0');
            if (c === 'x') {
                return timestampPart[0] || r.toString(16);
            }
            return v.toString(16);
        });
        
        // Proper v1 format
        const timeLow = (now & 0xffffffff).toString(16).padStart(8, '0');
        const timeMid = ((now >> 32) & 0xffff).toString(16).padStart(4, '0');
        const timeHi = ((now >> 48) & 0x0fff).toString(16).padStart(4, '0');
        
        return `${timeLow}-${timeMid}-1${timeHi.charAt(0)}-${((Math.random() * 4) | 8).toString(16)}${timeHi.substring(1)}-${((Math.random() * 0xffffffffffff) + 0x800000000000).toString(16).substring(1)}`;
    }

    // Simple v4 generator
    function uuidv4() {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Display UUID
    function displayUUID(uuid) {
        uuidOutput.value = uuid;
        addToHistory(uuid);
    }

    // Get history
    function getHistory() {
        return loadFromLocalStorage(HISTORY_KEY) || [];
    }

    // Add to history
    function addToHistory(uuid) {
        let history = getHistory();
        history = history.filter(u => u !== uuid);
        history.unshift(uuid);
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }
        saveToLocalStorage(HISTORY_KEY, history);
        renderHistory();
    }

    // Render history
    function renderHistory() {
        const history = getHistory();
        if (history.length === 0) {
            uuidHistory.innerHTML = '<li class="empty">История пуста</li>';
            return;
        }
        
        uuidHistory.innerHTML = history.map(uuid => `
            <li onclick="copyFromHistory('${uuid}')">
                <span class="history-item-text">${uuid}</span>
                <button class="history-item-copy" onclick="event.stopPropagation(); copyToClipboard('${uuid}')">📋</button>
            </li>
        `).join('');
    }

    // Copy to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('UUID скопирован!');
        } catch (err) {
            showNotification('Не удалось скопировать', true);
        }
    }

    // Copy from history
    window.copyFromHistory = function(uuid) {
        uuidOutput.value = uuid;
    };

    // Event listeners
    generateBtn.addEventListener('click', () => {
        displayUUID(generateUUIDv4());
    });

    generate4Btn.addEventListener('click', () => {
        displayUUID(generateUUIDv4());
    });

    generate1Btn.addEventListener('click', () => {
        displayUUID(generateUUIDv1());
    });

    copyBtn.addEventListener('click', () => {
        copyToClipboard(uuidOutput.value);
    });

    clearHistoryBtn.addEventListener('click', () => {
        saveToLocalStorage(HISTORY_KEY, []);
        renderHistory();
    });

    // Generate initial UUID
    generateBtn.click();
    
    // Render history
    renderHistory();
});
