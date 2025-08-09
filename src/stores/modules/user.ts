import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const settoken = (value: string): void => {
      token.value = value
    }
    const removetoken = () => {
      token.value = ''
    }

    return { token, settoken, removetoken }
  },
  {
    persist: true
  }
)
