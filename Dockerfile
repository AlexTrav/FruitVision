# Dockerfile для Hugging Face Spaces (SDK: Docker) — HF ожидает Dockerfile в корне репозитория.
# Идентичен backend/Dockerfile, только контекст сборки уже и так корень репо (см. .github metadata в README.md).
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

ENV MODEL_DIR=/app/model/artifacts

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
