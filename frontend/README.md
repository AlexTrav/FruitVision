# FruitVision – фронтенд

Vue 3 + TypeScript + Tailwind CSS. Многостраничный сайт (Vite + vue-router) с загрузкой
изображения и получением предсказания от бэкенда.

## Страницы

- `/` – главная (лендинг с описанием проекта);
- `/classify` – классификатор: загрузка фото (drag-and-drop или камера устройства),
  результат предсказания (с предупреждением, если это не похоже ни на один из 36 классов),
  Grad-CAM тепловая карта, локальная история последних предсказаний;
- `/about` – о проекте: архитектура модели, метрики, пайплайн обучения, стек технологий, список классов, автор.

## Тёмная тема

Переключатель в шапке (`src/composables/useTheme.ts`) хранит выбор в `localStorage`
(`fruitvision-theme`), по умолчанию – системная тема (`prefers-color-scheme`). Tailwind CSS 4
по умолчанию переключает `dark:` по системной теме, а не по классу, поэтому в `style.css`
явно объявлен `@custom-variant dark (&:where(.dark, .dark *))` – `dark:`-классы срабатывают
от класса `.dark` на `<html>`, который выставляет composable. Инлайн-скрипт в `index.html`
применяет класс до загрузки CSS/JS, чтобы не было мигания темы при открытии страницы.

## Мультиязычность

Интерфейс на трёх языках – `ru` (по умолчанию), `kk`, `en` – через `vue-i18n` (`src/i18n.ts`,
словари в `src/locales/`). Выбор языка хранится в `localStorage` (`fruitvision-locale`), при
первом визите определяется по языку браузера, иначе – русский. Переключатель – в шапке рядом
с темой (`LanguageSwitcher.vue`).

Названия классов на всех трёх языках возвращает бэкенд (`en`/`ru`/`kk` в `/api/classes` и
`/api/predict`), UI-тексты (кнопки, заголовки и т.п.) – только фронтенд. Сообщения об ошибках
от бэкенда переводятся на фронтенде по словарю (`src/api/translateError.ts`) – бэкенд сам всегда
отвечает на русском, незнакомые сообщения остаются как есть.

**Важно:** казахские названия классов и тексты подобраны по стандартной сельскохозяйственной
лексике без сверки с носителем языка – перед публичным/учебным использованием стоит попросить
кого-то, кто хорошо знает қазақ тілі, проверить `backend/app/classes_i18n.py` (словарь
`CLASS_NAME_KK`) и `frontend/src/locales/kk.ts`.

## Тесты

```bash
npm test   # vitest run
```

25 тестов (Vitest + Vue Test Utils, `jsdom`): composables (`useTheme`, `useLocale`,
`usePredictionHistory` – включая проверку, что история остаётся общим состоянием между
несколькими вызовами, а не независимыми копиями), утилиты (`pickByLocale`, `recognitionCardClass`,
`translateApiError`) и рендер `ResultCard.vue` (уверенное предсказание vs предупреждение о низкой
уверенности). Прогоняются в CI (`.github/workflows/ci.yml`) перед сборкой.

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
- иконки – [Heroicons](https://heroicons.com) (MIT)
- vue-i18n (мультиязычность)
- Vitest + Vue Test Utils (тесты)

## Сторонние ассеты

Логотип и favicon – иконка авокадо "Avocado / Flat" из
[Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT License,
Copyright (c) Microsoft Corporation), встроена как inline SVG в
`src/components/icons/LogoMark.vue` и `public/favicon.svg`.
