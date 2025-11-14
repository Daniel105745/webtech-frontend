<template>


    <!-- Header -->
    <header class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-3xl font-bold mb-1">Trainingspläne</h1>
        <p class="text-gray-500 text-sm">
          Erstelle, bearbeite und verwalte deine Trainingspläne.
        </p>
      </div>

      <button @click="createPlan" class="btn btn-primary">+ Neuer Plan</button>
    </header>

    <!-- Grid mit allen Plänen -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.id"
        @click="goToDetail(plan.id)"
        class="card p-6 flex flex-col justify-between cursor-pointer hover:-translate-y-1 active:scale-[0.98]"
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

        <!-- Buttons -->
        <div class="border-t border-gray-border mt-3 pt-3 flex justify-between items-center" @click.stop>
          <button @click="editPlan(plan)" class="btn btn-primary flex items-center gap-2">
            <i class="bi bi-pencil"></i> Bearbeiten
          </button>

          <button @click="deletePlan(plan.id)" class="btn text-white bg-[#ef4444] hover:bg-[#dc2626]">
            <i class="bi bi-trash"></i> Löschen
          </button>
        </div>
      </div>
    </section>

    <!-- Modal (Plan bearbeiten / erstellen) -->
    <div v-if="editingPlan" class="modal-overlay">
      <div class="modal w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingPlan.id ? 'Plan bearbeiten' : 'Neuen Plan erstellen' }}
        </h2>

        <div class="space-y-4">
          <input
            v-model="editingPlan.name"
            placeholder="Name"
            class="w-full border border-gray-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
          <input
            v-model="editingPlan.dauer"
            placeholder="Dauer"
            class="w-full border border-gray-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
          <input
            v-model="editingPlan.intensitaet"
            placeholder="Intensität"
            class="w-full border border-gray-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />

          <!-- Trainingsziel -->
          <div>
            <label class="block text-sm font-medium mb-1">Trainingsziel</label>
            <div class="relative">
              <select
                v-model="editingPlan.trainingsziel"
                required
                class="w-full appearance-none border border-gray-border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary outline-none transition"
              >
                <option disabled value="">Trainingsziel auswählen</option>
                <option value="Muskelaufbau">Muskelaufbau</option>
                <option value="Kraftzuwachs">Kraftzuwachs</option>
                <option value="Ausdauer">Ausdauer</option>
              </select>

              <svg
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
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
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="editingPlan = null" class="btn btn-outline">Abbrechen</button>
          <button @click="saveEdit" class="btn btn-primary">
            {{ editingPlan.id ? 'Speichern' : 'Erstellen' }}
          </button>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, type UnwrapRef } from 'vue'
import { useRouter } from 'vue-router'

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

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8080'
    : 'https://webtech-backend-rqq7.onrender.com'

onMounted(loadPlans)

/* ---------- PLÄNE LADEN ---------- */
async function loadPlans() {
  const res = await fetch(`${API_BASE}/plans`)
  plans.value = await res.json()
}

/* ---------- PLAN ERSTELLEN ---------- */
function createPlan() {
  editingPlan.value = {
    name: '',
    dauer: '',
    intensitaet: '',
    trainingsziel: '',
  }
}

/* ---------- PLAN BEARBEITEN ---------- */
function editPlan(plan: Plan) {
  editingPlan.value = { ...plan }
}

/* ---------- PLAN SPEICHERN ---------- */
async function saveEdit() {
  if (!editingPlan.value) return
  if (!editingPlan.value.name || !editingPlan.value.trainingsziel) {
    alert('Bitte alle Pflichtfelder ausfüllen.')
    return
  }

  const method = editingPlan.value.id ? 'PUT' : 'POST'
  const url = editingPlan.value.id
    ? `${API_BASE}/plans/${editingPlan.value.id}`
    : `${API_BASE}/plans`

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editingPlan.value),
  })

  if (!res.ok) {
    const text = await res.text()
    alert(`Fehler beim Speichern: ${res.status} - ${text}`)
    return
  }

  editingPlan.value = null
  await loadPlans()
}

/* ---------- PLAN LÖSCHEN ---------- */
async function deletePlan(id: UnwrapRef<Plan['id']> | undefined) {
  if (!confirm('Diesen Plan wirklich löschen?')) return
  await fetch(`${API_BASE}/plans/${id}`, { method: 'DELETE' })
  await loadPlans()
}

/* ---------- DETAILANSICHT ---------- */
function goToDetail(id: UnwrapRef<Plan['id']> | undefined) {
  router.push(`/plans/${id}`)
}
</script>
