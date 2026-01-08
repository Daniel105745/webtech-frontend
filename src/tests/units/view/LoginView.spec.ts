import { mount } from '@vue/test-utils'
import LoginView from '@/view/LoginView.vue'
// 5
//  Mock Auth0
const loginMock = vi.fn()
vi.mock('@auth0/auth0-vue', () => ({
    useAuth0: () => ({ loginWithRedirect: loginMock })
}))

describe('LoginView.vue', () => {
    beforeEach(() => {
        loginMock.mockReset()
    })

    it('rendert Titel und Beschreibung', () => {
        const wrapper = mount(LoginView)
        expect(wrapper.text()).toContain('Fitness Tracker')
        expect(wrapper.text()).toContain('Erreiche deine Ziele')
    })

    it('zeigt Login-Button', () => {
        const wrapper = mount(LoginView)
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Jetzt starten / Login')
    })

    it('ruft loginWithRedirect auf, wenn Button geklickt wird', async () => {
        const wrapper = mount(LoginView)
        await wrapper.find('button').trigger('click')
        expect(loginMock).toHaveBeenCalled()
    })


})
