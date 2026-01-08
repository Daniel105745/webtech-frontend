import { mount } from '@vue/test-utils'
import PlanCard from '@/components/PlanCard.vue'

const mockPlan = {
    id: 1,
    name: 'Muskelaufbau',
    dauer: '6 Wochen',
    intensitaet: 'Hoch',
    trainingsziel: 'Beine',
}

describe('PlanCard.vue', () => {
    it('renders plan info correctly', () => {
        const wrapper = mount(PlanCard, {
            props: { plan: mockPlan },
        })

        expect(wrapper.text()).toContain('Muskelaufbau')
        expect(wrapper.text()).toContain('6 Wochen')
        expect(wrapper.text()).toContain('Hoch')
        expect(wrapper.text()).toContain('Beine')
    })

    it('emits detail event when card clicked', async () => {
        const wrapper = mount(PlanCard, {
            props: { plan: mockPlan },
        })

        await wrapper.trigger('click')
        expect(wrapper.emitted('detail')).toBeTruthy()
        expect(wrapper.emitted('detail')![0]).toEqual([1])
    })

    it('emits edit event when edit button clicked', async () => {
        const wrapper = mount(PlanCard, {
            props: { plan: mockPlan },
        })

        await wrapper.find('button.btn-primary').trigger('click')
        expect(wrapper.emitted('edit')).toBeTruthy()
        expect(wrapper.emitted('edit')![0]).toEqual([mockPlan])
    })

    it('emits delete event when delete button clicked', async () => {
        const wrapper = mount(PlanCard, {
            props: { plan: mockPlan },
        })

        await wrapper.find('button.btn-danger').trigger('click')
        expect(wrapper.emitted('delete')).toBeTruthy()
        expect(wrapper.emitted('delete')![0]).toEqual([1])
    })
})
