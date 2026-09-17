# FruitVision

[![CI](https://github.com/AlexTrav/FruitVision/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexTrav/FruitVision/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Рубежное задание по курсу «Искусственный интеллект и машинное обучение»:
система распознавания изображений (Computer Vision) – классификация фруктов и овощей
по фотографии. Полный пайплайн: обучение CNN → REST API → веб-интерфейс.

Автор: **Алексей Нерезов**.

**Живой деплой:** сайт – https://alextrav.github.io/FruitVision/, API – https://fruitvision-backend.onrender.com

Условие задания: [ТЗ.md](ТЗ.md). Краткое описание решения: [SUMMARY.md](SUMMARY.md).

## Возможности

- классификация изображения по 36 классам фруктов и овощей (MobileNetV2, 92% test accuracy);
- загрузка фото с диска (drag-and-drop) или прямо с камеры устройства;
- Grad-CAM – тепловая карта, показывающая, на какую область фото "смотрела" модель;
- локальная история последних предсказаний (хранится в браузере);
- страница "О проекте" с метриками, пайплайном обучения и стеком технологий;
- rate limiting на тяжёлых по CPU эндпоинтах, автотесты бэкенда, CI/CD.

## Структура проекта

```
FruitVision/
  model/                     – обучение модели (Colab-ноутбук) и её артефакты
  backend/                   – FastAPI-сервис с инференсом, Grad-CAM и rate limiting
  frontend/                  – Vue 3 + TypeScript + Tailwind сайт
  data_test/                 – тестовые фото для ручной проверки классификатора
  .github/workflows/         – CI (тесты + сборка) и деплой фронтенда на GitHub Pages
  docker-compose.yml, Makefile, Dockerfile – запуск всего стека одной командой
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

## Продакшн (живой деплой, бесплатно)

- **Сайт:** https://alextrav.github.io/FruitVision/ – GitHub Pages, деплоится автоматически
  (`.github/workflows/deploy-pages.yml`) при каждом push в `main`, затрагивающем `frontend/`.
- **API:** https://fruitvision-backend.onrender.com – Render.com, free-тариф (Docker,
  сборка из корневого `Dockerfile`). Автодеплоится при push в `main` (Render сам следит за веткой).
  Из-за free-тарифа сервис засыпает после ~15 минут простоя – первый запрос после паузы может
  идти 30–60 секунд.

Примечание: изначально планировался Hugging Face Spaces, но там Docker/Gradio Spaces с недавних
пор требуют платный PRO-план – бесплатны только Static Spaces (без бэкенда). Поэтому бэкенд
уехал на Render, а корневой `Dockerfile` пригодился и для него (Render тоже по умолчанию ищет
Dockerfile в корне репозитория).

## Стек

- **Модель:** TensorFlow/Keras, MobileNetV2 (transfer learning + fine-tuning), обучение в Google Colab.
- **Бэкенд:** Python, FastAPI, TensorFlow (инференс + Grad-CAM), slowapi (rate limiting), pytest.
- **Фронтенд:** Vue 3, TypeScript, Tailwind CSS, Vite.
- **Инфраструктура:** Docker, docker-compose, Makefile, GitHub Actions (CI/CD).

## Лицензия

[MIT](LICENSE) – используй, форкай, изучай свободно.
