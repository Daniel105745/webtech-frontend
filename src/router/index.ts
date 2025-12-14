import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../view/HomeView.vue'
import PlansView from '../view/PlansView.vue'
import WorkoutsView from '../view/WorkoutsView.vue'
import ExternalExercisesView from '../view/ExternalExercisesView.vue' // <-- neu
import HistoryView from '@/view/HistoryView.vue'
import { authGuard } from "@auth0/auth0-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Home
    { path: '/', name: 'home', component: HomeView },

    // Trainingspläne
    { path: '/plans', name: 'plans', component: PlansView },
    {
      path: '/plans/:id',
      name: 'plan-detail',
      component: () => import('../view/PlanDetailView.vue'),
      props: true,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,

    },

    // Workouts
    { path: '/workouts', name: 'workouts', component: WorkoutsView },
    {
      path: '/workouts/:id',
      name: 'workout-detail',
      component: () => import('../view/WorkoutDetailView.vue'),
      props: true,
    },

    // **External Exercises statt Exercises**
    {
      path: '/external-exercises',
      name: 'external-exercises',
      component: ExternalExercisesView,
    },



    ],
})

export default router
