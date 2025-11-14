<template>

  <!-- Einheitlicher Seiten-Wrapper -->


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
    <div v-if="editingExercise" class="modal-overlay">
      <div class="modal w-full max-w-md mx-4">

        <h2 class="text-xl font-semibold mb-4">
          {{ editingExercise.id ? 'Übung bearbeiten' : 'Übung hinzufügen' }}
        </h2>

        <form @submit.prevent="saveExercise" class="space-y-4">

          <input
            v-model.trim="editingExercise.name"
            placeholder="Übungsname"
            required
            class="w-full border border-gray-border rounded-lg px-3 py-2
                   focus:ring-2 focus:ring-primary outline-none"
          />

          <div class="grid grid-cols-2 gap-3">
            <input
              v-model.number="editingExercise.wiederholungen"
              type="number"
              min="1"
              placeholder="Wiederholungen"
              required
              class="w-full border border-gray-border rounded-lg px-3 py-2
                     focus:ring-2 focus:ring-primary outline-none"
            />
            <input
              v-model.number="editingExercise.saetze"
              type="number"
              min="1"
              placeholder="Sätze"
              required
              class="w-full border border-gray-border rounded-lg px-3 py-2
                     focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <input
            v-model.number="editingExercise.gewicht"
            type="number"
            min="0"
            placeholder="Gewicht (kg)"
            class="w-full border border-gray-border rounded-lg px-3 py-2
                   focus:ring-2 focus:ring-primary outline-none"
          />

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="btn btn-outline">
              Abbrechen
            </button>

            <button type="submit" class="btn btn-primary">
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

// Fokus im Modal
watchEffect(() => {
  if (editingExercise.value) {
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[placeholder="Übungsname"]')?.focus()
    }, 50)
  }
})

// Escape-Handling
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
  const id = Number(route.params.id)
  if (Number.isNaN(id)) return

  const res = await fetch(`${API_BASE}/workouts/${id}`)
  if (res.ok) workout.value = await res.json()
}

async function loadExercises() {
  loading.value = true
  const id = Number(route.params.id)
  if (Number.isNaN(id)) return

  const res = await fetch(`${API_BASE}/exercises/workout/${id}`)
  if (res.ok) exercises.value = await res.json()

  loading.value = false
}

// Modal-Funktionen
function openAddModal() {
  const id = Number(route.params.id)
  editingExercise.value = {
    name: '',
    wiederholungen: 8,
    saetze: 3,
    gewicht: 0,
    workoutId: id,
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

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    alert('Fehler beim Speichern.')
    return
  }

  editingExercise.value = null
  await loadExercises()
}

// Löschen
async function deleteExercise(id: number) {
  if (!confirm('Übung wirklich löschen?')) return

  const res = await fetch(`${API_BASE}/exercises/${id}`, { method: 'DELETE' })
  if (res.ok) await loadExercises()
}
</script>
