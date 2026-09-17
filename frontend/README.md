# FruitVision – фронтенд

Vue 3 + TypeScript + Tailwind CSS. Многостраничный сайт (Vite + vue-router) с загрузкой
изображения и получением предсказания от бэкенда.

## Страницы

- `/` – главная (лендинг с описанием проекта);
- `/classify` – классификатор: загрузка фото (drag-and-drop или камера устройства),
  результат предсказания, Grad-CAM тепловая карта, локальная история последних предсказаний;
- `/about` – о проекте: архитектура модели, метрики, пайплайн обучения, стек технологий, список классов, автор.

## Запуск локально (без Docker)

```bash
make install   # npm ci
make dev       # запускает Vite dev-сервер на http://localhost:5173
```

Требуется запущенный бэкенд на `http://localhost:8000` (см. `../backend/README.md`) –
адрес берётся из `.env.development`.

## Production-сборка

```bash
make build     # сборка в dist/
make preview   # локальный просмотр production-сборки
```

В production API-запросы уходят на относительный путь `/api/...` (см. `.env.production`)
и проксируются nginx-конфигом (`nginx.conf`) на контейнер бэкенда – см. корневой `docker-compose.yml`.

## Запуск в Docker

```bash
make docker-build   # собрать образ (multi-stage: Node сборка -> nginx)
make docker-run     # поднять контейнер на http://localhost:8080
```

Для запуска вместе с бэкендом используйте `docker compose` из корня проекта (см. корневой README.md).

## Деплой на GitHub Pages

`.github/workflows/deploy-pages.yml` собирает сайт с `--base=/<repo-name>/` и адресом бэкенда
на Render (задан прямо в workflow), затем публикует на GitHub Pages при каждом push в `main`,
затрагивающем `frontend/`. Живой адрес и детали – в корневом README.md.

## Стек

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- vue-router 4
- Tailwind CSS 4 (через `@tailwindcss/vite`)
- Vite 8
