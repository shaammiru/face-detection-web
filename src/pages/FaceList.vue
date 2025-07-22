<template>
  <div class="p-4 max-w-2xl mx-auto space-y-4">
    <h1 class="text-2xl font-bold mb-4">Registered Faces</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="faces.length === 0">No faces found.</div>

    <ul class="space-y-2">
      <li v-for="face in faces" :key="face.id"
        class="flex items-center justify-between border p-3 rounded shadow-sm hover:bg-gray-50">
        <span>{{ face.name }}</span>
        <button @click="deleteFace(face.id)" class="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const faces = ref([])
const loading = ref(true)

const API_URL = import.meta.env.VITE_API_URL

const fetchFaces = async () => {
  try {
    const res = await fetch(`${API_URL}/faces`)
    const data = await res.json()
    console.log('Fetched faces:', data)
    faces.value = data.faces || []
  } catch (err) {
    alert('Error fetching faces: ' + err.message)
  } finally {
    loading.value = false
  }
}

const deleteFace = async (id) => {
  if (!confirm('Are you sure you want to delete this face?')) return

  try {
    const res = await fetch(`${API_URL}/faces/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Delete failed')

    faces.value = faces.value.filter(f => f.id !== id)
  } catch (err) {
    alert('❌ ' + err.message)
  }
}

onMounted(fetchFaces)
</script>
