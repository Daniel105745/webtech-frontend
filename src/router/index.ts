import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlansView from '../views/PlansView.vue'
import WorkoutsView from '../views/WorkoutsView.vue'
import ExercisesView from '../views/ExercisesView.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/plans', component: PlansView },
  { path: '/workouts', component: WorkoutsView },
  { path: '/exercises', component: ExercisesView }
]


export default createRouter({
  history: createWebHistory(),
  routes
})
