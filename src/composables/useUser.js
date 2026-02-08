import { ref } from 'vue'

const currentUser = ref(localStorage.getItem('expense_user') || null)

export function useUser() {
    function login(username) {
        if (!username) return
        currentUser.value = username.trim()
        localStorage.setItem('expense_user', currentUser.value)
    }

    function logout() {
        currentUser.value = null
        localStorage.removeItem('expense_user')
    }

    return {
        currentUser,
        login,
        logout
    }
}
