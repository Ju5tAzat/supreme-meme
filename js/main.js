/**
 * Основные функции для всех инструментов
 */

// Функция для сохранения данных в LocalStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения в LocalStorage:', e);
        return false;
    }
}

// Функция для загрузки данных из LocalStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Ошибка загрузки из LocalStorage:', e);
        return null;
    }
}

// Функция для создания кнопки "Назад"
function createBackButton() {
    const btn = document.createElement('a');
    btn.href = '../../index.html';
    btn.className = 'back-btn';
    btn.innerHTML = '← На главную';
    return btn;
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text-primary);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Проверка, находимся ли мы на главной странице
function isMainPage() {
    return window.location.pathname.includes('index.html') || 
           window.location.pathname.endsWith('/') ||
           window.location.pathname.endsWith('\\');
}

// Функция для форматирования даты
function formatDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
}

// Функция для форматирования времени
function formatTime(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

// Настройки приложения
const defaultSettings = {
    theme: 'dark',
    particlesEnabled: true,
    particleCount: 80,
    lineDistance: 150,
    speedFactor: 1,
    transitionsEnabled: true
};

function loadSettings() {
    const saved = loadFromLocalStorage('toolsAppSettings');
    return { ...defaultSettings, ...saved };
}

function saveSettings(settings) {
    saveToLocalStorage('toolsAppSettings', settings);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

function initSettingsUI(animatedBackground) {
    if (!isMainPage()) return;

    const settings = loadSettings();
    applyTheme(settings.theme);

    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.innerHTML = `
        <h3>Настройки интерфейса</h3>
        <label>Тема
            <select id="theme-select">
                <option value="dark">Тёмная</option>
                <option value="light">Светлая</option>
            </select>
        </label>
        <label>Анимация частиц
            <input id="particles-toggle" type="checkbox">
        </label>
        <label>Анимация переходов
            <input id="transitions-toggle" type="checkbox">
        </label>
        <label>Количество частиц
            <input id="particle-count" type="range" min="20" max="200" step="1">
        </label>
        <label>Дистанция связей
            <input id="line-distance" type="range" min="70" max="260" step="1">
        </label>
        <label>Скорость (x)
            <input id="speed-factor" type="range" min="0.2" max="4" step="0.1">
        </label>
        <button id="reset-settings">Сбросить настройки</button>
        <div class="notice">Сохранено автоматически</div>
    `;

    const toggle = document.createElement('button');
    toggle.className = 'settings-toggle';
    toggle.type = 'button';
    toggle.textContent = '⚙️ Настройки';
    document.body.append(toggle);
    document.body.append(panel);

    toggle.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    const themeSelect = panel.querySelector('#theme-select');
    const particlesToggle = panel.querySelector('#particles-toggle');
    const transitionsToggle = panel.querySelector('#transitions-toggle');
    const countInput = panel.querySelector('#particle-count');
    const lineInput = panel.querySelector('#line-distance');
    const speedInput = panel.querySelector('#speed-factor');
    const resetButton = panel.querySelector('#reset-settings');

    themeSelect.value = settings.theme;
    particlesToggle.checked = settings.particlesEnabled;
    transitionsToggle.checked = settings.transitionsEnabled;
    countInput.value = settings.particleCount;
    lineInput.value = settings.lineDistance;
    speedInput.value = settings.speedFactor;

    function applyAndSave() {
        const updated = {
            theme: themeSelect.value,
            particlesEnabled: particlesToggle.checked,
            transitionsEnabled: transitionsToggle.checked,
            particleCount: Number(countInput.value),
            lineDistance: Number(lineInput.value),
            speedFactor: Number(speedInput.value)
        };

        applyTheme(updated.theme);
        if (animatedBackground) {
            animatedBackground.updateSettings(updated);
            if (updated.particlesEnabled) {
                animatedBackground.start();
            } else {
                animatedBackground.stop();
            }
        }

        saveSettings(updated);
    }

    themeSelect.addEventListener('change', applyAndSave);
    particlesToggle.addEventListener('change', applyAndSave);
    transitionsToggle.addEventListener('change', applyAndSave);
    countInput.addEventListener('input', applyAndSave);
    lineInput.addEventListener('input', applyAndSave);
    speedInput.addEventListener('input', applyAndSave);
    resetButton.addEventListener('click', () => {
        localStorage.removeItem('toolsAppSettings');
        applyTheme(defaultSettings.theme);
        if (animatedBackground) {
            animatedBackground.updateSettings(defaultSettings);
            animatedBackground.start();
        }
        themeSelect.value = defaultSettings.theme;
        particlesToggle.checked = defaultSettings.particlesEnabled;
        countInput.value = defaultSettings.particleCount;
        lineInput.value = defaultSettings.lineDistance;
        speedInput.value = defaultSettings.speedFactor;
        saveSettings(defaultSettings);
    });

    // Начальное применение
    applyAndSave();
}

// ============================================
// Анимированный фон с частицами
// ============================================

class Particle {
    constructor(canvas, speedFactor = 1) {
        this.canvas = canvas;
        this.speedFactor = speedFactor;
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            '88, 166, 255',  // accent blue
            '63, 185, 80',   // success green
            '210, 153, 34',  // warning yellow
            '248, 81, 73',   // danger red
            '163, 113, 247'  // purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(mouseX, mouseY) {
        // Движение
        this.x += this.speedX * this.speedFactor;
        this.y += this.speedY * this.speedFactor;
        
        // Отталкивание от мыши
        if (mouseX !== null && mouseY !== null) {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;
            
            if (distance < repulsionRadius) {
                const force = (repulsionRadius - distance) / repulsionRadius;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 3;
                this.y += Math.sin(angle) * force * 3;
            }
        }
        
        // Отражение от границ
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
        
        // Пульсация размера
        this.size += Math.sin(Date.now() * 0.003 + this.x) * 0.1;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

class AnimatedBackground {
    constructor(settings = {}) {
        this.canvas = document.getElementById('animated-bg');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.lines = [];
        this.playing = true;

        this.particleCount = settings.particleCount || defaultSettings.particleCount;
        this.lineDistance = settings.lineDistance || defaultSettings.lineDistance;
        this.speedFactor = settings.speedFactor || defaultSettings.speedFactor;
        this.particlesEnabled = settings.particlesEnabled !== undefined ? settings.particlesEnabled : defaultSettings.particlesEnabled;

        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.speedFactor));
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        
        // Поддержка мобильных устройств
        this.canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.lineDistance) {
                    const opacity = (1 - distance / this.lineDistance) * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateSettings(settings = {}) {
        if (settings.particleCount !== undefined && settings.particleCount !== this.particleCount) {
            this.particleCount = settings.particleCount;
            this.createParticles();
        }

        if (settings.lineDistance !== undefined) {
            this.lineDistance = settings.lineDistance;
        }

        if (settings.speedFactor !== undefined) {
            this.speedFactor = settings.speedFactor;
            this.particles.forEach(p => (p.speedFactor = this.speedFactor));
        }

        if (settings.particlesEnabled !== undefined) {
            this.particlesEnabled = settings.particlesEnabled;
        }

        if (settings.transitionsEnabled !== undefined) {
            this.transitionsEnabled = settings.transitionsEnabled;
        }

        if (settings.theme !== undefined) {
            applyTheme(settings.theme);
        }
    }

    start() {
        this.playing = true;
    }

    stop() {
        this.playing = false;
    }

    animate() {
        if (!this.playing || !this.particlesEnabled) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        // Полная очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновление и отрисовка частиц
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
        });
        
        // Отрисовка линий между близкими частицами
        this.drawConnections();
        
        // Мышь interaction glow
        if (this.mouseX !== null && this.mouseY !== null) {
            const gradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 100
            );
            gradient.addColorStop(0, 'rgba(88, 166, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(88, 166, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(this.mouseX - 100, this.mouseY - 100, 200, 200);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const settings = loadSettings();
    applyTheme(settings.theme);

    const animatedBackground = new AnimatedBackground(settings);

    if (!isMainPage()) {
        const existingBack = document.querySelector('.back-btn');
        if (!existingBack) {
            document.body.insertAdjacentElement('afterbegin', createBackButton());
        }
    }

    initSettingsUI(animatedBackground);
    initPageTransitions();

    // Горячие клавиши для быстрого запуска инструментов
    const shortcuts = {
        'Digit1': 'tools/calculator/calculator.html',
        'Digit2': 'tools/password/password.html',
        'Digit3': 'tools/todo/todo.html',
        'Digit4': 'tools/notes/notes.html',
        'Digit5': 'tools/timer/timer.html',
        'Digit6': 'tools/converter/converter.html',
        'Digit7': 'tools/clock/clock.html',
        'Digit8': 'tools/search/search.html',
        'Digit9': 'tools/qrcode/qrcode.html',
        'Digit0': 'tools/bmi/bmi.html'
    };

    // Показать подсказки по горячим клавишам
    const shortcutsInfo = {
        'Digit1': 'Калькулятор',
        'Digit2': 'Генератор паролей',
        'Digit3': 'To-Do список',
        'Digit4': 'Заметки',
        'Digit5': 'Таймер',
        'Digit6': 'Конвертер',
        'Digit7': 'Часы',
        'Digit8': 'Поиск',
        'Digit9': 'QR-код',
        'Digit0': 'BMI калькулятор'
    };

    function showShortcutsHint() {
        const hint = document.createElement('div');
        hint.className = 'shortcuts-hint';
        hint.innerHTML = `
            <h4>Горячие клавиши (нажмите цифру)</h4>
            <div class="shortcuts-grid">
                ${Object.entries(shortcutsInfo).map(([key, name]) => `
                    <div class="shortcut-item">
                        <kbd>${key.replace('Digit', '')}</kbd>
                        <span>${name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        document.body.appendChild(hint);
        
        // Add styles for shortcuts hint
        const style = document.createElement('style');
        style.textContent = `
            .shortcuts-hint {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 1rem;
                z-index: 100;
                opacity: 0.8;
                transition: opacity 0.3s;
                max-width: 300px;
            }
            .shortcuts-hint:hover {
                opacity: 1;
            }
            .shortcuts-hint h4 {
                margin-bottom: 0.75rem;
                font-size: 0.9rem;
                color: var(--text-primary);
            }
            .shortcuts-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
            }
            .shortcut-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.8rem;
            }
            .shortcut-item kbd {
                background: var(--bg-secondary);
                border: 1px solid var(--border);
                border-radius: 4px;
                padding: 2px 6px;
                font-family: monospace;
                min-width: 20px;
                text-align: center;
            }
            @media (max-width: 768px) {
                .shortcuts-hint {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 300);
        }, 8000);
    }

    // Показывать подсказку при загрузке
    if (isMainPage()) {
        setTimeout(showShortcutsHint, 2000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (shortcuts[e.code]) {
            window.location.href = shortcuts[e.code];
        }
    });
});

// ============================================
// Анимация переходов между страницами
// ============================================

function initPageTransitions() {
    const settings = loadSettings();
    if (!settings.transitionsEnabled) {
        return;
    }

    // Создаем элементы перехода
    const exitOverlay = document.createElement('div');
    exitOverlay.className = 'page-transition-exit';
    document.body.appendChild(exitOverlay);
    
    // Обрабатываем клики на ссылки
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            // Это внутренняя ссылка
            e.preventDefault();
            const targetUrl = link.href;
            
            // Запускаем анимацию выхода
            exitOverlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        }
    });
    
    // Анимация при загрузке страницы
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });
    
    // Анимация при уходе со страницы
    window.addEventListener('beforeunload', () => {
        document.body.style.opacity = '0';
    });
}
