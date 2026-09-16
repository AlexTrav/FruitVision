import { ref } from 'vue'

export interface HistoryItem {
  thumbnail: string // маленький JPEG в виде data URL
  classRu: string
  classEn: string
  confidence: number
  timestamp: number
}

const STORAGE_KEY = 'fruitvision-history'
const MAX_ITEMS = 8

// localStorage может бросить исключение (приватный режим и т.п.) – не даём этому сломать страницу
function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryItem[]) : []
  } catch {
    return []
  }
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // не критично – история просто не сохранится между сессиями
  }
}

// история хранится только в браузере пользователя, на сервер не отправляется
export function usePredictionHistory() {
  const history = ref<HistoryItem[]>(loadHistory())

  function addEntry(entry: HistoryItem) {
    history.value = [entry, ...history.value].slice(0, MAX_ITEMS)
    saveHistory(history.value)
  }

  function clearHistory() {
    history.value = []
    saveHistory([])
  }

  return { history, addEntry, clearHistory }
}
