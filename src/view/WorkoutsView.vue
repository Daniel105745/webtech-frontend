<template>
  <div v-if="activeWorkoutId" class="max-w-4xl mx-auto">
    <WorkoutPage :workout-id="activeWorkoutId" @back="activeWorkoutId = null" />
  </div>

  <div v-else>
    <header class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold mb-1">Deine Workouts</h1>
        <p class="text-gray-400 text-sm">Wähle ein Workout aus, um zu trainieren.</p>
      </div>
      <button @click="router.push('/plans')" class="btn btn-outline">Verwalten</button>
    </header>

    <div v-if="loading" class="text-center text-gray-500 py-10">Lade Workouts...</div>

    <div v-else-if="groupedWorkouts.length === 0" class="text-center py-10">
      <div class="card p-10 border-dashed border-2 border-gray-700 bg-transparent shadow-none inline-block">
        <p class="mb-4 text-gray-400">Noch keine Workouts gefunden.</p>
        <button @click="router.push('/plans')" class="btn btn-primary">Trainingsplan erstellen</button>
      </div>
    </div>

    <div v-else class="space-y-12">
      <div v-for="group in groupedWorkouts" :key="group.planName">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
          <span class="text-primary">📂</span> {{ group.planName }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="workout in group.workouts" :key="workout.id" class="card p-6 flex flex-col h-full group">
            <div class="flex-1">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors">{{ workout.name }}</h3>
                <span class="text-xs font-mono bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20">
                  {{ workout.dayOfWeek }}
                </span>
              </div>
              <p class="text-sm text-gray-400">{{ workout.muskelgruppe }}</p>
            </div>

            <div class="mt-6 pt-4 border-t border-white/10">
              <button @click="startSession(workout.id)" class="btn btn-primary w-full justify-center">
                <i class="bi bi-play-fill text-lg"></i> Starten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* Dein Script-Teil von vorhin war korrekt, den kannst du so lassen! */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WorkoutPage from '@/components/WorkoutPage.vue'
import { useAuthenticatedFetch } from '@/api'

const router = useRouter()
const { authFetch } = useAuthenticatedFetch()

interface Workout { id: number; name: string; dayOfWeek: string; muskelgruppe: string; }
const loading = ref(true)
const activeWorkoutId = ref<number | null>(null)
const groupedWorkouts = ref<{ planName: string; workouts: Workout[] }[]>([])
const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:8080' : 'https://webtech-backend-rqq7.onrender.com'

onMounted(loadAll)
function startSession(id: number) { activeWorkoutId.value = id }
async function loadAll() {
  loading.value = true
  try {
    const resPlans = await authFetch(`${API_BASE}/plans`)
    const plans = await resPlans.json()
    const groups = []
    for (const plan of plans) {
      const resW = await authFetch(`${API_BASE}/workouts/plan/${plan.id}`)
      if (resW.ok) {
        const workouts = await resW.json()
        if (workouts.length > 0) groups.push({ planName: plan.name, workouts })
      }
    }
    groupedWorkouts.value = groups
  } catch (e) { console.error(e) } finally { loading.value = false }
}
</script>