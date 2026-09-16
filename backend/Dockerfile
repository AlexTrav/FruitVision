# образ собирается с контекстом из корня проекта (нужен доступ к model/artifacts)
FROM python:3.11-slim

WORKDIR /app

# libgl1 нужен Pillow/TensorFlow для работы с изображениями
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY model/artifacts ./model/artifacts

# путь к модели внутри контейнера отличается от локального – задаём его явно
ENV MODEL_DIR=/app/model/artifacts

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
