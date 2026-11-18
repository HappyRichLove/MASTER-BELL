# DASHBOARD PWA MASTER

## Карта проекта
```text
/
├── src/                          # Рабочая версия PWA (Vanilla JS/HTML/CSS)
│   ├── index.html                # Главный экран основного приложения MASTER BELL (v20.23 Stable)
│   ├── metronome.html            # Метроном основного приложения
│   ├── sw.js                     # Service Worker основного приложения (master-v20.23)
│   ├── suncalc.min.js            # Расчет восходов и заходов для сандхья-калы
│   └── prana-test/               # НОВОЕ МОНОЛИТНОЕ ПРИЛОЖЕНИЕ MASTER PRANA v1.8.9
│       ├── index.html            # Монолит v1.8.9: Полноэкранные бесшовные настройки (#0c0f24 под чёлку) + Боевой Webhook + Автомиграция накопленных часов (Math.max)
│       ├── pranayama.html        # Редирект на index.html
│       ├── metronome.html        # Редирект на index.html
│       ├── manifest.json         # PWA Манифест ("MASTER", #0c0f24 сапфировый сплеш)
│       ├── sw.js                 # Service Worker (master-prana-v1.8.9 с кэшированием)
│       ├── favicon.svg           # Векторный символ Солнца и Луны на фоне #232653
│       ├── icon-*.png            # PWA иконки Солнце и Луна без артефактов и рамок (512, 192, apple-touch 180)
│       └── img/                  # 9 скриншотов установки PWA (iOS Safari 1-5, Android Chrome 1-4)
├── _PROJECT_CORE/                # Банк Памяти ИИ
│   ├── DASHBOARD.md              # Этот файл (Статус и Handoff)
│   ├── CONTEXT.md                # Правила и архитектура
│   ├── Code.gs                   # ЧИСТЫЙ standalone файл Google Apps Script (v1.8.6/v1.8.7/v1.8.8)
│   ├── GOOGLE_SHEETS_ARCHITECTURE.md # Спецификация Google Таблицы
│   ├── DESIGN_CATALOG.md         # Каталог избранных дизайнов
│   ├── STUDENT_AUTH_AND_STORAGE_STRATEGY.md # Стратегия авторизации и хранилищ
│   └── sessions/                 # Журнал сессий и INDEX.md
└── Деплой-репозиторий:
    └── /Users/sergeyhappyrichman/Documents/SP_HappyRichLove/02-Automation-Lab/МастерBell (перенесён и переимнованв MASTER)/MASTER BELL(upload)
        ├── https://happyrichlove.github.io/MASTER-BELL/ (MASTER BELL v20.23 Stable)
        └── https://happyrichlove.github.io/MASTER-BELL/prana-test/ (MASTER PRANA v1.8.9)
```

## Текущий статус задач
- [x] **СТРАТЕГИЧЕСКАЯ ЗАДАЧА 1: Основное приложение (MASTER BELL):**
  - Полная неприкосновенность и стабильность: `https://happyrichlove.github.io/MASTER-BELL/` (v20.23 Stable).
- [x] **СТРАТЕГИЧЕСКАЯ ЗАДАЧА 2: Модуль MASTER PRANA v1.8.9:**
  - Развернут по адресу: `https://happyrichlove.github.io/MASTER-BELL/prana-test/`.
  - **1. Полноэкранные бесшовные настройки (v1.8.9):**
    - Устранена полоса ВО ВРЕМЯ открытых настроек. Шторка 82vh заменена на полноэкранный лист `100dvh` с единым монолитным сапфировым фоном `#0c0f24`, уходящим прямо под чёлку iPhone с корректным отступом `safe-area-inset-top`.
  - **2. Автомиграция накопленных часов (Zero Data Loss):**
    - При вводе ПИН-кода или при запуске приложения накопленные локально секунды (Math.max по всем ключам хранилища) автоматически отправляются в Google Таблицу (`action=migrate_student`).
    - В таблице зафиксированы 39 минут Архитектора (`2340 сек`, `MP-001`).
  - **3. Боевой Google Apps Script Webhook:**
    - Боевой URL подключен в код из `.env`.
    - Дашборд Мастера и Архитектора видит 68 активных участников и синхронизирует общие часы группы.
  - **4. Офлайн-буфер:**
    - Гарантирует сохранение времени практики при обрыве интернета с отложенной отправкой при появлении сети.
