<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="fw-bold">🏋️‍♂️ Fitness Dashboard</h1>
      <p class="text-secondary">Behalte deine Workouts, Pläne und Fortschritte im Blick</p>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <router-link to="/workouts" class="text-decoration-none">
          <div class="card bg-dark text-light shadow-lg border-0 h-100 text-center p-4 hover-card">
            <i class="bi bi-activity display-4 text-primary mb-3"></i>
            <h4 class="fw-semibold mb-2">Workouts</h4>
            <p class="text-secondary">Verfolge deine Trainings und Leistungen.</p>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link to="/plans" class="text-decoration-none">
          <div
            class="card bg-dark text-light shadow-lg border-0 h-100 text-center p-4 hover-card"
          >
            <i class="bi bi-calendar-check display-4 text-success mb-3"></i>
            <h4 class="fw-semibold mb-2">Trainingspläne</h4>
            <p class="text-secondary">Organisiere deine Ziele und Wochenpläne.</p>
          </div>
        </router-link>
      </div>


      <div class="col-md-4">
        <router-link to="/exercises" class="text-decoration-none">
          <div
            class="card bg-dark text-light shadow-lg border-0 h-100 text-center p-4 hover-card"
          >
            <i class="bi bi-bar-chart-line display-4 text-danger mb-3"></i>
            <h4 class="fw-semibold mb-2">Übungen</h4>
            <p class="text-secondary">Durchsuche und verwalte deine Übungen.</p>
          </div>
        </router-link>
      </div>

    </div>
  </div>
  <div class="mt-5">
    <h4 class="text-white mb-4">Tagesübersicht</h4>
    <div class="row text-center">
      <div class="col-md-3">
        <div class="card bg-dark text-white border-0 p-3">
          <i class="bi bi-fire fs-2 text-danger"></i>
          <h5 class="mt-2">Kalorien</h5>
          <p class="mb-0 fw-semibold">580 kcal</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark text-white border-0 p-3">
          <i class="bi bi-clock-history fs-2 text-info"></i>
          <h5 class="mt-2">Trainingszeit</h5>
          <p class="mb-0 fw-semibold">1h 15min</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark text-white border-0 p-3">
          <i class="bi bi-graph-up fs-2 text-success"></i>
          <h5 class="mt-2">Fortschritt</h5>
          <p class="mb-0 fw-semibold">+8%</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-dark text-white border-0 p-3">
          <i class="bi bi-calendar-event fs-2 text-warning"></i>
          <h5 class="mt-2">Aktive Tage</h5>
          <p class="mb-0 fw-semibold">4/7</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5">
    <h4 class="text-white mb-4">Wochenkalender</h4>
    <div class="table-responsive">
      <table class="table table-dark table-borderless align-middle text-center">
        <thead>
        <tr class="text-uppercase text-muted small">
          <th>Montag</th>
          <th>Dienstag</th>
          <th>Mittwoch</th>
          <th>Donnerstag</th>
          <th>Freitag</th>
          <th>Samstag</th>
          <th>Sonntag</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <i class="bi bi-lightning-charge text-warning fs-4"></i><br>
            <span>Oberkörper</span>
          </td>
          <td>
            <i class="bi bi-bicycle text-info fs-4"></i><br>
            <span>Cardio</span>
          </td>
          <td>
            <i class="bi bi-barbell text-danger fs-4"></i><br>
            <span>Beine</span>
          </td>
          <td>
            <i class="bi bi-person-hearts text-success fs-4"></i><br>
            <span>Core</span>
          </td>
          <td>
            <i class="bi bi-activity text-primary fs-4"></i><br>
            <span>Ganzkörper</span>
          </td>
          <td>
            <i class="bi bi-tree text-success fs-4"></i><br>
            <span>Stretching</span>
          </td>
          <td>
            <i class="bi bi-cup-hot text-muted fs-4"></i><br>
            <span>Ruhetag</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script setup lang="ts">
// keine spezielle Logik nötig für die Startseite
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}
table.table-dark td {
  background-color: #1e1e1e;
  border-radius: 10px;
  vertical-align: middle;
  height: 110px;
  transition: transform 0.2s ease;
}
table.table-dark td:hover {
  transform: scale(1.05);
  background-color: #292929;
}

</style>
