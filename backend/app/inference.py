import io
import json

import numpy as np
from PIL import Image, UnidentifiedImageError

from .classes_i18n import to_kk, to_ru
from .config import CLASS_NAMES_PATH, MODEL_INFO_PATH, MODEL_PATH
from .schemas import ClassPrediction, ModelInfo


# отдельный тип ошибки, чтобы main.py мог поймать именно "плохую картинку" и вернуть 400
class InvalidImageError(ValueError):
    pass


class FruitVegClassifier:
    """Обёртка над обученной Keras-моделью: загрузка, препроцессинг, инференс."""

    def __init__(self) -> None:
        import tensorflow as tf  # импорт отложен, чтобы FastAPI поднимался быстрее при --reload

        self._tf = tf
        self.model = tf.keras.models.load_model(MODEL_PATH)

        with open(CLASS_NAMES_PATH, encoding="utf-8") as f:
            self.class_names: list[str] = json.load(f)

        with open(MODEL_INFO_PATH, encoding="utf-8") as f:
            info = json.load(f)
        self.image_size = tuple(info["image_size"])
        self.model_info = ModelInfo(
            image_size=info["image_size"],
            preprocessing=info["preprocessing"],
            num_classes=info["num_classes"],
            test_accuracy=info["test_accuracy"],
            architecture="MobileNetV2 (transfer learning + fine-tuning)",
        )

    # декодирует байты файла в массив пикселей нужного размера
    def _load_image(self, image_bytes: bytes) -> np.ndarray:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img.load()
        except UnidentifiedImageError as exc:
            raise InvalidImageError("Файл не является поддерживаемым изображением") from exc

        img = img.convert("RGB").resize(self.image_size)
        return np.asarray(img, dtype=np.float32)

    # возвращает лучшее предсказание и топ-3 варианта с вероятностями
    def predict(self, image_bytes: bytes) -> tuple[ClassPrediction, list[ClassPrediction]]:
        arr = self._load_image(image_bytes)
        batch = np.expand_dims(arr, axis=0)

        probs = self.model.predict(batch, verbose=0)[0]
        order = np.argsort(probs)[::-1]  # индексы классов по убыванию вероятности

        def make_prediction(idx: int) -> ClassPrediction:
            name = self.class_names[idx]
            return ClassPrediction(
                class_en=name, class_ru=to_ru(name), class_kk=to_kk(name), confidence=float(probs[idx])
            )

        top3 = [make_prediction(i) for i in order[:3]]
        return top3[0], top3


# модель грузится один раз и переиспользуется между запросами (синглтон)
_classifier: FruitVegClassifier | None = None


def get_classifier() -> FruitVegClassifier:
    global _classifier
    if _classifier is None:
        _classifier = FruitVegClassifier()
    return _classifier
