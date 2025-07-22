<template>
  <div class="p-4 max-w-md mx-auto space-y-4">
    <h1 class="text-2xl font-bold mb-4">Register Face</h1>

    <video ref="videoRef" autoplay playsinline class="w-full rounded shadow" />

    <input v-model="name" type="text" placeholder="Enter name..." class="w-full border p-2 rounded" />

    <button @click="captureAndSubmit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
      Register Face
    </button>

    <p v-if="status" class="text-sm text-green-600">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoRef = ref(null)
const name = ref('')
const status = ref('')

const API_URL = import.meta.env.VITE_API_URL

onMounted(() => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoRef.value.srcObject = stream
    })
    .catch(err => {
      alert('Failed to access camera: ' + err.message)
    })
})

const captureAndSubmit = async () => {
  if (!name.value) {
    alert('Please enter a name.')
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
    const data = await res.json()
    status.value = '✅ Registered successfully!'
    name.value = ''
  } catch (err) {
    alert('❌ ' + err.message)
  }
}
</script>

<style scoped>
video {
  aspect-ratio: 3/4;
  object-fit: cover;
}
</style>
