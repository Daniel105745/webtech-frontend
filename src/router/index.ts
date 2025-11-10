import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../view/HomeView.vue'
import PlansView from '../view/PlansView.vue'
import WorkoutsView from '../view/WorkoutsView.vue'
import ExerciseView from '../view/ExerciseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Startseite
    { path: '/', name: 'home', component: HomeView },

    // Trainingspläne
    { path: '/plans', name: 'plans', component: PlansView },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../view/PlanDetailView.vue'),
      props: true,
    },

    // Workouts (Liste)
    { path: '/workouts', name: 'workouts', component: WorkoutsView },

    // Workout-Detail mit Exercises
    {
      path: '/workouts/:id',
      name: 'workout-detail',
      component: () => import('../view/WorkoutDetailView.vue'),
      props: true,
    },

    // Übungen (nur wenn du eine eigenständige Übersicht willst)
    { path: '/exercises', name: 'exercises', component: ExerciseView },
  ],
})

export default router
