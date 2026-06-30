05_VIDEO_EDITOR_SPEC — Спецификация Scene Editor
Версия: 1.0.0
Дата: 2026-06-30
Приоритет: Максимальный (P0)
Это главный документ для реализации ядра продукта.

Цель редактора

Создать максимально удобный интерфейс, где пользователь может:

Быстро добавлять аннотации на видео/скриншоты
Управлять последовательностью сцен
Получать помощь от AI
Экспортировать готовое демо-видео

Главный принцип: Пользователь должен чувствовать, что он рассказывает историю, а не "монтирует видео".

Общая компоновка Editor (Full-screen)

[ Top Toolbar ]  ← Back | Project Title | Undo/Redo | Tools | Zoom | Export/Share
[ Left Panel ]   ← Layers List (220px)
[ Central Area ] ← Canvas (fluid, 16:9 aspect ratio by default)
[ Right Panel ]  ← Properties (280px, context-aware)
[ Bottom ]       ← Scene Timeline + Media Drawer (collapsible)

Основные инструменты (Toolbar)

Инструмент | Действие
Select | Выбор и перемещение слоёв
Text | Добавить текстовый слой
Arrow | Нарисовать стрелку
Shape | Прямоугольник / круг
Hotspot | Пульсирующая точка
Zoom Area | Область зума
Blur | Размытие/редакция
Media | Добавить медиа-слой

Типы Layers (аннотаций)

Обязательные для MVP:

Media Layer — изображение/видео
Text Layer — текст с настройками (шрифт, размер, цвет, alignment)
Arrow Layer — стрелка (стиль, толщина, цвет, анимация)
Hotspot Layer — пульсирующая точка с label
Zoom Area — область, на которую камера "наезжает"

Следующие (P1):

Shape (rectangle, circle)
Callout / Speech bubble
Blur / Redaction


Canvas поведение


Фиксированное соотношение сторон (16:9 по умолчанию, настраивается в проекте)
Pan (Space + drag)
Zoom (колёсико, кнопки, Cmd +/-)
Snap to grid (опционально)
Selection: click, Cmd+click, marquee
Контекстное меню по правому клику


Properties Panel (правая панель)

Должен быть context-aware — показывать только релевантные настройки для выбранного слоя.
Примеры:

Text → font, size, color, weight, alignment, line height
Arrow → color, thickness, head style, curvature
Hotspot → color, pulse speed, label
Media → opacity, object-fit, corner radius


Scene Timeline (нижняя панель)


Горизонтальная полоса сцен
Каждая сцена — thumbnail + название + длительность
Drag & drop для смены порядка
"+" для добавления новой сцены
Переход между сценами (fade и другие)


AI Assistant Panel


Всегда доступен (можно свернуть)
Показывает анализ текущего медиа
Предлагает заголовки, описания, шаги с готовыми зонами зума и highlight
Кнопка "Accept All" — создаёт несколько сцен автоматически


Технические требования


Performance: Canvas должен работать плавно даже с 20+ слоями
Auto-save: Каждые 3 секунды (debounced)
Undo/Redo: Минимум 30–50 шагов (snapshot-based)
State: Использовать Signals + Store
SSR: Editor — полностью Client-Side (CSR)


План реализации (рекомендуемый порядок)

P0 (критично):

Editor Layout + Canvas container
Добавление/удаление Media Layer
Properties Panel (базовый)
Scene Timeline + переключение сцен
Export в MP4 (простой)

P1:
6. Text + Arrow layers
7. Drag, resize, rotate
8. AI integration
9. Undo/Redo
Этот документ — главный референс при реализации редактора.
Все решения по UI/UX должны соответствовать этому spec и UX_ARCHITECTURE.md.
Последнее обновление: 2026-06-30