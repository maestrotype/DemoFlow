DESIGN_SYSTEM.md
Версия: 1.1.0
Дата: 2026-06-30
Текущее состояние:

ThemeService полностью реализован (dark/light/system + SSR поддержка)
Тема применяется через data-theme на <html>
Много компонентов всё ещё используют inline-стили и hardcoded цвета
Shared UI используется слабо

Цель дизайна:
Создать премиум тёмную тему с качественной поддержкой light mode, glassmorphism и чёткой системой токенов.

Основные принципы

Dark First
Clarity over decoration
4px spacing grid
Tokens everywhere (никаких hardcoded цветов, отступов, размеров)
Glassmorphism использовать аккуратно
OnPush + Signals-first в компонентах


2. Токены (CSS Custom Properties)
Цвета (основные):

--color-bg-base: #0c0d14 (самый тёмный фон)
--color-bg-elevated: #10111c (sidebar, topbar)
--color-bg-surface: #16182a (карточки)
--color-bg-overlay: #1e2030 (модалки, dropdowns)
--color-bg-glass: rgba(30, 32, 48, 0.55)

Акцент:

--color-accent: #7c5ce7 (основной фиолетовый)
--color-accent-hover: #8f72f0

Текст:

--color-text-primary: #f0f0f7
--color-text-secondary: #96a0b8
--color-text-muted: #5c6480

Отступы (4px grid):
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
Радиусы:
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 20px

3. Структура файлов стилей (рекомендуемая)
textstyles/
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   ├── shadows.css
│   ├── radius.css
│   └── motion.css
├── themes/
│   ├── dark.css
│   └── light.css
├── base/
│   ├── reset.css
│   └── typography.css
├── components/          ← сюда будем выносить стили компонентов
├── utils/
│   └── mixins.css
└── global.css           ← главный импорт