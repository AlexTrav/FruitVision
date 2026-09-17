import type { MessageSchema } from './ru'

const messages: MessageSchema = {
  common: {
    requestError: 'Request error ({status})',
  },
  nav: {
    home: 'Home',
    classify: 'Classifier',
    about: 'About',
    openMenu: 'Open menu',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
  },
  home: {
    badge: 'Coursework · Computer Vision',
    titleLine1: 'Identify a fruit or vegetable',
    titleLine2: 'from a single photo',
    subtitle:
      'Upload an image – a convolutional neural network will identify one of 36 fruit and vegetable types and show how confident it is.',
    ctaPrimary: 'Try the classifier',
    ctaSecondary: 'How it works',
    statClasses: 'classes of fruits and vegetables',
    statAccuracy: 'accuracy on the test set',
    statModel: 'MobileNetV2 + transfer learning',
    howTitle: 'How it works',
    howSubtitle: 'Three simple steps from a photo to the model’s answer.',
    step1Title: 'Upload a photo',
    step1Text: 'Drag and drop a fruit or vegetable image, or choose a file from your device.',
    step2Title: 'The model analyzes it',
    step2Text: 'The convolutional network processes the image and scores the probability of each of the 36 classes.',
    step3Title: 'Get the result',
    step3Text: 'See the predicted class, the model’s confidence, and the closest alternatives.',
  },
  classifier: {
    title: 'Image classifier',
    subtitle: 'Upload a photo of a fruit or vegetable – the model will identify what is on it.',
    cameraButton: 'Take a photo with the camera',
    analyze: 'Classify',
    analyzing: 'Analyzing…',
    reset: 'Reset',
    selectImageError: 'Please choose an image file (JPG, PNG, or WebP)',
    predictFallbackError: 'Could not get a prediction',
    explainFallbackError: 'Could not build the heatmap',
    previewAlt: 'Preview of the uploaded image',
    placeholder: 'The result will appear here after you upload a photo',
    gradcamButton: 'Show what the model looked at',
    gradcamBuilding: 'Building the heatmap…',
    gradcamDescription: 'Grad-CAM heatmap – the red areas influenced the model’s decision the most',
    historyTitle: 'Prediction history',
    historyClear: 'Clear',
  },
  resultCard: {
    warning:
      'The model is not confident this photo shows one of its 36 known fruits or vegetables. The closest match is shown below, but it should not be trusted.',
    looksLike: 'This looks like',
    confidence: 'confidence',
    otherOptions: 'Other options',
  },
  uploadDropzone: {
    dragText: 'Drag a photo here or click to choose one',
    formatHint: 'JPG, PNG, or WebP – up to 8 MB',
  },
  cameraCapture: {
    capture: 'Capture',
    cancel: 'Cancel',
    permissionError: 'Could not access the camera – check your browser permissions',
  },
  footer: {
    tagline: 'FruitVision – a computer vision coursework project.',
    datasetLabel: 'Dataset:',
  },
  about: {
    title: 'About the project',
    subtitle: 'How the pipeline works – from the dataset to the model behind this site.',
    loadError: 'Could not load the model data',
    architectureTitle: 'Model architecture',
    modelLabel: 'Model',
    inputSizeLabel: 'Input size',
    classesLabel: 'Classes',
    accuracyLabel: 'Test accuracy',
    comparisonTitle: 'Baseline CNN vs Transfer Learning',
    comparisonSubtitle: 'Accuracy on the test set',
    baselineLabel: 'CNN from scratch',
    transferLabel: 'MobileNetV2 (fine-tuned)',
    pipelineTitle: 'Training pipeline',
    pipelineStep1Title: 'Data collection and cleaning',
    pipelineStep1Text:
      'The "Fruit and Vegetable Image Recognition" dataset from Kaggle: 36 classes, already split into train / validation / test.',
    pipelineStep2Title: 'Augmentation and normalization',
    pipelineStep2Text:
      'Random flips, rotations, zoom, and contrast – applied only to the training set. Pixels are scaled to the range MobileNetV2 expects.',
    pipelineStep3Title: 'Class balancing',
    pipelineStep3Text:
      'Class weights are computed from the training-set frequency so rare classes are not ignored during training.',
    pipelineStep4Title: 'Training the CNN',
    pipelineStep4Text:
      'A baseline network trained from scratch for comparison, then transfer learning on MobileNetV2 with fine-tuning of the top layers.',
    pipelineStep5Title: 'Validation and hyperparameter tuning',
    pipelineStep5Text:
      'Learning rate and dropout search based on val_accuracy, final check on the test set: classification report and confusion matrix.',
    techStackTitle: 'Project tech stack',
    techModel: 'Model / ML',
    techBackend: 'Backend',
    techFrontend: 'Frontend',
    techInfra: 'Infrastructure',
    classesListTitle: '36 classes the model recognizes',
    authorLabel: 'Project author',
  },
  apiErrors: {
    'Файл должен быть изображением': 'The file must be an image',
    'Файл слишком большой (максимум 8 МБ)': 'The file is too large (8 MB max)',
    'Файл не является поддерживаемым изображением': 'The file is not a supported image',
    'Слишком много запросов, попробуй чуть позже': 'Too many requests, please try again shortly',
  },
}

export default messages
