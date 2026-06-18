interface User {
  id: number
  email: string
  nombre: string
  rol: 'ADMIN' | 'USUARIO'
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const isLoading = useState<boolean>('auth-loading', () => false)
  
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.rol === 'ADMIN')
  
  const fetchUser = async () => {
    try {
      const { data } = await useFetch('/api/auth/me')
      if (data.value?.user) {
        user.value = data.value.user
      }
    } catch {
      user.value = null
    }
  }
  
  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      if (response.success) {
        user.value = response.user
        return { success: true }
      }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Error al iniciar sesión' }
    } finally {
      isLoading.value = false
    }
  }
  
  const register = async (email: string, password: string, nombre: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, nombre }
      })
      if (response.success) {
        user.value = response.user
        return { success: true }
      }
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Error al registrarse' }
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/')
  }
  
  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    isLoading: readonly(isLoading),
    fetchUser,
    login,
    register,
    logout
  }
}
