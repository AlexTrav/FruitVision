from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .classes_ru import CLASS_NAME_RU
from .config import MAX_UPLOAD_SIZE_BYTES
from .gradcam import generate_gradcam_png
from .inference import InvalidImageError, get_classifier
from .schemas import ClassInfo, ModelInfo, PredictionResponse


# прогреваем модель один раз при старте приложения, а не на первый запрос пользователя
@asynccontextmanager
async def lifespan(app: FastAPI):
    get_classifier()
    yield


app = FastAPI(title="Fruit & Vegetable Classifier API", lifespan=lifespan)

# разрешаем запросы с dev-сервера Vite, из контейнера фронтенда и с задеплоенного GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://alextrav.github.io",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# используется докер-контейнером и мониторингом для проверки, что сервис жив
@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# список всех классов модели с русским переводом – нужен странице "О проекте"
@app.get("/api/classes", response_model=list[ClassInfo])
def list_classes() -> list[ClassInfo]:
    classifier = get_classifier()
    return [ClassInfo(en=name, ru=CLASS_NAME_RU.get(name, name)) for name in classifier.class_names]


# метаданные модели (архитектура, точность, размер входа)
@app.get("/api/model-info", response_model=ModelInfo)
def model_info() -> ModelInfo:
    return get_classifier().model_info


# общая проверка content-type и размера файла для /api/predict и /api/explain
async def _read_validated_image(file: UploadFile) -> bytes:
    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Файл должен быть изображением")

    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Файл слишком большой (максимум 8 МБ)")

    return content


# основной эндпоинт: принимает изображение и возвращает предсказанный класс
@app.post("/api/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)) -> PredictionResponse:
    content = await _read_validated_image(file)

    classifier = get_classifier()
    try:
        predicted, top3 = classifier.predict(content)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return PredictionResponse(predicted=predicted, top3=top3)


# Grad-CAM: показывает PNG с тепловой картой той области фото, на которую "смотрела" модель
@app.post("/api/explain")
async def explain(file: UploadFile = File(...)) -> Response:
    content = await _read_validated_image(file)

    classifier = get_classifier()
    try:
        png_bytes = generate_gradcam_png(classifier, content)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return Response(content=png_bytes, media_type="image/png")
