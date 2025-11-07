<template>
  <div class="container py-4 text-light">
    <h2 class="mb-4">
      <i class="bi bi-journal-text text-warning me-2"></i>Deine Trainingspläne
    </h2>

    <div class="row g-4">
      <div v-for="plan in plans" :key="plan.id" class="col-md-4">
        <PlanCard :plan="plan" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PlanCard from '@/components/PlanCard.vue'

const plans = ref([
  {
    id: 1,
    name: 'Muskelaufbau',
    description: '3er Split mit Fokus auf Masseaufbau',
    duration: '8 Wochen',
    frequency: '3 Workouts pro Woche',
    intensity: 'Mittel bis Hoch',
    targets: 'Brust, Rücken, Beine'
  },
  {
    id: 2,
    name: 'Krafttraining',
    description: 'Volumenplan für maximale Stärke',
    duration: '10 Wochen',
    frequency: '4 Workouts pro Woche',
    intensity: 'Hoch',
    targets: 'Ganzkörper'
  },
  {
    id: 3,
    name: 'Cardio & Core',
    description: 'Ausdauer & Bauchtraining kombiniert',
    duration: '6 Wochen',
    frequency: '3 Sessions pro Woche',
    intensity: 'Mittel',
    targets: 'Bauch, Beine, Herz-Kreislauf'
  }
])
</script>

<style scoped>
.plan-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border-radius: 1rem;
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 20px rgba(0, 255, 100, 0.2);
}
</style>
