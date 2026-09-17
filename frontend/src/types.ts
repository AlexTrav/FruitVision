// краткая информация о классе на трёх языках (ответ /api/classes)
export interface ClassInfo {
  en: string
  ru: string
  kk: string
}

// одно предсказание модели с уверенностью от 0 до 1
export interface ClassPrediction {
  class_en: string
  class_ru: string
  class_kk: string
  confidence: number
}

// ответ эндпоинта /api/predict
export interface PredictionResponse {
  predicted: ClassPrediction
  top3: ClassPrediction[]
  is_recognized: boolean // false – уверенность ниже порога, скорее всего это не один из 36 классов
}

// метаданные модели для страницы "О проекте"
export interface ModelInfo {
  image_size: [number, number]
  preprocessing: string
  num_classes: number
  test_accuracy: number
  architecture: string
}
