// общий стиль карточки в зависимости от того, распознала ли модель фото как один из 36 классов
// (используется в ResultCard.vue и истории предсказаний в ClassifierView.vue)
export function recognitionCardClass(isRecognized: boolean): string {
  return isRecognized
    ? 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
    : 'border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30'
}
