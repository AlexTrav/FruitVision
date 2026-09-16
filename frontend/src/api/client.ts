import type { ClassInfo, ModelInfo, PredictionResponse } from '../types'

// в проде пусто (запросы идут на тот же домен через nginx-прокси), в dev – адрес FastAPI
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// достаёт человекочитаемое сообщение об ошибке из ответа FastAPI (поле detail)
async function handleErrors(res: Response): Promise<Response> {
  if (!res.ok) {
    let detail = `Ошибка запроса (${res.status})`
    try {
      const data = await res.json()
      if (data?.detail) detail = data.detail
    } catch {
      // тело ответа не JSON – оставляем сообщение по умолчанию
    }
    throw new Error(detail)
  }
  return res
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE}/api/model-info`)
  await handleErrors(res)
  return res.json()
}

export async function fetchClasses(): Promise<ClassInfo[]> {
  const res = await fetch(`${API_BASE}/api/classes`)
  await handleErrors(res)
  return res.json()
}

// отправляет файл изображения на бэкенд и возвращает предсказанный класс
export async function predictImage(file: File): Promise<PredictionResponse> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    body: form,
  })
  await handleErrors(res)
  return res.json()
}

// запрашивает Grad-CAM тепловую карту (PNG), показывающую, на что "смотрела" модель
export async function explainImage(file: File): Promise<Blob> {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${API_BASE}/api/explain`, {
    method: 'POST',
    body: form,
  })
  await handleErrors(res)
  return res.blob()
}
