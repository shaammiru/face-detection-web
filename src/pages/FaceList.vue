<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-semibold text-gray-900">Registered Faces</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>

    <div v-else-if="faces.length === 0" class="text-center py-12">
      <div class="text-gray-500">No faces registered yet</div>
    </div>

    <ul v-else class="space-y-3">
      <li v-for="face in faces" :key="face.id" class="card flex items-center justify-between p-4 group">
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <span class="text-lg font-medium text-gray-700">{{ face.name[0].toUpperCase() }}</span>
          </div>
          <span class="text-gray-900 font-medium">{{ face.name }}</span>
        </div>
        <button @click="deleteFace(face.id)"
          class="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 group-hover:opacity-100 opacity-0 transition-opacity">
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
    faces.value = data.faces || []
  } catch (err) {
    console.error('Error fetching faces:', err)
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
    console.error('Error deleting face:', err)
  }
}

onMounted(fetchFaces)
</script>