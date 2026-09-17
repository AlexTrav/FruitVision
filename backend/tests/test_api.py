from io import BytesIO

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.classes_ru import CLASS_NAME_RU
from app.gradcam import _make_heatmap
from app.inference import get_classifier
from app.main import app


# TestClient как контекстный менеджер запускает lifespan – модель грузится один раз на весь модуль
@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


# сервис должен отвечать "жив" сразу после старта
def test_health(client: TestClient):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# список классов: все 36, у каждого есть английское и русское имя
def test_list_classes(client: TestClient):
    resp = client.get("/api/classes")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 36
    assert all("en" in item and "ru" in item for item in data)


# метаданные модели совпадают с тем, что было сохранено при экспорте из Colab
def test_model_info(client: TestClient):
    resp = client.get("/api/model-info")
    assert resp.status_code == 200
    data = resp.json()
    assert data["num_classes"] == 36
    assert data["image_size"] == [224, 224]


# на валидном изображении модель должна вернуть класс и топ-3 варианта с вероятностями
def test_predict_valid_image(client: TestClient):
    image = Image.new("RGB", (300, 300), color=(255, 200, 0))
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)

    resp = client.post("/api/predict", files={"file": ("test.jpg", buffer, "image/jpeg")})
    assert resp.status_code == 200

    data = resp.json()
    assert 0.0 <= data["predicted"]["confidence"] <= 1.0
    assert len(data["top3"]) == 3


# файл с правильным content-type, но битым содержимым – ожидаем 400, а не 500
def test_predict_corrupted_image_returns_400(client: TestClient):
    resp = client.post(
        "/api/predict",
        files={"file": ("fake.jpg", b"this is not an image", "image/jpeg")},
    )
    assert resp.status_code == 400


# не-изображение отклоняется по content-type ещё до попытки декодирования
def test_predict_rejects_non_image_content_type(client: TestClient):
    resp = client.post(
        "/api/predict",
        files={"file": ("data.txt", b"hello", "text/plain")},
    )
    assert resp.status_code == 400


# Grad-CAM должен вернуть валидный PNG того же размера, что и вход модели
def test_explain_returns_png(client: TestClient):
    image = Image.new("RGB", (300, 300), color=(255, 200, 0))
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)

    resp = client.post("/api/explain", files={"file": ("test.jpg", buffer, "image/jpeg")})
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "image/png"

    heatmap = Image.open(BytesIO(resp.content))
    assert heatmap.size == (224, 224)


# Grad-CAM тоже должен отклонять битые файлы с кодом 400, а не падать с 500
def test_explain_corrupted_image_returns_400(client: TestClient):
    resp = client.post(
        "/api/explain",
        files={"file": ("fake.jpg", b"this is not an image", "image/jpeg")},
    )
    assert resp.status_code == 400


# без файла в форме FastAPI сам вернёт 422 ещё до нашего кода
def test_predict_missing_file_returns_422(client: TestClient):
    resp = client.post("/api/predict")
    assert resp.status_code == 422


# пустой файл (0 байт) с корректным content-type – PIL не сможет его открыть, ждём 400
def test_predict_empty_file_returns_400(client: TestClient):
    resp = client.post("/api/predict", files={"file": ("empty.jpg", b"", "image/jpeg")})
    assert resp.status_code == 400


# файл больше MAX_UPLOAD_SIZE_BYTES (8 МБ) отклоняется по размеру, до попытки декодирования
def test_predict_oversized_file_returns_400(client: TestClient):
    oversized = b"0" * (8 * 1024 * 1024 + 1)
    resp = client.post("/api/predict", files={"file": ("big.jpg", oversized, "image/jpeg")})
    assert resp.status_code == 400
    assert "большой" in resp.json()["detail"]


# GET там, где определён только POST, должен давать стандартный 405, а не 404/500
def test_predict_get_method_not_allowed(client: TestClient):
    resp = client.get("/api/predict")
    assert resp.status_code == 405


# страхуемся от рассинхронизации словаря переводов: если добавили новый класс модели,
# но забыли перевод – to_ru молча вернёт английское имя, а этот тест должен упасть
def test_all_classes_have_ru_translation(client: TestClient):
    classifier = get_classifier()
    for name in classifier.class_names:
        assert name in CLASS_NAME_RU, f"нет русского перевода для класса {name!r}"


# Grad-CAM строит тепловую карту для того же класса, который вернул бы обычный /predict –
# проверяем внутреннюю согласованность, а не просто "не упало"
def test_gradcam_agrees_with_predict_on_top_class(client: TestClient):
    image = Image.new("RGB", (300, 300), color=(255, 200, 0))
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    image_bytes = buffer.getvalue()

    classifier = get_classifier()
    predicted, _ = classifier.predict(image_bytes)

    resized = Image.open(BytesIO(image_bytes)).convert("RGB").resize(classifier.image_size)
    arr = np.asarray(resized, dtype=np.float32)
    batch = np.expand_dims(arr, axis=0)
    preprocessed = classifier._tf.keras.applications.mobilenet_v2.preprocess_input(batch)
    _, pred_index, _ = _make_heatmap(classifier, preprocessed)

    assert classifier.class_names[pred_index] == predicted.class_en


# rate limit считает запросы независимо от того, что внутри – невалидный файл быстро даёт 400,
# но всё равно расходует лимит; после превышения "20/minute" сервис должен ответить 429.
# Тесты идут последними в файле: предыдущие тесты уже частично израсходовали лимит того же клиента.
def test_predict_rate_limit_returns_429(client: TestClient):
    files = {"file": ("x.txt", b"data", "text/plain")}
    statuses = [client.post("/api/predict", files=files).status_code for _ in range(25)]
    assert 429 in statuses


def test_explain_rate_limit_returns_429(client: TestClient):
    files = {"file": ("x.txt", b"data", "text/plain")}
    statuses = [client.post("/api/explain", files=files).status_code for _ in range(15)]
    assert 429 in statuses
