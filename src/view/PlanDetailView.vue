<template>
  <PlanDetail
    :plan="plan"
    :workouts="workouts"
    :loading="loading"
    @add-workout="openAddModal"
    @edit-workout="editWorkout"
    @delete-workout="(id) => deleteWorkout(id)"
    @back="goBack"
  />

  <!-- Workout Modal -->
  <div
    v-if="editingWorkout"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn border border-gray-200"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-900">
        {{ editingWorkout.id ? 'Workout bearbeiten' : 'Workout hinzufügen' }}
      </h2>

      <div class="space-y-4">
        <input
          v-model="editingWorkout.name"
          placeholder="Workout-Name"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          v-model="editingWorkout.dayOfWeek"
          placeholder="Tag der Woche"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          v-model="editingWorkout.muskelgruppe"
          placeholder="Muskelgruppe"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="editingWorkout = null"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
        >
          Abbrechen
        </button>
        <button
          @click="saveWorkout"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlanDetail from '@/components/PlanDetail.vue'

interface Exercise {
  id?: number
  name: string
  reps?: number
  sets?: number
  workoutId?: number
}

interface Workout {
  id?: number
  name?: string
  dayOfWeek?: string
  muskelgruppe?: string
  trainingPlanId?: number
  exercises?: Exercise[]
}

interface Plan extends Record<string, unknown> {
  id?: number
  name?: string
  dauer?: string
  intensitaet?: string
  zielmuskeln?: string
}

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080'
    : 'https://webtech-backend.onrender.com'

const route = useRoute()
const router = useRouter()

const plan = ref<Plan | undefined>(undefined)
const workouts = ref<Workout[]>([])
const loading = ref(true)
const editingWorkout = ref<Workout | null>(null)

onMounted(() => {
  loadPlan()
  loadWorkouts()
})

async function loadPlan() {
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) return

    const res = await fetch(`${API_BASE}/plans`)
    if (!res.ok) {
      console.error('Fehler beim Laden der Pläne', res.status)
      return
    }

    const allPlans: Plan[] = await res.json()
    plan.value = allPlans.find((p: Plan) => p.id === id) || undefined
  } catch (err) {
    console.error(err)
  }
}

async function loadWorkouts() {
  loading.value = true
  try {
    const planId = Number(route.params.id)
    if (Number.isNaN(planId)) return

    const res = await fetch(`${API_BASE}/workouts/plan/${planId}`)
    if (!res.ok) {
      console.error('Fehler beim Laden der Workouts', res.status)
      return
    }

    const baseWorkouts: Workout[] = await res.json()

    // Direkt zu workouts.value zuweisen und vorher ID prüfen
    workouts.value = await Promise.all(
      baseWorkouts.map(async (w: Workout) => {
        const wid = Number(w.id)
        if (Number.isNaN(wid)) {
          return { ...w, exercises: [] }
        }
        const exRes = await fetch(`${API_BASE}/exercises/workout/${wid}`)
        const exercises: Exercise[] = exRes.ok ? await exRes.json() : []
        return { ...w, exercises }
      })
    )
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  const id = Number(route.params.id)
  editingWorkout.value = {
    name: '',
    dayOfWeek: '',
    muskelgruppe: '',
    trainingPlanId: Number.isNaN(id) ? undefined : id
  }
}

function editWorkout(w: Workout) {
  editingWorkout.value = { ...w }
}

async function saveWorkout() {
  if (!editingWorkout.value) return
  const workout = editingWorkout.value
  const method = workout.id ? 'PUT' : 'POST'
  const url = workout.id
    ? `${API_BASE}/workouts/${workout.id}`
    : `${API_BASE}/workouts/plan/${workout.trainingPlanId}`

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workout.name,
        muskelgruppe: workout.muskelgruppe,
        dayOfWeek: workout.dayOfWeek
      })
    })

    if (!res.ok) {
      const msg = await res.text()
      alert(`Fehler: ${res.status} – ${msg}`)
      return
    }

    const savedWorkout = await res.json()
    editingWorkout.value = null
    await loadWorkouts()

    if (method === 'POST') {
      router.push(`/workouts/${savedWorkout.id}`)
    }
  } catch (err) {
    console.error('Fehler beim Speichern:', err)
  }
}

async function deleteWorkout(id?: number) {
  if (typeof id !== 'number') return
  if (!confirm('Workout wirklich löschen?')) return
  try {
    const res = await fetch(`${API_BASE}/workouts/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      console.error('Fehler beim Löschen', res.status)
      alert('Fehler beim Löschen')
      return
    }
    await loadWorkouts()
  } catch (err) {
    console.error(err)
    alert('Fehler beim Löschen')
  }
}

function goBack() {
  router.push('/plans')
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
