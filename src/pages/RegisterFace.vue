<template>
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-gray-900">Register Face</h1>
      <p class="mt-2 text-gray-600">Add a new face to the recognition system</p>
    </div>

    <div class="card p-4 mb-6">
      <video ref="videoRef" autoplay playsinline class="w-full rounded-lg shadow-inner bg-gray-100" />
    </div>

    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input id="name" v-model="name" type="text" placeholder="Enter person's name" class="input-field" />
      </div>

      <button @click="captureAndSubmit" class="btn-primary w-full flex justify-center items-center gap-2"
        :disabled="!name">
        <span>Register Face</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <div v-if="status" class="mt-4 p-4 rounded-md"
        :class="status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoRef = ref(null)
const name = ref('')
const status = ref(null)

const API_URL = import.meta.env.VITE_API_URL

onMounted(() => {
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
})

const captureAndSubmit = async () => {
  if (!name.value) {
    status.value = {
      type: 'error',
      message: 'Please enter a name'
    }
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoRef.value, 0, 0)

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'))

  const formData = new FormData()
  formData.append('file', blob, 'face.jpg')
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
  aspect-ratio: 3/4;
  object-fit: cover;
}

.input-field:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>