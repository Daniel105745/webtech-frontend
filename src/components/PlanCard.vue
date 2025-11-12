<template>
  <div
    class="card p-6 flex flex-col justify-between cursor-pointer hover:-translate-y-1 active:scale-[0.98] transition-all"
    @click="goToDetail(plan.id)"
  >
    <div>
      <h2 class="text-xl font-semibold mb-1 hover:text-primary transition">
        {{ plan.name }}
      </h2>
      <p class="text-gray-500 text-sm mb-4">
        {{ plan.trainingsziel || '—' }}
      </p>

      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-600">Dauer</span>
        <span class="font-medium">{{ plan.dauer }}</span>
      </div>

      <div class="flex justify-between text-sm mb-4">
        <span class="text-gray-600">Intensität</span>
        <span class="font-medium text-primary">{{ plan.intensitaet }}</span>
      </div>
    </div>

    <div
      class="border-t border-gray-border mt-3 pt-3 flex justify-between items-center"
      @click.stop
    >
      <!-- Bearbeiten -->
      <button @click="editPlan" class="btn btn-primary flex items-center gap-2">
        <i class="bi bi-pencil"></i>
        Bearbeiten
      </button>

      <!-- Löschen -->
      <button @click="deletePlan" class="btn btn-danger flex items-center gap-2">
        <i class="bi bi-trash"></i>
        Löschen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

interface Plan {
  id?: number
  name: string
  dauer: string
  intensitaet: string
  trainingsziel: string
}

const props = defineProps<{ plan: Plan }>()
const emit = defineEmits<{
  (e: 'edit', plan: Plan): void
  (e: 'delete', id?: number): void
  (e: 'detail', id?: number): void
}>()

function editPlan() {
  emit('edit', props.plan)
}

function deletePlan() {
  emit('delete', props.plan.id)
}

function goToDetail(id?: number) {
  emit('detail', id)
}
</script>
