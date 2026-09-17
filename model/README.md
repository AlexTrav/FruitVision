# FruitVision – модель

## Обучение

`training/fruit_vegetable_classification.ipynb` – ноутбук для запуска в Google Colab
(GPU-рантайм). Обучает и сравнивает две модели на датасете
[Fruit and Vegetable Image Recognition](https://www.kaggle.com/datasets/kritikseth/fruit-and-vegetable-image-recognition)
(36 классов):

1. baseline CNN "с нуля";
2. MobileNetV2 (transfer learning + fine-tuning) – итоговая модель.

Ноутбук сам скачивает датасет через Kaggle API (нужен API-токен с kaggle.com/settings),
проводит аугментацию/нормализацию/балансировку классов, обучает обе модели, подбирает
гиперпараметры, строит classification report и confusion matrix, а в конце экспортирует
артефакты и скачивает их архивом (`fruit_veg_model_export.zip`).

## Артефакты (`artifacts/`)

Содержимое распакованного `fruit_veg_model_export.zip`, используется бэкендом напрямую:

- `fruit_veg_classifier.keras` – итоговая модель (MobileNetV2, fine-tuned);
- `class_names.json` – список из 36 классов в порядке выходов модели;
- `model_info.json` – размер входа, способ препроцессинга, точность на test.

## Результаты обучения

| Модель                        | Test accuracy |
|--------------------------------|---------------|
| Baseline CNN (с нуля)          | 68%           |
| MobileNetV2 (transfer + fine-tune) | 92%       |

## Обновление модели

Если модель переобучается заново – нужно повторить экспорт из ноутбука, распаковать
новый `fruit_veg_model_export.zip` в `model/artifacts/` (заменив старые файлы) и
пересобрать backend-образ (`make docker-build` в `backend/` или `docker compose build backend`
в корне) – файлы модели копируются в образ на этапе сборки. В проде достаточно закоммитить
новые файлы и запушить в `main` – Render сам пересоберёт и передеплоит бэкенд.
