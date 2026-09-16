---
title: FruitVision
emoji: 🥑
colorFrom: green
colorTo: orange
sdk: docker
app_port: 8000
pinned: false
---

<!-- Блок выше – метаданные для Hugging Face Spaces (этот же репозиторий пушится и туда как бэкенд). -->

# FruitVision

[![CI](https://github.com/AlexTrav/-FruitVision/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexTrav/-FruitVision/actions/workflows/ci.yml)

Рубежное задание по курсу «Искусственный интеллект и машинное обучение»:
система распознавания изображений (Computer Vision) – классификация фруктов и овощей
по фотографии. Полный пайплайн: обучение CNN → REST API → веб-интерфейс.

Автор: **Алексей Нерезов**.

Условие задания: [ТЗ.md](ТЗ.md). Краткое описание решения: [SUMMARY.md](SUMMARY.md).

## Возможности

- классификация изображения по 36 классам фруктов и овощей (MobileNetV2, 92% test accuracy);
- загрузка фото с диска (drag-and-drop) или прямо с камеры устройства;
- Grad-CAM – тепловая карта, показывающая, на какую область фото "смотрела" модель;
- локальная история последних предсказаний (хранится в браузере);
- страница "О проекте" с метриками, пайплайном обучения и стеком технологий.

## Структура проекта

```
FruitVision/
  model/          – обучение модели (Colab-ноутбук) и её артефакты
  backend/        – FastAPI-сервис с инференсом и Grad-CAM
  frontend/       – Vue 3 + TypeScript + Tailwind сайт
  .github/workflows/ci.yml – CI: тесты бэкенда + сборка фронтенда
  docker-compose.yml, Makefile – запуск всего стека одной командой
```

Подробности по каждой части – в README внутри соответствующей папки:
[model/README.md](model/README.md), [backend/README.md](backend/README.md),
[frontend/README.md](frontend/README.md).

## Быстрый запуск через Docker

Требуется установленный Docker и Docker Compose.

```bash
make up
```

Поднимет backend (FastAPI + модель) и frontend (Vue, собранный и отданный через nginx)
в правильном порядке: frontend стартует только после того, как backend пройдёт healthcheck
(настроено в `docker-compose.yml`).

- Сайт: http://localhost:8080
- API: http://localhost:8000 (документация – http://localhost:8000/docs)

Другие команды корневого `Makefile`: `make up-d` (в фоне), `make down`, `make logs`,
`make build`, `make restart`, `make clean`.

## Запуск без Docker (для разработки)

```bash
cd backend && make install && make run     # http://localhost:8000
cd frontend && make install && make dev    # http://localhost:5173
```

Подробнее – в README каждой папки.

## Продакшн-деплой (бесплатно)

- **Фронтенд → GitHub Pages.** Деплоится автоматически (`.github/workflows/deploy-pages.yml`)
  при каждом push в `main`. Разово нужно включить в репозитории: Settings → Pages → Source →
  **GitHub Actions**. Адрес: `https://alextrav.github.io/-FruitVision/`.
- **Бэкенд → Hugging Face Spaces** (SDK: Docker, бесплатный CPU-тариф). Метаданные для Space уже
  лежат в этом README (YAML-блок в самом верху) и в корневом `Dockerfile`. Шаги:
  1. Создать Space на huggingface.co (SDK: Docker).
  2. `git remote add hf https://huggingface.co/spaces/<user>/<space>`
  3. `git push hf main`
  4. Скопировать публичный URL Space'а и указать его в переменной репозитория GitHub
     `Settings → Secrets and variables → Actions → Variables → API_BASE_URL` — после следующего
     деплоя фронтенд начнёт стучаться именно туда.
  5. Добавить URL фронтенда (GitHub Pages) в `allow_origins` в `backend/app/main.py`, если он
     ещё не совпадает с уже прописанным `https://alextrav.github.io`.

## Стек

- **Модель:** TensorFlow/Keras, MobileNetV2 (transfer learning + fine-tuning), обучение в Google Colab.
- **Бэкенд:** Python, FastAPI, TensorFlow (инференс + Grad-CAM), pytest.
- **Фронтенд:** Vue 3, TypeScript, Tailwind CSS, Vite.
- **Инфраструктура:** Docker, docker-compose, Makefile, GitHub Actions (CI).
