<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CameraIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{ capture: [file: File]; close: [] }>()

const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref<string | null>(null)
let stream: MediaStream | null = null

// запрашиваем доступ к камере при открытии; на телефоне предпочитаем заднюю камеру
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    if (videoRef.value) videoRef.value.srcObject = stream
  } catch {
    error.value = 'Не удалось получить доступ к камере – проверь разрешения браузера'
  }
}

// останавливаем все треки, чтобы не оставлять индикатор камеры включённым
function stopCamera() {
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
}

// снимает текущий кадр с видео в canvas и превращает его в File для отправки на бэкенд
function capture() {
  const video = videoRef.value
  if (!video) return

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0)

  canvas.toBlob(
    (blob) => {
      if (!blob) return
      emit('capture', new File([blob], 'camera.jpg', { type: 'image/jpeg' }))
    },
    'image/jpeg',
    0.92,
  )
}

onMounted(startCamera)
onBeforeUnmount(stopCamera)
</script>

<template>
  <div class="flex flex-col items-center gap-4 rounded-3xl border border-stone-200 bg-white p-5">
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <video
      v-show="!error"
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="h-72 w-full rounded-2xl bg-stone-900 object-cover"
    />

    <div class="flex w-full gap-3">
      <button
        v-if="!error"
        class="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        @click="capture"
      >
        <CameraIcon class="h-4 w-4" />
        Снять
      </button>
      <button
        class="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-stone-400"
        @click="emit('close')"
      >
        Отмена
      </button>
    </div>
  </div>
</template>
