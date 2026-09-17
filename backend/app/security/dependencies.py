from fastapi import HTTPException, UploadFile

from ..config import MAX_UPLOAD_SIZE_BYTES


# общая проверка content-type и размера файла для /api/predict и /api/explain.
# ВАЖНО: вызывается вручную внутри тела эндпоинта, а не через Depends() – если вынести
# в Depends(), FastAPI резолвит зависимости до вызова самой функции-эндпоинта, а slowapi
# считает лимит именно на уровне вызова этой функции. При ошибке валидации Depends()
# эндпоинт вообще не вызывается, поэтому запрос не попадёт в счётчик rate limit.
async def validated_image(file: UploadFile) -> bytes:
    if file.content_type is None or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Файл должен быть изображением")

    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Файл слишком большой (максимум 8 МБ)")

    return content
