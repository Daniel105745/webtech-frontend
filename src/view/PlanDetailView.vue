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
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
  >
    <div
      class="bg-[#1e293b] text-gray-200 rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn border border-[#334155]"
    >
      <h2 class="text-xl font-semibold mb-4 text-white">
        {{ editingWorkout.id ? 'Workout bearbeiten' : 'Workout hinzufügen' }}
      </h2>

      <div class="space-y-4">
        <input
          v-model="editingWorkout.name"
          placeholder="Workout-Name"
          class="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        <input
          v-model="editingWorkout.dayOfWeek"
          placeholder="Tag der Woche"
          class="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        <input
          v-model="editingWorkout.muskelgruppe"
          placeholder="Muskelgruppe"
          class="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="editingWorkout = null"
          class="px-4 py-2 text-sm font-medium text-gray-200 bg-[#1e293b] hover:bg-[#334155] rounded-lg transition active:scale-95 border border-[#334155]"
        >
          Abbrechen
        </button>
        <button
          @click="saveWorkout"
          class="px-4 py-2 text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg shadow-md hover:shadow-lg transition active:scale-95"
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
  saetze?: number
  wiederholungen?: number
  gewicht?: number
}
interface Workout {
  id?: number
  name?: string
  dayOfWeek?: string
  muskelgruppe?: string
  trainingPlanId?: number
  exercises?: Exercise[]
}
interface Plan {
  id?: number
  name?: string
  dauer?: string
  intensitaet?: string
  zielmuskeln?: string
}

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://webtech-backend-rqq7.onrender.com"

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
  const id = Number(route.params.id)
  const res = await fetch(`${API_BASE}/plans`)
  const allPlans: Plan[] = await res.json()
  plan.value = allPlans.find((p) => p.id === id)
}

async function loadWorkouts() {
  loading.value = true
  const id = Number(route.params.id)
  const res = await fetch(`${API_BASE}/workouts/plan/${id}`)
  const workoutsRaw: Workout[] = await res.json()

  workouts.value = await Promise.all(
    workoutsRaw.map(async (w) => {
      const r = await fetch(`${API_BASE}/exercises/workout/${w.id}`)
      const exercises = r.ok ? await r.json() : []
      return { ...w, exercises }
    })
  )

  loading.value = false
}

function goBack() {
  router.push('/plans')
}

function openAddModal() {
  const id = Number(route.params.id)
  editingWorkout.value = {
    name: '',
    dayOfWeek: '',
    muskelgruppe: '',
    trainingPlanId: id
  }
}

function editWorkout(w: Workout) {
  editingWorkout.value = { ...w }
}

async function saveWorkout() {
  if (!editingWorkout.value) return
  const w = editingWorkout.value

  const method = w.id ? 'PUT' : 'POST'
  const url = w.id
    ? `${API_BASE}/workouts/${w.id}`
    : `${API_BASE}/workouts/plan/${w.trainingPlanId}`

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: w.name,
      muskelgruppe: w.muskelgruppe,
      dayOfWeek: w.dayOfWeek
    })
  })

  editingWorkout.value = null
  loadWorkouts()
}

async function deleteWorkout(id?: number) {
  if (!id) return
  await fetch(`${API_BASE}/workouts/${id}`, { method: 'DELETE' })
  loadWorkouts()
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
