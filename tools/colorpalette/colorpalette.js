/**
 * Color Palette Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const baseColorInput = document.getElementById('baseColor');
    const baseColorText = document.getElementById('baseColorText');
    const randomBtn = document.getElementById('randomBtn');
    const exportCSS = document.getElementById('exportCSS');
    const exportJSON = document.getElementById('exportJSON');
    const exportSCSS = document.getElementById('exportSCSS');

    let currentPalettes = {};

    // Convert hex to HSL
    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // Convert HSL to hex
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Get contrasting text color
    function getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    // Generate monochromatic palette
    function generateMonoPalette(hex) {
        const hsl = hexToHSL(hex);
        const colors = [];
        
        for (let i = 0; i < 5; i++) {
            const lightness = 20 + (i * 15);
            colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        
        return colors;
    }

    // Generate complementary palette
    function generateCompPalette(hex) {
        const hsl = hexToHSL(hex);
        return [
            hex,
            hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h + 180) % 360, hsl.s * 0.5, hsl.l * 1.5),
            hex,
            hslToHex(hsl.h, hsl.s * 0.3, hsl.l * 0.5)
        ];
    }

    // Generate triadic palette
    function generateTriadPalette(hex) {
        const hsl = hexToHSL(hex);
        return [
            hex,
            hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h + 120) % 360, hsl.s * 0.5, hsl.l * 1.5),
            hslToHex((hsl.h + 240) % 360, hsl.s * 0.5, hsl.l * 1.5)
        ];
    }

    // Generate analogous palette
    function generateAnalogPalette(hex) {
        const hsl = hexToHSL(hex);
        return [
            hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
            hex,
            hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
            hslToHex((hsl.h - 30 + 360) % 360, hsl.s * 0.5, hsl.l * 1.5)
        ];
    }

    // Generate random palette
    function generateRandomPalette() {
        const colors = [];
        for (let i = 0; i < 5; i++) {
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(Math.random() * 50) + 50;
            const l = Math.floor(Math.random() * 40) + 30;
            colors.push(hslToHex(h, s, l));
        }
        return colors;
    }

    // Render color swatches
    function renderPalette(containerId, colors) {
        const container = document.getElementById(containerId);
        container.innerHTML = colors.map(color => `
            <div class="color-swatch" style="background: ${color}" data-color="${color}">
                <span class="color-code">${color}</span>
            </div>
        `).join('');

        // Add click to copy
        container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(swatch.dataset.color);
                showNotification('Скопировано: ' + swatch.dataset.color);
            });
        });

        return colors;
    }

    // Generate all palettes
    function generateAllPalettes(hex) {
        currentPalettes = {
            mono: generateMonoPalette(hex),
            comp: generateCompPalette(hex),
            triad: generateTriadPalette(hex),
            analog: generateAnalogPalette(hex)
        };

        renderPalette('monoPalette', currentPalettes.mono);
        renderPalette('compPalette', currentPalettes.comp);
        renderPalette('triadPalette', currentPalettes.triad);
        renderPalette('analogPalette', currentPalettes.analog);
    }

    // Generate random palette
    function generateRandom() {
        const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        baseColorInput.value = randomHex;
        baseColorText.value = randomHex;
        
        const colors = generateRandomPalette();
        renderPalette('randomPalette', colors);
    }

    // Export functions
    function exportAsCSS() {
        let css = ':root {\n';
        let index = 1;
        
        Object.values(currentPalettes).forEach(palette => {
            palette.forEach(color => {
                css += `  --color-${index}: ${color};\n`;
                index++;
            });
        });
        
        css += '}';
        
        navigator.clipboard.writeText(css);
        showNotification('CSS скопирован!');
    }

    function exportAsJSON() {
        const json = JSON.stringify(currentPalettes, null, 2);
        navigator.clipboard.writeText(json);
        showNotification('JSON скопирован!');
    }

    function exportAsSCSS() {
        let scss = '';
        let index = 1;
        
        Object.entries(currentPalettes).forEach(([name, palette]) => {
            scss += `// ${name}\n`;
            palette.forEach(color => {
                scss += `$color-${index}: ${color};\n`;
                index++;
            });
            scss += '\n';
        });
        
        navigator.clipboard.writeText(scss);
        showNotification('SCSS скопирован!');
    }

    // Event listeners
    baseColorInput.addEventListener('input', (e) => {
        baseColorText.value = e.target.value;
        generateAllPalettes(e.target.value);
    });

    baseColorText.addEventListener('change', (e) => {
        let hex = e.target.value;
        if (!hex.startsWith('#')) hex = '#' + hex;
        
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            baseColorInput.value = hex;
            generateAllPalettes(hex);
        }
    });

    randomBtn.addEventListener('click', generateRandom);
    exportCSS.addEventListener('click', exportAsCSS);
    exportJSON.addEventListener('click', exportAsJSON);
    exportSCSS.addEventListener('click', exportAsSCSS);

    // Initialize
    generateAllPalettes('#6366f1');
    generateRandom();
});
