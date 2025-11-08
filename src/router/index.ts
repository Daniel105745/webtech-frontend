import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue";
import PlansView from "../views/PlansView.vue";
const routes = [
  { path: '/', component: HomeView },
  { path: '/', component: PlansView }

]
export default createRouter({
  history: createWebHistory(),
  routes
})
