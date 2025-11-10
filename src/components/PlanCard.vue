<template>
  <div class="card p-6 flex flex-col justify-between h-full group">
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-1 group-hover:text-primary transition">
        {{ plan.name }}
      </h2>
      <p class="text-gray-text text-sm">{{ plan.zielmuskeln }}</p>
    </div>

    <div class="space-y-3 text-sm">
      <div class="flex justify-between items-center pb-3 border-b border-gray-border">
        <span class="text-gray-text">Dauer</span>
        <span class="font-medium text-dark">{{ plan.dauer }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-text">Intensität</span>
        <span
          class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
          :class="getIntensityBadgeClass(plan.intensitaet)"
        >
          {{ plan.intensitaet }}
        </span>
      </div>
    </div>

    <div class="mt-6 pt-4 flex justify-between items-center border-t border-gray-border">
      <button
        class="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 text-primary hover:bg-primary-light"
        @click="$emit('open', plan)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232a2.5 2.5 0 013.536 3.536L8.5 19.036l-4 1 1-4 9.732-9.732z" />
        </svg>
        Bearbeiten
      </button>

      <button
        class="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95 text-danger hover:bg-red-100"
        @click="$emit('delete', plan.id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Löschen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ... deine Props bleiben gleich ...
defineProps<{
  plan: {
    id: number
    name: string
    dauer: string
    intensitaet: string
    zielmuskeln: string
  }
}>()

// Hilfsfunktion zur Zuweisung einer Farbe basierend auf der Intensität
function getIntensityBadgeClass(intensitaet: string): string {
  const lowerIntensitaet = intensitaet.toLowerCase()
  if (lowerIntensitaet.includes('anfänger')) {
    return 'bg-secondary text-white' // Grün (Secondary)
  }
  if (lowerIntensitaet.includes('mittel')) {
    return 'bg-warning text-dark' // Gelb (Warning)
  }
  if (lowerIntensitaet.includes('experte') || lowerIntensitaet.includes('pro')) {
    return 'bg-danger text-white' // Rot (Danger)
  }
  return 'bg-gray-200 text-gray-text'
}
</script>