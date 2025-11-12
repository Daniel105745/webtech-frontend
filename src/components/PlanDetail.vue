<template>
  <div class="min-h-screen bg-[#0b1120] px-10 py-10 text-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-10">
      <button
        @click="$emit('back')"
        class="flex items-center gap-2 text-blue-400 hover:text-white bg-[#1e293b] hover:bg-[#334155]
               px-4 py-2 rounded-lg transition active:scale-95 shadow-sm border border-[#334155]"
      >
        <i class="bi bi-arrow-left"></i> Zurück
      </button>

      <div class="text-center flex-1">
        <h1 class="text-2xl font-bold text-white">
          🏋️ {{ plan?.name || 'Trainingsplan' }}
        </h1>
        <p class="text-gray-400 text-sm mt-1">{{ plan?.zielmuskeln }}</p>
      </div>

      <button
        @click="$emit('add-workout')"
        class="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium px-5 py-2 rounded-lg
               shadow-md hover:shadow-lg transition active:scale-95"
      >
        + Workout hinzufügen
      </button>
    </div>

    <!-- Plan Info -->
    <div class="bg-[#1e293b] p-6 rounded-xl shadow-md border border-[#334155] mb-10">
      <div class="flex justify-around text-center text-sm">
        <div>
          <p class="text-gray-400">Dauer</p>
          <p class="text-lg font-semibold text-gray-100">{{ plan?.dauer }}</p>
        </div>
        <div>
          <p class="text-gray-400">Intensität</p>
          <p class="text-lg font-semibold text-blue-400">{{ plan?.intensitaet }}</p>
        </div>
        <div>
          <p class="text-gray-400">Trainingsziel</p>
          <p class="text-lg font-semibold text-gray-100">{{ plan?.zielmuskeln }}</p>
        </div>
      </div>
    </div>

    <!-- Workouts -->
    <section>
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        💪 Workouts
      </h2>

      <div v-if="loading" class="text-center text-gray-500 italic py-8">
        Workouts werden geladen...
      </div>

      <div
        v-else-if="workouts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="workout in workouts"
          :key="workout.id"
          @click="$router.push(`/workouts/${workout.id}`)"
          class="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-md hover:shadow-xl
                 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div>
            <h3 class="text-lg font-semibold mb-1 text-white">
              {{ workout.name }}
            </h3>
            <p class="text-sm text-gray-400">{{ workout.muskelgruppe }}</p>
            <p class="text-xs text-gray-500 mt-1 italic">
              {{ workout.dayOfWeek }}
            </p>
          </div>

          <div v-if="workout.exercises?.length" class="mt-4 border-t border-[#334155] pt-3">
            <h4 class="font-medium text-gray-300 mb-2">Übungen:</h4>
            <ul class="text-sm text-gray-400 space-y-1">
              <li
                v-for="ex in workout.exercises"
                :key="ex.id"
                class="flex justify-between"
              >
                <span>{{ ex.name }}</span>
                <span>{{ ex.saetze }}×{{ ex.wiederholungen }} – {{ ex.gewicht }} kg</span>
              </li>
            </ul>
          </div>
          <div v-else class="text-sm text-gray-500 italic mt-3">
            Keine Übungen hinzugefügt
          </div>

          <!-- Buttons -->
          <div
            class="border-t border-[#334155] mt-4 pt-3 flex justify-between items-center"
            @click.stop
          >
            <button
              @click="$emit('edit-workout', workout)"
              class="flex items-center gap-2 text-sm font-medium text-white bg-[#3b82f6]
                     hover:bg-[#2563eb] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <i class="bi bi-pencil text-white"></i>
              Bearbeiten
            </button>

            <button
              @click="$emit('delete-workout', workout.id)"
              class="flex items-center gap-2 text-sm font-medium text-white bg-[#ef4444]
                     hover:bg-[#dc2626] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <i class="bi bi-trash text-white"></i>
              Löschen
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center text-gray-500 italic py-10 bg-[#1e293b] rounded-xl border border-dashed border-[#3b4b63]"
      >
        Noch keine Workouts hinzugefügt
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  muskelgruppe?: string
  dayOfWeek?: string
  exercises?: Exercise[]
}
interface Plan {
  id?: number
  name?: string
  dauer?: string
  intensitaet?: string
  zielmuskeln?: string
}

const props = defineProps<{
  plan?: Plan
  workouts: Workout[]
  loading: boolean
}>()

const plan = computed(() => props.plan)
const workouts = computed(() => props.workouts)
const loading = computed(() => props.loading)

defineEmits<{
  (e: 'add-workout'): void
  (e: 'edit-workout', w: Workout): void
  (e: 'delete-workout', id?: number): void
  (e: 'back'): void
}>()
</script>
