<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import { useAuthenticatedFetch } from '@/api'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  Chart,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend,
  Title,
  type ChartData,
  type ChartOptions
} from 'chart.js'

Chart.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend, Title)

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080'
    : 'https://webtech-backend-rqq7.onrender.com'

const { user } = useAuth0()
const { authFetch } = useAuthenticatedFetch()

/* ------------------------- STAT CARDS ------------------------- */
const calories = ref(0)
const workouts = ref(0)
const minutes = ref(0)

async function loadDashboard() {
  try {
    const res = await authFetch(`${API_BASE}/api/dashboard`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    calories.value = data.calories
    workouts.value = data.workouts
    minutes.value = data.minutes
  } catch (err) {
    console.error('Dashboard error:', err)
  }
}

/* ------------------------- LINE CHART ------------------------- */
const lineData = ref<ChartData<'line'>>({
  labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  datasets: [
    {
      label: 'Trainingszeit',
      data: [0, 0, 0, 0, 0, 0, 0],
      fill: true,
      borderColor: '#60a5fa',
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0.4)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0.0)');
        return gradient;
      },
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
})

const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { border: { display: false }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
  }
}

// 1. Hier definieren wir, wie eine Session aussieht
interface Session {
  startTime: string
  minutes: number
}

async function loadWeekSessions() {
  try {
    const res = await authFetch(`${API_BASE}/api/sessions/week`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const sessions: Session[] = await res.json()

    const perDay = [0, 0, 0, 0, 0, 0, 0]

    sessions.forEach((s) => {
      const weekday = new Date(s.startTime).getDay()
      // Sonntag (0) wird zu 6, Mo (1) zu 0, etc.
      const idx = weekday === 0 ? 6 : weekday - 1

      // HIER IST DER FIX:
      // Wir prüfen kurz, ob der Eintrag existiert, bevor wir addieren.
      if (perDay[idx] !== undefined) {
        perDay[idx] += s.minutes
      }
    })

    lineData.value = {
      ...lineData.value,
      datasets: [{ ...lineData.value.datasets[0], data: perDay }]
    }
  } catch (err) { console.error(err) }
}

/* ------------------------- PIE CHART ------------------------- */
const pieData = ref<ChartData<'doughnut'> | null>(null)
const pieOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: '#cbd5e1', boxWidth: 15, padding: 20, font: {size: 12} } },
  },
  cutout: '70%',
  layout: { padding: 20 }
}

interface Plan {
  id: number
  trainingsziel: string
}

async function loadPlansForPie() {
  try {
    const res = await authFetch(`${API_BASE}/plans`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const plans: Plan[] = await res.json()
    const counts = { Muskelaufbau: 0, Kraftzuwachs: 0 }
    plans.forEach(p => {
      if (p.trainingsziel === 'Muskelaufbau') counts.Muskelaufbau++
      if (p.trainingsziel === 'Kraftzuwachs') counts.Kraftzuwachs++
    })
    pieData.value = {
      labels: ['Muskelaufbau', 'Kraftzuwachs'],
      datasets: [{
        data: [counts.Muskelaufbau, counts.Kraftzuwachs],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderWidth: 0,
        hoverOffset: 10
      }],
    }
  } catch (err) { console.error(err) }
}

onMounted(() => {
  loadDashboard()
  loadWeekSessions()
  loadPlansForPie()
})
</script>

<template>
  <div class="animate-fadeIn">
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold mb-2 tracking-tight">
        Hey, <span class="bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">{{ user?.name || 'Athlet' }}</span> 👋
      </h1>
      <p class="text-gray-400 text-lg">
        Lass uns heute wieder alles geben!
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="card p-6 flex items-center gap-5">
        <div class="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
          🔥
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium uppercase tracking-wider">Kalorien</p>
          <p class="text-3xl font-bold text-white mt-1">{{ calories }} <span class="text-base font-normal text-gray-500">kcal</span></p>
        </div>
      </div>

      <div class="card p-6 flex items-center gap-5">
        <div class="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl">
          💪
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium uppercase tracking-wider">Workouts</p>
          <p class="text-3xl font-bold text-white mt-1">{{ workouts }} <span class="text-base font-normal text-gray-500">Sessions</span></p>
        </div>
      </div>

      <div class="card p-6 flex items-center gap-5">
        <div class="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl">
          ⏱️
        </div>
        <div>
          <p class="text-gray-400 text-sm font-medium uppercase tracking-wider">Zeit</p>
          <p class="text-3xl font-bold text-white mt-1">{{ minutes }} <span class="text-base font-normal text-gray-500">Min</span></p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

      <div class="card p-6 xl:col-span-2 h-96 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-100">Wochenverlauf</h2>
          <span class="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">Last 7 Days</span>
        </div>
        <div class="flex-1 w-full min-h-0">
          <Line :data="lineData" :options="lineOptions" />
        </div>
      </div>

      <div class="card p-6 h-96 flex flex-col items-center justify-center relative">
        <h2 class="text-lg font-bold text-gray-100 absolute top-6 left-6">Ziele</h2>
        <div v-if="pieData" class="w-full h-64 flex justify-center">
          <Doughnut :data="pieData" :options="pieOptions" />
        </div>
        <div v-else class="text-gray-500 italic">Keine Daten...</div>
      </div>

    </div>

    <div class="card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          🔥 Aktivitäts-Streak
        </h2>
        <p class="text-gray-400 mt-1">
          Wahnsinn! Du bist seit <span class="text-blue-400 font-bold">5 Tagen</span> ununterbrochen dabei.
        </p>
      </div>

      <div class="w-full md:w-1/2">
        <div class="flex justify-between text-xs text-gray-500 mb-2 font-mono">
          <span>Level 1</span>
          <span>70%</span>
          <span>Level 2</span>
        </div>
        <div class="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
          <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style="width: 70%"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>