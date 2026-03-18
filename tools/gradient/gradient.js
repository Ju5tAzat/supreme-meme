/**
 * CSS Gradient Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const preview = document.getElementById('gradientPreview');
    const typeBtns = document.querySelectorAll('.type-btn');
    const angleInput = document.getElementById('angle');
    const angleValue = document.getElementById('angleValue');
    const colorsList = document.getElementById('colorsList');
    const addColorBtn = document.getElementById('addColorBtn');
    const cssCode = document.getElementById('cssCode');
    const copyBtn = document.getElementById('copyBtn');
    const presets = document.querySelectorAll('.preset');
    const shapeLinear = document.getElementById('shapeLinear');
    const shapeRadial = document.getElementById('shapeRadial');

    let gradientType = 'linear';
    let angle = 90;

    // Get colors from inputs
    function getColors() {
        const rows = colorsList.querySelectorAll('.color-row');
        const colors = [];
        
        rows.forEach(row => {
            colors.push({
                color: row.querySelector('.color-input').value,
                position: row.querySelector('.position-input').value
            });
        });
        
        return colors.sort((a, b) => parseInt(a.position) - parseInt(b.position));
    }

    // Generate gradient CSS
    function generateGradient() {
        const colors = getColors();
        const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ');
        
        let gradient;
        if (gradientType === 'linear') {
            gradient = `linear-gradient(${angle}deg, ${colorStops})`;
        } else {
            gradient = `radial-gradient(circle, ${colorStops})`;
        }
        
        const css = `background: ${gradient};`;
        
        preview.style.cssText = css;
        shapeLinear.style.cssText = gradientType === 'linear' ? css : 'display: none';
        shapeRadial.style.cssText = gradientType === 'radial' ? css : 'display: none';
        
        cssCode.textContent = css;
    }

    // Add color row
    function addColorRow(color = '#ffffff', position = 100) {
        const row = document.createElement('div');
        row.className = 'color-row';
        row.innerHTML = `
            <input type="color" class="color-input" value="${color}">
            <input type="number" class="position-input" value="${position}" min="0" max="100">
            <span>%</span>
            <button class="remove-color">×</button>
        `;
        
        const removeBtn = row.querySelector('.remove-color');
        removeBtn.addEventListener('click', () => {
            if (colorsList.children.length > 2) {
                row.remove();
                updateRemoveButtons();
                generateGradient();
            }
        });
        
        // Event listeners for inputs
        row.querySelector('.color-input').addEventListener('input', generateGradient);
        row.querySelector('.position-input').addEventListener('input', generateGradient);
        
        colorsList.appendChild(row);
        updateRemoveButtons();
    }

    // Update remove buttons state
    function updateRemoveButtons() {
        const removeBtns = colorsList.querySelectorAll('.remove-color');
        removeBtns.forEach(btn => {
            btn.disabled = colorsList.children.length <= 2;
        });
    }

    // Event listeners for gradient type
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gradientType = btn.dataset.type;
            generateGradient();
        });
    });

    // Angle slider
    angleInput.addEventListener('input', (e) => {
        angle = e.target.value;
        angleValue.textContent = `${angle}°`;
        generateGradient();
    });

    // Add color button
    addColorBtn.addEventListener('click', () => {
        if (colorsList.children.length < 5) {
            addColorRow('#ffffff', 50);
            generateGradient();
        }
    });

    // Copy button
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.textContent);
        showNotification('Скопировано!');
    });

    // Presets
    presets.forEach(preset => {
        preset.addEventListener('click', () => {
            const gradient = preset.dataset.gradient;
            
            // Parse gradient and set inputs
            if (gradient.includes('linear-gradient')) {
                gradientType = 'linear';
                typeBtns.forEach(b => {
                    b.classList.toggle('active', b.dataset.type === 'linear');
                });
                
                // Extract angle
                const angleMatch = gradient.match(/(\d+)deg/);
                if (angleMatch) {
                    angle = angleMatch[1];
                    angleInput.value = angle;
                    angleValue.textContent = `${angle}°`;
                }
                
                // Extract colors
                const colorMatch = gradient.match(/#[a-fA-F0-9]{6}/g);
                if (colorMatch) {
                    // Clear existing colors
                    colorsList.innerHTML = '';
                    colorMatch.forEach((color, index) => {
                        addColorRow(color, index * (100 / (colorMatch.length - 1)));
                    });
                }
            }
            
            generateGradient();
        });
    });

    // Initialize
    generateGradient();
});
