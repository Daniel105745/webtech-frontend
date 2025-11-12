<template>
  <div
    class="flex flex-col h-[calc(100vh-80px)] overflow-y-auto px-10 py-6
           bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100
           transition-colors duration-300"
  >
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-50">
        Willkommen zurück, Athlet 💪
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Dein Trainingsfortschritt im Überblick.
      </p>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="rounded-2xl p-6 shadow border border-gray-200
                    bg-white dark:bg-[#1e293b] dark:border-[#334155]">
          <p class="text-gray-600 dark:text-gray-300 text-base">Kalorienverbrauch</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">2.380 kcal</p>
          <p class="text-sm text-green-600 dark:text-green-400 mt-1">+8 % mehr als letzte Woche</p>
        </div>

        <div class="rounded-2xl p-6 shadow border border-gray-200
                    bg-white dark:bg-[#1e293b] dark:border-[#334155]">
          <p class="text-gray-600 dark:text-gray-300 text-base">Workouts diese Woche</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">5</p>
          <p class="text-sm text-blue-600 dark:text-blue-400 mt-1">Ziel erreicht: 71 %</p>
        </div>

        <div class="rounded-2xl p-6 shadow border border-gray-200
                    bg-white dark:bg-[#1e293b] dark:border-[#334155]">
          <p class="text-gray-600 dark:text-gray-300 text-base">Trainingszeit</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">165 Min</p>
          <p class="text-sm text-purple-600 dark:text-purple-400 mt-1">+12 % zur Vorwoche</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
      <!-- LINE CHART -->
      <div class="xl:col-span-2 rounded-2xl shadow border border-gray-200
                  bg-white dark:bg-[#1e293b] dark:border-[#334155] p-6 h-96 transition-colors">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
          Trainingszeit (Minuten pro Tag)
        </h2>
        <div class="h-[calc(100%-2rem)]">
          <Line :data="lineData" :options="lineOptions" />
        </div>
      </div>

      <!-- PIE CHART -->
      <div class="rounded-2xl shadow border border-gray-200
                  bg-white dark:bg-[#1e293b] dark:border-[#334155] p-6 flex flex-col justify-center items-center h-96 transition-colors">
        <h2 class="text-lg font-semibold mb-4 self-start text-gray-800 dark:text-gray-100">
          Trainingsverteilung
        </h2>
        <div v-if="pieData" class="w-60 h-60">
          <Doughnut :data="pieData" :options="pieOptions" />
        </div>
        <div v-else class="text-gray-400 text-sm italic mt-8">
          Lade Trainingsdaten...
        </div>
      </div>
    </div>

    <!-- STREAK -->
    <div class="rounded-2xl shadow border border-gray-200
                bg-white dark:bg-[#1e293b] dark:border-[#334155] p-6 transition-colors">
      <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        Aktivitäts-Streak 🔥
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
        Du bist seit <span class="font-semibold text-blue-600 dark:text-blue-400">5 Tagen</span> in Folge aktiv!
      </p>
      <div class="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
        <div
          class="bg-blue-600 h-3 rounded-full transition-all duration-500"
          :style="{ width: '71%' }"
        ></div>
      </div>
      <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">Ziel: 7 Tage in Folge</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
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

// ---- LINE CHART ----
const lineData = ref<ChartData<'line'>>({
  labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  datasets: [
    {
      label: 'Trainingszeit (Minuten)',
      data: [40, 55, 45, 30, 65, 70, 50],
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.25)',
      tension: 0.35,
      pointBackgroundColor: '#60a5fa',
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
})

const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#1d4ed8',
      borderWidth: 1,
      displayColors: false,
    },
  },
  scales: {
    x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
    y: { grid: { color: '#475569' }, ticks: { color: '#cbd5e1', stepSize: 10 } },
  },
}

// ---- PIE CHART ----
const pieData = ref<ChartData<'doughnut'> | null>(null)

const pieOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#cbd5e1', boxWidth: 12 },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#1d4ed8',
      borderWidth: 1,
    },
  },
}

// ---- BACKEND LOAD ----
interface Plan {
  id: number
  name: string
  dauer: string
  intensitaet: string
  trainingsziel: string
}

onMounted(loadPlansForPie)

async function loadPlansForPie() {
  try {
    const res = await fetch(`${API_BASE}/plans`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const plans: Plan[] = await res.json()

    const counts = { Muskelaufbau: 0, Kraftzuwachs: 0, Ausdauer: 0 }

    for (const p of plans) {
      if (p.trainingsziel === 'Muskelaufbau') counts.Muskelaufbau++
      else if (p.trainingsziel === 'Kraftzuwachs') counts.Kraftzuwachs++
      else if (p.trainingsziel === 'Ausdauer') counts.Ausdauer++
    }

    pieData.value = {
      labels: ['Muskelaufbau', 'Kraftzuwachs', 'Ausdauer'],
      datasets: [
        {
          label: 'Trainingsverteilung',
          data: [counts.Muskelaufbau, counts.Kraftzuwachs, counts.Ausdauer],
          backgroundColor: ['#3b82f6', '#22c55e', '#facc15'],
          borderColor: ['#1e40af', '#15803d', '#ca8a04'],
          borderWidth: 1,
        },
      ],
    }
  } catch (err) {
    console.error('Fehler beim Laden der Trainingsziele:', err)
  }
}
</script>
