<template>
  <div class="animate-fadeIn">

    <button
      v-if="!sessionActive || sessionFinished"
      @click="$emit('back')"
      class="btn btn-outline mb-6 pl-2 pr-4 border-0 hover:bg-transparent hover:text-white text-gray-400 group"
    >
      <i class="bi bi-arrow-left text-lg group-hover:-translate-x-1 transition-transform"></i> Zurück
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-500">
      <div class="loading-spinner mb-4"></div>
      <p>Lade Workout...</p>
    </div>

    <div v-else-if="workout" class="max-w-3xl mx-auto">

      <div
        class="card p-8 text-center mb-8 relative overflow-hidden transition-all duration-500"
        :class="{ 'active-session-panel': sessionActive }"
      >
        <div v-if="!sessionActive" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70"></div>

        <h2 class="text-3xl font-bold mb-2 text-white">{{ workout.name }}</h2>
        <div class="text-sm text-gray-400 uppercase tracking-wider font-medium mb-8 flex justify-center gap-3">
          <span class="flex items-center gap-1"><i class="bi bi-calendar4-week"></i> {{ workout.dayOfWeek }}</span>
          <span>•</span>
          <span class="flex items-center gap-1"><i class="bi bi-body-text"></i> {{ workout.muskelgruppe }}</span>
        </div>

        <div class="my-8 relative z-10">
          <div class="text-7xl sm:text-8xl font-mono font-black tracking-widest leading-none transition-all"
               :class="sessionActive ? 'timer-active' : 'text-gray-600'">
            {{ formatTime(timerSeconds) }}
          </div>
          <p class="text-xs uppercase tracking-[0.2em] text-gray-500 mt-4 font-bold animate-pulse" v-if="sessionActive">
            Training läuft
          </p>
          <p class="text-xs uppercase tracking-[0.2em] text-gray-500 mt-4 font-bold" v-else>
            Dauer
          </p>
        </div>

        <div class="flex justify-center gap-4 relative z-10">
          <button
            v-if="!sessionActive && !sessionFinished"
            @click="startSession"
            class="btn btn-primary text-lg px-10 py-3 rounded-full shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all"
          >
            <i class="bi bi-play-circle-fill text-xl"></i> Starten
          </button>

          <button
            v-if="sessionActive"
            @click="openFinishModal"
            class="btn btn-danger text-lg px-10 py-3 rounded-full shadow-xl hover:shadow-red-500/20 animate-pulse-slow"
          >
            <i class="bi bi-stop-fill text-xl"></i> Beenden
          </button>
        </div>

        <div v-if="sessionFinished" class="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 animate-slideUp">
          <p class="text-gray-300 mb-1 flex justify-center gap-2 items-center">
            <i class="bi bi-trophy-fill text-yellow-500"></i> Training beendet!
          </p>
          <div class="text-3xl font-bold text-white">
            + {{ earnedCalories }} <span class="text-sm font-normal text-gray-400 uppercase">kcal</span>
          </div>
        </div>
      </div>

      <div class="space-y-4 mt-10">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-bold flex items-center gap-2 text-white">
            <i class="bi bi-list-check text-primary"></i> Übungen
          </h3>
          <span v-if="sessionActive" class="text-xs text-green-400 animate-pulse font-medium">
            ● Live-Modus: Werte anpassbar
          </span>
        </div>

        <div v-for="(ex, index) in exercises" :key="ex.id"
             class="card p-4 flex flex-col sm:flex-row justify-between items-center group transition-colors gap-4"
             :class="{'border-blue-500/30 bg-blue-500/5': sessionActive}"
        >

          <div class="flex items-center gap-4 w-full sm:w-auto">
             <span class="text-gray-500 font-mono text-sm h-8 w-8 min-w-[2rem] rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
               {{ index + 1 }}
             </span>
            <div>
              <span class="block text-lg font-bold text-white">{{ ex.name }}</span>
              <div v-if="!sessionActive" class="flex gap-4 text-sm text-gray-400 mt-1">
                <span>Ziel: {{ ex.saetze }} × {{ ex.wiederholungen }}</span>
              </div>
              <div v-else class="text-xs text-blue-300 mt-1">
                {{ ex.saetze }} Sätze geplant
              </div>
            </div>
          </div>

          <div class="w-full sm:w-auto flex justify-end">

            <div v-if="sessionActive" class="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-blue-500/30">

              <div class="flex flex-col items-center">
                <label class="text-[9px] uppercase text-gray-400 font-bold tracking-wider mb-1">Reps</label>
                <input
                  type="number"
                  v-model.number="ex.wiederholungen"
                  @change="updateStats(ex)"
                  class="bg-[#0f172a] border border-gray-600 text-white text-center rounded-lg w-16 h-10 font-mono font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <span class="text-gray-500 font-bold mt-3">×</span>

              <div class="flex flex-col items-center">
                <label class="text-[9px] uppercase text-blue-400 font-bold tracking-wider mb-1">Kg</label>
                <input
                  type="number"
                  v-model.number="ex.gewicht"
                  @change="updateStats(ex)"
                  class="bg-[#0f172a] border border-blue-500/50 text-white text-center rounded-lg w-20 h-10 font-mono font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-inner"
                  placeholder="0"
                />
              </div>

            </div>

            <div v-else class="text-right bg-black/20 px-4 py-2 rounded-lg min-w-[80px] border border-white/5 flex gap-4">
              <div class="flex flex-col items-center">
                <span class="text-xs text-gray-500 uppercase">Reps</span>
                <span class="text-xl font-bold text-gray-200 font-mono">{{ ex.wiederholungen }}</span>
              </div>
              <div class="w-px bg-white/10"></div>
              <div class="flex flex-col items-center">
                <span class="text-xs text-gray-500 uppercase">Kg</span>
                <span class="text-xl font-bold text-blue-400 font-mono">{{ ex.gewicht }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <Transition name="fade">
      <div v-if="showFinishModal" class="modal-overlay" @click.self="showFinishModal = false">
        <div class="modal">
          <div class="flex items-center gap-3 mb-6">
            <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <i class="bi bi-fire text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white">Abschließen</h3>
          </div>

          <p class="text-gray-300 mb-6">
            Starke Leistung! 💪<br>
            Gib bitte deine verbrannten Kalorien ein.
          </p>

          <div class="mb-6 relative">
            <label class="block text-xs font-bold uppercase text-gray-500 mb-2">Kalorien (kcal)</label>
            <input
              v-model.number="inputCalories"
              type="number"
              min="0"
              id="calorieInput"
              class="w-full bg-[#0f172a] border border-gray-600 rounded-xl px-4 py-3 text-white text-2xl font-mono font-bold focus:border-primary outline-none transition-colors"
              placeholder="0"
              @keyup.enter="confirmStop"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button @click="showFinishModal = false" class="btn btn-outline">Abbrechen</button>
            <button @click="confirmStop" class="btn btn-primary" :disabled="inputCalories === null || inputCalories < 0">Speichern</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useAuthenticatedFetch } from '@/api'

interface Workout { name: string; dayOfWeek: string; muskelgruppe: string }
interface Exercise { id: number; name: string; saetze: number; wiederholungen: number; gewicht: number }

const props = defineProps<{ workoutId: number }>()
defineEmits(['back'])

const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:8080' : 'https://webtech-backend-rqq7.onrender.com'
const loading = ref(true); const workout = ref<Workout | null>(null); const exercises = ref<Exercise[]>([])
const sessionActive = ref(false); const sessionFinished = ref(false); const currentSessionId = ref<number | null>(null)

// fix setTimerInterval
const earnedCalories = ref(0); const timerSeconds = ref(0); let timerInterval: ReturnType<typeof setInterval> | null = null

// const earnedCalories = ref(0); const timerSeconds = ref(0); let timerInterval: number | undefined
const showFinishModal = ref(false); const inputCalories = ref<number | null>(null)
const { authFetch } = useAuthenticatedFetch()

onMounted(loadData); onUnmounted(stopTimer); watch(() => props.workoutId, loadData)

async function loadData() {
  loading.value = true
  try {
    const [resW, resEx] = await Promise.all([authFetch(`${API_BASE}/workouts/${props.workoutId}`), authFetch(`${API_BASE}/exercises/workout/${props.workoutId}`)])
    if (resW.ok) workout.value = await resW.json()
    if (resEx.ok) exercises.value = await resEx.json()
  } catch (e) { console.error(e) } finally { loading.value = false }
}

// --- LOGIC: UPDATE (Reps & Weight) ---
async function updateStats(ex: Exercise) {
  try {
    await authFetch(`${API_BASE}/exercises/${ex.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: ex.name,
        saetze: ex.saetze,
        wiederholungen: ex.wiederholungen, // <-- Speichert jetzt auch Reps!
        gewicht: ex.gewicht
      })
    })
  } catch (e) { console.error('Fehler beim Speichern:', e) }
}

async function startSession() {
  try {
    const res = await authFetch(`${API_BASE}/api/sessions/start/${props.workoutId}`, { method: 'POST' })
    if (!res.ok) { alert('Fehler beim Starten'); return }
    const session = await res.json(); currentSessionId.value = session.id
    sessionActive.value = true; sessionFinished.value = false; timerSeconds.value = 0; startTimer()
  } catch (e) { console.error(e); alert('Verbindungsfehler') }
}

function openFinishModal() {
  inputCalories.value = null
  showFinishModal.value = true

  // HIER DIE ÄNDERUNG: "as HTMLInputElement" hinzufügen
  nextTick(() => {
    const input = document.querySelector('input[type="number"]') as HTMLInputElement | null
    input?.focus()
  })
}

async function confirmStop() {
  if (!currentSessionId.value || inputCalories.value == null) return
  try {
    stopTimer()
    const res = await authFetch(`${API_BASE}/api/sessions/end/${currentSessionId.value}`, {
      method: 'POST',
      body: JSON.stringify({ calories: inputCalories.value })
    })
    if (!res.ok) { alert('Fehler'); startTimer(); return }
    const result = await res.json()


     earnedCalories.value = result.calories; showFinishModal.value = false; sessionActive.value = false; sessionFinished.value = true
  } catch (e) { console.error(e); alert('Fehler'); startTimer() }
}
// fix startTimer()
function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => timerSeconds.value++, 1000)
}
// function startTimer() { stopTimer(); timerInterval = setInterval(() => timerSeconds.value++, 1000) }

// fix stopTimer()
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}


// function stopTimer() { clearInterval(timerInterval) }
function formatTime(sec: number) { return `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}` }
</script>

<style scoped>
.loading-spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.active-session-panel { background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 50px rgba(59, 130, 246, 0.15); }
.timer-active { background: linear-gradient(to right, #60a5fa, #3b82f6); -webkit-background-clip: text; color: transparent; filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4)); }
.animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-pulse-slow { animation: pulseGlow 2s infinite; }
@keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
.animate-fadeIn { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>