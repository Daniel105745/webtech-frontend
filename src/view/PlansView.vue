<template>
  <header class="flex items-center justify-between mb-10">
    <div>
      <h1 class="text-3xl font-bold mb-1">Trainingspläne</h1>
      <p class="text-gray-400 text-sm">
        Erstelle, bearbeite und verwalte deine Trainingspläne.
      </p>
    </div>
    <button @click="createPlan" class="btn btn-primary">+ Neuer Plan</button>
  </header>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="plan in plans"
      :key="plan.id"
      @click="goToDetail(plan.id)"
      class="card p-6 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <h2 class="text-xl font-bold mb-1 text-gray-100 group-hover:text-primary transition-colors">
          {{ plan.name }}
        </h2>
        <p class="text-gray-500 text-sm mb-4">
          {{ plan.trainingsziel || '—' }}
        </p>

        <div class="flex justify-between text-sm mb-2 text-gray-400">
          <span>Dauer</span>
          <span class="font-medium text-gray-200">{{ plan.dauer }}</span>
        </div>

        <div class="flex justify-between text-sm mb-4 text-gray-400">
          <span>Intensität</span>
          <span class="font-medium text-blue-400">{{ plan.intensitaet }}</span>
        </div>
      </div>

      <div class="border-t border-white/10 mt-3 pt-3 flex justify-between items-center" @click.stop>
        <button @click="editPlan(plan)" class="btn btn-primary text-xs py-2 px-3">
          <i class="bi bi-pencil"></i> Bearbeiten
        </button>

        <button @click="deletePlan(plan.id)" class="btn btn-danger text-xs py-2 px-3">
          <i class="bi bi-trash"></i> Löschen
        </button>
      </div>
    </div>
  </section>

  <div v-if="editingPlan" class="modal-overlay">
    <div class="modal">
      <h2 class="text-xl font-bold mb-4 text-white">
        {{ editingPlan.id ? 'Plan bearbeiten' : 'Neuen Plan erstellen' }}
      </h2>

      <div class="space-y-4">
        <input v-model="editingPlan.name" placeholder="Name" />
        <input v-model="editingPlan.dauer" placeholder="Dauer" />
        <input v-model="editingPlan.intensitaet" placeholder="Intensität" />

        <div class="relative">
          <select v-model="editingPlan.trainingsziel" required>
            <option disabled value="">Trainingsziel auswählen</option>
            <option value="Muskelaufbau">Muskelaufbau</option>
            <option value="Kraftzuwachs">Kraftzuwachs</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8">
        <button @click="editingPlan = null" class="btn btn-outline">Abbrechen</button>
        <button @click="saveEdit" class="btn btn-primary">Speichern</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type UnwrapRef } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticatedFetch } from '@/api'

interface Plan {
  id?: number
  name: string
  dauer: string
  intensitaet: string
  trainingsziel: string
}

const plans = ref<Plan[]>([])
const router = useRouter()
const editingPlan = ref<Plan | null>(null)
const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:8080' : 'https://webtech-backend-rqq7.onrender.com'
const { authFetch } = useAuthenticatedFetch()

onMounted(loadPlans)

async function loadPlans() {
  const res = await authFetch(`${API_BASE}/plans`)
  if (res.ok) plans.value = await res.json()
}

function createPlan() {
  editingPlan.value = { name: '', dauer: '', intensitaet: '', trainingsziel: '' }
}
function editPlan(plan: Plan) { editingPlan.value = { ...plan } }

async function saveEdit() {
  if (!editingPlan.value) return
  if (!editingPlan.value.name || !editingPlan.value.trainingsziel) { alert('Bitte Pflichtfelder füllen'); return }
  const method = editingPlan.value.id ? 'PUT' : 'POST'
  const url = editingPlan.value.id ? `${API_BASE}/plans/${editingPlan.value.id}` : `${API_BASE}/plans`
  const res = await authFetch(url, { method, body: JSON.stringify(editingPlan.value) })
  if (res.ok) { editingPlan.value = null; loadPlans() }
}

async function deletePlan(id: UnwrapRef<Plan['id']> | undefined) {
  if (!confirm('Wirklich löschen?')) return
  await authFetch(`${API_BASE}/plans/${id}`, { method: 'DELETE' })
  await loadPlans()
}

function goToDetail(id: UnwrapRef<Plan['id']> | undefined) {
  router.push(`/plans/${id}`)
}
</script>