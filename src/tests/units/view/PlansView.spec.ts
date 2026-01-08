import { mount, flushPromises } from '@vue/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import PlansView from '@/view/PlansView.vue'

// ---------- Mocks ----------
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: pushMock
    })
}))

const authFetchMock = vi.fn()
vi.mock('@/api', () => ({
    useAuthenticatedFetch: () => ({
        authFetch: authFetchMock
    })
}))

// ---------- Tests ----------
describe('PlansView.vue', () => {

    beforeEach(() => {
        authFetchMock.mockReset()
        pushMock.mockReset()
    })

    describe('loadPlans()', () => {
        it('lädt Pläne beim Mounten', async () => {
            authFetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => ([
                    { id: 1, name: 'Plan A', dauer: '30', intensitaet: 'Mittel', trainingsziel: 'Muskelaufbau' }
                ])
            })

            const wrapper = mount(PlansView)
            await flushPromises()

            expect(wrapper.text()).toContain('Plan A')
        })
    })

    describe('createPlan()', () => {
        it('öffnet Modal zum Erstellen eines neuen Plans', async () => {
            authFetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => []
            })

            const wrapper = mount(PlansView)
            await flushPromises()

            await wrapper.find('header button.btn-primary').trigger('click')

            expect(wrapper.find('.modal').exists()).toBe(true)
            expect(wrapper.text()).toContain('Neuen Plan erstellen')
        })
    })

    // saveEdit()
    describe('saveEdit()', () => {
    it('verwendet POST für neuen Plan', async () => {
        authFetchMock
            // loadPlans beim Mount
            .mockResolvedValueOnce({
                ok: true,
                json: async () => []
            })
            // saveEdit (POST)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            })
            // loadPlans nach erfolgreichem Speichern
            .mockResolvedValueOnce({
                ok: true,
                json: async () => []
            })

        const wrapper = mount(PlansView)
        await flushPromises()

        await wrapper.find('header button.btn-primary').trigger('click')
        await wrapper.find('input[placeholder="Name"]').setValue('Neuer Plan')
        await wrapper.find('select').setValue('Muskelaufbau')
        await wrapper.find('.modal button.btn-primary').trigger('click')
        await flushPromises()

        expect(authFetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/plans'),
            expect.objectContaining({ method: 'POST' })
        )
    })
    })



    describe('deletePlan()', () => {
        it('löscht einen Plan nach Bestätigung', async () => {
            vi.spyOn(window, 'confirm').mockReturnValue(true)

            authFetchMock
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ([{
                        id: 9,
                        name: 'Delete',
                        dauer: '30',
                        intensitaet: 'Mittel',
                        trainingsziel: 'Muskelaufbau'
                    }])
                })
                .mockResolvedValueOnce({ ok: true }) // DELETE
                .mockResolvedValueOnce({ ok: true, json: async () => [] }) // reload

            const wrapper = mount(PlansView)
            await flushPromises()

            await wrapper.find('button.btn-danger').trigger('click')
            await flushPromises()

            expect(authFetchMock).toHaveBeenCalledWith(
                expect.stringContaining('/plans/9'),
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })

    describe('goToDetail()', () => {
        it('navigiert zur Detailseite', async () => {
            authFetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => ([{
                    id: 3,
                    name: 'Detail',
                    dauer: '30',
                    intensitaet: 'Mittel',
                    trainingsziel: 'Muskelaufbau'
                }])
            })

            const wrapper = mount(PlansView)
            await flushPromises()

            await wrapper.find('.card').trigger('click')

            expect(pushMock).toHaveBeenCalledWith('/plans/3')
        })

})
})
