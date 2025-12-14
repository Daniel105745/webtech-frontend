import { useAuth0 } from '@auth0/auth0-vue'

// WICHTIG: Das "async" hier oben muss weg!
export function useAuthenticatedFetch() {
  const { getAccessTokenSilently } = useAuth0()

  const authFetch = async (url: string, options: RequestInit = {}) => {
    try {
      // Hier warten wir erst auf den Token, wenn die Anfrage wirklich startet
      const token = await getAccessTokenSilently()

      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await fetch(url, { ...options, headers })

      if (response.status === 401) {
        console.error("Nicht autorisiert! Token ungültig.")
      }

      return response
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  return { authFetch }
}