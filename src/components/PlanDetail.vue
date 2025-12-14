<template>
  <div class="flex items-center justify-between mb-8">
    <button @click="$emit('back')" class="btn btn-outline gap-2 px-3">
      <i class="bi bi-arrow-left"></i> Zurück
    </button>

    <div class="text-center">
      <h1 class="text-2xl font-bold text-white">{{ plan?.name }}</h1>
      <span class="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">
          {{ plan?.zielmuskeln }}
        </span>
    </div>

    <button @click="$emit('add-workout')" class="btn btn-primary">
      + Workout
    </button>
  </div>

  <div class="card p-6 mb-10 flex justify-around text-center">
    <div>
      <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Dauer</p>
      <p class="text-lg font-bold text-white">{{ plan?.dauer }}</p>
    </div>
    <div class="w-px bg-white/10"></div>
    <div>
      <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Intensität</p>
      <p class="text-lg font-bold text-blue-400">{{ plan?.intensitaet }}</p>
    </div>
    <div class="w-px bg-white/10"></div>
    <div>
      <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Ziel</p>
      <p class="text-lg font-bold text-white">{{ plan?.zielmuskeln }}</p>
    </div>
  </div>

  <section>
    <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-white">Workouts im Plan</h2>

    <div v-if="loading" class="text-center py-10 text-gray-500">Lade...</div>

    <div v-else-if="workouts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      <div
        v-for="workout in workouts"
        :key="workout.id"
        @click="router.push(`/workouts/${workout.id}`)"
        class="card p-6 cursor-pointer group"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors">{{ workout.name }}</h3>
          <span class="text-xs font-mono bg-white/5 text-gray-300 px-2 py-1 rounded">{{ workout.dayOfWeek }}</span>
        </div>
        <p class="text-sm text-gray-500 mb-4">{{ workout.muskelgruppe }}</p>

        <div v-if="workout.exercises?.length" class="bg-black/20 rounded-lg p-3 space-y-2 mb-4">
          <div v-for="ex in workout.exercises.slice(0, 3)" :key="ex.id" class="flex justify-between text-xs text-gray-400">
            <span>{{ ex.name }}</span>
            <span class="font-mono text-gray-500">{{ ex.saetze }}x{{ ex.wiederholungen }}</span>
          </div>
          <div v-if="workout.exercises.length > 3" class="text-xs text-center text-gray-600 pt-1">
            + {{ workout.exercises.length - 3 }} weitere
          </div>
        </div>
        <div v-else class="text-sm text-gray-600 italic mb-4 bg-black/10 rounded-lg p-3 text-center">
          Keine Übungen
        </div>

        <div class="border-t border-white/10 mt-3 pt-3 flex justify-between items-center" @click.stop>
          <button @click.stop="$emit('edit-workout', workout)" class="btn btn-primary text-xs py-2 px-3">
            <i class="bi bi-trash"></i>
            Bearbeiten
          </button>
          <button @click.stop="$emit('delete-workout', workout.id)" class="btn btn-danger text-xs py-2 px-3">
            <i class="bi bi-trash"></i>
            Löschen
          </button>
        </div>
      </div>
    </div>

    <div v-else class="card p-10 text-center text-gray-500 border-dashed border-2 border-white/5 bg-transparent shadow-none">
      Noch keine Workouts in diesem Plan.
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import router from "@/router";
/* Interfaces bleiben gleich */
interface Exercise { id?: number; name: string; saetze?: number; wiederholungen?: number; gewicht?: number }
interface Workout { id?: number; name?: string; muskelgruppe?: string; dayOfWeek?: string; exercises?: Exercise[] }
interface Plan { id?: number; name?: string; dauer?: string; intensitaet?: string; zielmuskeln?: string }

const props = defineProps<{ plan?: Plan; workouts: Workout[]; loading: boolean }>()
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