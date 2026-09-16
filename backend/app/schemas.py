from pydantic import BaseModel


# краткая информация о классе на двух языках (для /api/classes)
class ClassInfo(BaseModel):
    en: str
    ru: str


# одно предсказание модели с указанием уверенности
class ClassPrediction(BaseModel):
    class_en: str
    class_ru: str
    confidence: float


# ответ эндпоинта /api/predict: лучший класс + топ-3 варианта
class PredictionResponse(BaseModel):
    predicted: ClassPrediction
    top3: list[ClassPrediction]


# метаданные модели для страницы "О проекте" на фронтенде
class ModelInfo(BaseModel):
    image_size: list[int]
    preprocessing: str
    num_classes: int
    test_accuracy: float
    architecture: str
