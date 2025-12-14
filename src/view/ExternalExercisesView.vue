<template>
  <header class="flex items-center justify-between mb-10">
    <div>
      <h1 class="text-3xl font-bold mb-1">Externe Übungen</h1>
      <p class="text-gray-500 text-sm">
        Suche nach Übungen oder filtere nach Muskelgruppen.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <input
        v-model="query"
        @keyup.enter="search"
        placeholder="Übung suchen..."
        class="border border-gray-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
      />

      <div class="relative">
        <select
          v-model="selectedMuscle"
          class="w-full appearance-none border border-gray-border rounded-lg px-3 py-2 pr-10 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="">Alle Muskeln</option>
          <option v-for="m in muscles" :key="m" :value="m">
            {{ m }}
          </option>
        </select>

        <svg
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>
      </div>

      <button @click="search" class="btn btn-primary">Suchen</button>
    </div>
  </header>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="ex in results"
      :key="ex.name"
      class="card p-6 flex flex-col justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold mb-1 text-primary">
          {{ ex.name }}
        </h2>

        <p class="text-gray-500 text-sm mb-4">
          Muskel: <span class="font-medium">{{ ex.muscle || '—' }}</span>
        </p>

        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">Typ</span>
          <span class="font-medium">{{ ex.type }}</span>
        </div>


        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Level</span>
          <span class="font-medium text-primary">{{ ex.difficulty }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthenticatedFetch } from '@/api' // <--- IMPORT

/* ---------- TYPES ---------- */
interface ExternalExercise {
  name: string
  muscle: string
  type: string
  equipment: string
  difficulty: string
}

/* ---------- STATE ---------- */
const query = ref('')
const selectedMuscle = ref('')
const results = ref<ExternalExercise[]>([])

const muscles: string[] = [
  'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest',
  'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back',
  'neck', 'quadriceps', 'traps', 'triceps'
]

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080'
    : 'https://webtech-backend-rqq7.onrender.com'

// <--- AUTH FETCH
const { authFetch } = useAuthenticatedFetch()

/* ---------- SEARCH ---------- */
async function search() {
  const params = new URLSearchParams()

  if (query.value.trim()) params.append('query', query.value.trim())
  if (selectedMuscle.value) params.append('muscle', selectedMuscle.value)

  // <--- authFetch
  const res = await authFetch(`${API_BASE}/external/exercises?${params}`)

  if (!res.ok) {
    console.error('API-Fehler', res)
    alert('Fehler beim Laden der Daten')
    return
  }

  results.value = (await res.json()) as ExternalExercise[]
}
</script>