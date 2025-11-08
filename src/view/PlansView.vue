<template>
  <div class="container py-4 text-light">
    <h2 class="mb-4">
      <i class="bi bi-journal-text text-warning me-2"></i>Deine Trainingspläne
    </h2>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Lädt...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>

    <div v-else class="row g-4">
      <div v-for="plan in plans" :key="plan.id" class="col-md-4">
        <PlanCard :plan="plan" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PlanCard from '@/components/PlanCard.vue'

const plans = ref([])
const loading = ref(true)
const error = ref(null)
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}/plans`)
    if (!res.ok) throw new Error(`HTTP-Fehler: ${res.status}`)
    plans.value = await res.json()
  } catch (err) {
    error.value = 'Fehler beim Laden der Trainingspläne.'
    console.error('Backend-Fehler:', err)
  } finally {
    loading.value = false
  }
})
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
