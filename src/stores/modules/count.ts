import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', () => {
  const num = ref(1)
  const addnum = () => {
    num.value++
  }

  return { num, addnum }
})
