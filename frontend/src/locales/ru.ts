// исходные тексты сайта на русском – источник структуры для en.ts и kk.ts
const messages = {
  common: {
    requestError: 'Ошибка запроса ({status})',
  },
  nav: {
    home: 'Главная',
    classify: 'Классификатор',
    about: 'О проекте',
    openMenu: 'Открыть меню',
    themeToDark: 'Включить тёмную тему',
    themeToLight: 'Включить светлую тему',
  },
  home: {
    badge: 'Рубежное задание · Computer Vision',
    titleLine1: 'Узнай фрукт или овощ',
    titleLine2: 'по одной фотографии',
    subtitle:
      'Загрузи изображение – свёрточная нейросеть определит один из 36 видов фруктов и овощей и покажет, насколько она уверена в ответе.',
    ctaPrimary: 'Попробовать классификатор',
    ctaSecondary: 'Как это устроено',
    statClasses: 'классов фруктов и овощей',
    statAccuracy: 'точность на тестовой выборке',
    statModel: 'MobileNetV2 + transfer learning',
    howTitle: 'Как это работает',
    howSubtitle: 'Три простых шага от фотографии до ответа модели.',
    step1Title: 'Загрузи фото',
    step1Text: 'Перетащи изображение фрукта или овоща или выбери файл с устройства.',
    step2Title: 'Модель анализирует',
    step2Text: 'Свёрточная нейросеть обрабатывает изображение и считает вероятность каждого из 36 классов.',
    step3Title: 'Получи результат',
    step3Text: 'Видишь предсказанный класс, уверенность модели и ближайшие альтернативы.',
  },
  classifier: {
    title: 'Классификатор изображений',
    subtitle: 'Загрузи фото фрукта или овоща – модель определит, что на нём изображено.',
    cameraButton: 'Сделать фото с камеры',
    analyze: 'Определить',
    analyzing: 'Анализирую…',
    reset: 'Сбросить',
    selectImageError: 'Пожалуйста, выбери файл изображения (JPG, PNG или WebP)',
    predictFallbackError: 'Не удалось получить предсказание',
    explainFallbackError: 'Не удалось построить тепловую карту',
    previewAlt: 'Предпросмотр загруженного изображения',
    placeholder: 'Здесь появится результат после загрузки фото',
    gradcamButton: 'Показать, куда смотрела модель',
    gradcamBuilding: 'Строю тепловую карту…',
    gradcamDescription: 'Тепловая карта Grad-CAM – красным выделены области, повлиявшие на решение модели',
    historyTitle: 'История предсказаний',
    historyClear: 'Очистить',
  },
  resultCard: {
    warning:
      'Модель не уверена, что на фото один из 36 известных ей фруктов или овощей. Ниже показан самый близкий вариант, но доверять ему не стоит.',
    looksLike: 'Это похоже на',
    confidence: 'уверенности',
    otherOptions: 'Другие варианты',
  },
  uploadDropzone: {
    dragText: 'Перетащи фото сюда или нажми, чтобы выбрать',
    formatHint: 'JPG, PNG или WebP – до 8 МБ',
  },
  cameraCapture: {
    capture: 'Снять',
    cancel: 'Отмена',
    permissionError: 'Не удалось получить доступ к камере – проверь разрешения браузера',
  },
  footer: {
    tagline: 'FruitVision – учебный проект по компьютерному зрению.',
    datasetLabel: 'Датасет:',
  },
  about: {
    title: 'О проекте',
    subtitle: 'Как устроен пайплайн – от датасета до модели, которая отвечает на запросы этого сайта.',
    loadError: 'Не удалось загрузить данные о модели',
    architectureTitle: 'Архитектура модели',
    modelLabel: 'Модель',
    inputSizeLabel: 'Размер входа',
    classesLabel: 'Классов',
    accuracyLabel: 'Точность на test',
    comparisonTitle: 'Baseline CNN vs Transfer Learning',
    comparisonSubtitle: 'Точность на тестовой выборке',
    baselineLabel: 'CNN с нуля',
    transferLabel: 'MobileNetV2 (fine-tuned)',
    pipelineTitle: 'Пайплайн обучения',
    pipelineStep1Title: 'Сбор и очистка данных',
    pipelineStep1Text:
      'Датасет "Fruit and Vegetable Image Recognition" с Kaggle: 36 классов, уже разбит на train / validation / test.',
    pipelineStep2Title: 'Аугментация и нормализация',
    pipelineStep2Text:
      'Случайные отражения, повороты, зум и контраст – только на train. Пиксели приводятся к диапазону, ожидаемому MobileNetV2.',
    pipelineStep3Title: 'Балансировка классов',
    pipelineStep3Text:
      'Веса классов (class weights) считаются по частоте в train, чтобы редкие классы не игнорировались при обучении.',
    pipelineStep4Title: 'Обучение CNN',
    pipelineStep4Text:
      'Baseline-сеть с нуля для сравнения, затем transfer learning на MobileNetV2 с дообучением верхних слоёв (fine-tuning).',
    pipelineStep5Title: 'Валидация и подбор гиперпараметров',
    pipelineStep5Text:
      'Перебор learning rate и dropout по val_accuracy, финальная проверка на test: classification report и confusion matrix.',
    techStackTitle: 'Технологии проекта',
    techModel: 'Модель / ML',
    techBackend: 'Бэкенд',
    techFrontend: 'Фронтенд',
    techInfra: 'Инфраструктура',
    classesListTitle: '36 классов, которые узнаёт модель',
    authorLabel: 'Автор проекта',
  },
  apiErrors: {
    'Файл должен быть изображением': 'Файл должен быть изображением',
    'Файл слишком большой (максимум 8 МБ)': 'Файл слишком большой (максимум 8 МБ)',
    'Файл не является поддерживаемым изображением': 'Файл не является поддерживаемым изображением',
    'Слишком много запросов, попробуй чуть позже': 'Слишком много запросов, попробуй чуть позже',
  },
}

// тип-образец: en.ts и kk.ts типизированы этой же формой, чтобы забытый ключ был ошибкой компиляции
export type MessageSchema = typeof messages

export default messages
