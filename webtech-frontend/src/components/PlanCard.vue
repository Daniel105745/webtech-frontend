<template>
  <div
    class="card bg-dark text-light shadow-lg border-0 h-100 plan-card"
    @click="toggle"
    style="cursor: pointer;"
  >
    <div class="card-body">
      <h5 class="card-title fw-bold mb-1">{{ plan.name }}</h5>
      <p class="card-text text-secondary mb-3">{{ plan.description }}</p>

      <transition name="fade">
        <div v-if="expanded">
          <hr class="border-secondary" />
          <ul class="list-unstyled mb-3">
            <li><i class="bi bi-clock text-success me-2"></i>Dauer: {{ plan.duration }}</li>
            <li><i class="bi bi-calendar-week text-info me-2"></i>{{ plan.frequency }}</li>
            <li><i class="bi bi-lightning-charge text-warning me-2"></i>Intensität: {{ plan.intensity }}</li>
            <li><i class="bi bi-bar-chart text-danger me-2"></i>Zielmuskeln: {{ plan.targets }}</li>
          </ul>
          <button class="btn btn-success w-100 mt-2">Plan öffnen</button>
        </div>
      </transition>

      <div class="text-center mt-2">
        <i
          class="bi"
          :class="expanded ? 'bi-chevron-up text-success' : 'bi-chevron-down text-secondary'"
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ plan: Object })
const expanded = ref(false)
const toggle = () => (expanded.value = !expanded.value)
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
