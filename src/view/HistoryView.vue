<template>
  <div class="animate-fadeIn">
    <header class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-3xl font-bold mb-1">Verlauf</h1>
        <p class="text-gray-400 text-sm">
          Deine Trainingshistorie im Detail.
        </p>
      </div>
      <div class="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-right hidden sm:block">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Gesamt</p>
        <p class="text-xl font-bold text-white">{{ sessions.length }} <span class="text-sm font-normal text-gray-500">Sessions</span></p>
      </div>
    </header>

    <div v-if="loading" class="text-center py-20 text-gray-500">
      <div class="loading-spinner mx-auto mb-4"></div>
      Lade Historie...
    </div>

    <div v-else-if="sessions.length === 0" class="card p-10 text-center border-dashed border-2 border-white/10 bg-transparent shadow-none">
      <div class="text-5xl mb-4 opacity-30">📜</div>
      <p class="text-gray-400 mb-4">Noch keine Einträge im Verlauf.</p>
      <button @click="router.push('/workouts')" class="btn btn-primary">
        Erstes Training starten
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="card overflow-hidden transition-all duration-300"
        :class="expandedId === session.id ? 'border-blue-500/30 bg-blue-500/5' : 'hover:border-white/20'"
      >
        <div
          @click="toggleSession(session)"
          class="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
        >
          <div class="flex gap-4 items-center min-w-[180px]">
            <div
              class="h-14 w-14 rounded-xl flex flex-col items-center justify-center border transition-colors"
              :class="expandedId === session.id ? 'bg-blue-500 text-white border-blue-400' : 'bg-white/5 text-gray-400 border-white/10'"
            >
              <span class="text-xs font-bold uppercase">{{ getShortMonth(session.startTime) }}</span>
              <span class="text-xl font-bold leading-none">{{ getDay(session.startTime) }}</span>
            </div>
            <div>
              <p class="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                Workout
              </p>
              <p class="text-xs text-gray-500 flex items-center gap-1">
                <i class="bi bi-clock"></i> {{ formatTime(session.startTime) }}
                <span class="mx-1">•</span>
                <span>{{ session.minutes }} Min</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <span class="block text-xs text-gray-500 uppercase">Kalorien</span>
              <span class="font-mono font-bold text-gray-200">{{ session.calories }} <span class="text-xs font-normal text-gray-500">kcal</span></span>
            </div>
            <div class="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 bg-white/5"
                 :class="expandedId === session.id ? 'rotate-180 bg-blue-500/20 text-blue-400' : 'text-gray-500'">
              <i class="bi bi-chevron-down"></i>
            </div>
          </div>
        </div>

        <div v-if="expandedId === session.id" class="border-t border-white/10 bg-black/20 animate-fadeIn">

          <div v-if="detailsLoading" class="p-6 text-center text-gray-500">
            <div class="loading-spinner w-6 h-6 mx-auto mb-2 border-2"></div>
            Lade Details...
          </div>

          <div v-else class="p-4 sm:p-6">
            <h3 class="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">Durchgeführte Übungen</h3>

            <div class="grid gap-2">
              <div class="grid grid-cols-12 text-xs text-gray-500 px-3 pb-2 border-b border-white/5 font-mono">
                <div class="col-span-6">NAME</div>
                <div class="col-span-2 text-center">SÄTZE</div>
                <div class="col-span-2 text-center">REPS</div>
                <div class="col-span-2 text-right">KG</div>
              </div>

              <div
                v-for="ex in sessionDetails"
                :key="ex.id"
                class="grid grid-cols-12 items-center px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                <div class="col-span-6 font-medium text-white truncate pr-2">{{ ex.name }}</div>
                <div class="col-span-2 text-center text-gray-400">{{ ex.saetze }}</div>
                <div class="col-span-2 text-center text-gray-400">{{ ex.wiederholungen }}</div>
                <div class="col-span-2 text-right font-bold text-blue-400 font-mono">{{ ex.gewicht }}</div>
              </div>
            </div>

            <div v-if="sessionDetails.length === 0" class="text-center py-4 text-gray-500 text-sm italic">
              Keine Details zu diesem Workout gespeichert.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticatedFetch } from '@/api'

interface Session {
  id: number
  startTime: string
  minutes: number
  calories: number
}

interface ExerciseDetail {
  id: number
  name: string
  saetze: number
  wiederholungen: number
  gewicht: number
}

const sessions = ref<Session[]>([])
const sessionDetails = ref<ExerciseDetail[]>([]) // Speichert Details der aktuell offenen Session
const loading = ref(true)
const detailsLoading = ref(false)
const expandedId = ref<number | null>(null)

const router = useRouter()
const { authFetch } = useAuthenticatedFetch()

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:8080'
  : 'https://webtech-backend-rqq7.onrender.com'

onMounted(loadHistory)

async function loadHistory() {
  loading.value = true
  try {
    const res = await authFetch(`${API_BASE}/api/sessions`)
    if (res.ok) {
      const data = await res.json()
      sessions.value = data.sort((a: Session, b: Session) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      )
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function toggleSession(session: Session) {
  // Wenn schon offen, einfach schließen
  if (expandedId.value === session.id) {
    expandedId.value = null
    return
  }

  // Öffnen & Details laden
  expandedId.value = session.id
  detailsLoading.value = true
  sessionDetails.value = []

  try {
    // ⚠️ HIER WICHTIG:
    // Wir nehmen an, dass das Backend einen Endpoint hat, um die Übungen EINER Session zu holen.
    // Wenn das Backend das nicht hat, zeigt es einfach "Keine Details" an.
    // Ein typischer REST-Pfad wäre: /api/sessions/{id}/exercises oder /api/sessions/{id}

    // Versuch 1: Details direkt laden
    const res = await authFetch(`${API_BASE}/api/sessions/${session.id}/exercises`)

    if (res.ok) {
      sessionDetails.value = await res.json()
    } else {
      // Fallback: Vielleicht sind die Daten schon im 'session' Objekt?
      // Das hängt von deinem Backend ab. Wir lassen es vorerst leer, wenn der Call fehlschlägt.
      console.warn('Konnte Details nicht laden.')
    }
  } catch (e) {
    console.error(e)
  } finally {
    detailsLoading.value = false
  }
}

// Helper Formatierung
function getShortMonth(isoStr: string) {
  return new Date(isoStr).toLocaleString('de-DE', { month: 'short' }).replace('.', '')
}
function getDay(isoStr: string) {
  return new Date(isoStr).getDate()
}
function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.loading-spinner {
  width: 30px; height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>