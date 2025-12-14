import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// Hier verbinden wir deine Auth0 App (Daten aus deinem Screenshot)
app.use(
  createAuth0({
    domain: "dev-ys5tf6nc8y18kidz.us.auth0.com",
    clientId: "UAWhhO9Ejk0wFrHRwYreZJeOUCMSabR5",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: "https://fitness-tracker-api" // <--- NEU: Das ist der Schlüssel zum JWT!
    }
  })
)

app.use(router)
app.mount('#app')