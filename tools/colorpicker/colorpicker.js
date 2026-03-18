/**
 * Color Picker - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('colorInput');
    const hueSlider = document.getElementById('hueSlider');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const hsvValue = document.getElementById('hsvValue');
    const recentColors = document.getElementById('recentColors');

    const RECENT_KEY = 'recentColors';
    const MAX_RECENT = 12;

    // Convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    // Convert RGB to HEX
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    // Convert RGB to HSV
    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    }

    // Update all formats
    function updateFormats(hex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

        colorPreview.style.background = hex;
        hexValue.value = hex;
        rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        hsvValue.value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;

        addToRecent(hex);
    }

    // Recent colors
    function getRecent() {
        return loadFromLocalStorage(RECENT_KEY) || [];
    }

    function addToRecent(hex) {
        let recent = getRecent();
        recent = recent.filter(c => c !== hex);
        recent.unshift(hex);
        recent = recent.slice(0, MAX_RECENT);
        saveToLocalStorage(RECENT_KEY, recent);
        renderRecent();
    }

    function renderRecent() {
        const recent = getRecent();
        if (recent.length === 0) return;

        recentColors.innerHTML = recent.map(color => `
            <div class="recent-color" style="background: ${color}" data-color="${color}" title="${color}"></div>
        `).join('');

        recentColors.querySelectorAll('.recent-color').forEach(el => {
            el.addEventListener('click', () => {
                const color = el.dataset.color;
                colorInput.value = color;
                updateFormats(color);
            });
        });
    }

    // Event listeners
    colorInput.addEventListener('input', (e) => {
        updateFormats(e.target.value);
    });

    hueSlider.addEventListener('input', (e) => {
        const hue = e.target.value;
        const hsl = `hsl(${hue}, 70%, 50%)`;
        // Convert HSL to hex
        const temp = document.createElement('div');
        temp.style.color = hsl;
        document.body.appendChild(temp);
        const computed = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        
        const match = computed.match(/\d+/g);
        if (match) {
            const hex = rgbToHex(parseInt(match[0]), parseInt(match[1]), parseInt(match[2]));
            colorInput.value = hex;
            updateFormats(hex);
        }
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            navigator.clipboard.writeText(target.value);
            showNotification('Скопировано!');
        });
    });

    // Initial
    updateFormats('#58a6ff');
    renderRecent();
});
