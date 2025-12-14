<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0d192b] text-white p-4">

    <div class="text-center max-w-2xl">
      <div class="mb-6 text-6xl">🏋️‍♂️</div>
      <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-red-400 text-transparent bg-clip-text">
        Fitness Tracker
      </h1>
      <p class="text-xl text-gray-400 mb-10">
        Erreiche deine Ziele, verfolge deine Workouts und analysiere deinen Fortschritt.
        Alles an einem Ort.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleLogin"
          class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 text-lg"
        >
          Jetzt starten / Login
        </button>
      </div>
    </div>

    <div class="mt-20 text-gray-600 text-sm">
      Powered by Vue 3, Spring Boot & Auth0
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

const handleLogin = () => {
  loginWithRedirect()
}
</script>