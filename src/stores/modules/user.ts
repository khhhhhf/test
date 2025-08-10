import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getuserinfo } from '@/api/user'

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
    const user = ref()
    const getuser = async () => {
      const res = await getuserinfo()
      user.value = res.data
    }
    return { token, settoken, removetoken, getuser, user }
  },
  {
    persist: true
  }
)
