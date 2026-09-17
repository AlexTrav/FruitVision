import type { MessageSchema } from './ru'

const messages: MessageSchema = {
  common: {
    requestError: 'Сұраныс қатесі ({status})',
  },
  nav: {
    home: 'Басты бет',
    classify: 'Классификатор',
    about: 'Жоба туралы',
    openMenu: 'Мәзірді ашу',
    themeToDark: 'Қараңғы тақырыпқа өту',
    themeToLight: 'Жарық тақырыпқа өту',
  },
  home: {
    badge: 'Аралық тапсырма · Computer Vision',
    titleLine1: 'Жеміс пен көкөністі тани біл',
    titleLine2: 'бір фотосурет арқылы',
    subtitle:
      'Суретті жүкте – конволюциялық нейрондық желі 36 жеміс пен көкөніс түрінің бірін анықтап, соған қаншалықты сенімді екенін көрсетеді.',
    ctaPrimary: 'Классификаторды байқап көру',
    ctaSecondary: 'Бұл қалай жұмыс істейді',
    statClasses: 'жеміс пен көкөніс класы',
    statAccuracy: 'тест жиынындағы дәлдік',
    statModel: 'MobileNetV2 + transfer learning',
    howTitle: 'Бұл қалай жұмыс істейді',
    howSubtitle: 'Фотосуреттен модель жауабына дейін үш қарапайым қадам.',
    step1Title: 'Фото жүкте',
    step1Text: 'Жеміс немесе көкөніс суретін тартып әкел немесе құрылғыдан файл таңда.',
    step2Title: 'Модель талдайды',
    step2Text: 'Конволюциялық желі суретті өңдеп, 36 класстың әрқайсысының ықтималдығын есептейді.',
    step3Title: 'Нәтиже ал',
    step3Text: 'Болжанған класты, модельдің сенімділігін және жақын баламаларды көресің.',
  },
  classifier: {
    title: 'Суреттерді классификациялау',
    subtitle: 'Жеміс немесе көкөніс фотосуретін жүкте – модель одан не екенін анықтайды.',
    cameraButton: 'Камерамен фото түсіру',
    analyze: 'Анықтау',
    analyzing: 'Талдап жатырмын…',
    reset: 'Тазарту',
    selectImageError: 'Сурет файлын таңда (JPG, PNG немесе WebP)',
    predictFallbackError: 'Болжам алу мүмкін болмады',
    explainFallbackError: 'Жылу картасын құру мүмкін болмады',
    previewAlt: 'Жүктелген суреттің алдын ала қарауы',
    placeholder: 'Фото жүктегеннен кейін нәтиже осында пайда болады',
    gradcamButton: 'Модель нені қарағанын көрсету',
    gradcamBuilding: 'Жылу картасын құрып жатырмын…',
    gradcamDescription: 'Grad-CAM жылу картасы – қызыл түспен модель шешіміне әсер еткен аймақтар белгіленген',
    historyTitle: 'Болжамдар тарихы',
    historyClear: 'Тазарту',
  },
  resultCard: {
    warning:
      'Модель бұл суреттің өзіне белгілі 36 жеміс-көкөністің біреуі екеніне сенімді емес. Төменде ең жақын нұсқа көрсетілген, бірақ оған сенбеген жөн.',
    looksLike: 'Бұл мынаған ұқсайды',
    confidence: 'сенімділік',
    otherOptions: 'Басқа нұсқалар',
  },
  uploadDropzone: {
    dragText: 'Фотоны осында тартып әкел немесе таңдау үшін бас',
    formatHint: 'JPG, PNG немесе WebP – 8 МБ дейін',
  },
  cameraCapture: {
    capture: 'Түсіру',
    cancel: 'Бас тарту',
    permissionError: 'Камераға қол жеткізу мүмкін болмады – браузер рұқсаттарын тексер',
  },
  footer: {
    tagline: 'FruitVision – компьютерлік көру бойынша оқу жобасы.',
    datasetLabel: 'Деректер жиыны:',
  },
  about: {
    title: 'Жоба туралы',
    subtitle: 'Пайплайн қалай құрылған – деректер жиынынан осы сайтқа жауап беретін модельге дейін.',
    loadError: 'Модель деректерін жүктеу мүмкін болмады',
    architectureTitle: 'Модель архитектурасы',
    modelLabel: 'Модель',
    inputSizeLabel: 'Кіріс өлшемі',
    classesLabel: 'Класстар саны',
    accuracyLabel: 'Test дәлдігі',
    comparisonTitle: 'Baseline CNN vs Transfer Learning',
    comparisonSubtitle: 'Тест жиынындағы дәлдік',
    baselineLabel: 'Нөлден бастап CNN',
    transferLabel: 'MobileNetV2 (fine-tuned)',
    pipelineTitle: 'Оқыту пайплайны',
    pipelineStep1Title: 'Деректерді жинау және тазалау',
    pipelineStep1Text:
      'Kaggle-дегі "Fruit and Vegetable Image Recognition" деректер жиыны: 36 класс, train / validation / test болып бөлінген.',
    pipelineStep2Title: 'Аугментация және нормализация',
    pipelineStep2Text:
      'Кездейсоқ айналдыру, бұру, масштабтау және контраст – тек train жиынында. Пикселдер MobileNetV2 күтетін диапазонға келтіріледі.',
    pipelineStep3Title: 'Класстарды теңгеру',
    pipelineStep3Text:
      'Класс салмақтары (class weights) train жиынындағы жиілік бойынша есептеледі, сирек класстар оқыту кезінде ескерусіз қалмауы үшін.',
    pipelineStep4Title: 'CNN оқыту',
    pipelineStep4Text:
      'Салыстыру үшін нөлден бастап baseline желі, содан кейін MobileNetV2 негізінде transfer learning және жоғарғы қабаттарды дообучение (fine-tuning).',
    pipelineStep5Title: 'Валидация және гиперпараметрлерді таңдау',
    pipelineStep5Text:
      'val_accuracy бойынша learning rate мен dropout іздеу, test жиынында соңғы тексеру: classification report және confusion matrix.',
    techStackTitle: 'Жобаның технологиялар стегі',
    techModel: 'Модель / ML',
    techBackend: 'Бэкенд',
    techFrontend: 'Фронтенд',
    techInfra: 'Инфрақұрылым',
    classesListTitle: 'Модель танитын 36 класс',
    authorLabel: 'Жоба авторы',
  },
  apiErrors: {
    'Файл должен быть изображением': 'Файл сурет болуы керек',
    'Файл слишком большой (максимум 8 МБ)': 'Файл тым үлкен (максимум 8 МБ)',
    'Файл не является поддерживаемым изображением': 'Файл қолдау көрсетілетін сурет форматында емес',
    'Слишком много запросов, попробуй чуть позже': 'Сұраныстар тым көп, сәл кейінірек қайталап көр',
  },
}

export default messages
