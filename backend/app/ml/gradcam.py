import io

import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

from .inference import FruitVegClassifier, InvalidImageError


# находит в модели вложенный MobileNetV2 и слои "головы" по типу – не зависит от конкретных имён
def _locate_layers(model):
    base_model = None
    gap_layer = None
    dropout_layer = None
    dense_layer = None

    for layer in model.layers:
        cls_name = type(layer).__name__
        if cls_name == "Functional":
            base_model = layer
        elif cls_name == "GlobalAveragePooling2D":
            gap_layer = layer
        elif cls_name == "Dropout":
            dropout_layer = layer
        elif cls_name == "Dense":
            dense_layer = layer

    if not all([base_model, gap_layer, dropout_layer, dense_layer]):
        raise RuntimeError("Не удалось найти ожидаемые слои модели для Grad-CAM")

    return base_model, gap_layer, dropout_layer, dense_layer


# считает тепловую карту Grad-CAM: градиент выбранного класса по последней свёрточной карте признаков
def _make_heatmap(classifier: FruitVegClassifier, preprocessed: np.ndarray) -> tuple[np.ndarray, int, float]:
    tf = classifier._tf
    base_model, gap_layer, dropout_layer, dense_layer = _locate_layers(classifier.model)

    with tf.GradientTape() as tape:
        conv_output = base_model(preprocessed, training=False)
        tape.watch(conv_output)
        x = gap_layer(conv_output)
        x = dropout_layer(x, training=False)
        predictions = dense_layer(x)
        pred_index = int(tf.argmax(predictions[0]))
        class_score = predictions[:, pred_index]

    grads = tape.gradient(class_score, conv_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))  # важность каждого канала признаков

    conv_output = conv_output[0]
    heatmap = conv_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)  # ReLU + нормализация в [0, 1]

    return heatmap.numpy(), pred_index, float(predictions[0][pred_index])


# накладывает тепловую карту (сине-красный градиент) на исходное изображение
def _overlay_heatmap(original: Image.Image, heatmap: np.ndarray, alpha: float = 0.45) -> Image.Image:
    heatmap_img = Image.fromarray(np.uint8(heatmap * 255)).resize(original.size, Image.BICUBIC)
    heatmap_color = ImageOps.colorize(heatmap_img, black="#1d4ed8", white="#dc2626").convert("RGB")
    return Image.blend(original.convert("RGB"), heatmap_color, alpha)


# основная функция: байты изображения -> PNG с наложенной тепловой картой Grad-CAM
def generate_gradcam_png(classifier: FruitVegClassifier, image_bytes: bytes) -> bytes:
    try:
        original = Image.open(io.BytesIO(image_bytes))
        original.load()
    except UnidentifiedImageError as exc:
        raise InvalidImageError("Файл не является поддерживаемым изображением") from exc

    original = original.convert("RGB")
    resized = original.resize(classifier.image_size)

    arr = np.asarray(resized, dtype=np.float32)
    batch = np.expand_dims(arr, axis=0)
    preprocessed = classifier._tf.keras.applications.mobilenet_v2.preprocess_input(batch)

    heatmap, _, _ = _make_heatmap(classifier, preprocessed)
    overlay = _overlay_heatmap(resized, heatmap)

    buffer = io.BytesIO()
    overlay.save(buffer, format="PNG")
    return buffer.getvalue()
