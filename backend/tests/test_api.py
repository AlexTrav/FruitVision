from io import BytesIO

import pytest
from fastapi.testclient import TestClient
from PIL import Image

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
