import { mount } from '@vue/test-utils'
import WorkoutDetail from '@/components/WorkoutDetail.vue'


//3
const mockWorkout = {
    id: 1,
    name: 'Push Day',
    muskelgruppe: 'Brust',
    dayOfWeek: 'Montag'
}

const mockExercises = [
    { id: 1, name: 'Bankdrücken', saetze: 3, wiederholungen: 10, gewicht: 80 },
    { id: 2, name: 'Schrägbankdrücken', saetze: 4, wiederholungen: 8 }
]

describe('WorkoutDetail.vue', () => {
    it('zeigt Workout-Infos korrekt an', () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: [], loading: false }
        })

        expect(wrapper.text()).toContain('Push Day')
        expect(wrapper.text()).toContain('Brust')
        expect(wrapper.text()).toContain('Montag')
    })

    it('zeigt Ladezustand an', () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: [], loading: true }
        })

        expect(wrapper.text()).toContain('Übungen werden geladen...')
    })

    it('rendert Übungen korrekt', () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: mockExercises, loading: false }
        })

        expect(wrapper.text()).toContain('Bankdrücken')
        expect(wrapper.text()).toContain('10 Wiederholungen × 3 Sätze')
        expect(wrapper.text()).toContain('Gewicht: 80 kg')
    })

    it('zeigt Empty-State wenn keine Übungen vorhanden sind', () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: [], loading: false }
        })

        expect(wrapper.text()).toContain('Noch keine Übungen hinzugefügt')
    })

    it('emittiert back-Event beim Klick auf Zurück', async () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: [], loading: false }
        })

        await wrapper.find('button.btn-outline').trigger('click')
        expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('emittiert add-exercise-Event beim Klick auf +Übung hinzufügen', async () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: [], loading: false }
        })

        await wrapper.find('button.btn-primary').trigger('click')
        expect(wrapper.emitted('add-exercise')).toBeTruthy()
    })

    it('emittiert edit-exercise und delete-exercise bei Buttons', async () => {
        const wrapper = mount(WorkoutDetail, {
            props: { workout: mockWorkout, exercises: mockExercises, loading: false }
        })

        const editBtn = wrapper.find('button.btn-primary.flex')
        await editBtn.trigger('click')
        expect(wrapper.emitted('edit-exercise')).toBeTruthy()

        const deleteBtn = wrapper.find('button.btn-danger')
        await deleteBtn.trigger('click')
        expect(wrapper.emitted('delete-exercise')).toBeTruthy()
    })
})
