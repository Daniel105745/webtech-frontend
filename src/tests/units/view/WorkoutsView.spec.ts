import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import WorkoutView from '@/view/WorkoutsView.vue'

// -------------------- Mocks --------------------

// router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: pushMock
    })
}))

// authenticated fetch
const authFetchMock = vi.fn()
vi.mock('@/api', () => ({
    useAuthenticatedFetch: () => ({
        authFetch: authFetchMock
    })
}))

// WorkoutPage (child component)
vi.mock('@/components/WorkoutPage.vue', () => ({
    default: {
        template: '<div data-test="workout-page"></div>',
        props: ['workoutId']
    }
}))
describe('WorkoutsView.vue', () => {

    beforeEach(() => {
        authFetchMock.mockReset()
        pushMock.mockReset()
    })

    // ------------------------------------------------
    describe('loadAll()', () => {

        it('lädt Pläne und gruppierte Workouts beim Mounten', async () => {
            authFetchMock
                // load plans
                .mockResolvedValueOnce({
                    json: async () => ([
                        { id: 1, name: 'Plan A' },
                        { id: 2, name: 'Plan B' }
                    ])
                })
                // workouts for plan 1
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ([
                        { id: 10, name: 'Workout 1', dayOfWeek: 'Montag', muskelgruppe: 'Brust' }
                    ])
                })
                // workouts for plan 2 (leer)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => []
                })

            const wrapper = mount(WorkoutView)
            await flushPromises()

            expect(wrapper.text()).toContain('Plan A')
            expect(wrapper.text()).toContain('Workout 1')
            expect(wrapper.text()).not.toContain('Plan B')
        })

        it('zeigt Hinweis an, wenn keine Workouts existieren', async () => {
            authFetchMock
                .mockResolvedValueOnce({
                    json: async () => ([
                        { id: 1, name: 'Plan A' }
                    ])
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => []
                })

            const wrapper = mount(WorkoutView)
            await flushPromises()

            expect(wrapper.text()).toContain('Noch keine Workouts gefunden')
        })
    })

    // ------------------------------------------------
    describe('loading state', () => {

        it('zeigt Ladeanzeige während des Ladens', async () => {
            authFetchMock.mockResolvedValueOnce(
                new Promise(() => {}) // Promise bleibt pending
            )

            const wrapper = mount(WorkoutView)

            expect(wrapper.text()).toContain('Lade Workouts...')
        })
    })

    // ------------------------------------------------
    describe('startSession()', () => {

        it('öffnet WorkoutPage nach Klick auf Starten', async () => {
            authFetchMock
                .mockResolvedValueOnce({
                    json: async () => ([
                        { id: 1, name: 'Plan A' }
                    ])
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ([
                        { id: 99, name: 'Workout X', dayOfWeek: 'Freitag', muskelgruppe: 'Beine' }
                    ])
                })

            const wrapper = mount(WorkoutView)
            await flushPromises()

            await wrapper.find('button.btn-primary').trigger('click')
            await flushPromises()

            expect(wrapper.find('[data-test="workout-page"]').exists()).toBe(true)
        })
    })

    // ------------------------------------------------
    describe('Navigation', () => {

        it('navigiert zu /plans über "Verwalten"-Button', async () => {
            authFetchMock
                .mockResolvedValueOnce({
                    json: async () => []
                })

            const wrapper = mount(WorkoutView)
            await flushPromises()

            await wrapper.find('header button.btn-outline').trigger('click')

            expect(pushMock).toHaveBeenCalledWith('/plans')
        })

        it('navigiert zu /plans über "Trainingsplan erstellen"', async () => {
            authFetchMock
                .mockResolvedValueOnce({
                    json: async () => ([
                        { id: 1, name: 'Plan A' }
                    ])
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => []
                })

            const wrapper = mount(WorkoutView)
            await flushPromises()

            await wrapper.find('button.btn-primary').trigger('click')

            expect(pushMock).toHaveBeenCalledWith('/plans')
        })
    })
})
