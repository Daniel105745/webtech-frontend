<template>


    <!-- Header -->
    <div class="flex items-center justify-between mb-10">
      <button
        @click="$emit('back')"
        class="btn btn-outline"
      >
        <i class="bi bi-arrow-left"></i> Zurück
      </button>

      <div class="text-center flex-1">
        <h1 class="text-2xl font-bold text-white">🏋️ {{ plan?.name }}</h1>
        <p class="text-gray-400 text-sm mt-1">{{ plan?.zielmuskeln }}</p>
      </div>

      <button
        @click="$emit('add-workout')"
        class="btn btn-primary"
      >
        + Übung hinzufügen
      </button>
    </div>

    <!-- Plan Info Panel -->
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
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-white">💪 Workouts</h2>

      <!-- Loading panel -->
      <div v-if="loading"
           class="text-center text-gray-500 italic py-8 bg-[#1e293b] rounded-xl border border-[#334155]">
        Workouts werden geladen...
      </div>

      <!-- Workout Grid -->
      <div
        v-else-if="workouts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
      >

        <div
          v-for="workout in workouts"
          :key="workout.id"
          @click="$router.push(`/workouts/${workout.id}`)"
          class="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-md
         transition-all cursor-pointer
         hover:shadow-xl hover:-translate-y-1 hover:bg-[#26334a]
         active:scale-[0.98]"
        >
          <h3 class="text-lg font-semibold mb-1 text-white">{{ workout.name }}</h3>
          <p class="text-sm text-gray-400">{{ workout.muskelgruppe }}</p>
          <p class="text-xs text-gray-500 mt-1 italic">{{ workout.dayOfWeek }}</p>

          <!-- Exercises -->
          <div
            v-if="workout.exercises?.length"
            class="mt-4 border-t border-[#334155] pt-3"
          >
            <h4 class="font-medium text-gray-300 mb-2">Übungen:</h4>

            <ul class="text-sm text-gray-400 space-y-1">
              <li
                v-for="ex in workout.exercises"
                :key="ex.id"
                class="flex justify-between"
              >
                <span>{{ ex.name }}</span>
                <span>{{ ex.saetze }}×{{ ex.wiederholungen }} — {{ ex.gewicht }} kg</span>
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
              class="btn btn-primary flex items-center gap-2">
              <i class="bi bi-pencil"></i>
              Bearbeiten
            </button>


            <button
              @click="$emit('delete-workout', workout.id)"
              class="btn btn-danger"
            >
              <i class="bi bi-trash"></i>
              Löschen
            </button>
          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div v-else
           class="text-center text-gray-500 italic py-10 bg-[#1e293b] rounded-xl border border-[#334155]">
        Noch keine Workouts hinzugefügt
      </div>
    </section>
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
  (e: 'edit-workout', workout: Workout): void
  (e: 'delete-workout', id?: number): void
  (e: 'back'): void
}>()
</script>
