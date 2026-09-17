import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse

from .classes_i18n import CLASS_NAME_KK, CLASS_NAME_RU
from .config import UNKNOWN_CONFIDENCE_THRESHOLD
from .ml.gradcam import generate_gradcam_png
from .ml.inference import InvalidImageError, get_classifier
from .schemas import ClassInfo, ModelInfo, PredictionResponse
from .security.dependencies import validated_image
from .security.rate_limit import limiter

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("fruitvision")


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

# ограничиваем частоту запросов per-IP – защита тяжёлых по CPU эндпоинтов от злоупотребления
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    logger.warning("rate limit exceeded: %s %s", request.url.path, exc.detail)
    return JSONResponse(status_code=429, content={"detail": "Слишком много запросов, попробуй чуть позже"})


# используется докер-контейнером и мониторингом для проверки, что сервис жив
@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# список всех классов модели с русским переводом – нужен странице "О проекте"
@app.get("/api/classes", response_model=list[ClassInfo])
def list_classes() -> list[ClassInfo]:
    classifier = get_classifier()
    return [
        ClassInfo(en=name, ru=CLASS_NAME_RU.get(name, name), kk=CLASS_NAME_KK.get(name, name))
        for name in classifier.class_names
    ]


# метаданные модели (архитектура, точность, размер входа)
@app.get("/api/model-info", response_model=ModelInfo)
def model_info() -> ModelInfo:
    return get_classifier().model_info


# основной эндпоинт: принимает изображение и возвращает предсказанный класс
@app.post("/api/predict", response_model=PredictionResponse)
@limiter.limit("20/minute")
async def predict(request: Request, file: UploadFile = File(...)) -> PredictionResponse:
    content = await validated_image(file)

    classifier = get_classifier()
    try:
        predicted, top3 = classifier.predict(content)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    is_recognized = predicted.confidence >= UNKNOWN_CONFIDENCE_THRESHOLD
    if is_recognized:
        logger.info("predict: %s (%.1f%%)", predicted.class_en, predicted.confidence * 100)
    else:
        logger.info(
            "predict: low confidence, likely not one of the 36 classes (top guess %s, %.1f%%)",
            predicted.class_en,
            predicted.confidence * 100,
        )
    return PredictionResponse(predicted=predicted, top3=top3, is_recognized=is_recognized)


# Grad-CAM: показывает PNG с тепловой картой той области фото, на которую "смотрела" модель
# лимит строже, чем у predict – здесь ещё считаются градиенты, эндпоинт заметно тяжелее по CPU
@app.post("/api/explain")
@limiter.limit("10/minute")
async def explain(request: Request, file: UploadFile = File(...)) -> Response:
    content = await validated_image(file)

    classifier = get_classifier()
    try:
        png_bytes = generate_gradcam_png(classifier, content)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    logger.info("explain: gradcam generated (%d bytes)", len(png_bytes))
    return Response(content=png_bytes, media_type="image/png")
