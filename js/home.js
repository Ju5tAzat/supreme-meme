/**
 * Home Page - Enhanced Functionality
 * Search, Categories, Favorites, Recent Tools
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the main page
    if (!isMainPage()) return;

    // DOM Elements
    const globalSearch = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const toolCards = document.querySelectorAll('.tool-card');
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const recentSection = document.getElementById('recentSection');
    const recentGrid = document.getElementById('recentGrid');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const modalClose = document.querySelector('.modal-close');
    const toolsCount = document.getElementById('toolsCount');

    // Storage Keys
    const FAVORITES_KEY = 'toolsFavorites';
    const RECENT_KEY = 'toolsRecent';
    const SETTINGS_KEY = 'toolsAppSettings';

    // Default Settings
    const defaultSettings = {
        theme: 'dark',
        accentColor: '#58a6ff',
        particlesEnabled: true,
        particleCount: 80,
        lineDistance: 150,
        speedFactor: 1
    };

    // Load Settings
    function loadSettings() {
        const saved = loadFromLocalStorage(SETTINGS_KEY);
        return { ...defaultSettings, ...saved };
    }

    function saveSettings(settings) {
        saveToLocalStorage(SETTINGS_KEY, settings);
    }

    // Get Favorites
    function getFavorites() {
        return loadFromLocalStorage(FAVORITES_KEY) || [];
    }

    function saveFavorites(favorites) {
        saveToLocalStorage(FAVORITES_KEY, favorites);
    }

    // Get Recent Tools
    function getRecent() {
        return loadFromLocalStorage(RECENT_KEY) || [];
    }

    function addRecent(toolUrl) {
        let recent = getRecent();
        recent = recent.filter(r => r !== toolUrl);
        recent.unshift(toolUrl);
        recent = recent.slice(0, 6); // Keep only 6 recent
        saveToLocalStorage(RECENT_KEY, recent);
    }

    // Track tool clicks
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.tool-card');
        if (card) {
            addRecent(card.href);
            updateRecentSection();
        }
    });

    // Update Favorites UI
    function updateFavorites() {
        const favorites = getFavorites();
        
        // Update card states
        toolCards.forEach(card => {
            const isFavorite = favorites.includes(card.href);
            card.classList.toggle('favorited', isFavorite);
        });

        // Update quick access section
        if (favorites.length > 0) {
            favoritesSection.style.display = 'block';
            favoritesGrid.innerHTML = favorites.map(url => {
                const card = document.querySelector(`.tool-card[href="${url}"]`);
                if (!card) return '';
                return `
                    <a href="${url}" class="quick-card">
                        <span class="tool-icon">${card.querySelector('.tool-icon').textContent}</span>
                        <h4>${card.querySelector('h2').textContent}</h4>
                    </a>
                `;
            }).join('');
        } else {
            favoritesSection.style.display = 'none';
        }
    }

    // Update Recent Section
    function updateRecentSection() {
        const recent = getRecent();
        
        if (recent.length > 0) {
            recentSection.style.display = 'block';
            recentGrid.innerHTML = recent.map(url => {
                const card = document.querySelector(`.tool-card[href="${url}"]`);
                if (!card) return '';
                return `
                    <a href="${url}" class="quick-card">
                        <span class="tool-icon">${card.querySelector('.tool-icon').textContent}</span>
                        <h4>${card.querySelector('h2').textContent}</h4>
                    </a>
                `;
            }).join('');
        } else {
            recentSection.style.display = 'none';
        }
    }

    // Search Functionality
    globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        const results = Array.from(toolCards).filter(card => {
            const name = card.dataset.name || '';
            const title = card.querySelector('h2').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            return name.includes(query) || title.includes(query) || desc.includes(query);
        });

        if (results.length > 0) {
            searchResults.innerHTML = results.slice(0, 8).map(card => `
                <a href="${card.href}" class="search-result-item">
                    <span class="search-result-icon">${card.querySelector('.tool-icon').textContent}</span>
                    <div class="search-result-info">
                        <h4>${card.querySelector('h2').textContent}</h4>
                        <p>${card.querySelector('p').textContent}</p>
                    </div>
                </a>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="no-results">Ничего не найдено</div>';
            searchResults.classList.add('active');
        }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            globalSearch.focus();
        }
    });

    // Category Filtering
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter cards
            toolCards.forEach(card => {
                if (category === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardCategory = card.dataset.category;
                    card.classList.toggle('hidden', cardCategory !== category);
                }
            });
        });
    });

    // Favorites Toggle
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = btn.closest('.tool-card');
            const url = card.href;
            let favorites = getFavorites();
            
            if (favorites.includes(url)) {
                favorites = favorites.filter(f => f !== url);
            } else {
                favorites.push(url);
            }
            
            saveFavorites(favorites);
            updateFavorites();
        });
    });

    // Settings Modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    // Theme Toggle
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const settings = loadSettings();
            settings.theme = btn.dataset.theme;
            saveSettings(settings);
            applyTheme(settings.theme);
        });
    });

    // Color Toggle
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const color = btn.dataset.color;
            document.documentElement.style.setProperty('--accent', color);
            
            const settings = loadSettings();
            settings.accentColor = color;
            saveSettings(settings);
        });
    });

    // Particles Toggle
    const particlesToggle = document.getElementById('particlesToggle');
    if (particlesToggle) {
        particlesToggle.addEventListener('change', (e) => {
            const settings = loadSettings();
            settings.particlesEnabled = e.target.checked;
            saveSettings(settings);
            
            if (window.animatedBackground) {
                if (e.target.checked) {
                    window.animatedBackground.start();
                } else {
                    window.animatedBackground.stop();
                }
            }
        });
    }

    // Reset Favorites
    const resetFavoritesBtn = document.getElementById('resetFavorites');
    if (resetFavoritesBtn) {
        resetFavoritesBtn.addEventListener('click', () => {
            if (confirm('Сбросить все избранные инструменты?')) {
                saveFavorites([]);
                updateFavorites();
            }
        });
    }

    // Initialize
    function init() {
        const settings = loadSettings();
        
        // Apply theme
        applyTheme(settings.theme);
        
        // Apply accent color
        document.documentElement.style.setProperty('--accent', settings.accentColor);
        
        // Update theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === settings.theme);
        });
        
        // Update color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === settings.accentColor);
        });
        
        // Update particles toggle
        if (particlesToggle) {
            particlesToggle.checked = settings.particlesEnabled;
        }
        
        // Update favorites and recent
        updateFavorites();
        updateRecentSection();
        
        // Update tools count
        toolsCount.textContent = toolCards.length;
    }

    init();
});
