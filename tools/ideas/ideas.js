/**
 * Ideas Generator - Main Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const ideaText = document.getElementById('ideaText');
    const categorySelect = document.getElementById('categorySelect');
    const generateBtn = document.getElementById('generateBtn');
    const favoritesList = document.getElementById('favoritesList');

    const FAVORITES_KEY = 'ideasFavorites';

    // Ideas database
    const ideas = {
        project: [
            'Создать персональный сайт-портфолио',
            'Разработать мобильное приложение для трекинга привычек',
            'Создать Telegram-бота для напоминаний',
            'Сделать интернет-магазин',
            'Запустить SaaS-сервис',
            'Создать систему автоматизации дома',
            'Разработать браузерное расширение',
            'Создать VR/AR приложение',
            'Запустить подкаст',
            'Написать электронную книгу',
            'Создать онлайн-курс',
            'Разработать игру для мобильных'
        ],
        content: [
            'Написать серию статей о продуктивности',
            'Создать видео-туториал',
            'Запустить newsletter',
            'Начать вести YouTube-канал',
            'Создать инфографику',
            'Написать пост для LinkedIn',
            'Создать подкаст-эпизод',
            'Написать case-study',
            'Создать шаблоны для дизайна',
            'Запустить серию твитов'
        ],
        business: [
            'Открыть кофейню',
            'Запустить дропшиппинг',
            'Создать консалтинговое агентство',
            'Открыть онлайн-школу',
            'Создать агентство недвижимости',
            'Запустить маркетплейс',
            'Открыть барбершоп',
            'Создать сервис доставки',
            'Запустить digital-агентство',
            'Открыть фитнес-клуб'
        ],
        learning: [
            'Изучить Python',
            'Выучить новый язык программирования',
            'Пройти курс по машинному обучению',
            'Изучить блокчейн-технологии',
            'Научиться рисовать',
            'Освоить видеомонтаж',
            'Выучить английский язык',
            'Изучить финансовую грамотность',
            'Пройти курс по маркетингу',
            'Научиться играть на гитаре'
        ],
        fun: [
            'Организовать пикник с друзьями',
            'Сходить в поход',
            'Сыграть в настольную игру',
            'Посмотреть сериал',
            'Приготовить новое блюдо',
            'Создать фотоколлаж',
            'Сходить на концерт',
            'Организовать киновечер',
            'Сделать фотосессию',
            'Создать самодельный подарок'
        ]
    };

    // Get all ideas
    function getAllIdeas() {
        return [
            ...ideas.project,
            ...ideas.content,
            ...ideas.business,
            ...ideas.learning,
            ...ideas.fun
        ];
    }

    // Generate idea
    function generate() {
        const category = categorySelect.value;
        let pool;
        
        if (category === 'all') {
            pool = getAllIdeas();
        } else {
            pool = ideas[category] || [];
        }
        
        if (pool.length === 0) return;
        
        const random = pool[Math.floor(Math.random() * pool.length)];
        
        // Animate
        ideaText.style.animation = 'none';
        setTimeout(() => {
            ideaText.textContent = random;
            ideaText.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    }

    // Favorites
    function getFavorites() {
        return loadFromLocalStorage(FAVORITES_KEY) || [];
    }

    function toggleFavorite(idea) {
        let favorites = getFavorites();
        
        if (favorites.includes(idea)) {
            favorites = favorites.filter(f => f !== idea);
        } else {
            favorites.push(idea);
        }
        
        saveToLocalStorage(FAVORITES_KEY, favorites);
        renderFavorites();
    }

    function renderFavorites() {
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<li>Нет избранных идей</li>';
            return;
        }
        
        favoritesList.innerHTML = favorites.map(idea => `
            <li onclick="showIdea('${escapeHtml(idea)}')">
                <span>${escapeHtml(idea)}</span>
                <button class="favorite-btn active" onclick="event.stopPropagation(); toggleFavorite('${escapeHtml(idea)}')">⭐</button>
            </li>
        `).join('');
    }

    function showIdea(idea) {
        ideaText.textContent = idea;
        ideaText.style.animation = 'fadeIn 0.3s ease';
    }

    // Event listeners
    generateBtn.addEventListener('click', generate);
    categorySelect.addEventListener('change', generate);

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            if (document.activeElement !== categorySelect) {
                e.preventDefault();
                generate();
            }
        }
    });

    // Expose functions globally
    window.toggleFavorite = toggleFavorite;
    window.showIdea = showIdea;

    // Initial
    renderFavorites();
});
