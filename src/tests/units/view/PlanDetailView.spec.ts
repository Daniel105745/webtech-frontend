
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PlanDetailView from '@/view/PlanDetailView.vue'

// -------------------- Mocks --------------------

// router
const pushMock = vi.fn()
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>()
    return {
        ...actual,
        useRouter: () => ({ push: pushMock }),
        useRoute: () => ({ params: { id: 1 } })
    }
})

// authFetch
const authFetchMock = vi.fn()
vi.mock('@/api', () => ({
    useAuthenticatedFetch: () => ({ authFetch: authFetchMock })
}))

// -------------------- Helper --------------------

function mockLoadPlanAndWorkouts({
                                     planId = 1,
                                     planName = 'Plan A',
                                     workouts = [],
                                     exercises = []
                                 } = {}) {
    // loadPlan
    authFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: planId, name: planName }]
    })
    // loadWorkouts
    authFetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => workouts
    })


    // loadExercises für jedes Workout
    for (let i = 0; i < workouts.length; i++) {
        authFetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => exercises
        })
    }

}

// -------------------- Test Suite --------------------

describe('PlanDetailView.vue', () => {

    beforeEach(() => {
        pushMock.mockReset()
        authFetchMock.mockReset()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.spyOn(window, 'alert').mockImplementation(() => {}) // falls alert verwendet wird
    })

    describe('loadWorkouts()', () => {

        it('lädt Plan und Workouts beim Mount', async () => {
            mockLoadPlanAndWorkouts({
                workouts: [{ id: 10, name: 'Workout A', dayOfWeek: 'Montag', muskelgruppe: 'Brust' }],
                exercises: [{ id: 100, name: 'Übung A' }]
            })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            expect(wrapper.text()).toContain('Plan A')
            expect(wrapper.text()).toContain('Workout A')
        })

        it('zeigt Hinweis, wenn keine Workouts existieren', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            expect(wrapper.text()).toContain('Noch keine Workouts in diesem Plan.')

        })
    })

    describe('Modal öffnen', () => {

        it('öffnet Add-Modal', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('add-workout')
            await flushPromises()

            expect(wrapper.text()).toContain('Workout hinzufügen')
        })

        it('öffnet Edit-Modal', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            const workout = { id: 5, name: 'EditMe', dayOfWeek: 'Montag', muskelgruppe: 'Brust' }
            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('edit-workout', workout)
            await flushPromises()

            expect(wrapper.text()).toContain('Workout bearbeiten')
            expect(
                (wrapper.find('input[placeholder="Workout-Name"]').element as HTMLInputElement).value
            ).toBe('EditMe')
        })
    })

    describe('saveWorkout', () => {

        it('ruft POST auf für neuen Workout', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })
            // saveWorkout POST
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            // reload workouts nach POST
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('add-workout')
            await flushPromises()

            await wrapper.find('input[placeholder="Workout-Name"]').setValue('Neues Workout')
            await wrapper.find('input[placeholder="Tag der Woche"]').setValue('Dienstag')
            await wrapper.find('input[placeholder="Muskelgruppe"]').setValue('Beine')

            const saveButton = wrapper.findAll('button').find(b => b.text().includes('Speichern'))!
            await saveButton.trigger('click')
            await flushPromises()

            expect(authFetchMock).toHaveBeenCalledWith(
                expect.stringMatching(/\/workouts\/plan\/1$/),
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('ruft PUT auf beim Bearbeiten', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })
            // saveWorkout PUT
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            // reload workouts
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            const workout = { id: 7, name: 'Alt', dayOfWeek: 'Mi', muskelgruppe: 'Rücken' }
            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('edit-workout', workout)
            await flushPromises()

            await wrapper.find('input[placeholder="Workout-Name"]').setValue('Neu')
            const saveButton = wrapper.findAll('button').find(b => b.text().includes('Speichern'))!
            await saveButton.trigger('click')
            await flushPromises()

            expect(authFetchMock).toHaveBeenCalledWith(
                expect.stringMatching(/\/workouts\/7$/),
                expect.objectContaining({ method: 'PUT' })
            )
        })
    })

    describe('deleteWorkout', () => {

        it('ruft DELETE auf', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
            authFetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('delete-workout', 9)
            await flushPromises()

            expect(authFetchMock).toHaveBeenCalledWith(
                expect.stringMatching(/\/workouts\/9$/),
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })

    describe('Navigation', () => {

        it('geht zurück mit back event', async () => {
            mockLoadPlanAndWorkouts({ workouts: [] })

            const wrapper = mount(PlanDetailView)
            await flushPromises()

            await wrapper.findComponent({ name: 'PlanDetail' }).vm.$emit('back')
            expect(pushMock).toHaveBeenCalledWith('/plans')
        })
    })
})
