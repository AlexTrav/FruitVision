# FruitVision – бэкенд

FastAPI-сервис, который загружает обученную Keras-модель и по изображению возвращает
предсказанный класс фрукта/овоща (36 классов).

## Эндпоинты

| Метод | Путь               | Описание                                             |
|-------|--------------------|-------------------------------------------------------|
| GET   | `/api/health`      | проверка живости сервиса                              |
| GET   | `/api/classes`     | список всех классов (en + ru)                         |
| GET   | `/api/model-info`  | метаданные модели (архитектура, точность, размер входа)|
| POST  | `/api/predict`     | принимает файл `file` (multipart/form-data), возвращает предсказание |
| POST  | `/api/explain`     | Grad-CAM: тот же файл, но в ответ PNG с тепловой картой значимых областей |

Модель и файлы `class_names.json` / `model_info.json` берутся из `../model/artifacts`
(путь можно переопределить переменной окружения `MODEL_DIR` – используется в Docker).

## Rate limiting

`/api/predict` и `/api/explain` ограничены per-IP (`slowapi`, in-memory, см. `app/rate_limit.py`):
20 и 10 запросов в минуту соответственно (`/api/explain` дороже по CPU — считает градиенты).
При превышении — `429` с `{"detail": "..."}`. IP берётся из `X-Forwarded-For` (мы за прокси
Render/Cloudflare в проде), с фолбэком на прямой адрес клиента.

## Запуск локально (без Docker)

```bash
make install   # создаёт .venv и ставит зависимости (requirements-dev.txt)
make run       # запускает uvicorn с автоперезагрузкой на http://localhost:8000
```

Требования: Python 3.11+ (в Windows TensorFlow нативно доступен максимум под 2.18 –
поэтому проект использует `tensorflow==2.18.0`, совместимый с моделью из Colab).

## Тесты

```bash
make test
```

Тесты (`tests/test_api.py`) поднимают приложение через `TestClient` и проверяют
все эндпоинты, включая обработку невалидного изображения и корректность Grad-CAM PNG.
Прогоняются автоматически в CI (`.github/workflows/ci.yml`) на каждый push и pull request.

## Запуск в Docker

```bash
make docker-build   # docker build с контекстом из корня проекта (нужен доступ к model/artifacts)
make docker-run     # контейнер на http://localhost:8000
```

Для запуска вместе с фронтендом используйте `docker compose` из корня проекта.

## Структура

```
backend/
  app/
    main.py         – FastAPI-приложение и эндпоинты
    inference.py     – загрузка модели и инференс
    gradcam.py         – Grad-CAM: тепловая карта значимых областей изображения
    rate_limit.py        – per-IP rate limiting (slowapi)
    schemas.py        – Pydantic-схемы запросов/ответов
    classes_ru.py      – перевод названий классов на русский
    config.py           – пути и константы (учитывает MODEL_DIR)
  tests/
    test_api.py           – автотесты эндпоинтов
```
