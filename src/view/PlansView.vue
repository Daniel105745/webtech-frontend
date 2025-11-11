<template>
  <div class="min-h-screen bg-graybg text-dark px-10 py-8">
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

    <!-- Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.id"
        @click="goToDetail(plan.id)"
        class="card p-6 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 active:scale-[0.98]"
      >
        <div>
          <h2 class="text-xl font-semibold mb-1 hover:text-primary transition">
            {{ plan.name }}
          </h2>
          <p class="text-gray-500 text-sm mb-4">{{ plan.zielmuskeln }}</p>

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
        <div
          class="border-t border-gray-border mt-3 pt-3 flex justify-between items-center"
          @click.stop
        >
          <button
            @click="editPlan(plan)"
            class="flex items-center gap-1 text-sm text-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-all active:scale-95"
          >
            <i class="bi bi-pencil"></i>
            Bearbeiten
          </button>

          <button
            @click="deletePlan(plan.id)"
            class="flex items-center gap-1 text-sm text-danger bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-all active:scale-95"
          >
            <i class="bi bi-trash"></i>
            Löschen
          </button>
        </div>
      </div>
    </section>

    <!-- Edit-Modal -->
    <div v-if="editingPlan" class="modal-overlay">
      <div class="modal w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingPlan.id ? "Plan bearbeiten" : "Neuen Plan erstellen" }}
        </h2>

        <div class="space-y-3">
          <input
            v-model="editingPlan.name"
            placeholder="Name"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <input
            v-model="editingPlan.dauer"
            placeholder="Dauer"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <input
            v-model="editingPlan.intensitaet"
            placeholder="Intensität"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <input
            v-model="editingPlan.zielmuskeln"
            placeholder="Zielmuskeln"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="editingPlan = null" class="btn btn-outline">
            Abbrechen
          </button>
          <button @click="saveEdit" class="btn btn-primary">
            {{ editingPlan.id ? "Speichern" : "Erstellen" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type UnwrapRef } from "vue";
import { useRouter } from "vue-router";

interface Plan {
  id?: number;
  name: string;
  dauer: string;
  intensitaet: string;
  zielmuskeln: string;
}

const plans = ref<Plan[]>([]);
const router = useRouter();
const editingPlan = ref<Plan | null>(null);

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://webtech-backend.onrender.com";

onMounted(loadPlans);

async function loadPlans() {
  const res = await fetch(`${API_BASE}/plans`);
  plans.value = await res.json();
}

function createPlan() {
  // Öffne Modal mit leeren Feldern statt sofort zu erstellen
  editingPlan.value = {
    name: "",
    dauer: "",
    intensitaet: "",
    zielmuskeln: "",
  };
}

async function deletePlan(id: UnwrapRef<Plan["id"]> | undefined) {
  if (!confirm("Diesen Plan wirklich löschen?")) return;
  try {
    const res = await fetch(`${API_BASE}/plans/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      alert(`Fehler beim Löschen: ${res.status} - ${text}`);
      return;
    }
    await loadPlans();
  } catch (err) {
    console.error(err);
    alert('Fehler beim Löschen');
  }
}

function goToDetail(id: UnwrapRef<Plan["id"]> | undefined) {
  router.push(`/plans/${id}`);
}

function editPlan(plan: Plan) {
  editingPlan.value = { ...plan };
}

async function saveEdit() {
  if (!editingPlan.value) return;

  // Einfache Validierung
  if (!editingPlan.value.name || editingPlan.value.name.trim().length === 0) {
    alert('Bitte einen Namen für den Plan angeben.');
    return;
  }

  try {
    // Wenn Objekt eine id hat -> update (PUT), sonst neu anlegen (POST)
    if (editingPlan.value.id) {
      const res = await fetch(`${API_BASE}/plans/${editingPlan.value.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan.value),
      });
      if (!res.ok) {
        const text = await res.text();
        alert(`Fehler beim Speichern: ${res.status} - ${text}`);
        return;
      }
    } else {
      const res = await fetch(`${API_BASE}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan.value),
      });
      if (!res.ok) {
        const text = await res.text();
        alert(`Fehler beim Erstellen: ${res.status} - ${text}`);
        return;
      }
    }

    editingPlan.value = null;
    await loadPlans();
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    alert('Fehler beim Speichern des Plans. Bitte Konsole überprüfen.');
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.25s ease-out;
}
</style>
