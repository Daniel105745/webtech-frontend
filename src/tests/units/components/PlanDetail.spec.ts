import { mount } from '@vue/test-utils'
import PlanDetail from '@/components/PlanDetail.vue'
import router from '@/router'

//2

// 👉 Router wird gemockt, damit wir keine echte Navigation ausführen
vi.mock('@/router', () => ({
    default: { push: vi.fn() }
}))

// Beispiel‑Daten
const mockPlan = {
    id: 1,
    name: 'Muskelaufbau',
    dauer: '6 Wochen',
    intensitaet: 'Hoch',
    zielmuskeln: 'Beine'
}

const mockWorkouts = [
    {
        id: 1,
        name: 'Beintraining',
        muskelgruppe: 'Quadrizeps',
        dayOfWeek: 'Montag',
        exercises: [
            { id: 1, name: 'Kniebeuge', saetze: 3, wiederholungen: 12 },
            { id: 2, name: 'Beinpresse', saetze: 4, wiederholungen: 10 },
            { id: 3, name: 'Ausfallschritte', saetze: 3, wiederholungen: 15 },
            { id: 4, name: 'Wadenheben', saetze: 3, wiederholungen: 20 }
        ]
    }
]

describe('PlanDetail.vue', () => {
    it('zeigt Plan‑Informationen korrekt an', () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: [], loading: false }
        })

        expect(wrapper.text()).toContain('Muskelaufbau')
        expect(wrapper.text()).toContain('6 Wochen')
        expect(wrapper.text()).toContain('Hoch')
        expect(wrapper.text()).toContain('Beine')
    })

    it('zeigt Ladezustand an', () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: [], loading: true }
        })

        expect(wrapper.text()).toContain('Lade...')
    })

    it('rendert Workouts und Übungen korrekt', () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: mockWorkouts, loading: false }
        })

        expect(wrapper.text()).toContain('Beintraining')
        expect(wrapper.text()).toContain('Kniebeuge')
        expect(wrapper.text()).toContain('+ 1 weitere') // weil 4 Übungen vorhanden sind
    })

    it('emittiert back‑Event beim Klick auf Zurück', async () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: [], loading: false }
        })

        await wrapper.find('button.btn-outline').trigger('click')
        expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('emittiert add‑workout‑Event beim Klick auf +Workout', async () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: [], loading: false }
        })

        await wrapper.find('button.btn-primary').trigger('click')
        expect(wrapper.emitted('add-workout')).toBeTruthy()
    })

    it('emittiert edit‑workout und delete‑workout bei Buttons', async () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: mockWorkouts, loading: false }
        })

        const editBtn = wrapper.find('button.btn-primary.text-xs')
        await editBtn.trigger('click')
        expect(wrapper.emitted('edit-workout')).toBeTruthy()

        const deleteBtn = wrapper.find('button.btn-danger.text-xs')
        await deleteBtn.trigger('click')
        expect(wrapper.emitted('delete-workout')).toBeTruthy()
    })

    it('navigiert zu Workout‑Detail beim Klick auf Karte', async () => {
        const wrapper = mount(PlanDetail, {
            props: { plan: mockPlan, workouts: mockWorkouts, loading: false }
        })

        await wrapper.find('.card.cursor-pointer').trigger('click')
        expect(router.push).toHaveBeenCalledWith('/workouts/1')
    })
})
