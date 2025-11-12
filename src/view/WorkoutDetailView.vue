<template>
  <WorkoutDetail
    :workout="workout"
    :exercises="exercises"
    :loading="loading"
    @add-exercise="openAddModal"
    @edit-exercise="editExercise"
    @delete-exercise="deleteExercise"
    @back="router.back"
  />

  <!-- Modal -->
  <div
    v-if="editingExercise"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-900">
        {{ editingExercise.id ? 'Übung bearbeiten' : 'Übung hinzufügen' }}
      </h2>

      <form @submit.prevent="saveExercise" class="space-y-4">
        <input
          v-model.trim="editingExercise.name"
          placeholder="Übungsname"
          required
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div class="grid grid-cols-2 gap-3">
          <input
            v-model.number="editingExercise.wiederholungen"
            type="number"
            min="1"
            placeholder="Wiederholungen"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            v-model.number="editingExercise.saetze"
            type="number"
            min="1"
            placeholder="Sätze"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <input
          v-model.number="editingExercise.gewicht"
          type="number"
          min="0"
          placeholder="Gewicht (kg)"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkoutDetail from '@/components/WorkoutDetail.vue'

interface Workout {
  id?: number
  name?: string
  muskelgruppe?: string
  dayOfWeek?: string
}

interface Exercise {
  id?: number
  name: string
  saetze: number
  wiederholungen: number
  gewicht?: number
  workoutId?: number
}

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080'
    : 'https://webtech-backend-rqq7.onrender.com'

const route = useRoute()
const router = useRouter()

const workout = ref<Workout | null>(null)
const exercises = ref<Exercise[]>([])
const loading = ref(true)
const editingExercise = ref<Exercise | null>(null)

onMounted(() => {
  loadWorkout()
  loadExercises()
})

// Modal Handling
watchEffect(() => {
  if (editingExercise.value) {
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[placeholder="Übungsname"]')?.focus()
    }, 50)
  }
})

function onGlobalKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

watch(editingExercise, (val) => {
  if (val) window.addEventListener('keydown', onGlobalKey)
  else window.removeEventListener('keydown', onGlobalKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKey)
})

// Daten laden
async function loadWorkout() {
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) return
    const res = await fetch(`${API_BASE}/workouts/${id}`)
    if (res.ok) workout.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

async function loadExercises() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) return
    const res = await fetch(`${API_BASE}/exercises/workout/${id}`)
    if (res.ok) exercises.value = await res.json()
  } finally {
    loading.value = false
  }
}

// Modal öffnen/bearbeiten/schließen
function openAddModal() {
  const id = Number(route.params.id)
  editingExercise.value = {
    name: '',
    wiederholungen: 8,
    saetze: 3,
    gewicht: 0,
    workoutId: Number.isNaN(id) ? undefined : id,
  }
}

function editExercise(e: Exercise) {
  editingExercise.value = { ...e }
}

function closeModal() {
  editingExercise.value = null
}

// Speichern
async function saveExercise() {
  if (!editingExercise.value) return
  const e = editingExercise.value

  if (!e.name || !e.saetze || !e.wiederholungen) {
    alert('Bitte alle Felder ausfüllen.')
    return
  }

  const method = e.id ? 'PUT' : 'POST'
  const url = e.id
    ? `${API_BASE}/exercises/${e.id}`
    : `${API_BASE}/exercises/workout/${e.workoutId}`

  const body = JSON.stringify({
    name: e.name,
    saetze: e.saetze,
    wiederholungen: e.wiederholungen,
    gewicht: e.gewicht ?? 0,
  })

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!res.ok) {
      const text = await res.text()
      alert(`Fehler beim Speichern: ${res.status} - ${text}`)
      return
    }
    editingExercise.value = null
    await loadExercises()
  } catch (err) {
    console.error(err)
    alert('Fehler beim Speichern.')
  }
}

// Löschen
async function deleteExercise(id: number) {
  if (!confirm('Übung wirklich löschen?')) return
  try {
    const res = await fetch(`${API_BASE}/exercises/${id}`, { method: 'DELETE' })
    if (res.ok) await loadExercises()
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
