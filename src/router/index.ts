import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../view/HomeView.vue";
import PlansView from "../view/PlansView.vue";
import ExerciseView from "../view/ExerciseView.vue";
import WorkoutsView from "../view/WorkoutsView.vue";
const routes = [
  { path: '/', component: HomeView },
  { path: '/plans', component: PlansView },
  {path: '/exercise', component: ExerciseView},
  {path: '/workouts', component: WorkoutsView}

]
export default createRouter({
  history: createWebHistory(),
  routes
})
