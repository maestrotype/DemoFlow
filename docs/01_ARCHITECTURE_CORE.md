# 01_ARCHITECTURE_CORE — Краткая архитектура DemoFlow

**Версия:** 1.1.0  
**Для кого:** LLM (Qwen3-Coder-30B) и разработчик  
**Цель документа:** Быстрый контекст проекта без воды.

---

## 1. Общее описание

DemoFlow — инструмент для создания продающих демо-видео.  
Пользователь загружает видео/скринкасты → добавляет аннотации (стрелки, текст, зум, hotspot) → AI помогает с текстом → экспортирует MP4/GIF.

**Ключевая ценность:** минимум усилий → профессиональный результат.

---

## 2. Основной стек

- **Frontend**: Angular 20+ (Standalone Components, Signals-first, Feature-Sliced Design)
- **Backend**: NestJS (Clean Architecture, Modules)
- **БД**: PostgreSQL + Prisma ORM
- **AI**: Локальные модели (Qwen3-VL-30B и др.) через Ollama
- **Видео**: FFmpeg + Puppeteer (для рендера сцен в PNG → видео)
- **Хранение**: R2 (или локально)
- **Очереди**: BullMQ + Redis
- **Аутентификация**: JWT (access + httpOnly refresh)

---

## 3. Главные сущности

- **Project** — демо-проект
- **Scene** — одна сцена (кадр + длительность + transition)
- **Layer** — аннотация внутри сцены (media, text, arrow, hotspot, zoom, blur и т.д.)
- **MediaAsset** — загруженные изображения/видео
- **AIAnalysis** — результат анализа медиа
- **ExportJob** — задача на экспорт
- **Share** — настройки публичной ссылки

**Важно:** Layers хранятся как JSON внутри Scene (не отдельная таблица).

---

## 4. Основные модули (Frontend)

- `core/` — Theme, Auth, HTTP, Notifications
- `shared/ui/` — дизайн-система (atoms, molecules, organisms)
- `entities/` — Project, Scene, Media, Layer
- `features/` — auth, dashboard, projects, media-library, **scene-editor** (самый важный), ai-assistant, export
- `layouts/` — AppLayout, EditorLayout (full-screen)

**State Management**: Signals + computed() (NgRx только при необходимости)

---

## 5. Основные модули (Backend)

- `auth/`
- `projects/`
- `scenes/`
- `media/`
- `ai/`
- `export/`
- `workspaces/` (multi-tenant)

**Паттерн**: Use Cases → Repository Interface → Implementation

---

## 6. Главный пользовательский путь (MVP)

1. Загрузка MediaAsset
2. AI Analysis (Qwen VL)
3. Создание Project + Scenes
4. В **Scene Editor** добавление Layers (стрелки, текст и т.д.)
5. Настройка длительности и переходов
6. Export → FFmpeg (Puppeteer рендерит сцены в кадры)

---

## 7. Текущие приоритеты (на 30.06.2026)

1. **Scene Editor** (canvas + layers + properties panel + timeline)
2. Добавление базовых типов Layer (media, text, arrow, hotspot)
3. Экспорт в MP4
4. Интеграция AI анализа
5. Публичный Player (/demo/:shareId)

---

## 8. Важные технические решения

- Editor использует **Canvas / PIXI** или Angular + absolute positioned elements (нужно решить)
- Все тяжёлые операции (FFmpeg, AI) — через очередь (не блокируем API)
- Auto-save каждые 3 секунды (PATCH /projects/:id/scenes/:sceneId)
- SSR + Hydration с осторожностью (Editor — CSR only)
- Локальный-first AI (Ollama). Деградация при недоступности.

---

**Этот документ — главный якорь для LLM.**

Все остальные документы (UX, Design System, API) дополняют его.

---

*Последнее обновление: 2026-06-30*