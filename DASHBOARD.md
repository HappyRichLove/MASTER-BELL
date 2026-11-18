# DASHBOARD PWA MASTER

## Карта проекта
```text
/
├── src/                          # Рабочая версия PWA (Vanilla JS/HTML/CSS)
│   ├── index.html                # Главный экран основного приложения MASTER BELL (v20.23 Stable)
│   ├── metronome.html            # Метроном основного приложения
│   ├── sw.js                     # Service Worker основного приложения (master-v20.23)
│   ├── suncalc.min.js            # Расчет восходов и заходов для сандхья-калы
│   └── prana-test/               # НОВОЕ МОНОЛИТНОЕ ПРИЛОЖЕНИЕ MASTER PRANA
│       ├── index.html            # Текущая версия v1.8.9 (на очереди v2.0 в новом чате)
│       ├── pranayama.html        # Редирект на index.html
│       ├── metronome.html        # Редирект на index.html
│       ├── manifest.json         # PWA Манифест ("MASTER", #0c0f24 сапфировый сплеш)
│       ├── sw.js                 # Service Worker с кэшированием
│       ├── favicon.svg           # Векторный символ Солнца и Луны на фоне #232653
│       ├── icon-*.png            # PWA иконки Солнце и Луна без артефактов и рамок (512, 192, apple-touch 180)
│       └── img/                  # 9 скриншотов установки PWA (iOS Safari 1-5, Android Chrome 1-4)
├── _PROJECT_CORE/                # Банк Памяти ИИ
│   ├── DASHBOARD.md              # Этот файл (Главный дашборд и статус)
│   ├── CONTEXT.md                # Правила и архитектура
│   ├── Code.gs                   # Google Apps Script API (готовится переход на v2.0 с 2 листами)
│   ├── GOOGLE_SHEETS_ARCHITECTURE.md # Спецификация Google Таблицы (архитектура двух листов)
│   ├── DESIGN_CATALOG.md         # Каталог избранных дизайнов
│   ├── STUDENT_AUTH_AND_STORAGE_STRATEGY.md # Стратегия авторизации и хранилищ
│   └── sessions/                 # Журнал сессий и INDEX.md
└── Деплой-репозиторий:
    └── /Users/sergeyhappyrichman/Documents/SP_HappyRichLove/02-Automation-Lab/МастерBell (перенесён и переимнованв MASTER)/MASTER BELL(upload)
        ├── https://happyrichlove.github.io/MASTER-BELL/ (MASTER BELL v20.23 Stable)
        └── https://happyrichlove.github.io/MASTER-BELL/prana-test/ (MASTER PRANA)
```

## Текущий статус задач и передача на v2.0
- [x] **Основное приложение MASTER BELL v20.23:** Полная неприкосновенность и стабильность на основном URL.
- [x] **Боевой Webhook Google Таблицы:** Подключен, видит активных учеников, фиксирует время в облаке. 39 минут Архитектора сохранены.
- [x] **Проведен аудит 2 независимых критиков (UI/UX и Архитектура БД):**
  - Ошибки верстки 100dvh локализованы.
  - Конфликт с IMPORTRANGE вскрыт (отказ от `appendRow`, переход на отдельный лист).
  - Сформирован четкий план релиза v2.0 для нового чата.
