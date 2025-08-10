<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-semibold text-gray-900">Registered Faces</h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>

    <!-- No Faces -->
    <div v-else-if="faces.length === 0" class="text-center py-12">
      <div class="text-gray-500">No faces registered yet</div>
    </div>

    <!-- Face List -->
    <ul v-else class="space-y-3">
      <li v-for="face in faces" :key="face.id" class="card flex items-center justify-between p-4 group">
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <span class="text-lg font-medium text-gray-700">
              {{ face.name[0].toUpperCase() }}
            </span>
          </div>
          <span class="text-gray-900 font-medium">{{ face.name }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="viewFace(face.image_base)"
            class="btn-secondary text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:opacity-100 opacity-0 transition-opacity">
            View
          </button>
          <button @click="deleteFace(face.id)"
            class="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 group-hover:opacity-100 opacity-0 transition-opacity">
            Delete
          </button>
        </div>
      </li>
    </ul>

    <!-- Modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="closeModal">
        <div class="bg-white p-4 rounded-2xl shadow-lg max-w-sm w-full transform transition-all duration-200">
          <img :src="`data:image/jpeg;base64,${modalImage}`" alt="Face Preview"
            class="w-full rounded-xl object-cover" />
          <button @click="closeModal"
            class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const faces = ref([])
const loading = ref(true)

const showModal = ref(false)
const modalImage = ref(null)

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
    const res = await fetch(`${API_URL}/faces/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    faces.value = faces.value.filter(f => f.id !== id)
  } catch (err) {
    console.error('Error deleting face:', err)
  }
}

const viewFace = (embedding) => {
  modalImage.value = embedding
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalImage.value = null
}

onMounted(fetchFaces)
</script>
