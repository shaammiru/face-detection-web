<template>
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-gray-900">Register Face</h1>
      <p class="mt-2 text-gray-600">Add a new face to the recognition system</p>
    </div>

    <div class="card p-4 mb-6">
      <!-- Video when capturing -->
      <video v-if="!previewImage" ref="videoRef" autoplay playsinline
        class="w-full rounded-lg shadow-inner bg-gray-100" />

      <!-- Image preview after capture -->
      <img v-else :src="previewImage" alt="Captured face" class="w-full rounded-lg shadow-inner bg-gray-100" />
    </div>

    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input id="name" v-model="name" type="text" placeholder="Enter person's name" class="input-field" />
      </div>

      <!-- Show capture button if no preview -->
      <button v-if="!previewImage" @click="capturePreview"
        class="btn-primary w-full flex justify-center items-center gap-2" :disabled="!name">
        <span>Capture Face</span>
      </button>

      <!-- Show confirm / retake buttons if preview is shown -->
      <div v-else class="flex gap-2">
        <button @click="submitRegistration" class="btn-primary flex-1">Confirm</button>
        <button @click="retake" class="btn-secondary flex-1">Retake</button>
      </div>

      <div v-if="status" class="mt-4 p-4 rounded-md"
        :class="status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ status.message }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const name = ref('')
const status = ref(null)
const previewImage = ref(null)
let stream = null
let capturedBlob = null

const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.value.srcObject = stream
  } catch (err) {
    console.error('Failed to access camera:', err)
  }
})

onBeforeUnmount(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoRef.value.srcObject = stream
    })
    .catch(err => {
      status.value = {
        type: 'error',
        message: 'Failed to access camera: ' + err.message
      }
    })
}

// Capture image to preview
const capturePreview = async () => {
  const video = videoRef.value
  const size = Math.min(video.videoWidth, video.videoHeight)
  const startX = (video.videoWidth - size) / 2
  const startY = (video.videoHeight - size) / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size)

  capturedBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'))
  previewImage.value = URL.createObjectURL(capturedBlob)
}

// Retake photo
const retake = () => {
  previewImage.value = null
  capturedBlob = null
  startCamera()
}

// Submit captured image
const submitRegistration = async () => {
  if (!name.value || !capturedBlob) {
    status.value = { type: 'error', message: 'Please enter a name and capture a face first' }
    return
  }

  const formData = new FormData()
  formData.append('file', capturedBlob, 'face.jpg')
  formData.append('name', name.value)

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error('Registration failed')

    status.value = {
      type: 'success',
      message: '✨ Face registered successfully!'
    }
    name.value = ''
    previewImage.value = null
    capturedBlob = null
    startCamera()
  } catch (err) {
    status.value = {
      type: 'error',
      message: '❌ ' + err.message
    }
  }
}
</script>

<style scoped>
@reference 'tailwindcss';

video {
  aspect-ratio: 1/1;
  object-fit: cover;
  transform: scaleX(-1);
}

.input-field:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>