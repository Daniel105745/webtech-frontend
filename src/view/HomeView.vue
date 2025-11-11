<template>
  <div class="flex flex-col h-[calc(100vh-80px)] overflow-y-auto px-10 py-6 bg-gray-50 text-gray-900">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-2">Willkommen zurück, Athlet 💪</h1>
      <p class="text-gray-500 mb-8">Dein Trainingsfortschritt im Überblick.</p>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-2xl p-6 shadow border border-gray-200">
          <p class="text-gray-500 text-base">Kalorienverbrauch</p>
          <p class="text-3xl font-bold text-gray-800 mt-2">2.380 kcal</p>
          <p class="text-sm text-green-600 mt-1">+8 % mehr als letzte Woche</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow border border-gray-200">
          <p class="text-gray-500 text-base">Workouts diese Woche</p>
          <p class="text-3xl font-bold text-gray-800 mt-2">5</p>
          <p class="text-sm text-blue-600 mt-1">Ziel erreicht: 71 %</p>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow border border-gray-200">
          <p class="text-gray-500 text-base">Trainingszeit</p>
          <p class="text-3xl font-bold text-gray-800 mt-2">165 Min</p>
          <p class="text-sm text-purple-600 mt-1">+12 % zur Vorwoche</p>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
      <!-- Line Chart -->
      <div class="xl:col-span-2 bg-white rounded-2xl shadow border border-gray-200 p-6 h-96">
        <h2 class="text-lg font-semibold mb-3">Trainingszeit (Minuten pro Tag)</h2>
        <div class="h-[calc(100%-2rem)]">
          <Line :data="lineData" :options="lineOptions" />
        </div>
      </div>

      <!-- Doughnut Chart -->
      <div class="bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col justify-center items-center h-96">
        <h2 class="text-lg font-semibold mb-4 self-start">Trainingsverteilung</h2>
        <div class="w-60 h-60">
          <Doughnut :data="pieData" :options="pieOptions" />
        </div>
      </div>
    </div>

    <!-- Streak -->
    <div class="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-3">Aktivitäts-Streak 🔥</h2>
      <p class="text-gray-600 text-sm mb-2">
        Du bist seit <span class="font-semibold text-blue-600">5 Tagen</span> in Folge aktiv!
      </p>
      <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
        <div
          class="bg-blue-600 h-3 rounded-full transition-all duration-500"
          :style="{ width: '71%' }"
        ></div>
      </div>
      <p class="text-gray-500 text-xs mt-2">Ziel: 7 Tage in Folge</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
} from 'chart.js'

import type { ChartOptions } from 'chart.js'

Chart.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend, Title)

// --- Daten: Linienchart ---
const lineData = {
  labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  datasets: [
    {
      label: 'Trainingszeit (Minuten)',
      data: [40, 55, 45, 30, 65, 70, 50],
      fill: true,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      tension: 0.4,
      pointBackgroundColor: '#2563eb',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}

const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#fff',
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b' },
    },
    y: {
      grid: { color: '#e2e8f0' },
      ticks: { color: '#64748b', stepSize: 10 },
    },
  },
}

// --- Daten: Kreisdiagramm ---
const pieData = {
  labels: ['Krafttraining', 'Cardio', 'Mobility'],
  datasets: [
    {
      label: 'Trainingsverteilung',
      data: [55, 30, 15],
      backgroundColor: ['#2563eb', '#22c55e', '#facc15'],
      borderWidth: 0,
    },
  ],
}

const pieOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#334155', boxWidth: 12 },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#fff',
    },
  },
}
</script>
