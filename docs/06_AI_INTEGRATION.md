06_AI_INTEGRATION — Интеграция AI в DemoFlow
Версия: 1.0.0
Дата: 2026-06-30
Модель по умолчанию: Qwen3-VL-30B (локальная)

Цели AI в продукте

AI — это не "фича", а помощник, который ускоряет создание демо в 3–5 раз.
Основные сценарии использования:

Анализ загруженного скриншота/видео
Генерация заголовков, описаний и шагов
Предложение визуальных аннотаций (где поставить стрелку, зум, hotspot)
Генерация голосового сопровождения (TTS — позже)
Текущая архитектура AI


Провайдер: Ollama (локально) + возможность OpenAI в будущем
Модель по умолчанию: qwen3-vl-30b (или qwen2.5-vl:7b для слабого железа)
Абстракция: IAIProvider interface
Очередь: BullMQ (ai-analysis-queue)
Коммуникация: WebSocket для прогресса


Основной workflow (Analyze Media)
Пользователь нажимает "Analyze with AI" на медиа-ассете
Frontend отправляет POST /media/:id/analyze
Backend создаёт запись AIAnalysis (status = QUEUED)
Задача попадает в очередь
Worker:
Скачивает файл
Подготавливает изображение (resize, base64)
Формирует структурированный промпт
Отправляет запрос к Ollama
Парсит JSON-ответ
Сохраняет suggestions

WebSocket событие ai:analysis:complete
Структура AI Suggestions

interface AISuggestions {
confidence: number;           // 0.0 – 1.0
title: string;
description: string;
suggestedDurationMs: number;
tags: string[];
steps: AIStep[];
}
interface AIStep {
index: number;
title: string;
description: string;
durationMs: number;
zoomArea?: BoundingBox;       // 0-1 координаты
highlightAreas?: Highlight[];
callout?: string;
cursorPosition?: Point;
}

Промпты (ключ к качеству)

Нужно создать хорошие system-промпты:

analyze-screenshot.prompt.ts
generate-copy.prompt.ts
suggest-steps.prompt.ts

Важно: Промпты должны возвращать валидный JSON (использовать format: "json" в Ollama).

Режимы работы


Online — полная функциональность
Degraded — AI отключён:
Панель AI показывает предупреждение
Все ручные инструменты работают
Пользователь может вручную заполнять всё



План интеграции (ближайшие задачи)

P0:

Реализовать OllamaProvider
Создать endpoint POST /media/:id/analyze
WebSocket уведомления о прогрессе
Отображение suggestions в UI

P1:
5. Применение suggestions (создание сцен + layers)
6. Custom prompt в AI panel
7. Тест соединения (POST /settings/ai/test)

Важные технические моменты


Не блокировать основной поток (всё через очередь)
Ограничение по квотам (в зависимости от плана)
Локальный-first подход (Ollama должен работать без интернета)
Обработка ошибок (модель не загружена, недостаточно VRAM и т.д.)

Этот документ используй при реализации всех AI-фич.
Последнее обновление: 2026-06-30