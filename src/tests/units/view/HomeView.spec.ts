import { mount, flushPromises } from '@vue/test-utils'
import HomeView from '@/view/HomeView.vue'

// 👉 Mock Chart-Komponenten nur für diesen Test
vi.mock('vue-chartjs', () => ({
    Line: { template: '<div>LineChartMock</div>' },
    Doughnut: { template: '<div>DoughnutChartMock</div>' }
}))

// 👉 Mock Auth0
vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => ({ user: { name: 'TestUser' } })
}))

// 👉 Mock API
const mockFetch = vi.fn()
vi.mock('@/api', () => ({
    useAuthenticatedFetch: () => ({ authFetch: mockFetch })
}))

describe('HomeView.vue', () => {
    beforeEach(() => {
        mockFetch.mockReset()
    })

    it('zeigt den Usernamen im Header', async () => {
        // Mock alle drei API-Calls
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ calories: 0, workouts: 0, minutes: 0 }) })
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] })

        const wrapper = mount(HomeView)
        await flushPromises()

        expect(wrapper.text()).toContain('Hey, TestUser 👋')
    })

    it('lädt Dashboard-Daten und zeigt Stat Cards', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ calories: 500, workouts: 3, minutes: 120 }) })
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [{ startTime: new Date().toISOString(), minutes: 30 }] })
        mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, trainingsziel: 'Muskelaufbau' }] })

        const wrapper = mount(HomeView)
        await flushPromises()

        expect(wrapper.text()).toContain('500 kcal')
        expect(wrapper.text()).toContain('3 Sessions')
        expect(wrapper.text()).toContain('120 Min')
    })


    it('loggt Fehler wenn API nicht ok', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
        mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
        mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

        mount(HomeView)
        await flushPromises()

        expect(errorSpy).toHaveBeenCalled()
        errorSpy.mockRestore()
    })
})
