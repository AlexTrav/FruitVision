import os
from pathlib import Path

# корень проекта: backend/app/config.py -> app -> backend -> project
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# путь к артефактам модели можно переопределить через переменную окружения (используется в Docker)
DEFAULT_MODEL_DIR = PROJECT_ROOT / "model" / "artifacts"
MODEL_DIR = Path(os.environ.get("MODEL_DIR", str(DEFAULT_MODEL_DIR)))

MODEL_PATH = MODEL_DIR / "fruit_veg_classifier.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"
MODEL_INFO_PATH = MODEL_DIR / "model_info.json"

MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024  # ограничение размера загружаемого файла – 8 МБ
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}

# ниже этой уверенности предсказание считаем ненадёжным – скорее всего, на фото не один из 36 классов.
# подобрано эмпирически: реальные фото фруктов/овощей дают 0.86-0.9995, посторонние объекты
# (машина, стул, ноутбук, кот, случайный шум) – 0.12-0.59, порог 0.7 разделяет их с запасом
UNKNOWN_CONFIDENCE_THRESHOLD = 0.7
