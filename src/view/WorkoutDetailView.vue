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
            v-model.number="editingExercise.reps"
            type="number"
            min="1"
            placeholder="Wiederholungen"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            v-model.number="editingExercise.sets"
            type="number"
            min="1"
            placeholder="Sätze"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div class="flex justify-between items-center gap-3 mt-2">
          <div class="text-sm text-gray-500">Tipp: Drücke Enter zum Speichern oder Esc zum Schließen</div>
          <div class="flex justify-end gap-3">
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
  reps: number
  sets: number
  workoutId?: number
}

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://webtech-backend-rqq7.onrender.com";

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

watchEffect(() => {
  // focus first input when modal opens
  if (editingExercise.value) {
    setTimeout(() => {
      const el = document.querySelector('input[placeholder="Übungsname"]') as HTMLInputElement | null
      el?.focus()
    }, 50)
  }
})

// Globaler Keydown-Handler, registriert wenn Modal offen ist
function onGlobalKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal()
  }
}

watch(editingExercise, (val) => {
  if (val) window.addEventListener('keydown', onGlobalKey)
  else window.removeEventListener('keydown', onGlobalKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKey)
})

async function loadWorkout() {
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) return
    const res = await fetch(`${API_BASE}/workouts/${id}`)
    if (!res.ok) {
      console.error('Fehler beim Laden des Workouts', res.status)
      return
    }
    workout.value = await res.json()
  } catch (err) {
    console.error(err)
    // optional: router.back() oder Benutzer informieren
  }
}

async function loadExercises() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) return
    const res = await fetch(`${API_BASE}/exercises/workout/${id}`)
    if (!res.ok) {
      console.error('Fehler beim Laden der Übungen', res.status)
      return
    }
    exercises.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  const id = Number(route.params.id)
  editingExercise.value = {
    name: '',
    reps: 8,
    sets: 3,
    workoutId: Number.isNaN(id) ? undefined : id
  }
}

function editExercise(e: Exercise) {
  // clone to avoid mutating list directly
  editingExercise.value = { ...e }
}

function closeModal() {
  editingExercise.value = null
}

async function saveExercise() {
  if (!editingExercise.value) return

  const exercise = editingExercise.value

  // einfache Validierung
  if (!exercise.name || !exercise.reps || !exercise.sets) {
    alert('Bitte Alle Felder ausfüllen')
    return
  }

  const method = exercise.id ? 'PUT' : 'POST'
  const url = exercise.id
    ? `${API_BASE}/exercises/${exercise.id}`
    : (typeof exercise.workoutId !== 'number' || Number.isNaN(exercise.workoutId))
      ? null
      : `${API_BASE}/exercises/workout/${exercise.workoutId}`

  if (!url) {
    alert('Ungültige Zuordnung: workoutId fehlt. Bitte öffne das Formular vom Workout-Detail aus.')
    return
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: exercise.name,
        reps: Number(exercise.reps),
        sets: Number(exercise.sets)
      })
    })
    if (!res.ok) {
      console.error('Fehler beim Speichern', res.status)
      alert('Fehler beim Speichern')
      return
    }
    editingExercise.value = null
    await loadExercises()
  } catch (err) {
    console.error(err)
    alert('Fehler beim Speichern')
  }
}

async function deleteExercise(id: number) {
  if (!confirm('Übung wirklich löschen?')) return
  try {
    const res = await fetch(`${API_BASE}/exercises/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      console.error('Fehler beim Löschen', res.status)
      alert('Fehler beim Löschen')
      return
    }
    await loadExercises()
  } catch (err) {
    console.error(err)
    alert('Fehler beim Löschen')
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
