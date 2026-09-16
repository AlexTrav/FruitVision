# Краткое summary проекта

## Задача

По [ТЗ](ТЗ.md) нужно было собрать систему компьютерного зрения: датасет → CNN → веб-интерфейс
с загрузкой изображения и выдачей результата.

## Тема и датасет

Выбрана классификация **фруктов и овощей**. Изначально рассматривался датасет
[LVIS Fruits and Vegetables](https://www.kaggle.com/datasets/henningheyen/lvis-fruits-and-vegetables-dataset),
но он оказался размечен в формате YOLO для **детекции** (bounding box'ы, несколько объектов
на фото), что не подходило под задачу классификации из ТЗ. Вместо конвертации датасета выбран
готовый классификационный датасет –
[Fruit and Vegetable Image Recognition](https://www.kaggle.com/datasets/kritikseth/fruit-and-vegetable-image-recognition)
(36 классов, уже разбит на train/validation/test, папка = класс).

## Модель

Обучение – в `model/training/fruit_vegetable_classification.ipynb` (Google Colab, GPU):

- аугментация (flip/rotation/zoom/contrast), нормализация, балансировка классов через `class_weight`;
- baseline CNN "с нуля" – **68%** accuracy на test;
- MobileNetV2 (transfer learning + fine-tuning верхних слоёв) – **92%** accuracy на test;
- подбор гиперпараметров (learning rate × dropout) по val_accuracy;
- итоговая проверка: classification report + confusion matrix по всем 36 классам;
- экспорт модели (`.keras`) и метаданных (`class_names.json`, `model_info.json`) в `model/artifacts/`.

## Бэкенд

FastAPI-сервис (`backend/`) грузит модель один раз при старте и отдаёт REST API:
`/api/predict` (инференс по загруженному файлу), `/api/explain` (Grad-CAM), `/api/classes`,
`/api/model-info`, `/api/health`. Покрыт автотестами (`pytest` + `TestClient`), которые
прогоняются в CI на каждый push/PR.

**Grad-CAM** (`app/gradcam.py`): по градиенту предсказанного класса относительно последней
свёрточной карты признаков MobileNetV2 строится тепловая карта и накладывается на исходное
фото – визуально показывает, какая область изображения повлияла на решение модели.

Технический нюанс: TensorFlow для нативного Windows доступен максимум в версии 2.18,
тогда как Colab обучал модель на 2.20 – решено через изолированный venv с TF 2.18 +
отдельно обновлённым пакетом `keras`, что оказалось полностью совместимо с сохранённой моделью.

## Фронтенд

Vue 3 + TypeScript + Tailwind CSS (Vite), три страницы: главная, классификатор
(drag-and-drop загрузка фото **или снимок с камеры устройства**, результат с уверенностью
модели и топ-3 альтернативами, кнопка Grad-CAM тепловой карты, локальная история последних
предсказаний в `localStorage`), страница о проекте (архитектура, метрики, пайплайн, стек
технологий, список классов, автор – данные о модели берутся напрямую с бэкенда). Анимации на
CSS-переходах и `IntersectionObserver` (директива `v-reveal`).

## Инфраструктура

Docker + docker-compose: backend и frontend (nginx с проксированием `/api/*` на бэкенд)
поднимаются одной командой `make up` из корня, с healthcheck-ом бэкенда перед стартом
фронтенда. Makefile есть в каждой папке (локальный запуск/тесты/docker) и один общий в корне.
CI на GitHub Actions (`.github/workflows/ci.yml`) на каждый push/PR гоняет backend-тесты
и собирает frontend (type-check + build).
